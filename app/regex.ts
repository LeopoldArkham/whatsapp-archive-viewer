const date = /(?<date>\d{1,2}\/\d{1,2}\/\d{1,2})/;
const time = /(?<time>\d{2}:\d{2})/;
const author = /(?<author>[^:\n\r]+)/;
const text = /(?<text>.+)/;

export const messageRegex = new RegExp(
  date.source + ', ' + time.source + ' - ' + author.source + ': ' + text.source,
  'g'
);
