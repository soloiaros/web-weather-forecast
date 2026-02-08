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
  console.log(widgets);
  for (let widget of widgets) {
    widget.classList.add("skeleton");
  }
}

function fillOutWidgets(weatherData) {
  const widgets = document.querySelectorAll(".widget");
  const possibleStates = ["skeleton", "sun", "rain", "overcast"];
  for (let widget of widgets) {
    const currentClasses = [...widget.classList];
    for (let widClass of currentClasses) {
      if (possibleStates.includes(widClass)) {
        widget.classList.remove(widClass);
      }
    }
    if (weatherData.today.icon === "rain") {
      widget.classList.add("rain");
    } else if (weatherData.today.icon === "sunny") {
      widget.classList.add("sun");
    } else {
      widget.classList.add("overcast");
    }
  }
}
