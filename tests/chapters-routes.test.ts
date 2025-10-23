import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

import next from "next";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

describe("chapters routes", () => {
  let app: ReturnType<typeof next>;
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    vi.setTimeout(30000);

    const projectDir = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

    app = next({ dev: true, dir: projectDir });
    await app.prepare();

    server = createServer((req, res) => {
      const handle = app.getRequestHandler();
      handle(req, res);
    });

    await new Promise<void>((resolve) => {
      server.listen(0, () => resolve());
    });

    const address = server.address();

    if (!address) {
      throw new Error("Test server failed to start");
    }

    if (typeof address === "string") {
      baseUrl = address.startsWith("http") ? address : `http://${address}`;
    } else {
      const info = address as AddressInfo;
      const hostname =
        info.family === "IPv6"
          ? `[${info.address}]`
          : info.address && info.address !== "::"
            ? info.address
            : "127.0.0.1";
      baseUrl = `http://${hostname}:${info.port}`;
    }
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    if (typeof app.close === "function") {
      await app.close();
    }
  });

  it("responds with the chapters index", async () => {
    const response = await fetch(`${baseUrl}/chapters`);

    expect(response.status).toBe(200);

    const html = await response.text();

    expect(html).toContain("Chapter 18");
  });

  it("responds with a chapter page", async () => {
    const response = await fetch(`${baseUrl}/chapters/1`);

    expect(response.status).toBe(200);

    const html = await response.text();

    expect(html).toContain("Chapter 01");
  });

  it("responds with a chapter page using the legacy singular route", async () => {
    const response = await fetch(`${baseUrl}/chapter/1`);

    expect(response.status).toBe(200);

    const html = await response.text();

    expect(html).toMatch(/Arjuna(?:&#39;|&apos;|'|’|&rsquo;)s Dilemma/);
    expect(html).toContain("BG1.1");
  });
});
