// async function seed() {
//   process.loadEnvFile();

//   const { db } = await import("../index");
//   const { exercises } = await import("../schema");

//   await db.insert(exercises).values(exerciseSeed).onConflictDoNothing();
//   console.log(`Seeded ${exerciseSeed.length} exercises`);
// }

// seed().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
