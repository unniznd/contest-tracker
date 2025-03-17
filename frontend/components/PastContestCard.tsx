// components/PastContestCard.tsx
import { Card, CardContent, Typography } from '@mui/material';
import { Contest } from '../types/contest';

interface PastContestCardProps {
  contest: Contest;
}

export default function PastContestCard({ contest }: PastContestCardProps) {  
  return (
    <Card sx={{ 
      width: 345,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          <a 
            href={contest.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {contest.title}
          </a>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Platform: {contest.platform}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Started: {contest.startTime.toDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ended: {contest.endTime.toDateString()}
        </Typography>
        {contest.solution && (
          <Typography variant="body2" color="text.secondary">
            <a 
              href={contest.solution} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Solution Video
            </a>
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}