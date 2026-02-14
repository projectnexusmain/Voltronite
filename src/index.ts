import { Hono } from "hono";
import { Logger } from "./utils/logger";
import { sendError } from "./utils/senderror";
import { loadRoutes } from "./utils/loadroutes";
import { cors } from "hono/cors"; // <-- import CORS middleware

const app = new Hono();
global.users ??= [];
global.accessTokens ??= [];

// Enable CORS for all routes (you can restrict origins if needed)
app.use("*", cors({
  origin: "*", // allow all origins; for production, replace with your app domain
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"]
}));

loadRoutes(app);

app.get("/", (c) => c.text("Voltronite, Made by Razer!"));
app.get("/unknown", (c) => c.json({}));
app.notFound((c) => {
  const url = c.req.url;
  return sendError(
    c,
    "errors.voltronite.common.route_not_found",
    `No route found for ${url}.`,
    [url],
    404,
    "invalid_route",
    404
  );
});

const port = Number(process.env.PORT);

Bun.serve({
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0",
});

Logger.backend(`Voltronite successfully started on port ${port}`);

// load external stuff
import "./ws/matchmaker";
