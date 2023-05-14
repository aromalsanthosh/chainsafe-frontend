import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { TransactionProvider } from "../context/TransactionContext";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider defaultTheme="light" enableSystem={false}>
      <TransactionProvider>
        <Component {...pageProps} />
      </TransactionProvider>
    </ThemeProvider>
  );
}

export default MyApp;
