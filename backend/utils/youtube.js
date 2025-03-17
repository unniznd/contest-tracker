async function getFullPlaylist(playlistId) {
    let allVideos = [];
    let nextPageToken = '';
    const apiKey = process.env.YOUTUBE_API_KEY
    
    try {
        do {
            // Fetch page of results

            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${apiKey}&pageToken=${nextPageToken}`
            );
            
            const data = await response.json();
            
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            const videos = data.items.map(item => ({
                title: item.snippet.title,
                videoId: item.snippet.resourceId.videoId,
                link: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
            }));
            

            allVideos = allVideos.concat(videos);
            
            
            nextPageToken = data.nextPageToken || '';
            
        } while (nextPageToken);
        
        return allVideos;
        
    } catch (error) {
        console.error('Error fetching playlist:', error);
        return allVideos; // Return what we have so far
    }
}



module.exports = getFullPlaylist