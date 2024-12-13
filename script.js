document.addEventListener("DOMContentLoaded", () => {
  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options");
  const feedbackElement = document.getElementById("feedback");
  const nextButton = document.getElementById("next-button");
  const replayButton = document.getElementById("replay-button");
  const scoreElement = document.getElementById("score");
  const timerElement = document.getElementById("time-left");
  const timerPhargraph = document.getElementById("timer");

  let currentQuestionIndex = 0;
  let score = 0;
  let questions = [];
  let timer;
  let timeLeft = 10;

  fetch("questions.json")
    .then(response => response.json())
    .then(data => {
      questions = data;
      showQuestion();
    })
    .catch(error => console.error("Error loading questions:", error));
  
  function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionElement.textContent = question.question;
    optionsElement.innerHTML = "";
    feedbackElement.textContent = "";

    question.options.forEach(option => {
      const button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", () => selectAnswer(button, question.answer));
      optionsElement.appendChild(button);
    });

    nextButton.disabled = true;
    replayButton.style.display = "none";
    timerPhargraph.style.display = "block"; 
    startTimer();
  }
  
  function selectAnswer(button, correctAnswer) {
    stopTimer();
    const selectedAnswer = button.textContent;
    if (selectedAnswer === correctAnswer.toString()) {
      feedbackElement.textContent = "✅ Correct!";
      feedbackElement.style.color = "white";
      feedbackElement.style.backgroundColor = "green";
      score++;
    } else {
      feedbackElement.textContent = `❌ Wrong! Correct answer: ${correctAnswer}`;
      feedbackElement.style.color = "white";
      feedbackElement.style.backgroundColor = "red";
    }

    Array.from(optionsElement.children).forEach(btn => btn.disabled = true);
    nextButton.disabled = false;
  }

  nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showScore();
    }
  });
 
  function showScore() {
    if (score === questions.length) {
      questionElement.textContent = "Excellent, well done 😁";
    } else if (score > 3) {
      questionElement.textContent = "Good! 😊";
    } else {
      questionElement.textContent = "Try again! 😪";
    }

    optionsElement.innerHTML = "";
    feedbackElement.textContent = "";
    stopTimer();
    timerPhargraph.style.display = "none"; 
    scoreElement.textContent = `Your score: ${score}/${questions.length}`;
    nextButton.style.display = "none";
    hintButton.style.display="none";
    replayButton.style.display = "inline-block";
  }
 
  function startTimer() {
    timeLeft = 10;
    timerElement.textContent = `${timeLeft}s`;
    timerPhargraph.style.display = "block"; 
    timer = setInterval(() => {
      timeLeft--;
      timerElement.textContent = `${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        const correctAnswer = questions[currentQuestionIndex].answer;
        feedbackElement.textContent = `Time's up! Correct answer: ${correctAnswer}`;
        feedbackElement.style.color = "orange";
        Array.from(optionsElement.children).forEach(btn => btn.disabled = true);
        nextButton.disabled = false;
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timer);
    timerPhargraph.style.display = "none"; 
  }

  replayButton.addEventListener("click", () => {
    
    currentQuestionIndex = 0;
    score = 0;
    replayButton.style.display = "none";
    nextButton.style.display = "inline-block";
    scoreElement.textContent = "";
    timerPhargraph.style.display = "block"; 
    showQuestion(); 
  });
  
let hintsUsed = 0;
const hintButton = document.createElement("button");
hintButton.textContent = "Use Hint";
hintButton.style.marginTop = "10px";
hintButton.style.padding = "10px 15px";
hintButton.style.backgroundColor = "orange";
hintButton.style.color = "white";
hintButton.style.border = "none";
hintButton.style.borderRadius = "10px";
hintButton.style.cursor = "pointer";
document.getElementById("quiz-container").appendChild(hintButton);

let currentSet = 0;
 hintButton.addEventListener("click", () => {
    if (hintsUsed < 2) {
      feedbackElement.textContent = `Hint: The correct answer starts with "${questions[currentQuestionIndex].answer[0]}"`;
      feedbackElement.style.color = "blue";
      feedbackElement.style.backgroundColor = "lightyellow";
      hintsUsed++;
      if (hintsUsed === 2) {
        hintButton.disabled = true;
        hintButton.style.backgroundColor = "red";
        hintButton.style.cursor = "not-allowed";
      }
    }
  });

  replayButton.addEventListener("click", () => {
    stopTimer(); 
    currentQuestionIndex = 0;
    score = 0;
    replayButton.style.display = "none";
    nextButton.style.display = "inline-block";
    scoreElement.textContent = "";
    timerPhargraph.style.display = "block";
    currentSet = (currentSet + 1) % 2;
    fetch(currentSet === 0 ? "questions.json" : "questions2.json")
      .then(response => response.json())
      .then(data => {
        questions = data;
        showQuestion();
        
      })
      .catch(error => console.error("Error loading questions:", error));
    hintsUsed = 0;
    hintButton.disabled = false;
    hintButton.style.backgroundColor = "orange";
    hintButton.style.cursor = "pointer";
  });
});


