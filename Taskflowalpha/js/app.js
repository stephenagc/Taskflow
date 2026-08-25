const STORAGE_KEY = "taskflow.tasks";

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const taskCount = document.querySelector("#taskCount");
const clearCompleted = document.querySelector("#clearCompleted");
const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTask(title) {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
}

function getVisibleTasks() {
  if (currentFilter === "pending") return tasks.filter(task => !task.completed);
  if (currentFilter === "completed") return tasks.filter(task => task.completed);
  return tasks;
}

function render() {
  const visibleTasks = getVisibleTasks();
  taskList.innerHTML = "";

  visibleTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = `task-item ${task.completed ? "completed" : ""}`;
    item.dataset.id = task.id;

    const check = document.createElement("button");
    check.className = "check";
    check.setAttribute("aria-label", task.completed ? "Reabrir tarefa" : "Concluir tarefa");
    check.addEventListener("click", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.title;

    const remove = document.createElement("button");
    remove.className = "delete";
    remove.textContent = "Excluir";
    remove.setAttribute("aria-label", `Excluir ${task.title}`);
    remove.addEventListener("click", () => deleteTask(task.id));

    item.append(check, text, remove);
    taskList.appendChild(item);
  });

  emptyState.classList.toggle("hidden", visibleTasks.length > 0);

  const pending = tasks.filter(task => !task.completed).length;
  taskCount.textContent = `${pending} ${pending === 1 ? "tarefa pendente" : "tarefas pendentes"}`;
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  render();
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  tasks.unshift(createTask(title));
  saveTasks();
  taskInput.value = "";
  taskInput.focus();
  render();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(btn => btn.classList.toggle("active", btn === button));
    render();
  });
});

clearCompleted.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  render();
});

render();
