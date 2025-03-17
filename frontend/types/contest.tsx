// types/contest.ts
export interface Contest {
    platform: 'codechef' | 'leetcode' | 'codeforces';
    title: string;
    startTime: Date;    
    endTime: Date;     
    url: string;
    solution?: string;
  }