# MyWorkout AI — Project Instructions

## Product

MyWorkout is an AI-assisted workout planning and tracking app. It helps users discover workouts, create routines, track sets and progress, and receive useful workout recommendations.

The experience should feel modern, energetic, simple, and encouraging. Never shame users for their body, fitness level, or missed workouts. AI suggestions must be reviewable and must not be presented as medical advice.

## Source of truth

- Read this file and the relevant design before changing product UI.
- Onboarding reference: `designs/app-onboarding-flow-screen.png`.
- Main workout reference: `designs/app-workout-flow.png`.
- The designs define the flow, hierarchy, content, and visual direction, but implementations must remain responsive and reusable.
- Before writing Expo code, read the exact Expo SDK 57 documentation at `https://docs.expo.dev/versions/v57.0.0/`.
- Treat `package.json` and `package-lock.json` as authoritative. Do not upgrade dependencies casually.
- Preserve existing user changes and avoid unrelated rewrites.

## Repository boundary

This repository contains only the Expo mobile application. It is not a monorepo.

The Next.js admin/API server and its MongoDB/Prisma implementation belong in a separate project. Do not add Next.js, Prisma, MongoDB drivers, database schemas, migrations, admin pages, or server secrets to this Expo repository.

The Expo app communicates with the backend only through authenticated HTTP APIs. It must never connect directly to MongoDB or contain database credentials, Better Auth server secrets, AI provider secrets, or admin credentials.

## Mobile stack

- Expo SDK 57, React Native, TypeScript, and Expo Router;
- NativeWind v4 with Tailwind CSS v3;
- Zustand for local workflow state;
- TanStack Query for remote API data and mutations;
- React Hook Form with Zod for validated forms;
- Better Auth with `@better-auth/expo` for the mobile auth client;
- `expo-secure-store` for native auth session storage.

Use one library for each responsibility. Do not duplicate TanStack Query server data inside Zustand.

## Product flow

### Entry and onboarding

1. Native splash screen with the MyWorkout logo.
2. Welcome screen.
3. Sign in with email/password or Google.
4. Sign up with name/email/password or Google.
5. Select gender.
6. Select goal: Build Muscle, Lose Fat, or Maintain.
7. Select experience: Beginner, Intermediate, or Advanced.
8. Review onboarding summary.
9. Show the optional Pro offer with a working Continue Free action.
10. Enter the main app.

The native splash and welcome screen are separate. Configure the splash with `expo-splash-screen`; do not create a timed splash route or add an artificial delay.

Keep onboarding in one Expo Router route with internal steps. Use a small persisted Zustand store for the current step and answers so unfinished onboarding can resume. Do not create one route per question.

### Main tabs

The authenticated application has five tabs:

- **Home:** training stats, weekly progress, saved workouts, recent workout, templates, and Start Workout.
- **Discover:** search, templates, muscle filters, exercises, and exercise details.
- **Workouts:** saved and custom workouts, workout details, and workout creation.
- **History:** completed sessions, calendar, duration, volume, and history details.
- **Profile:** account, units, notifications, appearance, help, legal, Pro status, and sign out.

### Workout flow

1. Open a template, exercise, or saved workout.
2. Review the workout and exercise order.
3. Create or customize a workout when needed.
4. Add exercises and configure sets, reps, weight, rest time, and notes.
5. Start the workout.
6. Record completed sets, actual reps, and weight.
7. Show elapsed time and rest timers.
8. Confirm before cancelling or discarding an active workout.
9. Finish and show duration, exercises, sets, volume, and muscles trained.
10. Save the session to History and allow repeating it.

Active workout state must survive navigation and temporary app backgrounding. Use timestamps for elapsed and rest time instead of assuming JavaScript intervals continue in the background.

## State and data rules

- **Zustand:** onboarding draft, active workout draft, short-lived UI workflows, and explicit persisted preferences.
- **TanStack Query:** profile, exercises, templates, saved workouts, history, subscription status, and all other server-owned data.
- **React Hook Form:** authentication, profile editing, workout metadata, and exercise configuration forms.
- **Zod:** form values, API requests/responses, route parameters, and AI structured results.
- **Component state:** temporary state owned by one component.

Persist only what is required for recovery. Never store passwords or auth cookies in AsyncStorage. Use SecureStore through the Better Auth Expo client.

All API data is untrusted until validated. Show loading, refreshing, empty, offline, error, and success states for remote screens. Use stable request IDs for workout mutations so retries do not create duplicate sessions.

## Routes and files

Use Expo Router route groups for public, auth, onboarding, and authenticated areas. Keep route files thin; reusable screens, components, stores, hooks, schemas, and API logic must live outside `src/app`.

```text
src/
  app/
    _layout.tsx
    (public)/
    (auth)/
    (onboarding)/
    (app)/
      (tabs)/
  components/
    ui/
    workout/
  screens/
  hooks/
  stores/
  lib/
    api/
    auth/
    validation/
  theme/
  types/
```

This is a guide, not permission to create empty folders. Use the `@/*` alias for imports from `src`. Use TypeScript strict mode, avoid `any`, and validate unknown data.

## Design system

Use semantic theme tokens instead of hard-coded colors in feature code. The design palette is:

- primary: `#2563EB`;
- primary-light: `#3B82F6`;
- text: `#0F172A`;
- secondary text: `#64748B`;
- border: `#E2E8F0`;
- success: `#22C55E`;
- danger: `#EF4444`;
- background: `#FFFFFF`;
- card: `#F8FAFC`.

Use NativeWind for layout, spacing, typography, responsive states, and theme-aware styling. Inline styles are acceptable only for runtime-derived values such as animation, chart, timer, or progress-ring calculations.

The repository uses NativeWind v4 and Tailwind CSS v3. Do not mix in NativeWind v5 preview, Tailwind v4, or `react-native-css` instructions without an explicitly approved migration.

Build reusable primitives for buttons, inputs, cards, option selectors, progress rings, workout cards, exercise rows, set rows, timers, and loading/error/empty states. Screens should compose these primitives instead of recreating their visual styles.

Use accessible labels, roles, logical focus order, dynamic type, non-color status indicators, reduced-motion behavior, and minimum 44×44 point touch targets.

## UI verification

For every design-driven screen:

1. Implement the correct hierarchy, safe areas, spacing, typography, imagery, and shared components.
2. Run the screen at the reference size and compare the rendered result side by side with the design.
3. Correct measurable differences, then verify small and large screens, keyboard behavior, loading/error states, accessibility, Android, and iOS.

Do not claim visual accuracy from code inspection alone.

## Auth, AI, and security boundaries

The backend owns Better Auth configuration, authorization, MongoDB, Prisma, admin roles, AI provider calls, billing verification, and all secrets.

The Expo app owns the public API URL, application scheme, Better Auth client, secure session storage, UI, and local recoverable workflow state.

AI recommendations must come from a trusted backend, match a validated Zod schema, explain the recommendation, and require confirmation before changing a workout. Never let AI silently overwrite user-entered workout data or provide injury diagnoses.

Client redirects and hidden UI are not security controls. The backend must authorize every protected read and write.

## Before handing off work

1. Format and lint affected files.
2. Run TypeScript checks and relevant tests.
3. Exercise the changed flow in an Expo development build.
4. Compare UI changes with the design reference.
5. Verify loading, empty, offline, and error behavior.
6. Check accessibility and platform differences.
7. Do not add secrets or unrelated backend code.

“Works in Expo Go” alone is not release verification. Test native behavior in development builds and release-sensitive behavior on physical Android and iOS devices.
