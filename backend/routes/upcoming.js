const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const {parseCodechef, parseCodeforces, parseLeetcode} = require("../utils/parsers.js")

process.env.TZ = 'Asia/Kolkata';
router.use(cors());


router.get('/', async (req, res) => {
    try {
        const codechefRequest = axios.post('https://www.codechef.com/api/list/contests/all', {
                sort_by: 'START',
                sorting_order: 'asc',
                offset: 0,
                mode: 'all'
            },{headers: { 'Content-Type': 'application/json' }
        });

        const leetcodeRequest = axios.post('https://leetcode.com/graphql', {
            query: `{
                topTwoContests {
                    title
                    startTime
                    duration
                    cardImg
                    titleSlug
                }
            }`
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const codeforcesRequest = axios.post('https://codeforces.com/api/contest.list', {}, {
            headers: { 'Content-Type': 'application/json' }
        });

        // Execute all requests concurrently
        const [codechefResponse, leetcodeResponse, codeforcesResponse] = await Promise.all([
            codechefRequest,
            leetcodeRequest,
            codeforcesRequest
        ]);

        // Process responses
        const contests = [
            ...parseCodechef(codechefResponse.data.future_contests || []),
            ...parseLeetcode(leetcodeResponse.data.data.topTwoContests || []),
            ...parseCodeforces(codeforcesResponse.data.result || [])
        ];

        // Sort by start time
        const sortedContests = contests.sort((a, b) => a.startTime - b.startTime);

        res.json(sortedContests);
    } catch (error) {
        console.error('Error fetching contests:', error);
        res.status(500).json({ 
            error: 'Failed to fetch contests',
            message: error.message 
        });
    }
});


router.get('/:platform', async (req, res) => {
    const platform = req.params.platform.toLowerCase();

    try {
        let contests = [];
        
        switch (platform) {
            case 'codechef':
                const codechefResponse = await axios.post(
                    'https://www.codechef.com/api/list/contests/all',
                    {
                        sort_by: 'START',
                        sorting_order: 'asc',
                        offset: 0,
                        mode: 'all'
                    },
                    { headers: { 'Content-Type': 'application/json' } }
                );
                contests = parseCodechef(codechefResponse.data.future_contests || []);
                break;

            case 'leetcode':
                const leetcodeResponse = await axios.post(
                    'https://leetcode.com/graphql',
                    {
                        query: `{
                            topTwoContests {
                                title
                                startTime
                                duration
                                cardImg
                                titleSlug
                            }
                        }`
                    },
                    { headers: { 'Content-Type': 'application/json' } }
                );
                contests = parseLeetcode(leetcodeResponse.data.data.topTwoContests || []);
                break;

            case 'codeforces':
                const codeforcesResponse = await axios.post(
                    'https://codeforces.com/api/contest.list',
                    {},
                    { headers: { 'Content-Type': 'application/json' } }
                );
                contests = parseCodeforces(codeforcesResponse.data.result || []);
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
        console.error(`Error fetching ${platform} contests:`, error);
        res.status(500).json({
            error: `Failed to fetch ${platform} contests`,
            message: error.message
        });
    }
});

module.exports = router;