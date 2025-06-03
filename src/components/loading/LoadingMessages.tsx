
import { useState, useEffect } from 'react';

interface LoadingMessagesProps {
  messages: string[];
  interval?: number;
  className?: string;
}

export const LoadingMessages = ({ 
  messages, 
  interval = 3000, 
  className = '' 
}: LoadingMessagesProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [messages.length, interval]);

  if (messages.length === 0) return null;

  return (
    <div className={`text-center ${className}`}>
      <p className="text-gray-600 animate-fade-in">
        {messages[currentMessageIndex]}
      </p>
    </div>
  );
};
