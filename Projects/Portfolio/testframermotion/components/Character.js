import Head from "next/head";
import styles from "../styles/Home.module.css";
import { motion, useCycle } from "framer-motion";

export default function Character({ data }) {
  const { name } = data;

  return (
    <div className={styles.loading + " " + styles.container}>
      <Head>
        <title>{name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.loadingStatic}></div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {
            width: "100%",
          },
          visible: {
            transition: { delay: 0.2, duration: 1, ease: "easeIn" },
            width: "0%",
          },
        }}
        className={styles.loadingMask}
      />
      <h1 className={styles.title}>{name}</h1>
    </div>
  );
}
