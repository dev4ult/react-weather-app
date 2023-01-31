import { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState('');

  useEffect(() => {});
  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
      </div>
    </div>
  );
}

export default App;
