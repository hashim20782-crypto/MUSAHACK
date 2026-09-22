/** Camera photo compression: evidence-grade full image + small thumbnail. */

async function drawToBlob(
  source: ImageBitmap | HTMLImageElement,
  maxEdge: number,
  quality: number,
): Promise<Blob> {
  const w = "width" in source ? source.width : 0;
  const h = "height" in source ? source.height : 0;
  const scale = Math.min(1, maxEdge / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source as CanvasImageSource, 0, 0, canvas.width, canvas.height);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not process the photo"))),
      "image/jpeg",
      quality,
    );
  });
}

async function loadBitmap(file: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      /* fall through */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "sync";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Could not read the photo"));
      img.src = url;
    });
    return img;
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}

export interface ProcessedPhoto {
  full: Blob;
  thumb: Blob;
  previewUrl: string;
  bytes: number;
}

/** Compress a raw camera capture. Keeps 1600px long edge for evidence legibility. */
export async function processAuditPhoto(file: Blob): Promise<ProcessedPhoto> {
  const bitmap = await loadBitmap(file);
  const full = await drawToBlob(bitmap, 1600, 0.82);
  const thumb = await drawToBlob(bitmap, 420, 0.7);
  if ("close" in bitmap && typeof bitmap.close === "function") bitmap.close();
  return {
    full,
    thumb,
    previewUrl: URL.createObjectURL(full),
    bytes: full.size,
  };
}

export function auditPhotoPath(operatorId: string, transactionId: string): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${operatorId}/${transactionId}/audit-${stamp}.jpg`;
}
