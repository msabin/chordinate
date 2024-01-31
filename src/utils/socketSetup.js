import { useRef } from "react";

export function useSocket() {
  const socketRef = useRef();

  if ( !socketRef.current ) {
    socketRef.current = io();

    // Default hue if backend isn't there
    socketRef.current.hue = 299;

    socketRef.current.on('hue assignment', (hue) => {
      socketRef.current.hue = hue;
    })
  }
  return socketRef.current;
}