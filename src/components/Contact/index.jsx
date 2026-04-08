'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { submitContactForm } from '@/app/actions/contact';
import { ContactInfoCard } from '@/components/common/ContactInfoCard';
import styles from './Contact.module.scss';
import { contactLinks } from '@/data/contact';
import { useContactFormMemory } from '@/customhook/useContactFormMemory';

export const Contact = () => {
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  
  const { formData, updateFormData, hasDraft, isReady: contactReady, clearMemory, isValid, isEmailValid } = useContactFormMemory();
  const [emailTouched, setEmailTouched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      // Create FormData from controlled inputs
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('message', formData.message);

      const result = await submitContactForm(data);

      if (result.success) {
        showToast(result.message, 'success');
        clearMemory();
        setEmailTouched(false);
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData(name, value);
  };

  return (
    <section className={styles.contact} id="contact">
      <h2 className={styles.heading}>
        <i className="fas fa-headset" aria-hidden="true"></i> Let&apos;s Build <span>Together</span>
      </h2>

      <div className={styles.container}>
        {/* ── Left Info Panel ── */}
        <div className={styles.infoPanel}>
          <div className={styles.infoTitle}>
              <h3>Turn ideas into reality</h3>
            <p>
              Have a project in mind or want to collaborate? <br/>Let’s connect and bring your ideas to life.
            </p>
          </div>

          <div className={styles.cardScrollWrapper}>
            <div className={styles.infoItems}>
              {contactLinks.map((link, i) => (
                <ContactInfoCard key={i} {...link} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Form Panel ── */}
        <div className={styles.formPanel}>
          {/* Smart Resume UI */}
          {contactReady && hasDraft && (
            <div style={{
              background: 'var(--surface-light)',
              border: '1px solid var(--border-color)',
              padding: '8px 12px',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              fontSize: '0.85rem'
            }}>
              <span style={{color: 'var(--text-secondary)'}}>
                <i className="fas fa-edit"></i> Draft saved. Continue where you left off?
              </span>
              <button 
                onClick={(e) => { e.preventDefault(); clearMemory(); setEmailTouched(false); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Clear
              </button>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <div className={styles.field}>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Your Name" 
                  required 
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <i className="fas fa-user" aria-hidden="true"></i>
              </div>
              <div className={styles.field}>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Your Email" 
                  required 
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={() => setEmailTouched(true)}
                  className={emailTouched && !isEmailValid ? styles.invalid : ''}
                />
                <i className="fas fa-envelope" aria-hidden="true"></i>
                {emailTouched && !isEmailValid && (
                  <span className={styles.errorMsg}>
                    <i className="fas fa-exclamation-circle"></i> Please enter a valid email address
                  </span>
                )}
              </div>
              <div className={styles.field}>
                <input 
                  type="text" 
                  name="phone" 
                  placeholder="Phone (optional)" 
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <i className="fas fa-phone-alt" aria-hidden="true"></i>
              </div>
              <div className={styles.field}>
                <textarea 
                  name="message" 
                  placeholder="Your Message" 
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                ></textarea>
                <i className="fas fa-comment-dots" aria-hidden="true"></i>
              </div>
            </div>

            <div className={styles.buttonArea}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting || (contactReady && !isValid)}
                style={{
                  opacity: (contactReady && !isValid) ? 0.6 : 1,
                  cursor: (contactReady && !isValid) ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span> Sending...
                  </>
                ) : (
                  <>
                    Send Message <i className="fa fa-paper-plane" aria-hidden="true"></i>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
