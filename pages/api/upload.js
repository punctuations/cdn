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
		files.file ? cdn.emit("toggle") : "";
		files.file
			? cdn.emit(
					"url",
					`${
						files.path
							? `https://cdn.dont-ping.me/${files.file.path.slice(15)}`
							: "404"
					}`
			  )
			: "";
	});
	res.status(200).json({
		status: "200",
	});
};
