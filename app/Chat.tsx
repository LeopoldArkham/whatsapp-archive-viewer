import React, { useEffect, useState } from 'react';
import { css, cx } from '@emotion/css';
import { ChatEntry, DateMarker, Message, Sender } from './types';
import { useGlobalAppState } from './App';

const THRESHOLD = 100;

const styles = {
  message: css`
    max-width: 66%;
    width: fit-content;
  `,
  dateStamp: css`
    padding: 8px;
    margin: 10px auto 10px auto;
    background-color: #e1f3fb;
    width: 120px;
    text-align: center;
    border-radius: 10px;
    box-shadow: 0px 1px 0px 0px rgba(184, 184, 184, 0.8);
    z-index: 5;
  `,
  author: css`
    font-weight: bold;
  `,
};

interface MessageProps {
  message: Message;
  senders: Array<Sender>;
  showTick: boolean;
}

const Message = ({ message, showTick, senders }: MessageProps) => {
  const { greenSender } = useGlobalAppState();
  const isGreenSender = message.author === greenSender?.name;

  return (
    <div
      className={cx(
        styles.message,
        'm-2 rounded-xl relative first:mt-0 p-2 pl-3 text-white [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]',
        isGreenSender
          ? 'bg-gradient-to-b from-lime-500 to-lime-600 m-2 ml-auto'
          : 'bg-gradient-to-b from-cyan-500 to-cyan-600 mr-auto',
        showTick ? (isGreenSender ? 'rounded-br-sm' : 'rounded-bl-sm') : null,
        message.text.length <= 115 ? 'pr-12' : ''
      )}>
      {isGreenSender || !(senders.length > 2) ? null : (
        <div
          className="font-bold"
          style={{
            color: senders.find((author) => author.name === message.author)
              ?.color,
          }}>
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

interface ChatProps {
  chat: Array<ChatEntry>;
  senders: Array<Sender>;
  greenSender: Sender;
}

export const Chat = ({ chat, senders }: ChatProps) => {
  return (
    <div className="bg-slate-800 font-['Segoe_UI'] px-[15vw] pt-24 min-h-full">
      {chat.map((entry, index) => {
        if (entryIsDateMarker(entry)) {
          return (
            <div
              key={index}
              className="bg-zinc-600 rounded-full px-3 py-1 my-3 w-fit mx-auto text-sm text-zinc-300 [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] ">
              {entry}
            </div>
          );
        } else if (entryIsMessage(entry)) {
          // Poor man's `if let` in Rust, I miss it.
          const message = entry;

          // If this message is the last of a group from the same author,
          // it will display a stylized speech bubble tick.
          const nextMessage = chat.at(index + 1);
          const isLastOfGroup =
            nextMessage == null ||
            entryIsDateMarker(nextMessage) ||
            nextMessage?.author !== message.author;

          return (
            <Message
              message={message}
              senders={senders}
              showTick={isLastOfGroup}
              // @ts-ignore (why tough)
              key={index}
            />
          );
        }
      })}
    </div>
  );
};
