import styles from "./index.module.css";

export function Key(props) {
  const { midiNote } = props;

  const scaleNum = midiNote % 12;

  const isBlack = [1, 3, 6, 8, 10].includes(scaleNum);

  let isLeft, isRight;
  if ( isBlack ) {
    if ( scaleNum === 1 || scaleNum === 6 ) {
      isLeft = true;
    }
    else if ( scaleNum === 3 || scaleNum === 10) {
      isRight = true;
    }
  }

  return (
    <div 
      id={midiNote}
      className = {`
        ${styles.key} 
        ${isBlack ? styles.black : null}
        ${isLeft ? styles.left : null}
        ${isRight ? styles.right : null}
        `}
      ></div>
  )
}