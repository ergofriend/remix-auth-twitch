# Remix Auth Twitch

Demo app: https://remix-auth-twitch.pages.dev/

see also [example/README.md](example/README.md)

## Remix Auth plugin for Twitch

[Authentication | Twitch Developers](https://dev.twitch.tv/docs/authentication)

## Supported runtimes

| Runtime    | Has Support |
| ---------- | ----------- |
| Node.js    | ✅          |
| Cloudflare | ✅          |

## How to use

### Installation

Install remix-auth-twitch npm module along with remix-auth:

```
npm install remix-auth-twitch remix-auth

yarn add remix-auth-twitch remix-auth
```

### Prerequisites

- Your app is registered to Twitch and has consumer key and secret issued https://dev.twitch.tv/docs/authentication/register-app
- Your app has [remix-auth](https://github.com/sergiodxa/remix-auth) set up and `authenticator` is provided:
  ```typescript
  // app/services/auth.server.ts
  export let authenticator = ...;
  ```

### Add remix project

See also [na2hiro/remix-auth-twitter: Remix Auth plugin for Twitter OAuth 1.0a](https://github.com/na2hiro/remix-auth-twitter)

```typescript
const twitchClientId = process.env.TWITCH_API_CLIENT
const twitchClientSecret = process.env.TWITCH_API_SECRET
const twitchStrategy = new TwitchStrategy(
  {
    clientId: twitchClientId,
    clientSecret: twitchClientSecret,
    callbackURL: 'http://localhost:3000/login/callback',
    includeEmail: true,
  },
  async ({ profile, token }) => {
    return {
      id: profile.id,
      screen_name: profile.display_name,
      name: profile.login,
      email: profile.email,
      accessToken: token.access_token,
    }
  }
)
authenticator.use(twitchStrategy, 'twitch')
```

### [Validating Tokens | Twitch Developers](https://dev.twitch.tv/docs/authentication/validate-tokens)

> Any third-party app that calls the Twitch APIs and maintains an OAuth session must call the /validate endpoint to verify that the access token is still valid. This includes web apps, mobile apps, desktop apps, extensions, and chatbots. Your app must validate the OAuth token when it starts and on an hourly basis thereafter.

First Validation is build-in TwitchStrategy, but Your application must validate it on an hourly basis.

```ts
try {
  await twitchStrategy.validate({ token: accessToken })
} catch {
  authenticator.logout(request, { redirectTo: '/login' })
}
```

## Related

- [@na2hiro](https://github.com/na2hiro) [remix-auth-twitter: Remix Auth plugin for Twitter OAuth 1.0a](https://github.com/na2hiro/remix-auth-twitter)
- [@sergiodxa](https://github.com/sergiodxa) [remix-auth-strategy-template: A template for creating a new Remix Auth strategy.](https://github.com/sergiodxa/remix-auth-strategy-template)
- [@FezVrasta](https://github.com/FezVrasta) [Firebase Twitch OAuth Flow (Cloud Functions implementation)](https://gist.github.com/FezVrasta/57d29cd2bbc4ed80e169780035f748cf)
