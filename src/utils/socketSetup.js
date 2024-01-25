import { useRef } from "react";


export function useSocket() {
  const socketRef = useRef();

  if ( !socketRef.current ) {
    socketRef.current = io();
  }
  return socketRef.current;
}