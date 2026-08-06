# MyWorkout — Project Instructions

## Product

MyWorkout is an AI-assisted workout planning and tracking app. Users create workout routines, complete their sets in a live session, and review progress (history, calendar, and statistics). The experience should feel modern, energetic, simple, and encouraging. Never shame users for their body, fitness level, or missed workouts. AI suggestions must be reviewable, explainable, and never presented as medical advice.

Keep the first version small: email authentication, onboarding, a shared exercise catalogue, custom workouts, active-workout sessions, history, calendar, and basic statistics.

## What this repository is

This is a **single repository** containing the whole app: the Expo mobile client **and** the server it talks to.

- `src/app/api/**/*+api.ts` — HTTP API routes (Expo Router file-based API routes). There is **no** separate Next.js project and **no** separate server repository.
- `src/db/` — Drizzle schema + a Neon Postgres connection (`@neondatabase/serverless`).
- `src/lib/auth.ts` — Better Auth **server** configuration.
- `src/lib/auth-client.ts` — Better Auth **Expo client** used by screens.
- `src/app/` — Expo Router screens (the mobile UI), grouped into `(public)`, `(app)`, etc.

Do not introduce Next.js, Prisma, MongoDB, or a second backend. The app must never connect to Postgres from a screen/component — the DB is only reachable from API routes and the auth server. Never commit database credentials, Better Auth secrets, AI provider secrets, or admin credentials.

## Stack (authoritative versions in `package.json`)

- Expo SDK 57, React Native 0.86, React 19, Expo Router (`typedRoutes` and `reactCompiler` experiments are ON in `app.json`).
- NativeWind v4 + Tailwind CSS v3 (do not mix in NativeWind v5, Tailwind v4, or `react-native-css`).
- Better Auth v1 + `@better-auth/expo` client; `expo-secure-store` for native auth session storage.
- Drizzle ORM + `drizzle-kit` against Neon Postgres (snake_case columns).
- TanStack Query for remote data; `react-hook-form` + `zod` for forms; `date-fns` for dates.
- Fonts: Inter (`@expo-google-fonts/inter`); icons: `@expo/vector-icons` (Feather).

Use one library per responsibility. Do not duplicate server-owned data into other state.

## Getting started

```bash
npm install
# set env vars (see below)
npx expo start          # run the app
```

Environment (loaded from `.env`, see `drizzle.config.ts` / auth):
`DATABASE_URL` (Neon), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `EXPO_PUBLIC_API_URL`, `IMAGEKIT_PRIVATE_KEY`.

Useful scripts: `npm run lint`, `npm run db:generate`, `npm run db:migrate`, `npm run db:seed`, `npm run db:studio`, `npx tsc --noEmit`.

## Auth

- Server: `src/lib/auth.ts` — `betterAuth()` with `drizzleAdapter(db, { provider: "pg", schema })`, email/password (min 8 chars), the `expo()` plugin, and a `trustedOrigins` list containing the app scheme (`aiworkouttrackerapp://`) plus `exp://` hosts in development.
- The `before`/`after` hooks validate the onboarding answers (`zod`) and insert the user's `profiles` row at `/sign-up/email`.
- Client: `src/lib/auth-client.ts` — `createAuthClient` with `expoClient({ scheme, storage: SecureStore, storagePrefix })`. `apiURL` comes from `EXPO_PUBLIC_API_URL`, but the host part is rewritten to the Expo host URI when running on a physical device so the phone can reach the dev server.
- The root `src/app/_layout.tsx` calls `authClient.useSession()` and hides the native splash once fonts are loaded and the session resolves. It renders `<Stack.Protected guard={!session}><Stack.Screen name="(public)" /></Stack.Protected>` and the same pattern for `(app)` when signed in. There is no timed splash screen.
- API routes authenticate with `auth.api.getSession({ headers: request.headers })` and return `401` when there is no session.
- The client fetch functions send the cookie manually: `fetch(url, { credentials: "omit", headers: { Cookie: authClient.getCookie() } })`.

