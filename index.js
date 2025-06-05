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

const urlCurrent =
  "https://api.open-meteo.com/v1/forecast?latitude=-6.18&longitude=106.8223&current=temperature_2m,is_day,weather_code&timezone=auto";

const urlDaily =
  "https://api.open-meteo.com/v1/forecast?latitude=-6.18&longitude=106.8223&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,uv_index_clear_sky_max,wind_direction_10m_dominant,wind_speed_10m_max,sunrise,sunset&timezone=auto&forecast_days=1";

const formatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const formatDate = (date) => {
  return formatter.format(date);
};

const formatDay = (date) => {
  return date.toLocaleDateString("id-ID", { weekday: "long" });
};

const getDataCurrent = async () => {
  try {
    const response = await fetch(urlCurrent);
    const dataCurrent = await response.json();
    // console.log(dataCurrent);
    const currentLocation = document.getElementById("current-location");
    currentLocation.textContent = "Jakarta";

    const currentDate = document.getElementById("current-date");
    currentDate.textContent = formatDate(new Date(dataCurrent.current.time));

    const currentDay = document.getElementById("current-day");
    currentDay.textContent = formatDay(new Date(dataCurrent.current.time));

    const currentTemp = document.getElementById("current-temp");
    currentTemp.textContent =
      dataCurrent.current.temperature_2m +
      dataCurrent.current_units.temperature_2m;

    const responseDaily = await fetch(urlDaily);
    const dataDaily = await responseDaily.json();
    console.log(dataDaily);

    const currentTempRange = document.getElementById("current-temp-range");
    currentTempRange.textContent =
      "High: " +
      dataDaily.daily.temperature_2m_max[0] +
      dataDaily.daily_units.temperature_2m_max +
      " Low: " +
      dataDaily.daily.temperature_2m_min[0] +
      dataDaily.daily_units.temperature_2m_min;
  } catch (error) {
    console.log(error);
  }
};

getDataCurrent();
