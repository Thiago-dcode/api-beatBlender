import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { StorageError } from "../../../errors/general/general.js";
import ResizeService from "../../resize/resize.js";
import { Fit } from "../../../types/index.js";
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
  async resizeImg(
    obj: Obj,
    height: number,
    width: number,
    fit: Fit = "contain"
  ) {
    try {
      let buffer = (
        await this.resizeService.resizeByBuffer(obj.body, height, width, fit)
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
  async resizeSound() {
    //TODO: handle resize sound
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
  async copy(from: string, to: string) {
    const command = new CopyObjectCommand({
      Bucket: this.bucketName,
      CopySource: `${this.bucketName}/${from}`,
      Key: to,
    });
    const result = await this.s3.send(command);
    return result;
  }
  async move(from: string, to: string) {
    await this.copy(from, to);
    const result = await this.delete(from);
    return result;
  }
  async get(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    const url = await getSignedUrl(this.s3, command, { expiresIn: 900 });
    return url;
  }
  async delete(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    const result = await this.s3.send(command);
    return result;
  }
}

export default StorageService;
