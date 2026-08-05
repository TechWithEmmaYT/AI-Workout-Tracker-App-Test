async function seed() {
  process.loadEnvFile();

  const { db } = await import("../index");
  const { exercises } = await import("../schema");
  const { exerciseSeed } = await import("./exercises");

  await db.insert(exercises).values(exerciseSeed).onConflictDoNothing();
  console.log(`Seeded ${exerciseSeed.length} exercises`);
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
