const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors'); 
const randomize = require('randomatic');
const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');

const File = require('./models/file');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads' });

app.use(cors()); // Enable CORS for all routes

mongoose.connect(process.env.DB_URL).then(() => {
    console.log('DB connection established');
});

const PORT = process.env.PORT;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/upload', upload.single('file'), async (req, res) => {
    const fileData = {
        path: req.file.path,
        originalName: req.file.originalname,
        code : randomize('0', 5),
    };

    const file = await File.create(fileData);

    // Send the file link back to the client
    const fileLink = `http://localhost:3000/file/${file.id}`;
    const code = file.code;
    res.json({ fileLink ,code  });
});

app.post('/file/:code', async (req, res) => {
    const file = await File.findOne({code:req.params.code});
    if(file){
        res.json({fileUrl : `http://localhost:3000/file/${file.id}`});
    }else{
        return res.status(404).json({ error: 'File not found' });
    }
})


app.get('/file/:id', async (req, res) => {
    const file = await File.findById(req.params.id);

    if (!file) {
        return res.status(404).json({ error: 'File not found' });
    }

    file.downloadCount++;
    await file.save();

    res.download(file.path, file.originalName);
});

app.listen(PORT, () => {
    console.log(`app listening on http://localhost:${PORT}`);
});
