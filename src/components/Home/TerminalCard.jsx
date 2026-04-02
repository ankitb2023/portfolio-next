"use client";
import React, { useState, useEffect, useCallback } from 'react';
import styles from './TerminalCard.module.scss';

const terminalLines = [
  {
    id: 1, type: 'type', prefix: '>', rawText: "npm run build", speed: 50,
    render: () => <span className={styles.cmd}>npm run build</span>
  },
  { id: 2, type: 'delay', delay: 400 },
  { id: 3, type: 'instant', render: () => <><span className={styles.check}>✔</span> React App compiled successfully</> },
  { id: 4, type: 'instant', render: () => <><span className={styles.check}>✔</span> Spring Boot server running</> },
  { id: 5, type: 'delay', delay: 400 },
  { id: 6, type: 'instant', render: () => null }, // Renders an empty line
  {
    id: 7, type: 'type', rawText: 'const dev = "Ankit";', speed: 40,
    render: () => <><span className={styles.keyword}>const</span> <span className={styles.variable}>dev</span> <span className={styles.operator}>=</span> <span className={styles.string}>"Ankit"</span>;</>
  },
  {
    id: 8, type: 'type', rawText: 'const role = "Full Stack Developer";', speed: 40,
    render: () => <><span className={styles.keyword}>const</span> <span className={styles.variable}>role</span> <span className={styles.operator}>=</span> <span className={styles.string}>"Full Stack Developer"</span>;</>
  },
  {
    id: 9, type: 'type', rawText: 'skills = ["React", "NextJs", "Spring Boot", "Java"];', speed: 40,
    render: () => <><span className={styles.variable}>skills</span> <span className={styles.operator}>=</span> [<span className={styles.string}>"React"</span>, <span className={styles.string}>"NextJs"</span>, <span className={styles.string}>"Spring Boot"</span>, <span className={styles.string}>"Java"</span>];</>
  },
  {
    id: 10, type: 'type', rawText: 'status = "Open to Opportunities 🚀";', speed: 40,
    render: () => <><span className={styles.variable}>status</span> <span className={styles.operator}>=</span> <span className={styles.string}>"Open to Opportunities 🚀"</span>;</>
  }
];

const TypewriterContent = React.memo(({ line, index, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (line.type === 'instant') {
      const timer = setTimeout(() => onComplete(index), 50);
      return () => clearTimeout(timer);
    }
    if (line.type === 'delay') {
      const timer = setTimeout(() => onComplete(index), line.delay);
      return () => clearTimeout(timer);
    }

    // Typewriter effect
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(line.rawText.slice(0, i + 1));
      i++;
      if (i >= line.rawText.length) {
        clearInterval(interval);
        setTimeout(() => onComplete(index), 150); // slight pause after typing finishes
      }
    }, line.speed || 50);

    return () => clearInterval(interval);
  }, [line, index, onComplete]);

  if (line.type === 'delay') return null;

  const isCompleted = (line.type === 'instant') || (displayedText === line.rawText);

  return (
    <>
      {line.prefix && <span className={styles.cmd}>{line.prefix} </span>}
      {isCompleted && line.render ? line.render() : <span className={styles.plainText}>{displayedText}</span>}
    </>
  );
});
TypewriterContent.displayName = 'TypewriterContent';


export const TerminalCard = () => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const handleComplete = useCallback((idx) => {
    setCurrentLineIndex(prev => {
      if (prev === idx) return prev + 1;
      return prev;
    });
  }, []);

  return (
    <div className={styles.editorCard}>
      <div className={styles.editorHeader}>
        <span className={styles.dotRed}></span>
        <span className={styles.dotYellow}></span>
        <span className={styles.dotGreen}></span>
      </div>
      <div className={styles.editorBody}>
        <code>
          {terminalLines.slice(0, currentLineIndex + 1).map((line, idx) => {
            if (line.type === 'delay') {
              if (idx === currentLineIndex) {
                return <TypewriterContent key={line.id} line={line} index={idx} onComplete={handleComplete} />;
              }
              return null;
            }
            return (
              <React.Fragment key={line.id}>
                {idx === currentLineIndex ? (
                  <TypewriterContent line={line} index={idx} onComplete={handleComplete} />
                ) : (
                  <>
                    {line.prefix && <span className={styles.cmd}>{line.prefix} </span>}
                    {line.render ? line.render() : <span className={styles.plainText}>{line.rawText}</span>}
                  </>
                )}
                {line.type !== 'delay' && <br />}
              </React.Fragment>
            );
          })}
          <span className={styles.cursorBlink}>_</span>
        </code>
      </div>
    </div>
  );
};
