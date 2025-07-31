'use client'
import dynamic from 'next/dynamic';

const Board = dynamic(() => import('./components/Board'), { ssr: false });
export default function Home() {
  return (
    <Board />
  );
}
