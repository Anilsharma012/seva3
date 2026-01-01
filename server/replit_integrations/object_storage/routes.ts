import type { Express, Request } from "express";
import express from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { pipeline } from "stream/promises";

import { authMiddleware, adminOnly, type AuthRequest } from "../../middleware/auth";

/**
 * Local upload implementation (NO S3 / NO Replit object storage)
 *
 * Flow:
 * 1) POST /api/uploads/request-url  -> returns { uploadURL, fileURL }
 * 2) PUT  uploadURL                -> saves file to /uploads
 * 3) Use fileURL in DB (img src)
 *
 * Nginx should serve:
 *   location ^~ /uploads/ { alias /www/wwwroot/<site>/uploads/; }
 */
function getBaseUrl(req: Request) {
  const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol || "https";
  const host =
    (req.headers["x-forwarded-host"] as string) ||
    (req.headers["host"] as string) ||
    "localhost";
  return `${proto}://${host}`;
}

function getUploadDir() {
  // project root uploads folder
  return process.env.UPLOAD_DIR || path.resolve(process.cwd(), "uploads");
}

function safeExtFromName(name: string) {
  const ext = path.extname(name || "").slice(0, 10).toLowerCase(); // ".jpg"
  // allow common image types only (aap chaho to extend kar dena)
  const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);
  return allowed.has(ext) ? ext : "";
}

export function registerObjectStorageRoutes(app: Express) {
  const uploadDir = getUploadDir();
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  // Serve uploads also from node (optional). Nginx alias recommended.
  app.use("/uploads", express.static(uploadDir, { maxAge: "7d" }));
  // Backward compatibility: if any old URL uses /objects, serve same folder
  app.use("/objects", express.static(uploadDir, { maxAge: "7d" }));

  // Request upload URL (admin only)
  app.post(
    "/api/uploads/request-url",
    authMiddleware,
    adminOnly,
    async (req: AuthRequest, res) => {
      try {
        const { name, contentType } = req.body ?? {};
        if (!name || typeof name !== "string") {
          return res.status(400).json({ error: "Missing file name" });
        }

        // Generate safe unique file name
        const ext = safeExtFromName(name);
        const key = `${Date.now()}-${crypto.randomUUID()}${ext}`;

        const base = getBaseUrl(req);
        const uploadURL = `${base}/api/uploads/put/${encodeURIComponent(key)}`;
        const fileURL = `${base}/uploads/${encodeURIComponent(key)}`;

        return res.json({ uploadURL, fileURL, contentType });
      } catch (err) {
        console.error("Error generating upload URL:", err);
        return res.status(500).json({ error: "Failed to generate upload URL" });
      }
    },
  );

  // Upload endpoint (PUT raw file) (admin only)
  app.put(
    "/api/uploads/put/:fileName",
    authMiddleware,
    adminOnly,
    async (req: AuthRequest, res) => {
      try {
        const fileName = path.basename(decodeURIComponent(req.params.fileName || ""));
        if (!fileName) return res.status(400).json({ error: "Invalid fileName" });

        const destPath = path.join(uploadDir, fileName);

        // Stream request body directly to disk
        await pipeline(req, fs.createWriteStream(destPath));

        // Send an ETag header (helps Uppy AwsS3 plugin not complain)
        res.setHeader("ETag", `"${fileName}"`);
        res.setHeader("Access-Control-Expose-Headers", "ETag");

        const base = getBaseUrl(req);
        const fileURL = `${base}/uploads/${encodeURIComponent(fileName)}`;

        return res.status(200).json({ ok: true, fileURL });
      } catch (err) {
        console.error("Upload PUT failed:", err);
        return res.status(500).json({ error: "Upload failed" });
      }
    },
  );
}
