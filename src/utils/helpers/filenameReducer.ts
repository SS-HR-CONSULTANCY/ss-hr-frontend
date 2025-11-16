export function getCleanFileName(fileUrl: string): string {
  const rawName = decodeURIComponent(fileUrl.split("/").pop() || "");

  const match = rawName.match(/startTrim_(.*?)_endTrim_.*$/);
  if (match) {
    return match[1];
  }

  return rawName.replace(/^user_/, "");
}
