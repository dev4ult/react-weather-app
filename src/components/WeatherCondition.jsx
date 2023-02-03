import moment from 'moment/moment';
import { useState } from 'react';
import { TemperatureCelsius } from 'tabler-icons-react';
import Container from './Container';
import SearchLocation from './SearchLocation';

function WeatherCondition() {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [hourlyWeatherData, setHourlyWeatherData] = useState({});

  return (
    <div className="grid grid-flow-row grid-cols-3 gap-5 p-3">
      <SearchLocation {...{ setLoading, setCurrentTime, setWeatherData, setHourlyWeatherData }} />
      {loading ? (
        <Container className={'p-10 text-2xl font-bold col-span-3'}>Fetching Data ...</Container>
      ) : (
        <>
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
              <div className="px-3 py-1 w-fit border-l-2  bg-white/10 mx-auto md:mx-0">
                <p className="capitalize">{weatherData.weather[0].description}</p>
                <p>Humidity : {weatherData.main.humidity}%</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-full border-l-2 border-t-2 p-5 w-fit">
              <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`} alt="weather icon" />
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
                const hourNow = moment().format('H');

                const changeDay = hour.slice(0, 2) == '00';

                return (
                  <li key={data.dt}>
                    {changeDay ? (
                      <h3 className="mt-4">
                        {moment()
                          .add(hourNow > 5 ? 1 : 0, 'days')
                          .format('MMM Do')}
                      </h3>
                    ) : (
                      ''
                    )}
                    <div className="py-1 px-3 border-l-2 bg-white/10 mt-2">
                      <div className="flex gap-5 justify-between">
                        <span className="flex items-center">
                          {data.main.temp} <TemperatureCelsius />
                        </span>
                        <span>{hour}</span>
                      </div>
                      <div className="flex gap-5 items-center justify-between mt-1">
                        <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`} alt="weather icon" />
                        <span className="capitalize text-right">{data.weather[0].description}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Container>
        </>
      )}
    </div>
  );
}

export default WeatherCondition;