## Routing structure

```text
src/app/
  _layout.tsx                  fonts, splash, QueryClient, KeyboardProvider, auth guard
  (public)/                    welcome, sign-in, sign-up, onboarding/[step]
  (app)/_layout.tsx            Stack: (tabs), (modal)/workout, (modal)/history
  (app)/(tabs)/                index (Home), workouts, create, history, profile
  (app)/(modal)/workout/       create, [id]/index, [id]/active, exercises/index, exercises/[id]
  (app)/(modal)/history/       [id]
  api/                         all HTTP API routes (*+api.ts)
```

- Keep route files thin. Reusable code goes in `src/components/`, `src/hooks/`, `src/lib/`, `src/contexts/`, `src/theme/`, `src/constants/`.
- Use the `@/*` alias for imports from `src`. TypeScript strict mode; avoid `any`; validate unknown data with zod.

### Modal stack (important)

Workout detail, active workout, history detail, exercise list/detail, and create-workout are **not** tab screens. They live in `(app)/(modal)/` so the tab bar never interrupts these flows and so back always returns to the originating list (avoids stale screen state).

Presentations per screen in `(modal)/workout/_layout.tsx`:
- `create` and `[id]/active` — `animation: "slide_from_bottom"`, `presentation: "fullScreenModal"`.
- `[id]/index`, `exercises/index`, `exercises/[id]`, and `(modal)/history` — `animation: "slide_from_right"`.

The center Create tab button is a raised primary circle that intercepts `tabPress` and does `router.push("/workout/create")`.

## Onboarding

One dynamic route per step: `(public)/onboarding/[step].tsx`. Steps are declared in `src/constants/onboarding.ts` (`gender`, `goal`, `experience`), each rendered by a step component that receives `value`/`onChange`. Answers are accumulated in a module-level `answers` object (`resetOnboardingAnswers()` clears it before sign-in/sign-up), and sign-up posts them through the Better Auth hook which creates the `profiles` row. The progress bar width is derived from the current step index.

## State and data rules

- **Server-owned data** (profile, exercises, workouts, sessions, history, stats) → **TanStack Query**, keyed by the entity + id (e.g. `["workouts", id]`, `["home-stats", selectedDate]`). Mutations invalidate/refetch the relevant keys.
- **Short-lived workflow state** → local component state or React context (`src/contexts/workout-draft-context.tsx` provides `useWorkoutDraft()` for the exercise list during workout creation).
- **Forms** → `react-hook-form` + `zod` (resolvers), schemas in `src/lib/validation/`.
- **Timing** → see the timer section below; never rely on `setInterval` counting.
- **Persisted preferences** → only what is required for recovery; auth tokens go through SecureStore via the Better Auth client, never AsyncStorage.

All API data is untrusted until validated (zod on the server; typed on the client). Remote screens must handle loading (skeleton), error (retry), empty, and success states.

## Database schema (`src/db/schema.ts`)

```text
profiles          userId FK → user.id (cascade), gender, goal, experience, weightUnit (kg|lb), timestamps
exercises         id (uuid), slug (unique), name, image?, muscles, description, equipment?,
                  difficulty, forceType?, mechanics?, category, createdAt
workouts          id, userId FK → user.id (cascade), name, description?, image?,
                  isTemplate (default false), createdAt
workout_exercises id, workoutId FK → workouts.id (cascade), exerciseId FK → exercises.id,
                  sets (default 3), reps (default 10), targetWeight?, restSeconds (default 90), position
workout_sessions  id, userId FK → user.id (cascade), workoutId FK → workouts.id,
                  startedAt, completedAt, durationSeconds
workout_session_sets id, sessionId FK → workout_sessions.id (cascade), exerciseId FK → exercises.id,
                  setNumber, reps, weight?
```

