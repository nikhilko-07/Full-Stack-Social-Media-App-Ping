import multer from "multer";
import cloudinary from "cloudinary";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();
cloudinary.v2.config({
    cloud_name: "",
    api_key: "",
    api_secret: "",
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
