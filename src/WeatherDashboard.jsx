import React, { useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const WeatherDashboard = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);
    
    try {
      const weatherResponse = await axios.get(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastResponse = await axios.get(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );      
    
      setWeather(weatherResponse.data);
      setForecast(forecastResponse.data.list.filter((_, index) => index % 8 === 0));
    } catch (err) {
      setError("City not found or API error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg text-center">
      <h1 className="text-2xl font-bold mb-4">Weather Dashboard</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <button
        onClick={fetchWeather}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Get Weather
      </button>
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {weather && (
        <div className="mt-4 border p-4 rounded bg-gray-100">
          <h2 className="text-xl font-semibold">{weather.name}, {weather.sys.country}</h2>
          <p className="text-lg">{weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
      )}
      
      {forecast && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">5-Day Forecast</h3>
          <div className="grid grid-cols-2 gap-2">
            {forecast.map((day) => (
              <div key={day.dt} className="border p-2 rounded bg-gray-200">
                <p>{new Date(day.dt_txt).toDateString()}</p>
                <p>{day.weather[0].description}</p>
                <p>{day.main.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;