import type { Express, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { siteRotation } from "../drizzle/schema";
import { sdk } from "./_core/sdk";

function currentRotation() {
  const now = new Date();
  const quarter = Math.floor(now.getUTCMonth() / 3) + 1;
  return { quarterKey: `${now.getUTCFullYear()}-Q${quarter}`, catalogVersion: `${now.getUTCFullYear()}-Q${quarter}` };
}

export function registerAvatarRotationRoute(app: Express) {
  app.post("/api/scheduled/avatar-rotation", async (req: Request, res: Response) => {
    try {
      const user = await sdk.authenticateRequest(req);
      if (!user.isCron || !user.taskUid) {
        res.status(403).json({ error: "cron-only" });
        return;
      }
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const rotation = currentRotation();
      await db.insert(siteRotation).values({ id: 1, ...rotation, scheduleCronTaskUid: user.taskUid }).onDuplicateKeyUpdate({
        set: { ...rotation, scheduleCronTaskUid: user.taskUid, updatedAt: new Date() },
      });
      res.json({ ok: true, ...rotation });
    } catch (error) {
      console.error("[AvatarRotation] Callback failed:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown rotation error", timestamp: new Date().toISOString() });
    }
  });
}

export async function getStoredRotation() {
  const db = await getDb();
  if (!db) return currentRotation();
  const rows = await db.select().from(siteRotation).where(eq(siteRotation.id, 1)).limit(1);
  return rows[0] ?? currentRotation();
}
