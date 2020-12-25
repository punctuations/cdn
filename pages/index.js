import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
	return (
		<div className={styles.container}>
			<Head>
				<title>cdn - dont-ping.me</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<section className="absolute top-8 left-8 flex flex-row justify-center items-center">
				<div className="h-2 w-2 rounded-xl bg-green-300 m-2 mt-3" />
				<span className="text-gray-500 cursor-default select-none">online</span>
			</section>

			<header className="duration-300 m-2">
				<h1 className={styles.title}>Welcome.</h1>
				<p className="text-gray-500 text-center">
					Drop your files below to get started.
				</p>
			</header>

			<section className="duration-500 m-20 p-32 rounded-md border-4 border-dashed hover:border-solid border-gray-200 hover:shadow-2xl cursor-pointer">
				<span className="text-gray-600">Drag & Drop files.</span>
			</section>

			<footer className={styles.footer}>
				<a
					href="https://vercel.com?utm_source=cdont-ping.me&utm_medium=default-template&utm_campaign=dont-ping.me"
					target="_blank"
					rel="noopener noreferrer"
				>
					Powered by{" "}
					<img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
				</a>
			</footer>
		</div>
	);
}
