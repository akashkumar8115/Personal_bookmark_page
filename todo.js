// Retrieve todo list from local storage
let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

const todo_item_list = document.getElementById("todo-item-list");
const newTodoModal = document.getElementById("new-todo-modal");
const newTodoModalUrl = document.getElementById("new-todo-modal-url");

function renderList(filter = '') {
   todo_item_list.innerHTML = "";
   const filteredList = todoList.filter(item =>
      item.title.toLowerCase().includes(filter.toLowerCase()) ||
      item.url.toLowerCase().includes(filter.toLowerCase())
   );

   filteredList.forEach((item, i) => {
      const isCompleted = item.completedAt ? 'text-decoration-line-through text-muted' : '';
      todo_item_list.innerHTML += `
      <tr class="fade-in ${isCompleted}">
         <th scope="row">${i + 1}</th>
         <td>${item.title}</td>
         <td><a href="${item.url}" target="_blank" class="text-primary">${item.url}</a></td>
         <td><i class="bi bi-pencil-square" data-index="${i}" id="edit-todo" style="color:rgb(78 255 125); cursor: pointer;" data-bs-toggle="tooltip" title="Edit"></i></td>
         <td><i class="bi bi-trash" data-index="${i}" id="delete-todo" style="color:rgb(255 52 52); cursor: pointer;" data-bs-toggle="tooltip" title="Delete"></i></td>
         <td><i class="bi bi-check-circle" data-index="${i}" id="mark-done" style="color:rgb(78 125 255); cursor: pointer;" data-bs-toggle="tooltip" title="Mark Done"></i></td>
         ${item.completedAt ? `<td class="done-date">${item.completedAt}</td>` : '<td></td>'}
      </tr>
      `;
   });

   // Initialize Bootstrap tooltips
   const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
   [...tooltipTriggerList].forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

function addTodo(item) {
   if (!item.title || !item.url) {
      alert("Please fill both Todo and URL fields.");
      return;
   }
   todoList.push(item);
   localStorage.setItem("todoList", JSON.stringify(todoList));
   renderList();
}

// Handle form submission
document.getElementById("add-todo").addEventListener("click", function () {
   const newTodoModalValue = newTodoModal.value.trim();
   const newTodoModalUrlValue = newTodoModalUrl.value.trim();

   if (newTodoModalValue && newTodoModalUrlValue) {
      const newTodoItem = {
         title: newTodoModalValue,
         url: newTodoModalUrlValue,
         completedAt: null,
      };
      addTodo(newTodoItem);
      newTodoModal.value = "";
      newTodoModalUrl.value = "";
      document.getElementById("todo-close-modal").click();
   } else {
      alert("Please fill both the Todo and URL fields.");
   }
});

// Search functionality
document.getElementById('search-todo').addEventListener('input', function () {
   renderList(this.value);
});

// Clear search
document.getElementById('search-todo').insertAdjacentHTML('afterend',
   '<button id="clear-todo-search" class="btn btn-outline-secondary ms-2">Clear</button>'
);
document.getElementById('clear-todo-search').addEventListener('click', function () {
   document.getElementById('search-todo').value = '';
   renderList();
});

// Handle edit, delete, and mark as done actions
todo_item_list.addEventListener('click', (e) => {
   const target = e.target;
   const index = Number(target.getAttribute("data-index"));

   if (target.id === "edit-todo") {
      const todo = todoList[index];
      const newTodo = prompt("Edit Todo", todo.title) || todo.title;
      const newUrl = prompt("Edit URL", todo.url) || todo.url;
      todoList[index] = { ...todo, title: newTodo.trim(), url: newUrl.trim() };
      localStorage.setItem('todoList', JSON.stringify(todoList));
      renderList();

   } else if (target.id === "delete-todo") {
      const yesNo = confirm(`Do you want to delete the Todo #${index + 1}?`);
      if (yesNo) {
         todoList.splice(index, 1);
         localStorage.setItem('todoList', JSON.stringify(todoList));
         renderList();
      }

   } else if (target.id === "mark-done") {
      todoList[index].completedAt = todoList[index].completedAt ? null : new Date().toLocaleString();
      localStorage.setItem('todoList', JSON.stringify(todoList));
      renderList();
      if (todoList[index].completedAt) {
         sendNotification(todoList[index].title, todoList[index].completedAt);
      }
   }
});

// Function to send notification or alert
function sendNotification(taskName, completionTime) {
   if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Task Completed: "${taskName}"`, {
         body: `Completed: ${completionTime}`,
         icon: 'https://example.com/completed-icon.png',
      });
   } else {
      alert(`Task Completed: "${taskName}" at ${completionTime}`);
   }
}

// Request permission for browser notifications
if ('Notification' in window && Notification.permission !== 'granted') {
   Notification.requestPermission();
}

// Initial rendering
renderList();