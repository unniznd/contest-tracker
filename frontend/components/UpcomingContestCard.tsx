// components/UpcomingContestCard.tsx
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { Contest } from '../types/contest';

interface UpcomingContestCardProps {
  contest: Contest;
  isBookmarked: boolean;
  onBookmark: (title: string) => void;
}

export default function UpcomingContestCard({ contest, isBookmarked, onBookmark }: UpcomingContestCardProps) {  
  return (
    <Card sx={{ 
      width: 345,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          <IconButton 
            onClick={() => onBookmark(contest.title)}
            aria-label="bookmark contest"
          >
            {isBookmarked ? <Bookmark color="primary" /> : <BookmarkBorder />}
          </IconButton>
        </div>
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