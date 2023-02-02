import ContentCenter from './components/ContentCenter';
import WeatherCondition from './components/WeatherCondition';

import imgSunset from './assets/bg-sunset.jpg';

function App() {
  return (
    <div className={`font-spacemono`}>
      <ContentCenter>
        <img src={imgSunset} className="absolute -z-10 h-full w-full object-cover" alt="sunset" />
        <WeatherCondition />
      </ContentCenter>
    </div>
  );
}

export default App;
