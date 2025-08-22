// Favourite Site List

// Retrieve fav list from local storage with error handling
let favList = [];
try {
   favList = JSON.parse(localStorage.getItem("favList")) || [];
} catch (e) {
   console.error("Error parsing JSON from localStorage:", e);
   localStorage.removeItem("favList");
}

const favourite_item_list = document.getElementById("favourite-item-list");

function renderFavList(filter = '') {
   favourite_item_list.innerHTML = "";
   const filteredList = favList.filter(item => 
      item.title.toLowerCase().includes(filter.toLowerCase()) || 
      item.url.toLowerCase().includes(filter.toLowerCase())
   );

   filteredList.forEach((item, i) => {
      favourite_item_list.innerHTML += `
      <tr class="fade-in">
         <th scope="row">${i + 1}</th>
         <td>${item.title}</td>
         <td><a href="${item.url}" target="_blank" class="text-primary">${item.url}</a></td>
         <td><h4><i class="edit-favourite bi bi-pencil-square" data-index="${i}" style="color:rgb(78 255 125); cursor: pointer;" data-bs-toggle="tooltip" title="Edit"></i></h4></td>
         <td><h4><i class="delete-favourite bi bi-trash" data-index="${i}" style="color:rgb(255 52 52); cursor: pointer;" data-bs-toggle="tooltip" title="Delete"></i></h4></td>
      </tr>
      `;
   });

   // Initialize Bootstrap tooltips
   const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
   [...tooltipTriggerList].forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

function addFav(item) {
   if (!item.title || !item.url) {
      alert("Please fill both Title and URL fields.");
      return;
   }
   favList.push(item);
   localStorage.setItem("favList", JSON.stringify(favList));
   renderFavList();
}

// Handle form submission
const favTitle = document.getElementById("fav-title");
const favUrl = document.getElementById("fav-url");
document.getElementById("add-favourite").addEventListener("click", function () {
   let fav_title_value = favTitle.value.trim();
   let fav_url_value = favUrl.value.trim();
   document.getElementById("fav-close-modal").click();

   if (fav_title_value && fav_url_value) {
      addFav({ title: fav_title_value, url: fav_url_value });
      favTitle.value = '';
      favUrl.value = '';
   } else {
      alert("Please fill both Title and URL fields.");
   }
});

// Search functionality
document.getElementById('search-favourite').addEventListener('input', function() {
   renderFavList(this.value);
});

// Clear search
document.getElementById('search-favourite').insertAdjacentHTML('afterend', 
   '<button id="clear-fav-search" class="btn btn-outline-secondary ms-2">Clear</button>'
);
document.getElementById('clear-fav-search').addEventListener('click', function() {
   document.getElementById('search-favourite').value = '';
   renderFavList();
});

// Handle delete/edit operations
favourite_item_list.addEventListener('click', (e) => {
   const target = e.target;

   if (target.classList.contains("edit-favourite")) {
      let index = target.getAttribute("data-index");
      let newTitle = prompt("Enter New Title", favList[index].title);
      let newUrl = prompt("Enter New URL", favList[index].url);
      if (newTitle && newUrl) {
         favList[index].title = newTitle.trim();
         favList[index].url = newUrl.trim();
         localStorage.setItem('favList', JSON.stringify(favList));
         renderFavList();
      }
   } else if (target.classList.contains('delete-favourite')) {
      let index = target.getAttribute("data-index");
      let yes_no = confirm(`Do you want to delete the favourite ${favList[index].title}?`);
      if (yes_no) {
         favList.splice(index, 1);
         localStorage.setItem('favList', JSON.stringify(favList));
         renderFavList();
      }
   }
});

// Initial render
renderFavList();