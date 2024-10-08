const request = require('request');
const cheerio = require('cheerio');

// const crawlingByNewsHome = () => {
//   request('https://news.daum.net', function(error, response, body){
//     // console.error('error:', error);
//     // console.log('statusCode:', response && response.statusCode);
//     // console.log('body', body);
//     const $ = cheerio.load(body);

//     let aArr = [];
//     let newsArr = [];
//     aArr = $('a');
//     for(let i = 0; i < aArr.length; i++){
//       if(aArr[i].attribs.href.includes("v.daum.net/v/")){
//         newsArr.push(aArr[i].attribs.href);
//       };
//     }

//     console.log(newsArr);
//   });

// }

const crawlingNewsByUrl = (url) => {
  request(url, (error, response, body) => {
    // console.error('error:', error);
    // console.log('statusCode:', response && response.statusCode);
    // console.log('body', body);
    const $ = cheerio.load(body);

    let title = $('.tit_view')[0].children[0].data;

    let contentArr = $('.main-content p');//본문이다. 하모니 컨테이너의 p태그 모음
    let content = "";
    for(let i = 0; i < contentArr.length; i++){
      content += contentArr[i].children[0].data + " ";
    }
    let category = $('#kakaoContent .innermain .screen_out').cheerio[0].data;
    
    console.log("Title : " + title);
    console.log("Content : " + content);
    console.log("Cagegory : " + category);
  });
}
crawlingNewsByUrl('https://v.daum.net/v/20241009061616920');