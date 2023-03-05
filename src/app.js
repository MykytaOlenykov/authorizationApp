import "./styles.css";
import throttle from "lodash.throttle";
import { isValid } from "./utils";

const formRef = document.querySelector("#form");
const inputEl = formRef.querySelector("#questuion-input");
const btnSubmitEl = formRef.querySelector("#submit");

formRef.addEventListener("submit", submitFormHandler);
inputEl.addEventListener(
  "input",
  throttle((e) => {
    btnSubmitEl.disabled = !isValid(e.target.value);
  }, 300)
);

function submitFormHandler(e) {
  e.preventDefault();
  btnSubmitEl.setAttribute("disabled", "");

  const inputValue = e.currentTarget.elements.question.value.trim();

  if (!isValid(inputValue)) {
    return;
  }

  const question = {
    text: inputValue,
    date: new Date().toJSON(),
  };

  console.log(question);

  formRef.reset();
  inputEl.className = "";
}
