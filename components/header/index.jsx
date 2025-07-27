import styles from "./style.module.css";
import Link from "next/link";
import useLogout from "../../hooks/useLogout";

export default function Header(props) {
  const logout = useLogout();
  return (
    <header className={styles.header}>
      {props.isLoggedIn ? (
        <>
          <p>
          <Link href="/">
            <img src="/budgetbudlogo.png" alt="Logo" className={styles.logo} />
          </Link>
          <Link href="/" className={styles.siteName}>Budget Bud</Link>
          </p>
          <div className={styles.container}>
            <p className={styles.welcomeMessage}>Welcome, {props.username}!</p>
            <p onClick={logout} className={styles.navLink} style={{ cursor: "pointer" }}>
              Logout
            </p>
          </div>
        </>
      ) : (
        <>
          <p>
          <Link href="/">
            <img src="/budgetbudlogo.png" alt="Logo" className={styles.logo} />
          </Link>
          <Link href="/" className={styles.siteName}>Budget Bud</Link>
          </p>
          <p>
            <Link href="/login" className={styles.navLink}>Login</Link>
          </p>
        </>
      )}
    </header>
  );
}

