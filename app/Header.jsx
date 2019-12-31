import React from 'react';
import { css } from 'emotion'
import { Pane, Heading, FilePicker, majorScale } from 'evergreen-ui';


const styles = {
  header: css`
    z-index: 1;
    display: flex;
    background: whitesmoke;
    position: fixed;
    top: 0;
    width: 100%;
    padding: ${majorScale(2)}px;
  `
}


const Header = ({ processChat }) => {
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
    <Pane className={styles.header}>
      <Heading size={700}>Whatsapp Archive Viewer</Heading>
      <FilePicker
        multiple={false}
        placeholder="Upload a WhatsApp archive file"
        accept=".txt"
        onChange={handleFileChosen} />
    </Pane>
  );
};


export default Header;