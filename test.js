const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const currentTemp = document.getElementById('currentTemp');
const currentCondition = document.getElementById('currentCondition');
const weatherIcon = document.getElementById('weatherIcon');
const currentDate = document.getElementById('currentDate');
const location = document.getElementById('location');
const forecastContainer = document.getElementById('forecast');
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

// Fetch current weather data
async function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod === 200) {
            updateWeatherData(data);
        } else {
            alert("City not found");
        }
    } catch (error) {
        console.log(error);
        alert("Error fetching weather data.");
    }
}

// Update weather data on the page
function updateWeatherData(data) {
    currentTemp.textContent = `${data.main.temp} °C`;
    currentCondition.textContent = data.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    currentDate.textContent = new Date().toLocaleDateString();
    location.textContent = data.name;

    // Display 5-day forecast
    getForecastData(data.coord.lat, data.coord.lon);
}

// Fetch 5-day forecast data
async function getForecastData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        updateForecastData(data);
    } catch (error) {
        console.log(error);
        alert("Error fetching forecast data.");
    }
}

// Update forecast data on the page
function updateForecastData(data) {
    forecastContainer.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) { // Get one data point per day
        const dayData = data.list[i];
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('day-forcast');
        forecastItem.innerHTML = `
            <div class="forecast-Icon">
                <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png" width="40px" alt="">
                <p>${dayData.main.temp} °C</p>
            </div>
            <p>${new Date(dayData.dt * 1000).toLocaleDateString()}</p>
        `;
        forecastContainer.appendChild(forecastItem);
    }
}

// Event listener for search button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeatherData(city);
    } else {
        alert("Please enter a city name");
    }
});

// Event listener for current location button (if needed)
document.getElementById('currentBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            getWeatherDataByCoords(latitude, longitude);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

// Function to get weather by geolocation coordinates
async function getWeatherDataByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        updateWeatherData(data);
    } catch (error) {
        console.log(error);
        alert("Error fetching weather data.");
    }
}
