import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import { Grid2 } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import PastContestCard from '@/components/PastContestCard';
import { Contest } from '@/types/contest';

interface RawContest {
  platform: 'codechef' | 'leetcode' | 'codeforces';
  title: string;
  startTime: number;
  duration: number;
  endTime: number;
  url: string;
  solution: string;
}

export default function PastContests() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<number>(1);
  const [yearFilter, setYearFilter] = useState<number>(2025);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPastContests = async () => {
      setLoading(true);
      setError(null);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      try {
        const url =
          platformFilter === 'all'
            ? `${backendUrl}/api/past/${yearFilter}/${monthFilter}/`
            : `${backendUrl}/api/past/${platformFilter}/${yearFilter}/${monthFilter}/`;

        const response = await axios.get<RawContest[]>(url);

        const convertedContests: Contest[] = response.data.map(contest => ({
          platform: contest.platform,
          title: contest.title,
          startTime: new Date(contest.startTime),
          endTime: new Date(contest.endTime),
          url: contest.url,
          solution: contest.solution,
        }));

        setContests(convertedContests);
      } catch (error) {
        setError('Failed to load past contests. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPastContests();
  }, [platformFilter, monthFilter, yearFilter]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Past Contests
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

        <FormControl sx={{ minWidth: 120, mr: 2, mb: 4 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={yearFilter}
            label="Year"
            onChange={(e) => setYearFilter(e.target.value as number)}
          >
            {years.map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120, mb: 4 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={monthFilter}
            label="Month"
            onChange={(e) => setMonthFilter(e.target.value as number)}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <MenuItem key={month} value={month}>
                {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {loading ? (
          <Container sx={{ textAlign: 'center', mt: 4 }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading past contests...
            </Typography>
          </Container>
        ) : error ? (
          <Container sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Container>
        ) : (
          <Grid2 container spacing={2}>
            {contests.map((contest, index) => (
              <Grid2 >
                <PastContestCard contest={contest} />
              </Grid2>
            ))}
          </Grid2>
        )}
      </Container>
    </>
  );
}
