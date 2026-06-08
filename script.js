// ============================================================================
// SECTION 1: SYSTEM ROUTING & NAVIGATION MANAGEMENT
// ============================================================================
// Manages viewport scrolling behavior when navigation elements are selected.

document.querySelectorAll(".nav-link").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");
    if (target) {
      const el = document.querySelector(target);
      // Smoothly scroll down to target section block alignment
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Resets viewport location smoothly to the origin top layout layer
document.getElementById("home-btn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Structural initialization of runtime environment copyright timestamp
document.getElementById("year").textContent = new Date().getFullYear();


// ============================================================================
// SECTION 2: TELEMETRY ENGINE (WEATHER REST INGESTION)
// ============================================================================
// Interrogates external API arrays to derive real-time coordinates and metrics.

const weatherStatusEl = document.getElementById("weather-status");

async function getWeatherData(query = "Dortmund") {

  //api key
  const myApiKey = "4604fcaa116446e1846170509260806";
  // Uses WeatherAPI's open configuration endpoint to circumvent local CORS proxy restrictions
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${myApiKey}&q=${encodeURIComponent(query)}&days=1&aqi=no`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Data retrieval pathway broken");
    const data = await res.json();
    
    // Normalizes regional meteorological condition categorization values
    const code = data.current.condition.code;
    let type = "clear";
    
    if ([1000].includes(code)) type = "clear";
    else if ([1003, 1006, 1009].includes(code)) type = "clouds";
    else if ([1030, 1135, 1147].includes(code)) type = "mist";
    else if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) type = "rain";
    else if ([1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) type = "snow";
    else if ([1087, 1273, 1276, 1279, 1282].includes(code)) type = "thunderstorm";

    return {
      condition: type,
      description: data.current.condition.text,
      temp: Math.round(data.current.temp_c),
      feels: Math.round(data.current.feelslike_c),
      humidity: data.current.humidity,
      wind: Math.round(data.current.wind_kph),
      sunrise: data.forecast.forecastday[0].astro.sunrise,
      sunset: data.forecast.forecastday[0].astro.sunset,
      isDay: data.current.is_day === 1,
      city: data.location.name,
      country: data.location.country
    };
  } catch (e) {
    console.error("Telemetry pipeline error:", e);
    return null;
  }
}


// ============================================================================
// SECTION 3: SYSTEM INTEGRATION CONTROLLER
// ============================================================================
// Orchestrates information dispatch from query responses out into target interface structures.

async function loadWeatherSystem(query) {
  const weather = await getWeatherData(query);
  if (!weather) return;

  const cityEl = document.getElementById("wc-city");
  if (cityEl) cityEl.textContent = `📍 ${weather.city}, ${weather.country}`;

  // Chain updates out across the DOM tree subsystems
  updateCosmicTheme(weather.condition, weather.isDay);
  updateWeatherCardData(weather);
  generateWeatherAtmosphereEffects(weather.condition);
  updateNarrativeMoodText(weather.condition, weather.description, weather.isDay);
}


// ============================================================================
// SECTION 4: COSMIC CANVAS COLOUR ENGINE (DYNAMIC ROOT CSS OVERRIDES)
// ============================================================================
// Mutates foundational CSS palette variables based on environmental telemetry rules.

function updateCosmicTheme(condition, isDay) {
  const root = document.documentElement;
  
  // Matrix dictionary matching weather configurations to space dust color codes
  const shifts = {
    clear:        { g1: "#0b2e1e", g2: "#14532d", s1: "#ea580c", s2: "#f97316" }, // Emerald to Sunset Flare
    clouds:       { g1: "#061f14", g2: "#0f3a24", s1: "#b45309", s2: "#d97706" }, // Soft Amber/Fern Muted
    rain:         { g1: "#02140d", g2: "#052e16", s1: "#7c2d12", s2: "#9a3412" }, // Storm Charcoal Woodland
    snow:         { g1: "#1e293b", g2: "#334155", s1: "#0f766e", s2: "#115e59" }, // Glacier Blue Frost
    mist:         { g1: "#0f172a", g2: "#1e293b", s1: "#4338ca", s2: "#3730a3" }, // Cosmic Twilight Void
    thunderstorm: { g1: "#020617", g2: "#0f172a", s1: "#701a75", s2: "#4a044e" }  // Dark Quasar Amethyst
  };

  const current = shifts[condition] || shifts.clear;
  
  // Directly write settings into custom property values inside CSS root element
  root.style.setProperty("--cosmic-green-1", current.g1);
  root.style.setProperty("--cosmic-green-2", current.g2);
  root.style.setProperty("--cosmic-sunset-1", current.s1);
  root.style.setProperty("--cosmic-sunset-2", current.s2);
}


// ============================================================================
// SECTION 5: ATMOSPHERIC PARTICLES CONSTRUCTOR (METEORS & WATER FX)
// ============================================================================
// Dynamically creates elements inside the background wrapper container.

function generateWeatherAtmosphereEffects(condition) {
  const fx = document.getElementById("weather-fx");
  if (!fx) return;
  fx.innerHTML = ""; // Wipe existing elements clean to prevent memory leaks

  // Always retain an underlying baseline flow of cosmic shooting stars
  const starCount = condition === "clear" ? 15 : 6;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.className = "shooting-star";
    star.style.top = Math.random() * 50 + "vh";
    star.style.left = Math.random() * 80 + "vw";
    star.style.animationDelay = Math.random() * 8 + "s";
    star.style.animationDuration = 1.5 + Math.random() * 2 + "s";
    fx.appendChild(star);
  }

  // Branch particle initialization depending on current global constraints
  if (condition === "rain") {
    for (let i = 0; i < 50; i++) {
      const drop = document.createElement("div");
      drop.className = "cosmic-rain";
      drop.style.left = Math.random() * 100 + "vw";
      drop.style.animationDelay = Math.random() * 2 + "s";
      drop.style.animationDuration = 0.5 + Math.random() * 0.5 + "s";
      fx.appendChild(drop);
    }
  } else if (condition === "thunderstorm") {
    const flash = document.createElement("div");
    flash.className = "nebula-lightning";
    fx.appendChild(flash);
  } else if (condition === "snow") {
    for (let i = 0; i < 35; i++) {
      const flake = document.createElement("div");
      flake.className = "cosmic-snow";
      flake.style.left = Math.random() * 100 + "vw";
      flake.style.animationDelay = Math.random() * 4 + "s";
      flake.style.animationDuration = 3 + Math.random() * 4 + "s";
      fx.appendChild(flake);
    }
  } else if (condition === "clouds") {
    for (let i = 0; i < 3; i++) {
      const cloud = document.createElement("div");
      cloud.className = "cosmic-dust-cloud";
      cloud.style.top = 15 + Math.random() * 40 + "vh";
      cloud.style.animationDuration = 20 + Math.random() * 20 + "s";
      fx.appendChild(cloud);
    }
  }
}


// ============================================================================
// SECTION 6: DOM RENDER CONTROLLER (UI INJECTION)
// ============================================================================
// Map values smoothly into user-facing presentation containers.

function updateWeatherCardData(weather) {
  const tempEl = document.getElementById("wc-temp");
  const condEl = document.getElementById("wc-condition");
  if (tempEl) tempEl.textContent = weather.temp + "°C";
  if (condEl) condEl.textContent = weather.description;

  if (document.getElementById("wc-humidity")) document.getElementById("wc-humidity").textContent = weather.humidity;
  if (document.getElementById("wc-wind")) document.getElementById("wc-wind").textContent = weather.wind;
  if (document.getElementById("wc-feels")) document.getElementById("wc-feels").textContent = weather.feels;
  
  if (document.getElementById("wc-sunrise")) document.getElementById("wc-sunrise").textContent = weather.sunrise;
  if (document.getElementById("wc-sunset")) document.getElementById("wc-sunset").textContent = weather.sunset;

  // Process timeline markers for solar position track bar
  const fillEl = document.getElementById("wc-fill");
  const dotEl = document.getElementById("wc-dot");
  if (fillEl && dotEl) {
    fillEl.style.width = weather.isDay ? "65%" : "0%";
    dotEl.style.left = weather.isDay ? "65%" : "0%";
  }

  // Inject system timestamp signature confirmation notice
  const updEl = document.getElementById("wc-updated");
  if (updEl) {
    updEl.textContent = "Telemetry synced: " + new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  }
}

function updateNarrativeMoodText(condition, description, isDay) {
  if (!weatherStatusEl) return;
  const metrics = {
    clear: isDay ? "Atmosphere clear. Peak processing clarity achieved." : "Midnight orbit active. Excellent alignment for system deep-dives.",
    clouds: "Cosmic dust screening active. Perfect conditions for data structuring.",
    rain: "Precipitation channels open. Fluid logical integration underway.",
    snow: "Thermal dip. Steady execution pathways running perfectly.",
    mist: "Nebula cloud cover. Navigating vectors smoothly via raw metrics.",
    thunderstorm: "High atmospheric charge. Exponential energy pathways initialized."
  };
  weatherStatusEl.textContent = metrics[condition] || `${description}. System operational.`;
}


// ============================================================================
// SECTION 7: CORE GEOLOCATION TRACKING SYSTEMS
// ============================================================================
// Handles interactive positioning coordination requests.

const locateBtn = document.getElementById("wc-locate-btn");
if (locateBtn) {
  locateBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Location protocol missing in browser architecture.");
      return;
    }
    locateBtn.textContent = "⏳ Interrogating Position...";
    
    // Request localized coordinate vectors from hardware endpoints
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const queryStr = `${pos.coords.latitude},${pos.coords.longitude}`;
        await loadWeatherSystem(queryStr);
        locateBtn.textContent = "✓ Local Horizon Matched";
        localStorage.setItem("cosmic-location", queryStr); // Cache spatial data location references
      },
      () => {
        alert("Location response timed out. Falling back to Dortmund Standard Vector.");
        locateBtn.textContent = "⊙ Standard Vector";
      }
    );
  });
}


// ============================================================================
// SECTION 8: APPLICATION EXECUTION INITIALIZER
// ============================================================================
// Cold starts engine operation immediately upon environment load completion.

const activeHorizon = localStorage.getItem("cosmic-location") || "Dortmund";
loadWeatherSystem(activeHorizon);

const scheduleButton = document.getElementById("schedule-button");
if (scheduleButton) {
  scheduleButton.addEventListener("click", () => {
    window.open("https://calendly.com/", "_blank");
  });
}
