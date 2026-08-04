import useGoTop from "@/shared/hooks/useGoTop";

interface GoTopProps {
  styles: Record<string, string>;
}

export default function GoTop({ styles }: GoTopProps) {
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
  );
}
