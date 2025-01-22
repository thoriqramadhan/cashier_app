import { query } from "@/lib/dbpool";
import Image from "next/image";
import seedPostgres from "@/helper/seed";

export default async function Home() {
  const test = await query('SELECT * FROM user');
  return (
    <>
      <form action={seedPostgres}>
        <button type="submit">Seed db</button>
      </form>
      <p>Hello, World!</p>
    </>
  );
}
