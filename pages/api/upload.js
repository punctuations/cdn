import formidable from "formidable";
import { cdn } from "../index";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async (req, res) => {
	const form = new formidable.IncomingForm();

	form.uploadDir = "./public/uploads/";
	form.keepExtensions = true;
	form.parse(req, (err, fields, files) => {
		files.file ? console.log(files.file.path.slice(15)) : "";
		let visibility = false;

		cdn.emit("toggle", visibility);
		files.file ? (visibility = true) : (visibility = false);
		files.file
			? cdn.emit(
					"url",
					`${
						files.file.path
							? `https://localhost:3000/uploads/${files.file.path.slice(15)}`
							: "404"
					}`
			  )
			: "";
	});
	res.status(200).json({
		status: "200",
	});
};
