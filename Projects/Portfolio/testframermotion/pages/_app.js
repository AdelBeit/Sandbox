import "../styles/globals.css";
// import "../styles/tailwind.css";
import { motion, AnimatePresence } from "framer-motion";

// In pages/_app.js
function App({ Component, pageProps, router }) {
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        key={router.route}
        initial="pageInitial"
        animate="pageAnimate"
        exit="pageExit"
        variants={{
          pageInitial: {
            opacity: 0,
          },
          pageAnimate: {
            opacity: 1,
            transition: {
              duration: 1.25,
            },
          },
          pageExit: {
            backgroundColor: "white",
            // filter: `invert()`,
            opacity: 0,
            scaleX: 0,
          },
        }}
      >
        <Component {...pageProps} />;
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
