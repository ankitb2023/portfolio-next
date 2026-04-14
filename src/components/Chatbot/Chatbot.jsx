"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Chatbot.module.scss';
import { projectsData } from '@/data/projects';
import { skillCategories } from '@/data/skills';
import { experienceData } from '@/data/experience';
import { educationData } from '@/data/education';
import { EMAIL, MAIL_TO_URL, LINKEDIN_URL, GITHUB_URL } from '@/constants/constants';

// ─── Intent Definitions ────────────────────────────────────────────
// Each intent has keywords, common misspellings, and follow-up suggestions
const INTENTS = {
  projects: {
    keywords: ['project', 'projects', 'work', 'built', 'portfolio', 'apps', 'websites', 'demo', 'showcase', 'creations'],
    fuzzy: ['projct', 'proect', 'prject', 'proyect', 'porject', 'projetc', 'prjects', 'projets'],
  },
  skills: {
    keywords: ['skill', 'skills', 'tech', 'stack', 'technology', 'technologies', 'tools', 'languages', 'framework', 'frameworks', 'frontend', 'backend', 'devops'],
    fuzzy: ['skil', 'skils', 'skilss', 'skiils', 'techology', 'tecnology', 'teck', 'stak', 'stck'],
  },
  fte_experience: {
    keywords: ['full time', 'fte', 'full-time'],
    fuzzy: [],
  },
  internship_experience: {
    keywords: ['intern', 'internship', 'internships'],
    fuzzy: ['intership', 'internshp'],
  },
  experience: {
    keywords: ['experience', 'job', 'career', 'company', 'companies', 'worked', 'working', 'employment', 'role', 'position'],
    fuzzy: ['experince', 'experiance', 'experiece', 'expereince', 'exprience', 'experence', 'experinec'],
  },
  education: {
    keywords: ['education', 'degree', 'university', 'college', 'school', 'study', 'studied', 'qualification', 'academic', 'cgpa', 'gpa'],
    fuzzy: ['educaton', 'educaion', 'eduction', 'edcuation', 'univrsity', 'collge'],
  },
  contact: {
    keywords: ['contact', 'email', 'reach', 'connect', 'hire', 'hiring', 'linkedin', 'social', 'message', 'mail', 'phone', 'call', 'whatsapp'],
    fuzzy: ['contct', 'conact', 'cotact', 'contac', 'emal', 'emial', 'linkdin', 'linkdein'],
  },
  opportunities: {
    keywords: ['opportunity', 'opportunities', 'open', 'available', 'freelance', 'remote', 'relocate', 'job opening'],
    fuzzy: ['opportunty', 'oportunity', 'oppurtunity', 'oppertunity', 'oportunties'],
  },
  greeting: {
    keywords: ['hello', 'hi', 'hey', 'hola', 'howdy', 'good morning', 'good evening', 'sup', 'yo', 'greetings', 'namaste'],
    fuzzy: ['helo', 'hii', 'heloo'],
  },
  about: {
    keywords: ['about', 'who', 'yourself', 'introduce', 'introduction', 'tell me about', 'background', 'bio'],
    fuzzy: ['abot', 'abut', 'aboit'],
  },
  resume: {
    keywords: ['resume', 'cv', 'download resume', 'view resume', 'pdf'],
    fuzzy: ['resum', 'ressume', 'resumee', 'resme'],
  },
  thanks: {
    keywords: ['thanks', 'thank you', 'thx', 'ty', 'appreciate', 'great', 'awesome', 'cool', 'nice', 'perfect', 'helpful'],
    fuzzy: ['thnks', 'thnx', 'thanx', 'thamks'],
  },
};

// Context-aware follow-up keywords
const FOLLOWUP_KEYWORDS = ['more', 'next', 'another', 'show more', 'continue', 'again', 'other', 'else', 'different', 'extra'];
const BACK_KEYWORDS = ['back', 'go back', 'return', 'previous', 'menu', 'home', 'start', 'main'];

