import styles from "./index.module.css";

export function Key(props) {
  const { midiNote } = props;

  const isBlack = [1, 3, 6, 8, 10].includes(midiNote % 12);

  return (
    <div 
      id={midiNote}
      className = {`${styles.key} ${isBlack ? styles.black : null}`}
      ></div>
  )
}