import { Location, Search } from 'tabler-icons-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Container from './Container';

function SearchLocation({ setLoading, setCurrentTime, setWeatherData, setHourlyWeatherData }) {
  const [city, setCity] = useState('London');
  const [inputValue, setInputValue] = useState('');
  const [coord, setCoord] = useState(null);
  const [myCoords, setMyCoords] = useState(null);

  useEffect(() => {
    async function getWeather() {
      try {
        const { data } = await axios(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=` + import.meta.env.VITE_API_KEY).catch((err) => {
          if (err.response.status === 404) {
            console.clear();
            throw new Error('There is no city with that name');
          }
        });

        setCoord({ lat: data.coord.lat, lon: data.coord.lon });
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
    async function getCurrentTime() {
      try {
        const { data } = await axios(`https://api.timezonedb.com/v2.1/get-time-zone?key=${import.meta.env.VITE_TIMEZONE_API_KEY}&format=json&by=position&lat=${coord.lat}&lng=${coord.lon}`).catch((err) => {
          throw new Error('Something went wrong');
        });
        const time = data.formatted.split(' ')[1];
        setCurrentTime(time.slice(0, 5));
      } catch (error) {
        console.clear();
        console.log(error);
      }
    }

    if (coord != null) {
      getCurrentTime();
    }
  }, [coord]);

  useEffect(() => {
    async function getMyWeatherData() {
      try {
        setLoading(true);
        const { data } = await axios(`https://api.openweathermap.org/data/2.5/weather?lat=${myCoords.lat}&lon=${myCoords.lon}&units=metric&appid=` + import.meta.env.VITE_API_KEY);

        setWeatherData(data);
        setCoord({ lat: myCoords.lat, lon: myCoords.lon });
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }

      try {
        setLoading(true);

        const { data } = await axios(`https://api.openweathermap.org/data/2.5/forecast?lat=${myCoords.lat}&lon=${myCoords.lon}&cnt=8&units=metric&appid=` + import.meta.env.VITE_API_KEY);

        setCoord({ lat: myCoords.lat, lon: myCoords.lon });
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
        <Container className="p-4 flex items-center justify-between w-fit">
          <input
            type="text"
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
            className="bg-transparent w-full border-0 text-white focus:border-0 focus:outline-0 focus:ring-0"
            name="city-input"
            placeholder="city..."
          />
          <button type="submit">
            <Search />
          </button>
        </Container>
      </form>
      <Container className={'p-4 flex items-center'}>
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
