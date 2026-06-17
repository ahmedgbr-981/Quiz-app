// ============================================
//  * MAIN ENTRY POINT (index.js)
//  * ============================================
//  *
//  * This file is the starting point of your application.
//  * It handles:
//  * - Getting DOM elements
//  * - Form validation
//  * - Starting the quiz
//  * - Loading/error states

import Question from "./question.js";
import Quiz from "./quiz.js";

//   DOM ELEMENTS TO GET:
const quizOptionsForm = document.getElementById("quizOptions");
const playerNameInput = document.getElementById("playerName");
const categoryInput = document.getElementById("categoryMenu");
const difficultyOptions = document.getElementById("difficultyOptions");
const questionsNumber = document.getElementById("questionsNumber");
const startQuizBtn = document.getElementById("startQuiz");
const questionsContainer = document.getElementById("questionsContainer");

const playerName = playerNameInput.value;
const cat = categoryInput.value;
const diff = difficultyOptions.value;
const num = questionsNumber.value;

//   FUNCTIONS TO IMPLEMENT:
//   - showLoading() - Display loading spinner
//   - hideLoading() - Remove loading spinner
//   - showError(message) - Display error card
//   - validateForm() - Check if form is valid
//   - showFormError(message) - Show error on form
//   - resetToStart() - Reset to initial state
//   - startQuiz() - Main function to start quiz

// ============================================
// TODO: Get DOM Element References
// ============================================
// Use document.getElementById() and document.querySelector()

// ============================================
// TODO: Create variable to store current quiz
// ============================================

// ============================================
// TODO: Create showLoading() function
// ============================================
// Set questionsContainer.innerHTML to loading HTML
// See index.html for the HTML structure

function showLoading() {
  questionsContainer.innerHTML = ` <div class="loading-overlay">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading Questions...</p>
    </div>`;
}

// ============================================
// TODO: Create hideLoading() function
// ============================================
// Find and remove the loading overlay
function hideLoading() {
  questionsContainer.innerHTML = null;
}

// ============================================
// TODO: Create showError(message) function
// ============================================
// Set questionsContainer.innerHTML to error HTML
// Include the message parameter in the display
// Add click listener to retry button that calls resetToStart()
function showError() {
  questionsContainer.innerHTML = `
    <div class="game-card error-card ">
      <div class="error-icon">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <h3 class="error-title">Oops! Something went wrong</h3>
      <p class="error-message">Failed to load questions. Please try again.</p>
      <button class="btn-play retry-btn">
        <i class="fa-solid fa-rotate-right"></i> Try Again
      </button>
    </div>
  `;
  document.querySelector(".retry-btn").addEventListener("click", resetToStart);
}
// ============================================
// TODO: Create validateForm() function
// ============================================
// Return object: { isValid: boolean, error: string | null }
// Check:
// 1. questionsNumber has a value
// 2. Value is >= 1 (minimum questions)
// 3. Value is <= 50 (maximum questions)
function validateForm() {
  const value = Number(questionsNumber.value);
  const name = playerNameInput.value;
  if (!name.trim()) {
    return { isValid: false, error: "plase enter your  name" };
  }

  if (!value) {
    return { isValid: false, error: "Please enter a number of questions." };
  }

  if (value < 1) {
    return { isValid: false, error: "Minimum is 1 question." };
  }

  if (value > 50) {
    return { isValid: false, error: "Maximum is 50 questions." };
  }

  return { isValid: true, error: null };
}
// ============================================
// TODO: Create showFormError(message) function
// ============================================
// Create error div with class 'form-error'
// Insert before the start button
// Remove after 3 seconds with fade effect
function showFormError(message) {
  let errorDiv = document.createElement("div");
  errorDiv.classList.add("form-error");
  errorDiv.innerHTML = `${message}`;
  startQuizBtn.before(errorDiv);
  setTimeout(() => {
    errorDiv.remove();
  }, 3000);
}
// ============================================
// TODO: Create resetToStart() function
// ============================================
// 1. Clear questionsContainer
// 2. Reset form values
// 3. Show the form (remove 'hidden' class)
// 4. Set currentQuiz = null

function resetToStart() {
  questionsContainer.innerHTML = null;
  playerNameInput.value = null;
  difficultyOptions.value = null;
  questionsNumber.value = 1;
  quizOptionsForm.classList.remove("hidden");
  currentQuiz = null;
}
// ============================================
// TODO: Create async startQuiz() function
// ============================================
// This is the main function, called when Start button is clicked
//

export async function startQuiz() {
  let currentQuiz = new Quiz(
    categoryInput.value,
    difficultyOptions.value,
    playerNameInput.value,
    questionsNumber.value,
  );

  let validate = validateForm();

  if (!validate.isValid) {
    showFormError(validate.error);
    return;
  }
  quizOptionsForm.classList.add("hidden");
  showLoading();
  try {
    let q = await currentQuiz.getQuestions(
      questionsNumber.value,
      difficultyOptions.value,
      categoryInput.value,
    );
    console.log(q);

    hideLoading();

    let question = new Question(currentQuiz, questionsContainer, () => {
      quizOptionsForm.classList.remove("hidden");
      questionsContainer.innerHTML = "";
      playerNameInput.value= null;
      questionsNumber.value= null;
      console.log("Quiz ended");
    });
    question.displayQuestion();
  } catch (error) {
    console.error(error);
    hideLoading();
    showError();
  }
}

// Steps:
// 1. Validate the form
// 2. If not valid, show error and return
// 3. Get form values:
//    - playerName (use 'Player' if empty)
//    - category
//    - difficulty
//    - numberOfQuestions
// 4. Create new Quiz instance
// 5. Hide the form (add 'hidden' class)
// 6. Show loading spinner
// 7. Try to fetch questions:
//    - await currentQuiz.getQuestions()
//    - Hide loading
//    - Check if questions exist
//    - Create first Question and display it
// 8. Catch any errors:
//    - Hide loading
//    - Show error message

// ============================================
// TODO: Add Event Listeners
// ============================================
// 1. startQuizBtn click -> call startQuiz()
// 2. questionsNumber keydown -> if Enter, call startQuiz()

startQuizBtn.addEventListener("click", startQuiz);

let x = validateForm();
if (x.isValid) {
  addEventListener("keydown", function (e) {
    if (e.target.name == "enter") startQuiz();
  });
}
