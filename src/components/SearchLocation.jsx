import { Location, Search } from 'tabler-icons-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Container from './Container';

function SearchLocation({ setLoading, setCurrentTime, setWeatherData, setHourlyWeatherData }) {
  const [city, setCity] = useState('London');
  const [inputValue, setInputValue] = useState('');
  const [myCoords, setMyCoords] = useState(null);

  function getCurrentTime(timezone) {
    const localTime = new Date().getTime();
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const currentUtcTime = localOffset + localTime;
    const cityOffset = currentUtcTime + 1000 * timezone;
    const time = new Date(cityOffset).toTimeString().split(' ');
    return time[0].slice(0, 5);
  }

  useEffect(() => {
    async function getWeather() {
      try {
        const { data } = await axios(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=` + import.meta.env.VITE_API_KEY).catch((err) => {
          if (err.response.status === 404) {
            console.clear();
            throw new Error('There is no city with that name');
          }
        });

        setCurrentTime(getCurrentTime(data.timezone));
        setWeatherData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }

      try {
        setLoading(true);

        const { data } = await axios(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=8&units=metric&appid=` + import.meta.env.VITE_API_KEY);
        setHourlyWeatherData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    getWeather();
  }, [city]);

  useEffect(() => {
    async function getMyWeatherData() {
      try {
        setLoading(true);
        const { data } = await axios(`https://api.openweathermap.org/data/2.5/weather?lat=${myCoords.lat}&lon=${myCoords.lon}&units=metric&appid=` + import.meta.env.VITE_API_KEY);

        setCurrentTime(getCurrentTime(data.timezone));
        setWeatherData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }

      try {
        setLoading(true);

        const { data } = await axios(`https://api.openweathermap.org/data/2.5/forecast?lat=${myCoords.lat}&lon=${myCoords.lon}&cnt=8&units=metric&appid=` + import.meta.env.VITE_API_KEY);

        setHourlyWeatherData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    if (myCoords != null) {
      getMyWeatherData();
    }
  }, [myCoords]);

  function searchCity(event) {
    event.preventDefault();

    setCity(inputValue);
    setInputValue('');
  }

  return (
    <div className="col-span-3 flex gap-5 justify-between">
      <form onSubmit={searchCity}>
        <Container bg={'bg-white/10'} className="p-4 flex items-center justify-between w-fit">
          <input
            type="text"
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
            className="placeholder-white/75 bg-transparent w-full border-0 text-white focus:border-0 focus:outline-0 focus:ring-0"
            name="city-input"
            placeholder="city..."
          />
          <button type="submit">
            <Search />
          </button>
        </Container>
      </form>
      <Container bg={'bg-white/10'} className={'p-4 flex items-center'}>
        <button
          type="button"
          onClick={() => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { coords } = position;
                setMyCoords({ lat: coords.latitude, lon: coords.longitude });
              },
              (error) => console.log(error)
            );
          }}
        >
          <Location />
        </button>
      </Container>
    </div>
  );
}

export default SearchLocation;
