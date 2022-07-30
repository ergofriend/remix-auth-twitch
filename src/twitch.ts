const requestAuthorizeURL = "https://id.twitch.tv/oauth2/authorize";
const requestTokenURL = "https://id.twitch.tv/oauth2/token";
const requestUserURL = "https://api.twitch.tv/helix/users";
const validateTokenURL = "https://id.twitch.tv/oauth2/validate";

// https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#authorization-code-grant-flow

type AuthorizeProps = {
  clientId: string;
  callbackURL: string;
  scopes: string[];
  csrfToken?: string;
};
export const authorize = ({
  clientId,
  callbackURL,
  scopes,
  csrfToken,
}: AuthorizeProps) => {
  const params = new URLSearchParams({
    response_type: "code",
    scope: scopes.join(" "),
    client_id: clientId,
    redirect_uri: callbackURL,
    ...(csrfToken ? { state: csrfToken } : {}),
  });
  return `${requestAuthorizeURL}?${params.toString()}`;
};

type AuthorizedParams = {
  code?: string;
  scope?: string;
  error?: string;
  error_description?: string;
  state?: string;
};
type AuthorizedResult = {
  result: {
    code?: string;
    scope?: string;
  };
  error: {
    error?: string;
    error_description?: string;
  };
  state?: string;
};
export const getAuthorizedParams = (url: string): AuthorizedResult => {
  const currentURL = new URL(url);
  const params = Object.fromEntries(
    currentURL.searchParams
  ) as AuthorizedParams;
  return {
    result: {
      code: params.code,
      scope: params.scope,
    },
    error: {
      error: params.error,
      error_description: params.error_description,
    },
    state: params.state,
  };
};

type TokenizeProps = {
  code: string;
  callbackURL: string;
  clientId: string;
  clientSecret: string;
};
export type TokenResult = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: string;
};
export const tokenize = async ({
  code,
  callbackURL,
  clientId,
  clientSecret,
}: TokenizeProps) => {
  const params = new URLSearchParams({
    code: code,
    grant_type: "authorization_code",
    redirect_uri: callbackURL,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const result = await fetch(requestTokenURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  const token = (await result.json()) as unknown as TokenResult;
  return token;
};

type getAuthorizedUserProps = {
  clientId: string;
  accessToken: string;
};
export const getAuthorizedUser = async ({
  clientId,
  accessToken,
}: getAuthorizedUserProps) => {
  const response = await fetch(requestUserURL, {
    method: "GET",
    headers: {
      "Client-Id": clientId,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const { data } = (await response.json()) as unknown as UsersResult;
  const user = data[0];
  return user;
};

// https://dev.twitch.tv/docs/api/reference#get-users
type UsersResult = {
  data: Profile[];
};

export type Profile = {
  broadcaster_type: "partner" | "affiliate" | "";
  description: string;
  display_name: string;
  id: string;
  login: string;
  offline_image_url: string;
  profile_image_url: string;
  type: "staff" | "admin" | "global_mod" | "";
  view_count: number;
  created_at: string;
  // Returned if the request includes the user:read:email scope.
  email?: string;
};

// fix: https://github.com/ergofriend/remix-auth-twitch/issues/1
// ref: https://dev.twitch.tv/docs/authentication/validate-tokens
type ValidateProps = {
  token: string;
};
type ValidTokenResponse = {
  client_id: string;
  login: string;
  scopes: string[];
  user_id: number;
  expires_in: number;
};
type InvalidTokenResponse = {
  status: 401;
  message: "invalid access token";
};
export const validateToken = async ({
  token,
}: ValidateProps): Promise<ValidTokenResponse | InvalidTokenResponse> => {
  const response = await fetch(validateTokenURL, {
    method: "GET",
    headers: {
      Authorization: `OAuth ${token}`,
    },
  });
  const data = (await response.json()) as unknown as
    | ValidTokenResponse
    | InvalidTokenResponse;

  if (isInvalidToken(data)) throw new Error("Invalid token");

  return data;
};
const isInvalidToken = (res: unknown): res is InvalidTokenResponse =>
  typeof res === "object" &&
  res !== null &&
  typeof (res as InvalidTokenResponse).status === "number" &&
  typeof (res as InvalidTokenResponse).message === "string";
