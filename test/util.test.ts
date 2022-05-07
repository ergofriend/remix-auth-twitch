import { isCallback } from "../src/util";

describe("isCallback", () => {
  test("not callback path", () => {
    expect(
      isCallback({
        requestURL: "http://localhost:3000/auth/login",
        callbackURL: "/auth/callback",
      })
    ).toBe(false);

    expect(
      isCallback({
        requestURL: "https://example.com/auth/login",
        callbackURL: "https://example.com/auth/callback",
      })
    ).toBe(false);
  });

  test("callback path", () => {
    expect(
      isCallback({
        requestURL: "http://localhost:3000/auth/callback",
        callbackURL: "/auth/callback",
      })
    ).toBe(true);

    expect(
      isCallback({
        requestURL: "https://example.com/auth/callback",
        callbackURL: "https://example.com/auth/callback",
      })
    ).toBe(true);
  });
});
