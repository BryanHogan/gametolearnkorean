# Game To Learn Korean

Make learning with flashcards more fun with gamification.

## Tech-Stack

- SvelteKit
- PostCSS: A css pre-processor, enhances CSS.
- CapacitorJS: Turn my website into an Android and iOS app.
- Tauri: Turn my website into a Windows and Mac app.

## Setup

1. Setup SvelteKit project with `npx sv create my-app` - https://svelte.dev/docs/kit/creating-a-project
2. Add Capacitor - https://ionic.io/blog/cross-platform-sveltekit-capacitor-application-yes-its-possible
   - `npm i @capacitor/core`
   - `npm i -D @capacitor/cli`
   - `npx cap init`
   - Adjust capacitor.config.ts, change webDir to `build`.
   - `npm i -D @sveltejs/adapter-static`. Add lines to `svelte.config.js` to change adapter to static, adjust first line and add options to adapter. (See guide on ionic.io)
   - Create layout which sets prerender true. (See guide on ionic.io)
   - Probably also want to download Android studio to develop Android app. Install Android Studio and setup emulator.
3. Add Tauri
    - Tauri requires you to download
4. Add PostCSS

### Using Capacitor

The steps above is everything you need to setup the project.  
To now open the app on the emulator we just need to:
- `npm run build`
- `npx cap sync`
- `npx cap open android`

## Audit fixes

When I first setup SvelteKit and added Capacitor I had a few low severity vulnerabilities from the "npm audit report", using "npm audit fix --force" didn't work since it resulted in an error.

Deleting `node_modules` and `package-lock.json` and using pnpm instead solved this issue for me.

1. `npm install -g pnpm`
2. `pnpm install`
3. `pnpm audit --fix`

## Additional Notes

Tauri has recently added the option to not only turn your website into a Windows and Mac app, but also Android and iOS. But that is still a bit experimental.