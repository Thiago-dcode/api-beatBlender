import { describe, test, expect } from "vitest";
import {
  getFreeSoundFolderContent,
  getManyFreeSoundFolderContent,
} from "../getFreeResources.js";
import { StorageError } from "../../../errors/general/general.js";

const expectObj = expect.objectContaining({
  Key: expect.any(String),
  LastModified: expect.any(Date),
  ETag: expect.any(String),
  Size: expect.any(Number),
  StorageClass: expect.any(String),
});
describe("storage service: getFreeSoundFolderContent", async () => {
  test("should throw error if no folder provided", async () => {
    let result;
    try {
      result = await getFreeSoundFolderContent("");
    } catch (error) {
      expect(error).toBeInstanceOf(StorageError);
    }
    expect(Array.isArray(result)).toBe(false);
  });

  test("should throw error if no folder doenst exist", async () => {
    let result;
    try {
      result = await getFreeSoundFolderContent("fiusdhgisrhgiureghrweig");
    } catch (error) {
      expect(error).toBeInstanceOf(StorageError);
    }
    expect(Array.isArray(result) && result.length > 0).toBe(false);
  });
  test("should return an array of _Object", async () => {
    let result;
    try {
      result = await getFreeSoundFolderContent("piano");
    } catch (error) {}
    expect(Array.isArray(result)).toBe(true);
    const sampleObject = result[0]; // Take a sample object from the result
    expect(sampleObject).toEqual(expectObj);
  });
});

describe("storage service: getManyFreeSoundFolderContent", async () => {
  test("should throw error if an empty array is provided", async () => {
    let result;
    try {
      result = await getManyFreeSoundFolderContent([]);
    } catch (error) {
      expect(error).toBeInstanceOf(StorageError);
    }
    expect(Array.isArray(result)).toBe(false);
  });
  test("Should return and object: {key: _Object[]}", async () => {
    let result;
    const folders = ["hip-hop", "piano"];
    try {
      result = await getManyFreeSoundFolderContent(folders);
    } catch (error) {}

    folders.forEach((folder) => {
      expect(Array.isArray(result[folder]) && result[folder].length > 0).toBe(
        true
      );
      const example = result[folder][0];
      expect(example).toEqual(expectObj);
    });
  });
});
