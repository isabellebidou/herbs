//https://github.com/Sam-Meech-Ward/image-upload-s3/blob/master/backend/s3.js
//https://youtu.be/NZElg91l_ms
//https://github.com/meech-ward/s3-get-put-and-delete/blob/master/express-react/express/s3.js
const { S3Client, PutObjectCommand, DeleteObjectCommand , GetObjectCommand} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require( "@aws-sdk/s3-request-presigner")
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const accessKeyId = process.env.ACCESS_KEY_ID
const region = process.env.AWS_REGION
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const bucketName = process.env.BUCKET_NAME


const s3Client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey
  },
  region: region
})



function uploadFile(fileBuffer, fileName, mimetype) {

  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype
  }
  try {

    return s3Client.send(new PutObjectCommand(uploadParams));

  } catch (error) {
    console.log(error)
  }

}

function deleteFile(fileName) {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  }

  return s3Client.send(new DeleteObjectCommand(deleteParams));
}

async function getObjectUrl(key) {
  const params = {
    Bucket: bucketName,
    Key: key
  }

  // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
  const command = new GetObjectCommand(params);
  console.log(command)
 
  

  return command
}
async function getObjectSignedUrl(key) {
  const params = {
    Bucket: bucketName,
    Key: key
  }

  // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
  const command = new GetObjectCommand(params);
  const seconds = 360
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });

  return url
}
module.exports = {
  uploadFile,
  deleteFile,
  getObjectSignedUrl,
  getObjectUrl

};