export const getControlErrorCode = (controlName: string): string => {
  const errorCode = 'invalid' + controlName.charAt(0).toUpperCase() + controlName.slice(1);

  return errorCode;
};
