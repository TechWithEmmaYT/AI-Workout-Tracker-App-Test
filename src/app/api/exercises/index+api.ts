import { asc, ilike, or } from "drizzle-orm";

import { db, exercises } from "@/db";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  const search = new URL(request.url).searchParams.get("search")?.trim();
  const data = await db
    .select({
      id: exercises.id,
      image: exercises.image,
      muscles: exercises.muscles,
      name: exercises.name,
    })
    .from(exercises)
    .where(
      search
        ? or(
            ilike(exercises.name, `%${search}%`),
            ilike(exercises.muscles, `%${search}%`),
          )
        : undefined,
    )
    .orderBy(asc(exercises.name));

  return Response.json(data);
}
