import dotenv from "dotenv";
dotenv.config();

const envConfig = {
	cloudinaryAPISecret: process.env["CLOUDINARY_API_SECRET"],
};

export default envConfig;
