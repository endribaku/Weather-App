import { getWeatherData } from "./weather";
import './style.css';

import nightImage from './images/night.png';
import dayImage from './images/day.png';

//importing icons
// import clearDay from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/clear-day.svg';
// import clearNight from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/clear-night.svg';
// import cloudy from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/cloudy.svg';
// import fog from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/fog.svg';
// import hail from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/hail.svg';
// import partlyCloudyDay from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/partly-cloudy-day.svg';
// import partlyCloudyNight from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/partly-cloudy-night.svg';
// import rainSnowShowersDay from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/rain-snow-showers-day.svg';
// import rainSnowShowersNight from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/rain-snow-showers-night.svg';
// import rainSnow from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/rain-snow.svg';
// import rain from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/rain.svg';
// import showersDay from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/showers-day.svg';
// import showersNight from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/showers-night.svg';
// import sleet from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/sleet.svg';
// import snowShowersDay from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/snow-showers-day.svg';
// import snowShowersNight from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/snow-showers-night.svg';
// import snow from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/snow.svg';
// import thunderRain from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/thunder-rain.svg';
// import thunderShowersDay from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/thunder-showers-day.svg';
// import thunderShowersNight from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/thunder-showers-night.svg';
// import thunder from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/thunder.svg';
// import wind from './images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/wind.svg';



const form = document.querySelector(".weather-location-form");
const mainContainer = document.querySelector(".main-container");

const weatherContainer = document.createElement("div");
weatherContainer.classList.add("weather-data");

const temperatureSwitchToggle = document.querySelector("#checkbox");
const temperatureContent = document.querySelector(".temperature");
const loading = document.querySelector(".loading");

let location = null;

let isFahrenheit = true;




form.addEventListener("submit", function(event) {
    event.preventDefault();
    weatherContainer.innerHTML = "";
    createLoadingScreen();
    mainContainer.prepend(weatherContainer);
    location = form.querySelector(".weather-location-name").value.trim();
    checkWeatherLocation(location)
})

temperatureSwitchToggle.addEventListener("change", function() {
    isFahrenheit = !isFahrenheit;
    if(isFahrenheit) {
        temperatureContent.textContent = "Fahrenheit";
    } else {
        temperatureContent.textContent = "Celsius";
    }

    if(location) {
        checkWeatherLocation(location);
    }
})

function temperatureToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
}



// render clock time information;
function renderCurrentDateTime(weatherData) {

    const currentTime = new Date().toLocaleTimeString("en-GB", {
    timeZone: weatherData.timezone,
    hour: '2-digit',
    minute: '2-digit'
    });
    
    const currentDate = new Date().toLocaleDateString("en-GB", {
        timeZone: weatherData.timezone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
        });
    const timeContent = document.createElement("div");
    timeContent.classList.add("time-content");
    
    const currentTimeText = document.createElement("p");
    currentTimeText.classList.add("current-time");
    currentTimeText.textContent = currentTime;
    
    const currentDateText = document.createElement("p");
    currentDateText.classList.add("current-date");
    currentDateText.textContent = currentDate;

    timeContent.appendChild(currentTimeText);
    timeContent.appendChild(currentDateText);
    weatherContainer.appendChild(timeContent);
}


function createLoadingScreen() {
    const loading = document.createElement("div");
    loading.classList.add("loading");
    loading.textContent = "Loading...";
    weatherContainer.appendChild(loading);
}

function removeLoadingScreen() {
    const loading = document.querySelector(".loading");
    if(weatherContainer.contains(loading)) {
        loading.remove();
    }
}

function determineDayOrNight(weatherData) {
    const currentTime = new Date().toLocaleTimeString("en-GB", {
        timeZone: weatherData.timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
    });
    console.log(currentTime);
    const isNight = currentTime >= weatherData.currentConditions.sunset || currentTime <= weatherData.currentConditions.sunrise;
     
    const body = document.querySelector("body");
    if (!isNight) {
        body.style.backgroundImage = `url(${dayImage})`;
    } else {
        body.style.backgroundImage = `url(${nightImage})`;
    }
}

function showLocationName(weatherData) {
    console.log("Resolved address:", weatherData.resolvedAddress);
    const currentLocation = weatherData.resolvedAddress;

    const locationContainer = document.createElement("div");
    locationContainer.classList.add("location-container");

    const currentLocationText = document.createElement("p");
    currentLocationText.classList.add("current-location");
    currentLocationText.textContent = currentLocation;

    locationContainer.appendChild(currentLocationText);
    weatherContainer.appendChild(locationContainer);
}

async function checkWeatherLocation(location) {
    let weatherData = null;


    try {
        weatherData = await getWeatherData(location);
    } catch(e) {
        alert(e);
        return;
    }
    renderWeatherData(weatherData)
}

async function setIcon(weatherIconName, icon) {
    const iconModule = await import(`./images/WeatherIcons/WeatherIcons-main/SVG/3rd Set - Color/${weatherIconName}.svg`);
    const iconPath = iconModule.default;
    icon.src = iconPath;
}

function renderIcon(weatherData) {
    const weatherIconName = weatherData.currentConditions.icon;
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");
    
    // const iconSrc = {
    //     "clear-day": clearDay,
    //     "clear-night": clearNight,
    //     "cloudy": cloudy,
    //     "fog": fog,
    //     "hail": hail,
    //     "partly-cloudy-day": partlyCloudyDay,
    //     "partly-cloudy-night": partlyCloudyNight,
    //     "rain-snow-showers-day": rainSnowShowersDay,
    //     "rain-snow-showers-night": rainSnowShowersNight,
    //     "rain-snow": rainSnow,
    //     "rain": rain,
    //     "showers-day": showersDay,
    //     "showers-night": showersNight,
    //     "sleet": sleet,
    //     "snow-showers-day": snowShowersDay,
    //     "snow-showers-night": snowShowersNight,
    //     "snow": snow,
    //     "thunder-rain": thunderRain,
    //     "thunder-showers-day": thunderShowersDay,
    //     "thunder-showers-night": thunderShowersNight,
    //     "thunder": thunder,
    //     "wind": wind
    // }
    const icon = document.createElement("img");
    icon.classList.add("weather-icon");
    imageContainer.appendChild(icon);
    weatherContainer.appendChild(imageContainer);
    setIcon(weatherIconName, icon);
}

function weatherDescription(weatherData) {
    const descriptionContainer = document.createElement("div");
    descriptionContainer.classList.add("weather-description-container");

    const temperature = weatherData.currentConditions.temp;

    const temperatureDescriptionText = document.createElement("p");
    temperatureDescriptionText.classList.add("temperature-description");
    temperatureDescriptionText.textContent = isFahrenheit ? temperature + "°F" : temperatureToCelsius(temperature).toFixed(1).toString().concat("°C");
 
    const locationDescriptionText = document.createElement("p");
    locationDescriptionText.classList.add("location-description");
    locationDescriptionText.textContent = weatherData.locationDescription;

    const conditionsText = document.createElement("p");
    conditionsText.classList.add("conditions-description");
    conditionsText.textContent = weatherData.currentConditions.conditions;


    descriptionContainer.appendChild(locationDescriptionText);
    
    weatherContainer.appendChild(conditionsText);
    weatherContainer.appendChild(temperatureDescriptionText);
    weatherContainer.appendChild(descriptionContainer);

}


function renderWeatherData(weatherData) {
    removeLoadingScreen();
    renderCurrentDateTime(weatherData);
    showLocationName(weatherData);
    determineDayOrNight(weatherData)
    renderIcon(weatherData);
    weatherDescription(weatherData);
}