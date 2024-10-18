// Retrieve todo list from local storage
let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

// Reference to the DOM elements
const todo_item_list = document.getElementById("todo-item-list");
const newTodoModal = document.getElementById("new-todo-modal");
const newTodoModalUrl = document.getElementById("new-todo-modal-url");

// Function to render the Todo list
function renderList() {
   todo_item_list.innerHTML = ""; // Clear the existing list
   for (let i = 0; i < todoList.length; i++) {
      const todoItem = todoList[i];

      todo_item_list.innerHTML += `
      <tr>
         <th scope="row">${i + 1}</th>
         <td>${todoItem.title}</td>
         <td><a href="${todoItem.url}" target="_blank">${todoItem.url}</a></td>
         <td><i class="bi bi-pencil-square" data-index="${i}" id="edit-todo" style="color:rgb(78 255 125);"></i></td>
         <td><i class="bi bi-trash" data-index="${i}" id="delete-todo" style="color:rgb(255 52 52);"></i></td>
         <td><i class="bi bi-check-circle" data-index="${i}" id="mark-done" style="color:rgb(78 125 255);"></i></td>
         ${todoItem.completedAt ? `<td class = "done-date"> ${todoItem.completedAt}</td>` : ""}
      </tr>
      `;
   }
}

// Add new item to the list and save to local storage
function addTodo(item) {
   todoList.push(item);
   localStorage.setItem("todoList", JSON.stringify(todoList));
   renderList();
}

// Handle form submission to add a new Todo item
document.getElementById("add-todo").addEventListener("click", function () {
   const newTodoModalValue = newTodoModal.value.trim();
   const newTodoModalUrlValue = newTodoModalUrl.value.trim();

   // Only proceed if both fields are filled
   if (newTodoModalValue && newTodoModalUrlValue) {
      const newTodoItem = {
         title: newTodoModalValue,
         url: newTodoModalUrlValue,
         completedAt: null, // Initialize with no completion time
      };

      addTodo(newTodoItem);

      // Clear input fields after adding
      newTodoModal.value = "";
      newTodoModalUrl.value = "";
      document.getElementById("todo-close-modal").click(); // Close the modal
   } else {
      alert("Please fill both the Todo and URL fields.");
   }
});

// Handle edit, delete, and mark as done actions
todo_item_list.addEventListener('click', (e) => {
   const target = e.target;
   const index = Number(target.getAttribute("data-index"));

   if (target.id === "edit-todo") {
      const todo = todoList[index];

      // Prompt the user to edit both the Todo title and URL
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
      // Mark as done and record the completion time
      todoList[index].completedAt = new Date().toLocaleString();
      localStorage.setItem('todoList', JSON.stringify(todoList));
      renderList();

      // Show notification or alert
      sendNotification(todoList[index].title, todoList[index].completedAt);
   }
});

// Function to send notification or alert
function sendNotification(taskName, completionTime) {
   if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Task Completed: "${taskName}"`, {
         body: `Completed: ${completionTime}`,
         icon: 'https://example.com/completed-icon.png', // Optional
      });
   } else {
      alert(`Task Completed: "${taskName}" at ${completionTime}`);
   }
}

// Request permission for browser notifications
if ('Notification' in window && Notification.permission !== 'granted') {
   Notification.requestPermission();
}

// Initial rendering of the list
renderList();
