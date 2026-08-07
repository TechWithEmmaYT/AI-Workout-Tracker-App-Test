import { generateText, Output } from "ai";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db, exercises } from "@/db";
import { auth } from "@/lib/auth";

const idSchema = z.string().uuid();

const instructionsOutputSchema = z.object({
  instructions: z
    .array(z.string())
    .min(1)
    .describe(
      "Step-by-step instructions on how to perform the exercise safely and with proper form",
    ),
});

export async function GET(request: Request, { id }: Record<string, string>) {
  // 1. Authenticate request
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  // 2. Validate exercise UUID
  if (!idSchema.safeParse(id).success)
    return Response.json({ message: "Exercise not found" }, { status: 404 });

  // 3. Fetch exercise from DB
  const [exercise] = await db
    .select()
    .from(exercises)
    .where(eq(exercises.id, id))
    .limit(1);

  if (!exercise)
    return Response.json({ message: "Exercise not found" }, { status: 404 });

  // 4. Generate AI instructions if Vercel AI Gateway key is present
  //const apiKey = process.env.AI_GATEWAY_API_KEY;

  // if (apiKey) {
  try {
    //const gateway = createGateway({ apiKey });
    const { output } = await generateText({
      model: "google/gemini-2.5-flash",
      output: Output.object({
        schema: instructionsOutputSchema,
      }),
      system:
        "You are an expert AI fitness coach. Generate 4 to 5 concise, actionable step-by-step instructions for performing the given exercise with proper form.",
      prompt: `Exercise: ${exercise.name}\nCategory: ${exercise.category}\nTarget Muscles: ${exercise.muscles}\nDescription: ${exercise.description}`,
    });

    if (output?.instructions && output.instructions.length > 0) {
      return Response.json({ instructions: output.instructions });
    }
  } catch {
    // Fall through to fallback instructions on API failure
  }

  // 5. Fallback instructions
  const fallback = [
    `Set up with proper posture and prepare to target your ${exercise.muscles}.`,
    exercise.description,
    "Maintain controlled tempo throughout the movement and avoid using momentum.",
    "Exhale on exertion and return to starting position smoothly.",
  ];

  return Response.json({ instructions: fallback });
}
