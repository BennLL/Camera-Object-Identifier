const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');


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

const filePath = path.join(__dirname, 'test.JPG')

async function uploadFile() {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: "test.jpg",
                mimeType: 'image/jpeg'
            },
            media: {
                mimeType: 'image/jpeg',
                body: fs.createReadStream(filePath),
            }
        });
        console.log(response.data);
    } catch (error) {
        console.log(error.message)
    }
}

uploadFile()