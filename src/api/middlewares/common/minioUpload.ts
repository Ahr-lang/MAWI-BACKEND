import multer from "multer";
import AWS from "aws-sdk";
import type { Request, Response, NextFunction } from "express";

const storage = multer.memoryStorage();
const uploadSingleImage = multer({ storage }).single("image");

const s3 = new AWS.S3({
  endpoint: process.env.MINIO_ENDPOINT,
  accessKeyId: process.env.MINIO_ACCESS_KEY,
  secretAccessKey: process.env.MINIO_SECRET_KEY,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

async function uploadToMinio(req: Request, res: Response, next: NextFunction) {
  console.log("[MinIO] Checking for file upload...");
  console.log("[MinIO] req.file:", req.file ? "present" : "not present");
  console.log("[MinIO] req.file details:", req.file);
  console.log("[MinIO] req.body keys:", Object.keys(req.body || {}));
  console.log("[MinIO] Content-Type:", req.headers['content-type']);

  if (!req.file) {
    console.log("[MinIO] No file found, setting imageUrl to null");
    (req as any).imageUrl = null;
    return next();
  }

  const file = req.file;
  const fileName = `${Date.now()}_${file.originalname}`;
  const bucketName = process.env.MINIO_BUCKET_NAME as string;

  console.log("[MinIO] MinIO config - Endpoint:", process.env.MINIO_ENDPOINT, "Bucket:", bucketName);

  // Check if bucket exists
  try {
    await s3.headBucket({ Bucket: bucketName }).promise();
    console.log("[MinIO] Bucket exists and is accessible");
  } catch (bucketError: any) {
    console.error("[MinIO] Bucket check failed:", bucketError?.message);
    (req as any).imageUrl = null;
    return next();
  }

  console.log("[MinIO] Uploading file:", fileName, "to bucket:", bucketName);
  console.log("[MinIO] File size:", file.size, "mimetype:", file.mimetype);

  const params: AWS.S3.PutObjectRequest = {
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  try {
    const result = await s3.upload(params).promise();
    const imageUrl = `${process.env.MINIO_ENDPOINT}/${bucketName}/${fileName}`;
    console.log("[MinIO] Upload successful, URL:", imageUrl);
    (req as any).imageUrl = imageUrl;
    return next();
  } catch (error: any) {
    console.error("[MinIO] Upload failed:", error?.message, error?.stack);
    (req as any).imageUrl = null;
    return next();
  }
}

export { uploadSingleImage, uploadToMinio };
