import { Dayjs } from 'dayjs';

export type Color = string;

export interface Message {
  text: string;
  time: string;
  // todo: Evaluate performance impact of including the author's color instead of looking it up in the component
  author: string;
}

export type DateMarker = string;

export type ChatEntry = Message | DateMarker;

export interface Sender {
  name: string;
  color: Color;
}
