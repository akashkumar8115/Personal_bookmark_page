// Favourite Site List

// Clear corrupted data (optional, if needed)
// localStorage.removeItem("favList");

// Retrieve fav list from local storage with error handling
let favList = [];
try {
   favList = JSON.parse(localStorage.getItem("favList")) || [];
} catch (e) {
   console.error("Error parsing JSON from localStorage:", e);
   // Clear corrupted data
   localStorage.removeItem("favList");
}

/**
 [{title, url},]
 */
const favourite_item_list = document.getElementById("favourite-item-list");

function renderFavList() {
   favourite_item_list.innerHTML = "";
   for (let i = 0; i < favList.length; i++) {
      favourite_item_list.innerHTML += `
      <tr>
         <th scope="row">${i + 1}</th>
         <td>${favList[i].title}</td>
         <td><a href="${favList[i].url}" target="_blank">${favList[i].url}</a></td>
         <td><h4><i class="edit-favourite bi bi-pencil-square" data-index="${i}" style="color:rgb(78 255 125);"></i></h4></td>
         <td><h4><i class="delete-favourite bi bi-trash" data-index="${i}" style="color:rgb(255 52 52);"></i></h4></td>
      </tr>
      `;
   }
}

function addFav(item) {
   console.log('Item to be added:', item);
   favList.push(item);
   localStorage.setItem("favList", JSON.stringify(favList)); // Ensure it's stored as JSON
   renderFavList();
}

// Handle form submission
const favTitle = document.getElementById("fav-title");
const favUrl = document.getElementById("fav-url");
document.getElementById("add-favourite").addEventListener("click", function () {
   let fav_title_value = favTitle.value.trim(); // Remove unnecessary spaces
   let fav_url_value = favUrl.value.trim(); // Remove unnecessary spaces
   document.getElementById("fav-close-modal").click();

   addFav({ title: fav_title_value, url: fav_url_value });
   favTitle.value = '';
   favUrl.value = '';
   renderFavList();
});

// Handling delete/edit operations
favourite_item_list.addEventListener('click', (e) => {
   const target = e.target;

   if (target.classList.contains("edit-favourite")) { // Changed id check to class check
      let index = target.getAttribute("data-index");
      let newTitle = prompt("Enter New Title", favList[index].title);
      let newUrl = prompt("Enter New URL", favList[index].url);
      favList[index].title = newTitle ? newTitle.trim() : favList[index].title;
      favList[index].url = newUrl ? newUrl.trim() : favList[index].url;
      localStorage.setItem('favList', JSON.stringify(favList)); // Store updated list as JSON
      renderFavList();
   }
   else if (target.classList.contains('delete-favourite')) { // Changed id check to class check
      let index = target.getAttribute("data-index");
      let yes_no = confirm(`Do you want to delete the favourite ${favList[index].title}?`);
      if (yes_no) {
         favList.splice(index, 1);
         localStorage.setItem('favList', JSON.stringify(favList)); // Store updated list as JSON
         renderFavList();
      }
   }
});

// Initial render of the favorite list
renderFavList();
