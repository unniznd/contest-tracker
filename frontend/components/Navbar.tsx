import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const router = useRouter();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Contest Tracker
        </Typography>
        <Link href="/" passHref legacyBehavior>
          <Button color={router.pathname === '/' ? 'secondary' : 'inherit'}>
            Upcoming Contests
          </Button>
        </Link>
        <Link href="/past" passHref legacyBehavior>
          <Button color={router.pathname === '/past' ? 'secondary' : 'inherit'}>
            Past Contests
          </Button>
        </Link>
        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
}
