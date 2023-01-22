import React, { useEffect, useState } from 'react';
import { css, cx } from '@emotion/css';
import v4 from 'uuid/v4';
import { ChatEntry, DateMarker, Message } from './types';
import { useGlobalAppState } from './App';

const THRESHOLD = 100;

const styles = {
  message: css`
    font-family: 'Segoe UI';
    max-width: 66%;
    width: fit-content;
  `,
  dateStamp: css`
    position: sticky;
    top: 80px;
    padding: 8px;
    margin: 10px auto 10px auto;
    background-color: #e1f3fb;
    width: 120px;
    text-align: center;
    border-radius: 10px;
    font-family: 'Segoe UI';
    box-shadow: 0px 1px 0px 0px rgba(184, 184, 184, 0.8);
    z-index: 5;
  `,
  padRight: css`
    padding-right: 60px;
  `,
  author: css`
    font-weight: bold;
  `,
};

interface PlaceholderProps {
  handleChatUploaded: (input: string) => void;
}

const Placeholder = ({ handleChatUploaded }: PlaceholderProps) => {
  return (
    <div className="h-full flex flex-col items-center pt-28 bg-slate-800">
      <h2 className="text-white text-3xl mb-4">Whatsapp Archive Viewer</h2>
      <p className="text-white">
        Choose a Whatsapp archive (.txt) to upload it.
      </p>
      <p className="text-white mt-2 p-4 shadow-inner bg-slate-900 rounded text-center max-w-[30%]">
        The content of your chat will be processed entirely in your browser, on
        your own computer. At no point is any information about you or your
        conversation transferred or saved anywhere else.
        <br />
        <br />
        This site does not use cookies or local storage.
      </p>
      <a
        className="underline italic text-sky-500 hover:text-sky-300 pt-2 pb-4"
        target="_blank"
        href="https://faq.whatsapp.com/android/chats/how-to-save-your-chat-history/?lang=en">
        How do I export an archive from Whatsapp?
      </a>
      {/* The actual label this refers to is the one in the header */}
      <label
        htmlFor="file-upload"
        className="text-slate-200 bg-sky-500  text-l rounded-lg px-3 py-2 cursor-pointer hover:bg-sky-400 hover:file:text-slate-100 transition-all">
        Choose a file
      </label>
    </div>
  );
};

interface MessageProps {
  message: Message;
  senders: unknown;
  isGroupChat: boolean;
  showTick: boolean;
}

const Message = ({ message, showTick, senders, isGroupChat }: MessageProps) => {
  const { greenSender } = useGlobalAppState();
  const isGreenSender = message.author === greenSender;

  return (
    <div
      className={cx(
        styles.message,
        'm-2 rounded-xl relative first:mt-0 p-2 text-white',
        isGreenSender
          ? 'bg-gradient-to-b from-lime-500 to-lime-600 m-2 ml-auto'
          : 'bg-gradient-to-b from-cyan-500 to-cyan-600 mr-auto',
        showTick ? (isGreenSender ? 'rounded-br-sm' : 'rounded-bl-sm') : null,
        message.text.length <= 115 ? 'pr-12' : ''
      )}>
      {isGreenSender || !isGroupChat ? null : (
        <div
          className={styles.author}
          style={{ color: senders[message.author].color }}>
          {message.author}
        </div>
      )}
      {message.text}
      <div
        className={`italic absolute right-1.5 bottom-1 text-xs ${
          isGreenSender ? 'text-lime-200' : 'text-cyan-200'
        }`}>
        {message.time}
      </div>
    </div>
  );
};

function entryIsMessage(entry: ChatEntry): entry is Message {
  return typeof entry === 'object' && 'text' in entry;
}

function entryIsDateMarker(entry: ChatEntry): entry is DateMarker {
  return typeof entry === 'string';
}

interface BodyProps {
  chat: Array<ChatEntry>;
  senders: unknown;
  greenSender: string;
  isGroupChat: boolean;
  useRenderLimit: boolean;
  handleChatUploaded: (raw: string) => void;
}

const Body = ({
  chat,
  senders,
  isGroupChat,
  useRenderLimit,
  handleChatUploaded,
}: BodyProps) => {
  if (chat == null)
    return <Placeholder handleChatUploaded={handleChatUploaded} />;

  const list = useRenderLimit ? chat.slice(0, THRESHOLD) : chat;

  return (
    <div className="bg-slate-800 px-[15vw] pt-24 min-h-full pt-5">
      {list.map((entry, index) => {
        if (entryIsDateMarker(entry)) {
          return null;
          return (
            <div key={index} className={styles.dateStamp}>
              {entry}
            </div>
          );
        } else if (entryIsMessage(entry)) {
          // Poor man's `if let` in Rust, I miss it.
          const message = entry;

          // If this message is the first of a group from the same author,
          // it will display a speech bubble tick.
          const nextMessage = list.slice(index + 1).find(entryIsMessage);
          const isLastOfGroup = message.author !== nextMessage?.author;

          return (
            <Message
              message={message}
              senders={senders}
              showTick={isLastOfGroup}
              isGroupChat={isGroupChat}
              // @ts-ignore (why tough)
              key={index}
            />
          );
        }
      })}
    </div>
  );
};

export default Body;
