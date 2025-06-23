import { NextRequest, NextResponse } from 'next/server';
import { TavilyService } from '@/lib/tavily';
import { SearchQuery } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, location, languages, minFollowers, maxResults } = body as SearchQuery;

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const tavilyApiKey = process.env.TAVILY_API_KEY;
    if (!tavilyApiKey) {
      return NextResponse.json(
        { error: 'Tavily API key not configured' },
        { status: 500 }
      );
    }

    const tavilyService = new TavilyService(tavilyApiKey);
    const developers = await tavilyService.searchDevelopers({
      query,
      location,
      languages,
      minFollowers,
      maxResults,
    });

    return NextResponse.json({
      developers,
      totalFound: developers.length,
      searchQuery: query,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search developers' },
      { status: 500 }
    );
  }
}