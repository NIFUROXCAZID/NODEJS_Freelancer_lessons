
import styles from "./footer.module.scss";
import GoTop from "./GoTop";

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footer__container}>
          <p className={styles.footer__copyright}>© Copyright {new Date().getFullYear()} CRM All rights reserved.</p>
        </div>
      </footer>
      <GoTop styles={styles} />
    </>
  )
}
