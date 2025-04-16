import Link from "next/link";

export default function Home() {
  return (
    <main className="h-[100vh] flex items-center justify-center">
      <div className="flex flex-col gap-2">
        <h1>Links</h1>
        <ul>
          <Link href="/profile">
            <li>Profile</li>
          </Link>
          <Link href="/iconarray">
            <li>Icon Array Generator</li>
          </Link>
        </ul>
      </div>
    </main>
  );
}
