// ============================================================================
// SECTION 1: GLOBAL SITE NAV AND TIME ZONE TARGETING
// ============================================================================
// Manages smooth scrolling behaviors across various section wrapper tags safely.

document.querySelectorAll(".nav-link").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const target = btn.getAttribute("data-target");
    
    // 💡 THE ESSENTIAL FIX: Only intercept the click if data-target exists!
    if (target) {
      e.preventDefault(); // Prevents any default jumping bugs
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    // If target is null (Projects, Blog, Gallery), this block is skipped,
    // allowing the browser to smoothly navigate to the respective pages.
  });
});

document.getElementById("home-btn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Automatically keeps your footer year perfectly up to date
document.getElementById("year").textContent = new Date().getFullYear();


// ============================================================================
// SECTION 2: TELEMETRY ENGINE (WEATHER REST INGESTION)
// ============================================================================
// Queries external API channels to retrieve local weather data safely.

const weatherStatusEl = document.getElementById("weather-status");

async function getWeatherData(query = "Dortmund") {
  // Your authenticated WeatherAPI system key access credential
  const myApiKey = "4604fcaa116446e1846170509260806";
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${myApiKey}&q=${encodeURIComponent(query)}&days=1&aqi=no`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network response encountered operational fault");
    const data = await res.json();
    
    const code = data.current.condition.code;
    let type = "clear";
    
    // Simplifies structural code nodes down into our semantic weather style buckets
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
    console.error("Telemetry Pipeline Interrupted gracefully:", e);
    return null;
  }
}


// ============================================================================
// SECTION 3: WEB SYSTEM RENDER FORWARDER
// ============================================================================
// Dispatches async metrics payloads across independent DOM tracking nodes.

async function loadWeatherSystem(query) {
  const weather = await getWeatherData(query);
  if (!weather) return;

  const cityEl = document.getElementById("wc-city");
  if (cityEl) cityEl.textContent = `📍 ${weather.city}, ${weather.country}`;

  updateCosmicThemeColors(weather.condition, weather.isDay);
  updateWeatherCardData(weather);
  generateWeatherAtmosphereEffects(weather.condition);
  updateNarrativeMoodText(weather.condition, weather.description, weather.isDay);
}


// ============================================================================
// SECTION 4: COSMIC CANVAS COLOUR ENGINE (DYNAMIC ROOT CSS VARIABLE VARIABLE SHIFTS)
// ============================================================================
// Smoothly updates variable palettes based on the weather conditions of the target city.

function updateCosmicThemeColors(condition, isDay) {
  const root = document.documentElement;
  
  const shifts = {
    clear:        { nebula: "#134e4a", auroraTop: "#0d9488", auroraBottom: "#a855f7" }, // Teal to Vivid Violet
    clouds:       { nebula: "#1e1b4b", auroraTop: "#4338ca", auroraBottom: "#6366f1" }, // Moody Indigo Velvet
    rain:         { nebula: "#06201b", auroraTop: "#0f766e", auroraBottom: "#475569" }, // Dark Sage and Charcoal Storm
    snow:         { nebula: "#0f172a", auroraTop: "#115e59", auroraBottom: "#cbd5e1" }, // Ice Glacier Mint Core
    mist:         { nebula: "#020617", auroraTop: "#312e81", auroraBottom: "#1e1b4b" }, // Absolute Midnight Fog
    thunderstorm: { nebula: "#172554", auroraTop: "#581c87", auroraBottom: "#b45309" }  // Volatile Dark Electric Amber
  };

  const current = shifts[condition] || shifts.clear;
  
  root.style.setProperty("--dynamic-nebula-glow", current.nebula);
  root.style.setProperty("--dynamic-aurora-top", current.auroraTop);
  root.style.setProperty("--dynamic-aurora-bottom", current.auroraBottom);
}


// ============================================================================
// SECTION 5: INTERSTELLAR ATMOSPHERIC PARTICLES CONSTRUCTOR
// ============================================================================
// Spawns rich background physics particles (rain, snow, shooting stars) over the design layout.

function generateWeatherAtmosphereEffects(condition) {
  const fx = document.getElementById("weather-fx");
  if (!fx) return;
  fx.innerHTML = ""; // Flushes old HTML loops out to keep memory clear

  // 🌠 HIGH DENSITY SHOOTING STARS: Spawns constant aesthetic cascades across all weather states
  const starCount = condition === "clear" ? 18 : 8;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.className = "shooting-star";
    star.style.top = Math.random() * 45 + "vh";
    star.style.left = Math.random() * 85 + "vw";
    star.style.animationDelay = Math.random() * 7 + "s";
    star.style.animationDuration = 1.2 + Math.random() * 1.8 + "s";
    fx.appendChild(star);
  }

  // Spawns custom secondary weather overlays depending on the current state
  if (condition === "rain") {
    for (let i = 0; i < 45; i++) {
      const drop = document.createElement("div");
      drop.className = "cosmic-rain";
      drop.style.left = Math.random() * 100 + "vw";
      drop.style.animationDelay = Math.random() * 1.5 + "s";
      drop.style.animationDuration = 0.4 + Math.random() * 0.4 + "s";
      fx.appendChild(drop);
    }
  } else if (condition === "thunderstorm") {
    const flash = document.createElement("div");
    flash.className = "nebula-lightning";
    fx.appendChild(flash);
  } else if (condition === "snow") {
    for (let i = 0; i < 30; i++) {
      const flake = document.createElement("div");
      flake.className = "cosmic-snow";
      flake.style.left = Math.random() * 100 + "vw";
      flake.style.animationDelay = Math.random() * 3 + "s";
      flake.style.animationDuration = 3.5 + Math.random() * 3.5 + "s";
      fx.appendChild(flake);
    }
  }
}


// ============================================================================
// SECTION 6: DATA MAPPING LOGIC LAYER
// ============================================================================
// Securely inputs normalized telemetry items directly into target card elements.

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

  const fillEl = document.getElementById("wc-fill");
  const dotEl = document.getElementById("wc-dot");
  if (fillEl && dotEl) {
    fillEl.style.width = weather.isDay ? "65%" : "0%";
    dotEl.style.left = weather.isDay ? "65%" : "0%";
  }

  const updEl = document.getElementById("wc-updated");
  if (updEl) {
    updEl.textContent = "Synced: " + new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  }
}

function updateNarrativeMoodText(condition, description, isDay) {
  if (!weatherStatusEl) return;
  const metrics = {
    clear: isDay ? "Sky transparent. Optimal parameters for strategic planning data mapping." : "Night cycle stabilized. Excellent window for deep architectural engineering loops.",
    clouds: "Interstellar cloud density high. Excellent atmospheric conditions for analytics.",
    rain: "Precipitation lines tracking fluidly. Systems running smoothly.",
    snow: "Thermal drop registered. Crystal clear data execution pipeline active.",
    mist: "Nebula dust tracking across local sensors. Navigating matrix via structural metrics.",
    thunderstorm: "High atmospheric energy matrix detected. Exponential logic execution loops running."
  };
  weatherStatusEl.textContent = metrics[condition] || `${description}. Core systems operational.`;
}


// ============================================================================
// SECTION 7: HARDWARE GEOLOCATION ACCESS PATHWAYS
// ============================================================================
// Captures user coordinates to dynamically adjust the site's environment.

const locateBtn = document.getElementById("wc-locate-btn");
if (locateBtn) {
  locateBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Spatial tracking missing in current architecture.");
      return;
    }
    locateBtn.textContent = "⏳ Syncing Vector...";
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const queryStr = `${pos.coords.latitude},${pos.coords.longitude}`;
        await loadWeatherSystem(queryStr);
        locateBtn.textContent = "✓ Vector Matched";
        localStorage.setItem("cosmic-location", queryStr);
      },
      () => {
        alert("System timed out. Retaining Dortmund Standard Baseline.");
        locateBtn.textContent = "⊙ Standard Vector";
      }
    );
  });
}


// ============================================================================
// SECTION 8: COLD BOOT INITIALIZATION LOOP (ENTRY POINT)
// ============================================================================
// Immediately launches everything once the website is loaded.

// 🌌 CORE FIX: Generates baseline cosmic shooting stars instantly on startup
generateWeatherAtmosphereEffects("clear"); 

// Inspects cache memory arrays or falls back to Dortmund
const activeHorizon = localStorage.getItem("cosmic-location") || "Dortmund";
loadWeatherSystem(activeHorizon);

// FUNCTIONAL INTEGRATION: Launches Calendly popup directly over your background
const scheduleButton = document.getElementById("schedule-button");
if (scheduleButton) {
  scheduleButton.addEventListener("click", (e) => {
    e.preventDefault();
    Calendly.initPopupWidget({
      url: 'https://calendly.com/sadatmahmud334/30min // 👈 Paste your exact Calendly link here!
    });
    return false;
  });
}

// ============================================================================
// SECTION 9: BENTO GRID INTERACTIVE MOUSE TRACKING ENGINE
// ============================================================================
// Tracks custom cursor trajectories to map light distortion on glass matrices.

document.querySelectorAll('.bento-box').forEach((box) => {
  box.addEventListener('mousemove', (e) => {
    const rect = box.getBoundingClientRect();
    const x = e.clientX - rect.left; // Anchor coordinates inside card container boundary
    const y = e.clientY - rect.top;
    
    // Updates local custom property states inside target node context
    box.style.setProperty('--mouse-x', `${x}px`);
    box.style.setProperty('--mouse-y', `${y}px`);
  });
});