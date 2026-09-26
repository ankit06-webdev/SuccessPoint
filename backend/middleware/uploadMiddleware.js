import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import cloudinaryConfig from '../config/cloudinary.js';

dotenv.config({ path: './config/.env' });

cloudinaryConfig();


// console.log('Cloudinary Configured:', process.env.CLOUDINARY_CLOUD_NAME);
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'SuccessPoint', 
        resource_type: 'auto',          
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'txt']
    }
});

export const upload = multer({ storage });