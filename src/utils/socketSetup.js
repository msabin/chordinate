import { useRef } from "react";

export function useSocket() {
  const socketRef = useRef();

  if ( !socketRef.current ) {
    socketRef.current = io();

    socketRef.current.on('hue assignment', (hue) => {
      const root = document.documentElement;
      root.style.setProperty('--pressed-key-hue', hue);
    })
  }
  return socketRef.current;
}