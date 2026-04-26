import { Project } from '../types';

export const moreProjects: Project[] = [];

export const getProjectDetails = (project: Project) => {
  return {
    measurement: project.size || 'Unknown',
    concept: project.challenge ? 'Problem/Solution' : 'Creative Concept',
    media: project.medium || project.category || 'Digital'
  };
};
