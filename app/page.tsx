"use client";

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation'; // Added import
import Image from "next/image";
import { NotFoundError, ServerError, AuthenticationError } from '@/libs/errors';

// Define the data structure for a Post
interface Post {
  id: number;
  title: string;
  body: string;
}

// The API endpoint we want to fetch
const API_URL = "/api/search";

// A mutation function that always throws an error
async function failingMutation(url: string, { arg }: { arg: any }) {
  console.log(`Attempting mutation for ${url} with arg:`, arg);
  throw new Error('This is an intentional error from failingMutation!');
}

export default function Home() {
  // Use the SWR hook to fetch data. 
  // The fetcher is already configured in SWRProvider.
  const { data: posts, error, isLoading } = useSWR<Post[]>(API_URL);

  // Use useSWRMutation for the failing test
  const { trigger, isMutating, error: mutationError } = useSWRMutation('/api/failing-endpoint', failingMutation);

  const handleFailingMutation = async () => {
    try {
      await trigger({ someData: 'test' });
    } catch (e) {
      // This catch block will only be hit if the error is not handled by the global onError.
      // In this case, the global onError should handle it first.
      console.error('Error caught in component (should not happen if global onError works):', e);
    }
  };

  // --- Render Logic ---
  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center">Loading with SWR...</p>;
    }

    if (error) {
      // Handle our custom, typed errors
      if (error instanceof NotFoundError) {
        return <p className="text-center text-orange-500">No posts found (404).</p>;
      }
      if (error instanceof ServerError) {
        return <p className="text-center text-red-500">Server error, please try again later (500).</p>;
      }
      return <p className="text-center text-red-500">An unexpected error occurred: {error.message}</p>;
    }

    if (!posts || posts.length === 0) {
      return <p className="text-center">No posts available.</p>;
    }

    return (
      <ul className="list-disc list-inside space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-400 mt-2">{post.body}</p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-4xl">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div className="w-full mt-8">
          <h1 className="text-2xl font-bold text-center mb-4">SWR API Results</h1>
          {renderContent()}
        </div>
        {/* Added for testing useSWRMutation error interception */}
        <div className="w-full mt-8">
          <h2 className="text-xl font-bold text-center mb-4">Test SWR Mutation Error</h2>
          <p className="text-center">Click the button below to trigger a mutation that will intentionally fail.</p>
          <p className="text-center">Check your browser's console for the global SWR error log from `SWRProvider.tsx`.</p>
          <button 
            onClick={handleFailingMutation} 
            disabled={isMutating}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
          >
            {isMutating ? 'Mutating...' : 'Trigger Failing Mutation'}
          </button>
          {mutationError && <p style={{ color: 'red' }} className="text-center mt-2">Mutation Error (local): {mutationError.message}</p>}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center mt-8">
        {/* Footer links... */}
      </footer>
    </div>
  );
}