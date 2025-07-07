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

let quizData = [];
let currentIndex = 0;
let selectedAnswer = null;
let timer = null;
const timePerQuestion = 15;

darkModeToggle.onclick = () => {
  body.classList.toggle('dark');
  darkModeToggle.textContent = body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
};

generateBtn.onclick = async () => {
  const topic = topicInput.value || "General Knowledge";
  const difficulty = difficultySelect.value;
  const numQuestions = numQuestionsInput.value || 5;

  quizCard.style.display = 'none';
  resultScreen.style.display = 'none';

  questionTextEl.textContent = 'Generating quiz...';
  optionsContainer.innerHTML = '';
  const res = await fetch('/api/quiz', {

    method: 'POST',
    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify({ topic, difficulty, num_questions: numQuestions })
  });

  const data = await res.json();


  if (data.quiz) {
    quizData = data.quiz;
    currentIndex = 0;

    showQuestion();
  } else {

    questionTextEl.textContent = 'Failed to generate quiz.';
  }

};

nextBtn.onclick = () => {
  if (!selectedAnswer) {

    alert('Please select an answer!');
    return;

  }
  quizData[currentIndex].userAnswer = selectedAnswer;
  currentIndex++;

  showQuestion();
};


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
      if (selectedAnswer) return;
  Array.from(optionsContainer.children).forEach(el => el.classList.remove('selected'));
      selectedAnswer = key;
      div.classList.add('selected');
function resetState() {
      optEl.classList.add('correct');
      document.getElementById('correctSound').play();
    } else if (letter === selectedAnswer && selectedAnswer !== q.correct_answer) {
      optEl.classList.add('incorrect');
      document.getElementById('wrongSound').play();
    }
  });
}

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
  selectedAnswer = null;
      clearInterval(timer);
  clearInterval(timer);
  timeLeftEl.textContent = '--';
}

    if (letter === q.correct_answer) {
function showCorrectAnswer() {
  const q = quizData[currentIndex];
  Array.from(optionsContainer.children).forEach(optEl => {
    const letter = optEl.textContent[0];
    optEl.onclick = null;
  nextBtn.disabled = true;

      showCorrectAnswer();
}
      nextBtn.disabled = false;
    };
  timeLeftEl.textContent = timeLeft;
    timeLeftEl.textContent = timeLeft;
      clearInterval(timer);
    }
  }, 1000);
      showCorrectAnswer();
      nextBtn.disabled = false;
    if (timeLeft <= 0) {
  timer = setInterval(() => {
    timeLeft--;

  let timeLeft = timePerQuestion;
function startTimer() {

  startTimer();
}
  progressBar.style.width = `${(currentIndex / quizData.length) * 100}%`;
    optionsContainer.appendChild(div);
  }

