import React, { useState } from 'react';
import chunk from 'lodash.chunk';

import Header from './Header';
import Body from './Body';

const App = () => {
  const [ chat, setChat ] = useState(null);
  const [ sender1, setSender1 ] = useState(null);

  const processChat = (raw) => {
    const regex = /(\d{1,2}\/\d{1,2}\/\d{1,2}), (\d{2}:\d{2}) - (\w+):/g;
    const split = raw.split(regex).slice(1);
    const grouped = chunk(split, 4);
    const sender1 = grouped[0][2]
    setSender1(sender1);
    setChat(grouped);

  }

  return (
    <React.Fragment>
      <Header processChat={processChat}/>
      <Body chat={chat} sender1={sender1} />
    </React.Fragment>
  );
}


export default App;