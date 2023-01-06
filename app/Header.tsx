import React, { Fragment } from 'react';
import { css } from '@emotion/css';

const styles = {
  header: css`
    z-index: 1;
    display: flex;
    justify-content: space-between;
    background: whitesmoke;
    position: fixed;
    top: 0;
    width: 100%;
    padding: 12px;
  `,
};

const GreenSenderSelector = ({
  senders,
  greenSender,
  handleChangeGreenSender,
  isGroupChat,
  chatLoaded,
}) => {
  if (!isGroupChat) {
    const otherSender = Object.keys(senders).find((s) => s !== greenSender);

    return (
      <Fragment>
        {/* <Avatar isSolid name={otherSender} size={32} />{' '} */}
        <p>{otherSender}</p>
        <button
          onClick={() => handleChangeGreenSender(otherSender)}
          disabled={!chatLoaded}>
          Swap sides
        </button>
        {/* <Avatar isSolid name={greenSender} size={32} />{' '} */}
        <p>{greenSender}</p>
      </Fragment>
    );
  } else {
    return (
      <div style={{ width: '170px' }}>
        <select onChange={(e) => handleChangeGreenSender(e.target.value)}>
          {Object.keys(senders).map((s) => (
            <option value={s}>{s}</option>
          ))}
        </select>
      </div>
    );
  }
};

const Header = ({
  handleChatUploaded,
  chatLoaded,
  senders,
  greenSender,
  handleChangeGreenSender,
  isGroupChat,
}) => {
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
    <div className={styles.header}>
      <h2 className="text-green-500" size={700}>
        Whatsapp Archive Viewer
      </h2>
      {chatLoaded && (
        <GreenSenderSelector
          greenSender={greenSender}
          senders={senders}
          handleChangeGreenSender={handleChangeGreenSender}
          chatLoaded={chatLoaded}
          isGroupChat={isGroupChat}
        />
      )}
      <input
        type="file"
        multiple={false}
        placeholder="Upload a WhatsApp archive file"
        accept=".txt"
        onChange={handleFileChosen}
      />
    </div>
  );
};

export default Header;
