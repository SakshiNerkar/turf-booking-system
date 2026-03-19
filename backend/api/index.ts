import { createApp } from "../src/app";
import { pool } from "../src/config/db";

const app = createApp();

// Vercel serverless functions don't "listen" themselves, 
// they export the Express instance but they also don't automatically
// handle long-running things correctly in the background outside of the request lifecycle.
// However, for basic Express APIs it's fine.

export default app;
