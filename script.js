// ── 1. NAV SMOOTH SCROLL ─────────────────────────────────
document.querySelectorAll(".nav-link").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ── 2. HOME BUTTON ───────────────────────────────────────
document.getElementById("home-btn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ── 3. FOOTER YEAR ───────────────────────────────────────
document.getElementById("year").textContent = new Date().getFullYear();

// ── 4. WEATHER DATA FETCH ────────────────────────────────
const weatherStatusEl = document.getElementById("weather-status");

async function getWeatherData(lat = null, lon = null) {
  const API_KEY = "YOUR_API_KEY"; // ← paste your OpenWeatherMap key here
  const url = lat && lon
    ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    : `https://api.openweathermap.org/data/2.5/weather?q=Dortmund&appid=${API_KEY}&units=metric`;

  try {
    const res  = await fetch(url);
    const data = await res.json();
    return {
      condition:   data.weather[0].main.toLowerCase(),
      description: data.weather[0].description,
      temp:        Math.round(data.main.temp),
      feels:       Math.round(data.main.feels_like),
      humidity:    data.main.humidity,
      wind:        Math.round(data.wind.speed * 3.6), // m/s → km/h
      sunrise:     data.sys.sunrise,
      sunset:      data.sys.sunset,
      now:         Math.floor(Date.now() / 1000),
      city:        data.name,
      country:     data.sys.country,
    };
  } catch (e) {
    return null;
  }
}

// ── 5. LOAD WEATHER FOR ANY LOCATION ────────────────────
async function loadWeatherForLocation(lat, lon) {
  const weather = await getWeatherData(lat, lon);
  if (!weather) return;

  const isDay = weather.now >= weather.sunrise && weather.now < weather.sunset;

  let condition = weather.condition;
  if      (condition.includes("thunder"))                         condition = "thunderstorm";
  else if (condition.includes("drizzle"))                         condition = "drizzle";
  else if (condition.includes("rain"))                            condition = "rain";
  else if (condition.includes("snow"))                            condition = "snow";
  else if (condition.includes("mist") || condition.includes("fog")) condition = "mist";
  else if (condition.includes("cloud"))                           condition = "clouds";
  else                                                            condition = "clear";

  // Update city name in card
  const cityEl = document.getElementById("wc-city");
  if (cityEl) cityEl.textContent = `📍 ${weather.city}, ${weather.country}`;

  applyWeatherTheme(condition, isDay);
  updateWeatherCard(weather);
  applyWeatherFX(condition, isDay);
  updateWeatherText(condition, weather.description, isDay);
}

// ── 6. WEATHER THEME — blob colors ───────────────────────
function applyWeatherTheme(condition, isDay) {
  const themes = {
    clear_day: {
      b1: "rgba(28,69,50,0.72)",
      b2: "rgba(180,83,9,0.75)",
      b3: "rgba(22,101,52,0.55)",
      b4: "rgba(234,88,12,0.55)",
    },
    clear_night: {
      b1: "rgba(10,30,60,0.85)",
      b2: "rgba(120,53,15,0.5)",
      b3: "rgba(15,60,35,0.45)",
      b4: "rgba(150,50,10,0.35)",
    },
    clouds_day: {
      b1: "rgba(40,60,35,0.65)",
      b2: "rgba(100,80,30,0.5)",
      b3: "rgba(30,70,40,0.5)",
      b4: "rgba(120,70,20,0.4)",
    },
    clouds_night: {
      b1: "rgba(15,25,20,0.88)",
      b2: "rgba(40,30,15,0.65)",
      b3: "rgba(10,35,20,0.6)",
      b4: "rgba(60,35,10,0.4)",
    },
    rain_day: {
      b1: "rgba(10,60,55,0.8)",
      b2: "rgba(60,40,10,0.4)",
      b3: "rgba(8,70,60,0.65)",
      b4: "rgba(80,50,10,0.3)",
    },
    rain_night: {
      b1: "rgba(5,30,28,0.92)",
      b2: "rgba(30,20,5,0.5)",
      b3: "rgba(5,40,35,0.75)",
      b4: "rgba(40,25,5,0.35)",
    },
    drizzle_day: {
      b1: "rgba(20,55,50,0.7)",
      b2: "rgba(70,50,15,0.4)",
      b3: "rgba(15,60,55,0.55)",
      b4: "rgba(90,60,15,0.3)",
    },
    drizzle_night: {
      b1: "rgba(8,28,25,0.88)",
      b2: "rgba(35,22,8,0.5)",
      b3: "rgba(6,35,30,0.7)",
      b4: "rgba(45,28,8,0.35)",
    },
    snow_day: {
      b1: "rgba(60,80,90,0.55)",
      b2: "rgba(80,70,50,0.35)",
      b3: "rgba(50,75,70,0.45)",
      b4: "rgba(90,75,55,0.3)",
    },
    snow_night: {
      b1: "rgba(20,30,45,0.85)",
      b2: "rgba(40,35,25,0.4)",
      b3: "rgba(15,35,40,0.7)",
      b4: "rgba(45,38,25,0.3)",
    },
    thunderstorm_day: {
      b1: "rgba(8,20,12,0.95)",
      b2: "rgba(160,60,5,0.7)",
      b3: "rgba(5,18,10,0.9)",
      b4: "rgba(200,70,5,0.6)",
    },
    thunderstorm_night: {
      b1: "rgba(4,10,6,0.98)",
      b2: "rgba(120,45,5,0.65)",
      b3: "rgba(3,12,7,0.95)",
      b4: "rgba(160,55,5,0.55)",
    },
    mist_day: {
      b1: "rgba(50,65,60,0.6)",
      b2: "rgba(80,65,40,0.4)",
      b3: "rgba(40,60,55,0.5)",
      b4: "rgba(85,70,40,0.35)",
    },
    mist_night: {
      b1: "rgba(18,25,22,0.85)",
      b2: "rgba(35,28,18,0.55)",
      b3: "rgba(14,22,20,0.75)",
      b4: "rgba(40,32,18,0.4)",
    },
  };

  const key = condition + "_" + (isDay ? "day" : "night");
  const t   = themes[key] || themes["clear_day"];

  let styleTag = document.getElementById("weather-style");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "weather-style";
    document.head.appendChild(styleTag);
  }

  styleTag.textContent = `
    body::before {
      background:
        radial-gradient(ellipse 420px 420px at -5% -15%, ${t.b1} 0%, transparent 70%),
        radial-gradient(ellipse 300px 300px at 95% -5%,  ${t.b2} 0%, transparent 70%),
        radial-gradient(ellipse 240px 240px at 20% 95%,  ${t.b3} 0%, transparent 70%),
        radial-gradient(ellipse 180px 180px at 90% 90%,  ${t.b4} 0%, transparent 70%);
      transition: background 2s ease;
    }
  `;
}

