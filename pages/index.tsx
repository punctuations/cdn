import Head from "next/head";
import React from "react";
import styles from "../styles/Home.module.css";
import { FileDrop } from "react-file-drop";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";

import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import { DEFAULT_AVATARS_BUCKET, emojis } from "../lib/constants";
import { useClipboard } from "use-clipboard-copy";
import { GitHub } from "react-feather";

export default function Home() {
  const router = useRouter();

  const clipboard = useClipboard();

  const [drag, setDrag] = React.useState<boolean>(false);
  const [uploadError, setUploadError] = React.useState<boolean>(false);

  async function fileUpload(file: Blob, name: string) {
    try {
      const loading = toast.loading("Uploading...");

      let i,
        result = [],
        decode: string[] = [];
      for (i = 0; i < 5; i++) {
        result.push(
          Object.keys(emojis)[(Object.keys(emojis).length * Math.random()) << 0]
        );
      }

      result.forEach((k) => decode.push(emojis[k]));

      // cannot store file as emojis
      const filePath = `${[...decode]}.${name.split(".").pop()}`;
      const redirect = `${result.join("")}.${name.split(".").pop()}`;

      let { error: uploadError } = await supabase.storage
        .from(DEFAULT_AVATARS_BUCKET)
        .upload(filePath, file);

      if (uploadError) {
        console.log(uploadError);
        toast("Could not upload", {
          icon: "❌",
          id: loading,
        });
      } else {
        toast(
          <span>
            Image uploaded!
            <button
              className="mx-4 px-2 py-1 rounded duration-300 border-gray-300 hover:border-black text-gray-500 hover:text-black border"
              onClick={() => router.push(`/api/${redirect}`)}
            >
              View
            </button>
            <button
              className="px-2 py-1 rounded duration-300 border-blue-500 bg-blue-500 hover:bg-white text-white hover:text-blue-700 border"
              onClick={() =>
                clipboard.copy(`https://cdn.dont-ping.me/api/${redirect}`)
              }
            >
              {clipboard.copied ? "Copied!" : "Copy"}
            </button>
          </span>,
          {
            icon: "✅",
            id: loading,
            duration: 10000,
          }
        );
      }
    } catch (e) {
      throw e;
    }
  }

  function handleDrop(files: FileList | null) {
    setDrag(false);
    if (files)
      for (let i = 0; i < files.length; i++) {
        let file_type = files[i].type;

        let file_size = files[i].size;

        if (file_size <= 10000000) {
          // const form = new FormData();
          // form.append("test", files[i]);
          //
          // fetch("/api/upload", {
          //   method: "POST",
          //   body: form,
          // });
          fileUpload(files[i], files[i].name);
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

      <a
        href="https://github.com/punctuations/cdn"
        className="absolute top-3 left-3 transition duration-300 hover:opacity-60"
      >
        <GitHub />
      </a>

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
