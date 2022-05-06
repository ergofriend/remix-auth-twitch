type isCallbackProps = {
  requestURL: string;
  callbackURL: string;
};

export const isCallback = ({ requestURL, callbackURL }: isCallbackProps) => {
  const current = new URL(requestURL);
  const callback = new URL(callbackURL);
  return current.pathname === callback.pathname;
};
