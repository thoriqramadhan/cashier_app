'use client'
import { useSidebar } from "@/components/context/sidebarContext";

export default function Home() {
  const { state, setter } = useSidebar()
  return (
    <>
      <button onClick={() => setter("setStatus", !state)}>OpenClose</button>
      <p>Hello, World!</p>
    </>
  );
}
