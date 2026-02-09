import searchPlace from "./api-fetch";
import "./styles.css";

const inputBox = document.querySelector("input");
const btnSearch = document.querySelector("button");

btnSearch.addEventListener("click", async function () {
  const requestedPlace = inputBox.value;
  displaySkeletonWidgets();
  const weatherData = await searchPlace(requestedPlace);
  fillOutWidgets(weatherData);
});

const degreeSwitcher = document.getElementById("degree-switcher");
degreeSwitcher.addEventListener("click", () => {
  const toggleHead = document.getElementById("toggle-head");
  if (degreeSwitcher.checked) {
    toggleHead.classList = "right";
  } else {
    toggleHead.classList = "left";
  }
});

function displaySkeletonWidgets() {
  const widgets = document.querySelectorAll(".widget");
  for (let widget of widgets) {
    widget.classList.add("skeleton");
  }
}

function fillOutWidgets(weatherData) {
  const widgets = document.querySelectorAll(".widget");
  const possibleStates = ["skeleton", "sun", "rain", "overcast"];
  const backgroundStates = {
    'rain': ['thunder-rain', 'thunder-showers-day', 'thunder-showers-night', 'rain', 'showers-day', 'showers-night'],
    'sun': ['clear-day', 'clear-night'],
    'overcast': ['snow', 'snow-showers-day', 'snow-showers-night', 'fog', 'wind', 'cloudy', 'partly-cloudy-day', 'partly-cloudy-night'],
  }
  const iconSubstituteNames = {
    'snow': 'snow',
    'snow-showers-day': 'snowy-sunny',
    'snow-showers-night': 'snow',
    'thunder-rain': 'thunder',
    'thunder-showers-day': 'thunder',
    'thunder-showers-night': 'thunder',
    'rain': 'rainy',
    'showers-day': 'rainy-sunny',
    'showers-night': 'rain',
    'fog': 'cloudy',
    'wind': 'cloudy',
    'cloudy': 'cloudy',
    'partly-cloudy-day': 'cloudy-sunny',
    'partly-cloudy-night': 'cloudy-night',
    'clear-day': 'sunny',
    'clear-night': 'night',
  }
  for (let widget of widgets) {
    const currentClasses = [...widget.classList];
    for (let widClass of currentClasses) {
      if (possibleStates.includes(widClass)) {
        widget.classList.remove(widClass);
      }
    }
    for (let state in backgroundStates) {
      if (backgroundStates[state].includes(weatherData.today.icon)) {
        widget.classList.add(state);
      }
    }
  }

  const widgetPlace = document.getElementById('place-widget');
  widgetPlace.querySelector('.summary').textContent = weatherData.today.summary;
  widgetPlace.querySelector('.city').textContent = weatherData.location;
  import(`./icons/${iconSubstituteNames[weatherData.today.icon]}.svg`).then((icon) => {
    widgetPlace.querySelector('.icon').innerHTML = icon.default;
  });
  
}
