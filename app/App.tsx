import React, { useState, createContext, useContext } from 'react';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

import Header from './Header';
import Body from './Body';
import { COLORS } from './colors';
import { ChatEntry, Color, DateMarker, Message, Sender } from './types';
import { messageRegex } from './regex';
import testChat from './testChat';

function processChat(raw: string): {
  messages: Array<ChatEntry>;
  senders: Record<string, { color: Color; count: number }>;
} {
  const parsed = Array.from(raw.matchAll(messageRegex));
  console.log(parsed);

  // Get and parse the date of the first message
  const firstMessageDate = parsed[0].groups.date;
  const initialDate: ChatEntry = dayjs(firstMessageDate).format('MMM Do YYYY');

  /**
   * Iterate through all the sub-arrays, turning them into `Message`,
   * and inserting a date stamp whenever we go from one day to the next.
   */
  // todo: Could just be the date
  let previousEntry = parsed[0];
  const processed: {
    entries: Array<ChatEntry>;
    senders: Record<string, number>;
  } = parsed.reduce(
    (acc, entry) => {
      const { date, time, author, text } = entry.groups;

      const prevDate = dayjs(previousEntry.groups.date, 'MM/DD/YY');
      const curDate = dayjs(entry.groups.date, 'MM/DD/YY');
      const isSameDay = prevDate.isSame(curDate, 'day');

      previousEntry = entry;

      const message = { date, time, author, text };
      // todo: avoid recomputing on every iteration
      const dateMarker = dayjs(date).format('MMM Do YYYY');

      const test = {
        entries: [
          ...acc.entries,
          ...(isSameDay ? [message] : [dateMarker, message]),
        ],
        senders: {
          ...acc.senders,
          [message.author]: (acc.senders[message.author] || 0) + 1,
        },
      };
      return test;
    },
    { entries: [initialDate], senders: {} } as {
      entries: Array<ChatEntry>;
      senders: Record<string, number>;
    }
  );

  const sendersWithColors = Object.entries(processed.senders).reduce(
    (memo, [sender, messageCount], i) => {
      return {
        ...memo,
        [sender]: { color: COLORS[i % COLORS.length], count: messageCount },
      };
    },
    {} as Record<string, { color: Color; count: number }>
  );

  return { messages: processed.entries, senders: sendersWithColors };
}

const GlobalAppContext = createContext<{
  greenSender: string | null;
}>({ greenSender: null });

export function useGlobalAppState() {
  return useContext(GlobalAppContext);
}

export const App = () => {
  // Data
  const [chat, setChat] = useState<Array<ChatEntry>>(
    process.env.APP_ENV === 'development' ? testChat : null
  );
  console.log(chat);
  // todo: should this just be computed?
  const [isGroupChat, setIsGroupChat] = useState<Boolean>(
    process.env.APP_ENV === 'development' ? false : null
  );
  const [greenSender, setGreenSender] = useState<Sender>(
    process.env.APP_ENV === 'development' ? 'Me' : null
  );
  const [senders, setSenders] = useState<Array<Sender>>(
    process.env.APP_ENV === 'development' ? ['Me', 'Her'] : null
  );

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
    <GlobalAppContext.Provider value={{ greenSender }}>
      <div className="h-full">
        <Header
          senders={senders}
          greenSender={greenSender}
          isChatLoaded={chat != null}
          isGroupChat={isGroupChat}
          handleChatUploaded={handleChatUploaded}
          handleChangeGreenSender={handleChangeGreenSender}
        />
        <Body
          chat={chat}
          senders={senders}
          greenSender={greenSender}
          isGroupChat={isGroupChat}
          useRenderLimit={useRenderLimit}
          handleChatUploaded={handleChatUploaded}
        />
      </div>
    </GlobalAppContext.Provider>
  );
};
