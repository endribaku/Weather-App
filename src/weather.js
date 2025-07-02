// N27MCEFFV658SR3P6KP7X73PQ

export async function getWeatherData(location) {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=N27MCEFFV658SR3P6KP7X73PQ&contentType=json`, {mode: 'cors'});
        const weatherData = await response.json();
        console.log(weatherData);
        const weatherComponents = getWeatherComponents(weatherData);
        console.log(weatherComponents);
        return weatherComponents;
    } catch (error) {
        throw new Error("Unavailable Location or not Existing.");
    }
    
}

function getWeatherComponents(data) {
    const locationName = data.address;
    const locationDescription = data.description;
    const currentConditions = data.currentConditions;
    const days = data.days;
    const resolvedAddress = data.resolvedAddress;
    const alerts = data.alerts
    const timezone = data.timezone;

    return {locationName, locationDescription, resolvedAddress, currentConditions, days, alerts, timezone};
}