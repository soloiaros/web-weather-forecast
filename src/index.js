import searchPlace from "./api-fetch";
import './styles.css';

const inputBox = document.querySelector('input');
const btnSearch = document.querySelector('button');

btnSearch.addEventListener('click', () => {
  const requestedPlace = inputBox.value;
  const weatherData = searchPlace(requestedPlace);
  weatherData.then((result) => { console.log(result) })
})