const axios = require('axios');
const cheerio = require('cheerio');

const endpoint = 'https://www.melon.com/chart';

module.exports = Melon = {
    getCurrentChart: (chartType='', classCd='GN0000') => {
        let url = `${endpoint}/${chartType}/index.htm`;
        // url = filter ? url + '?classCd=' + filter : url;
        return axios.get(url, { params: { classCd } })
        .then((res) => {
            const $ = cheerio.load(res.data);
            let songs = [];
            $('.ellipsis.rank01').find('a').each((i, elem) => {
                // songs[i] = {
                //     title: $(elem).text()
                // };
                songs[i] = $(elem).text();
            });
            $('.ellipsis.rank02').each((i, elem) => {
                let artistStr = '';
                let currentArtist = $(elem).children()[0];
                while (currentArtist.name !== 'span') {
                    artistStr += currentArtist.data || currentArtist.children[0].data;
                    currentArtist = currentArtist.next;
                }
                songs[i] += `- ${artistStr}`;
            });
            // for (let i=0; i<100; i++) {
            //     console.log(songs[i])
            // }
            return new Promise((resolve, reject) => {
                if (songs.length === 100) {
                    resolve(songs);
                }
                else {
                    reject("Didn't receive exactly 100 songs!");
                }
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }
}
