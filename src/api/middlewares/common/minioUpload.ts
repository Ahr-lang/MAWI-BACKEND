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
  if (!req.file) {
    (req as any).imageUrl = null;
    return next();
  }

  const file = req.file;
  const fileName = `${Date.now()}_${file.originalname}`;
  const bucketName = process.env.MINIO_BUCKET_NAME as string;

  const params: AWS.S3.PutObjectRequest = {
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  try {
    await s3.upload(params).promise();
    (req as any).imageUrl = `${process.env.MINIO_ENDPOINT}/${bucketName}/${fileName}`;
    return next();
  } catch (error: any) {
    console.error("Error al subir la imagen:", error?.message, error?.stack);
    (req as any).imageUrl = null;
    return next();
  }
}

export { uploadSingleImage, uploadToMinio };
