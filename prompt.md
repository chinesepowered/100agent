Hackathon project with Tavily, Appwrite, and Copilotkit as sponsors. Make entire project for me with impressive UI design.

# IntelliCrawl Recruiter - AI Talent Discovery Tool

## Project Goal
Build a web app that finds developers on GitHub using Tavily, stores them in Appwrite, and has an AI chat assistant with CopilotKit. Target the 100 Agents hackathon prizes: Tavily ($1000), CopilotKit ($1000), Appwrite Open Source ($1000).

## What to Build
A single-page web application with 3 main features:

### 1. Developer Search (Using Tavily)
- Simple search form: "Find Python developers in San Francisco" 
- Use Tavily API to search GitHub profiles and extract:
  - Name, GitHub username, location
  - Programming languages used
  - Recent projects and repositories
  - Contact info if available

### 2. Candidate Database (Using Appwrite)
- Store found developers in Appwrite database
- Simple table view of all discovered candidates
- Basic filters: programming language, location, experience level
- Save/bookmark interesting candidates

### 3. AI Recruiting Assistant (Using CopilotKit)
- Chat interface that helps with:
  - "Search for React developers in NYC"
  - "Generate an outreach email for this candidate"
  - "What skills does this developer have?"
  - "Find similar developers to this one"

## MVP Features (Keep It Simple)

### Core Functionality
1. **Search Page**: Text input + search button
2. **Results Page**: Simple cards showing developer profiles
3. **Chat Assistant**: CopilotKit chat bubble in corner
4. **Save/View**: Basic candidate management

### API Keys Setup
- I'll provide all API keys in .env file later:
  - `TAVILY_API_KEY`
  - `APPWRITE_PROJECT_ID`
  - `APPWRITE_API_KEY`
  - `GROQ_API_KEY` (for CopilotKit with GroqAdapter)

## Development Instructions
- Use Next.js 14+ with App Router for quick setup (I'll deploy to Vercel so disable vercel linting)
- Next.js App Router works perfectly with all three technologies:
  - **CopilotKit**: Has React components that work in App Router
  - **Appwrite**: Has Node.js SDK for server-side API routes
  - **Tavily**: REST API works in Next.js API routes
  - **Vercel**: Native Next.js deployment platform
- Keep UI simple with Tailwind CSS - focus on functionality over design
- Make sure all 3 sponsor technologies are clearly demonstrated
- Include README with setup instructions for open source prize

## Success Metrics
- **Tavily Prize**: Show innovative use of web crawling for talent discovery
- **CopilotKit Prize**: Create useful AI assistant for recruiters
- **Appwrite Prize**: Open source with good documentation
- **Overall**: Solve real recruiting problem with working demo