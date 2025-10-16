export interface Project {
  _id: string;
  title: string;
  description: string;
  deadline?: string;
  requiredSkills?: string[];
  category?: string;
  teamSize: number;
  owner: {
    _id: string;
    name?: string;
    email?: string;
  } | string;
  teamMembers: Array<string | { _id: string; name?: string; email?: string }>;
  collaborationActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  githubRepo?: string;
  techStack?: string[];
}
