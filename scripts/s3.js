//https://github.com/Sam-Meech-Ward/image-upload-s3/blob/master/backend/s3.js
//https://youtu.be/NZElg91l_ms
const S3 = require('aws-sdk/clients/s3')
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }
const fs = require('fs')
const accessKeyId = process.env.ACCESS_KEY_ID
const region  = process.env.AWS_REGION 
const awsSecret = process.env.AWS_SECRET_ACCESS_KEY
const bucketName = process.env.BUCKET_NAME


const s3 = new S3({
    region,
    accessKeyId,
    awsSecret
})

function uploadFile(file, name){
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket :bucketName,
        Body:fileStream,
        Key: "plantpics/"+name
    }
    return s3.upload(uploadParams).promise()

}
exports.uploadFile = uploadFile