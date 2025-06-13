// pages/dashboard.jsx
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import useLogout from "../hooks/useLogout";
import styles from "../styles/Home.module.css";

const BudgetClient = dynamic(() => import("../components/BudgetClient"), {
  ssr: false,
});

export default function Dashboard(props) {
  const router = useRouter();
  const logout = useLogout();

  return (
    <div className={styles.container}>
      <Head>
        <title>{props.user.username}&apos;s Dashboard</title>
        <meta name="description" content="User budget dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props.user.username} />

      <main className={styles.main}>
        <h1 className={styles.title}>
          {props.user.username}&apos;s Budget Dashboard
        </h1>

        <p className={styles.description}>
          Current Route: <code className={styles.code}>{router.asPath}</code>
          <br />
          Status: <code className={styles.code}>
            {props.isLoggedIn ? "Logged In" : "Not Logged In"}
          </code>
        </p>

        {/* Budget management component */}
        {props.isLoggedIn && (
          <BudgetClient username={props.user.username} />
        )}

        {/* Navigation / Logout */}
        <div className={styles.grid}>
          <Link href="/" className={styles.card}>
            <h2>Home &rarr;</h2>
            <p>Return to the homepage.</p>
          </Link>

          <div onClick={logout} style={{ cursor: "pointer" }} className={styles.card}>
            <h2>Logout &rarr;</h2>
            <p>Click here to sign out.</p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    return {
      props: {
        user: user || { username: null },
        isLoggedIn: !!user,
      },
    };
  },
  sessionOptions
);
