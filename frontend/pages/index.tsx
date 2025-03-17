import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import { Grid2, CircularProgress, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import ContestCard from '../components/ContestCard';
import { Contest } from '../types/contest';

interface RawContest {
  platform: 'codechef' | 'leetcode' | 'codeforces';
  title: string;
  startTime: number;
  duration: number;
  endTime: number;
  url: string;
}

export default function Home() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true);
      setError(null);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      try {
        const url = platformFilter === 'all' 
          ? `${backendUrl}/api/upcoming/`
          : `${backendUrl}/api/upcoming/${platformFilter}`;
        
        const response = await axios.get<RawContest[]>(url);

        const convertedContests: Contest[] = response.data.map(contest => ({
          platform: contest.platform,
          title: contest.title,
          startTime: new Date(contest.startTime),
          endTime: new Date(contest.endTime),
          url: contest.url
        }));

        setContests(convertedContests);
      } catch (error) {
        console.error('Error fetching contests:', error);
        setError('Failed to fetch contests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [platformFilter]);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Upcoming Contests
        </Typography>
        <FormControl sx={{ minWidth: 120, mr: 2, mb: 4 }}>
          <InputLabel>Platform</InputLabel>
          <Select
            value={platformFilter}
            label="Platform"
            onChange={(e) => setPlatformFilter(e.target.value as string)}
          >
            <MenuItem value="all">All Platforms</MenuItem>
            <MenuItem value="codechef">CodeChef</MenuItem>
            <MenuItem value="leetcode">LeetCode</MenuItem>
            <MenuItem value="codeforces">CodeForces</MenuItem>
          </Select>
        </FormControl>

        {/* Loading state */}
        {loading && (
          <Container sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading upcoming contests...
          </Typography>
        </Container>
        )}

        {/* Error state */}
        {error && (
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        )}

        {/* No contests available */}
        {!loading && !error && contests.length === 0 && (
          <Typography textAlign="center">
            No contests available for the selected platform.
          </Typography>
        )}

        {/* Contests List */}
        {!loading && !error && contests.length > 0 && (
          <Grid2 container spacing={2}>
            {contests.map((contest, index) => (
              <Grid2  key={index}>
                <ContestCard contest={contest} />
              </Grid2>
            ))}
          </Grid2>
        )}
      </Container>
    </>
  );
}
