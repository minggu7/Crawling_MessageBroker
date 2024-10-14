#!/usr/bin/env node

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
        //3. 데이터 넣어 보내기
        // channel.sendToQueue(queue, Buffer.from(msg));
        globalChannel = channel;

    });
});