from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

load_dotenv()

# Replace with your OpenAI API key
openai_api_key = os.getenv("OPENAI_API_KEY")


client = OpenAI(api_key=openai_api_key)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/quiz", methods=["POST"])
def generate_quiz():
    data = request.get_json()
    topic = data.get("topic", "General Knowledge")
    difficulty = data.get("difficulty", "Medium")
    num_questions = data.get("num_questions", 5)

    prompt = f"""
    Generate {num_questions} SSC CGL practice questions on the topic '{topic}', difficulty '{difficulty}'.
    Each question should have:
    - question text
    - 4 options labeled A, B, C, D
    - correct_answer as a single letter (A/B/C/D)
    - explanation

    Return only valid JSON in this format:
    [
      {{
        "question": "...",
        "options": {{
          "A": "...",
          "B": "...",
          "C": "...",
          "D": "..."
        }},
        "correct_answer": "...",
        "explanation": "..."
      }},
      ...
    ]
    """

    completion = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert SSC CGL quiz generator."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    try:
        quiz_data = eval(completion.choices[0].message.content)
        return jsonify({"quiz": quiz_data})
    except Exception as e:
        return jsonify({"error": str(e)})
