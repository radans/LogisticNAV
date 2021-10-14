const order = require('./order.jsx');
const send = require('./send.jsx');
const upload = require('./upload.jsx');

order.installFormHandler();
send.installSendHandler();
upload.installFormHandler();
