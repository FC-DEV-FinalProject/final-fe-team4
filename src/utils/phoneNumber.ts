export const formatPhoneNumber = (phoneNumber: string): string => {
  const numbersOnly = phoneNumber.replace(/[^0-9]/g, '');
  const trimmedNumbers = numbersOnly.slice(0, 11);
  if (trimmedNumbers.length <= 3) {
    return trimmedNumbers;
  } else if (trimmedNumbers.length <= 7) {
    return `${trimmedNumbers.slice(0, 3)}-${trimmedNumbers.slice(3)}`;
  } else {
    return `${trimmedNumbers.slice(0, 3)}-${trimmedNumbers.slice(3, 7)}-${trimmedNumbers.slice(7)}`;
  }
};

export const formattedPhone = (phoneNumber: string): string => {
  return phoneNumber.replace(/[^0-9]/g, '');
};
