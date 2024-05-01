'use client';

import React from 'react';
import styles from './style.module.css';

export default function LoginPage() {
  return (
    <div className={styles.loginBody}>
      <div className={styles.loginContainer}>
        <h2>Login</h2>
        <div className={styles.inputGroup}>
          <input type="text" placeholder="Username" required />
        </div>
        <div className={styles.inputGroup}>
          <input type="password" placeholder="Password" required />
        </div>
        <button className={styles.btn}>Login</button>
      </div>
    </div>
  );
}
