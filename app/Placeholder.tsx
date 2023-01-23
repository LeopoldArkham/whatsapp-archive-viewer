import React from 'react';

interface PlaceholderProps {
  handleChatUploaded: (input: string) => void;
}

export const Placeholder = ({ handleChatUploaded }: PlaceholderProps) => {
  return (
    <div className="h-full flex flex-col items-center pt-28 bg-slate-800">
      <h2 className="text-white text-3xl mb-4">Whatsapp Archive Viewer</h2>
      <p className="text-white">
        Choose a Whatsapp archive (.txt) to upload it.
      </p>
      <p className="text-white mt-2 p-4 shadow-inner bg-slate-900 rounded text-center max-w-[30%]">
        The content of your chat will be processed entirely in your browser, on
        your own computer. At no point is any information about you or your
        conversation transferred or saved anywhere else.
        <br />
        <br />
        This site does not use cookies or local storage.
      </p>
      <a
        className="underline italic text-sky-500 hover:text-sky-300 pt-2 pb-4"
        target="_blank"
        href="https://faq.whatsapp.com/android/chats/how-to-save-your-chat-history/?lang=en">
        How do I export an archive from Whatsapp?
      </a>
      {/* The actual label this refers to is the one in the header */}
      <label
        htmlFor="file-upload"
        className="text-slate-200 bg-sky-500  text-l rounded-lg px-3 py-2 cursor-pointer hover:bg-sky-400 hover:file:text-slate-100 transition-all">
        Choose a file
      </label>
    </div>
  );
};
