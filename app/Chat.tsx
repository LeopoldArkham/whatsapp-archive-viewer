import React, { useEffect, useRef, useState } from 'react';
import { css, cx } from '@emotion/css';
import { ChatEntry, DateMarker, Message, Sender } from './types';
import { useGlobalAppState } from './App';
import { DateMarker as DateMarkerComponent } from './DateMarker';

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
  const [currentDate, setCurrentDate] = useState<string>(
    chat.find(entryIsDateMarker) ?? 'Problem'
  );

  useEffect(() => {
    const initialDate = chat.find(entryIsDateMarker);
    if (initialDate == null) {
      console.error('Did not find a date in the chat array');
      return;
    }
    setCurrentDate(initialDate);
  }, [chat == null]);

  useEffect(() => {
    const dates = document.querySelectorAll('[data-date-marker]');
    const wrapper = document.querySelector('[data-chat-wrapper');
    const permanentMarker = document.querySelector(
      '[data-permanent-date-marker]'
    );

    const viewportHeight = window.innerHeight;
    const bottomOfPermanentMarker =
      document
        .querySelector('[data-permanent-date-marker]')
        ?.getBoundingClientRect().bottom ?? 0;
    const rootBottomMargin = viewportHeight - bottomOfPermanentMarker;

    const observer = new IntersectionObserver(
      (args) => {
        args.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.boundingClientRect.top <= bottomOfPermanentMarker
          ) {
            if (
              (permanentMarker as HTMLElement).innerText ===
              (entry.target as HTMLElement).innerText
            ) {
              setCurrentDate(
                entry.target.getAttribute('data-previous-date') ?? ''
              );
              entry.target.classList.remove('opacity-0');
            } else {
              setCurrentDate((entry.target as HTMLElement).innerText);
              entry.target.classList.add('opacity-0');
            }
          }
        });
      },
      {
        root: wrapper,
        rootMargin: `0px 0px -${rootBottomMargin}px 0px`,
      }
    );

    dates.forEach((date) => observer.observe(date));
  }, [chat == null]);

  let previousDate = chat.find(entryIsDateMarker);

  return (
    <div
      data-chat-wrapper
      className="bg-slate-800 font-['Segoe_UI'] px-[15vw] pt-24 h-[100vh] overflow-y-auto overflow-x-hidden">
      <div
        data-permanent-date-marker
        className="fixed z-10 left-[50vw] -translate-x-[50%] t-20">
        <DateMarkerComponent>{currentDate}</DateMarkerComponent>
        <span></span>
      </div>
      {chat.map((entry, index) => {
        if (entryIsDateMarker(entry)) {
          const dateMarker = (
            // The css properties that follow are used so that these date markers center horizontally
            // in the same way that the fixed one does. If we do not center both relative to vw 100%,
            // there will be an offset the with of the scrollbar.
            <div
              data-date-marker
              data-previous-date={previousDate}
              className="w-[100vw] ml-[-15vw] h-[52px] relative transition-all">
              <div className="w-fit absolute left-[50vw] -translate-x-[50%]">
                <DateMarkerComponent key={entry}>{entry}</DateMarkerComponent>
              </div>
            </div>
          );
          previousDate = entry;
          return dateMarker;
        } else if (entryIsMessage(entry)) {
          // If this message is the last of a group from the same author,
          // it will display a stylized speech bubble tick.
          const nextMessage = chat.at(index + 1);
          const isLastOfGroup =
            nextMessage == null ||
            entryIsDateMarker(nextMessage) ||
            nextMessage?.author !== entry.author;

          return (
            <Message
              key={index}
              message={entry}
              senders={senders}
              showTick={isLastOfGroup}
            />
          );
        }
      })}
    </div>
  );
};
