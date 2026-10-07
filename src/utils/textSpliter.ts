const cleanTextForTTS = (text: string): string => {
  return (
    text
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F\x7F]/g, '')
      .replace(/([^\d\s])\s+([^\d\s])/g, '$1 $2')
      .trim()
  );
};

export const textSplitter = (text: string): string[] => {
  const normalizedText = text.replace(/\r\n|\r|\n/g, '\n');

  return normalizedText
    .split('\n')
    .map(cleanTextForTTS)
    .filter((line) => line.length > 0);
};
