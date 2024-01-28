import { useRef } from "react";

export function useSocket() {
  const socketRef = useRef();

  if ( !socketRef.current ) {
    socketRef.current = io();

    socketRef.current.on('number assignment', (number) => {
      const root = document.documentElement;
      console.log((299 + 83*(number-1))%360);
      root.style.setProperty('--pressed-key-hue', (299 + 83*(number-1))%360);
    })
  }
  return socketRef.current;
}