import React, { useEffect, useState } from 'react';
import { css, cx } from 'emotion';
import { Pane, Autocomplete } from 'evergreen-ui';
import v4 from 'uuid/v4';

const THRESHOLD = 100;

const styles = {
  message: css`
    position: relative;
    padding: 8px;
    margin: 10px auto 10px 10px;
    background-color: white;
    font-family: "Segoe UI";
    max-width: 66%;
    width: fit-content;
    border-radius: 10px 10px 10px 10px;
    box-shadow: 0px 1px 0px 0px rgba(184,184,184,0.5);
  `,
  bubbleTickGreenSender: css`
    border-radius: 10px 0px 10px 10px;

    /* Override the arrow inherited from the base message class */
    &:before {
      content: none;
    }

    &:after {
      content: "";
      position: absolute;
      border-top: 13px solid #DCF8C6;
      border-right: 10px solid transparent;
      right: -10px;
      top: 0;
    }
  `,
  bubbleTickBaseMessage: css`
    border-radius: 0px 10px 10px 10px;

    &:before {
      content: "";
      position: absolute;
      border-top: 13px solid white;
      border-left: 10px solid transparent;
      left: -10px;
      top: 0;
    }
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
    font-family: "Segoe UI";
    box-shadow: 0px 1px 0px 0px rgba(184,184,184,0.8);
    z-index: 5;
  `,
  padRight: css`
    padding-right: 60px 
  `,
  thisSender: css`
    margin: 10px 10px 10px auto;
    background: #DCF8C6;
  `,
  timeSent: css`
    position: absolute;
    right: 4px;
    bottom: 4px;
    font-style: italic;
    font-size: 0.9em;
    color: grey;
  `,
  author: css`
    font-weight: bold;
  `,
};

const Message = ({
  time,
  message,
  isGreenSender,
  swapSides,
  showTick,
  author,
  senders,
}) => {
  return (
    <div className={cx(
      styles.message,
      {
        [styles.thisSender]: isGreenSender ^ swapSides,
        [styles.bubbleTickBaseMessage]: showTick,
        [styles.bubbleTickGreenSender]: showTick && (isGreenSender ^ swapSides),
        [styles.padRight]: message.length <= 115,
      }
    )}>
      {isGreenSender ? null : <div className={styles.author} style={{ color: senders[author].color}}>{author}</div>}
      {message}
      <div className={styles.timeSent}>
        {time}
      </div>
    </div>
  );
}

const Body = ({ chat, greenSender, swapSides, useRenderLimit, senders }) => {

  if (chat == null) return null;

  let prevMessage = chat[1];
  const list = useRenderLimit ? chat.slice(0, THRESHOLD) : chat;

  return (
    <Pane width="1200px" margin="auto" paddingTop="70px" zIndex="0">
      {list.map(object => {
        if (object._type === 'date') {
          return (
            <div className={styles.dateStamp}>
              {object.date}
            </div>
          )
        }
        else {
          const {
            time,
            author,
            message,
          } = object;

          // If this message is the first of a group from the same author,
          // it will display a speech bubble tick.
          const isFirstOfGroup = author !== prevMessage.author;
          prevMessage = object;

          return (
            <Message
              key={v4()}
              time={time}
              message={message}
              senders={senders}
              isGreenSender={author === greenSender}
              author={author}
              swapSides={swapSides}
              showTick={isFirstOfGroup}
            />
          );

        }
      })}
    </Pane>
  );
};


export default Body;