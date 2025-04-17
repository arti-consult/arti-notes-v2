import { validateEnv } from "@/lib/env";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const env = validateEnv();

// Logger for debugging
const logger = {
  info: (message: string, data?: any) => console.log("AWS S3:", message, data),
  error: (message: string, error?: any) =>
    console.error("AWS S3 Error:", message, error),
  debug: (message: string, data?: any) =>
    console.debug("AWS S3 Debug:", message, data),
};

// Initialize S3 Client with logging
logger.debug("Initializing S3 Client", {
  region: process.env.AWS_REGION,
  bucket: process.env.AWS_BUCKET_NAME,
  hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Initialize FFmpeg
let ffmpeg: FFmpeg | null = null;

async function initFFmpeg() {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();

    try {
      logger.debug("Loading FFmpeg");

      await ffmpeg.load({
        log: true,
        progress: ({ ratio }) => {
          logger.debug("FFmpeg loading progress:", {
            ratio: Math.round(ratio * 100),
          });
        },
      });

      logger.info("FFmpeg loaded successfully");
    } catch (error) {
      logger.error("Failed to load FFmpeg:", error);
      throw new Error(`Failed to initialize FFmpeg: ${error.message}`);
    }
  }
  return ffmpeg;
}

async function convertWebmToMp3(file: File | Blob): Promise<Blob> {
  try {
    logger.info("Starting WebM to MP3 conversion");
    const ff = await initFFmpeg();

    // Convert File/Blob to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Write input file to FFmpeg's virtual filesystem
    logger.debug("Writing input file to FFmpeg");
    await ff.writeFile("input.webm", new Uint8Array(arrayBuffer));

    // Convert to MP3 with progress logging
    logger.debug("Starting conversion");
    await ff.exec([
      "-i",
      "input.webm",
      "-c:a",
      "libmp3lame",
      "-q:a",
      "2",
      "output.mp3",
    ]);

    // Read the converted file
    logger.debug("Reading converted file");
    const data = await ff.readFile("output.mp3");
    const mp3Blob = new Blob([data], { type: "audio/mp3" });

    logger.info("Conversion completed successfully", {
      originalSize: file.size,
      convertedSize: mp3Blob.size,
    });

    return mp3Blob;
  } catch (error) {
    logger.error("Error converting WebM to MP3:", error);
    throw new Error("Failed to convert audio format");
  }
}

/**
 * Upload a file to AWS S3
 */
export async function uploadToS3(
  file: File | Blob,
  filePath: string
): Promise<string> {
  try {
    logger.info("Starting S3 upload process:", {
      filePath,
      fileSize: file.size,
      fileType: file.type,
      bucket: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_REGION,
    });

    // Convert WebM to MP3 if necessary
    let uploadFile = file;
    let uploadPath = filePath;

    if (file.type === "audio/webm") {
      logger.info("WebM format detected, converting to MP3");
      uploadFile = await convertWebmToMp3(file);
      uploadPath = filePath.replace(".webm", ".mp3");
      logger.info("Conversion completed, proceeding with upload");
    }

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uploadPath,
      Body: uploadFile,
      ContentType: uploadFile.type,
      ACL: "public-read",
      CacheControl: "max-age=3600",
    });

    logger.debug("S3 command created", {
      bucket: command.input.Bucket,
      key: command.input.Key,
      contentType: command.input.ContentType,
      acl: command.input.ACL,
    });

    logger.info("Sending S3 command...");
    await s3Client.send(command);
    logger.info("S3 upload completed successfully");

    // Return the path of the uploaded file
    return uploadPath;
  } catch (error) {
    logger.error("Error uploading to S3:", {
      error,
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
      credentials: {
        hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
        hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        bucket: process.env.AWS_BUCKET_NAME,
      },
    });
    throw new Error(`Failed to upload to S3: ${error.message}`);
  }
}

/**
 * Get a public URL for an S3 object
 */
export function getPublicS3Url(filePath: string): string {
  const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`;
  logger.debug("Generated S3 public URL:", { url });
  return url;
}

/**
 * Delete a file from S3
 */
export async function deleteFromS3(filePath: string): Promise<void> {
  try {
    logger.info("Deleting file from S3:", { filePath });

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filePath,
    });

    await s3Client.send(command);
    logger.info("S3 file deleted successfully:", { filePath });
  } catch (error) {
    logger.error("Error deleting from S3:", {
      error,
      filePath,
      errorMessage: error.message,
      errorStack: error.stack,
    });
    throw new Error(`Failed to delete from S3: ${error.message}`);
  }
}

/**
 * Check if a file exists in S3
 */
export async function checkS3FileExists(filePath: string): Promise<boolean> {
  try {
    logger.debug("Checking if file exists in S3:", { filePath });

    const command = new HeadObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filePath,
    });

    await s3Client.send(command);
    logger.debug("File exists in S3:", { filePath });
    return true;
  } catch (error) {
    if (error.name === "NotFound") {
      logger.debug("File does not exist in S3:", { filePath });
      return false;
    }
    logger.error("Error checking file existence in S3:", {
      error,
      filePath,
      errorMessage: error.message,
    });
    throw error;
  }
}

/**
 * Verify S3 configuration
 */
export async function verifyS3Configuration(): Promise<boolean> {
  try {
    logger.info("Verifying S3 configuration...");

    // Check if all required environment variables are set
    const requiredVars = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_BUCKET_NAME,
    };

    const missingVars = Object.entries(requiredVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}`
      );
    }

    // Try to list the bucket (will fail if credentials are invalid)
    const command = new HeadObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: "test-configuration",
    });

    try {
      await s3Client.send(command);
    } catch (error) {
      if (error.name !== "NotFound") {
        throw error;
      }
    }

    logger.info("S3 configuration verified successfully");
    return true;
  } catch (error) {
    logger.error("S3 configuration verification failed:", {
      error,
      errorMessage: error.message,
      errorStack: error.stack,
    });
    return false;
  }
}
