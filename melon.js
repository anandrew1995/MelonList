const axios = require('axios');
const cheerio = require('cheerio');

const endpoint = 'https://www.melon.com/chart';

module.exports = Melon = {
    parseChart: (chartType='') => {
        axios.get(`${endpoint}/${chartType}/index.htm`)
        .then((res) => {
            const $ = cheerio.load(res.data);
            let titles = [];
            $('.ellipsis.rank01').find('a').each((i, elem) => {
                titles[i] = $(elem).text();
            });
            let artists = [];
            $('.ellipsis.rank02').each((i, elem) => {
                let artistStr = "";
                let currentArtist = $(elem).children()[0];
                while (currentArtist.name !== 'span') {
                    artistStr += currentArtist.data || currentArtist.children[0].data;
                    currentArtist = currentArtist.next;
                }
                artists[i] = artistStr;
            });
            for (let i=0; i<100; i++) {
                console.log(titles[i] + " - " + artists[i])
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
}
