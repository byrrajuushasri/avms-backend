
import 'dotenv/config';
import { S3Client } from '@aws-sdk/client-s3';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim();
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim();

if (!accessKeyId || !secretAccessKey) {
  throw new Error(
    'S3 configuration error: access key or secret key is missing',
  );
}

export const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION || 'auto',
  endpoint: process.env.AWS_ENDPOINT_URL,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});
