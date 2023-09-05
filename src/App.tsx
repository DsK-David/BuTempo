import  { useState,useEffect } from 'react'
import axios from 'axios';
import './App.css';
import dotenv from 'dotenv';
import process from 'process';
dotenv.config()
interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}



const Weather = () => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [userWeather, setUserWeather] = useState<WeatherData | null>(null);
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [error, setError] = useState<string>('');


  
  const API_KEY = process.env.REACT_APP_API_KEY

  // Obter a localização do usuário
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      });
    }
  }, []);

  // Consultar a API de previsão do tempo com base na localização do usuário
  useEffect(() => {
    if (userLocation) {
      const userWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=${API_KEY}&lang=pt`;

      axios
        .get(userWeatherUrl)
        .then((response) => {
          setUserWeather(response.data);
        })
        .catch((error) => {
          setError('Erro ao buscar o tempo atual do usuário.');
          console.error('Erro ao buscar o tempo atual do usuário:', error);
        });
    }
  }, [API_KEY, userLocation]);

  // Função para buscar o tempo com base no nome do país ou cidade
  const searchWeatherByLocation = () => {
    if (searchLocation) {
      const searchWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}&appid=${API_KEY}&lang=pt`;

      axios
        .get(searchWeatherUrl)
        .then((response) => {
          setUserWeather(response.data);
        })
        .catch((error) => {
          setError('Localização não encontrada');
          console.error('Erro ao buscar o tempo por localização:', error);
        });
    }
  };

  return (
    <div className="weather-container">
    <h1>Bu tempo</h1>
    <div className="search-container">
      <input
        type="search"
        className="input"
        placeholder="Digite o nome de um país ou cidade"
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
      />
      <button onClick={searchWeatherByLocation}>Pesquisar</button>
    </div>

    {userWeather && (
      <div className="weather-card">
        <h2>{userWeather.name}</h2>
        <p>Temperatura: {userWeather.main.temp}°C</p>
        <p>Condição: {userWeather.weather[0].description}</p>
        <img
          src={`https://openweathermap.org/img/wn/${userWeather.weather[0].icon}.png`}
          alt="Condição climática"
        />
      </div>
    )}

    {error && <p>{error}</p>}
  </div>
  );
      };

export default Weather;
