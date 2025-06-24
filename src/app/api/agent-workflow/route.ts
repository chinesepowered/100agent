import { NextRequest, NextResponse } from 'next/server';
import { Developer } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { type, developer } = await request.json() as { 
      type: 'email' | 'analyze' | 'similar'; 
      developer: Developer 
    };

    let result = '';

    if (!process.env.GROQ_API_KEY) {
      // Fallback to template-based responses for demo purposes
      result = await getFallbackResponse(type, developer);
      return NextResponse.json({ result });
    }

    switch (type) {
      case 'email':
        result = await generateRecruitmentEmail(developer);
        break;
      case 'analyze':
        result = await analyzeProfile(developer);
        break;
      case 'similar':
        result = await findSimilarDevelopers(developer);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid agent type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Agent workflow error:', error);
    return NextResponse.json(
      { error: 'Failed to execute agent workflow' },
      { status: 500 }
    );
  }
}

async function generateRecruitmentEmail(developer: Developer): Promise<string> {
  const prompt = `You are an expert recruitment email writer. Generate a personalized, professional recruitment email for the following developer:

Name: ${developer.name}
GitHub: @${developer.githubUsername}
Location: ${developer.location || 'Not specified'}
Languages: ${developer.languages.join(', ')}
Company: ${developer.company || 'Not specified'}
Bio: ${developer.bio || 'Not provided'}

Write a compelling recruitment email that:
1. Is personalized and mentions specific skills/projects
2. Is professional but friendly
3. Clearly states we're interested in their skills
4. Includes a clear call-to-action
5. Is concise (under 200 words)
6. Uses their actual name and specific technologies they use

Return only the email content, including subject line.`;

  return await callLLM(prompt);
}

async function analyzeProfile(developer: Developer): Promise<string> {
  const prompt = `You are an expert technical recruiter and developer profile analyst. Analyze this developer's profile and provide insights:

Name: ${developer.name}
GitHub: @${developer.githubUsername}
Location: ${developer.location || 'Not specified'}
Languages: ${developer.languages.join(', ')}
Followers: ${developer.followers || 'Not specified'}
Public Repos: ${developer.publicRepos || 'Not specified'}
Company: ${developer.company || 'Not specified'}
Bio: ${developer.bio || 'Not provided'}

Provide a detailed analysis including:

🎯 **TECHNICAL ASSESSMENT**
- Primary expertise areas
- Technology stack depth
- Notable strengths

📊 **EXPERIENCE LEVEL**
- Estimated seniority level
- Open source involvement
- Community engagement

💼 **CAREER INSIGHTS** 
- Current role/company fit
- Potential career interests
- Ideal team/project types

🚀 **RECRUITMENT STRATEGY**
- Best approach for outreach
- Key selling points to emphasize
- Potential concerns to address

Keep analysis under 300 words but detailed and actionable.`;

  return await callLLM(prompt);
}

async function findSimilarDevelopers(developer: Developer): Promise<string> {
  const prompt = `You are an expert at identifying developer talent patterns. Based on this developer's profile, suggest what to look for in similar candidates:

Name: ${developer.name}
GitHub: @${developer.githubUsername}
Languages: ${developer.languages.join(', ')}
Location: ${developer.location || 'Not specified'}
Company: ${developer.company || 'Not specified'}
Bio: ${developer.bio || 'Not provided'}

Generate a comprehensive search strategy for finding similar developers:

🔍 **SEARCH KEYWORDS**
- Primary programming languages to target
- Framework/technology combinations
- Industry/domain keywords

📍 **LOCATION STRATEGY**
- Geographic regions to focus on
- Remote work considerations
- Time zone preferences

🏢 **COMPANY TYPES**
- Similar company sizes/types
- Industry sectors to target
- Career stage indicators

💡 **PROFILE PATTERNS**
- GitHub activity patterns to look for
- Portfolio/project indicators
- Community involvement signs

🎯 **SEARCH QUERIES**
- Specific search strings for GitHub
- LinkedIn search parameters
- Additional platform recommendations

Provide actionable search strategy under 250 words.`;

  return await callLLM(prompt);
}

async function getFallbackResponse(type: 'email' | 'analyze' | 'similar', developer: Developer): Promise<string> {
  switch (type) {
    case 'email':
      return `Subject: Exciting Opportunity for ${developer.name}

Hi ${developer.name},

I came across your GitHub profile (@${developer.githubUsername}) and was impressed by your expertise in ${developer.languages.slice(0, 2).join(' and ')}.

We're currently looking for talented developers to join our team, and your background in ${developer.languages.join(', ')} caught our attention.

Would you be interested in learning more about this opportunity? I'd love to schedule a brief call to discuss how your skills could contribute to our innovative projects.

Looking forward to hearing from you!

Best regards,
[Your Name]
[Your Company]

---
✨ Generated by IntelliCrawl AI Agent (Demo Mode)`;

    case 'analyze':
      return `🎯 **TECHNICAL ASSESSMENT**
Primary expertise: ${developer.languages.slice(0, 3).join(', ')}
${developer.location ? `Location: ${developer.location}` : ''}
${developer.company ? `Current company: ${developer.company}` : ''}

📊 **EXPERIENCE LEVEL**
${developer.publicRepos ? `Public repositories: ${developer.publicRepos}` : ''}
${developer.followers ? `GitHub followers: ${developer.followers}` : ''}
Community engagement: Active open source contributor

💼 **CAREER INSIGHTS**
${developer.bio || 'Profile suggests strong technical background'}
Interested in: Modern development practices
Ideal for: Teams working with ${developer.languages.slice(0, 2).join(' and ')}

🚀 **RECRUITMENT STRATEGY**
Approach: Technical expertise focus
Selling points: ${developer.languages.join(', ')} opportunities
Consider: Remote work options, technical challenges

---
✨ Generated by IntelliCrawl AI Agent (Demo Mode)`;

    case 'similar':
      return `🔍 **SEARCH KEYWORDS**
Languages: ${developer.languages.join(', ')}
Technologies: Modern frameworks, cloud platforms
${developer.location ? `Geographic focus: ${developer.location} area` : ''}

📍 **LOCATION STRATEGY**
${developer.location ? `Primary: ${developer.location}` : 'Focus: Major tech hubs'}
Consider: Remote-friendly candidates
Time zones: Compatible with team

🏢 **COMPANY TYPES**
${developer.company ? `Similar to: ${developer.company}` : 'Target: Tech companies, startups'}
Size: Mid-size to enterprise
Culture: Developer-focused environments

💡 **PROFILE PATTERNS**
GitHub activity: Regular commits, diverse projects
Portfolio indicators: ${developer.languages.join(', ')} projects
Community: Active in open source

🎯 **SEARCH QUERIES**
"${developer.languages.slice(0, 2).join(' ')} developer"
"${developer.languages[0]} engineer ${developer.location || ''}"
GitHub: "language:${developer.languages[0].toLowerCase()}"

---
✨ Generated by IntelliCrawl AI Agent (Demo Mode)`;

    default:
      return 'Agent response not available.';
  }
}

async function callLLM(prompt: string): Promise<string> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('LLM call failed:', error);
    // Fallback to template if LLM fails
    return 'AI service temporarily unavailable. Please try again later.';
  }
}