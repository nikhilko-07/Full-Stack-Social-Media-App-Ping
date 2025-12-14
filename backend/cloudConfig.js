import multer from "multer";
import cloudinary from "cloudinary";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})
const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params:{
        folder:"ping",
        allowed_formats:["png","jpg","jpeg","gif","webp", "mp4"],
    },
});

const upload = multer({ storage});
export {cloudinary, upload, storage};