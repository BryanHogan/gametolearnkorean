# Monetization & Analytics Strategy

## Analytics Stack

### Umami (Traffic & Page Analytics)
- **Purpose:** Simple, privacy-first traffic stats — page views, referrers, countries, device types
- **Privacy:** GDPR-compliant, no cookies, no consent banner needed
- **Setup:** Self-hosted (free) or cloud
- **Integration:** Add script to `src/app.html`, works in both web and Capacitor webview
- **Docs:** https://umami.is/docs

### PostHog (Product Analytics)
- **Purpose:** In-app behavior — retention curves, funnels, feature usage, session depth
- **Privacy:** Cookieless mode available (use localStorage-based ID)
- **Cost:** Free up to 1M events/month
- **Integration:** JS SDK in `src/lib/util/analytics.svelte.js`
- **Docs:** https://posthog.com/docs

#### Key Events to Track
| Event | When | Properties |
|-------|------|------------|
| `session_start` | `Game.startGame()` | `wordCount`, `difficulty` |
| `session_complete` | `Game.completeSession()` | `duration`, `accuracy`, `wordsLearned`, `score` |
| `task_complete` | `Game.updateWordProgress()` | `taskType`, `isCorrectFirstTry` |
| `task_failed` | `Game.penalizeWord()` | `taskType`, `word` |
| `streak_milestone` | When streak hits 5, 10, 25... | `streakCount` |

---

## Monetization Stack

### Firebase Authentication
- **Purpose:** User identity for cross-platform subscription sync
- **Methods:** Email/password, Google Sign-In
- **Integration:** `@capacitor-firebase/authentication` for native, Firebase JS SDK for web
- **Docs:** https://firebase.google.com/docs/auth

### RevenueCat (Subscription Management)
- **Purpose:** Handle subscriptions across web (Stripe) + Android (Google Play Billing)
- **Features:** 
  - Cross-platform entitlement sync via Firebase user ID
  - Trial periods, grace periods, cancellation handling
  - Analytics dashboard for MRR, churn, LTV
- **Integration:** 
  - Web: RevenueCat JS SDK + Stripe
  - Android: `@revenuecat/purchases-capacitor`
- **Docs:** https://docs.revenuecat.com

#### Premium Features (Planned)
| Feature | Free | Premium |
|---------|------|---------|
| Core learning (all task types) | ✅ | ✅ |
| Progress sync across devices | ❌ | ✅ |
| Audio-only mode | ❌ | ✅ |
| Sentence-based tasks | ❌ | ✅ |
| Ad-free (Android) | ❌ | ✅ |

#### Pricing (TBD)
- Monthly: ~$2.99/month
- Yearly: ~$19.99/year (save ~45%)
- Consider: One-time lifetime unlock option

---

## Implementation Order

1. **Phase 1: Analytics**
   - [ ] Set up Umami instance (self-host or cloud)
   - [ ] Add Umami script to `app.html`
   - [ ] Create `src/lib/util/analytics.svelte.js` wrapper
   - [ ] Integrate PostHog JS SDK
   - [ ] Instrument key events in `game.svelte.js`

2. **Phase 2: User Accounts**
   - [ ] Add Firebase project and `google-services.json`
   - [ ] Implement Firebase Auth in `src/lib/util/auth.svelte.js`
   - [ ] Add login/signup UI in Settings or dedicated page
   - [ ] Migrate IndexedDB progress to Firestore (optional, for sync)

3. **Phase 3: Subscriptions**
   - [ ] Set up RevenueCat project
   - [ ] Configure Stripe (web) and Google Play (Android) in RevenueCat
   - [ ] Create `src/lib/util/premium.svelte.js` for entitlement checks
   - [ ] Add subscription UI (paywall, manage subscription)
   - [ ] Gate premium features behind `isPremium` state

---

## Files to Create/Modify

| File | Purpose |
|------|---------|
| `src/app.html` | Add Umami + PostHog scripts |
| `src/lib/util/analytics.svelte.js` | Event tracking wrapper |
| `src/lib/util/auth.svelte.js` | Firebase Auth state management |
| `src/lib/util/premium.svelte.js` | RevenueCat entitlement state |
| `android/app/google-services.json` | Firebase config (Android) |
| `src/lib/components/AuthModal.svelte` | Login/signup UI |
| `src/lib/components/PaywallModal.svelte` | Subscription purchase UI |
