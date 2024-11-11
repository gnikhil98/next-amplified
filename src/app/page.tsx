'use client';
import { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import config from '../amplifyconfiguration.json';

Amplify.configure(config);

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

    // Trigger the EventBridge event on every page load
    triggerEvent();
  }, []);

  return (
    <>
      <h1>Hello</h1>
      <h2>Welcome</h2>
    </>
  );
}
