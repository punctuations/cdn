import formidable from "formidable";

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
		console.log(err, fields, files);
	});
	form.on("file", (filename) => {
		console.log(filename);
		form.emit("data", { key: filename });
	});
	res.status(200).json({
		status: "200",
	});
};
