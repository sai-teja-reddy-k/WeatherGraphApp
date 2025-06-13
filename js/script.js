// ✅ API Key (use your own key from https://openweathermap.org/api)
const apiKey = "69a05f8eb616917bc4cd76a69a6394e2";

// 🎯 Get DOM Elements
const fetchBtn = document.getElementById("fetchBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const chartCanvas = document.getElementById("weatherChart");
let weatherChart = null;

// 📊 Arrow Function: Render Chart with temperature
const renderChart = (label, temp) => {
  if (weatherChart) weatherChart.destroy(); // clear previous chart

  weatherChart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels: [label],
      datasets: [
        {
          label: "🌡 Temperature (°C)",
          data: [temp],
          backgroundColor: "#42a5f5",
          borderRadius: 10,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
};

// 🔁 Function: Convert Kelvin → Celsius
const kelvinToCelsius = (k) => (k - 273.15).toFixed(2);

// 🔄 Async Function: Fetch Weather
const fetchWeather = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      weatherInfo.innerHTML = `❌ City not found! Try again.`;
      if (weatherChart) weatherChart.destroy();
      return;
    }

    const temp = kelvinToCelsius(data.main.temp);
    const weather = data.weather[0].main;

    weatherInfo.innerHTML = `
      <strong>${data.name}</strong><br>
      ${weather} | 🌡 ${temp} °C
    `;

    renderChart(data.name, temp);
  } catch (err) {
    console.error(err);
    weatherInfo.innerHTML = "⚠️ Error fetching data.";
  }
};

// 🧠 Add Click Event using Arrow Function
fetchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") {
    weatherInfo.innerHTML = "⚠️ Please enter a city name.";
    return;
  }
  fetchWeather(city);
});
