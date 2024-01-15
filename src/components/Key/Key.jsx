import styles from "./index.module.css";

export function Key(props) {
  const { midiNote } = props;

  const isBlack = [1, 3, 6, 8, 10].includes(midiNote % 12);

  return (
    <div 
      id={styles.key}
      className = {isBlack ? styles.black : null}
      data-midi={midiNote}
      ></div>
  )
}