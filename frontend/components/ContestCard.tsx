// components/ContestCard.tsx
import { Card, CardContent, Typography } from '@mui/material';
import { Contest } from '../types/contest';

interface ContestCardProps {
  contest: Contest;
}

export default function ContestCard({ contest }: ContestCardProps) {  
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
              color: 'inherit', // Use the parent typography color
              textDecoration: 'none', // Remove underline
            }}
          >
            {contest.title}
          </a>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Platform: {contest.platform}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Starts: {contest.startTime.toDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ends: {contest.endTime.toDateString()}
        </Typography>
        {contest.solution && (
          <Typography variant="body2" color="text.secondary">
            <a 
              href={contest.solution} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: 'inherit', // Use the parent typography color
                textDecoration: 'none', // Remove underline
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