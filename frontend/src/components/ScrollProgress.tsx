'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / height) * 100;
      setScroll(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      id="scroll-progress" 
      style={{ width: `${scroll}%` }} 
      className="fixed top-0 left-0 h-[3px] bg-primary z-[100] transition-all duration-100 ease-out"
    />
  );
}
