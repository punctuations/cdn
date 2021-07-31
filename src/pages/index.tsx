import Head from "next/head";
import React from "react";
import styles from "../styles/Home.module.css";
import { FileDrop } from "react-file-drop";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";

import * as crypto from "crypto";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const [drag, setDrag] = React.useState<boolean>(false);
  const [uploadError, setUploadError] = React.useState<boolean>(false);

  function fileUpload(file: Blob) {
    const reader = new FileReader();

    file.type !== "image/svg+xml"
      ? reader.readAsDataURL(file)
      : reader.readAsText(file);
    reader.onloadend = () => {
      const loading = toast.loading("Uploading...");
      fetch(
        process.env.NODE_ENV === "development"
          ? "http://0.0.0.0:3000/api/upload" // REPLACE WITH YOUR URL
          : "https://cdn.dont-ping.me/api/upload",
        {
          method: "POST",
          body: JSON.stringify({
            data: reader.result,
            uuid: crypto.randomBytes(32).toString("hex"),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((r) => r.json())
        .then((body) => {
          toast(
            <span>
              Image uploaded!
              <button
                className="ml-4 px-2 py-1 rounded border-black border"
                onClick={() => router.push(`/api/i/${body.uuid}`)}
              >
                View
              </button>
            </span>,
            {
              icon: "✅",
              id: loading,
              duration: 6000,
            }
          );
        })
        .catch((err) => {
          console.log(err);
          toast("Could not upload", {
            icon: "❌",
            id: loading,
          });
        });
    };
  }

  function handleDrop(files: FileList | null) {
    setDrag(false);
    if (files)
      for (let i = 0; i < files.length; i++) {
        let file_type = files[i].type;

        let file_size = files[i].size;

        if (
          (file_type === "image/png" ||
            file_type === "image/jpeg" ||
            file_type === "image/svg+xml") &&
          file_size <= 25000000
        ) {
          fileUpload(files[i]);
        } else {
          console.log(files[i].type);
          setUploadError(true);
          setTimeout(() => {
            setUploadError(false);
          }, 5000);
        }
      }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>cdn - dont-ping.me</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
          className={`transition-shadow duration-500 m-20 p-32 rounded-md border-4 ${
            drag ? "border-solid" : "border-dashed"
          } hover:border-solid ${
            uploadError ? "border-red-300" : "border-gray-200"
          } hover:shadow-2xl cursor-pointer`}
          onDragOver={() => setDrag(true)}
          onDragLeave={() => setDrag(false)}
          onDrop={(files) => handleDrop(files)}
          frame={process.browser ? document : undefined}
        >
          <span className="text-gray-600 select-none">
            Drag &amp; Drop files.
          </span>
        </FileDrop>
      </motion.section>

      <Toaster position="top-center" reverseOrder={true} />

      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.footer}
      >
        <a
          href="https://vercel.com?utm_source=cdont-ping.me&utm_medium=default-template&utm_campaign=dont-ping.me"
          target="_blank"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </motion.footer>
    </div>
  );
}
