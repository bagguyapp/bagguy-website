# Bag Guy Production Tooling Roadmap

Bag Guy is strongest when the app feels real, measurable, and trustworthy. This roadmap lists tools that materially improve production quality without changing the core product promise or exposing secrets in the repo.

## Priority 1: Observability And Crash Quality

### Sentry

Use Sentry for mobile crash reporting and backend exception visibility.

Why it matters:
- Physical iPhone scan issues need device, OS, route, and stack context.
- Receipt scan, rewards sync, and backend connector failures should produce actionable reports.
- Expo has official Sentry guidance for React Native projects and EAS workflows.

Safe first step:
- Add env placeholders only.
- Add a short implementation ticket before installing SDKs.
- Never commit DSNs or auth tokens.

Suggested env:

```bash
SENTRY_DSN=
SENTRY_ENVIRONMENT=development
SENTRY_RELEASE=
```

Reference: Expo Sentry guide: https://docs.expo.dev/guides/using-sentry/

## Priority 2: Product Analytics And Feature Flags

### PostHog

Use PostHog or a similar analytics/feature-flag service to understand real behavior and safely gate risky features.

Why it matters:
- Receipt scan, deal save, rewards history, signup, and backend unreachable states need funnel visibility.
- Feature flags let Bag Guy disable experimental coupon providers, wallet-facing copy, or new scan paths without a new app build.
- Expo documents feature-flag services for React Native, including PostHog.

Safe first events:
- `app_opened`
- `scan_receipt_tapped`
- `scan_receipt_processed`
- `scan_receipt_failed`
- `deal_saved`
- `reward_history_viewed`
- `signup_completed`
- `backend_unreachable_seen`

Suggested env:

```bash
POSTHOG_API_KEY=
POSTHOG_HOST=
FEATURE_FLAGS_ENABLED=false
```

Reference: Expo feature flag guide: https://docs.expo.dev/guides/using-feature-flags/

## Priority 3: Backend API Tracing

### OpenTelemetry

Use OpenTelemetry for backend traces once connector traffic increases.

Why it matters:
- Kroger, UPC, coupon, receipt, and reward endpoints need timing visibility.
- Traces make it clear whether slow scans are caused by phone network, backend logic, or third-party providers.

Safe first spans:
- `/health`
- `/api/scan/receipt`
- `/api/products/upc/{upc}`
- `/api/scan/match-deals`
- Kroger token request
- Kroger product lookup
- rewards earn/reconcile

Suggested env:

```bash
OTEL_ENABLED=false
OTEL_SERVICE_NAME=bag-guy-backend
OTEL_EXPORTER_OTLP_ENDPOINT=
```

## Priority 4: Customer Support Ops

### Support Inbox

Use a support inbox tool or a simple shared support address with clear routing.

Why it matters:
- App Review, receipt scan issues, account access, and rewards questions need a reliable place to land.
- Public website copy now points to `support@bagguyapp.com`.

Safe first workflow:
- Create categories: account, receipt scan, rewards, deals, app review, privacy.
- Use support macros, not promises of guaranteed coupon redemption.

## Priority 5: Paid Features Only If Needed

### RevenueCat

Use RevenueCat only if Bag Guy later adds subscriptions or paid premium features.

Why it matters:
- RevenueCat handles cross-platform subscription status and App Store/Google Play purchase infrastructure.
- It requires careful App Store copy and testing, so it should not be mixed into the approval-critical app unless needed.

Safe first rule:
- Keep core savings, scan, and rewards usability free and review-safe.
- Do not add subscription UI until the product needs a paid tier.

Reference: RevenueCat Expo guide: https://www.revenuecat.com/docs/getting-started/installation/expo

## Priority 6: Provider Data Readiness

Tools and partners already in motion:
- Kroger Products API for product names, brands, images, prices, SNAP eligibility, aisle, inventory, and fulfillment.
- Go-UPC or UPCitemdb for UPC lookup fallback.
- Ibotta/IPN, Inmar, Eagle Eye, and Atolls/Coupons.com for coupon and promotion partnerships.

Production rules:
- Do not scrape coupon sites.
- Do not guarantee redemption unless provider confirms eligibility.
- Hide expired offers.
- Mark medium/low confidence matches as “Check eligibility.”
- Keep API keys in environment variables only.

## Implementation Order

1. Add analytics and crash-reporting tickets.
2. Add mobile event naming docs.
3. Add backend trace naming docs.
4. Add Sentry/PostHog env placeholders only after deciding providers.
5. Add SDKs in a separate PR with tests and opt-out flags.
6. Keep App Store-visible copy simple and non-crypto by default.

