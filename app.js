"use strict";

const STORAGE_KEY = "todo-list-items";
const THEME_STORAGE_KEY = "todo-list-theme";
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const remainingCount = document.querySelector("#remaining-count");
const clearCompletedButton = document.querySelector("#clear-completed");
const themeToggle = document.querySelector("#theme-toggle");
const filterButtons = document.querySelectorAll(".filter-button");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

let todos = loadTodos();
let activeFilter = "all";

function getSavedTheme() {
  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
  } catch (error) {
    console.warn("無法讀取主題設定:", error);
    return null;
  }
}

let savedTheme = getSavedTheme();

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle.textContent = isDark ? "☀️ 淺色模式" : "🌙 深色模式";
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

applyTheme(savedTheme || (systemTheme.matches ? "dark" : "light"));
systemTheme.addEventListener("change", (event) => {
  if (!savedTheme) {
    applyTheme(event.matches ? "dark" : "light");
  }
});

themeToggle.addEventListener("click", () => {
  savedTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(savedTheme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, savedTheme);
  } catch (error) {
    console.warn("無法儲存主題設定:", error);
  }
});

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

  const visibleTodos = todos.filter((todo) => {
    if (activeFilter === "active") {
      return !todo.completed;
    }
    if (activeFilter === "completed") {
      return todo.completed;
    }
    return true;
  });

  visibleTodos.forEach((todo) => {
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
  emptyState.hidden = visibleTodos.length > 0;
  if (activeFilter === "active") {
    emptyState.textContent = "目前沒有未完成的事項，其他已完成項目可能被目前的篩選條件隱藏。";
  } else if (activeFilter === "completed") {
    emptyState.textContent = "目前沒有已完成的事項，其他未完成項目可能被目前的篩選條件隱藏。";
  } else {
    emptyState.textContent = "還沒有任何待辦事項，新增一個吧！";
  }
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
  const shouldClear = window.confirm("確定要清除所有已完成的事項嗎？");
  if (!shouldClear) {
    return;
  }

  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    renderTodos();
  });
});

renderTodos();