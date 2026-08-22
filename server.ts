import path from "path";
import { createServer as createViteServer } from "vite";
import app from "./api/app.js";

const PORT = 3000;

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(app.get("express_static") || (await import("express")).default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HR Savage CV Reviewer server running on port ${PORT}`);
  });
}

// Only invoke app.listen if executed directly (e.g. node server.ts / dev), not in Vercel Serverless Function
if (process.env.VERCEL !== "1" && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  startServer();
}

export default app;
