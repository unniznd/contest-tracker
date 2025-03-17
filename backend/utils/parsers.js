const parseCodechef = (data) => {
    return data.map(contest => ({
        platform: 'codechef',
        title: contest.contest_name,
        startTime: new Date(contest.contest_start_date).getTime(),
        duration: contest.contest_duration * 60 * 1000,
        endTime: new Date(contest.contest_start_date).getTime() + (contest.contest_duration * 60 * 1000),
        url: `https://www.codechef.com/${contest.contest_code}`
    }));
};

const parseCodeforces = (data, isFinished = true) => {
    let filteredData = data;
    if(isFinished){
        filteredData = filteredData.filter(contest => contest.phase !== 'FINISHED')
    }
    return filteredData
        .map(contest => ({
            platform: 'codeforces',
            title: contest.name,
            startTime: contest.startTimeSeconds * 1000,
            duration: contest.durationSeconds * 1000,
            endTime: (contest.startTimeSeconds + contest.durationSeconds) * 1000,
            url: `https://codeforces.com/contest/${contest.id}`
        }));
};

const parseLeetcode = (data) => {
    return data.map(contest => ({
        platform: 'leetcode',
        title: contest.title,
        startTime: contest.startTime * 1000,
        duration: contest.duration * 60 * 1000,
        endTime: (contest.startTime + contest.duration * 60) * 1000,
        url: `https://leetcode.com/contest/${contest.titleSlug}`
    }));
};

module.exports = {
    parseCodechef,
    parseCodeforces,
    parseLeetcode
}