// ── 7. WEATHER FX — rain / snow / sun / stars etc ────────
function applyWeatherFX(condition, isDay) {
  const fx = document.getElementById("weather-fx");
  if (!fx) return;

  // Clear previous effects
  fx.innerHTML = "";

  if (condition === "rain" || condition === "drizzle") {
    const count = condition === "rain" ? 60 : 30;
    const cls   = condition === "rain" ? "rain-drop" : "drizzle-drop";
    for (let i = 0; i < count; i++) {
      const drop = document.createElement("div");
      drop.className = cls;
      drop.style.left              = Math.random() * 100 + "vw";
      drop.style.height            = (condition === "rain" ? 12 : 6) + Math.random() * 8 + "px";
      drop.style.animationDuration = 0.6 + Math.random() * 0.8 + "s";
      drop.style.animationDelay    = Math.random() * 2 + "s";
      drop.style.opacity           = 0.3 + Math.random() * 0.5 + "";
      fx.appendChild(drop);
    }

  } else if (condition === "snow") {
    for (let i = 0; i < 50; i++) {
      const flake = document.createElement("div");
      flake.className = "snow-flake";
      const size = 2 + Math.random() * 4;
      flake.style.width            = size + "px";
      flake.style.height           = size + "px";
      flake.style.left             = Math.random() * 100 + "vw";
      flake.style.animationDuration = 4 + Math.random() * 6 + "s";
      flake.style.animationDelay   = Math.random() * 5 + "s";
      flake.style.opacity          = 0.4 + Math.random() * 0.6 + "";
      fx.appendChild(flake);
    }

  } else if (condition === "thunderstorm") {
    // Heavy rain
    for (let i = 0; i < 70; i++) {
      const drop = document.createElement("div");
      drop.className = "rain-drop";
      drop.style.left              = Math.random() * 100 + "vw";
      drop.style.height            = 14 + Math.random() * 10 + "px";
      drop.style.animationDuration = 0.4 + Math.random() * 0.5 + "s";
      drop.style.animationDelay    = Math.random() * 2 + "s";
      drop.style.opacity           = 0.5 + Math.random() * 0.4 + "";
      fx.appendChild(drop);
    }
    // Screen flash
    const flash = document.createElement("div");
    flash.className = "lightning";
    flash.style.animationDuration = 4 + Math.random() * 6 + "s";
    flash.style.animationDelay    = Math.random() * 3 + "s";
    fx.appendChild(flash);
    // Bolts
    for (let i = 0; i < 3; i++) {
      const bolt = document.createElement("div");
      bolt.className = "thunder-bolt";
      bolt.style.left              = 20 + Math.random() * 60 + "vw";
      bolt.style.height            = 120 + Math.random() * 200 + "px";
      bolt.style.animationDuration = 5 + Math.random() * 5 + "s";
      bolt.style.animationDelay    = i * 1.5 + Math.random() * 2 + "s";
      fx.appendChild(bolt);
    }

  } else if (condition === "clear" && isDay) {
    // Sun glow
    const core = document.createElement("div");
    core.className = "sun-core";
    core.style.animationDuration = "4s";
    fx.appendChild(core);
    // Rotating rays
    for (let i = 0; i < 12; i++) {
      const ray = document.createElement("div");
      ray.className = "sun-ray";
      ray.style.setProperty("--start-angle", (i * 30) + "deg");
      ray.style.animationDuration = 12 + Math.random() * 6 + "s";
      ray.style.animationDelay    = Math.random() * 2 + "s";
      fx.appendChild(ray);
    }

  } else if (condition === "clear" && !isDay) {
    // Twinkling stars
    for (let i = 0; i < 80; i++) {
      const star = document.createElement("div");
      star.className = "star";
      const size = 1 + Math.random() * 2.5;
      star.style.width             = size + "px";
      star.style.height            = size + "px";
      star.style.top               = Math.random() * 70 + "vh";
      star.style.left              = Math.random() * 100 + "vw";
      star.style.animationDuration = 2 + Math.random() * 3 + "s";
      star.style.animationDelay    = Math.random() * 4 + "s";
      fx.appendChild(star);
    }

  } else if (condition === "clouds") {
    // Drifting cloud puffs
    for (let i = 0; i < 6; i++) {
      const puff = document.createElement("div");
      puff.className = "cloud-puff";
      const size = 150 + Math.random() * 200;
      puff.style.width             = size + "px";
      puff.style.height            = size * 0.6 + "px";
      puff.style.top               = Math.random() * 50 + "vh";
      puff.style.animationDuration = 30 + Math.random() * 30 + "s";
      puff.style.animationDelay    = Math.random() * 10 + "s";
      fx.appendChild(puff);
    }

  } else if (condition === "mist" || condition === "fog") {
    // Drifting mist layers
    for (let i = 0; i < 4; i++) {
      const mist = document.createElement("div");
      mist.className = "mist-layer";
      const size = 200 + Math.random() * 200;
      mist.style.height            = size + "px";
      mist.style.top               = 10 + i * 20 + "vh";
      mist.style.animationDuration = 6 + Math.random() * 6 + "s";
      mist.style.animationDelay    = Math.random() * 3 + "s";
      fx.appendChild(mist);
    }
  }
}

