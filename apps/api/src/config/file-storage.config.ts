import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Request } from 'express';

export const fileStorageConfig = {
    storage: diskStorage({
        destination: (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
            // Create uploads directory if it doesn't exist
            const uploadPath = './uploads/events';
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath, { recursive: true });
            }
            callback(null, uploadPath);
        },
        filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
            // Generate unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = extname(file.originalname);
            const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
            callback(null, filename);
        },
    }),
    fileFilter: (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
        // Only allow image files
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
            callback(null, true);
        } else {
            callback(new Error('Only image files are allowed'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
};
