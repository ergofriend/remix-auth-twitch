# Remix Auth Twitch

Remix Auth plugin for Twitch

[Authentication | Twitch Developers](https://dev.twitch.tv/docs/authentication)

## Supported runtimes

| Runtime    | Has Support                           |
| ---------- | ------------------------------------- |
| Node.js    | ✅                                    |
| Cloudflare | Please try and tell me that it works. |

## How to use

### Installation

Install remix-auth-twitch npm module along with remix-auth:

```
npm install remix-auth-twitch remix-auth
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
authenticator.use(
  new TwitchStrategy(
    {
      clientId,
      clientSecret,
      callbackURL: 'http://localhost:3000/login/callback',
      includeEmail: true,
    },
    async ({profile}) => {
      return {
        id: profile.id,
        screen_name: profile.display_name,
        name: profile.login,
        email: profile.email,
      }
    }
  ),
  'twitch'
)

```

## Related

- [@na2hiro](https://github.com/na2hiro) [remix-auth-twitter: Remix Auth plugin for Twitter OAuth 1.0a](https://github.com/na2hiro/remix-auth-twitter)
- [@sergiodxa](https://github.com/sergiodxa) [remix-auth-strategy-template: A template for creating a new Remix Auth strategy.](https://github.com/sergiodxa/remix-auth-strategy-template)
- [@FezVrasta](https://github.com/FezVrasta) [Firebase Twitch OAuth Flow (Cloud Functions implementation)](https://gist.github.com/FezVrasta/57d29cd2bbc4ed80e169780035f748cf)