- Planned values in `workout_exercises` prefill the Active Workout screen; changing them during a session never mutates the saved workout routine.
- One completed workout = one `workout_sessions` row (History is just the list of sessions; there is no separate history table).
- Only completed sets are saved to `workout_session_sets`. Empty weight is allowed and is excluded from volume calculations.
- `exercises` are seeded (`npm run db:seed`) from 20 public-domain exercises with hosted images; instructions are generated on request by AI, not stored.

## API conventions (`src/app/api/**/*+api.ts`)

Every route:
1. Authenticates: `const session = await auth.api.getSession({ headers: request.headers }); if (!session) return Response.json({ message: "Unauthorized" }, { status: 401 });`
2. Validates input with zod — query params via `z.coerce...safeParse(...)`, bodies via `schema.safeParse(await request.json().catch(() => null))`; returns `400` on failure. UUID path params are validated with `z.uuid()` (`404` if invalid).
3. Scopes every query to `session.user.id` so users can only read/write their own data.
4. Uses `db.batch([...])` for multi-table writes (one round trip). Example: create workout inserts the `workouts` row + all `workout_exercises` rows; finish workout inserts the session + its sets.
5. Returns `Response.json(...)`.

Existing endpoints: `api/auth/[...auth]`, `api/exercises`, `api/exercises/[id]`, `api/workouts`, `api/workouts/[id]`, `api/home-stats`, `api/workout-sessions`. All API data is untrusted until validated.

Client query functions live in `src/lib/api.ts` (e.g. `getWorkoutQueryFn(id)`, `getHomeStatsQueryFn(date)`, `createWorkoutSessionQueryFn(input)`) — typed `fetch` wrappers that throw on `!response.ok` and return `response.json()`.

## Workout flow

1. Open a workout (list/detail) → `router.push("/workout/[id]")`.
2. Detail screen fetches via `getWorkoutQueryFn(id)` (skeleton while loading, error state with retry).
3. **Start Workout** → `router.push("/workout/[id]/active")`.
4. **Active Workout** (`(modal)/workout/[id]/active.tsx`):
   - Fetches the same workout (gives real exercise ids for saving sets).
   - Tracks completed sets in local state keyed by `` `${exercise.id}-${set}` ``.
   - Weight/reps `TextInput`s are uncontrolled (`defaultValue`); edits are captured into a ref map and only read at save time.
   - **Timer**: timestamp-based (see below). Display uses `formatTime` (`new Date(seconds * 1000).toISOString().slice(11, 19)`).
   - **Pause/resume** freezes elapsed; **rest timer** is a small overlay circle that counts down after each completed set with a Skip action.
   - **Leave/back**: a `beforeRemove` navigation listener `event.preventDefault()`s every dismissal (back button, gesture, swipe) and shows an Alert — **Save progress?** with Cancel / Discard / **Save & Leave** when any set is done, or **Leave workout?** when nothing is done. A `allowLeave` ref is set to `true` right before dispatching the pending navigation action so the guard releases.
   - **Finish**: Alert → `saveSession()` → on success `allowLeave.current = true; router.replace("/history")`.
   - `saveSession()` builds the payload and calls `createWorkoutSessionQueryFn`: `{ workoutId, startedAt (from timer), completedAt, durationSeconds, sets: [{ exerciseId, setNumber, reps, weight? }] }`.
5. History shows the saved sessions.

## Timer rule

Do **not** count elapsed time by incrementing a value inside `setInterval` — the OS suspends JS timers in the background and the count drifts. Instead (see `src/hooks/use-workout-timer.ts`):

- Store `startedAt`, an accumulated `elapsedRef`, and a `lastResumeAt` wall-clock timestamp.
- A short interval (500 ms) recomputes `elapsed = accumulated + (Date.now() - lastResumeAt) / 1000` from the clock, so missed ticks cost nothing.
- Pausing folds the running segment into `accumulated`; resuming records a new `lastResumeAt`.
- The rest timer stores an absolute `restEndsAt` timestamp and computes remaining time, so rest survives backgrounding too.
- The hook exposes `startedAt` so the saved session's `startedAt`/`durationSeconds` are real.

