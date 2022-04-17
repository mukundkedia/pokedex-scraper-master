const cheerio = require('cheerio');
const axios = require('axios');
const Fs = require('fs');
const Path = require('path');
const _ = require('lodash');


saveAudio = async (url) => {
    var fname = url;
    url =   `https://play.pokemonshowdown.com/audio/cries/${url}`
    const writer = Fs.createWriteStream(`./assets/cries/${fname}`);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
      })
    
      response.data.pipe(writer);
    
      return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
      })
}


const fet = async () => {
    await axios.get('https://play.pokemonshowdown.com/audio/cries/')
        .then(async response => {
            if (response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html);
                var i = 5;
                while(true) {
                    if($('a').eq(i)[0] ) {
                        if($('a').eq(i)[0].children[0].data.match('.+\.mp3($|\n)')) {
                            await saveAudio($('a').eq(i)[0].children[0].data);
                            console.log(`Saved: ${i}`);
                        }
                    } else {
                        break;
                    }
                    i++;
                }
            } else {
                console.log('Cannot fetch');
            }
        })
        .catch(error => {
            console.log('Error: ', error);
        })
}

fet();