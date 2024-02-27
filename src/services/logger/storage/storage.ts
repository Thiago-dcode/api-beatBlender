import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  ListObjectsCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { StorageError } from "../../../errors/general/general.js";
import ResizeService from "../../resize/resize.js";
import { Fit } from "../../../types/index.js";
import config from "../../../config/config.js";
import { env } from "../../../utils/utils.js";
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
  constructor(private readonly resizeService: ResizeService) {
    this.bucketName = env.get("S3_BUCKET_NAME");
    this.bucketRegion = env.get("S3_BUCKET_REGION");
    (this.s3 = new S3Client(config.S3Config)), new ResizeService();
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
        console.error("ERROR RESIZING IMAGE: " + obj.key);
        buffer = obj.body;
      }
      obj.body = buffer;
    } catch (error) {
      console.error("ERROR RESIZING", error);
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
  async get(key: string){
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    const result = await this.s3.send(command)
    return result
  }
  async getUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    const url = await getSignedUrl(this.s3, command, { expiresIn: 900 });
    return url;
  }
  async getManyByFolder(folder: string) {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: folder,
    });
    const result = await this.s3.send(command);
    return result;
  }
  async move(from: string, to: string) {
    await this.copy(from, to);
    const result = await this.delete(from);
    return result;
  }
  async moveManyByFolder(
    from: string,
    to: string,
    getFilenameAndFolderName: (path: string) => {
      filename: string;
      foldername: string;
    }
  ) {
    const objectsToMove = await this.getManyByFolder(from);

    if (!objectsToMove.Contents || objectsToMove.Contents.length < 1) return;

    const result = await Promise.all(
      objectsToMove.Contents.map(async (object) => {
        if (object.Key) {
          const { filename } = getFilenameAndFolderName(object.Key);

          await this.move(object.Key, to + "/" + filename);
        }
      })
    );
  }
  async delete(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const result = await this.s3.send(command);
    return result;
  }
  async deleteManyByFolder(folder: string) {
    const objectsToDelete = await this.getManyByFolder(folder);

    if (!objectsToDelete.Contents || objectsToDelete.Contents.length < 1)
      return;
    objectsToDelete.Contents.forEach(async (object) => {
      if (object.Key) {
        await this.delete(object.Key);
      }
    });
  }
}

export default StorageService;
