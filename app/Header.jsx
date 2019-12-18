import React from 'react';
import { Pane, Heading, majorScale } from 'evergreen-ui';


const Header = () => {
  return (
    <Pane display="flex" background="tint2" padding={majorScale(2)}>
      <Pane>
        <Heading size={700}>Whatsapp Archive Viewer</Heading>
      </Pane>
    </Pane>
  );
};


export default Header;