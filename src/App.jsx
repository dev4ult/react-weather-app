import ContentCenter from './components/ContentCenter';
import WeatherCondition from './components/WeatherCondition';

import imgSunset from './assets/bg-sunset.jpg';

function App() {
  return (
    <div className={`font-spacemono`}>
      <ContentCenter>
        <div className="md:hidden absolute -z-10 top-0 bottom-0 left-0 right-0 bg-gradient-to-br from-orange-400 via-blue-400 to-slate-800"></div>
        <img src={imgSunset} className="absolute hidden md:block -z-10 h-full w-full object-cover" alt="sunset" />
        <WeatherCondition />
      </ContentCenter>
    </div>
  );
}

export default App;
