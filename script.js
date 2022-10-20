const body = document.querySelector("body");

const screen1 = document.querySelector(".introduction");
const screen2 = document.querySelector(".attempt-quiz");
const screen3 = document.querySelector(".review-quiz");

const start = document.querySelector("#btn-start");
const btn_submit = document.querySelector("#btn-submit");
const try_again = document.querySelector("#btn-try-again");

let attemptId;

const allAnswers = document.querySelectorAll("#attempt-quiz .answer");
for (let answer of allAnswers) {
  let options = document.querySelectorAll(`#${answer.id} .option`);
  for (let option of options) {
    option.addEventListener("click", (e) => {
      let selectedOption = document.querySelector(`#${answer.id}  .selected`);
      if (selectedOption) {
        selectedOption.classList.remove("selected");
      }
      console.log("Clicked");
      e.currentTarget.classList.add("selected");
    });
  }
}

//hide screen 1 and display screen 2

function startQuiz() {
  screen1.classList.add("hidden");
  screen2.classList.remove("hidden");
  body.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "center",
  });

  fetch("https://wpr-quiz-api.herokuapp.com/attempts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      attemptId = data._id;
      console.log("start");
      var correctAns = data.correctAnswers;
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
        const answers = question.answers;
        answers.forEach((answer, index) => {
          const option = document.createElement("label");
          option.classList.add("option");
          //generate options Text
          const optionText = document.createElement("p");
          optionText.classList.add("option-text");
          optionText.textContent = answer
          //generate input
          const radio = document.createElement("input");
          radio.setAttribute("type", "radio");
          radio.setAttribute("value", index);
          radio.name = form.id;
          option.appendChild(radio);
          option.appendChild(optionText);
          option.addEventListener("click", (e) => {
            const selectedOption = document.querySelector(".selected");
            if (selectedOption) {
              selectedOption.classList.remove("selected");
            }
            e.target.classList.add("selected");
          });
          //add hr
          const hr = document.createElement("hr");
          form.appendChild(option);
          form.appendChild(hr);
        });

        displayQuestion.appendChild(indexQuestion);
        displayQuestion.appendChild(textQuestion);
        displayQuestion.appendChild(form);
        document.querySelector("#question-part").appendChild(displayQuestion);
      });
    });
}
start.addEventListener("click", startQuiz);
btn_submit.addEventListener("click", attemptQuiz);
try_again.addEventListener("click", tryAgain);
//hide screen 2 and display screen 3
function attemptQuiz() {
  if (confirm("Are you sure you want to submit?") == true) {
    screen2.classList.add("hidden");
    screen3.classList.remove("hidden");
    body.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "center",
    });
  }
}

//hide screen 3 and display screen 1

function tryAgain() {
  screen3.classList.add("hidden");
  screen1.classList.remove("hidden");
  body.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "center",
  });
}
