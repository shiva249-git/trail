const body = document.body;
const darkModeToggle = document.getElementById('darkModeToggle');
const generateBtn = document.getElementById('generateBtn');
const quizCard = document.getElementById('quizCard');
const questionTextEl = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const timeLeftEl = document.getElementById('timeLeft');
const progressBar = document.getElementById('progressBar');
const nextBtn = document.getElementById('nextBtn');
const resultScreen = document.getElementById('resultScreen');
const topicInput = document.getElementById('topicInput');
const difficultySelect = document.getElementById('difficultySelect');
const numQuestionsInput = document.getElementById('numQuestionsInput');

const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

let quizData = [];
let currentIndex = 0;
let selectedAnswer = null;
let timer = null;
const timePerQuestion = 15;

// Dark Mode Toggle
darkModeToggle.onclick = () => {
  body.classList.toggle('dark');

// Generate Quiz button click
generateBtn.onclick = async () => {
  const topic = topicInput.value.trim() || "General Knowledge";

  const difficulty = difficultySelect.value;
  const numQuestions = parseInt(numQuestionsInput.value) || 5;


  quizCard.style.display = 'none';
  resultScreen.style.display = 'none';


  questionTextEl.textContent = 'Generating quiz...';
  optionsContainer.innerHTML = '';


  try {
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ topic, difficulty, num_questions: numQuestions })

    });

    const data = await res.json();


    if (data.quiz && data.quiz.length > 0) {

      quizData = data.quiz;

      currentIndex = 0;
      showQuestion();

    } else {

      questionTextEl.textContent = 'Failed to generate quiz.';
    }
  } catch (error) {

    questionTextEl.textContent = 'Error generating quiz.';
    console.error(error);
  }
};


// Next Button click
nextBtn.onclick = () => {

  if (!selectedAnswer) {
    alert('Please select an answer!');
    return;
  }

  // Save user's answer
  quizData[currentIndex].userAnswer = selectedAnswer;
  currentIndex++;
  showQuestion();

};

// Show a question with options

function showQuestion() {
  if (currentIndex >= quizData.length) {

    showResults();
    return;

  }

  resetState();
  quizCard.style.display = 'block';


  const q = quizData[currentIndex];
  questionTextEl.textContent = `Q${currentIndex + 1}: ${q.question}`;

  optionsContainer.innerHTML = '';


  for (let key in q.options) {
    const div = document.createElement('div');
    div.textContent = `${key}. ${q.options[key]}`;
    div.classList.add('option');

    div.onclick = () => {
      if (selectedAnswer) return; // prevent multiple selections
      Array.from(optionsContainer.children).forEach(el => el.classList.remove('selected'));

      selectedAnswer = key;
      div.classList.add('selected');

      clearInterval(timer);
      showCorrectAnswer();

      nextBtn.disabled = false;
    };

    optionsContainer.appendChild(div);
  }

  progressBar.style.width = `${(currentIndex / quizData.length) * 100}%`;


  startTimer();
}

// Start timer for question

function startTimer() {
  let timeLeft = timePerQuestion;
  timeLeftEl.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;

    timeLeftEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showCorrectAnswer();

      nextBtn.disabled = false;
    }
  }, 1000);
}

// Reset UI state for new question

function resetState() {
  selectedAnswer = null;
  Array.from(optionsContainer.children).forEach(el => {
    el.classList.remove('selected', 'correct', 'incorrect');
  });
  nextBtn.disabled = true;
  clearInterval(timer);
  timeLeftEl.textContent = '--';
}

// Highlight correct and incorrect answers, play sounds

function showCorrectAnswer() {
  const q = quizData[currentIndex];

  Array.from(optionsContainer.children).forEach(optEl => {
    const letter = optEl.textContent[0];

    optEl.onclick = null; // disable clicking after answer
    if (letter === q.correct_answer) {
      optEl.classList.add('correct');

      correctSound.play();

    } else if (letter === selectedAnswer && selectedAnswer !== q.correct_answer) {

      optEl.classList.add('incorrect');

      wrongSound.play();

    }
  });

}


// Show final results and restart option
function showResults() {

  let score = 0;

  quizData.forEach(q => {
    if (q.userAnswer === q.correct_answer) score++;
  });

  quizCard.style.display = 'none';
  resultScreen.style.display = 'block';
  resultScreen.innerHTML = `
    <h2>Your Score: ${score} / ${quizData.length}</h2>
    <button id="restartBtn">Restart Quiz</button>
  `;

  document.getElementById('restartBtn').onclick = () => {

    resultScreen.style.display = 'none';
    currentIndex = 0;
    showQuestion();
  };

}

