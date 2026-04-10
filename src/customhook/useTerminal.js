import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { projectsData } from '../data/projects';
import { experienceData } from '../data/experience';
import { educationData } from '../data/education';

export const useTerminal = (styles) => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [context, setContext] = useState(null); // { type: 'project' | 'experience', id?: number }
  const { setTheme } = useTheme();

  // BUG FIX: Use a ref to track context state. 
  // This ensures executeCommand (which is a closure) always sees the latest context 
  // even when called from an async/timeout source without needing a re-render cycle.
  const contextRef = useRef(context);
  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  const getAvailableCommands = () => {
    const currentContext = contextRef.current;
    if (currentContext?.type === 'project') {
      return ['open live', 'open code', 'back', 'help', 'clear'];
    }
    if (currentContext?.type === 'experience') {
      return ['fte', 'f', 'internship', 'i', 'back', 'help', 'clear'];
    }
    return [
      'help', 'about', 'skills', 'projects', 'education', 'experience', 'contact', 'clear', 'back',
      'ls', 'hire me', 'open github', 'open linkedin', 'download resume', 'theme light', 'theme dark', 'mail me'
    ];
  };

  const getSuggestions = (val) => {
    if (!val.trim()) return [];
    const cmds = getAvailableCommands();
    return cmds.filter(cmd => cmd.startsWith(val.trim().toLowerCase()));
  };

  // Content reveal helper
  const renderStaggered = (items, renderFn) => (
    <div>
      {items.map((item, idx) => (
        <div key={idx} className={styles.staggerRow} style={{ '--idx': idx }}>
          {renderFn(item, idx)}
        </div>
      ))}
    </div>
  );

  const executeCommand = (cmdStr) => {
    const rawCmd = cmdStr.trim();
    const cmd = rawCmd.toLowerCase();
    const currentContext = contextRef.current;

    // Add command to history
    let newHistory = [...history, { type: 'command', value: rawCmd }];

    // Update cmd history for Arrow navigation
    if (cmd) {
      setCmdHistory(prev => [cmd, ...prev]);
      setHistoryIndex(-1);
    }

    const pushOutput = (content) => {
      newHistory.push({ type: 'output', content });
      setHistory(newHistory);
    };

    if (!cmd) {
      setHistory(newHistory);
      return;
    }

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    // --- CONTEXTUAL COMMANDS (Inside Project Detail) ---
    if (currentContext?.type === 'project') {
      const p = projectsData[currentContext.id];
      if (cmd === 'back') {
        setContext(null);
        pushOutput(<div className={styles.terminalText}>Returning to project list...</div>);
        // We use a small delay but since we reset context state above, 
        // the re-render will happen and next command will see null context.
        setTimeout(() => executeAndSetInput('projects'), 50);
        return;
      }
      if (cmd === 'open live') {
        pushOutput(<div className={styles.terminalText}>Opening live project...</div>);
        if (p.viewLink && p.viewLink !== '#') window.open(p.viewLink, '_blank');
        else pushOutput(<div className={styles.errorText}>No live link available.</div>);
        return;
      }
      if (cmd === 'open code') {
        pushOutput(<div className={styles.terminalText}>Opening codebase...</div>);
        if (p.codeLink && p.codeLink !== '#') window.open(p.codeLink, '_blank');
        else pushOutput(<div className={styles.errorText}>No code link available.</div>);
        return;
      }
      if (cmd === 'help') {
        pushOutput(
          <div className={styles.terminalTable}>
            <div style={{ color: 'var(--accent-secondary)', fontWeight: 'bold', marginBottom: '4px' }}>Project View Commands:</div>
            <div>- <span className={styles.clickableCommand} onClick={() => executeAndSetInput('open live')}>open live</span> : Open live project</div>
            <div>- <span className={styles.clickableCommand} onClick={() => executeAndSetInput('open code')}>open code</span> : View source code</div>
            <div>- <span className={styles.clickableCommand} onClick={() => executeAndSetInput('back')}>back</span>      : Return to list</div>
            <div>- <span className={styles.clickableCommand} onClick={() => executeAndSetInput('clear')}>clear</span>     : Clear terminal</div>
          </div>
        );
        return;
      }
    }

    // --- CONTEXTUAL COMMANDS (Experience Selection) ---
    if (currentContext?.type === 'experience') {
      if (cmd === 'back') {
        setContext(null);
        pushOutput(<div className={styles.terminalText}>Returning to main menu...</div>);
        setTimeout(() => executeAndSetInput('help'), 50);
        return;
      }
      if (cmd === 'fte' || cmd === 'f') {
        const fullTime = experienceData.filter(e => e.company.includes('InfoEdge') || e.company.includes('Veersa'));
        pushOutput(
          <div>
            <div style={{ fontWeight: 'bold', color: 'var(--accent-secondary)', marginBottom: '8px' }}>Full Time Experience:</div>
            {renderStaggered(fullTime, (exp) => (
              <div style={{ marginBottom: '0.8rem', paddingLeft: '1rem' }}>
                <div><span className={styles.highlight}>{exp.role}</span> @ {exp.company}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>{exp.duration}</div>
              </div>
            ))}
            <div style={{ marginTop: '1rem', opacity: 0.8, fontSize: '0.9em' }}>Type <span className={styles.clickableCommand} onClick={() => executeAndSetInput('back')}>back</span> to return.</div>
          </div>
        );
        return;
      }
      if (cmd === 'internship' || cmd === 'i') {
        const internships = experienceData.filter(e => !e.company.includes('InfoEdge') && !e.company.includes('Veersa'));
        pushOutput(
          <div>
            <div style={{ fontWeight: 'bold', color: 'var(--accent-secondary)', marginBottom: '8px' }}>Internships:</div>
            {renderStaggered(internships, (exp) => (
              <div style={{ marginBottom: '0.8rem', paddingLeft: '1rem' }}>
                <div><span className={styles.highlight}>{exp.role}</span> @ {exp.company}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>{exp.duration}</div>
              </div>
            ))}
            <div style={{ marginTop: '1rem', opacity: 0.8, fontSize: '0.9em' }}>Type <span className={styles.clickableCommand} onClick={() => executeAndSetInput('back')}>back</span> to return.</div>
          </div>
        );
        return;
      }
      if (cmd === 'help') {
        pushOutput(
          <div className={styles.terminalTable}>
            <div style={{ color: 'var(--accent-secondary)', fontWeight: 'bold', marginBottom: '4px' }}>Experience Selection:</div>
            <div>- <span className={styles.clickableCommand} onClick={() => executeAndSetInput('fte')}>fte</span> / <span className={styles.highlight}>f</span>       : Full Time roles</div>
            <div>- <span className={styles.clickableCommand} onClick={() => executeAndSetInput('internship')}>internship</span> / <span className={styles.highlight}>i</span>: Intern roles</div>
            <div>- <span className={styles.clickableCommand} onClick={() => executeAndSetInput('back')}>back</span>            : Main menu</div>
          </div>
        );
        return;
      }
    }

    // --- GLOBAL COMMANDS ---
    if (cmd === 'help') {
      pushOutput(
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ color: 'var(--text-secondary)' }}>Help menu: Available commands organized by category</div>

          <div className={styles.terminalTable}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '10px' }}>
              <div style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>PAGES:</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['about', 'experience', 'skills', 'projects', 'education', 'contact'].map(c => (
                  <span key={c} className={styles.clickableCommand} onClick={() => executeAndSetInput(c)}>{c}</span>
                ))}
              </div>

              <div style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>ACTIONS:</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['hire me', 'download resume', 'open github', 'open linkedin'].map(c => (
                  <span key={c} className={styles.clickableCommand} onClick={() => executeAndSetInput(c)}>{c}</span>
                ))}
              </div>

              <div style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>SYSTEM:</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['ls', 'theme light', 'theme dark', 'clear', 'help'].map(c => (
                  <span key={c} className={styles.clickableCommand} onClick={() => executeAndSetInput(c)}>{c}</span>
                ))}
              </div>
            </div>
          </div>
          {/* <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>Tip: You can use <span className={styles.highlight}>back</span> to return from any section.</div> */}
        </div>
      );
    } else if (cmd === 'back') {
      pushOutput(<div className={styles.terminalText}>Returning to main help menu...</div>);
      setTimeout(() => executeAndSetInput('help'), 50);
    } else if (cmd === 'about') {
      pushOutput(<div className={styles.terminalText}>I'm Ankit, a passionate Full Stack Developer focused on building modern web applications.</div>);
    } else if (cmd === 'skills') {
      pushOutput(
        <div className={styles.terminalText}>
          <div>Frontend: <span className={styles.highlight}>React, Next.js, Redux, SCSS, Tailwind CSS</span></div>
          <div>Backend: <span className={styles.highlight}>Node.js, Express, Spring Boot, Java, Python</span></div>
          <div>Database: <span className={styles.highlight}>MongoDB, PostgreSQL, MySQL</span></div>
          <div>Tools: <span className={styles.highlight}>Git, Docker, AWS, Postman</span></div>
        </div>
      );
    } else if (cmd === 'experience') {
      setContext({ type: 'experience' });
      pushOutput(
        <div>
          <div style={{ marginBottom: '8px' }}>Select experience level:</div>
          <div style={{ paddingLeft: '1rem' }}>
            - Type <span className={styles.clickableCommand} onClick={() => executeAndSetInput('fte')}>fte</span> (or <span className={styles.highlight}>f</span>) for Full Time</div>
          <div style={{ paddingLeft: '1rem' }}>
            - Type <span className={styles.clickableCommand} onClick={() => executeAndSetInput('internship')}>internship</span> (or <span className={styles.highlight}>i</span>) for Internships</div>
          <div style={{ marginTop: '8px', fontSize: '0.9em', opacity: 0.8 }}>Type <span className={styles.clickableCommand} onClick={() => executeAndSetInput('back')}>back</span> to cancel.</div>
        </div>
      );
    } else if (cmd === 'welcome back') {
      let section = null;
      try {
        const memObj = JSON.parse(localStorage.getItem('portfolio_visitor_memory') || '{}');
        section = memObj.lastSessionSection || memObj.lastSection; // Fallback for old cache
      } catch (e) { }

      if (section && section !== 'home') {
        pushOutput(<div className={styles.terminalText}>Resuming session... navigating to {section}</div>);
        setTimeout(() => {
          smoothScrollTo(section);
        }, 300);
      } else {
        pushOutput(<div className={styles.errorText}>No previous session found to resume.</div>);
      }
    } else if (cmd === 'education') {
      pushOutput(
        <div>
          {renderStaggered(educationData, (edu) => (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{edu.title} - {edu.major}</div>
              <div>{edu.school}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9em', marginTop: '2px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Year: {edu.date}</span>
                <span style={{ color: 'var(--syntax-check)' }}>{edu.score}</span>
              </div>
            </div>
          ))}
          <div style={{ marginTop: '0.5rem', opacity: 0.8, fontSize: '0.9em' }}>Type <span className={styles.clickableCommand} onClick={() => executeAndSetInput('back')}>back</span> to return.</div>
        </div>
      );
    } else if (cmd === 'projects' || cmd === 'ls') {
      pushOutput(
        <div>
          <div style={{ marginBottom: '1rem' }}>Available Projects:</div>
          {renderStaggered(projectsData, (p, idx) => (
            <div style={{ marginBottom: '0.4rem' }}>
              <span className={styles.clickableCommand} onClick={() => executeAndSetInput(`project ${idx + 1}`)}>
                {idx + 1}. {p.title}
              </span>
            </div>
          ))}
          <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9em' }}>
            Type <span className={styles.highlight}>project &lt;number&gt;</span> or <span className={styles.clickableCommand} onClick={() => executeAndSetInput('back')}>back</span>.
          </div>
        </div>
      );
    } else if (cmd.startsWith('project ')) {
      const idxStr = cmd.replace('project ', '').trim();
      const idx = parseInt(idxStr, 10) - 1;
      if (!isNaN(idx) && idx >= 0 && idx < projectsData.length) {
        setContext({ type: 'project', id: idx });
        const p = projectsData[idx];
        pushOutput(
          <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2em', color: 'var(--accent-secondary)' }}>{p.title}</div>
            <div style={{ margin: '0.8rem 0', color: 'var(--text-primary)', lineWeight: '1.5' }}>{p.description}</div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>Commands:</div>
            <div style={{ display: 'flex', gap: '15px', marginTop: '8px' }}>
              <span className={styles.clickableCommand} onClick={() => executeAndSetInput('open live')}>open live</span>
              <span className={styles.clickableCommand} onClick={() => executeAndSetInput('open code')}>open code</span>
              <span className={styles.clickableCommand} onClick={() => executeAndSetInput('back')}>back</span>
            </div>
          </div>
        );
      } else {
        pushOutput(<div className={styles.errorText}>Project not found. Type <span className={styles.clickableCommand} onClick={() => executeAndSetInput('projects')}>projects</span> for the list.</div>);
      }
    } else if (cmd === 'contact') {
      pushOutput(
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div><span style={{ color: 'var(--text-secondary)' }}>Email:</span> ankit.bhujeja2023@gmail.com</div>
          <div style={{ margin: '4px 0' }}>Launch an action:</div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <span className={styles.clickableCommand} onClick={() => executeAndSetInput('mail me')}>mail me</span>
            <span className={styles.clickableCommand} onClick={() => executeAndSetInput('open github')}>open github</span>
            <span className={styles.clickableCommand} onClick={() => executeAndSetInput('open linkedin')}>open linkedin</span>
          </div>
          <div style={{ marginTop: '4px', fontSize: '0.9em', opacity: 0.8 }}>Type <span className={styles.clickableCommand} onClick={() => executeAndSetInput('back')}>back</span> to return.</div>
        </div>
      );
    } else if (cmd === 'mail me') {
      pushOutput(<div className={styles.terminalText}>Opening mail client...</div>);
      window.open('mailto:ankit.bhujeja2023@gmail.com?subject=Hello!&body=Hi Ankit,%0D%0A%0D%0AI saw your portfolio and wanted to reach out.', '_blank');
    } else if (cmd === 'open github') {
      pushOutput(<div className={styles.terminalText}>Opening GitHub...</div>);
      window.open('https://github.com/ankitb2023', '_blank');
    } else if (cmd === 'open linkedin') {
      pushOutput(<div className={styles.terminalText}>Opening LinkedIn...</div>);
      window.open('https://linkedin.com/in/ankit-bhujeja', '_blank');
    } else if (cmd === 'hire me') {
      pushOutput(<div style={{ color: 'var(--syntax-check)' }}>Great choice! Opening mail client...</div>);
      window.open('mailto:ankit.bhujeja2023@gmail.com?subject=Inquiry from Portfolio&body=Hi Ankit, I am interested in hiring you for...', '_blank');
    } else if (cmd === 'download resume') {
      pushOutput(<div className={styles.terminalText}>Downloading resume...</div>);
      window.open('/documents/AnkitBhujejaResume.pdf', '_blank');
    } else if (cmd === 'theme light') {
      pushOutput(<div className={styles.terminalText}>Switching to light theme...</div>);
      setTheme('light');
    } else if (cmd === 'theme dark') {
      pushOutput(<div className={styles.terminalText}>Switching to dark theme...</div>);
      setTheme('dark');
    } else {
      pushOutput(<div className={styles.errorText}>Command not found: "{rawCmd}". Type <span className={styles.clickableCommand} onClick={() => executeAndSetInput('help')}>help</span> for command list.</div>);
    }
  };

  const executeAndSetInput = (cmd) => {
    executeCommand(cmd);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeAndSetInput(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0 && historyIndex < cmdHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInput(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(cmdHistory[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const suggestions = getSuggestions(input);
      if (suggestions.length === 1) {
        setInput(suggestions[0]);
      } else if (suggestions.length > 1) {
        let newHistory = [...history, { type: 'command', value: input }];
        newHistory.push({
          type: 'output',
          content: (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {suggestions.map(s => <div key={s} className={styles.highlight}>{s}</div>)}
            </div>
          )
        });
        setHistory(newHistory);
      }
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setHistory([]);
    }
  };

  const suggestions = getSuggestions(input);

  return {
    history,
    input,
    setInput,
    handleKeyDown,
    context,
    suggestions,
    executeCommand: executeAndSetInput
  };
};
