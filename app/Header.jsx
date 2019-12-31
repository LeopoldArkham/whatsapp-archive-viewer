import React from 'react';
import { css } from 'emotion'
import { Pane, Heading, FilePicker, Button, majorScale } from 'evergreen-ui';


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


const Header = ({ processChat, setSwapSides }) => {
  let reader;


  const handleFileRead = () => {
    const content = reader.result;
    processChat(content);
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
      <Button iconBefore="swap-horizontal" onClick={() => setSwapSides(prevValue => !prevValue)}>
        Swap sides
      </Button>
      <FilePicker
        multiple={false}
        placeholder="Upload a WhatsApp archive file"
        accept=".txt"
        onChange={handleFileChosen} />
    </Pane>
  );
};


export default Header;