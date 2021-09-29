import React, { useEffect, useState } from 'react';
import { css, cx } from 'emotion';
import {
  Pane,
  Autocomplete,
  Heading,
  Text,
  FilePicker,
  Link,
} from 'evergreen-ui';
import v4 from 'uuid/v4';

const THRESHOLD = 100;

const styles = {
  message: css`
    position: relative;
    padding: 8px;
    margin: 10px auto 10px 10px;
    background-color: white;
    font-family: 'Segoe UI';
    max-width: 66%;
    width: fit-content;
    border-radius: 10px 10px 10px 10px;
    box-shadow: 0px 1px 0px 0px rgba(184, 184, 184, 0.5);
  `,
  bubbleTickGreenSender: css`
    border-radius: 10px 0px 10px 10px;

    /* Override the arrow inherited from the base message class */
    &:before {
      content: none;
    }

    &:after {
      content: '';
      position: absolute;
      border-top: 13px solid #dcf8c6;
      border-right: 10px solid transparent;
      right: -10px;
      top: 0;
    }
  `,
  bubbleTickBaseMessage: css`
    border-radius: 0px 10px 10px 10px;

    &:before {
      content: '';
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
    font-family: 'Segoe UI';
    box-shadow: 0px 1px 0px 0px rgba(184, 184, 184, 0.8);
    z-index: 5;
  `,
  padRight: css`
    padding-right: 60px;
  `,
  thisSender: css`
    margin: 10px 10px 10px auto;
    background: #dcf8c6;
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

const Placeholder = ({ handleChatUploaded }) => {
  let reader;

  const handleFileRead = () => {
    const content = reader.result;
    handleChatUploaded(content);
  };

  const handleFileChosen = (e) => {
    const file = e[0];
    reader = new FileReader();
    reader.onloadend = handleFileRead;
    reader.readAsText(file);
  };

  return (
    <Pane
      width="1200px"
      height="100%"
      margin="auto"
      paddingTop="70px"
      zIndex={0}>
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Heading size={700}>Whatsapp Archive Viewer</Heading>
        <Text marginTop="8px">
          Choose a Whatsapp archive (.txt) to upload it.
        </Text>
        <Link
          target="_blank"
          marginBottom="16px"
          href="https://faq.whatsapp.com/android/chats/how-to-save-your-chat-history/?lang=en">
          How do I export an archive from Whatsapp?
        </Link>
        <FilePicker
          multiple={false}
          placeholder="Upload a WhatsApp archive file"
          accept=".txt"
          onChange={handleFileChosen}
        />
      </div>
    </Pane>
  );
};

const Message = ({
  time,
  message,
  isGreenSender,
  showTick,
  author,
  senders,
  isGroupChat,
}) => {
  return (
    <div
      className={cx(styles.message, {
        [styles.thisSender]: isGreenSender,
        [styles.bubbleTickBaseMessage]: showTick,
        [styles.bubbleTickGreenSender]: showTick && isGreenSender,
        [styles.padRight]: message.length <= 115,
      })}>
      {isGreenSender || !isGroupChat ? null : (
        <div className={styles.author} style={{ color: senders[author].color }}>
          {author}
        </div>
      )}
      {message}
      <div className={styles.timeSent}>{time}</div>
    </div>
  );
};

const Body = ({
  chat,
  greenSender,
  useRenderLimit,
  senders,
  isGroupChat,
  handleChatUploaded,
}) => {
  if (chat == null)
    return <Placeholder handleChatUploaded={handleChatUploaded} />;

  let prevMessage = chat[1];
  const list = useRenderLimit ? chat.slice(0, THRESHOLD) : chat;

  return (
    <Pane width="1200px" margin="auto" paddingTop="70px" zIndex={0}>
      {list.map((object) => {
        if (object._type === 'date') {
          return <div className={styles.dateStamp}>{object.date}</div>;
        } else {
          const { time, author, message } = object;

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
              showTick={isFirstOfGroup}
              isGroupChat={isGroupChat}
            />
          );
        }
      })}
    </Pane>
  );
};

export default Body;
