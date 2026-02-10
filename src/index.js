import { differenceInMilliseconds, hoursToMilliseconds, isWithinInterval, minutesToMilliseconds } from "date-fns";
import searchPlace from "./api-fetch";
import "./fonts/stylesheet.css";
import "./styles.css";

const inputBox = document.querySelector("input");
const btnSearch = document.querySelector("button");
const toggleHead = document.getElementById("toggle-head");

btnSearch.addEventListener("click", async function () {
  initiateSearch();
});

inputBox.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    initiateSearch();
  }
})

const degreeSwitcher = document.getElementById("degree-switcher");
degreeSwitcher.addEventListener("click", () => {
  if (degreeSwitcher.checked) {
    toggleHead.classList = "right";
  } else {
    toggleHead.classList = "left";
  }
  initiateSearch();
});

async function initiateSearch(place = null) {
  const errorBox = document.querySelector('.error');
  const requestedPlace = place ? place : inputBox.value;
  inputBox.value = requestedPlace;
  displaySkeletonWidgets();
  const degrees = toggleHead.classList.contains('left') ? 'C' : 'F';
  const weatherData = await searchPlace(requestedPlace);
  if (weatherData instanceof Error) {
    errorBox.style.display = 'inline';
    errorBox.textContent = 'Oopsiee.. An error occured while searching for your place :/';
  } else {
    errorBox.style.display = 'none';
    errorBox.textContent = '';
    fillOutWidgets(weatherData, degrees);
  }

}

function displaySkeletonWidgets() {
  const widgets = document.querySelectorAll(".widget");
  for (let widget of widgets) {
    widget.classList.add("skeleton");
    if (widget.id === 'sun-widget') {
      widget.querySelector('.icon svg').style.setProperty('--rotate-angle', 0);
    }
  }
}

