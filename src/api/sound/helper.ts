interface FolderAndFileName {
  folder: string;
  fileName: string;
}

export const getFolderAndFileNameFromPath = (
  path: string
): FolderAndFileName => {
  const regex = /\/sounds\/([^\/]+)\/([^\/]+)$/;
  const match = regex.exec(path);

  // Check if a match is found
  if (match && match.length > 2) {
    const folder = match[1];
    const fileName = match[2];
    return { folder, fileName };
  }

  return  {folder:'',fileName:''}
};
