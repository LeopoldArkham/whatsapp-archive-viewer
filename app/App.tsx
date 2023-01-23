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
import { Placeholder } from './Placeholder';

function processChat(raw: string): {
  messages: Array<ChatEntry>;
  senders: Array<Sender>;
} {
  const parsed = Array.from(raw.matchAll(messageRegex));

  // Get and parse the date of the first message
  const firstMessageDate = parsed[0].groups?.date;
  const initialDate: ChatEntry = dayjs(firstMessageDate).format('MMM Do YYYY');

  // todo: update comment
  /**
   * Iterate through all the sub-arrays, turning them into `Message`,
   * and inserting a date stamp whenever we go from one day to the next.
   */
  // todo: Could just be the date
  let previousEntry = parsed[0];
  const {
    entries,
    senders,
  }: {
    entries: Array<ChatEntry>;
    senders: Array<Omit<Sender, 'color'>>;
  } = parsed.reduce(
    (acc, entry) => {
      if (entry.groups == null) {
        return acc;
      } else {
        const { date, time, author, text } = entry.groups;

        const prevDate = dayjs(previousEntry.groups?.date, 'MM/DD/YY');
        const curDate = dayjs(entry.groups?.date, 'MM/DD/YY');
        const isSameDay = prevDate.isSame(curDate, 'day');

        previousEntry = entry;

        const message = { date, time, author, text };
        // todo: avoid recomputing on every iteration
        const dateMarker = dayjs(date).format('MMM Do YYYY');

        return {
          entries: [
            ...acc.entries,
            ...(isSameDay ? [message] : [dateMarker, message]),
          ],
          senders: [...acc.senders, { name: message.author }],
        };
      }
    },
    { entries: [initialDate], senders: {} } as {
      entries: Array<ChatEntry>;
      senders: Array<Omit<Sender, 'color'>>;
    }
  );

  const sendersWithColors: Array<Sender> = senders.map((sender, idx) => ({
    ...sender,
    color: COLORS[idx % COLORS.length],
  }));

  return { messages: entries, senders: sendersWithColors };
}

const GlobalAppContext = createContext<{
  greenSender: Sender | null;
}>({ greenSender: null });

export function useGlobalAppState() {
  return useContext(GlobalAppContext);
}

export const App = () => {
  // Data
  const [chat, setChat] = useState<Array<ChatEntry> | null>(
    process.env.APP_ENV === 'development' ? testChat : null
  );

  const [greenSender, setGreenSender] = useState<Sender | null>(
    process.env.APP_ENV === 'development' ? { name: 'Me', color: '' } : null
  );

  const [senders, setSenders] = useState<Array<Sender> | null>(
    process.env.APP_ENV === 'development'
      ? [
          { name: 'Me', color: '' },
          { name: 'Her', color: '' },
        ]
      : null
  );

  // UI
  const [useRenderLimit, setUseRenderLimit] = useState(true);

  const handleChatUploaded = (raw: string | ArrayBuffer | null) => {
    if (typeof raw !== 'string') {
      console.error(
        `In \`handleChatUploaded\`, expected input to be \`string\` but received \`${typeof raw}\``
      );
      // todo: handle explicitly
      return;
    }

    setChat(null);
    setUseRenderLimit(true);

    const { messages, senders } = processChat(raw);
    const greenSender = senders[0];

    setSenders(senders);
    setGreenSender(greenSender);
    setChat(messages);

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
        <Header handleChatUploaded={handleChatUploaded} />
        {chat == null || senders == null || greenSender == null ? (
          <Placeholder handleChatUploaded={handleChatUploaded} />
        ) : (
          <Body
            chat={chat}
            senders={senders}
            greenSender={greenSender}
            useRenderLimit={useRenderLimit}
          />
        )}
      </div>
    </GlobalAppContext.Provider>
  );
};
