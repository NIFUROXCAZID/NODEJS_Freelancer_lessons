import useGoTop from "@/shared/hooks/useGoTop";

export default function GoTop({ styles }) {
  const { shown, scrollToTop } = useGoTop();
  return (
    <div id="go-top-elem" className={`${styles.goTop} ${shown ? styles.shown : ""}`}>
      <button className={styles.goTop__button} aria-label="scroll up" onClick={() => scrollToTop()}>
        <div className={styles.goUpperFloorImg}>
          <div className={styles.arrowGoUpperFloor}>
            <div className={styles.arrowGoUpperFloor__stick}></div>
          </div>
        </div>
      </button>
    </div>
  )
}
