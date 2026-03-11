document.addEventListener('DOMContentLoaded', function() {
const input = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('todoList');
const saved = JSON.parse(localStorage.getItem('todos')) || [];
saved.forEach(renderTodo);

function renderTodo(text, completed, id) {
const li = document.createElement('li');
li.dataset.id = id;
if (completed) li.classList.add('completed');
li.innerHTML = '<span>' + text + '</span><button class=\'delete\'>Delete</button>';
li.addEventListener('click', function(e) {
if (e.target === li) {
li.classList.toggle('completed');
saveTodos();
}
});
li.querySelector('.delete').addEventListener('click', function(e) {
e.stopPropagation();
li.remove();
saveTodos();
});
list.appendChild(li);
}

function saveTodos() {
const todos = [];
list.querySelectorAll('li').forEach(li => {
todos.push({
id: li.dataset.id,
text: li.querySelector('span').textContent,
completed: li.classList.contains('completed')
});
});
localStorage.setItem('todos', JSON.stringify(todos));
}

addBtn.addEventListener('click', function() {
const text = input.value.trim();
if (text) {
const id = Date.now().toString();
renderTodo(text, false, id);
input.value = '';
saveTodos();
}
});

input.addEventListener('keypress', function(e) {
if (e.key === 'Enter') {
addBtn.click();
}
});
});
