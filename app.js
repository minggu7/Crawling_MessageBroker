const request = require('request');
const cheerio = require('cheerio');

const crawlingByNewsHome = () => {
  request('https://news.daum.net', (error, response, body) => {
    const $ = cheerio.load(body);

    let aArr;
    aArr = $('a');

    let newsArr = [];
    for(let i = 0; i < aArr.length; i++){
      if(aArr[i].attribs.href.includes("v.daum.net/v/"))
        newsArr.push(aArr[i].attribs.href);
    }

    newsArr = Array.from(new Set(newsArr));

    for(let i = 0; i < newsArr.length; i++){
      crawlingNewsByNewsTime(newsArr[i].split('https://v.daum.net/v/')[1]);
    }
  });
}

const crawlingNewsByNewsTime = (newsTime) => {
  const newsUrl = `https://news.v.daum.net/v/${newsTime}`;
  request(newsUrl, (error, response, body) => {
    const $ = cheerio.load(body);
    let title = $('.tit_view')[0].children[0].data;

    let contentArr = $('.main-content p');//�����̴�. �ϸ�� �����̳��� p�±� ����
    let content = "";
    for(let i = 0; i < contentArr.length; i++){
      content += contentArr[i].children[0].data + " ";
    }
    let category = $('#kakaoContent .innermain .screen_out').cheerio[0].data;
    
    crawlingNewsCategory(newsTime, title, content, category);
  });
}

const crawlingNewsCategory = (newsTime, title, content, category) => {
  let newsObject = {title, content, category}
  
  //������ ���� �־ �����ֱ�
  globalChannel.sendToQueue(queue, Buffer.from(JSON.stringify(newsObject)));
}

const amqp = require('amqplib/callback_api');
const queue = 'PRE_NEWS';
let globalChannel;

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        
        channel.assertQueue(queue, {
            durable: true
        });
        //3. ������ �־� ������
        // channel.sendToQueue(queue, Buffer.from(msg));
        globalChannel = channel;

        crawlingByNewsHome();//���� url�� ���� ũ�Ѹ� ����.
    });
    setTimeout(function(){
      connection.close();
      process.exit(0);
    }, 1000 * 30);
});

// ũ�Ѹ� ����


// Ư�� URL�� ���� ũ�Ѹ� ����
// crawlingNewsByNewsTime('20241010004737842');