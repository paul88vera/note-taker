const express = require('express');
const path = require('path');
const fs = require('fs');
const html = require('./routes/htmlRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

//use
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));
app.use('/', html);

//post
app.post('/api/notes', (req,res) => {
 res.json('');
});

//listen
app.listen(PORT, function() {
 console.log(`app is listening on port: ${PORT}`);
});