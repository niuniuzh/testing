"use client";

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import Image from "next/image";
import { getRequest, postRequest, putRequest, deleteRequest } from '@/libs/api';

// --- Type Definitions ---
// Page-specific types can remain here.
interface Product {
  id: string;
  name: string;
  category: string;
}

export default function Home() {
  // --- SWR Hooks ---
  // The component now uses the clean, imported functions from the API layer.

  // 1. useSWR for GET requests, passing parameters as an object in the key array.
  const { data: products, error, isLoading } = useSWR<Product[]>(
    ['/api/search', { name: 'Laptop' }], // The key is now an array: [url, params]
    getRequest
  );

  // 2. useSWRMutation with the imported mutators
  const { trigger: createTrigger, isMutating: isCreating } = useSWRMutation<Product>('/api/search', postRequest);
  const { trigger: updateTrigger, isMutating: isUpdating } = useSWRMutation<Product>('/api/search', putRequest);
  const { trigger: deleteTrigger, isMutating: isDeleting } = useSWRMutation<{user:string}>('/api/search', deleteRequest);

  // --- Render Logic (Unchanged) ---

  const renderProductList = () => {
    if (isLoading) return <p className="text-center">Loading products...</p>;
    if (error) return <p className="text-center text-red-500">Error loading products: {error.message}</p>;
    if (!products) return <p className="text-center">No products found.</p>;

    return (
      <ul className="list-disc list-inside space-y-2">
        {products.map((product) => (
          <li key={product.id}>{product.name} ({product.category})</li>
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
        
        {/* GET Request Example */}
        <div className="w-full mt-8 border p-4 rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-4">useSWR (GET) Example</h1>
          {renderProductList()}
        </div>

        {/* Mutation Examples */}
        <div className="w-full mt-8 border p-4 rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-4">useSWRMutation Examples (Generic Mutator Pattern)</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* POST */}
            <button 
              onClick={() => createTrigger({ name: 'New Awesome Gadget' })} 
              disabled={isCreating}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Product (POST)'}
            </button>
            {/* PUT */}
            <button 
              onClick={() => updateTrigger({ id: 'p1', name: 'Updated Laptop Pro' })} 
              disabled={isUpdating}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Update Product (PUT)'}
            </button>
            {/* DELETE */}
            <button 
              onClick={() => {deleteTrigger({ id: 'p2' });
            await deleteTrigger<{user:string}>({ id: 'p2'}).then((res) => {
              if (res.code === 200) {
                console.log('Product deleted successfully');
              } else {
                console.error('Failed to delete product:', res.message);
              }
              await postRequest<Product>('/api/search', { name: 'New Product' }).then((res) => {
                if (res.code === 200) {
                  console.log('Product created successfully');
                  res.data.category = 'Electronics'; // Example of modifying the response data
                } else {
                  console.error('Failed to create product:', res.message);
                }
              });
            }} 
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Product (DELETE)'}
            </button>
          </div>
        </div>

      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center mt-8">
        {/* Footer links... */}
      </footer>
    </div>
  );
}