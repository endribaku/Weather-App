import { getWeatherData } from "./weather";
import './style.css';

import nightImage from './images/night.png';
import dayImage from './images/day.png';


const form = document.querySelector(".weather-location-form");
const mainContainer = document.querySelector(".main-container");
const weatherContainer = document.querySelector(".weather-data");


form.addEventListener("submit", function(event) {
    event.preventDefault();
    const location = form.querySelector(".weather-location-name").value.trim();
    renderWeatherData(location);
})

// render clock time information;
function renderCurrentDateTime(weatherData) {

    const currentTime = new Date().toLocaleTimeString("en-GB", { timeZone: weatherData.timezone}, {hour: '2-digit', minute:'2-digit'}, );
    
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


function determineDayOrNight(weatherData) {
    const currentTime = new Date().toLocaleTimeString("en-GB", { timeZone: weatherData.timezone}, {hour: '2-digit', minute:'2-digit', second:'2-digit'});
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



async function renderWeatherData(location) {
    weatherContainer.innerHTML = "";
    const weatherData = await getWeatherData(location);
    renderCurrentDateTime(weatherData);
    showLocationName(weatherData);
    determineDayOrNight(weatherData)
}