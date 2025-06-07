const checkbox = document.getElementById("toggle-degree");
const dot = document.getElementById("dot");

checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    dot.style.transform = "translateX(30px)";
  } else {
    dot.style.transform = "translateX(0)";
  }
});

if (checkbox.checked) {
  dot.style.transform = "translateX(30px)";
}

const toggleDark = document.getElementById("toggle-dark");

toggleDark.addEventListener("change", function () {
  document.documentElement.classList.toggle("dark");
});

// const getLocationOnLoad = () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const lat = position.coords.latitude;
//         const lon = position.coords.longitude;

//         try {
//           // Dapatkan nama kota dari OpenCage
//           const response = await fetch(
//             `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=1f191637f9e8463f8c43bef4536e84e8`
//           );
//           const data = await response.json();
//           const cityName =
//             data.results[0].components.city ||
//             data.results[0].components.town ||
//             data.results[0].components.village ||
//             "Lokasi Anda";

//           await getDataCurrent(lat, lon, cityName);
//           await getDataForecast(lat, lon);
//         } catch (error) {
//           console.log("Gagal mengambil data berdasarkan lokasi:", error);
//         }
//       },
//       (error) => {
//         console.log("Gagal mendapatkan lokasi pengguna:", error);
//       }
//     );
//   } else {
//     console.log("Geolocation tidak didukung oleh browser ini.");
//   }
// };

// getLocationOnLoad();

const urlGetLatLon = (value) => {
  return `https://api.opencagedata.com/geocode/v1/json?q=${value}&key=1f191637f9e8463f8c43bef4536e84e8`;
};

const searchAndUpdateWeather = async (cityName) => {
  const url = urlGetLatLon(cityName);
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    // if error buat nanti disini

    const latData = data.results[0].geometry.lat;
    const lonData = data.results[0].geometry.lng;
    const cityNameData =
      data.results[0].components.city ||
      data.results[0].components.state ||
      data.results[0].components.village ||
      "Lokasi Anda";

    await getDataCurrent(latData, lonData, cityNameData);
    await getDataForecast(latData, lonData);
  } catch (error) {
    console.log(error);
  }
};

document
  .getElementById("searchbar")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const city = event.target.value;
      searchAndUpdateWeather(city);
      document.getElementById("searchbar").value = "";
    }
  });

document.getElementById("search-btn").addEventListener("click", function () {
  const city = document.getElementById("searchbar").value;
  searchAndUpdateWeather(city);
  document.getElementById("searchbar").value = "";
});

const urlCurrent = (latData, lonData) => {
  return `https://api.open-meteo.com/v1/forecast?latitude=${latData}&longitude=${lonData}&current=temperature_2m,is_day,weather_code&timezone=auto`;
};

const urlDaily = (latData, lonData) => {
  return `https://api.open-meteo.com/v1/forecast?latitude=${latData}&longitude=${lonData}&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,uv_index_clear_sky_max,wind_direction_10m_dominant,wind_speed_10m_max,sunrise,sunset&timezone=auto&forecast_days=1`;
};

const formatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const formatDate = (date) => {
  return formatter.format(date);
};

const formatDay = (date) => {
  return date.toLocaleDateString("en-ID", { weekday: "long" });
};

