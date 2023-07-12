const path = require('path');
const fs = require('fs');
const os = require('os');
const { google } = require('googleapis');
const chokidar = require('chokidar');
const mime = require('mime-types');
const nodemailer = require('nodemailer');

//google api
const credentials = {
    client_id: '',
    client_secret: '',
    redirect_uris: [''],
};

const refresh_token = ''

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
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: '',
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
            from: '',
            to: '',
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