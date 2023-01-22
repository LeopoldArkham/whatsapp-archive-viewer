import React, { Fragment } from 'react';

const Header = ({
  handleChatUploaded,
  isChatLoaded,
  senders,
  greenSender,
  handleChangeGreenSender,
  isGroupChat,
}) => {
  let reader: FileReader;

  const handleFileRead = () => {
    const content = reader.result;
    handleChatUploaded(content);
  };

  const handleFileChosen = (e) => {
    const file = e.target.files[0];
    reader = new FileReader();
    reader.onloadend = handleFileRead;
    console.log(reader);
    reader.readAsText(file);
  };

  return (
    <div className="fixed w-full border-b border-cyan-200/30 backdrop-blur-sm z-10 px-8 flex flex-center justify-between items-center h-20 bg-slate-900/80">
      <h2 className="text-white text-2xl">Whatsapp Archive Viewer</h2>
      <input
        id="file-upload"
        type="file"
        multiple={false}
        placeholder="Upload a WhatsApp archive file"
        accept=".txt"
        onChange={handleFileChosen}
        className="hidden"
      />
      <label
        htmlFor="file-upload"
        className="text-slate-200 bg-sky-500  text-l rounded-lg px-3 py-2 cursor-pointer hover:bg-sky-400 hover:file:text-slate-100 transition-all">
        Choose a file{' '}
      </label>
    </div>
  );
};

export default Header;
