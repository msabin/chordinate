import { Key } from "../Key/Key"
import styles from "./index.module.css";

export function KeyBoard(){

  return (
    <div id={styles.keyboard}>
      <Key></Key>
      <Key></Key>
    </div>
  )
}