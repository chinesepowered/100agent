import {
  CopilotRuntime,
  GroqAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import { NextRequest } from 'next/server';
import { TavilyService } from '@/lib/tavily';
import { getDevelopers, saveDeveloper } from '@/lib/appwrite';

const groqAdapter = new GroqAdapter({
  model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
});

const runtime = new CopilotRuntime({
  actions: [
    {
      name: 'searchDevelopers',
      description: 'Search for developers on GitHub using Tavily',
      parameters: [
        {
          name: 'query',
          type: 'string',
          description: 'Search query for developers (e.g., "Python developers", "React developers in San Francisco")',
          required: true,
        },
        {
          name: 'location',
          type: 'string',
          description: 'Location to filter developers (optional)',
          required: false,
        },
        {
          name: 'languages',
          type: 'string',
          description: 'Comma-separated programming languages (optional)',
          required: false,
        },
      ],
      handler: async ({ query, location, languages }: { query: string; location?: string; languages?: string }) => {
        const tavilyApiKey = process.env.TAVILY_API_KEY;
        if (!tavilyApiKey) {
          throw new Error('Tavily API key not configured');
        }

        const tavilyService = new TavilyService(tavilyApiKey);
        const languageArray = languages ? languages.split(',').map((l: string) => l.trim()) : undefined;
        
        const developers = await tavilyService.searchDevelopers({
          query,
          location,
          languages: languageArray,
          maxResults: 5,
        });

        // Save found developers to Appwrite
        for (const developer of developers) {
          try {
            await saveDeveloper(developer);
          } catch (error) {
            console.warn('Failed to save developer:', error);
          }
        }

        return {
          message: `Found ${developers.length} developers matching "${query}"`,
          developers: developers.map(dev => ({
            name: dev.name,
            githubUsername: dev.githubUsername,
            location: dev.location,
            languages: dev.languages,
            profileUrl: dev.profileUrl,
          })),
        };
      },
    },
    {
      name: 'getSavedDevelopers',
      description: 'Get all saved developers from the database',
      parameters: [],
      handler: async () => {
        const developers = await getDevelopers();
        return {
          message: `Found ${developers.length} saved developers`,
          developers: developers.map(dev => ({
            name: dev.name,
            githubUsername: dev.githubUsername,
            location: dev.location,
            languages: dev.languages,
            profileUrl: dev.profileUrl,
          })),
        };
      },
    },
    {
      name: 'generateOutreachEmail',
      description: 'Generate a personalized outreach email for a developer',
      parameters: [
        {
          name: 'developerName',
          type: 'string',
          description: 'Name of the developer',
          required: true,
        },
        {
          name: 'skills',
          type: 'string',
          description: 'Developer skills/languages',
          required: true,
        },
        {
          name: 'position',
          type: 'string',
          description: 'Position or role to recruit for',
          required: true,
        },
        {
          name: 'company',
          type: 'string',
          description: 'Your company name',
          required: true,
        },
      ],
      handler: async ({ developerName, skills, position, company }: { developerName: string; skills: string; position: string; company: string }) => {
        const email = `Subject: Exciting ${position} Opportunity at ${company}

Hi ${developerName},

I hope this message finds you well! I came across your GitHub profile and was impressed by your expertise in ${skills}.

We're currently looking for a talented ${position} to join our team at ${company}. Based on your background and projects, I believe you'd be a great fit for this role.

Would you be interested in learning more about this opportunity? I'd love to schedule a brief call to discuss how your skills in ${skills} could contribute to our innovative projects.

Looking forward to hearing from you!

Best regards,
[Your Name]
[Your Title]
${company}`;

        return {
          message: 'Generated personalized outreach email',
          email,
        };
      },
    },
  ],
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: groqAdapter,
    endpoint: '/api/copilotkit',
  });

  return handleRequest(req);
};