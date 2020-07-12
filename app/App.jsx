import React, { useState } from 'react';
import chunk from 'lodash.chunk';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

import Header from './Header';
import Body from './Body';


function processChat(raw) {
  const regex = /(\d{1,2}\/\d{1,2}\/\d{1,2}), (\d{2}:\d{2}) - ([^:\n\r]+): /g;
  const split = raw.split(regex);

  // If the chat starts with the encryption disclaimer, we remove it.
  const removeFirst = split[0].includes("Messages to this chat and calls are now secured with end-to-end encryption");
  const parsed = removeFirst ? split.slice(1) : split;

  // Grouping by 4 creates sub-arrays of [date, day, author, message]
  const grouped = chunk(parsed, 4);

  
  // Get and parse the date of the first message
  const firstMessageDate = grouped[0][0]
  const initialDate = {
    _type: 'date',
    date: dayjs(firstMessageDate).format('MMM Do YYYY'),
  };
  
  /**
   * Iterate through all the sub-arrays, turning them into message objects,
   * and inserting a date stamp whenever we go from one day to the next.
   */
  // todo: Could just be the date
  let prevMessage = grouped[0];
  const processed = grouped.reduce((acc, message) => {
    const prevDate = dayjs(prevMessage[0]);
    const curDate = dayjs(message[0]);
    const isSameDay = prevDate.isSame(curDate, 'day');

    const messageObject = {
      _type: 'message',
      time: message[1],
      author: message[2],
      message: message[3],
    }

    prevMessage = message;

    if (isSameDay) {
      return {
        messages: [...acc.messages, messageObject],
        senders: {
          ...acc.senders,
          [messageObject.author]: (acc.senders[messageObject.author] || 0) + 1,
        },
      }
    }
    else {
      const dateObject = { _type: 'date', date: dayjs(message[0]).format('MMM Do YYYY') };
      
      return {
        messages: [ ...acc.messages, dateObject, messageObject ],
        senders: {
          ...acc.senders,
          [messageObject.author]: (acc.senders[messageObject.author] || 0) + 1,
        }
      };
    }
  }, { messages: [initialDate], senders: {} });

  return processed;
}


const App = () => {
  // Data
  const [ chat, setChat ] = useState(null);
  const [ isGroupChat, setIsGroupChat ] = useState(null)
  const [ sender1, setSender1 ] = useState(null);
  
  // UI
  const [ useRenderLimit, setUseRenderLimit ] = useState(true);
  const [ swapSides, setSwapSides ] = useState(false);

  const handleChatUploaded = (raw) => {
    const { messages, senders } = processChat(raw);
    console.log(senders);
    const sender1 = Object.keys(senders)[0];

    setSender1(sender1);
    setChat(messages);
    setIsGroupChat(Object.keys(senders).length > 2)

    setTimeout(() => {
      setUseRenderLimit(false);
    }, 500);
  };

  return (
    <div>
      <Header handleChatUploaded={handleChatUploaded} setSwapSides={setSwapSides} chatLoaded={chat != null} />
      <Body chat={chat} sender1={sender1} swapSides={swapSides} useRenderLimit={useRenderLimit} />
    </div >
  );
}


export default App;