Note: the React Compiler is enabled, so `Date.now()`/ref reads are not allowed during render — initialize timestamps in lazy `useState`/effects and read refs only in effects and event handlers.

## Home stats & calendar

- `WeekCalendar` (`src/components/week-calendar.tsx`) is a horizontally paged calendar (3 weeks: 2 past + current) built with `eachWeekOfInterval`/`eachDayOfInterval`. It is **controlled** (`value`/`onChange`) so the parent owns the selected date.
- The Home screen holds `selectedDate` in state and queries `getHomeStatsQueryFn(selectedDate)` keyed by `["home-stats", selectedDate]`, passing results down to the stat cards.
- `api/home-stats?date=YYYY-MM-DD` filters `workout_sessions` where `startedAt` is `>=` that day 00:00 (local) and `<` the next day 00:00, returning `{ workouts, totalTimeSeconds, avgTimeSeconds }`.

## Design system

- Colors are semantic tokens, not hard-coded hex, in feature code. Light/dark palettes and the generated CSS variables live in `src/theme/app-theme.ts`; Tailwind classes use tokens like `bg-primary`, `text-muted-foreground`, `border-border`, `bg-card`, `bg-muted`, `bg-accent`.
- `useAppThemeColor("primary" | "mutedForeground" | ...)` returns the hex for runtime-derived values (icons, chart colors). Inline styles are only for runtime values (timers, progress widths, animations).
- Layout/spacing/typography via NativeWind utility classes. Typefaces: `font-inter`, `font-inter-medium`, `font-inter-semibold`, `font-inter-bold`.
- Reuse primitives in `src/components/ui/` (Button, SafeAreaScreen, Skeleton, EmptyState, ErrorState, LoadingDialog) and composed sections in `src/components/home/`, `src/components/onboarding/`, `src/components/exercise/`. Use `cn()` for conditional classes.
- Accessibility: labels/roles, `accessibilityState` for selection/disabled, 44×44 minimum touch targets, non-color status indicators, reduced-motion aware, dynamic type.

## Code conventions

- API route logic is written with a brief comment per logical line/section so the data flow is obvious (see `api/workouts/[id]+api.ts`, `api/home-stats`, `api/workout-sessions`). Feature code prefers comments only where the intent is non-obvious.
- Run `npx tsc --noEmit` and `npm run lint`. The lint config enforces React Compiler rules: no impure calls (`Date.now()`, `Math.random()`) during render, no ref `.current` access during render, no `setState` synchronously in an effect body. Fix violations by splitting components or moving work into effects/handlers. The only tolerated pre-existing warning is the unused `seed` in `src/db/seed/index.ts`.
- Format changed files before finishing.

## UI verification

For every design-driven screen:

1. Implement correct hierarchy, safe areas, spacing, typography, imagery, and shared components (reference: `designs/`).
2. Run the screen at the reference size and compare side by side with the design; correct measurable differences.
3. Re-check small and large screens, keyboard behavior, loading/error/empty states, accessibility, and both Android and iOS.

Do not claim visual accuracy from code inspection alone. "Works in Expo Go" is not release verification — test native behavior in development builds and release-sensitive behavior on physical devices.

## Before handing off work

1. Format and lint affected files.
2. Run TypeScript checks and relevant tests.
3. Exercise the changed flow in an Expo development build.
4. Compare UI changes with the design reference.
5. Verify loading, empty, offline, and error behavior.
6. Check accessibility and platform differences.
7. Do not add secrets or unrelated backend code.

## Version-one boundaries

- Ready-made workouts are `isTemplate: true` rows populated through `workout_exercises`; copying a template into the user's workouts is a planned follow-up.
- Exercise bookmarks can stay local until a saved-exercises feature is implemented.
- Workout cover images must eventually be uploaded to a provider (ImageKit via `src/lib/imagekit.ts`); the DB stores the resulting URL, never a device file URI.
- Analytics (streaks, volume, averages) are computed from `workout_sessions`/`workout_session_sets` at request time; there is no analytics table.
