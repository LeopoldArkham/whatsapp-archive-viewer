import React from 'react';
import { css, cx } from 'emotion';
import { Pane, Autocomplete } from 'evergreen-ui';
import v4 from 'uuid/v4';


const styles = {

  message: css`
  position: relative;
    padding: 10px;
    margin: 10px 10px 10px auto;
    background-color: #DCF8C6;
    font-family: "Segoe UI";
    max-width: 66%;
    width: fit-content;
    border-radius: 10px;
  `,
  padRight: css`
    padding-right: 60px 
  `,
  otherSender: css`
    margin: 10px auto 10px 10px;
    background: white;
  `,
  timeSent: css`
    position: absolute;
    right: 5px;
    bottom: 5px;
    font-style: italic;
    font-size: 0.9em;
    color: grey;
  `,
};


const Message = ({
  date,
  time,
  sender,
  message,
  isSender1,
  swapSides,
}) => {

  return (
    <div className={cx(styles.message, { [styles.otherSender]: isSender1 ^ swapSides, [styles.padRight]: message.length <= 115 })}>
      {message}
      <div className={styles.timeSent}>
        {time}
      </div>
    </div>
  );
}


const Body = ({ chat, sender1, swapSides }) => {
  return (
    <Pane width="1200px" margin="auto" paddingTop="70px" zIndex="0">
      {chat?.map((msg) => {
        const [
          date,
          time,
          sender,
          message,
        ] = msg;

        return (
          <Message
            key={v4()}
            date={date}
            time={time}
            sender={sender}
            message={message}
            isSender1={sender === sender1}
            swapSides={swapSides}
          />
        );
      })}
    </Pane>
  );
};


export default Body;