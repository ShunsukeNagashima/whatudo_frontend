import { createContext } from 'react';
import { IProject } from '../interfaces/shared-interfaces';

interface IProjectContext  {
  selectedProject: IProject | null,
  selectProject: (project: IProject) => void;
  allProjects: IProject[]
}

export const ProjectContext = createContext<IProjectContext>({
  selectedProject: null,
  selectProject: () => {},
  allProjects: [],
})