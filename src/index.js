import { compareAsc, compareDesc, differenceInMilliseconds, hoursToMilliseconds, hoursToSeconds, isWithinInterval, minutesToMilliseconds, toDate } from "date-fns";
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
    if (widget.id === 'sun-widget') {
      widget.querySelector('.icon svg').style.setProperty('--rotate-angle', 0);
    }
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
  
  const widgetSun = document.getElementById('sun-widget');
  widgetSun.querySelector('.icon > svg').style['display'] = 'block';
  const sunAngle = getSunAngle(weatherData.today.sunrise, weatherData.today.sunset, weatherData.today.datetime);
  widgetSun.querySelector('.icon > svg').style.setProperty('--rotate-angle', sunAngle);
  widgetSun.querySelector('.icon > svg').style['transform'] = `rotate(${sunAngle}deg)`;

  widgetSun.querySelector('p.sunrise').textContent = `Sunrise: ${weatherData.today.sunrise.slice(0, -3)}`;
  widgetSun.querySelector('p.sunset').textContent = `Sunset: ${weatherData.today.sunset.slice(0, -3)}`;

}

function getSunAngle (sunrise, sunset, datetime) {
  const sunriseTime = new Date(`2000-10-10T${sunrise}`);
  const sunsetTime = new Date(`2000-10-10T${sunset}`);
  const currentTime = new Date(`2000-10-10T${datetime}`);
  
  const totalMS = hoursToMilliseconds(24);
  const sunUpMS = differenceInMilliseconds(sunsetTime, sunriseTime);
  const moonUpMS = totalMS - sunUpMS;
  const currentMS = hoursToMilliseconds(currentTime.getHours()) + minutesToMilliseconds(currentTime.getMinutes());
  const sunriseMS = hoursToMilliseconds(sunriseTime.getHours()) + minutesToMilliseconds(sunriseTime.getMinutes());
  const sunsetMS = hoursToMilliseconds(sunsetTime.getHours()) + minutesToMilliseconds(sunsetTime.getMinutes());

  if (isWithinInterval(currentTime, {
    start: sunriseTime,
    end: sunsetTime})) {
      const fraction = currentMS - sunriseMS;
      return (fraction / sunUpMS) * 90 - 45;
  } else {
    const fraction = currentMS > sunUpMS ? currentMS - sunsetMS : currentMS + totalMS - sunsetMS;
    return (fraction / moonUpMS) * 180 + 135;
  }
}
