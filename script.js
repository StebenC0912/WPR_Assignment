const screen1 = document.querySelector(".introduction");
const screen2 = document.querySelector(".attempt-quiz");
const screen3 = document.querySelector(".review-quiz");

//hide screen 1 and display screen 2
const start = document.querySelector("#btn-start");
function startQuiz() {
  screen1.classList.add("hidden");
  screen2.classList.remove("hidden");
  screen2.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "center",
  });

  fetch("https://wpr-quiz-api.herokuapp.com/attempts", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    console.log("start");
    var correctAns = data.correctAnswers;
    const questionArr = data.questions;

    questionArr.forEach((question, index) => {
      //create question index and text
    const indexQuestion = document.createElement("h1");
    indexQuestion.classList.add("question-index");
    indexQuestion.textContent = `Question ${index+1} of 10`;

    const textQuestion = document.createElement("p");
    textQuestion.classList.add("question-text");
    textQuestion.textContent = question.text;

    const form = document.createElement("form");
    form.classList.add("answer");
    // const current_id = correct_ans[index];
    const answers = question.answers;
    answers.forEach((answer, x) => {
      const option = document.createElement("div");
      option.classList.add("option");
      const label = document.createElement("label");
      label.textContent = answer;
      const radio = document.createElement("input");
      radio.setAttribute("type", "radio");
      radio.setAttribute("value", x);
      option.appendChild(radio);
      option.appendChild(label);
      
      //add hr
      const hr = document.createElement("hr");
      form.appendChild(option);
      form.appendChild(hr);
    });
    
    document.querySelector("#attempt-quiz").appendChild(indexQuestion);
    document.querySelector("#attempt-quiz").appendChild(textQuestion);
    document.querySelector("#attempt-quiz").appendChild(form);
    
    });
    const btn_submit = document.createElement("div");
    btn_submit.setAttribute("id", "btn-submit");
    const btn_submit2 = document.createElement("button");
    btn_submit2.setAttribute("type", "button");
    btn_submit2.setAttribute("onclick", "attemptQuiz()");
    btn_submit2.textContent = 'Submit your answer ❯';
    btn_submit.appendChild(btn_submit2);
    document.querySelector("#attempt-quiz").appendChild(btn_submit);
  });

}
start.addEventListener("click", startQuiz);

//hide screen 2 and display screen 3
const submit = document.querySelector("#btn-submit");
function attemptQuiz() {
  
  if (confirm("Are you sure you want to submit?") == true) {
    screen2.classList.add("hidden");
    screen3.classList.remove("hidden");
    screen3.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "center",
    });
  }
}


//hide screen 3 and display screen 1
const try_again = document.querySelector("#btn-try-again");
function tryAgain() {
  screen3.classList.add("hidden");
  screen1.classList.remove("hidden");
  screen1.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "center",
  });
}
try_again.addEventListener("click", tryAgain);

//select answer display
const inputs = document.querySelectorAll(".answer");
for (const input of inputs) {
  console.log(input);
  const currentInput = input;
  const options = currentInput.querySelectorAll(".option");
  options.forEach((option) => {
    option.addEventListener("click", function () {
      const selectedOption = currentInput.querySelector(".selected");
      if (selectedOption) {
        //unselect the selected option
        selectedOption.classList.remove("selected");
      }
      //select the clicked option
      option.classList.add("selected");
      //display the selected option
      const checkThis = currentInput.querySelector(".selected input");
      checkThis.checked = true;
    });
  });
}

