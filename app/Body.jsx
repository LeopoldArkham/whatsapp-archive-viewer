import React from 'react';
import { css, cx } from 'emotion';
import { Pane, Autocomplete } from 'evergreen-ui';
import v4 from 'uuid/v4';


const styles = {

  message: css`
    position: relative;
    padding: 8px;
    margin: 10px 10px 10px auto;
    background-color: #DCF8C6;
    font-family: "Segoe UI";
    max-width: 66%;
    width: fit-content;
    border-radius: 10px 10px 10px 10px;
    box-shadow: 0px 1px 0px 0px rgba(184,184,184,0.5);
  `,
  bubbleTickBaseMessage: css`
    border-radius: 10px 0px 10px 10px;

    &:after {
      content: "";
      position: absolute;
      border-top: 13px solid #DCF8C6;
      border-right: 10px solid transparent;
      right: -10px;
      top: 0;
    }
  `,
  bubbleTickThisSender: css`
    border-radius: 0px 10px 10px 10px;

    /* Override the arrow inherited from the base message class */
    &:after {
      content: none;
    }

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
    margin: 10px auto 10px 10px;
    background: white;
  `,
  timeSent: css`
    position: absolute;
    right: 4px;
    bottom: 4px;
    font-style: italic;
    font-size: 0.9em;
    color: grey;
  `,
};


const Message = ({
  time,
  message,
  isSender1,
  swapSides,
  showTick,
}) => {

  return (
    <div className={cx(
      styles.message,
      {
        [styles.thisSender]: isSender1 ^ swapSides,
        [styles.bubbleTickBaseMessage]: showTick,
        [styles.bubbleTickThisSender]: showTick && (isSender1 ^ swapSides),
        [styles.padRight]: message.length <= 115,
      }
    )}>
      {message}
      <div className={styles.timeSent}>
        {time}
      </div>
    </div>
  );
}


const Body = ({ chat, sender1, swapSides }) => {
  if (chat == null) return null;
  let prevMessage = chat[1];

  return (
    <Pane width="1200px" margin="auto" paddingTop="70px" zIndex="0">
      {chat.slice(0, 100).map(object => {
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
              isSender1={author === sender1}
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