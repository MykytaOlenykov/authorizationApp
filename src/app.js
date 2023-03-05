import throttle from "lodash.throttle";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Question } from "./question";
import { getAuthForm, authWithEmailAndPassword } from "./auth";
import { isValid, createModal } from "./utils";
import "./styles.css";

const formRef = document.querySelector("#form");
const modalBtnEl = document.querySelector("#modal-btn");
const inputEl = formRef.querySelector("#questuion-input");
const btnSubmitEl = formRef.querySelector("#submit");

window.addEventListener("load", Question.renderList);
formRef.addEventListener("submit", submitFormHandler);
modalBtnEl.addEventListener("click", openModal);
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

  Question.create(question).finally(() => {
    formRef.reset();
    inputEl.className = "";
  });
}

function openModal() {
  createModal("Aвторизация", getAuthForm());

  document
    .querySelector("#auth-form")
    .addEventListener("submit", authFormHandler, { once: true });
}

function authFormHandler(e) {
  e.preventDefault();

  const btnEl = e.target.querySelector("button");
  const {
    elements: { email, password },
  } = e.currentTarget;

  btnEl.disabled = true;

  authWithEmailAndPassword(email.value, password.value)
    .then(Question.onFetchQuestions)
    .then(renderModalAfterAuth)
    .catch((error) => Notify.failure(`Error ${error.message}`))
    .finally(() => (btnEl.disabled = false));
}

function renderModalAfterAuth(content) {
  createModal("Список вопросов", Question.listToHTML(content));
}
