import { rest } from "msw";

export const handlers = [
  // Handles a GET /user request
  rest.get("/user", (req, res, ctx) => {
    // Check if the user is authenticated in this session
    const { authToken } = req.cookies;

    if (authToken === "keku") {
      return res(
        ctx.json({
          username: "Mock Mockinson",
        })
      );
    }
    return res(ctx.status(401), ctx.json({ message: "Unauthorized!" }));
  }),
  rest.post("/login", async (req, res, ctx) => {
    const { email, password } = await req.json();

    if (email && password) {
      return res(ctx.cookie("authToken", "keku"));
    }
  }),
  rest.post("/logout", async (req, res, ctx) => {
    return res(ctx.cookie("authToken", ""));
  }),
];
