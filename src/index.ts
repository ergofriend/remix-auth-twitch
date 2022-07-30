import {
  AppLoadContext,
  json,
  redirect,
  SessionStorage,
} from "@remix-run/server-runtime";
import {
  AuthenticateOptions,
  Strategy,
  StrategyVerifyCallback,
} from "remix-auth";
import {
  authorize,
  getAuthorizedParams,
  getAuthorizedUser,
  Profile,
  tokenize,
  TokenResult,
  validateToken,
} from "./twitch";
import { getCSRFToken, isCallback } from "./util";

export type TwitchProfile = Profile;

export type TwitchStrategyOptions = {
  clientId: string;
  clientSecret: string;
  callbackURL: string;
  includeEmail?: boolean;
};

export type TwitchStrategyVerifyParams = {
  token: TokenResult;
  profile: Profile;
  context?: AppLoadContext;
};

export class TwitchStrategy<User> extends Strategy<
  User,
  TwitchStrategyVerifyParams
> {
  name = "twitch";

  protected clientId: string;
  protected clientSecret: string;
  protected callbackURL: string;
  protected includeEmail: boolean;

  constructor(
    options: TwitchStrategyOptions,
    verify: StrategyVerifyCallback<User, TwitchStrategyVerifyParams>
  ) {
    super(verify);
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.callbackURL = options.callbackURL;
    this.includeEmail = options.includeEmail || false;
  }

  async authenticate(
    request: Request,
    sessionStorage: SessionStorage,
    options: AuthenticateOptions
  ): Promise<User> {
    const session = await sessionStorage.getSession(
      request.headers.get("Cookie")
    );
    const user: User | null = session.get(options.sessionKey) ?? null;
    if (user) return this.success(user, request, sessionStorage, options);

    // Step 1: Redirect Twitch Authentication Page
    if (
      // Step 1-1: check if login path, redirect to Twitch Authentication Page
      !isCallback({
        requestURL: request.url,
        callbackURL: this.callbackURL,
      })
    ) {
      const csrfToken = getCSRFToken();
      const url = authorize({
        clientId: this.clientId,
        callbackURL: this.callbackURL,
        scopes: this.includeEmail ? ["user:read:email"] : [],
        csrfToken: csrfToken,
      });
      // Step 1-2: csrfToken save to session
      session.set(`${options.sessionKey}:csrfToken`, csrfToken);
      throw redirect(url, {
        headers: {
          "Set-Cookie": await sessionStorage.commitSession(session),
        },
      });
    }
    const authorizedParams = getAuthorizedParams(request.url);
    // Step 1-3: check csrfToken
    if (
      session.get(`${options.sessionKey}:csrfToken`) !== authorizedParams.state
    )
      throw json(
        { message: "/authorize returned invalid CSRF Token" },
        {
          status: 401,
        }
      );
    // Step 1-4: check valid redirected params
    if (!authorizedParams.result.code || authorizedParams.error.error)
      return await this.failure(
        "Please authorize the app",
        request,
        sessionStorage,
        options
      );

    // Step 2: Get Access Token
    const token = await tokenize({
      code: authorizedParams.result.code,
      callbackURL: this.callbackURL,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });

    // Step 2.5: Validate Access Token
    try {
      await validateToken({ token: token.access_token });
    } catch {
      return await this.failure(
        "failed validating Twitch Access Token",
        request,
        sessionStorage,
        options
      );
    }

    // Step 3: Get Profile
    const profile = await getAuthorizedUser({
      clientId: this.clientId,
      accessToken: token.access_token,
    });

    const verifiedUser = await this.verify({
      token,
      profile,
      context: options.context,
    }).catch(() => null);

    if (!verifiedUser)
      return await this.failure(
        "failed verify TwitchStrategyVerifyParams",
        request,
        sessionStorage,
        options
      );

    return await this.success(verifiedUser, request, sessionStorage, options);
  }
}
