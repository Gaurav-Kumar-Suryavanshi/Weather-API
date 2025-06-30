const apiKey = "b62d3a8584804c6a9f4134636242212"; 
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const currentBtn = document.getElementById("currentBtn");

// Fetch weather by city
async function fetchWeatherData(city) {
    try {
        if (!city) {
            alert("Please enter a city name.");
            return;
        }

        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=5&aqi=yes&alerts=no`
        );
        const data = await response.json();
        console.log("Weather Data:", data);

        if (data.error) throw new Error(data.error.message);

        displayWeather(data);
    } catch (error) {
        alert(error.message);
    }
}

// Fetch weather using geolocation
function getCurrentLocationWeather() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
            alert("Unable to retrieve location. Please allow location access.");
            console.error("Geolocation Error:", error.message);
        }
    );
}

// Fetch weather by coordinates
async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=5&aqi=yes&alerts=no`
        );
        const data = await response.json();
        console.log("Weather Data by Coords:", data);

        if (data.error) throw new Error(data.error.message);

        displayWeather(data);
    } catch (error) {
        alert(error.message);
    }
}

// Display weather data
function displayWeather(data) {
    const current = data.current;
    const location = data.location;
    const forecast = data.forecast.forecastday;

    // Update Current Weather
    document.querySelector(".currentWeather .details h2").innerHTML = `${current.temp_c} &deg;C`;
    document.querySelector(".currentWeather .details p:nth-child(1)").textContent = "Now";
    document.querySelector(".currentWeather .details p:nth-child(3)").textContent = current.condition.text;
    document.querySelector(".currentWeather .weatherIcon img").src = current.condition.icon;

    document.querySelector(".cardFooter p:nth-child(1)").innerHTML =
        `<i class="fa-solid fa-calendar-days" style="color: #B197FC;"></i> ${new Date().toLocaleDateString()}`;
    document.querySelector(".cardFooter p:nth-child(2)").innerHTML =
        `<i class="fa-solid fa-location-dot" style="color: #74C0FC;"></i> ${location.name}, ${location.country}`;

    // Update Hourly Forecast
    displayHourlyForecast(forecast[0].hour);

    // Update 5-Day Forecast
    displayFiveDayForecast(forecast);

    // Update Sunrise & Sunset
    document.querySelector(".sunrise h3:last-child").textContent = forecast[0].astro.sunrise;
    document.querySelector(".sunset h3:last-child").textContent = forecast[0].astro.sunset;

    // Update Additional Weather Details
    document.querySelector(".humidity p").textContent = `${current.humidity}%`;
    document.querySelector(".pressure p").textContent = `${current.pressure_mb} hPa`;
    document.querySelector(".visibility p").textContent = `${current.vis_km} km`;
    document.querySelector(".wind-speed p").textContent = `${current.wind_kph} km/h`;
    document.querySelector(".feels-like p").textContent = `${current.feelslike_c}°C`;
    document.querySelector(".precipitation p").textContent = `${current.precip_mm} mm`;
    document.getElementById("uvNumber").textContent = current.uv;
    updateUVIndex(current.uv);

    // Update Air Quality Index (AQI)
    if (current.air_quality) {
        document.getElementById("aqiNumber").textContent = Math.round(current.air_quality.pm2_5);
        document.querySelector(".aqi-condition").textContent = getAQIStatus(current.air_quality.pm2_5);
    }
}

// Display Hourly Forecast
function displayHourlyForecast(hourlyData) {
    const hourlyContainer = document.querySelector(".hourlyForecast");
    hourlyContainer.innerHTML = "";

    for (let i = 0; i < 8; i++) {
        const hourData = hourlyData[i];
        const hourElement = document.createElement("div");
        hourElement.classList.add("hour");
        hourElement.innerHTML = `
            <p>${new Date(hourData.time).getHours()}h</p>
            <img src="${hourData.condition.icon}" alt="">
            <p>${hourData.temp_c} &deg;C</p>
        `;
        hourlyContainer.appendChild(hourElement);
    }
}

// Display 5-Day Forecast
function displayFiveDayForecast(forecastData) {
    const forecastContainer = document.querySelector(".forcastWeek");
    forecastContainer.innerHTML = "";

    forecastData.forEach((day) => {
        const forecastElement = document.createElement("div");
        forecastElement.classList.add("day-forcast");
        forecastElement.innerHTML = `
            <div class="forecast-Icon">
                <img src="${day.day.condition.icon}" width="40px" alt="">
                <p>${day.day.avgtemp_c} &deg;C</p>
            </div>
            <p>${new Date(day.date).toLocaleDateString()}</p>
            <p>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
        `;
        forecastContainer.appendChild(forecastElement);
    });
}

// Update UV Index Status
function updateUVIndex(uv) {
    const uvCondition = document.getElementById("uvCondition");
    if (uv <= 2) uvCondition.textContent = "Low";
    else if (uv <= 5) uvCondition.textContent = "Moderate";
    else if (uv <= 7) uvCondition.textContent = "High";
    else if (uv <= 10) uvCondition.textContent = "Very High";
    else uvCondition.textContent = "Extreme";
}

// Determine AQI Status
function getAQIStatus(aqi) {
    if (aqi <= 50) return "Good";
    else if (aqi <= 100) return "Moderate";
    else if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    else if (aqi <= 200) return "Unhealthy";
    else if (aqi <= 300) return "Very Unhealthy";
    else return "Hazardous";
}

// Event Listeners
searchBtn.addEventListener("click", () => fetchWeatherData(cityInput.value.trim()));
currentBtn.addEventListener("click", getCurrentLocationWeather);
