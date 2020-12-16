import { useState, useEffect, useCallback } from 'react';
import { IProject } from '../interfaces/shared-interfaces';

let logoutTimer: NodeJS.Timeout;

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpiration, setTokenExpirationDate] = useState<Date | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [allProjects, setAllProjects] = useState<IProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const login = useCallback((uid: string, token: string, projects: IProject[], expirationDate?: Date) => {
    setToken(token);
    const tokenExpiration = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpiration);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        projects: projects,
        expiration: tokenExpiration.toISOString()
      })
    );
    setAllProjects(projects);
    setUserId(uid);
  },[]);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setAllProjects([]);
    setSelectedProject(null);
    localStorage.removeItem('userData');
  }, [])

  const selectProject = useCallback((project: IProject) => {
    setSelectedProject(project);
    let storedData;
    const storageData = localStorage.getItem('userData');
    if (storageData) {
      storedData = JSON.parse(storageData);
    }
    storedData['project'] = project
    localStorage.setItem('userData', JSON.stringify(storedData));
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
      login(storedData.userId, storedData.token, storedData.projects, new Date(storedData.expiration));
      selectProject(storedData.project)
    }
  },[login])

  return { login, logout, token, userId, allProjects, selectProject, selectedProject }
}