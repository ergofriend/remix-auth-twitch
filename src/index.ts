import {
  AppLoadContext,
  json,
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
} from "./twitch";
import { isCallback } from "./util";

export type TwitchProfile = Profile;

export type TwitchStrategyOptions = {
  clientId: string;
  clientSecret: string;
  callbackURL: string;
  includeEmail?: boolean;
};

export type TwitchStrategyVerifyParams = TokenResult & {
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

  private csrfToken = "";

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
      !isCallback({
        requestURL: request.url,
        callbackURL: this.callbackURL,
      })
    ) {
      this.csrfToken = "123";
      throw authorize({
        clientId: this.clientId,
        callbackURL: this.callbackURL,
        scopes: this.includeEmail ? ["user:read:email"] : [],
        csrfToken: this.csrfToken,
      });
    }
    const authorizedParams = getAuthorizedParams(request.url);
    if (this.csrfToken !== authorizedParams.state)
      throw json(
        { message: "/authorize returned invalid CSRF Token" },
        {
          status: 401,
        }
      );
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

    // Step 3: Get Profile
    const profile = await getAuthorizedUser({
      clientId: this.clientId,
      accessToken: token.access_token,
    });

    try {
      const user = await this.verify({
        ...token,
        profile,
        context: options.context,
      });
      return await this.success(user, request, sessionStorage, options);
    } catch (error) {
      const message = (error as Error).message;
      return await this.failure(message, request, sessionStorage, options);
    }
  }
}
