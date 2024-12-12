import { v2 as cloudinary } from "cloudinary";
import envConfig from "./config.js";

// this is purely for uploading images
cloudinary.config({
	cloud_name: "dqalarvbv",
	api_key: "442586845957369",
	api_secret: envConfig.cloudinaryAPISecret,
});

/*
 * Uploads an image to cloudinary and returns a url
 */
const uploadImage = async (image) => {
	const uploadResult = await cloudinary.uploader
		.upload(image, { crop: "auto", gravity: "auto", width: 500, height: 500 })
		.catch((error) => {
			console.log(error);
			throw error;
		});

	console.log(uploadResult);
	return uploadResult.url;
};

export default uploadImage;
