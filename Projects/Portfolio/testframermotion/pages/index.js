import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Character from "../components/Character";

const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint);
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

export default function Home({ data }) {
  const { info, results: defaultResults = [] } = data;
  const [character, updateCharacter] = useState({
    id: -1,
    name: "Select a Character",
  });
  const [results, updateResults] = useState(defaultResults);
  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint,
  });
  const { current } = page;
  useEffect(() => {
    if (current === defaultEndpoint) return;
    async function request() {
      const res = await fetch(current);
      const nextData = await res.json();
      updatePage({
        current,
        ...nextData.info,
      });

      if (!nextData.info?.prev) {
        updateResults(nextData.results);
        return;
      }
      updateResults((prev) => {
        return [...prev, ...nextData.results];
      });
    }

    request();
  }, [current]);

  // useEffect(() => {
  //   if (current.character.id === -1) return;
  //   async function request() {
  //     const res = await fetch(`${defaultEndpoint}${current.character.id}`);
  //     const newCharacter = await res.json();
  //     updateCharacter({
  //       ...current.character.id,
  //       ...newCharacter.name,
  //     });
  //     // return;
  //   }

  //   request();
  // }, [current.character]);

  function handleLoadMore() {
    updatePage((prev) => {
      return {
        ...prev,
        current: page?.next,
      };
    });
  }

  /**
   * fetch the character that was clicked
   * @param {int} id
   */
  function handleCharacterClick(id) {
    async function request() {
      const res = await fetch(`${defaultEndpoint}${id}`);
      const newCharacter = await res.json();
      updateCharacter({
        name: newCharacter.name,
        id: id,
      });
    }
    request();
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Rick and Morty</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { scale: 0.95, opacity: 0 },
            visible: { scale: 1, opacity: 1, transition: { delay: 2 } },
          }}
        >
          <h1 className={styles.title}>Wubba Lubba Dub Dub!</h1>
        </motion.div>

        <p className={styles.description}>Rick and Morty Character Wiki</p>

        <Character data={character} key={Math.random() * character.id} />

        <div>
          <motion.ul
            className={styles.grid}
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {results.map((result) => {
              const { id, name } = result;
              return (
                <motion.li
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                  whileHover={{
                    position: "relative",
                    zIndex: 1,
                    background: "white",
                    scale: 1.2,
                    transition: {
                      duration: 0.3,
                    },
                  }}
                  key={id}
                  className={styles.card}
                >
                  {/* <Link href="/character/[id]" as={`/character/${id}`}> */}
                  {/* <button onClick={() => handleCharacterClick(id)}> */}
                  <a onClick={() => handleCharacterClick(id)}>
                    <h3>{name}</h3>
                  </a>
                  {/* </button> */}
                  {/* </Link> */}
                </motion.li>
              );
            })}
          </motion.ul>
        </div>

        <p>
          <button onClick={handleLoadMore}>Load More</button>
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
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
