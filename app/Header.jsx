import React from 'react';
import { Pane, Heading, FilePicker, majorScale } from 'evergreen-ui';


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
    <Pane display="flex" background="tint2" padding={majorScale(2)}>
      <Pane>
        <Heading size={700}>Whatsapp Archive Viewer</Heading>
        <FilePicker
          multiple={false}
          placeholder="Upload a whatsapp archive"
          accept=".txt"
          onChange={handleFileChosen} />
      </Pane>
    </Pane>
  );
};


export default Header;