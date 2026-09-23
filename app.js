"use strict";

const STORAGE_KEY = "todo-list-items";
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const remainingCount = document.querySelector("#remaining-count");
const clearCompletedButton = document.querySelector("#clear-completed");

let todos = loadTodos();

// 從瀏覽器儲存空間讀取待辦事項，資料損壞時回到空清單。
function loadTodos() {
  try {
    const savedData = window.localStorage.getItem(STORAGE_KEY);
    if (!savedData) {
      return [];
    }

    const savedTodos = JSON.parse(savedData);
    if (!Array.isArray(savedTodos)) {
      return [];
    }

    return savedTodos.filter((todo) => (
      todo && typeof todo.id === "string" && typeof todo.text === "string"
    )).map((todo) => ({
      id: todo.id,
      text: todo.text,
      completed: todo.completed === true
    }));
  } catch (error) {
    console.warn("無法讀取待辦事項:", error);
    return [];
  }
}

// 儲存目前清單，並確認寫入的內容可被讀回。
function saveTodos() {
  try {
    const serializedTodos = JSON.stringify(todos);
    window.localStorage.setItem(STORAGE_KEY, serializedTodos);

    if (window.localStorage.getItem(STORAGE_KEY) !== serializedTodos) {
      throw new Error("localStorage 寫入內容不一致");
    }
  } catch (error) {
    console.error("無法儲存待辦事項:", error);
  }
}

function renderTodos() {
  todoList.replaceChildren();

  todos.forEach((todo) => {
    const item = document.createElement("div");
    item.className = "todo-item";
    item.dataset.id = todo.id;
    if (todo.completed) {
      item.classList.add("is-completed");
    }

    const checkbox = document.createElement("input");
    checkbox.className = "todo-check";
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `標記「${todo.text}」為完成`);
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "刪除";
    deleteButton.setAttribute("aria-label", `刪除「${todo.text}」`);
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    item.append(checkbox, text, deleteButton);
    todoList.append(item);
  });

  const unfinishedCount = todos.filter((todo) => !todo.completed).length;
  remainingCount.textContent = `未完成:${unfinishedCount} 項`;
  emptyState.hidden = todos.length > 0;
  clearCompletedButton.hidden = !todos.some((todo) => todo.completed);
}

function addTodo(text) {
  todos.push({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    text,
    completed: false
  });
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) => (
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ));
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = todoInput.value.trim();
  if (!text) {
    todoInput.focus();
    return;
  }

  addTodo(text);
  todoInput.value = "";
  todoInput.focus();
});

clearCompletedButton.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

renderTodos();