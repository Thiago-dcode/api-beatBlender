import sharp, { Sharp } from "sharp";
import { Fit } from "../../types/index.js";

export default class ResizeService {
  private buffer: Buffer | undefined;
  async resizeByBuffer(
    buffer: Buffer,
    height: number = 500,
    width: number = 500,
    fit: Fit
  ) {
    this.buffer = buffer;
    const bufferResized = await sharp(this.buffer)
      .resize({
        height,
        width,
        fit,
      })
      .toBuffer();
    this.buffer = bufferResized;
    return this;
  }
  getBuffer() {
    return this.buffer;
  }
}
