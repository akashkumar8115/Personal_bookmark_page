// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
   const currentTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
   body.setAttribute('data-theme', currentTheme);
   localStorage.setItem('theme', currentTheme);
   updateThemeIcon(currentTheme);
});

function updateThemeIcon(theme) {
   themeToggle.innerHTML = `<i class="bi bi-${theme === 'dark' ? 'sun-fill' : 'moon-stars-fill'}"></i> ${theme === 'dark' ? 'Light' : 'Dark'} Mode`;
}

// Updated Clock Functionality
function updateClock() {
   const now = new Date();

   // Format time with AM/PM
   const time = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
   });

   // Format date with ordinal suffix
   const day = now.getDate();
   const suffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
         case 1: return 'st';
         case 2: return 'nd';
         case 3: return 'rd';
         default: return 'th';
      }
   };
   const date = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
   }).replace(String(day), `${day}${suffix(day)}`);

   // Update DOM with animation
   const clockTime = document.getElementById('clockTime');
   const clockDay = document.getElementById('clockDay');
   clockTime.textContent = time;
   clockDay.textContent = date;

   // Add subtle blink animation
   clockTime.classList.add('clock-blink');
   setTimeout(() => clockTime.classList.remove('clock-blink'), 200);

   // Schedule next update
   requestAnimationFrame(updateClock);
}
updateClock();

// Placeholder for weather (replace with your actual weather API code)
document.getElementById('temperature').textContent = '25°C';
document.getElementById('description').textContent = 'Sunny';
document.getElementById('location').textContent = 'Varanasi';
document.getElementById('humidity').textContent = '60%';
document.getElementById('pressure').textContent = '1012 hPa';
document.getElementById('windSpeed').textContent = '5 km/h';


// weather

function fetchWeatherData(location) {
   fetch(`https://wttr.in/${location}?format=j1`)
      .then((res) => res.json())
      .then((data) => {
         console.log(data);
         updateWeatherOnHTML(data)
      })
      .catch(err => console.warn("some err: ", err))
}

let place = localStorage.getItem("location") || 'Delhi'
document.getElementById('location').innerHTML = `${place}`;
document.getElementById("edit-location").addEventListener('click', (e) => {
   let address = prompt("Enter name of Disctrict or City", place)
   localStorage.setItem("location", address);
   document.getElementById('location').innerHTML = `${address}`;
   fetchWeatherData(address)
})

fetchWeatherData(place)
function updateWeatherOnHTML(weatherData) {
   document.getElementById("temperature").innerHTML = `${weatherData.current_condition[0].temp_C}&deg;C`
   document.getElementById("description").innerHTML = `${weatherData.current_condition[0].weatherDesc[0].value}`
   document.getElementById("humidity").innerHTML = `${weatherData.current_condition[0].humidity}%`
   document.getElementById("pressure").innerHTML = `${weatherData.current_condition[0].pressure} mB`
   document.getElementById("windSpeed").innerHTML = `${weatherData.current_condition[0].windspeedKmph} km/h`
}

// setting the background image
body = document.getElementsByTagName('body')[0]
// https://source.unsplash.com/random/widthxheight`
unsplashImageUrl = `https://source.unsplash.com/collection/158642/${window.screen.width - 1}x${window.screen.height - 1}` || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=874&q=80`
//id : 928423 , 158642 , 1163637
body.style.backgroundImage = `
linear-gradient(rgba(0, 0, 0, 0.5),
rgba(0, 0, 0, 0.5)),
url(${unsplashImageUrl})
`
//https://picsum.photos/width/height
