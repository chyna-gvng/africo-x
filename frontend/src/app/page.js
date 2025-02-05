import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to My Next.js App with TailwindCSS</h1>
        <p className="text-gray-700 mb-6">This is a clean slate to build your application.</p>
        <div className="flex justify-center space-x-4">
          <Link href="/register" legacyBehavior>
            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Register</a>
          </Link>
          <Link href="/login" legacyBehavior>
            <a className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Login</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
