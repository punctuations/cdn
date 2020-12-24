import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
	return (
		<div className={styles.container}>
			<Head>
				<title>cdn - dont-ping.me</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>Welcome.</h1>

				<div className={styles.grid}>
					<a href="https://dont-ping.me/" className={styles.card}>
						<h3>Website &rarr;</h3>
						<p>Find your way back to the main website.</p>
					</a>

					<a href="https://github.com/punctuations/" className={styles.card}>
						<h3>GitHub &rarr;</h3>
						<p>Check out more of my projects over at my GitHub.</p>
					</a>
				</div>
			</main>

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
