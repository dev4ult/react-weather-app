import axios from 'axios';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { Location, Search, TemperatureCelsius } from 'tabler-icons-react';
import Container from './Container';

function WeatherCondition() {
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('London');
  const [weatherData, setWeatherData] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [coord, setCoord] = useState(null);
  const [currentTime, setCurrentTime] = useState('');

  const [hourlyWeatherData, setHourlyWeatherData] = useState({});

  const [myCoords, setMyCoords] = useState(null);

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
        console.log(data);

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
        const { data } = await axios(`http://api.timezonedb.com/v2.1/get-time-zone?key=${import.meta.env.VITE_TIMEZONE_API_KEY}&format=json&by=position&lat=${coord.lat}&lng=${coord.lon}`).catch((err) => {
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

  function searchCity(event) {
    event.preventDefault();

    setCity(inputValue);
    setInputValue('');
  }

  return loading ? (
    <Container className={'p-10'}>Fetching Data ...</Container>
  ) : (
    <div className="grid grid-flow-row grid-cols-3 gap-5 p-3">
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
      <Container className={'p-7 w-full col-span-3 sm:col-span-2 flex flex-col md:flex-row items-center gap-8 justify-between'}>
        <div className="text-center md:text-left">
          <h3>
            {moment().format('MMM Do')}, {currentTime}
          </h3>
          <h2 className="text-3xl font-semibold mt-3">
            {weatherData.name}, {weatherData.sys.country}
          </h2>
          <h1 className="text-5xl font-black mt-3 flex items-center gap-2">
            {weatherData.main.temp} <TemperatureCelsius size={60} />
          </h1>
          <p className="flex items-center gap-1 mb-5 ">
            Feels like {weatherData.main.feels_like} <TemperatureCelsius />
          </p>
          <div className="px-3 py-1 w-fit border-l-2  bg-white/10 mx-auto">
            <p className="capitalize">{weatherData.weather[0].description}</p>
            <p>Humidity : {weatherData.main.humidity}%</p>
          </div>
        </div>
        <div className="bg-white/20 rounded-full border-l-2 border-t-2 p-5 w-fit">
          <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`} alt="weather icon" />
        </div>
      </Container>
      <Container className={'p-5 col-span-3 sm:col-span-1 overflow-y-auto max-h-80'}>
        <h2 className="text-lg">Forecast / 3 Hours</h2>
        <ul>
          {hourlyWeatherData.list.map((data) => {
            const { dt_txt } = data;
            const dt_arr = dt_txt.split(' ');
            const hour = dt_arr[1].slice(0, 5);

            // const day_weather = dt_arr[0].slice(8, dt_arr[0].length);
            // const dayNow = moment().format('DD');

            return (
              <li key={data.dt}>
                {hour.slice(0, 2) == '00' ? <h3 className="mt-4">{moment().add(1, 'days').format('MMM Do')}</h3> : ''}
                <div className="py-1 px-3 border-l-2 bg-white/10 mt-2">
                  <div className="flex gap-5 justify-between">
                    <span className="flex items-center">
                      {data.main.temp} <TemperatureCelsius />
                    </span>
                    <span>{hour}</span>
                  </div>
                  <div className="flex gap-5 items-center justify-between mt-1">
                    <img src={`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`} alt="weather icon" />
                    <span className="capitalize text-right">{data.weather[0].description}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </div>
  );
}

export default WeatherCondition;
