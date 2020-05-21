import React, { useState } from 'react';
import chunk from 'lodash.chunk';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

import Header from './Header';
import Body from './Body';


const App = () => {
  const [ chat, setChat ] = useState(null);
  const [ swapSides, setSwapSides ] = useState(false);
  const [ sender1, setSender1 ] = useState(null);

  
  const processChat = (raw) => {
    /**
     * Expected format is d/m/yy, hh:mm - [Author]: [Message]
     * The regex uses capturing groups so the date, hour and author are
     * preserved and kept in the array returned by the split()
     */
    const regex = /(\d{1,2}\/\d{1,2}\/\d{1,2}), (\d{2}:\d{2}) - ([^:\n\r]+): /g;
    const split = raw.split(regex);

    // If the chat starts with the encryption disclaimer, we remove it.
    const removeFirst = split[0].includes("Messages to this chat and calls are now secured with end-to-end encryption");
    const parsed = removeFirst ? split.slice(1) : split;

    // Grouping by 4 creates sub-arrays of [date, day, author, message]
    const grouped = chunk(parsed, 4);

    
    const firstMessageDate = grouped[0][0]
    const initialDate = {
      _type: 'date',
      date: dayjs(firstMessageDate).format('MMM Do YYYY'),
    };
    
    /**
     * Iterate through all the sub-arrays, turning them into message objects,
     * and inserting a date stamp whenever we go from one day to the next.
     */
    let prevMessage = grouped[0];
    const withDates = grouped.reduce((acc, message) => {
      const prevDate = dayjs(prevMessage[0]);
      const curDate = dayjs(message[0]);
      const isSameDay = prevDate.isSame(curDate, 'day');

      const messageObject = {
        _type: 'message',
        time: message[1],
        author: message[2],
        message: message[3]
      }

      prevMessage = message;

      if (isSameDay) {
        return [...acc, messageObject];
      }
      else {
        const dateObject = { _type: 'date', date: dayjs(message[0]).format('MMM Do YYYY') };
        return [ ...acc, dateObject, messageObject ];
      }
    }, [initialDate]);

    // Arbitrarily select one sender to be sender 1
    // @todo: Handle group chats
    const sender1 = withDates[1].author;

    setSender1(sender1);
    setChat(withDates);
  }

  return (
    <div>
      <Header processChat={processChat} setSwapSides={setSwapSides}/>
      <Body chat={chat} sender1={sender1} swapSides={swapSides}/>
    </div >
  );
}


export default App;