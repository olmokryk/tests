const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname + '/build'));
app.route('/').get((req, res) => {
    res.sendFile(path.resolve(__dirname + '/build/index.html'));
});
app.listen(5000, 'localhost');