// ─── Intent Matcher ────────────────────────────────────────────────
function matchIntent(input) {
  const lower = input.toLowerCase().trim();

  // Check for specific project mentions
  for (const project of projectsData) {
    if (lower.includes(project.title.toLowerCase())) {
      return { intent: '__project_details__', confidence: 1, project: project };
    }
  }

  // Check for follow-up
  if (FOLLOWUP_KEYWORDS.some(kw => lower.includes(kw))) {
    return { intent: '__followup__', confidence: 0.9 };
  }
  // Check for back/menu
  if (BACK_KEYWORDS.some(kw => lower.includes(kw))) {
    return { intent: '__back__', confidence: 0.9 };
  }

  let bestMatch = null;
  let bestScore = 0;

  for (const [intentName, { keywords, fuzzy }] of Object.entries(INTENTS)) {
    // Exact keyword match (highest confidence)
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        const score = kw.length / lower.length; // longer keyword match = higher confidence
        if (score > bestScore || !bestMatch) {
          bestMatch = intentName;
          bestScore = Math.max(score, 0.85);
        }
      }
    }
    // Fuzzy match (lower confidence)
    if (!bestMatch || bestScore < 0.85) {
      for (const fz of fuzzy) {
        if (lower.includes(fz) || levenshteinClose(lower, fz)) {
          if (0.6 > bestScore) {
            bestMatch = intentName;
            bestScore = 0.6;
          }
        }
      }
    }
  }

  return bestMatch
    ? { intent: bestMatch, confidence: bestScore }
    : { intent: '__unknown__', confidence: 0 };
}

// Lightweight Levenshtein-inspired distance check (no heavy libs)
function levenshteinClose(input, target, maxDist = 2) {
  // Quick filter: if lengths differ by more than maxDist, skip
  if (Math.abs(input.length - target.length) > maxDist) return false;
  // Check if any word in input is close to target
  const words = input.split(/\s+/);
  for (const word of words) {
    if (Math.abs(word.length - target.length) > maxDist) continue;
    let dist = 0;
    const minLen = Math.min(word.length, target.length);
    for (let i = 0; i < minLen; i++) {
      if (word[i] !== target[i]) dist++;
      if (dist > maxDist) break;
    }
    dist += Math.abs(word.length - target.length);
    if (dist <= maxDist) return true;
  }
  return false;
}

// ─── Suggestion Sets ───────────────────────────────────────────────
const INITIAL_SUGGESTIONS = [
  { label: "Can I see your featured projects? 🚀", text: "Can I see your featured projects?" },
  { label: "What technical skills do you have? 💻", text: "What technical skills do you have?" },
  { label: "Describe your experience 💼", text: "Describe your experience" },
  { label: "What is your educational background? 🎓", text: "What is your educational background?" },
  { label: "How can I contact you? 📬", text: "How can I contact you?" },
  { label: "Are you open to opportunities? 🚀", text: "Are you open to opportunities?" },
];

const FOLLOWUP_SUGGESTIONS = {
  projects: [
    { label: "Show next projects 📦", text: "Show next projects" },
    { label: "What technical skills do you have? 💻", text: "What technical skills do you have?" },
    { label: "Describe your experience 💼", text: "Describe your experience" },
  ],
  skills: [
    { label: "Can I see your featured projects? 🚀", text: "Can I see your featured projects?" },
    { label: "Describe your experience 💼", text: "Describe your experience" },
    { label: "How can I contact you? 📬", text: "How can I contact you?" },
  ],
  experience: [
    { label: "Full Time Experience 💼", text: "Full Time Experience" },
    { label: "Internships 🎓", text: "Internships" },
  ],
  fte_experience: [
    { label: "Show Internships 🎓", text: "Show internships" },
    { label: "Can I see your featured projects? 🚀", text: "Can I see your featured projects?" },
  ],
  internship_experience: [
    { label: "Show Full Time Experience 💼", text: "Show full time experience" },
    { label: "Can I see your featured projects? 🚀", text: "Can I see your featured projects?" },
  ],
  education: [
    { label: "Describe your experience 💼", text: "Describe your experience" },
    { label: "What technical skills do you have? 💻", text: "What technical skills do you have?" },
    { label: "Can I see your featured projects? 🚀", text: "Can I see your featured projects?" },
  ],
  contact: [
    { label: "Can I see your featured projects? 🚀", text: "Can I see your featured projects?" },
    { label: "What technical skills do you have? 💻", text: "What technical skills do you have?" },
    { label: "Describe your experience 💼", text: "Describe your experience" },
  ],
  opportunities: [
    { label: "How can I contact you? 📬", text: "How can I contact you?" },
    { label: "Can I see your featured projects? 🚀", text: "Can I see your featured projects?" },
    { label: "What technical skills do you have? 💻", text: "What technical skills do you have?" },
  ],
  __default__: [
    { label: "Can I see your featured projects? 🚀", text: "Can I see your featured projects?" },
    { label: "What technical skills do you have? 💻", text: "What technical skills do you have?" },
    { label: "Describe your experience 💼", text: "Describe your experience" },
    { label: "How can I contact you? 📬", text: "How can I contact you?" },
  ],
};