// ── 8. WEATHER CARD — fills all card fields ───────────────
function updateWeatherCard(weather) {
  const isDay = weather.now >= weather.sunrise && weather.now < weather.sunset;

  // Temperature + condition
  const tempEl = document.getElementById("wc-temp");
  const condEl = document.getElementById("wc-condition");
  if (tempEl) tempEl.textContent = weather.temp + "°C";
  if (condEl) condEl.textContent = weather.description;

  // Stats
  const humEl  = document.getElementById("wc-humidity");
  const windEl = document.getElementById("wc-wind");
  const feelEl = document.getElementById("wc-feels");
  if (humEl)  humEl.textContent  = weather.humidity;
  if (windEl) windEl.textContent = weather.wind;
  if (feelEl) feelEl.textContent = weather.feels;

  // Sunrise / sunset times
  const fmt = (unix) => {
    const d = new Date(unix * 1000);
    return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  };
  const srEl = document.getElementById("wc-sunrise");
  const ssEl = document.getElementById("wc-sunset");
  if (srEl) srEl.textContent = fmt(weather.sunrise);
  if (ssEl) ssEl.textContent = fmt(weather.sunset);

  // Day progress bar
  const total   = weather.sunset - weather.sunrise;
  const elapsed = Math.max(0, Math.min(weather.now - weather.sunrise, total));
  const pct     = isDay ? Math.round((elapsed / total) * 100) : 0;
  const fillEl  = document.getElementById("wc-fill");
  const dotEl   = document.getElementById("wc-dot");
  if (fillEl) fillEl.style.width = pct + "%";
  if (dotEl)  dotEl.style.left   = pct + "%";

  // Last updated time
  const updEl = document.getElementById("wc-updated");
  if (updEl) {
    const now = new Date();
    updEl.textContent = "Updated at " + now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  }
}

