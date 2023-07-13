const path = require('path');
const fs = require('fs');
const os = require('os');
const { google } = require('googleapis');
const chokidar = require('chokidar');
const mime = require('mime-types');
const nodemailer = require('nodemailer');
require('dotenv').config();

//google api
//add your google client ID, Secret, and redirect URI
const credentials = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: [process.env.GOOGLE_REDIRECT_URIS],
};

const refresh_token = ""; // add your refresh_token

const oauth2Client = new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    credentials.redirect_uris[0],
);

oauth2Client.setCredentials({ refresh_token: refresh_token })

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
})

//nodemailer.js
//Use your own gmail and make an app password
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_APP_PASSWORD,
    }
});

async function uploadFile(filePath) {
    parts = filePath.split('\\')
    fileName = parts.pop();
    try {
        const mimeType = mime.lookup(filePath)
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType,
            },
            media: {
                mimeType,
                body: fs.createReadStream(filePath),
            }
        });
        console.log(response.data);

        // alert by sending email
        const mailOptions = {
            from: process.env.GMAIL_USERNAME,
            to: process.env.GMAIL_USERNAME,
            subject: 'New Recording ' + fileName,
            text: 'Your camera has a new alert please check it.',
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent:', info.response)
            }
        });
    } catch (error) {
        console.log(error.message)
    }
}

const downloadFolder = path.join(os.homedir(), "Downloads");

const watcher = chokidar.watch(downloadFolder, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100,
    }
});

watcher.on('add', (filePath) => {
    uploadFile(filePath)
});