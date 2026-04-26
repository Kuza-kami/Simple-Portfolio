export interface TimelineEvent {
  id?: number;
  year: string;
  completionDate: string;
  title: string;
  desc: string;
  extendedDesc: string;
  image: string;
  origin?: string;
  isVerified?: boolean;
  showCertificate?: boolean;
  certTitle?: string;
  certInfo?: string;
}

export interface ProjectProcessStep {
  image: string;
  description: string;
  size?: string;
  date?: string;
  medium?: string;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
  images?: string[];
  process?: ProjectProcessStep[];
  description: string;
  extendedDescription?: string;
  downloadUrl?: string;
  challenge?: string;
  solution?: string;
  technologies?: string[];
  size?: string;
  medium?: string;
}
