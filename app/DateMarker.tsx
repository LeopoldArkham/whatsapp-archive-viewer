import React from 'react';

interface DateMarkerProps {
  children: string;
}

export const DateMarker = ({ children }: DateMarkerProps) => {
  return (
    <div className="bg-zinc-600 rounded-full px-3 py-1 my-3 w-fit text-sm text-zinc-300 [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] ">
      {children}
    </div>
  );
};
