const express = require('express');

const app = express();
const port = 5000;
const upcoming = require("./routes/upcoming.js");
const past = require("./routes/past.js")

require('dotenv').config()

app.use("/api/upcoming/", upcoming);
app.use("/api/past", past);


app.get('', (req, res) => {
    const ytlist = require('youtube-playlist');

    const url = 'https://www.youtube.com/playlist?list=PLWKjhJtqVAbnZtkAI3BqcYxKnfWn_C704';
    ytlist(url, ['id', 'name', 'url']).then(res => {
        console.log(res);
    });

    res.status(200).send({"status":"true"})
});
  

app.use((req, res, next) => {
    res.status(404).send('Error 404: Not Found');
});





app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});


module.exports =  app