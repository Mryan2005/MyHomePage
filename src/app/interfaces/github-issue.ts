export interface GithubIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  body?: string;
  labels: {
    id: number;
    name: string;
    color: string;
  }[];
  user: {
    login: string;
    avatar_url: string;
  };
  pull_request?: unknown;
}
