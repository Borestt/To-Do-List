const taskInput = document.getElementById("taskInput"); // digitar a tarefa
const taskList = document.getElementById("taskList"); // exibir as tarefas
const filterButtons = document.querySelectorAll(".filters button"); // os 3 botoes de filtro
const profilePicInput = document.getElementById("profilePicInput");

let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // se não tiver nada salvo, começa vazio
let currentFilter = "all"; // começa com todas
let userName = localStorage.getItem("userName") || "Usuário";
let profilePicData = localStorage.getItem("profilePic");

function addTask() {
  const text = taskInput.value.trim();
  if (text !== "") {
    tasks.push({ text, completed: false });
    taskInput.value = "";
    saveTasks();
    renderTasks();
  }
}

taskInput.addEventListener("keyup", e => {
  if (e.key === "Enter") addTask();
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(index) {
  if (confirm("Deseja realmente excluir esta tarefa?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.filters button[onclick="setFilter('${filter}')"]`).classList.add("active");
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";

  const filtered = tasks.filter(task => {
    if (currentFilter === "all") return true;
    if (currentFilter === "pendentes") return !task.completed;
    if (currentFilter === "completas") return task.completed;
  });

  function setPendingTasks(count) {
  const pendingTasksSpan = document.getElementById('pendingTasksCount');
  if (pendingTasksSpan) pendingTasksSpan.textContent = count;
}


  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.style.padding = "12px";
    li.style.borderBottom = "1px solid #ccc";
    li.style.display = "flex";
    li.style.flexDirection = "column";
    li.style.gap = "6px";

    // Topo da tarefa
    const topRow = document.createElement("div");
    topRow.style.display = "flex";
    topRow.style.justifyContent = "space-between";
    topRow.style.alignItems = "center";

    // Texto da tarefa
    const span = document.createElement("span");
    span.textContent = task.text;
    span.style.fontWeight = "bold";
    span.style.cursor = "default";
    if (task.completed) {
      span.style.textDecoration = "line-through";
      span.style.color = "gray";
    }

    // Botão ✔️
    const doneBtn = document.createElement("button");
    doneBtn.textContent = "✔️";
    doneBtn.title = task.completed ? "Marcar como pendente" : "Marcar como feita";
    doneBtn.style.border = "none";
    doneBtn.style.background = "none";
    doneBtn.style.cursor = "pointer";
    doneBtn.style.fontSize = "16px";
    doneBtn.onclick = () => toggleComplete(index);

    // Botão 🔍
    const detailBtn = document.createElement("button");
    detailBtn.innerHTML = "🔍";
    detailBtn.title = "Ver detalhes";
    detailBtn.style.border = "none";
    detailBtn.style.background = "none";
    detailBtn.style.cursor = "pointer";
    detailBtn.style.fontSize = "16px";

    // Botão 🗑️
    const delBtn = document.createElement("button");
    const trashImg = document.createElement("img");
    trashImg.src = "icons8-lixeira-50.png";
    trashImg.alt = "Excluir";
    trashImg.style.width = "18px";
    trashImg.style.height = "18px";

    delBtn.appendChild(trashImg);
    delBtn.style.background = "none";
    delBtn.style.border = "none";
    delBtn.style.cursor = "pointer";
    delBtn.onclick = () => deleteTask(index);

    // Agrupar botões
    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.alignItems = "center";
    actions.style.gap = "10px";
    actions.appendChild(doneBtn);
    actions.appendChild(detailBtn);
    actions.appendChild(delBtn);

    // Monta a linha
    topRow.appendChild(span);
    topRow.appendChild(actions);
    li.appendChild(topRow);

    // Detalhes ocultos
    const detail = document.createElement("div");
    detail.textContent = task.details || "Sem detalhes.";
    detail.style.fontSize = "0.9rem";
    detail.style.color = "#555";
    detail.style.marginTop = "4px";
    detail.style.display = "none";

    detailBtn.onclick = () => {
      detail.style.display = detail.style.display === "none" ? "block" : "none";
    };

    li.appendChild(detail);
    taskList.appendChild(li);
  });

  const pendentes = tasks.filter(task => !task.completed).length;
setPendingTasks(pendentes);

}

// Iniciar a renderização
renderTasks();

function updateUI() {
  const userNameSpan = document.getElementById('userName');
  const profilePic = document.getElementById('profilePic');
  userNameSpan.textContent = userName;
  if (profilePicData) {
    profilePic.src = profilePicData;
    profilePic.style.display = "block";
  } else {
    profilePic.style.display = "none";
  }
}

function editUserName() {
  document.getElementById('editNameModal').style.display = 'block';
  document.getElementById('newUserNameInput').value = userName;
}

function saveUserName() {
  const newName = document.getElementById('newUserNameInput').value.trim();
  if (newName !== "") {
    userName = newName;
    localStorage.setItem("userName", userName);
    updateUI();
    document.getElementById('editNameModal').style.display = 'none';
  }
}

profilePicInput.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      profilePicData = e.target.result;
      localStorage.setItem('profilePic', profilePicData);
      updateUI();
    }
    reader.readAsDataURL(file);
  }
});

function logout() {
  localStorage.removeItem('userName');
  localStorage.removeItem('profilePic');
  localStorage.removeItem('pendingTasks');
  localStorage.removeItem('tasks');
  userName = 'Usuário';
  profilePicData = null;
  tasks = [];
  currentFilter = 'all';
  updateUI();
  renderTasks();
  document.getElementById('logoutModal').style.display = 'block';
}

function closeLogoutModal() {
  document.getElementById('logoutModal').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  renderTasks();
});
