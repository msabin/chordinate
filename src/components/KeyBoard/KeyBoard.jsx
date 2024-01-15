import { Key } from "../Key/Key"
import styles from "./index.module.css";

export function KeyBoard(){

  return (
    <div id={styles.keyboard}>
      {[...Array(88).keys()].map(i => 
        <Key 
          midiNote={i+21}
          key={i+21}
        ></Key>)}
    </div>
  )
}