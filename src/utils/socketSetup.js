import { useRef } from "react";

export function useSocket() {
  const socketRef = useRef();

  if ( !socketRef.current ) {
    socketRef.current = io();

    socketRef.current.on('hue assignment', (hue) => {
      const root = document.documentElement;

      socketRef.current.hue = hue;
    })
  }
  return socketRef.current;
}