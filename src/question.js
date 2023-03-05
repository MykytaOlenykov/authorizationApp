import { Notify } from "notiflix/build/notiflix-notify-aio";

export class Question {
  static create(question) {
    return fetch(
      "https://test-59554-default-rtdb.europe-west1.firebasedatabase.app/questions.json",
      {
        method: "POST",
        body: JSON.stringify(question),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        question.id = data.name;
        return question;
      })
      .then(addToLocalStorage)
      .then(Question.renderList)
      .catch(Notify.failure);
  }

  static onFetchQuestions(token) {
    return fetch(
      `https://test-59554-default-rtdb.europe-west1.firebasedatabase.app/questions.json?auth=${token}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }

        return response.json();
      })
      .then((data) => {
        if (!data) {
          return [];
        }

        return Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
      });
  }

  static renderList() {
    const questions = getQuestionsFromLocalStorage();
    let markup = "";

    if (!questions.length) {
      markup = `<div class="mui--text-headline">Вы пока что ничего не спрашивали</div>`;
      return;
    } else {
      markup = questions.map(toCard).join("");
    }

    const listRef = document.querySelector("#list");
    listRef.innerHTML = markup;
  }

  static listToHTML(questions) {
    if (!questions) {
      return `<p>Вопрос пока нет</p>`;
    }
    return `<ol>${questions.map((q) => `<li>${q.text}</li>`)}</ol>`;
  }
}

function addToLocalStorage(question) {
  const allQuestions = getQuestionsFromLocalStorage();
  allQuestions.push(question);
  localStorage.setItem("questions", JSON.stringify(allQuestions));
}

function getQuestionsFromLocalStorage() {
  return JSON.parse(localStorage.getItem("questions") || "[]");
}

function toCard(question) {
  return `<div class="mui--text-black-54">
           ${new Date(question.date).toLocaleDateString()}
           ${new Date(question.date).toLocaleTimeString()}
          </div>
          <div>
            ${question.text}
          </div>
          <br />`;
}
