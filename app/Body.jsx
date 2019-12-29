import React from 'react';
import { css, cx } from 'emotion';
import { Pane } from 'evergreen-ui';
import v4 from 'uuid/v4';


const styles = {
  message: css`
    padding: 10px;
    margin: 10px 10px 10px auto;
    background-color: lightgreen;
    font-family: "Helvetica";
    max-width: 66%;
    width: fit-content;
  `,
  otherSender: css`
    margin: 10px auto 10px 10px;
  `,  
  sender: css`
    font-weight: bold;
    font-size: 1.1em;
    color: darkgreen;
    margin-bottom: 5px;
  `
};


const Message = ({
  date,
  time,
  sender,
  message,
  isSender1,
}) => {

  return (
    <div className={cx(styles.message, { [styles.otherSender]: isSender1 })}>
      <div className={styles.sender}>
        {sender}
      </div>
      {message}
    </div>
  );
}


const Body = ({ chat, sender1 }) => {
  return (
    <Pane width="1200px" background="tint1">
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
          />
        );
      })}
    </Pane>
  );
};


export default Body;