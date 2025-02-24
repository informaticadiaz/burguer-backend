// src/services/imageService.ts
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import crypto from 'crypto';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

interface ImageUploadResult {
  filename: string;
  path: string;
  thumbPath: string;
  mimeType: string;
  size: number;
}

interface ImageDimensions {
  width: number;
  height: number;
}

class ImageServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageServiceError';
  }
}

export const imageService = {
  // Configuración base
  config: {
    uploadsDir: path.join(process.cwd(), 'uploads'),
    thumbnailsDir: path.join(process.cwd(), 'uploads', 'thumbnails'),
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    thumbnailSize: { width: 200, height: 200 },
    quality: 80
  },

  // Inicializar directorios necesarios
  async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.config.uploadsDir, { recursive: true });
      await fs.mkdir(this.config.thumbnailsDir, { recursive: true });
      logger.info('Image service directories initialized');
    } catch (error) {
      logger.error('Error initializing image service directories:', error);
      throw new ImageServiceError('Failed to initialize image directories');
    }
  },

  // Validar archivo de imagen
  validateImage(file: Express.Multer.File): void {
    if (!file) {
      throw new ImageServiceError('No file provided');
    }

    if (!this.config.allowedMimeTypes.includes(file.mimetype)) {
      throw new ImageServiceError('Invalid file type');
    }

    if (file.size > this.config.maxFileSize) {
      throw new ImageServiceError('File size exceeds limit');
    }
  },

  // Generar nombre de archivo único
  generateUniqueFilename(originalname: string): string {
    const timestamp = Date.now();
    const hash = crypto.createHash('md5')
      .update(`${originalname}${timestamp}`)
      .digest('hex')
      .slice(0, 8);
    const ext = path.extname(originalname);
    return `${hash}-${timestamp}${ext}`;
  },

  // Procesar y guardar imagen
  async saveImage(file: Express.Multer.File): Promise<ImageUploadResult> {
    try {
      this.validateImage(file);

      const filename = this.generateUniqueFilename(file.originalname);
      const filePath = path.join(this.config.uploadsDir, filename);
      const thumbFilename = `thumb-${filename}`;
      const thumbPath = path.join(this.config.thumbnailsDir, thumbFilename);

      // Procesar imagen original
      await sharp(file.buffer)
        .webp({ quality: this.config.quality })
        .toFile(filePath);

      // Generar thumbnail
      await sharp(file.buffer)
        .resize(this.config.thumbnailSize.width, this.config.thumbnailSize.height, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: this.config.quality })
        .toFile(thumbPath);

      const stats = await fs.stat(filePath);

      return {
        filename,
        path: filePath,
        thumbPath,
        mimeType: 'image/webp',
        size: stats.size
      };
    } catch (error) {
      logger.error('Error saving image:', error);
      throw new ImageServiceError('Failed to save image');
    }
  },

  // Obtener dimensiones de la imagen
  async getImageDimensions(filePath: string): Promise<ImageDimensions> {
    try {
      const metadata = await sharp(filePath).metadata();
      return {
        width: metadata.width || 0,
        height: metadata.height || 0
      };
    } catch (error) {
      logger.error('Error getting image dimensions:', error);
      throw new ImageServiceError('Failed to get image dimensions');
    }
  },

  // Eliminar imagen y su thumbnail
  async deleteImage(filename: string): Promise<void> {
    try {
      const filePath = path.join(this.config.uploadsDir, filename);
      const thumbPath = path.join(this.config.thumbnailsDir, `thumb-${filename}`);

      await Promise.all([
        fs.unlink(filePath).catch(() => {}),
        fs.unlink(thumbPath).catch(() => {})
      ]);

      logger.info(`Deleted image: ${filename}`);
    } catch (error) {
      logger.error('Error deleting image:', error);
      throw new ImageServiceError('Failed to delete image');
    }
  },

  // Optimizar imagen existente
  async optimizeImage(filePath: string, options?: {
    quality?: number;
    width?: number;
    height?: number;
  }): Promise<string> {
    try {
      const { name, ext } = path.parse(filePath);
      const optimizedPath = path.join(
        path.dirname(filePath),
        `${name}-optimized${ext}`
      );

      let processor = sharp(filePath)
        .webp({
          quality: options?.quality || this.config.quality
        });

      if (options?.width || options?.height) {
        processor = processor.resize(options.width, options.height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      await processor.toFile(optimizedPath);
      return optimizedPath;
    } catch (error) {
      logger.error('Error optimizing image:', error);
      throw new ImageServiceError('Failed to optimize image');
    }
  },

  // Rotar imagen
  async rotateImage(filePath: string, degrees: number): Promise<string> {
    try {
      const { name, ext } = path.parse(filePath);
      const rotatedPath = path.join(
        path.dirname(filePath),
        `${name}-rotated${ext}`
      );

      await sharp(filePath)
        .rotate(degrees)
        .webp({ quality: this.config.quality })
        .toFile(rotatedPath);

      return rotatedPath;
    } catch (error) {
      logger.error('Error rotating image:', error);
      throw new ImageServiceError('Failed to rotate image');
    }
  },

  // Recortar imagen
  async cropImage(
    filePath: string,
    crop: { left: number; top: number; width: number; height: number }
  ): Promise<string> {
    try {
      const { name, ext } = path.parse(filePath);
      const croppedPath = path.join(
        path.dirname(filePath),
        `${name}-cropped${ext}`
      );

      await sharp(filePath)
        .extract(crop)
        .webp({ quality: this.config.quality })
        .toFile(croppedPath);

      return croppedPath;
    } catch (error) {
      logger.error('Error cropping image:', error);
      throw new ImageServiceError('Failed to crop image');
    }
  }
};

export default imageService;