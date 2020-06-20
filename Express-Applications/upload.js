var express = require('express');
var app = express();
var cors = require('cors');
var fs = require('fs');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var busboy = require('connect-busboy');
const AWS = require('aws-sdk');
const {Storage} = require('@google-cloud/storage');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
app.use(busboy());

const publicKey = ''; // Update the keys
const secretKey = '';
const sessionToken = '';

const GOOGLE_CLOUD_PROJECT_ID = ''; // Replace with your project ID
const GOOGLE_CLOUD_KEYFILE = ''; // Replace with the path to the downloaded private key


const s3 = new AWS.S3(
 {accessKeyId: publicKey, secretAccessKey: secretKey, sessionToken: sessionToken}
);
// const storage = new Storage({
//     projectId: GOOGLE_CLOUD_PROJECT_ID,
//     keyFilename: GOOGLE_CLOUD_KEYFILE,
//   });

app.post('/fileupload', function(req, res) {
    var fstream,responce=false;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        const params = {
          Bucket: '',
          Key: (filename),
          Body: file
        };
        // fstream = fs.createWriteStream(filename);
        // file.pipe(fstream);
        s3.upload(params, function(s3Err, data) {
          if (s3Err) {
              console.log("Error uploading data: ", s3Err);
            } else {
              console.log("Successfully uploaded data");
            }
        });
        // storage.bucket('yogesh5466').upload(filename,function(s3Err, data) {
        //   if (s3Err) {
        //       console.log("Error uploading data: ", s3Err);
        //     } else {
        //       console.log("Successfully uploaded data");
        //     }
        //   });
        responce=true;
    });
    req.busboy.on('finish', function () {
        res.send(responce);
    });
});

app.listen(3001, () => {
  console.log('Server started');
});
