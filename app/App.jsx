import React, { useState } from 'react';
import chunk from 'lodash.chunk';

import Header from './Header';
import Body from './Body';


const App = () => {
  const [ chat, setChat ] = useState(null);
  const [ swapSides, setSwapSides ] = useState(false);
  const [ sender1, setSender1 ] = useState(null);

  console.log(swapSides);
  
  const processChat = (raw) => {
    const regex = /(\d{1,2}\/\d{1,2}\/\d{1,2}), (\d{2}:\d{2}) - (\w+):/g;
    const split = raw.split(regex).slice(1);
    const grouped = chunk(split, 4);
    const sender1 = grouped[0][2]
    setSender1(sender1);
    setChat(grouped);

  }

  return (
    <div>
      <Header processChat={processChat} setSwapSides={setSwapSides}/>
      <Body chat={chat} sender1={sender1} swapSides={swapSides}/>
    </div >
  );
}


export default App;