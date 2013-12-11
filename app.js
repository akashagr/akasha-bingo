var socketclient = require('socket.io-client');
var logger = require('./logger');

var numbers = [];

logger.debug('Going to connect to Bingo Server');
var socket = socketclient.connect('ws://yahoobingo.herokuapp.com');

socket.on('connect', function() {
  logger.debug('Connected to Bingo Server');
  
  logger.trace('Going to register to get a bingo card');
  var clientDetails = {
      name : 'Akash Agrawal',
      email : 'akash_agrawal@yahoo.co.uk',
      url : 'https://github.com/akashagr/akasha-bingo'
  };
  socket.emit('register', clientDetails);

  socket.on('error', function(data) {
    logger.error(data);
    logger.error('Error connecting to Bingo Server');
    process.exit(1);
  });
  socket.on('disconnect', function() {
    logger.debug('Disconnected from Bingo Server');
    process.exit(0);
  });
});

socket.on('card', function(payload) {
  logger.debug('my bingo card:');
  logger.debug(payload.slots);
  numbers = numbers.concat(payload.slots.B, 
                            payload.slots.I, 
                            payload.slots.N, 
                            payload.slots.G, 
                            payload.slots.O);
});

socket.on('number', function(number) {
  logger.trace('Number announced by server is:' + number);
  var number = number.slice(1);
  for(var i=0;i<25;i++) {
    // using == here intentionally
    if(numbers[i] == number) {
      logger.trace('Match found');
      numbers[i] = -1;
    }
  }
  checkCard();
});

function checkCard() {
  logger.trace('checking card');
  // One can optimize by not checking any more row/column/diagonal once a bingo has been detected.
  // In this simple implementation, Its ok to keep going even after that.
  // checking column
  checkFive(0, 1, 2, 3, 4);
  checkFive(5, 6, 7, 8, 9);
  checkFive(10, 11, 12, 13, 14);
  checkFive(15, 16, 17, 18, 19);
  checkFive(20, 21, 22, 23, 24);
  
  // checking row
  checkFive(0, 5, 10, 15, 20);
  checkFive(1, 6, 11, 16, 21);
  checkFive(2, 7, 12, 17, 22);
  checkFive(3, 8, 13, 18, 23);
  checkFive(4, 9, 14, 19, 24);
  
  // checking diag
  checkFive(0, 6, 12, 18, 24);
  checkFive(4, 8, 12, 16, 20);
}

function checkFive(one, two, three, four, five) {
  if(numbers[one] == -1 && numbers[two] == -1 && numbers[three] == -1 && numbers[four] == -1 && numbers[five] == -1) {
    logger.debug('Got a Bingo.');
    socket.emit('bingo');
  }
  return;
}

socket.on('win', function(message) {
  logger.debug('You have won!');
});

socket.on('lose', function(message) {
  logger.debug('Sorry! You lost. Try Again.');
});
