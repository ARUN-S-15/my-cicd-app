const form = document.getElementById('todoForm');
const input = document.getElementById('todoInput');
const list = document.getElementById('todoList');

async function loadTodos() {
  const res = await fetch('/api/todos');
  const todos = await res.json();
  list.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    if (todo.completed) li.classList.add('completed');
    const span = document.createElement('span');
    span.textContent = todo.text;
    span.onclick = () => toggleTodo(todo.id);
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteTodo(todo.id);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

async function toggleTodo(id) {
  await fetch(`/api/todos/${id}`, { method: 'PATCH' });
  loadTodos();
}

async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, { method: 'DELETE' });
  loadTodos();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  input.value = '';
  loadTodos();
});

loadTodos();