// ─── Sub-components ────────────────────────────────────────────────
const ProjectCard = ({ project, onViewDetails, minimal = false }) => (
  <div className={styles.miniProjectCard}>
    <div className={styles.imgWrapper}>
      <img src={project.imgSrc} alt={project.title} loading="lazy" />
    </div>
    <div className={styles.cardContent}>
      <h5>{project.title}</h5>
      {!minimal && <p>{project.description.slice(0, 80)}...</p>}
      {!minimal && (
        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={() => onViewDetails(project)}>View Details</button>
          {project.viewLink !== '#' && (
            <a href={project.viewLink} target="_blank" rel="noopener noreferrer" className={styles.secondaryBtn}>Demo</a>
          )}
        </div>
      )}
    </div>
  </div>
);

const SkillsDisplay = ({ full = false }) => (
  <div className={styles.skillsContainer}>
    {skillCategories.slice(0, full ? skillCategories.length : 3).map((cat, i) => (
      <div key={i} className={styles.skillCat}>
        <h6>{cat.title}</h6>
        <div className={styles.skillGrid}>
          {cat.skills.slice(0, full ? cat.skills.length : 5).map((skill, j) => (
            <span key={j} style={{ borderColor: skill.color }}>
              {skill.imgSrc ? <img src={skill.imgSrc} alt={skill.name} /> : <i className={skill.icon} style={{ color: skill.color }}></i>}
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const SuggestionChips = ({ suggestions, onSelect }) => (
  <div className={styles.suggestionChips}>
    {suggestions.map((s, idx) => (
      <button key={idx} onClick={() => onSelect(s.text)}>{s.label}</button>
    ))}
  </div>
);

// ─── Main Chatbot Component ────────────────────────────────────────
export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState(INITIAL_SUGGESTIONS);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const lastIntentRef = useRef(null);
  const projectPageRef = useRef(0); // Track which page of projects we're showing

  // Initialize with greeting
  useEffect(() => {
    setMessages([{
      id: 'msg_init',
      type: 'bot',
      content: (
        <div>
          <p>Hi 👋 I&apos;m Ankit&apos;s AI Assistant!</p>
          <p style={{ marginTop: '0.5rem', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
            I can help you explore projects, skills, experience, and more.
          </p>
        </div>
      ),
    }]);
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isOpen, isTyping]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  }, []);

  const addBotMessage = useCallback((content, isCard = false) => {
    setMessages(prev => [...prev, {
      id: `bot_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type: 'bot',
      content,
      isCard,
    }]);
  }, []);

  // ─── Response Generators ──────────────────────────────────────
  const showProjectDetails = useCallback((project) => {
    addBotMessage(
      <div>
        <strong style={{ color: 'var(--accent-pink)' }}>{project.title}</strong>
        <p style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>{project.description}</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {project.viewLink !== '#' && (
            <a href={project.viewLink} target="_blank" rel="noopener noreferrer">
              Live Demo <i className="fas fa-external-link-alt"></i>
            </a>
          )}
          {project.codeLink !== '#' && (
            <a href={project.codeLink} target="_blank" rel="noopener noreferrer">
              Source Code <i className="fab fa-github"></i>
            </a>
          )}
        </div>
      </div>
    );
    setCurrentSuggestions(FOLLOWUP_SUGGESTIONS.projects);
  }, [addBotMessage]);

  const showProjects = useCallback((page = 0) => {
    const perPage = 2;
    const start = page * perPage;
    const slice = projectsData.slice(start, start + perPage);
    const hasMore = (start + perPage) < projectsData.length;

    if (slice.length === 0) {
      addBotMessage("You've seen all my projects! 🎉 Check the Projects section on the page for the full gallery.");
      setCurrentSuggestions(FOLLOWUP_SUGGESTIONS.__default__);
      return;
    }

    projectPageRef.current = page;

    addBotMessage(
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p>{page === 0 ? 'Here are some of my featured projects:' : `More projects (${start + 1}–${start + slice.length}):`}</p>
        <div style={{ marginTop: '0.5rem' }}>
          {slice.map((p, i) => (
            <ProjectCard key={`${p.title}_${i}`} project={p} onViewDetails={showProjectDetails} minimal={true} />
          ))}
        </div>
      </div>,
      true
    );

    const nextSuggestions = [...FOLLOWUP_SUGGESTIONS.projects];
    if (hasMore) {
      nextSuggestions[0] = { label: "Show next projects 📦", text: "Show more projects" };
    } else {
      nextSuggestions.shift(); // Remove "More projects" if we've shown all
    }

    // Always suggest the last card shown as a detail view
    const lastCard = slice[slice.length - 1];
    nextSuggestions.splice(hasMore ? 1 : 0, 0, {
      label: `Tell me about ${lastCard.title} 🔍`,
      text: `Show ${lastCard.title}`
    });

    setCurrentSuggestions(nextSuggestions);
  }, [addBotMessage, showProjectDetails]);

  const showSkills = useCallback((full = false) => {
    addBotMessage(
      <div>
        <p style={{ marginBottom: '1rem' }}>{full ? 'Here\'s my complete skill set:' : 'Here\'s a quick overview of my technical skills:'}</p>
        <SkillsDisplay full={full} />
        {!full && <p style={{ fontSize: '1.1rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Want to see all skills? Just ask!</p>}
      </div>,
      true
    );
    setCurrentSuggestions(
      full ? FOLLOWUP_SUGGESTIONS.skills : [
        { label: "📋 Show All Skills", text: "Show all skills" },
        ...FOLLOWUP_SUGGESTIONS.skills,
      ]
    );
  }, [addBotMessage]);

  const showExperience = useCallback(() => {
    addBotMessage("What kind of experience would you like to see?");
    setCurrentSuggestions([
      { label: "Full Time Experience 💼", text: "Show full time experience" },
      { label: "Internships 🎓", text: "Show internships" },
    ]);
  }, [addBotMessage]);

  const showFTE = useCallback(() => {
    const fte = experienceData.slice(0, 2);
    addBotMessage(
      <div>
        <p style={{ marginBottom: '1rem' }}>Here are my Full Time roles:</p>
        {fte.map((exp, i) => (
          <div key={i} style={{
            padding: '0.8rem 1rem',
            marginBottom: '0.8rem',
            background: 'rgba(var(--bg-card-rgb), 0.6)',
            borderRadius: '10px',
            borderLeft: '3px solid var(--accent-primary)',
          }}>
            <strong style={{ color: 'var(--accent-light)', fontSize: '1.2rem' }}>
              <i className={exp.icon} style={{ marginRight: '0.5rem' }}></i>
              {exp.role}
            </strong>
            <p style={{ fontSize: '1.1rem', marginTop: '0.3rem' }}>{exp.company}</p>
            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{exp.duration}</span>
          </div>
        ))}
      </div>,
      true
    );
    setCurrentSuggestions(FOLLOWUP_SUGGESTIONS.fte_experience);
  }, [addBotMessage]);

  const showInternships = useCallback(() => {
    const internships = experienceData.slice(2, 5); // 3 items
    const remaining = experienceData.length - 5;
    addBotMessage(
      <div>
        <p style={{ marginBottom: '1rem' }}>Here are some of my Internships:</p>
        {internships.map((exp, i) => (
          <div key={i} style={{
            padding: '0.8rem 1rem',
            marginBottom: '0.8rem',
            background: 'rgba(var(--bg-card-rgb), 0.6)',
            borderRadius: '10px',
            borderLeft: '3px solid var(--accent-primary)',
          }}>
            <strong style={{ color: 'var(--accent-light)', fontSize: '1.2rem' }}>
              <i className={exp.icon} style={{ marginRight: '0.5rem' }}></i>
              {exp.role}
            </strong>
            <p style={{ fontSize: '1.1rem', marginTop: '0.3rem' }}>{exp.company}</p>
            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{exp.duration}</span>
          </div>
        ))}
        {remaining > 0 && (
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>+ {remaining} more roles. Check the Experience section!</p>
        )}
      </div>,
      true
    );
    setCurrentSuggestions(FOLLOWUP_SUGGESTIONS.internship_experience);
  }, [addBotMessage]);

  const showEducation = useCallback(() => {
    addBotMessage(
      <div>
        <p style={{ marginBottom: '1rem' }}>Here&apos;s my academic background:</p>
        {educationData.map((edu, i) => (
          <div key={i} style={{
            padding: '0.8rem 1rem',
            marginBottom: '0.8rem',
            background: 'rgba(var(--bg-card-rgb), 0.6)',
            borderRadius: '10px',
            borderLeft: '3px solid var(--accent-pink)',
          }}>
            <strong style={{ color: 'var(--accent-light)', fontSize: '1.2rem' }}>
              🎓 {edu.title}
            </strong>
            <p style={{ fontSize: '1.1rem', marginTop: '0.3rem' }}>{edu.major} — {edu.school}</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.3rem' }}>
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{edu.date}</span>
              <span style={{ fontSize: '1rem', color: 'var(--accent-pink)' }}>{edu.score}</span>
            </div>
          </div>
        ))}
      </div>,
      true
    );
    setCurrentSuggestions(FOLLOWUP_SUGGESTIONS.education);
  }, [addBotMessage]);

  const showContact = useCallback(() => {
    addBotMessage(
      <div>
        <p>You can reach Ankit through:</p>
        <div style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <a href={MAIL_TO_URL} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-envelope"></i> {EMAIL}
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fab fa-linkedin"></i> LinkedIn
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fab fa-github"></i> GitHub
          </a>
        </div>
        <a
          href="#contact"
          onClick={() => handleClose()}
          style={{
            display: 'inline-block', marginTop: '1rem', padding: '0.6rem 1.4rem',
            background: 'var(--accent-primary)', color: '#fff', borderRadius: '20px', textDecoration: 'none',
          }}
        >
          Go to Contact Form →
        </a>
      </div>
    );
    setCurrentSuggestions(FOLLOWUP_SUGGESTIONS.contact);
  }, [addBotMessage, handleClose]);

  // ─── Main Response Dispatcher ─────────────────────────────────
  const processInput = useCallback((text) => {
    const matched = matchIntent(text);
    const { intent, project } = matched;

    if (intent === '__project_details__') {
      showProjectDetails(project);
      lastIntentRef.current = 'projects';
      return;
    }

    // Handle follow-ups using context memory
    if (intent === '__followup__') {
      const last = lastIntentRef.current;
      if (last === 'projects') {
        showProjects(projectPageRef.current + 1);
        return;
      }
      if (last === 'skills') {
        showSkills(true);
        return;
      }
      // For other intents, re-run the last intent
      if (last && INTENTS[last]) {
        processInput(last); // re-dispatch
        return;
      }
      // No context - show menu
      addBotMessage("What would you like to see more of? Pick an option below 👇");
      setCurrentSuggestions(INITIAL_SUGGESTIONS);
      return;
    }

    // Handle back/menu
    if (intent === '__back__') {
      lastIntentRef.current = null;
      projectPageRef.current = 0;
      addBotMessage("Sure! What would you like to explore? 👇");
      setCurrentSuggestions(INITIAL_SUGGESTIONS);
      return;
    }

    // Store context
    if (intent !== '__unknown__') {
      lastIntentRef.current = intent;
    }

    switch (intent) {
      case 'projects':
        projectPageRef.current = 0;
        showProjects(0);
        break;
      case 'skills':
        // Check if user asked for all skills specifically
        if (text.toLowerCase().includes('all')) {
          showSkills(true);
        } else {
          showSkills(false);
        }
        break;
      case 'experience':
        showExperience();
        break;
      case 'fte_experience':
        showFTE();
        break;
      case 'internship_experience':
        showInternships();
        break;
      case 'education':
        showEducation();
        break;
      case 'contact':
        showContact();
        break;
      case 'opportunities':
        addBotMessage(
          <div>
            <p style={{ fontSize: '1.4rem' }}>Yes, I&apos;m open to opportunities! 🚀</p>
            <p style={{ marginTop: '0.5rem' }}>I&apos;m actively looking for exciting roles in frontend/full-stack development. Feel free to reach out!</p>
          </div>
        );
        setCurrentSuggestions(FOLLOWUP_SUGGESTIONS.opportunities);
        break;
      case 'greeting':
        const greetings = [
          "Hello! 👋 Great to have you here. What would you like to explore?",
          "Hey there! 😊 I'm here to help. Pick a topic or ask away!",
          "Hi! Welcome to Ankit's portfolio. What can I help you with today?",
        ];
        addBotMessage(greetings[Math.floor(Math.random() * greetings.length)]);
        setCurrentSuggestions(INITIAL_SUGGESTIONS);
        break;
      case 'about':
        addBotMessage(
          <div>
            <p>Ankit Bhujeja is a <strong style={{ color: 'var(--accent-light)' }}>Senior Software Engineer</strong> currently at InfoEdge (Naukri.com).</p>
            <p style={{ marginTop: '0.5rem' }}>He specializes in building performant, scalable web applications with React, Next.js, and Spring Boot. With a B.Tech from DCRUST Murthal, he brings both academic rigor and industry experience.</p>
          </div>
        );
        setCurrentSuggestions(FOLLOWUP_SUGGESTIONS.__default__);
        break;
      case 'resume':
        addBotMessage(
          <div>
            <p>You can view or download Ankit&apos;s resume:</p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
                style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: '#fff', borderRadius: '20px', textDecoration: 'none' }}>
                📄 View Resume
              </a>
              <a href="/resume.pdf" download
                style={{ padding: '0.5rem 1rem', border: '1px solid var(--accent-primary)', color: 'var(--accent-light)', borderRadius: '20px', textDecoration: 'none' }}>
                ⬇️ Download PDF
              </a>
            </div>
          </div>
        );
        setCurrentSuggestions(FOLLOWUP_SUGGESTIONS.__default__);
        break;
      case 'thanks':
        const replies = [
          "You're welcome! 😊 Let me know if there's anything else you'd like to explore.",
          "Glad I could help! 🎉 Feel free to ask more.",
          "Happy to assist! Anything else on your mind?",
        ];
        addBotMessage(replies[Math.floor(Math.random() * replies.length)]);
        setCurrentSuggestions(INITIAL_SUGGESTIONS);
        break;
      default:
        // Unknown intent - friendly fallback with guidance
        addBotMessage(
          <div>
            <p>Hmm, I didn&apos;t quite catch that 🤔</p>
            <p style={{ marginTop: '0.5rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              Try asking about <strong>projects</strong>, <strong>skills</strong>, <strong>experience</strong>, or <strong>contact</strong> — or pick a suggestion below!
            </p>
          </div>
        );
        setCurrentSuggestions(INITIAL_SUGGESTIONS);
        break;
    }
  }, [addBotMessage, showProjects, showSkills, showExperience, showEducation, showContact]);

  // ─── Send Handler ─────────────────────────────────────────────
  const handleSend = useCallback((text) => {
    if (!text.trim() || isTyping) return;

    const userMsg = { id: `usr_${Date.now()}`, type: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    setCurrentSuggestions([]); // Hide chips while typing

    // Simulated delay for natural feel
    const delay = 500 + Math.random() * 400;
    setTimeout(() => {
      setIsTyping(false);
      processInput(text);
    }, delay);
  }, [isTyping, processInput]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend(inputValue);
    }
  }, [handleSend, inputValue]);

  return (
    <div className={styles.chatbotWrapper}>
      {/* Floating Button */}
      {!isOpen && (
        <button
          className={styles.floatingButton}
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
        >
          <img src="/images/profileupdated.png" alt="Assistant" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div ref={modalRef} className={`${styles.modalContainer} ${isClosing ? styles.closing : ''}`}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <div className={styles.avatar}>
                <img src="/images/profileupdated.png" alt="Assistant" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className={styles.titles}>
                <h4>Ask Me Anything!</h4>
                <span>Your Portfolio Assistant</span>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={handleClose} aria-label="Close chat">
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Chat Body */}
          <div className={styles.chatBody}>
            {messages.map((msg) => (
              <div key={msg.id} className={`${styles.messageRow} ${msg.type === 'user' ? styles.userRow : styles.botRow}`}>
                <div className={`${styles.messageBubble} ${msg.type === 'user' ? styles.userBubble : styles.botBubble} ${msg.isCard ? styles.cardBubble : ''}`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className={`${styles.messageRow} ${styles.botRow}`}>
                <div className={`${styles.messageBubble} ${styles.botBubble}`}>
                  <div className={styles.typingIndicator}>
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}

            {/* Suggestion Chips — ALWAYS visible after response */}
            {!isTyping && currentSuggestions.length > 0 && (
              <SuggestionChips suggestions={currentSuggestions} onSelect={handleSend} />
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={styles.inputArea}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about projects, skills, experience..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className={styles.sendBtn}
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim() || isTyping}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
