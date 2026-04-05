'use client';

import React, { useRef, useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { submitContactForm } from '@/app/actions/contact';
import { ContactInfoCard } from '@/components/common/ContactInfoCard';
import styles from './Contact.module.scss';
import { contactLinks } from '@/data/contact';

export const Contact = () => {
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(formRef.current);
      const result = await submitContactForm(formData);

      if (result.success) {
        showToast(result.message, 'success');
        formRef.current.reset();
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
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

          <div className={styles.infoItems}>
            {contactLinks.map((link, i) => (
              <ContactInfoCard key={i} {...link} />
            ))}
          </div>
        </div>

        {/* ── Right Form Panel ── */}
        <div className={styles.formPanel}>
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <div className={styles.field}>
                <input type="text" name="name" placeholder="Your Name" required />
                <i className="fas fa-user" aria-hidden="true"></i>
              </div>
              <div className={styles.field}>
                <input type="email" name="email" placeholder="Your Email" required />
                <i className="fas fa-envelope" aria-hidden="true"></i>
              </div>
              <div className={styles.field}>
                <input type="text" name="phone" placeholder="Phone (optional)" />
                <i className="fas fa-phone-alt" aria-hidden="true"></i>
              </div>
              <div className={styles.field}>
                <textarea name="message" placeholder="Your Message" required></textarea>
                <i className="fas fa-comment-dots" aria-hidden="true"></i>
              </div>
            </div>

            <div className={styles.buttonArea}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
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
