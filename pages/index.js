import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { FileDrop } from "react-file-drop";
import { AnimatePresence, motion } from "framer-motion";
import useSWR from "swr";
import axios, { post } from "axios";
const EventEmitter = require("events");
export const cdn = new EventEmitter();

export default function Home() {
	const [url, setURL] = useState(null);
	const [visibility, setVisible] = useState(false);

	cdn.on("toggle", () => {
		console.log("toggled");
		console.log(setVisible(!visibility));
	});
	cdn.on("url", (url) => {
		console.log(url);
		console.log("URL-ed");
		setURL(url);
	});

	const fetcher = (...args) => fetch(...args).then((r) => r.json());

	const { data } = useSWR("/api/upload", fetcher);

	function fileUpload(files) {
		const url = "/api/upload";
		const formData = new FormData();
		formData.append("file", files);
		const config = {
			headers: {
				"content-type": "multipart/form-data",
			},
		};
		return post(url, formData, config);
	}

	function handleDrop(files) {
		console.log(files);
		for (let i in files) {
			let file_type = files[i].type;

			let file_size = files[i].size;

			if (
				file_type === "image/png" ||
				file_type === "image/jpeg" ||
				file_type === "image/gif"
			) {
				if (file_size <= 25000000) {
					fileUpload(files[i]);
				} else {
					document.querySelector(".upload").classList =
						"upload duration-500 m-20 p-32 rounded-md border-4 border-dashed hover:border-solid border-red-300 hover:shadow-2xl cursor-pointer";
				}
			}
		}
	}

	function handleStatus(call) {
		if (call == "class") {
			if (!data) {
				return "bg-yellow-300 h-2 w-2 rounded-xl m-2 mt-3";
			} else if (data.status == 200) {
				return "bg-green-300 h-2 w-2 rounded-xl m-2 mt-3";
			} else if (error) {
				return "bg-red-300 h-2 w-2 rounded-xl m-2 mt-3";
			} else {
				return "bg-red-300 h-2 w-2 rounded-xl m-2 mt-3";
			}
		} else {
			if (!data) {
				return "loading";
			} else if (data.status == 200) {
				return "online";
			} else if (error) {
				return "offline";
			} else {
				return "offline";
			}
		}
	}

	return (
		<div className={styles.container}>
			<Head>
				<title>cdn - dont-ping.me</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<motion.section
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="absolute top-8 left-8 flex flex-row justify-center items-center"
			>
				<div className={handleStatus("class")} />
				<span className="text-gray-500 cursor-default select-none">
					{handleStatus("text")}
				</span>
			</motion.section>

			<motion.header
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.35 }}
				className="duration-300 m-2"
			>
				<h1 className={styles.title}>Welcome.</h1>
				<p className="text-gray-500 text-center">
					Drop your files below to get started.
				</p>
			</motion.header>

			<motion.section
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
			>
				<FileDrop
					className="upload duration-500 m-20 p-32 rounded-md border-4 border-dashed hover:border-solid border-gray-200 hover:shadow-2xl cursor-pointer"
					onDrop={(files) => handleDrop(files)}
				>
					<span className="text-gray-600 select-none">Drag & Drop files.</span>
				</FileDrop>
			</motion.section>

			<AnimatePresence initial={false}>
				{visibility ? (
					<motion.div
						className="absolute bottom-8 left-8 text-xs rounded-lg border-2 border-green-300 p-2"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
					>
						Here's your link: {url}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							className="mb-0.5 ml-2 h-3 w-3 inline-flex text-red-500 cursor-pointer"
							onClick={() => setVisible(false)}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</motion.div>
				) : (
					""
				)}
			</AnimatePresence>

			<motion.footer
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className={styles.footer}
			>
				<a
					href="https://vercel.com?utm_source=cdont-ping.me&utm_medium=default-template&utm_campaign=dont-ping.me"
					target="_blank"
					rel="noopener noreferrer"
				>
					Powered by{" "}
					<img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
				</a>
			</motion.footer>
		</div>
	);
}
