import React, {
  useState,
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

import Header from './Header';
import { Chat } from './Chat';
import { Wizard } from './Wizard';
import { COLORS } from './colors';
import { ChatEntry, Color, DateMarker, Message, Sender } from './types';
import { messageRegex } from './regex';
import testChat from './testChat';

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
    senders: Set<Sender['name']>;
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
          senders: acc.senders.add(message.author),
        };
      }
    },
    { entries: [initialDate], senders: new Set() } as {
      entries: Array<ChatEntry>;
      senders: Set<Sender['name']>;
    }
  );

  const sendersWithColors: Array<Sender> = Array.from(
    senders,
    (sender, idx) => ({ name: sender, color: COLORS[idx % COLORS.length] })
  );

  return { messages: entries, senders: sendersWithColors };
}

const GlobalAppContext = createContext<{
  greenSender: Sender | undefined;
}>({ greenSender: undefined });

export function useGlobalAppState() {
  return useContext(GlobalAppContext);
}

export const enum ApplicationStep {
  WelcomeScreen = 0,
  Processing = 1,
  SelectSender = 2,
  DisplayChat = 3,
}

export const App = () => {
  // Data
  const [rawChat, setRawChat] = useState<string | null>(null);
  const [chat, setChat] = useState<Array<ChatEntry> | null>(null);

  const [greenSender, setGreenSender] = useState<Sender>();

  const [senders, setSenders] = useState<Array<Sender> | undefined>(undefined);

  const [applicationCurrentStep, setApplicationCurrentStep] =
    useState<ApplicationStep>(ApplicationStep.WelcomeScreen);

  useEffect(() => {
    if (
      rawChat != null &&
      applicationCurrentStep === ApplicationStep.Processing
    ) {
      const { messages, senders } = processChat(rawChat);
      setSenders(senders);
      setChat(messages);
      setApplicationCurrentStep(ApplicationStep.SelectSender);
    }
  }, [rawChat == null, applicationCurrentStep]);

  const handleChatUploaded = (raw: string | ArrayBuffer | null) => {
    if (typeof raw !== 'string') {
      console.error(
        `In \`handleChatUploaded\`, expected input to be \`string\` but received \`${typeof raw}\``
      );
      // todo: handle explicitly
      return;
    }

    setApplicationCurrentStep(ApplicationStep.Processing);
    // ? This is a hack that forces React not to batch the two state updates.
    // ? If it does, the actual processing (triggered by useEffect above) prevents the app
    // ? from switching to the "Processing" state.
    setTimeout(() => setRawChat(raw), 1);
  };

  const handleGreenSenderSelected = (name: Sender['name']) => {
    const greenSender = senders?.find((sender) => sender.name === name);

    if (greenSender == null) {
      console.error(
        'Invariant violated: A green sender was sent which was nou found in the initial list.'
      );
    }

    setGreenSender(greenSender);
    setApplicationCurrentStep(ApplicationStep.DisplayChat);
  };

  return (
    <GlobalAppContext.Provider value={{ greenSender }}>
      <div className="h-full overflow-x-hidden">
        <Header handleChatUploaded={handleChatUploaded} />
        {applicationCurrentStep !== ApplicationStep.DisplayChat ? (
          <Wizard
            currentStep={applicationCurrentStep}
            senders={senders}
            greenSender={greenSender}
            onSelectGreenSender={handleGreenSenderSelected}
          />
        ) : (
          <Chat
            // todo: remove non-null assertions
            chat={chat!}
            senders={senders!}
            greenSender={greenSender!}
          />
        )}
      </div>
    </GlobalAppContext.Provider>
  );
};
