'use client';

import React, { useState } from 'react';
import styles from './style.module.css';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [loginId, setLoginId] = useState<string>('');
  const [loginPwd, setLoginPwd] = useState<string>('');
  const router = useRouter();

  const onLogin = async () => {
    const supabase = createClient();
    let { data: member, error } = await supabase
      .from('member')
      .select('member_id')
      .eq('id', loginId)
      .eq('password', loginPwd);
    if (member && member.length > 0) {
      router.push('/');
    }
  };

  return (
    <div className={styles.loginBody}>
      <div className={styles.loginContainer}>
        <h2>Login</h2>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Username"
            value={loginId}
            onChange={(event) => setLoginId(event.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Password"
            value={loginPwd}
            onChange={(event) => setLoginPwd(event.target.value)}
            required
          />
        </div>
        <button className={styles.btn} onClick={onLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
