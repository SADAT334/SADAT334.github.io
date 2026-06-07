// Smooth scroll for nav buttons
document.querySelectorAll(".nav-link").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Weather + special day background logic
const weatherStatusEl = document.getElementById("weather-status");

// Simple mapping for background based on "weather"
function applyWeatherTheme(weather) {
  const body = document.body;

  if (weather === "sunny") {
    body.style.background = "radial-gradient(circle at top, #f5f5f5 0, #0f1012 55%)";
  } else if (weather === "cloudy") {
    body.style.background = "linear-gradient(135deg, #1b1d22, #0f1012)";
  } else if (weather === "rainy") {
    body.style.background = "linear-gradient(160deg, #111318, #050608)";
  } else {
    body.style.background = "#0f1012";
  }
}

// Special days (example: your birthday, New Year, etc.)
function isSpecialDay() {
  const today = new Date();
  const month = today.getMonth() + 1; // 1–12
  const day = today.getDate();

  // Example: New Year
  if (month === 1 && day === 1) return "New Year";

  // Example: your birthday (change to your real date)
  if (month === 7 && day === 15) return "Your Birthday";

  return null;
}

function applySpecialDayTheme(label) {
  const body = document.body;
  body.style.background = `radial-gradient(circle at top, var(--special-day) 0, #0f1012 55%)`;
  if (weatherStatusEl) {
    weatherStatusEl.textContent = `Special day: ${label} 🎉`;
  }
}

// Dummy weather fetch (replace later with real API)
function getDummyWeather() {
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 17) return "sunny";
  if (hour >= 17 && hour < 21) return "cloudy";
  return "rainy";
}

function initWeatherAndTheme() {
  const special = isSpecialDay();
  if (special) {
    applySpecialDayTheme(special);
    return;
  }

  const weather = getDummyWeather();
  applyWeatherTheme(weather);

  if (weatherStatusEl) {
    if (weather === "sunny") {
      weatherStatusEl.textContent = "Bright and clear—perfect for bold decisions.";
    } else if (weather === "cloudy") {
      weatherStatusEl.textContent = "Soft light, thoughtful mood—ideal for deep analysis.";
    } else if (weather === "rainy") {
      weatherStatusEl.textContent = "Quiet and focused—time to dive into the details.";
    } else {
      weatherStatusEl.textContent = "Weather data not available yet.";
    }
  }
}

initWeatherAndTheme();

// Schedule button (for now just opens a placeholder)
const scheduleButton = document.getElementById("schedule-button");
if (scheduleButton) {
  scheduleButton.addEventListener("click", () => {
    // Later: replace with your Calendly or a dedicated schedule page
    window.open("https://calendly.com/", "_blank");
  });
}
