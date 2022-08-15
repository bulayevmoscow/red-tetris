import { useState } from 'react';
import config from '@/config';
import React from 'react';
import Battlefield from '@/components/battlefield/Battlefield';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Battlefield />
    </div>
  );
}

export default App;
