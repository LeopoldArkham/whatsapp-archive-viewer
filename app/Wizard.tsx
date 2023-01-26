import { cx } from '@emotion/css';
import React from 'react';
import { ApplicationStep } from './App';
import { Sender } from './types';

type WizardProps = {
  currentStep:
    | ApplicationStep.WelcomeScreen
    | ApplicationStep.Processing
    | ApplicationStep.SelectSender;
  senders: Array<Sender> | undefined;
  greenSender: Sender | undefined;
  onSelectGreenSender: (name: Sender['name']) => void;
};

// -translate-x-[${String(100 * currentStep)}vw]
// -translate-x-[20vw]

function getTranslateAmount(step: ApplicationStep) {
  switch (step) {
    case ApplicationStep.WelcomeScreen:
      return 'translate-x-0';
    case ApplicationStep.Processing:
      return '-translate-x-[100vw]';
    case ApplicationStep.SelectSender:
      return '-translate-x-[200vw]';
  }
}

export const Wizard = ({
  currentStep,
  onSelectGreenSender,
  senders = [],
  greenSender,
}: WizardProps) => {
  senders;
  return (
    //* The different steps are rendered next to each other so that we can animate the transition
    // Welcome Screen
    <div
      className={`h-full transition-all flex w-[300vw] ${getTranslateAmount(
        currentStep
      )}`}>
      <div className="h-full w-screen flex flex-col items-center pt-28 bg-slate-800">
        <h2 className="text-white text-3xl mb-4">Whatsapp Archive Viewer</h2>
        <p className="text-white">
          Choose a Whatsapp archive (.txt) to upload it.
        </p>
        <p className="text-white mt-2 p-4 shadow-inner bg-slate-900 rounded text-center max-w-[30%]">
          The content of your chat will be processed entirely in your browser,
          on your own computer. At no point is any information about you or your
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

      {/* Processing placeholder */}
      <div className="h-full w-screen flex flex-col items-center pt-28 bg-slate-800">
        <h2 className="text-white text-3xl mb-4">Processing</h2>
        <p className="text-white">This might take a few seconds...</p>
      </div>

      {/* Sender Selector */}
      <div className="h-full w-screen flex flex-col items-center pt-28 bg-slate-800">
        <h2 className="text-white text-3xl mb-4">Which one are you?</h2>
        <p className="text-white">
          Select the author from whose perspective you wish to view this
          conversation
        </p>
        <div className="flex flex-col mt-2">
          {senders.map((sender) => {
            const isGreenSender = sender.name === greenSender?.name;
            return (
              <button
                key={sender.name}
                onClick={() => onSelectGreenSender(sender.name)}
                className={cx(
                  'my-2 text-slate-200 hover:text-white hover:text-sha transition-all  hover:ring-2  ring-offset-0 hover:ring-lime-300 hover:bg-gradient-to-bl hover:from-lime-600 hover:to-lime-700  rounded-md text-lg px-4 py-2 ring-inset ring-1  ring-slate-300 click active:from-lime-700 active:to-lime-800 active:ring-lime-400',
                  isGreenSender
                    ? 'ring-lime-300 bg-gradient-to-bl from-lime-600 to-lime-700'
                    : ''
                )}>
                {sender.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
