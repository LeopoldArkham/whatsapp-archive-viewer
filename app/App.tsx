// @ts-nocheck

import React, { useState } from 'react';
import chunk from 'lodash.chunk';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

import Header from './Header';
import Body from './Body';
import { Color, COLORS } from './colors';

type Message = any;

interface Sender {
  name: string;
  color: Color;
  messageCount: number;
}

function processChat(raw: string): {
  messages: Array<Message>;
  senders: Array<Sender>;
} {
  const regex = /(\d{1,2}\/\d{1,2}\/\d{1,2}), (\d{2}:\d{2}) - ([^:\n\r]+): /g;
  const split = raw.split(regex);

  // If the chat starts with the encryption disclaimer, we remove it.
  const removeFirst =
    split[0].includes(
      'Messages to this chat and calls are now secured with end-to-end encryption'
    ) || split[0] === '';
  const parsed = removeFirst ? split.slice(1) : split;

  // Grouping by 4 creates sub-arrays of [date, day, author, message]
  const grouped = chunk(parsed, 4);

  // Get and parse the date of the first message
  const firstMessageDate = grouped[0][0];
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
  const processed = grouped.reduce(
    (acc, message) => {
      const prevDate = dayjs(prevMessage[0]);
      const curDate = dayjs(message[0]);
      const isSameDay = prevDate.isSame(curDate, 'day');

      const messageObject = {
        _type: 'message',
        time: message[1],
        author: message[2],
        message: message[3],
      };

      prevMessage = message;

      if (isSameDay) {
        return {
          messages: [...acc.messages, messageObject],
          senders: {
            ...acc.senders,
            [messageObject.author]:
              (acc.senders[messageObject.author] || 0) + 1,
          },
        };
      } else {
        const dateObject = {
          _type: 'date',
          date: dayjs(message[0]).format('MMM Do YYYY'),
        };

        return {
          messages: [...acc.messages, dateObject, messageObject],
          senders: {
            ...acc.senders,
            [messageObject.author]:
              (acc.senders[messageObject.author] || 0) + 1,
          },
        };
      }
    },
    { messages: [initialDate], senders: {} }
  );

  console.log(processed.senders);

  const sendersWithColors = Object.entries(processed.senders).reduce(
    (memo, [sender, messageCount], i) => {
      return {
        ...memo,
        [sender]: { color: COLORS[i % COLORS.length], count: messageCount },
      };
    },
    {}
  );

  console.log(sendersWithColors);

  return { messages: processed.messages, senders: sendersWithColors };
}

const App = () => {
  // Data
  const [chat, setChat] = useState<Array<Message>>(null);
  const [isGroupChat, setIsGroupChat] = useState<Boolean>(null);
  const [greenSender, setGreenSender] = useState<Sender>(null);
  const [senders, setSenders] = useState<Array<Sender>>(null);

  // UI
  const [useRenderLimit, setUseRenderLimit] = useState(true);

  const handleChatUploaded = (raw: string) => {
    setChat(null);
    setUseRenderLimit(true);

    const { messages, senders } = processChat(raw);
    const greenSender = Object.keys(senders)[0];

    setSenders(senders);
    setGreenSender(greenSender);
    setChat(messages);
    setIsGroupChat(Object.keys(senders).length > 2);

    setTimeout(() => {
      setUseRenderLimit(false);
    }, 500);
  };

  const handleChangeGreenSender = (newSender: Sender) => {
    setUseRenderLimit(true);
    setGreenSender(newSender);

    setTimeout(() => {
      setUseRenderLimit(false);
    }, 500);
  };

  return (
    <div style={{ height: '100%' }}>
      <Header
        handleChatUploaded={handleChatUploaded}
        handleChangeGreenSender={handleChangeGreenSender}
        greenSender={greenSender}
        senders={senders}
        chatLoaded={chat != null}
        isGroupChat={isGroupChat}
      />
      <Body
        senders={senders}
        chat={chat}
        greenSender={greenSender}
        useRenderLimit={useRenderLimit}
        isGroupChat={isGroupChat}
        handleChatUploaded={handleChatUploaded}
      />
    </div>
  );
};

export default App;
