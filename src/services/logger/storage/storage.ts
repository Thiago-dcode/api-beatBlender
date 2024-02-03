import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { StorageError } from "../../../errors/general/general.js";
import ResizeService from "../../resize/resize.js";
import { Fit } from "../../../types/index.js";
import { fit } from "sharp";
type Obj = {
  key: string;
  body: Buffer;
  contentType: string;
};
class StorageService {
  private readonly s3: S3Client;
  private readonly bucketName: string;
  private readonly bucketRegion: string;
  private obj: Obj | undefined;
  constructor(
    s3: S3Client,
    bucketName: string,
    bucketRegion: string,
    private readonly resizeService: ResizeService
  ) {
    this.s3 = s3;

    this.bucketName = bucketName;
    this.bucketRegion = bucketRegion;
  }
  async resize(obj: Obj, height: number, width: number, fit: Fit='contain') {
    try {
      let buffer = (
        await this.resizeService.resizeByBuffer(obj.body,height,width,fit)
      ).getBuffer();
      if (!buffer) {
        console.log("ERROR RESIZING IMAGE: " + obj.key);
        buffer = obj.body;
      }
      obj.body = buffer;
      this.obj = obj;
    } catch (error) {
    } finally {
      this.obj = obj;
      return this;
    }
  }
  async store(obj: Obj | undefined = undefined) {
    if (obj) this.obj = obj;

    if (!this.obj)
      throw new StorageError(
        "Obj cannot be undefined in StorageService.store",
        {},
        500
      );
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: this.obj.key,
      Body: this.obj.body,
      ContentType: this.obj.contentType,
    });

    const result = await this.s3.send(command);
    return result;
  }
}

export default StorageService;
