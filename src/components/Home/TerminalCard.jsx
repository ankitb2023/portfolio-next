"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './TerminalCard.module.scss';
import { useTerminal } from '../../customhook/useTerminal';

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
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  
  const containerRef = useRef(null);
  const bodyRef = useRef(null);
  
  const { 
    history, 
    input, 
    setInput, 
    handleKeyDown, 
    context, 
    suggestions, 
    executeCommand 
  } = useTerminal(styles);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Track whether the terminal card is ≥90% visible in the viewport
  useEffect(() => {
    const viewportObserver = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);

        // Blur the input when the card scrolls out of view
        if (!entry.isIntersecting && inputRef.current && document.activeElement === inputRef.current) {
          inputRef.current.blur();
        }
      },
      { threshold: 0.9 }
    );

    if (containerRef.current) viewportObserver.observe(containerRef.current);

    return () => viewportObserver.disconnect();
  }, []);

  // Auto-focus the terminal input on any keypress when card is ≥90% visible
  useEffect(() => {
    if (!isAnimationComplete || !isInViewport) return;

    const handleGlobalKeyDown = (e) => {
      // Ignore if user is already typing in another input/textarea
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        // Allow if it's our own terminal input
        if (document.activeElement !== inputRef.current) return;
      }

      // Ignore modifier-only keys and shortcuts
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Focus the terminal input so the keystroke lands there
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isAnimationComplete, isInViewport]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history, input, currentLineIndex, suggestions]);

  useEffect(() => {
    if (isAnimationComplete && history.length === 0) {
      // Automatically show help command once and clear wait time
      setTimeout(() => executeCommand('help'), 400);
    }
  }, [isAnimationComplete, history.length, executeCommand]);

  const inputRef = useRef(null);



  const handleTerminalClick = useCallback((e) => {
    // If they clicked a clickable command or suggestion item, let it handle itself
    if (e.target.closest(`.${styles.clickableCommand}`) || e.target.closest(`.${styles.suggestionItem}`)) {
      return;
    }
    
    // Otherwise, ensure focus is on the input
    if (inputRef.current && isAnimationComplete) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [isAnimationComplete, styles]);

  const handleComplete = useCallback((idx) => {
    setCurrentLineIndex(prev => {
      const next = prev === idx ? prev + 1 : prev;
      if (next >= terminalLines.length) {
        setIsAnimationComplete(true);
      }
      return next;
    });
  }, []);

  return (
    <div className={styles.terminalContainer} ref={containerRef}>
      <div className={styles.animatedBorder}></div>
      <div className={styles.editorCard}>
        <div className={styles.editorHeader}>
          <span className={styles.dotRed}></span>
          <span className={styles.dotYellow}></span>
          <span className={styles.dotGreen}></span>
        </div>
        <div className={styles.editorBody} ref={bodyRef} onClick={handleTerminalClick}>
          <code>
            {terminalLines.map((line, idx) => {
              let isFuture = idx > currentLineIndex;
              let isCurrent = idx === currentLineIndex;
              const isPast = idx < currentLineIndex;

              if (!isVisible && isCurrent) {
                isCurrent = false;
                isFuture = true;
              }

              if (line.type === 'delay') {
                if (isCurrent) {
                  return (
                    <React.Fragment key={line.id}>
                      <TypewriterContent line={line} index={idx} onComplete={handleComplete} />
                      {!isAnimationComplete && <span className={styles.cursorBlink}>_</span>}
                    </React.Fragment>
                  );
                }
                return null;
              }

              return (
                <React.Fragment key={line.id}>
                  {isFuture ? (
                    <span style={{ visibility: 'hidden' }}>
                      {line.prefix && <span className={styles.cmd}>{line.prefix} </span>}
                      {line.render ? line.render() : <span className={styles.plainText}>{line.rawText}</span>}
                    </span>
                  ) : isCurrent ? (
                    <>
                      <TypewriterContent line={line} index={idx} onComplete={handleComplete} />
                      {!isAnimationComplete && <span className={styles.cursorBlink}>_</span>}
                    </>
                  ) : (
                    <>
                      {line.prefix && <span className={styles.cmd}>{line.prefix} </span>}
                      {line.render ? line.render() : <span className={styles.plainText}>{line.rawText}</span>}
                    </>
                  )}
                  
                  {/* Keep blinking cursor at the very end after completion if not interactive yet */}
                  {idx === terminalLines.length - 1 && isPast && !isAnimationComplete && (
                    <span className={styles.cursorBlink}>_</span>
                  )}
                  <br />
                </React.Fragment>
              );
            })}

            {/* Interactive CLI Mode */}
            {isAnimationComplete && (
              <div style={{ marginTop: '1rem' }}>
                {history.map((item, i) => (
                  <div key={i}>
                    {item.type === 'command' ? (
                      <div style={{ marginTop: '0.2rem' }}>
                        <span className={styles.prompt}>
                           {/* Depending on if we tracked context on past command, but string is enough */}
                           &gt;
                        </span>
                        <span className={styles.cmd}>{item.value}</span>
                      </div>
                    ) : (
                      <div style={{ marginTop: '0.4rem', marginBottom: '0.8rem' }}>
                        {item.content}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Current Input Line */}
                <div className={styles.terminalInputDiv}>
                  <span className={styles.prompt}>
                    {context?.type === 'project' ? `> project ${context.id + 1}` : '>'}
                  </span>
                  <input
                    ref={(el) => {
                      inputRef.current = el;
                    }}
                    className={styles.terminalInput}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    autoComplete="off"
                  />
                </div>

                {/* Suggestions Dropdown */}
                {input.length > 0 && suggestions.length > 0 && (
                  <div className={styles.suggestionsDropdown}>
                    {suggestions.map(s => (
                      <span 
                        key={s} 
                        className={styles.suggestionItem} 
                        onClick={() => {
                          setInput(s);
                          // We might optionally automatically execute here, but setting input is safer
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            <br />
          </code>
        </div>
      </div>
    </div>
  );
};
