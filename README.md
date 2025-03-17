# Contest Tracker

A Next.js application with TypeScript and Material-UI that displays upcoming and past programming contests from CodeChef, LeetCode, and CodeForces. Features include platform filtering, responsive design, and light/dark mode support.

## Features

- **Upcoming Contests Page**
  - Displays upcoming contests from multiple platforms
  - Filter by platform (All, CodeChef, LeetCode, CodeForces)
  - Bookmark upcoming contests in the page
  - Responsive grid layout

- **Past Contests Page**
  - Shows past contests with platform, year, and month filters
  - Includes solution video links when available
  - Consistent card sizing

- **General Features**
  - Light/Dark mode toggle
  - Responsive design (1-3 columns based on screen size)
  - Consistent link styling
  - TypeScript type safety

## Production Application
[Live Website](https://cpcontests.vercel.app/)

## Prerequisites

- Node.js (v16 or higher recommended)
- A running backend server at `http://localhost:5000` providing the contest APIs

## Installation

1. Clone the repository:
```bash
git clone https://github.com/unniznd/contest-tracker
cd contest-tracker
```
2. Add the ```.env``` in ```backend```

```.env```
```
YOUTUBE_API_KEY=<add_youtube_api_key>
```

3. Run the backend server


```
cd backend
yarn install
yarn dev
```

4. Add the ```.env``` in ```frontend```

```.env.local```
```
NEXT_PUBLIC_BACKEND_URL=<add_your_backend_url>
```

5. Run the frontend server
```
cd frontend
yarn install
yarn run dev
```

## Frontend Project Structure
```
frontend/
├── components/
│   ├── ContestCard.tsx     # Contest display component
│   ├── Navbar.tsx         # Navigation bar with theme toggle
│   └── ThemeToggle.tsx    # Light/dark mode toggle button
├── lib/
│   └── theme.ts          # Theme configurations
├── pages/
│   ├── _app.tsx          # App wrapper with theme provider
│   ├── index.tsx         # Upcoming contests page
│   └── past.tsx          # Past contests page
├── types/
│   └── contest.ts        # Contest interface definitions
├── package.json
└── .... (other necessary files)
```

## Backend API End Points

### Upcoming Contests 
#### GET /api/upcoming/
* Description: Retrieves all upcoming contests across all platforms
* Response: Array of contest objects
* Example:
```
GET /api/upcoming
```
```
[
  {
    "platform": "codeforces",
    "title": "Codeforces Beta Round 84 (Div. 1 Only)",
    "startTime": 1314633600000,
    "duration": 7200000,
    "endTime": 1314640800000,
    "url": "https://codeforces.com/contest/109"
  }
]
```

#### GET /api/upcoming/{platform}
* Description: Retrieves upcoming contests for a specific platform
* Parameters:
    * platform: "codechef", "leetcode", or "codeforces"
* Response: Array of contest objects
* Example:
```
GET /api/upcoming/codeforces
```
```
[
  {
    "platform": "codeforces",
    "title": "Codeforces Beta Round 84 (Div. 1 Only)",
    "startTime": 1314633600000,
    "duration": 7200000,
    "endTime": 1314640800000,
    "url": "https://codeforces.com/contest/109"
  }
]
```

### Past Contests
#### GET /api/past/:year/:month/
* Description: Retrieves all past contests for a given year and month across all platforms
* Parameters:
    * year: Four-digit year (e.g., 2025)
    * month: Month number (1-12)
* Response: Array of contest objects with solution links
* Example:
```
GET /api/past/2025/1/
```
```
[
  {
    "platform": "codechef",
    "title": "Starters 167 (Rated till 5 stars)",
    "startTime": 1735741800000,
    "duration": 7200000,
    "endTime": 1735749000000,
    "url": "https://www.codechef.com/START167",
    "solution": "https://www.youtube.com/watch?v=pInxi3mnmSc"
  }
]

```

#### GET /api/past/:platform/:year/:month/
* Description: Retrieves past contests for a specific platform, year, and month
* Parameters:
* platform: "codechef", "leetcode", or "codeforces"
    * year: Four-digit year (e.g., 2025)
    * month: Month number (1-12)
* Response: Array of contest objects with solution links
* Example:
```
GET /api/past/codechef/2025/1/
```
```
[
  {
    "platform": "codechef",
    "title": "Starters 167 (Rated till 5 stars)",
    "startTime": 1735741800000,
    "duration": 7200000,
    "endTime": 1735749000000,
    "url": "https://www.codechef.com/START167",
    "solution": "https://www.youtube.com/watch?v=pInxi3mnmSc"
  }
]
```

