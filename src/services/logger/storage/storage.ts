import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

class StorageService {
  private readonly s3: S3Client;
  private readonly bucketName: string;
  private readonly bucketRegion: string;

  constructor(s3: S3Client, bucketName: string, bucketRegion: string) {
    this.s3 = s3;
    this.bucketName = bucketName;
    this.bucketRegion = bucketRegion;
  }

  async store(obj: {
    key: string;
    body: Buffer;
    contentType: string;
  }): Promise<void> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: obj.key,
        Body: obj.body,
        ContentType: obj.contentType,
      });

      await this.s3.send(command);
    } catch (error) {
      console.error(
        "Error storing object in S3:",
        error instanceof Error ? error.message : ""
      );
      throw new Error("Failed to store object in S3");
    }
  }
}

export default StorageService;
