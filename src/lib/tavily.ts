import { Developer, SearchQuery, Repository } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export class TavilyService {
  private apiKey: string;
  private baseUrl = 'https://api.tavily.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchDevelopers(searchQuery: SearchQuery): Promise<Developer[]> {
    const query = this.buildSearchQuery(searchQuery);
    
    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          query,
          search_depth: 'advanced',
          include_domains: ['github.com'],
          max_results: searchQuery.maxResults || 10,
        }),
      });

      if (!response.ok) {
        throw new Error(`Tavily API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseDevelopersFromResults(data.results);
    } catch (error) {
      console.error('Error searching developers:', error);
      throw error;
    }
  }

  private buildSearchQuery(searchQuery: SearchQuery): string {
    let query = `site:github.com ${searchQuery.query}`;
    
    if (searchQuery.location) {
      query += ` location:"${searchQuery.location}"`;
    }
    
    if (searchQuery.languages && searchQuery.languages.length > 0) {
      query += ` ${searchQuery.languages.map(lang => `language:${lang}`).join(' OR ')}`;
    }
    
    if (searchQuery.minFollowers) {
      query += ` followers:>=${searchQuery.minFollowers}`;
    }

    return query;
  }

  private parseDevelopersFromResults(results: Record<string, unknown>[]): Developer[] {
    const developers: Developer[] = [];

    for (const result of results) {
      try {
        const developer = this.parseGitHubProfile(result);
        if (developer) {
          developers.push(developer);
        }
      } catch (error) {
        console.warn('Error parsing developer from result:', error);
      }
    }

    return developers;
  }

  private parseGitHubProfile(result: Record<string, unknown>): Developer | null {
    const url = result.url as string;
    const content = (result.content as string) || '';
    const title = (result.title as string) || '';

    // Extract GitHub username from URL
    const githubMatch = url.match(/github\.com\/([^\/\?]+)/);
    if (!githubMatch) return null;

    const githubUsername = githubMatch[1];
    
    // Skip organization pages and special GitHub pages
    if (['orgs', 'topics', 'collections', 'marketplace'].includes(githubUsername)) {
      return null;
    }

    // Extract information from content and title
    const name = this.extractName(title, content) || githubUsername;
    const location = this.extractLocation(content);
    const bio = this.extractBio(content);
    const languages = this.extractLanguages(content);
    const repositories = this.extractRepositories(content);
    const stats = this.extractStats(content);

    return {
      id: uuidv4(),
      name,
      githubUsername,
      location: location || undefined,
      bio: bio || undefined,
      languages,
      repositories,
      profileUrl: `https://github.com/${githubUsername}`,
      avatarUrl: `https://github.com/${githubUsername}.png`,
      followers: stats.followers,
      following: stats.following,
      publicRepos: stats.publicRepos,
      company: this.extractCompany(content) || undefined,
      blog: this.extractBlog(content) || undefined,
      email: this.extractEmail(content) || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private extractName(title: string, content: string): string | null {
    // Try to extract name from title
    const titleMatch = title.match(/^([^·]+)·/);
    if (titleMatch) return titleMatch[1].trim();

    // Try to extract from content
    const nameMatch = content.match(/name[:\s]+([^\n\r,]+)/i);
    if (nameMatch) return nameMatch[1].trim();

    return null;
  }

  private extractLocation(content: string): string | null {
    const locationMatch = content.match(/location[:\s]+([^\n\r,]+)/i);
    return locationMatch ? locationMatch[1].trim() : null;
  }

  private extractBio(content: string): string | null {
    const bioMatch = content.match(/bio[:\s]+([^\n\r]+)/i);
    return bioMatch ? bioMatch[1].trim() : null;
  }

  private extractLanguages(content: string): string[] {
    const languages = new Set<string>();
    const commonLanguages = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'C#',
      'PHP', 'Ruby', 'Swift', 'Kotlin', 'React', 'Vue', 'Angular', 'Node.js'
    ];

    commonLanguages.forEach(lang => {
      if (content.toLowerCase().includes(lang.toLowerCase())) {
        languages.add(lang);
      }
    });

    return Array.from(languages);
  }

  private extractRepositories(content: string): Repository[] {
    const repos: Repository[] = [];
    
    // This is a simplified extraction - in a real implementation,
    // you might want to make additional API calls to get repository details
    const repoMatches = content.match(/repository[:\s]+([^\n\r]+)/gi) || [];
    
    repoMatches.slice(0, 5).forEach(match => {
      const repoName = match.replace(/repository[:\s]+/i, '').trim();
      if (repoName) {
        repos.push({
          name: repoName,
          description: '',
          language: '',
          stars: 0,
          forks: 0,
          url: '',
          lastUpdated: new Date().toISOString(),
        });
      }
    });

    return repos;
  }

  private extractStats(content: string): {
    followers?: number;
    following?: number;
    publicRepos?: number;
  } {
    const followersMatch = content.match(/(\d+)\s+followers?/i);
    const followingMatch = content.match(/(\d+)\s+following/i);
    const reposMatch = content.match(/(\d+)\s+repositories?/i);

    return {
      followers: followersMatch ? parseInt(followersMatch[1]) : undefined,
      following: followingMatch ? parseInt(followingMatch[1]) : undefined,
      publicRepos: reposMatch ? parseInt(reposMatch[1]) : undefined,
    };
  }

  private extractCompany(content: string): string | null {
    const companyMatch = content.match(/company[:\s]+([^\n\r,]+)/i);
    return companyMatch ? companyMatch[1].trim() : null;
  }

  private extractBlog(content: string): string | null {
    const blogMatch = content.match(/blog[:\s]+(https?:\/\/[^\s\n\r]+)/i);
    return blogMatch ? blogMatch[1].trim() : null;
  }

  private extractEmail(content: string): string | null {
    const emailMatch = content.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    return emailMatch ? emailMatch[1] : null;
  }
}