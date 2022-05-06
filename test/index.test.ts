import { createCookieSessionStorage } from "@remix-run/node";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import { TwitchStrategy } from "../src";
import { TwitchStrategyOptions } from "../build";

enableFetchMocks();

describe(TwitchStrategy, () => {
  let verify = jest.fn();
  let sessionStorage = createCookieSessionStorage({
    cookie: { secrets: ["s3cr3t"] },
  });

  let options: TwitchStrategyOptions = Object.freeze({
    clientId: "MY_CLIENT_ID",
    clientSecret: "MY_CLIENT_SECRET",
    callbackURL: "https://example.com/callback",
    includeEmail: true,
  });

  interface User {
    id: number;
  }

  beforeEach(() => {
    jest.resetAllMocks();
    fetchMock.resetMocks();
  });

  test("should have the name `twitch`", () => {
    let strategy = new TwitchStrategy<User>(options, verify);
    expect(strategy.name).toBe("twitch");
  });

  test("if user is already in the session redirect to `/`", async () => {
    let strategy = new TwitchStrategy<User>(options, verify);

    let session = await sessionStorage.getSession();
    session.set("user", { id: 123 });

    let request = new Request("https://example.com/login", {
      headers: { cookie: await sessionStorage.commitSession(session) },
    });

    let user = await strategy.authenticate(request, sessionStorage, {
      sessionKey: "user",
    });

    expect(user).toEqual({ id: 123 });
  });

  test("if user is already in the session and successRedirect is set throw a redirect", async () => {
    let strategy = new TwitchStrategy<User>(options, verify);

    let session = await sessionStorage.getSession();
    session.set("user", { id: 123 } as User);

    let request = new Request("https://example.com/login", {
      headers: { cookie: await sessionStorage.commitSession(session) },
    });

    try {
      await strategy.authenticate(request, sessionStorage, {
        sessionKey: "user",
        successRedirect: "/dashboard",
      });
    } catch (error) {
      if (!(error instanceof Response)) throw error;
      expect(error.headers.get("Location")).toBe("/dashboard");
    }
  });

  test("should throw if current url is not callback url", async () => {
    let strategy = new TwitchStrategy<User>(options, verify);

    let request = new Request("https://example.com/login");

    fetchMock.mockIf(/oauth2\/authorize/, async () => {
      return {
        body: "",
        init: { status: 200 },
      };
    });

    try {
      await strategy.authenticate(request, sessionStorage, {
        sessionKey: "user",
      });
      fail("should throw Response");
    } catch (error) {
      expect(error.status).toBe(302);
      expect(error instanceof Response).toBe(true);
    }
  });
});
