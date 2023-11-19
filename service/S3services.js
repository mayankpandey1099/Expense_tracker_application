const AWS = require("aws-sdk");

const uploadToS3 = (data, filename) => {
  return new Promise((resolve, reject) => {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    });

    var params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: "public-read",
    };
    s3bucket.upload(params, (err, data) => {
      if (err) {
        console.log("Something went wrong", err);
        reject(err);
      } else {
        console.log("success", data);
        resolve(data.Location);
      }
    });
  });
};

module.exports = { uploadToS3 };
