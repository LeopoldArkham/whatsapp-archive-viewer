import React from 'react';
import { css } from 'emotion'
import { Pane, Heading, FilePicker, Button, majorScale, Select } from 'evergreen-ui';


const styles = {
  header: css`
    z-index: 1;
    display: flex;
    justify-content: space-between;
    background: whitesmoke;
    position: fixed;
    top: 0;
    width: 100%;
    padding: ${majorScale(2)}px;
  `
}


const GreenSenderSelector = ({ senders, greenSender, handleChangeGreenSender, isGroupChat, chatLoaded }) => {
  if (! isGroupChat) {
    const onClick = () => {
      const otherSender = Object.keys(senders).find(s => s !== greenSender);
      handleChangeGreenSender(otherSender);
    }

    return (
      <Button iconBefore="swap-horizontal" onClick={onClick} disabled={!chatLoaded}>
        Swap sides
      </Button>
    );
  }
  else {
    return (
      <div style={{ width: "170px" }}>
        <Select onChange={(e) => handleChangeGreenSender(event.target.value)}>
          {Object.keys(senders).map(s => <option value={s}>{s}</option>)}
        </Select>
      </div>
    );
  }
}


const Header = ({ handleChatUploaded, setSwapSides, chatLoaded, senders, greenSender, handleChangeGreenSender, isGroupChat }) => {
  let reader;

  const handleFileRead = () => {
    const content = reader.result;
    handleChatUploaded(content);
  }
  
  const handleFileChosen = (e) => {
    const file = e[0];
    reader = new FileReader();
    reader.onloadend = handleFileRead;
    reader.readAsText(file);
  }
  
  return (
    <Pane display="flex" className={styles.header}>
      <Heading size={700}>Whatsapp Archive Viewer</Heading>
      { chatLoaded && 
      <GreenSenderSelector
        greenSender={greenSender}
        senders={senders}
        handleChangeGreenSender={handleChangeGreenSender}
        chatLoaded={chatLoaded}
        isGroupChat={isGroupChat}
      />}
      <FilePicker
        multiple={false}
        placeholder="Upload a WhatsApp archive file"
        accept=".txt"
        onChange={handleFileChosen} />
    </Pane>
  );
};


export default Header;