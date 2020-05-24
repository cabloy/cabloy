const connection = require('./middleware/connection.js');
const packet = require('./middleware/packet.js');
const io = require('./middleware/io.js');

module.exports = {
  connection,
  packet,
  io,
};
