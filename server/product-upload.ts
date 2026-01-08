import { storagePut } from "./storage";
import { nanoid } from "nanoid";

export async function uploadProductImage(
  productId: number,
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<{ url: string; key: string } | null> {
  try {
    // Generate a unique file name with product ID
    const fileExtension = fileName.split('.').pop() || 'jpg';
    const uniqueFileName = `product-${productId}-${nanoid()}.${fileExtension}`;
    const fileKey = `products/${uniqueFileName}`;

    const result = await storagePut(fileKey, fileBuffer, mimeType);
    return result;
  } catch (error) {
    console.error('[Product Upload] Failed to upload image:', error);
    return null;
  }
}

export async function validateImageFile(
  file: Buffer,
  mimeType: string
): Promise<boolean> {
  // Check file size (max 5MB)
  if (file.length > 5 * 1024 * 1024) {
    return false;
  }

  // Check MIME type
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedMimes.includes(mimeType)) {
    return false;
  }

  return true;
}
