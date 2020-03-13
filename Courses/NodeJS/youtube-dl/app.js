'use strict';
const fs = require('fs');
const dl = require('ytdl-core');

// dl('http://www.youtube.com/watch?v=A02s8omM_hI')
//   .pipe(fs.createWriteStream('video.flv'));

const videourl = "http://www.youtube.com/watch?v=A02s8omM_hI";


dl.getInfo(videourl, { filter: format => true }).then(info => {
     let wstream = fs.createWriteStream('formats.json');
     let i = info.player_response.streamingData;
     // let mimes = {}
     // for(let k in i.formats){
     //      console.log(i.formats[k].mimeType);
     //      mimes[k] = i.formats[k].mimeType;
     // }
     // for(let k in i.adaptiveFormats){
     //      console.log(i.adaptiveFormats[k].mimeType);
     //      mimes[k*4] = i.adaptiveFormats[k].mimeType;
     // }
     wstream.write(JSON.stringify(i));
     wstream.end();
});

// const koa = require('koa');
// const app = new koa();

// app.use(async ctx => {ctx.body = 'Hello Wrold'; });
// app.listen(3000);