function fillOutWidgets(weatherData, degrees) {
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
  };
  const tempIconStates = {
    'temp-min': "M5.99988 0C7.29277 3.15695e-05 8.53293 0.513523 9.44714 1.42773C10.3613 2.34197 10.8749 3.5821 10.8749 4.875V13.752C11.5181 14.6485 11.9016 15.7053 11.9833 16.8057C12.0649 17.9061 11.8417 19.0085 11.3378 19.9902C10.8339 20.9718 10.0685 21.795 9.12683 22.3701C8.18514 22.9452 7.10331 23.25 5.99988 23.25C4.89638 23.25 3.8137 22.9453 2.87195 22.3701C1.93054 21.795 1.16581 20.9716 0.661987 19.9902C0.158085 19.0085 -0.0651902 17.9061 0.0164795 16.8057C0.0981891 15.7053 0.481628 14.6485 1.12488 13.752V4.875C1.12488 3.58207 1.63837 2.34197 2.55261 1.42773C3.46685 0.513532 4.70698 0 5.99988 0ZM5.99988 2.25C5.30371 2.25 4.63571 2.52631 4.14343 3.01855C3.65115 3.51084 3.37488 4.17881 3.37488 4.875V14.1357C3.37476 14.4052 3.27831 14.666 3.10242 14.8701C2.65143 15.4191 2.36541 16.0849 2.2782 16.79C2.19106 17.495 2.30568 18.2103 2.60925 18.8525C2.91289 19.4949 3.39283 20.0378 3.99304 20.418C4.59329 20.7981 5.28937 21 5.99988 21C6.71194 20.9999 7.40962 20.7969 8.01062 20.415C8.61141 20.0332 9.09088 19.4881 9.39343 18.8438C9.69598 18.1992 9.80875 17.4817 9.71863 16.7754C9.62844 16.069 9.3395 15.4024 8.88464 14.8545C8.71662 14.6522 8.62465 14.3977 8.62488 14.1348V4.875C8.62488 4.17883 8.34857 3.51083 7.85632 3.01855C7.36407 2.5263 6.69603 2.25003 5.99988 2.25ZM5.99988 13.6084C6.49614 13.6084 6.92308 13.8983 7.12488 14.3174V15.3018C7.46677 15.4992 7.75066 15.7832 7.94812 16.125C8.1456 16.467 8.2498 16.8551 8.24988 17.25C8.24995 17.645 8.14555 18.0329 7.94812 18.375C7.75069 18.7171 7.46688 19.0017 7.12488 19.1992C6.78292 19.3966 6.39474 19.5 5.99988 19.5C5.60495 19.5 5.21691 19.3966 4.87488 19.1992C4.53295 19.0019 4.24914 18.7178 4.05164 18.376C3.8542 18.0341 3.74997 17.6458 3.74988 17.251C3.74986 16.856 3.85416 16.4671 4.05164 16.125C4.2491 15.7832 4.53301 15.4991 4.87488 15.3018V14.3145C5.07719 13.8967 5.50454 13.6084 5.99988 13.6084Z",
    'temp-mid': "M5.99988 0C7.29277 3.15695e-05 8.53293 0.513523 9.44714 1.42773C10.3613 2.34197 10.8749 3.5821 10.8749 4.875V13.752C11.5181 14.6485 11.9016 15.7053 11.9833 16.8057C12.0649 17.9061 11.8417 19.0085 11.3378 19.9902C10.8339 20.9718 10.0685 21.795 9.12683 22.3701C8.18514 22.9452 7.10331 23.25 5.99988 23.25C4.89638 23.25 3.8137 22.9453 2.87195 22.3701C1.93054 21.795 1.16581 20.9716 0.661987 19.9902C0.158085 19.0085 -0.0651902 17.9061 0.0164795 16.8057C0.0981891 15.7053 0.481628 14.6485 1.12488 13.752V4.875C1.12488 3.58207 1.63837 2.34197 2.55261 1.42773C3.46685 0.513532 4.70698 0 5.99988 0ZM5.99988 2.25C5.30371 2.25 4.63571 2.52631 4.14343 3.01855C3.65115 3.51084 3.37488 4.17881 3.37488 4.875V14.1357C3.37476 14.4052 3.27831 14.666 3.10242 14.8701C2.65143 15.4191 2.36541 16.0849 2.2782 16.79C2.19106 17.495 2.30568 18.2103 2.60925 18.8525C2.91289 19.4949 3.39283 20.0378 3.99304 20.418C4.59329 20.7981 5.28937 21 5.99988 21C6.71194 20.9999 7.40962 20.7969 8.01062 20.415C8.61141 20.0332 9.09088 19.4881 9.39343 18.8438C9.69598 18.1992 9.80875 17.4817 9.71863 16.7754C9.62844 16.069 9.3395 15.4024 8.88464 14.8545C8.71662 14.6522 8.62465 14.3977 8.62488 14.1348V4.875C8.62488 4.17883 8.34857 3.51083 7.85632 3.01855C7.36407 2.5263 6.69603 2.25003 5.99988 2.25ZM5.99988 10.375C6.49606 10.375 6.92304 10.665 7.12488 11.084V15.3018C7.46677 15.4992 7.75066 15.7832 7.94812 16.125C8.1456 16.467 8.2498 16.8551 8.24988 17.25C8.24995 17.645 8.14555 18.0329 7.94812 18.375C7.75069 18.7171 7.46688 19.0017 7.12488 19.1992C6.78292 19.3966 6.39474 19.5 5.99988 19.5C5.60495 19.5 5.21691 19.3966 4.87488 19.1992C4.53295 19.0019 4.24914 18.7178 4.05164 18.376C3.8542 18.0341 3.74997 17.6458 3.74988 17.251C3.74986 16.856 3.85416 16.4671 4.05164 16.125C4.2491 15.7832 4.53301 15.4991 4.87488 15.3018V11.0811C5.07723 10.6634 5.50462 10.375 5.99988 10.375Z",
    'temp-max': "M10.875 13.7522V4.875C10.875 3.58207 10.3614 2.34209 9.44715 1.42785C8.53291 0.513615 7.29293 0 6 0C4.70707 0 3.4671 0.513615 2.55286 1.42785C1.63862 2.34209 1.125 3.58207 1.125 4.875V13.7522C0.481704 14.6488 0.0981268 15.7054 0.0164571 16.8059C-0.0652126 17.9064 0.158189 19.0081 0.662091 19.9898C1.16599 20.9715 1.93088 21.7953 2.87262 22.3705C3.81437 22.9456 4.8965 23.25 6 23.25C7.10351 23.25 8.18563 22.9456 9.12738 22.3705C10.0691 21.7953 10.834 20.9715 11.3379 19.9898C11.8418 19.0081 12.0652 17.9064 11.9835 16.8059C11.9019 15.7054 11.5183 14.6488 10.875 13.7522ZM6 21C5.28949 21 4.59359 20.7982 3.99335 20.418C3.39311 20.0378 2.91322 19.495 2.60958 18.8526C2.30593 18.2102 2.19103 17.4948 2.27824 16.7897C2.36545 16.0846 2.65119 15.4187 3.10219 14.8697C3.2781 14.6656 3.37491 14.4051 3.375 14.1356V4.875C3.375 4.17881 3.65156 3.51113 4.14385 3.01884C4.63613 2.52656 5.30381 2.25 6 2.25C6.6962 2.25 7.36388 2.52656 7.85616 3.01884C8.34844 3.51113 8.625 4.17881 8.625 4.875V14.1347C8.62475 14.3977 8.71664 14.6524 8.88469 14.8547C9.33955 15.4026 9.629 16.0687 9.71919 16.775C9.80938 17.4814 9.69658 18.1989 9.39399 18.8435C9.0914 19.4881 8.61153 20.0332 8.01049 20.4151C7.40945 20.797 6.7121 20.9999 6 21ZM8.25 17.25C8.25008 17.645 8.14618 18.033 7.94875 18.3751C7.75132 18.7172 7.46731 19.0013 7.12528 19.1988C6.78325 19.3964 6.39525 19.5004 6.00027 19.5004C5.6053 19.5005 5.21727 19.3966 4.87519 19.1991C4.53311 19.0016 4.24904 18.7176 4.05153 18.3756C3.85401 18.0335 3.75002 17.6455 3.75 17.2505C3.74998 16.8556 3.85394 16.4675 4.05142 16.1255C4.2489 15.7834 4.53294 15.4994 4.875 15.3019V8.25C4.875 7.95163 4.99353 7.66548 5.20451 7.4545C5.41549 7.24353 5.70163 7.125 6 7.125C6.29837 7.125 6.58452 7.24353 6.7955 7.4545C7.00648 7.66548 7.125 7.95163 7.125 8.25V15.3019C7.46698 15.4993 7.75098 15.7833 7.94845 16.1252C8.14593 16.4672 8.24993 16.8551 8.25 17.25Z",
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
  widgetPlace.querySelector('.time > svg').style['display'] = 'block';
  widgetPlace.querySelector('.time p').textContent = `Local time: ${new Date().toLocaleTimeString('en-UK', {timeZone: weatherData.timezone}).slice(0, -3)}`;
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

  const widgetTemp = document.getElementById('temp-widget');
  widgetTemp.querySelector('.current').textContent = degrees === 'F' ? `${weatherData.today.temp} °F` : `${Math.round((weatherData.today.temp - 32) * 5 / 9 * 10) / 10} °C`;
  widgetTemp.querySelector('.lowest').textContent = degrees === 'F' ? `${weatherData.today.tempmin} °F` : `${Math.round((weatherData.today.tempmin - 32) * 5 / 9 * 10) / 10} °C`;
  widgetTemp.querySelector('.highest').textContent = degrees === 'F' ? `${weatherData.today.tempmax} °F` : `${Math.round((weatherData.today.tempmax - 32) * 5 / 9 * 10) / 10} °C`;
  const tempIcon = weatherData.today.temp < 32 ? 'temp-min' : weatherData.today.temp < 77 ? 'temp-mid' : 'temp-max';
  widgetTemp.querySelector('.icon svg path').setAttribute('d', tempIconStates[tempIcon]);
  Array.from(widgetTemp.getElementsByTagName('svg')).forEach((icon) => { icon.style['display'] = 'block' });

  const widgetWind = document.getElementById('wind-widget');
  widgetWind.querySelector('.icon svg').style['transform'] = `rotate(${weatherData.today.winddir}deg)`;
  widgetWind.querySelector('.icon svg').style['display'] = 'block';
  const windSpeedString = weatherData.today.windspeed < 18 ? 'light' : weatherData.windspeed < 46 ? 'moderate' : 'high';
  widgetWind.querySelector('p').textContent = `Wind speed is ${windSpeedString}`;
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


const defaultPlaces = ['New York', 'London', 'Mumbai', 'Istanbul', 'Toronto', 'Reykjavik'];
initiateSearch(defaultPlaces[Math.floor(Math.random() * defaultPlaces.length)]);