const body = document.querySelector("body");

const screen1 = document.querySelector(".introduction");
const screen2 = document.querySelector(".attempt-quiz");
const screen3 = document.querySelector(".review-quiz");

const start = document.querySelector("#btn-start");
const btn_submit = document.querySelector("#btn-submit");
const try_again = document.querySelector("#btn-try-again");

let attemptId;


//hide screen 1 and display screen 2

function startQuiz() {
  screen1.classList.add("hidden");
  screen2.classList.remove("hidden");
  body.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  fetch("https://wpr-quiz-api.herokuapp.com/attempts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      attemptId = data._id;
      console.log("start");
      const questionArr = data.questions;

      questionArr.forEach((question, index) => {
        const displayQuestion = document.createElement("div");
        //create question index and text
        const indexQuestion = document.createElement("h2");
        indexQuestion.classList.add("question-index");
        indexQuestion.textContent = `Question ${index + 1} of 10`;

        const textQuestion = document.createElement("p");
        textQuestion.classList.add("question-text");
        textQuestion.textContent = question.text;

        const form = document.createElement("form");
        form.classList.add("answer");
        form.id = question._id;
        // const current_id = correct_ans[index];
        const answerArr = question.answers;
        answerArr.forEach((answer, index) => {
          const option = document.createElement("label");
          option.classList.add("option");
          //generate options Text
          const optionText = document.createElement("p");
          optionText.classList.add("option-text");
          optionText.textContent = answer;
          //generate input
          const radio = document.createElement("input");
          radio.setAttribute("type", "radio");
          radio.setAttribute("value", index);
          radio.name = form.id;
          //display option
          option.appendChild(radio);
          option.appendChild(optionText);

          //add hr
          const hr = document.createElement("hr");
          form.appendChild(option);
          form.appendChild(hr);
          //handle click event
          option.addEventListener("click", (e) => {
            const selected = form.querySelector(".selected");
            if (selected) {
              selected.classList.remove("selected");
            }
            e.currentTarget.classList.add("selected");
          });
        });

        displayQuestion.appendChild(indexQuestion);
        displayQuestion.appendChild(textQuestion);
        displayQuestion.appendChild(form);
        document.querySelector("#question-part").appendChild(displayQuestion);
      });
    });
}
start.addEventListener("click", startQuiz);
//hide screen 2 and display screen 3
//display results
function attemptQuiz() {
  if (confirm("Are you sure you want to submit?") == true) {
    screen2.classList.add("hidden");
    screen3.classList.remove("hidden");
    body.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    const data = {
      answers: {},
    };
    const formArr = document.querySelectorAll("#question-part form");
    formArr.forEach((form) => {
      const UserAnswer = form.querySelector(".selected input");
      if (UserAnswer) {
        data.answers[form.id] = UserAnswer.value;
      }
    });
    fetch(`https://wpr-quiz-api.herokuapp.com/attempts/${attemptId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    then((res) => res.json());
    then((data) => {
      const review = document.querySelector("#question-review");
      const questionArr = data.questions;
      const UserAnswerArr = data.answers || {};
      const correctAns = data.correctAnswers;
      questionArr.forEach((question, index) => {
        const div = document.createElement("div");

        const questionIndexReview = document.createElement("h2");
        questionIndexReview.classList.add("question-index");
        questionIndexReview.textContent = `Question ${index + 1} of 10`;

        const questionTextReview = document.createElement("p");
        questionTextReview.classList.add("question-text");
        questionTextReview.textContent = question.text;

        const formAnswer = document.createElement("form");

        const answersArr = question.answers;
        answersArr.forEach((answer, index) => {
          const option = document.createElement("label");
          option.classList.add("option");
          //generate options Text
          const optionText = document.createElement("p");
          optionText.classList.add("option-text");
          optionText.textContent = answer;
          //generate input
          const radio = document.createElement("input");
          radio.setAttribute("type", "radio");
          radio.setAttribute("value", index);
          radio.name = formAnswer.id;

          if (correctAns[question._id] == index) {
            option.classList.add("correct");
          }
          if (UserAnswerArr[question._id] == index) {
            radio.checked = true;
            if (userAnswerArr[question._id] != correctAns[question._id]) {
              option.classList.add("wrong-answer");
            } else {
              option.classList.add("correct-answer");
            }
          }
          //display option
          option.appendChild(radio);
          option.appendChild(optionText);
          //add hr
          const hr = document.createElement("hr");
          formAnswer.appendChild(option);
          formAnswer.appendChild(hr);
        });
        div.appendChild(questionIndexReview);
        div.appendChild(questionTextReview);
        div.appendChild(formAnswer);

        review.appendChild(div);
      });
      const score = data.score;
      const scoreText = data.scoreText;
      document.querySelector("#score").textContent = "${score} / 10";
      document.querySelector("#score-text strong").textContent =
        "${(score/10)*100}%";
      document.querySelector("#score-text").textContent = scoreText;
    });
  }
}
btn_submit.addEventListener("click", attemptQuiz);
//hide screen 3 and display screen 1

function tryAgain() {
  screen3.classList.add("hidden");
  screen1.classList.remove("hidden");
  removeAllSelectedOption();
  body.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "center",
  });
  location.reload();
}

try_again.addEventListener("click", tryAgain);
function removeAllSelectedOption() {
  //unselect all options
  let selectedOption = document.querySelectorAll("input[type=radio]:checked");
  selectedOption.forEach((option) => {
    option.checked = false;
  });
  //remove all background color of selected option
  let selectedLabel = document.querySelectorAll(".selected");
  selectedLabel.forEach((label) => {
    label.classList.remove("selected");
  });
}
