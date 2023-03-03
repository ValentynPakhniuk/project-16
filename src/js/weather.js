const refs = {
  temperature: document.querySelector('#temp'),
  weatherConditions: document.querySelector('#weather-conditions'),
  cityName: document.querySelector('#city-name'),
  cityNameWeek: document.querySelector('#city-name-week'),
  currentDay: document.querySelector('#current-weekday'),
  currentDate: document.querySelector('#current-date'),
  currentYear: document.querySelector('#current-year'),
  buttonSwitch: document.querySelector('#switch'),
  weatherDaily: document.querySelector('#weather-daily'),
  weatherWeek: document.querySelector('#wether-week'),
}

const APIURL = 'https://api.openweathermap.org/data/2.5/';
const APIKEY = 'ea8d3210fb1031e19e4ed7c502a65955';
const date = new Date();
let lat = '49.9808100';
let lon = '36.2527200';

fetch(`${APIURL}weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`)
  .then(response => response.json())
  .then(weather => {
    refs.temperature.textContent = Math.round(weather.main.temp);
    refs.weatherConditions.textContent = weather.weather[0].main;
    refs.cityName.textContent = weather.name;
  });

fetch(`${APIURL}forecast?lat=${lat}&lon=${lon}&cnt=60&appid=${APIKEY}`)
.then(response => response.json())
.then(weatherWeek => {
  refs.cityNameWeek.textContent = weatherWeek.city.name;

  if (weatherWeek.list) {
    
  }

  console.log(weatherWeek);
});

function showCurrentDate() {
  const options = { day: 'numeric', month: 'long' };

  refs.currentDate.textContent = date.toLocaleString('en-US', options);
  refs.currentYear.textContent = date.getFullYear();
};

function showCurrentWeekDay() {
  const options = { weekday: 'long' };

  refs.currentDay.textContent = date.toLocaleString('en-US', options);
}

refs.buttonSwitch.addEventListener('click', function(e) {
  refs.weatherDaily.classList.toggle('invisible');
  refs.weatherWeek.classList.toggle('invisible');
  changeText(refs.buttonSwitch);
})

function changeText(ev) {
  if(ev.getAttribute('data-show') === "true") {
      ev.innerText = "Weather for week"
      ev.setAttribute('data-show', "false"); 
  }
  else {
      ev.innerText = "Weather now"
      ev.setAttribute('data-show', "true"); 
  }
}

showCurrentDate();
showCurrentWeekDay();