const taskInput = document.getElementById("taskInput"); // digitar a tarefa
const taskList = document.getElementById("taskList"); // exibir as tarefas
const filterButtons = document.querySelectorAll(".filters button"); // os 3 botoes de filtro

let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // se nao tiver nada salvo, começa uma lista vazia
let currentFilter = "all"; // começa em todas

function addTask() { // adicionar a tarefa digitada
  const text = taskInput.value.trim(); // trim para tirar espaços extras
  if (text !== "") {
    tasks.push({ text, completed: false }); // adiciona o texto como um objeto e false(pendente)
    taskInput.value = ""; // limpa o campo
    saveTasks();
    renderTasks();
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks)); // salva no localStorage, mesmo se atualizar a página ele continua lá
}

function renderTasks() {
  taskList.innerHTML = ""; // limpa a tela

  // Amostragem das tarefas
  const filtered = tasks.filter(task => {
    if (currentFilter === "all") return true;
    if (currentFilter === "pendentes") return !task.completed;
    if (currentFilter === "completas") return task.completed;
  });

  // um mini css nas tarefas aplicadas
  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.padding = "8px 0";
    li.style.borderBottom = "1px solid #ccc";

    const span = document.createElement("span");
    span.textContent = task.text;
    span.style.cursor = "pointer";
    if (task.completed) {
      span.style.textDecoration = "line-through";
      span.style.color = "gray";
    }

    span.onclick = () => toggleComplete(index); // ao clicar na tarefa, alterna o status para concluida

    const delBtn = document.createElement("button"); 
    const trashImg = document.createElement("img");
    trashImg.src = "icons8-lixeira-50.png"; // coloque o caminho correto do PNG aqui
    trashImg.alt = "Excluir";
    trashImg.style.width = "18px";
    trashImg.style.height = "18px";
    trashImg.style.marginRight = "17px"

    // Adiciona a imagem dentro do botão
    delBtn.appendChild(trashImg);


    delBtn.style.background = "none";
    delBtn.style.border = "none";
    delBtn.style.cursor = "pointer";
    delBtn.onclick = () => deleteTask(index); // ao clicar no botão de deletar, remove a tarefa

    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function toggleComplete(index) { // alterna o status da tarefa entre concluídas e pendentes
  tasks[index].completed = !tasks[index].completed;
  saveTasks(); // salva
  renderTasks(); // atualiza
}

// Remove uma tarefa
function deleteTask(index) { 
  tasks.splice(index, 1); // remove a tarefa do array (1) como selecionado
  saveTasks(); // salva
  renderTasks(); // atualiza
}

function setFilter(filter) { 
  currentFilter = filter; // atualiza o filtro ao clicar em um dos botões
  filterButtons.forEach(btn => btn.classList.remove("active")); // para apenas um botão ficar azul, removendo o active dos outros
  document.querySelector(`.filters button[onclick="setFilter('${filter}')"]`).classList.add("active");
  // procura o botão que foi clicado e adiciona a classe active
  renderTasks(); // atualiza
}

// Inicialização
renderTasks();

