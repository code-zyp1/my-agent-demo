'use client';
import { useState } from 'react';

export default function Playground() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-10 flex flex-col items-center gap-4">
      <h1 className="text-2xl">点击测试</h1>
      <p>当前数字: {count}</p>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => setCount(count + 1)}
      >
        +1
      </button>
    </div>
  );
}