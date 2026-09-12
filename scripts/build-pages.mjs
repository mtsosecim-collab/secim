import { build } from "esbuild";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const output = "dist/pages";
const binding = {
  binding: "DB",
  database_name: "mtso-secimleri-db",
  database_id: "fedad054-7c97-4691-920d-94260c375354",
};

const serverConfigPath = "dist/server/wrangler.json";
const serverConfig = JSON.parse(await readFile(serverConfigPath, "utf8"));
serverConfig.d1_databases = [binding];
serverConfig.compatibility_flags = [...new Set(serverConfig.compatibility_flags ?? [])];
delete serverConfig.main;
delete serverConfig.rules;
delete serverConfig.assets;
delete serverConfig.dev;
await writeFile(serverConfigPath, JSON.stringify(serverConfig));

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp("dist/client", output, { recursive: true });

const entry = "dist/server/.pages-worker-entry.mjs";
await writeFile(entry, `import app from "./index.js";
export default {
  fetch(request, env, ctx) {
    const path = new URL(request.url).pathname;
    if (path.startsWith("/_next/") || path.startsWith("/posters/") || path === "/favicon.svg") {
      return env.ASSETS.fetch(request);
    }
    return app.fetch(request, env, ctx);
  },
};
`);

await build({
  entryPoints: [entry],
  outfile: join(output, "_worker.js"),
  bundle: true,
  format: "esm",
  platform: "neutral",
  target: "es2022",
  external: ["node:*", "cloudflare:*"],
});
