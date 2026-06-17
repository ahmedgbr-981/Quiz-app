/**
 * ============================================
 * QUIZ CLASS
 * ============================================
 *
 * This class manages the entire quiz game state.
 *
 * PROPERTIES TO CREATE:
 * - category (string) - The selected category ID
 * - difficulty (string) - easy, medium, or hard
 * - numberOfQuestions (number) - How many questions
 * - playerName (string) - The player's name
 * - score (number) - Current score, starts at 0
 * - questions (array) - Questions from API, starts empty
 * - currentQuestionIndex (number) - Which question we're on, starts at 0
 *
 * METHODS TO IMPLEMENT:
 * - constructor(category, difficulty, numberOfQuestions, playerName)
 * - async getQuestions() - Fetch questions from API
 * - buildApiUrl() - Create the API URL with parameters
 * - incrementScore() - Add 1 to score
 * - getCurrentQuestion() - Get the current question object
 * - nextQuestion() - Move to next question, return true/false
 * - isComplete() - Check if quiz is finished
 * - getScorePercentage() - Calculate percentage (0-100)
 * - saveHighScore() - Save to localStorage
 * - getHighScores() - Load from localStorage
 * - isHighScore() - Check if current score qualifies
 * - endQuiz() - Generate results screen HTML
 *
 */

const finishSound = new Audio("./js/end.mp3");

export default class Quiz {
  // TODO: Create constructor
  // Initialize all properties mentioned above
  constructor(category, difficulty, playerName, numberOfQuestions) {
    this.category = category;
    this.difficulty = difficulty;
    this.numberOfQuestions = numberOfQuestions;
    this.playerName = playerName;
    this.score = 0;
    this.questions = [];
    this.currentQuestionIndex = 0;
  }

  // TODO: Create async getQuestions() method
  // 1. Build the API URL using buildApiUrl()
  // 2. Use fetch() to get data
  // 3. Check if response.ok, throw error if not
  // 4. Parse JSON: const data = await response.json()
  // 5. Check if data.response_code === 0 (success)
  // 6. Store data.results in this.questions
  // 7. Return this.questions

  async getQuestions(num, diff, cat) {
    let url = `https://opentdb.com/api.php?amount=${num}&difficulty=${diff}`;

    if (cat) {
      url += `&category=${cat}`;
    }
    let resp = await fetch(`${url}`);
    if (resp.status >= 200 && resp.status < 300) {
      let data = await resp.json();
      if (data.response_code !== 0) {
        throw new Error("No questions found");
      }
      this.questions = data.results;
      return this.questions;
    }
    throw new Error(`HTTP Error: ${resp.status}`);
  }

  // TODO: Create buildApiUrl() method
  // Use URLSearchParams to build query string
  // Example result: "https://opentdb.com/api.php?amount=10&difficulty=easy"

  // TODO: Create incrementScore() method
  // Simply add 1 to this.score
  incrementScore() {
    this.score += 1;
  }

  // TODO: Create getCurrentQuestion() method
  // Return this.questions[this.currentQuestionIndex]
  // Return null if index is out of bounds
  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex] || null;
  }
  // TODO: Create nextQuestion() method
  // Increment currentQuestionIndex
  // Return true if there are more questions
  // Return false if quiz is complete
  nextQuestion() {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.questions.length) return true;

    return false;
  }
  // TODO: Create isComplete() method
  // Return true if currentQuestionIndex >= questions.length
  isComplete() {
    if (currentQuestionIndex >= questions.length) return true;
    return false;
  }
  // TODO: Create getScorePercentage() method
  // Calculate: (score / numberOfQuestions) * 100
  // Round to whole number using Math.round()
  getScorePercentage() {
    let percent = Math.round((this.score / this.questions.length) * 100);
    return percent;
  }
  // TODO: Create saveHighScore() method
  // 1. Get existing high scores using getHighScores()
  // 2. Create new score object: { name, score, total, percentage, difficulty, date }
  // 3. Push to array
  // 4. Sort by percentage (highest first)
  // 5. Keep only top 10
  // 6. Save to localStorage using JSON.stringify()
  saveHighScore(highScore) {
    let highScores = this.getHighScores();
    let score = {
      name: this.playerName,
      score: this.score,
      percentage: highScore,
      difficulty: this.difficulty,
      date: new Date().toLocaleDateString(),
    };
    if (highScores.length < 3) {
      highScores.push(score);
    } else if (highScores.length >3) {
      highScores.pop();
    } else if (score.score > highScores[2].score) {
      highScores[2] = score;
    }
    highScores.sort((a, b) => b.percentage - a.percentage);
    localStorage.setItem("quizHighScores", JSON.stringify(highScores));
    console.log(score);
    return highScores;
  }
  // TODO: Create getHighScores() method
  // 1. Get from localStorage using 'quizHighScores' key
  // 2. Parse JSON
  // 3. Return array (or empty array if nothing saved)
  // Wrap in try/catch for safety
  getHighScores() {
    let highScores = JSON.parse(localStorage.getItem("quizHighScores"));
    return highScores || [];
  }
  // TODO: Create isHighScore() method
  // Return true if:
  // - Less than 10 saved, OR
  // - Current percentage beats the lowest saved score
  isHighScore(num) {
    let highScores = JSON.parse(localStorage.getItem("quizHighScores")) || [];
    if (highScores.length < 10 || num > highScores[highScores.length - 1])
      return true;
    return false;
  }
  // TODO: Create endQuiz() method
  // 1. Calculate percentage
  // 2. Check if it's a high score
  // 3. If yes, save it (BEFORE getting high scores for display)
  // 4. Get high scores (AFTER saving)
  // 5. Return HTML string for results screen
  //
  //     (See index.html for the HTML structure to use)
  endQuiz() {
    finishSound.play();
    let Leaderboard;
    let present = this.getScorePercentage();
    Leaderboard = this.getHighScores;
    const playAgain = document.getElementById("btn-restart");
    if (this.isHighScore(present)) {
      playAgain.classList.remove("hidden");
      document.querySelector(".new-record-badge").classList.remove("hidden");
      Leaderboard = this.saveHighScore(present);
    }
    playAgain.classList.remove("hidden");
    return ` <div class="game-card results-card">
      <h2 class="results-title">Quiz Complete!</h2>
      <p class="results-score-display">${this.score}/${this.questions.length}</p>
      <p class="results-percentage">${this.getScorePercentage()}% Accuracy</p>
      
      
      <div class="leaderboard">
        <h4 class="leaderboard-title">
          <i class="fa-solid fa-trophy"></i> Leaderboard
        </h4>
        <ul class="leaderboard-list">
          <li class="leaderboard-item gold">
            <span class="leaderboard-rank">#1</span>
            <span class="leaderboard-name">${Leaderboard[0]?.name || "-"}</span>
            <span class="leaderboard-score">${Leaderboard[0]?.percentage || 0}% Accuracy</span>
          </li>
          <li class="leaderboard-item silver">
            <span class="leaderboard-rank">#2</span>
            <span class="leaderboard-name">${Leaderboard[1]?.name || "-"}</span>
            <span class="leaderboard-score">${Leaderboard[1]?.percentage || 0}% Accuracy</span>
          </li>
          <li class="leaderboard-item bronze">
            <span class="leaderboard-rank">#3</span>
            <span class="leaderboard-name">${Leaderboard[2]?.name || "-"}</span>
            <span class="leaderboard-score">${Leaderboard[2]?.percentage || 0}% Accuracy</span>
          </li>
        </ul>
      </div>
      
      
    </div>`;
    console.log(Leaderboard);
  }
}