// ── 9. WEATHER MOOD TEXT ─────────────────────────────────
function updateWeatherText(condition, description, isDay) {
  if (!weatherStatusEl) return;
  const messages = {
    clear:        isDay ? "Bright and clear — sharp thinking weather." : "Clear night — perfect for late-night analysis.",
    clouds:       isDay ? "Overcast skies — ideal for deep focus." : "Cloudy night — quiet and thoughtful.",
    rain:         isDay ? "Rainy in Dortmund — time to dive into the data." : "Raining outside — best work happens on nights like this.",
    drizzle:      "Light drizzle — steady and focused.",
    snow:         "Snow outside — rare and calm. Good day for bold decisions.",
    thunderstorm: "Storm rolling in — high energy, high output.",
    mist:         "Misty morning — clarity comes through the data.",
    fog:          "Foggy out there — the numbers never lie though.",
  };
  weatherStatusEl.textContent = messages[condition] || `${description}.`;
}

// ── 10. SPECIAL DAY CHECK ────────────────────────────────
function isSpecialDay() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day   = today.getDate();
  if (month === 1  && day === 1)  return "New Year";
  if (month === 8  && day === 19) return "Your Birthday"; // ← update to your real birthday
  return null;
}

function applySpecialDayTheme(label) {
  let styleTag = document.getElementById("weather-style");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "weather-style";
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = `
    body::before {
      background:
        radial-gradient(ellipse 420px 420px at -5% -15%, rgba(180,130,0,0.75) 0%, transparent 70%),
        radial-gradient(ellipse 300px 300px at 95% -5%,  rgba(200,50,10,0.6)  0%, transparent 70%),
        radial-gradient(ellipse 240px 240px at 20% 95%,  rgba(160,100,0,0.55) 0%, transparent 70%),
        radial-gradient(ellipse 180px 180px at 90% 90%,  rgba(220,80,0,0.45)  0%, transparent 70%);
      transition: background 2s ease;
    }
  `;
  if (weatherStatusEl) weatherStatusEl.textContent = `Special day: ${label} 🎉`;
}

// ── 11. INIT — ties everything together ──────────────────
async function initWeatherAndTheme() {
  const special = isSpecialDay();
  if (special) {
    applySpecialDayTheme(special);
    return;
  }

  const weather = await getWeatherData();

  if (!weather) {
    // Fallback to time-based if API fails
    const hour            = new Date().getHours();
    const fallbackCond    = hour >= 7 && hour < 17 ? "clear" : hour >= 17 && hour < 21 ? "clouds" : "rain";
    const isDay           = hour >= 7 && hour < 20;
    applyWeatherTheme(fallbackCond, isDay);
    applyWeatherFX(fallbackCond, isDay);
    updateWeatherText(fallbackCond, "", isDay);
    return;
  }

  const isDay = weather.now >= weather.sunrise && weather.now < weather.sunset;

  let condition = weather.condition;
  if      (condition.includes("thunder"))                           condition = "thunderstorm";
  else if (condition.includes("drizzle"))                           condition = "drizzle";
  else if (condition.includes("rain"))                              condition = "rain";
  else if (condition.includes("snow"))                              condition = "snow";
  else if (condition.includes("mist") || condition.includes("fog")) condition = "mist";
  else if (condition.includes("cloud"))                             condition = "clouds";
  else                                                              condition = "clear";

  applyWeatherTheme(condition, isDay);
  updateWeatherCard(weather);
  applyWeatherFX(condition, isDay);
  updateWeatherText(condition, weather.description, isDay);
}

initWeatherAndTheme();

// ── 12. LOCATION BUTTON ──────────────────────────────────
const locateBtn = document.getElementById("wc-locate-btn");

if (locateBtn) {
  locateBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Your browser doesn't support location access.");
      return;
    }

    locateBtn.textContent = "⏳ Locating...";
    locateBtn.classList.add("loading");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await loadWeatherForLocation(latitude, longitude);
        locateBtn.textContent = "✓ Your location";
        locateBtn.classList.remove("loading");
        locateBtn.classList.add("active");
        localStorage.setItem("wx-lat", latitude);
        localStorage.setItem("wx-lon", longitude);
      },
      (err) => {
        locateBtn.textContent = "⊙ Use my location";
        locateBtn.classList.remove("loading");
        if (err.code === 1) {
          alert("Location access denied. Showing Dortmund weather instead.");
        } else {
          alert("Couldn't get your location. Showing Dortmund weather instead.");
        }
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  });

  // Auto-load saved location on page load
  const savedLat = localStorage.getItem("wx-lat");
  const savedLon = localStorage.getItem("wx-lon");
  if (savedLat && savedLon) {
    loadWeatherForLocation(parseFloat(savedLat), parseFloat(savedLon));
    locateBtn.textContent = "✓ Your location";
    locateBtn.classList.add("active");
  }
}

// ── 13. SCHEDULE BUTTON ──────────────────────────────────
const scheduleButton = document.getElementById("schedule-button");
if (scheduleButton) {
  scheduleButton.addEventListener("click", () => {
    window.open("https://calendly.com/", "_blank");
  });
}
