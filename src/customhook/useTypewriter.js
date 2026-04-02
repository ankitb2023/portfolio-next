import { useState, useEffect } from 'react';

/**
 * Custom hook to simulate a typewriter effect.
 * @param {string[]} words - Array of strings to type out.
 * @param {number} typingSpeed - Speed of typing in ms.
 * @param {number} deletingSpeed - Speed of deleting in ms.
 * @param {number} pauseDelay - Time to wait before deleting starts in ms.
 * @returns {string} The current string being typed/deleted.
 */
export const useTypewriter = (words, typingSpeed = 80, deletingSpeed = 40, pauseDelay = 2000) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentWord = words[wordIndex];

    if (isDeleting) {
      // Removing characters
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length - 1));
      }, deletingSpeed);
    } else {
      // Adding characters
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length + 1));
      }, typingSpeed);
    }

    // Checking boundaries
    if (!isDeleting && text === currentWord) {
      // Pause when word is fully typed
      timer = setTimeout(() => setIsDeleting(true), pauseDelay);
    } else if (isDeleting && text === '') {
      // Move to next word when fully deleted
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDelay]);

  return text;
};
