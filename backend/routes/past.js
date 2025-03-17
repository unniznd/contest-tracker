const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require("cors")
const { parseCodechef, parseCodeforces, parseLeetcode } = require('../utils/parsers.js');
const getFullPlaylist = require("../utils/youtube.js");
const {leetcodePlaylistId, codechefPlaylistId, codeforcesPlaylistId} = require("../utils/constants.js");

router.use(cors());
router.get('/:year/:month', async (req, res) => {
    const { year, month } = req.params;

    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return res.status(400).json({
            error: 'Invalid year or month',
            message: 'Year must be a number and month must be between 1 and 12'
        });
    }

    const startOfMonth = new Date(yearNum, monthNum - 1, 1).getTime();
    const endOfMonth = new Date(yearNum, monthNum, 0, 23, 59, 59, 999).getTime();

    try {
        // API requests
        const codechefRequest = axios.post(
            'https://www.codechef.com/api/list/contests/all',
            {
                sort_by: 'START',
                sorting_order: 'desc',
                offset: 0,
                mode: 'all'
            },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const leetcodeRequest = axios.post(
            'https://leetcode.com/graphql',
            {
                query: `{
                    allContests {
                        title
                        startTime
                        duration
                        titleSlug
                    }
                }`
            },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const codeforcesRequest = axios.post(
            'https://codeforces.com/api/contest.list',
            {},
            { headers: { 'Content-Type': 'application/json' } }
        );

        

        const [codechefResponse, leetcodeResponse,  codeforcesResponse] = await Promise.all([
            codechefRequest,
            leetcodeRequest,
            codeforcesRequest
        ]);

        const [codechefSolutions, leetCodeSolutions, codeforcesSolutions]  = await Promise.all([
            getFullPlaylist(codechefPlaylistId),
            getFullPlaylist(leetcodePlaylistId),
            getFullPlaylist(codeforcesPlaylistId)
        ])

      
        const codechefContests = parseCodechef(codechefResponse.data.past_contests || [])
            .filter(contest => contest.startTime >= startOfMonth && contest.startTime <= endOfMonth);
        

        codechefContests.forEach(contest => {
            const searchText = contest.title.replace(/\([^)]*\)/g, "").toLowerCase();
            const solution = codechefSolutions.find(video => 
                video.title.substring(9,).toLowerCase().includes(searchText)
            );
            if (solution) {
                contest.solution = solution.link;
            }
        });

        const leetcodeContests = parseLeetcode(leetcodeResponse.data.data.allContests || [])
            .filter(contest => contest.startTime >= startOfMonth && contest.startTime <= endOfMonth);
  
        leetcodeContests.forEach(contest => {
            const solution = leetCodeSolutions.find(video => 
                video.title.toLowerCase().includes(contest.title.toLowerCase())
            );
            if (solution) {
                contest.solution = solution.link;
            }
        });

        const codeforcesContests = parseCodeforces(codeforcesResponse.data.result || [], false)
            .filter(contest => 
                contest.startTime >= startOfMonth && 
                contest.startTime <= endOfMonth && 
                contest.endTime < Date.now()
            );

        codeforcesContests.forEach(contest => {
            const searchText = contest.title.replace(/\([^)]*\)/g, "").toLowerCase();
            const solution = codeforcesSolutions.find(video => 
                video.title.toLowerCase().includes(searchText)
            );
            if (solution) {
                contest.solution = solution.link;
            }
        });

        const allContests = [
            ...codechefContests,
            ...leetcodeContests,
            ...codeforcesContests
        ].sort((a, b) => a.startTime - b.startTime);

        res.json(allContests);

    } catch (error) {
        console.error('Error fetching past contests:', error);
        res.status(500).json({
            error: 'Failed to fetch past contests',
            message: error.message
        });
    }
});

router.get('/:platform/:year/:month', async (req, res) => {
    const { platform, year, month } = req.params;
    const platformLower = platform.toLowerCase();

    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return res.status(400).json({
            error: 'Invalid year or month',
            message: 'Year must be a number and month must be between 1 and 12'
        });
    }

    // Calculate date range for the month
    const startOfMonth = new Date(yearNum, monthNum - 1, 1).getTime();
    const endOfMonth = new Date(yearNum, monthNum, 0, 23, 59, 59, 999).getTime();

    try {
        let contests = [];

        switch (platformLower) {
            case 'codechef':
                const codechefResponse = await axios.post(
                    'https://www.codechef.com/api/list/contests/all',
                    {
                        sort_by: 'START',
                        sorting_order: 'desc',
                        offset: 0,
                        mode: 'all'
                    },
                    { headers: { 'Content-Type': 'application/json' } }
                );
                const allCodechefContests = parseCodechef(codechefResponse.data.past_contests || []);
                contests = allCodechefContests.filter(contest => 
                    contest.startTime >= startOfMonth && contest.startTime <= endOfMonth
                );
                break;

            case 'leetcode':
    
                const leetcodeResponse = await axios.post(
                    'https://leetcode.com/graphql',
                    {
                        query: `{
                            allContests {
                                title
                                startTime
                                duration
                                titleSlug
                            }
                        }`
                    },
                    { headers: { 'Content-Type': 'application/json' } }
                );
                const allLeetcodeContests = parseLeetcode(leetcodeResponse.data.data.allContests || []);
                contests = allLeetcodeContests.filter(contest => 
                    contest.startTime >= startOfMonth && contest.startTime <= endOfMonth
                );
                break;

            case 'codeforces':
                const codeforcesResponse = await axios.post(
                    'https://codeforces.com/api/contest.list',
                    {},
                    { headers: { 'Content-Type': 'application/json' } }
                );
                const allCodeforcesContests = parseCodeforces(codeforcesResponse.data.result || [], false);
                contests = allCodeforcesContests.filter(contest => 
                    contest.startTime >= startOfMonth && contest.startTime <= endOfMonth &&
                    contest.endTime < Date.now() // Ensure it's a past contest
                );
                break;

            default:
                return res.status(400).json({
                    error: 'Invalid platform',
                    message: `Supported platforms: codechef, leetcode, codeforces`
                });
        }

        const sortedContests = contests.sort((a, b) => a.startTime - b.startTime);
        res.json(sortedContests);

    } catch (error) {
        console.error(`Error fetching past ${platform} contests:`, error);
        res.status(500).json({
            error: `Failed to fetch past ${platform} contests`,
            message: error.message
        });
    }
});


module.exports = router