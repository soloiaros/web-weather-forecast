import searchPlace, { HttpError } from "../api-fetch.mjs";

searchPlace

test('Return valid weather data', () => {
  let weatherData = '';
  searchPlace('London')
  .then(returnData => { weatherData = returnData; })
  .then(() => { expect(weatherData.location).toBe('London'); });
});

test('Return HttpError on invalid input', () => {
  let weatherData = '';
  searchPlace('MUHAHAHAHAHAHHAHAHA')
  .then((returnData) => { weatherData = returnData; })
  .then(() => { expect(weatherData).toBeInstanceOf(HttpError); })
});