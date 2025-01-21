import { query } from "@/lib/dbpool";
import Image from "next/image";

export default async function Home() {
  const test = await query('SELECT * FROM user');
  console.log(test);

  return (
    <p>Hello, Nigga</p>
  );
}
