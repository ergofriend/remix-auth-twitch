type isCallbackProps = {
  requestURL: string;
  callbackURL: string;
};
export const isCallback = ({ requestURL, callbackURL }: isCallbackProps) => {
  const current = new URL(requestURL);
  const callback = getCallbackURL(current, callbackURL);
  return current.pathname === callback.pathname;
};
const getCallbackURL = (url: URL, callbackURL: string) => {
  if (callbackURL.startsWith("http:") || callbackURL.startsWith("https:")) {
    return new URL(callbackURL);
  }
  if (callbackURL.startsWith("/")) {
    return new URL(callbackURL, url);
  }
  return new URL(`${url.protocol}//${callbackURL}`);
};

export const getCSRFToken = () =>
  Math.random().toString(36).slice(2, 10) +
  Math.random().toString(36).slice(2, 10);
