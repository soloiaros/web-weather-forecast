const WEATHER_API = "UKJY746W25RDE47ZPHE4RN3BL";

class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = "HttpError";
    this.response = response;
  }
}

export default async function searchPlace(place) {
  const params = new URLSearchParams();
  params.append("key", WEATHER_API);
  params.append("location", place);
  params.append('iconSet', 'icons2');

  const request = new Request(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline?${params}`,
  );
  const response = await getWeatherData(request);
  return response;
}

async function getWeatherData(request) {
  const response = await fetch(request);
  if (response.ok) {
    const weatherData = await response.json();
    console.log(weatherData)
    const returnData = {
      location: weatherData.address,
      today: {
        icon: weatherData.days[0].icon,
        sunrise: weatherData.days[0].sunrise,
        sunset: weatherData.days[0].sunset,
        datetime: weatherData.currentConditions.datetime,
        timezone: weatherData.timezone,
        summary: weatherData.days[0].description,
        windspeed: weatherData.days[0].windspeed,
        winddir: weatherData.days[0].winddir,
        temp: weatherData.days[0].temp,
        tempmax: weatherData.days[0].tempmax,
        tempmin: weatherData.days[0].tempmin,
      },
    };
    for (let i = 1; i < 7; i++) {
      returnData[weatherData.days[i].datetime] = {};
      returnData[weatherData.days[i].datetime]["icon"] =
        weatherData.days[0].icon;
      returnData[weatherData.days[i].datetime]["temp"] =
        weatherData.days[0].temp;
    }
    return returnData;
  } else {
    return new HttpError(response);
  }
}
