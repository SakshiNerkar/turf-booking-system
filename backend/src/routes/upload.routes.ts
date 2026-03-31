import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAuth } from "../middleware/auth.middleware";
import { sendOk, sendError } from "../utils/response";

const router = Router();

// Ensure upload directory exists
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `turf-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|avif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

router.post("/", requireAuth, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, "No file uploaded", 400);
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    return sendOk(res, { url: fileUrl });
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

export { router as uploadRouter };
