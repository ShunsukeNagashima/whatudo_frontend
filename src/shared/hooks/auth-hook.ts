import { useState, useEffect, useCallback } from 'react';

let logoutTimer: NodeJS.Timeout;

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpiration, setTokenExpirationDate] = useState<Date | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const login = useCallback((uid: string, token: string, expirationDate?: Date) => {
    setToken(token);
    const tokenExpiration = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpiration);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpiration.toISOString()
      })
    );
    setUserId(uid);
  },[]);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem('userData');
  }, [])

  useEffect(() => {
    if(token && tokenExpiration) {
      const remainTime = tokenExpiration.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainTime)
    } else {
      clearTimeout(logoutTimer)
    }
  }, [token, logout, tokenExpiration])

  useEffect(() => {
    let storedData;
    const storageData = localStorage.getItem('userData');
    if (storageData) {
      storedData = JSON.parse(storageData);
    }
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration))
    }
  },[login])

  return { login, logout, token, userId }
}