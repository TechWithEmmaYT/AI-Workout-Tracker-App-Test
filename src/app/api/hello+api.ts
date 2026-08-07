export function GET() {
  return Response.json({
    message: "Hello message",
    apiUrl: process.env.BETTER_AUTH_URL,
    dbUrl: process.env.DATABASE_URL,
  });
}