const formatTime = (date) => {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDayDuration = (sunrise, sunset) => {
  const sunriseDate = new Date(sunrise);
  const sunsetDate = new Date(sunset);
  const duration = sunsetDate - sunriseDate;

  const totalMinutes = Math.floor(duration / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}.${minutes}`;
};

const weatherCodeDetails = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing Rime fog",
  51: "Drizzle Light",
  53: "Drizzle Moderate",
  55: "Drizzle Dense",
  56: "Freezing Drizzle Light",
  57: "Freezing Drizzle Dense ",
  61: "Slight Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  66: "Freezing Light Rain",
  67: "Freezing Heavy Rain",
  71: "Slight Snow fall",
  73: "Moderate Snow fall",
  75: "Heavy Snow fall",
  77: "Snow grains",
  80: "Slight Rain showers",
  81: "Moderate Rain showers",
  82: "Heavy Rain showers",
  85: "Slight Snow showers",
  86: "Heavy Snow showers",
  95: "Slight Thunderstorm",
  96: "Slight Thunderstorm",
  99: "Heavy Thunderstorm",
};

const getDataCurrent = async (latData, lonData, cityName) => {
  try {
    const response = await fetch(urlCurrent(latData, lonData));
    const dataCurrent = await response.json();

    const currentLocation = document.getElementById("current-location");
    currentLocation.textContent = cityName;

    const currentDate = document.getElementById("current-date");
    currentDate.textContent = formatDate(new Date(dataCurrent.current.time));

    const currentDay = document.getElementById("current-day");
    currentDay.textContent = formatDay(new Date(dataCurrent.current.time));

    const currentTemp = document.getElementById("current-temp");
    currentTemp.textContent =
      dataCurrent.current.temperature_2m +
      " " +
      dataCurrent.current_units.temperature_2m;

    const responseDaily = await fetch(urlDaily(latData, lonData));
    const dataDaily = await responseDaily.json();

    const sunrise = document.getElementById("sunrise");
    sunrise.textContent = formatTime(new Date(dataDaily.daily.sunrise[0]));

    const sunset = document.getElementById("sunset");
    sunset.textContent = formatTime(new Date(dataDaily.daily.sunset[0]));

    const lengthDay = document.getElementById("wind-direction");
    lengthDay.innerHTML = `<img src="./assets/wind-direction.png" alt="weather-code" class="h-12 rotate-[${dataDaily.daily.wind_direction_10m_dominant[0]}deg]" />
    <h1  class="text-xl">${dataDaily.daily.wind_speed_10m_max[0]} ${dataDaily.daily_units.wind_speed_10m_max}</h1>
    `;

    const uvIndex = document.getElementById("uv-index");
    uvIndex.textContent = `${dataDaily.daily.uv_index_max[0]}`;

    const currentTempRange = document.getElementById("current-temp-range");
    currentTempRange.textContent =
      "High: " +
      dataDaily.daily.temperature_2m_max[0] +
      dataDaily.daily_units.temperature_2m_max +
      " Low: " +
      dataDaily.daily.temperature_2m_min[0] +
      dataDaily.daily_units.temperature_2m_min;

    const currentWeather = document.getElementById("current-weather");
    currentWeather.innerHTML = `<img src="./assets/weather-code/${dataDaily.daily.weather_code[0]}.png" alt="weather-code" class="h-52" />`;

    const currentWeatherDescription = document.getElementById(
      "current-weather-description"
    );
    currentWeatherDescription.textContent =
      weatherCodeDetails[dataDaily.daily.weather_code[0]];
  } catch (error) {
    console.log(error);
  }
};

const urlForecast = (latData, lonData) => {
  return `https://api.open-meteo.com/v1/forecast?latitude=${latData}&longitude=${lonData}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`;
};

const getDataForecast = async (latData, lonData) => {
  try {
    const response = await fetch(urlForecast(latData, lonData));
    const data = await response.json();

    const forecastContainer = document.getElementById("forecast-container");
    forecastContainer.innerHTML = "";

    data.daily.time.forEach((time, index) => {
      const averageTemp = Number(
        (data.daily.temperature_2m_max[index] +
          data.daily.temperature_2m_min[index]) /
          2
      ).toFixed(1);
      const forecastItem = document.createElement("li");
      forecastItem.classList.add("border-2", "rounded-3xl", "p-2", "px-4");
      forecastItem.innerHTML = `
        <div class="flex flex-col items-center justify-center gap-2">
          <h1 class="font-semibold text-lg">${formatDay(new Date(time))}</h1>
          <p class="text-sm">${formatDate(new Date(time))}</p>
          <img src="./assets/weather-code/${
            data.daily.weather_code[index]
          }.png" alt="weather-code" class="h-16 w-16 object-cover" />
          <h1 class=" text-sm">${averageTemp} ${
        data.daily_units.temperature_2m_max
      }</h1>
          <h1 class="text-xs">H: ${data.daily.temperature_2m_max[index]}${
        data.daily_units.temperature_2m_max
      } <br/> L : ${data.daily.temperature_2m_min[index]}${
        data.daily_units.temperature_2m_min
      } </h1>
        </div>
      `;
      forecastContainer.appendChild(forecastItem);
    });

    const tomorrowItemWeatherCode = document.getElementById(
      "tomorrow-item-weather-code"
    );
    tomorrowItemWeatherCode.textContent =
      weatherCodeDetails[data.daily.weather_code[1]];

    const tomorrowItemWeatherCodeImage = document.getElementById(
      "tomorrow-item-weather-code-image"
    );
    tomorrowItemWeatherCodeImage.src = `./assets/weather-code/${data.daily.weather_code[1]}.png`;

    const tomorrowItemTemp = document.getElementById("tomorrow-item-temp");
    const averageTemp = Number(
      (data.daily.temperature_2m_max[1] + data.daily.temperature_2m_min[1]) / 2
    ).toFixed(1);
    tomorrowItemTemp.textContent =
      averageTemp + data.daily_units.temperature_2m_max;
  } catch (error) {
    console.log(error);
  }
};

// getDataCurrent(-0.9247587, 100.348441, "Jakarta");
// getDataForecast(-0.9247587, 100.348441);

const someOtherCitiesData = ["Jakarta", "Bandung", "Surabaya", "Semarang"];

const someOtherCities = document.getElementById("some-other-cities");

someOtherCitiesData.forEach((city) => {
  const cityCard = document.createElement("li");
  cityCard.innerHTML = `
    <div onclick="searchAndUpdateWeather('${city}')" class="w-auto h-auto p-4 text-white bg-slate-400 rounded-3xl cursor-pointer transition-all 0.3s hover:shadow-lg hover:shadow-gray-800 dark:hover:shadow-gray-400 active:scale-95">
    <p class="text-3xl mb-4">${city}</p>
      <div class="flex items-end mb-4">
        <h1 class="text-5xl">25°</h1>
        <p class="text-xs">H:30° L:20°</p>
      </div>
      <div class="flex justify-end relative bottom-8">
        <img src="./assets/Sun.png" alt="sun" />
      </div>
    </div>
  `;
  someOtherCities.appendChild(cityCard);
});

const allCitiesData = [
  "Yogyakarta",
  "Bali",
  "Palembang",
  "Lampung",
  "Medan",
  "Padang",
  "Pekanbaru",
  "Aceh",
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Semarang",
];

const allOtherCities = document.getElementById("all-other-cities");

allCitiesData.forEach((city) => {
  const cityCard = document.createElement("li");
  cityCard.innerHTML = `
    <div onclick="closeModalAllCity();searchAndUpdateWeather('${city}')" class="w-auto h-auto p-4 text-white bg-slate-400 rounded-3xl cursor-pointer transition-all 0.3s hover:shadow-lg hover:shadow-gray-800 dark:hover:shadow-gray-400 active:scale-95">
    <p class="text-3xl mb-4">${city}</p>
      <div class="flex items-end mb-4">
        <h1 class="text-5xl">25°</h1>
        <p class="text-xs">H:30° L:20°</p>
      </div>
      <div class="flex justify-end relative bottom-8">
        <img src="./assets/Sun.png" alt="sun" />
      </div>
    </div>
  `;
  allOtherCities.appendChild(cityCard);
});

const modalOverlay = document.getElementById("modal-overlay");

const showModalAllCity = () => {
  modalOverlay.classList.remove("hidden");
  modalOverlay.classList.add("flex");
};

const closeModalAllCity = () => {
  modalOverlay.classList.add("hidden");
  modalOverlay.classList.remove("flex");
};
