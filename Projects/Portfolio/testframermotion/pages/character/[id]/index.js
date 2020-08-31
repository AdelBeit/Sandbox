import Head from "next/head";
import styles from "../../../styles/Home.module.css";
import Link from "next/link";

const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;

export async function getServerSideProps({ query }) {
  const { id } = query;
  const res = await fetch(`${defaultEndpoint}${id}`);
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

export default function Character({ data }) {
  const { name } = data;
  return (
    <div className={styles.container}>
      <Head>
        <title>{name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{name}</h1>

        <p className={styles.back}>
          <Link href="/">
            <a>Back to All Characters</a>
          </Link>
        </p>
      </main>
    </div>
  );
}
