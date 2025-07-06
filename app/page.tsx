"use client";

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import Image from "next/image";
import { NotFoundError, ServerError, ForbiddenError, ERROR_CODES } from '@/libs/errors';
import { myFetchClient } from '@/libs/my-fetch';

interface Post {
  id: number;
  title: string;
  body: string;
}

const API_URL = "/api/search";

// Mutation function to trigger a 500 server error
async function triggerServerError(url: string) {
  await myFetchClient(`${url}?q=fail`);
}

// Mutation function to trigger a 403 forbidden error
async function triggerForbiddenError(url: string) {
  await myFetchClient(`${url}?q=forbidden`);
}

export default function Home() {
  const { data: posts, error, isLoading } = useSWR<Post[]>(API_URL);

  const { trigger: triggerServer, isMutating: isMutatingServer, error: serverError } = useSWRMutation('/api/search', triggerServerError);
  const { trigger: triggerForbidden, isMutating: isMutatingForbidden, error: forbiddenError } = useSWRMutation('/api/search', triggerForbiddenError);

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center">Loading with SWR...</p>;
    }

    if (error) {
      // Handle our custom, typed errors with error codes
      switch (error.code) {
        case ERROR_CODES.NOT_FOUND_ERROR:
          return <p className="text-center text-orange-500">No posts found (404).</p>;
        case ERROR_CODES.INTERNAL_SERVER_ERROR:
          return <p className="text-center text-red-500">Server error, please try again later (500).</p>;
        default:
          return <p className="text-center text-red-500">An unexpected error occurred: {error.message}</p>;
      }
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
        <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-bold text-center mb-4">Test Server Error (500)</h2>
            <p className="text-center">This button will trigger a mutation that results in a 500 error.</p>
            <button 
              onClick={() => triggerServer()} 
              disabled={isMutatingServer}
              className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
            >
              {isMutatingServer ? 'Loading...' : 'Trigger 500 Error'}
            </button>
            {serverError && <p style={{ color: 'red' }} className="text-center mt-2">Error: {serverError.message}</p>}
          </div>
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-bold text-center mb-4">Test Forbidden Error (403)</h2>
            <p className="text-center">This button will trigger a mutation that results in a 403 error.</p>
            <button 
              onClick={() => triggerForbidden()} 
              disabled={isMutatingForbidden}
              className="mt-4 w-full px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50"
            >
              {isMutatingForbidden ? 'Loading...' : 'Trigger 403 Error'}
            </button>
            {forbiddenError && <p style={{ color: 'red' }} className="text-center mt-2">Error: {forbiddenError.message}</p>}
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center mt-8">
        {/* Footer links... */}
      </footer>
    </div>
  );
}