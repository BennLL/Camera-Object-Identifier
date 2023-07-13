<h1>Make Shift Security Camera</h1>
Made with

![JavaScript](https://img.shields.io/badge/-JavaScript-%23F7DF1E?logo=javascript&logoColor=white)
![HTML5](https://img.shields.io/badge/-HTML5-orange?logo=html5&logoColor=white&style=flat)
![CSS3](https://img.shields.io/badge/-CSS3-blue?logo=css3&logoColor=white&style=flat)
![ml5.js](https://img.shields.io/badge/-ml5.js-ED1C24?logo=ml5.js&logoColor=white&style=flat)
![p5.min.js](https://img.shields.io/badge/p5.min.js-8BC34A?style=flat)
![Chokidar JS](https://img.shields.io/badge/Chokidar%20JS-gray?style=flat)
![googleapis](https://img.shields.io/badge/GoogleAPIs-gray?style=flat)
![nodemailer](https://img.shields.io/badge/-NodeMailer-gray?logo=nodemailer&logoColor=white&style=flat)

<h3>The Idea</h3>
<ul>
    <li>This project aims to repurpose an old laptop or desktop and webcam to create a simple security camera system.</li> 
    <li>The code utilizes ml5js' pretrained AI to detect objects and sends alerts when specific objects, such as humans, are detected.</li>
    <li>The main components of the project include the script.js file, which captures video from the webcam, performs object detection, and records video clips when certain conditions are met.</li>
    <li>The upload.js file is responsible for uploading the recorded video clips to a cloud storage service, such as Google Drive. The project also incorporates email alerts using nodemailer.js to notify the user whenever a new recording is made.</li>
    <li>Overall, the project provides a cost-effective solution to repurpose existing hardware and leverage computer vision capabilities for basic security monitoring.</li>
</ul>

<h3>Showcase with my cat</h3>
![GIF](https://imgur.com/HOU60V4.gif)

<h3>Functionality</h3>

<p>script.js<br>The script.js file is responsible for capturing video from the webcam, performing object detection using the ML5.js library with the COCO-SSD model, and displaying the video feed with bounding boxes around detected objects. It continuously analyzes the video frames and updates the display in real-time. The script.js file also includes functionality to arm the security camera, record video clips when specific conditions are met (e.g., human presence), and save the recorded clips locally.
</p>



<p>upload.js<br>The upload.js file handles the uploading of the recorded video clips to a cloud storage service, such as Google Drive. It utilizes the Google Drive API to authenticate the user, create a new file with the recorded video, and upload the video file to the designated cloud storage location. Additionally, upload.js integrates nodemailer.js to send email alerts to the user, notifying them of new recordings and providing a link to access the uploaded video.<p>

<p>links<br>
<span style="font-weight: bold; color: skyblue;">ML5JS</span>: https://ml5js.org<br>
<span style="font-weight: bold; color: skyblue;">Google Cloud</span>: https://console.cloud.google.com<br>
<span style="font-weight: bold; color: skyblue;">Google OAuth 2.0 Playground</span>: https://developers.google.com/oauthplayground<br>
<span style="font-weight: bold; color: skyblue;">NodemailerJS</span>: https://nodemailer.com/about/<br>
<span style="font-weight: bold; color: skyblue;">Chokidar - npm</span>: https://www.npmjs.com/package/chokidar
</p>
