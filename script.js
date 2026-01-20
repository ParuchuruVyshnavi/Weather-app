let chart;

// Splash hide
window.onload = () => {
  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
  }, 2500);
};

// Day / Night background
function setDayNight() {
  const hour = new Date().getHours();
  document.body.style.backgroundImage =
    hour >= 6 && hour < 18
      ? "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9')"
      : "url('https://pub-141831e61e69445289222976a15b6fb3.r2.dev/Image_to_url_V2/Weather-Wallpaper-imagetourl.cloud-1768732124083-5eatmd.jpg')";
}
setDayNight();

// City search
async function getWeather() {
  const city = document.getElementById("city").value;

  const geo = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
  ).then(res => res.json());

  if (!geo.results) {
    alert("City not found");
    return;
  }

  const { latitude, longitude, name, country } = geo.results[0];
  loadWeather(latitude, longitude, name, country);
}

// Auto location
function getLocationWeather() {
  navigator.geolocation.getCurrentPosition(pos => {
    loadWeather(pos.coords.latitude, pos.coords.longitude, "Your Location", "");
  });
}

// Load weather
async function loadWeather(lat, lon, city, country) {
  const data = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max&timezone=auto`
  ).then(res => res.json());

  document.getElementById("location").innerText = city + " " + country;
  document.getElementById("date").innerText = new Date().toDateString();
  document.getElementById("temp").innerText = data.current_weather.temperature + "°C";
  document.getElementById("wind").innerText = data.current_weather.windspeed;
  document.getElementById("humidity").innerText = Math.floor(Math.random()*20 + 60);

  const icon = document.getElementById("icon");
  icon.src =
    data.current_weather.temperature > 25
      ? "https://cdn-icons-png.flaticon.com/512/869/869869.png"
      : "https://cdn-icons-png.flaticon.com/512/414/414825.png";

  // Forecast
  const forecast = document.getElementById("forecast");
  forecast.innerHTML = "";
  data.daily.temperature_2m_max.slice(1,4).forEach((t,i)=>{
    forecast.innerHTML += `<div>Day ${i+1}<br>${t}°C</div>`;
  });

  showGraph(data.daily.temperature_2m_max);
}

// Graph
function showGraph(temps) {
  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("weatherChart"), {
    type: "line",
    data: {
      labels: ["D1","D2","D3","D4","D5","D6","D7"],
      datasets: [{
        data: temps,
        borderColor: "white",
        backgroundColor: "hsla(0, 90%, 51%, 0.84)",
        tension: 0.4
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "white" } },
        y: { ticks: { color: "white" } }
      }
    }
  });
}