import { S3Client } from "@aws-sdk/client-s3";
import { validateEnv } from "./env";

const env = validateEnv();

// Initialize S3 client with retry configuration
export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  maxAttempts: 3,
  retryMode: "adaptive",
});
