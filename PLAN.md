# MyWorkout App Plan

## Project

MyWorkout lets users create workout routines, complete their sets, and review progress. Keep the first version small: email authentication, custom workouts, exercise catalogue, workout history, calendar and basic statistics.

## Screen Flow

```text
Splash
  └─ Welcome
      ├─ Sign In ──────────────────────────────┐
      └─ Gender → Goal → Experience → Sign Up ┤
                                               ↓
                                      Authenticated App
```

### Main tabs

```text
Home       Overview, calendar, stats, workouts and recent workout
Workouts   Search, open or create a workout
Create     Opens Create Workout as a full-screen modal
History    Calendar, completed workouts and history details
Profile    Account, kg/lb preference, theme, legal links and sign out
```

### Workout flow

```text
Create Workout
  └─ Add Exercises
      └─ Exercise Detail
  └─ Set sets, reps, target weight and rest
  └─ Save Workout

Workout Detail
  └─ Start Workout
      └─ Complete sets and optionally edit reps or weight
      └─ Finish Workout
          └─ History Detail
```

Create Workout, Exercise List, Exercise Detail and Active Workout stay in the modal stack so the tab bar does not interrupt the flow.

## Database Flow

```text
Better Auth user
  ├─ profile
  ├─ workouts
  │    └─ workout_exercises ───── exercises
  └─ workout_sessions
       └─ workout_session_sets ── exercises
```

### `profiles`

```text
userId       FK → user.id, cascade delete
gender
goal
experience
weightUnit   kg | lb, default kg
createdAt
updatedAt
```

The unit is selected from Profile settings. It does not need another onboarding step.

### `exercises`

```text
id             Generated UUID
slug           Unique readable name
name
image
muscles
description
equipment
difficulty
forceType
mechanics
category
createdAt
```

These fields support Exercise List and Exercise Detail. AI Coach generates instructions when requested, so instructions are not stored. The seed imports 20 public-domain exercises and uses their hosted images from `free-exercise-db`.

### `workouts`

```text
id
userId         FK → user.id, cascade delete
name
description?
image?
isTemplate      Default false
createdAt
updatedAt
```

### `workout_exercises`

```text
id
workoutId      FK → workouts.id, cascade delete
exerciseId     FK → exercises.id
sets           Planned sets, default 3
reps           Planned reps, default 10
targetWeight?  Planned weight, default empty
restSeconds    Default 90
position       Exercise order
```

The planned values prefill the Active Workout screen. Changing them during a session does not change the saved workout routine.

### `workout_sessions`

```text
id
userId         FK → user.id, cascade delete
workoutId      FK → workouts.id
startedAt
completedAt
durationSeconds
```

One completed workout creates one session. History is the list of these sessions; it does not need a separate `history` table.

### `workout_session_sets`

```text
id
sessionId      FK → workout_sessions.id, cascade delete
exerciseId     FK → exercises.id
setNumber
reps           Actual completed reps
weight?        Actual completed weight
```

Only completed sets are saved. Empty weight is allowed and is excluded from volume calculations.

## Save Flows

### Create workout

```text
App sends workout details and selected exercises
  → API creates workout
  → API inserts workout_exercises
  → One database transaction
```

### Finish workout

```text
Timer and set changes stay in local screen state
  → User presses Finish Workout
  → App sends duration and completed sets
  → API creates workout_session
  → API inserts workout_session_sets
  → One database transaction
```

Pause and rest-timer actions do not need database records.

## Screen Queries

```text
My Workouts     workouts joined with workout_exercises
Workout Detail  one workout joined with exercises
History         workout_sessions ordered by completedAt
History Detail  session joined with session sets and exercises
Calendar        sessions filtered by completedAt date
Recent Workout  latest completed session
Workouts stat   count workout_sessions
Time stat       sum durationSeconds
Average stat    average durationSeconds
Volume          sum weight × reps
Streak          consecutive dates containing completed sessions
```

The calendar component must expose its selected date to its parent screen. The parent uses that date when requesting sessions and statistics.

## Version One Boundaries

- Ready-made workouts use `isTemplate: true` and are populated with exercises through `workout_exercises`.
- Exercise bookmarks can stay local until saved exercises are implemented.
- Workout cover images must eventually be uploaded; the database stores the resulting URL, not the device file URI.
- Analytics are calculated from workout sessions instead of being stored in another table.

## Implementation Order

1. Complete the exercise and workout tables.
2. Generate and apply the Drizzle migration.
3. Seed the exercise catalogue.
4. Add create/list/detail workout APIs.
5. Connect Create Workout and My Workouts.
6. Add session tables and the Finish Workout API.
7. Connect History, calendar, Home stats and streak.
8. Add the Profile kg/lb setting.
