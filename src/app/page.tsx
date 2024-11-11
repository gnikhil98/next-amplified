'use client';
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    async function triggerEvent() {
      try {
        const response = await fetch('/api/putStarEvent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        console.log('API Response:', result);
      } catch (error) {
        console.error('Error triggering event:', error);
      }
    }

    triggerEvent();
  }, []);

  return (
    <>
      <h1>Hello</h1>
      <h2>Welcome</h2>
    </>
  );
}
