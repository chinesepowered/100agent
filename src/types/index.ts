export interface Developer {
  id: string;
  name: string;
  githubUsername: string;
  location?: string;
  bio?: string;
  languages: string[];
  repositories: Repository[];
  profileUrl: string;
  avatarUrl?: string;
  followers?: number;
  following?: number;
  publicRepos?: number;
  company?: string;
  blog?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Repository {
  name: string;
  description?: string;
  language?: string;
  stars: number;
  forks: number;
  url: string;
  lastUpdated: string;
}

export interface SearchQuery {
  query: string;
  location?: string;
  languages?: string[];
  minFollowers?: number;
  maxResults?: number;
}

export interface SearchResult {
  developers: Developer[];
  totalFound: number;
  searchQuery: string;
  timestamp: string;
}