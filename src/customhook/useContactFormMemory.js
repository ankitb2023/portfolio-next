'use client';

import { useState, useEffect } from 'react';
import { CONTACT_MEMORY_KEY } from '@/constants/constants';

export const useContactFormMemory = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [hasDraft, setHasDraft] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const storedStr = localStorage.getItem(CONTACT_MEMORY_KEY);
      if (storedStr) {
        const parsed = JSON.parse(storedStr);
        // Expiration check (e.g., 24 hours)
        const ONE_DAY = 24 * 60 * 60 * 1000;
        if (parsed.lastUpdated && Date.now() - parsed.lastUpdated < ONE_DAY) {
           // We have a recent draft
           setFormData(parsed.data);
           if (parsed.data.name || parsed.data.email || parsed.data.phone || parsed.data.message) {
             setHasDraft(true);
           }
        } else {
           // Expired
           localStorage.removeItem(CONTACT_MEMORY_KEY);
        }
      }
    } catch (e) {
      console.warn("Failed to read contact form memory", e);
    } finally {
      setIsReady(true);
    }
  }, []);

  const updateFormData = (field, value) => {
    setFormData(prev => {
      const nextData = { ...prev, [field]: value };
      
      try {
        localStorage.setItem(CONTACT_MEMORY_KEY, JSON.stringify({
          data: nextData,
          lastUpdated: Date.now()
        }));
        
        // If they start typing again, ensure hasDraft matches state conceptually
        if (nextData.name || nextData.email || nextData.phone || nextData.message) {
          setHasDraft(true);
        } else {
          setHasDraft(false);
          localStorage.removeItem(CONTACT_MEMORY_KEY);
        }
      } catch (e) {
        console.warn("Failed to save contact form draft", e);
      }
      
      return nextData;
    });
  };

  const clearMemory = () => {
    setFormData({ name: '', email: '', phone: '', message: '' });
    setHasDraft(false);
    try {
      localStorage.removeItem(CONTACT_MEMORY_KEY);
    } catch (e) {}
  };
  
  const validate = () => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const isValid = formData.name.trim() !== '' && isEmailValid && formData.message.trim() !== '';
    return isValid;
  };

  return {
    formData,
    updateFormData,
    hasDraft,
    isReady,
    clearMemory,
    isValid: validate(),
    isEmailValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  };
};
