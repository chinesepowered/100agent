# IntelliCrawl Recruiter 🤖

> **AI-Powered GitHub Developer Discovery Platform**

Built for the **100 Agents Hackathon** featuring **Tavily**, **Appwrite**, and **CopilotKit** integrations.

## 🏆 Hackathon Prizes Targeted

- **🥇 Tavily Prize ($1000)** - Advanced web crawling for GitHub developer discovery
- **🥇 CopilotKit Prize ($1000)** - Intelligent AI recruiting assistant
- **🥇 Appwrite Open Source Prize ($1000)** - Complete open-source recruiting platform

## ✨ Features

### 🔍 Smart Developer Search (Tavily Integration)
- AI-powered GitHub profile discovery
- Advanced search filters (location, languages, followers)
- Real-time web crawling and data extraction
- Comprehensive developer profiles with repositories

### 🗄️ Candidate Management (Appwrite Integration)
- Persistent developer database storage
- Advanced filtering and search capabilities
- CSV export functionality
- Candidate relationship management

### 🤖 AI Recruiting Assistant (CopilotKit Integration)
- Intelligent chat interface for recruiting tasks
- Automated developer search and discovery
- Personalized outreach email generation
- Natural language interaction for candidate management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- API keys for Tavily, Appwrite, and Groq

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/intellicrawl-recruiter.git
   cd intellicrawl-recruiter
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure your API keys in `.env.local`**
   ```env
   # Tavily API for web search
   TAVILY_API_KEY=your_tavily_api_key_here

   # Appwrite configuration
   APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   APPWRITE_PROJECT_ID=your_appwrite_project_id_here
   APPWRITE_DATABASE_ID=your_database_id_here
   APPWRITE_COLLECTION_ID=your_collection_id_here
   APPWRITE_API_KEY=your_appwrite_api_key_here

   # Groq API for CopilotKit
   GROQ_API_KEY=your_groq_api_key_here
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🔧 API Setup Guide

### Tavily API
1. Visit [Tavily.com](https://tavily.com)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add to `.env.local` as `TAVILY_API_KEY`

### Appwrite Setup
1. Create account at [Appwrite Cloud](https://cloud.appwrite.io)
2. Create new project
3. Create database and collection with these attributes:
   - `name` (string)
   - `githubUsername` (string)
   - `location` (string, optional)
   - `bio` (string, optional)
   - `languages` (string)
   - `repositories` (string)
   - `profileUrl` (string)
   - `avatarUrl` (string, optional)
   - `followers` (integer, optional)
   - `following` (integer, optional)
   - `publicRepos` (integer, optional)
   - `company` (string, optional)
   - `blog` (string, optional)
   - `email` (string, optional)
4. Get API key and add configuration to `.env.local`

### Groq API (for CopilotKit)
1. Visit [Groq Cloud](https://console.groq.com)
2. Create account and get API key
3. Add to `.env.local` as `GROQ_API_KEY`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── search/        # Tavily search integration
│   │   └── copilotkit/    # CopilotKit AI assistant
│   ├── candidates/        # Candidate management page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── SearchForm.tsx     # Developer search form
│   └── DeveloperCard.tsx  # Developer profile card
├── lib/                   # Utility libraries
│   ├── appwrite.ts       # Appwrite database functions
│   └── tavily.ts         # Tavily search service
└── types/                # TypeScript definitions
    └── index.ts          # Shared types
```

## 🎯 How It Works

1. **Search Phase**: User enters search criteria (e.g., "Python developers in San Francisco")
2. **Discovery Phase**: Tavily API crawls GitHub and extracts developer profiles
3. **Storage Phase**: Relevant candidates are saved to Appwrite database
4. **Management Phase**: Users can filter, export, and manage saved candidates
5. **Outreach Phase**: CopilotKit AI generates personalized recruitment emails

## 🤖 AI Assistant Capabilities

The CopilotKit integration provides:

- **Natural Language Search**: "Find React developers in NYC with 100+ followers"
- **Intelligent Filtering**: "Show me Python developers from the last search"
- **Email Generation**: "Write an outreach email for John Doe"
- **Data Insights**: "What are the most common skills in my candidates?"

## 🌟 Key Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Search**: Instant results from GitHub via Tavily
- **Persistent Storage**: Candidates saved permanently in Appwrite
- **Export Functionality**: Download candidate data as CSV
- **AI-Powered**: Intelligent search and email generation
- **Dark Mode**: Automatic theme switching

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS
- **Search**: Tavily API for web crawling
- **Database**: Appwrite for data storage
- **AI**: CopilotKit with Groq LLM
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React

## 🔒 Security & Privacy

- All API keys stored securely in environment variables
- No sensitive data stored in client-side code
- Appwrite handles secure database operations
- HTTPS-only communication with all APIs

## 📊 Performance

- Optimized for fast search results
- Lazy loading for better user experience
- Efficient database queries
- Responsive UI with smooth animations

## 🤝 Contributing

This is an open-source project built for the hackathon. Feel free to:

1. Fork the repository
2. Create feature branches
3. Submit pull requests
4. Report issues
5. Suggest improvements

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- **Tavily** for powerful web search capabilities
- **Appwrite** for excellent database services
- **CopilotKit** for AI integration framework
- **100 Agents Hackathon** for the inspiration

## 📧 Contact

For questions or support, please open an issue or contact the development team.

---

**Built with ❤️ for the 100 Agents Hackathon**