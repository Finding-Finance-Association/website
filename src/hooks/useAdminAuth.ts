"use client";

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { checkAdminStatus, setAuthCookie, clearAuthCookie, AdminUser, getAdminUser } from '@/lib/admin-auth';

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setError(null);
      
      try {
        setUser(firebaseUser);
        
        if (firebaseUser) {
          // Set auth cookie for middleware
          await setAuthCookie();
          
          // Check admin status
          const adminStatus = await checkAdminStatus(firebaseUser);
          setIsAdmin(adminStatus);
          
          if (adminStatus) {
            const adminUserData = await getAdminUser(firebaseUser);
            setAdminUser(adminUserData);
          } else {
            setAdminUser(null);
          }
        } else {
          // Clear auth cookie
          clearAuthCookie();
          setIsAdmin(false);
          setAdminUser(null);
        }
      } catch (err) {
        console.error('Admin auth error:', err);
        setError('Failed to verify admin status');
        setIsAdmin(false);
        setAdminUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    adminUser,
    isAdmin,
    loading,
    error,
  };
}
