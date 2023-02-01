import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [weatherData, setWeatherData] = useState('');

  useEffect(() => {
    async function getWeather() {
      const weather = await axios(`https://api.openweathermap.org/data/2.5/weather?q=Jakarta&appid=` + import.meta.env.VITE_API_KEY);

      setWeatherData(weather);
    }

    getWeather();
  }, []);

  return (
    <div className="App min-h-screen flex items-center justify-center">
      <button
        type="button"
        onClick={() => {
          console.log(weatherData);
        }}
      >
        log data
      </button>
    </div>
  );
}

export default App;
