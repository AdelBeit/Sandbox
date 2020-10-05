import { motion } from "framer-motion";
import Head from "next/head";
import Layout from "../components/layout";
import utilStyles from "../styles/utils.module.css";

export default function Animated() {
  return (
    <>
      {/* <div className={`${utilStyles.animate} bg-blue-200`} style={{}}> */}
      <div style={{ backgroundColor: "red", height: "150px", width: "150px" }}>
        <motion.div
          style={{ backgroundColor: "white" }}
          animate={{
            scale: [3],
          }}
          transition={{
            duration: 1,
          }}
        />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
