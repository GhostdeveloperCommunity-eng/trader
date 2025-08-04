const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Configure AWS SDK v3
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

module.exports.uploadFileToS3 = async (file, fileName, bucketName) => {
    try {
        // Create S3 object parameters
        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        // Upload the file to S3
        const command = new PutObjectCommand(params);
        const output = await s3Client.send(command);

        console.log(`[uploadImageToS3] Single Image output : ${JSON.stringify(output)}`);

        // Generate the uploaded image URL
        const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

        return imageUrl;
    } catch (error) {
        console.error(`[uploadImageToS3] Error occurred: ${error}`);
        return "ERROR_IMAGE_URL";
    }
};

module.exports.deleteFileFromS3 = async (s3Url) => {
    try {
        // Parse the S3 URL to get the key (file path)
        const url = new URL(s3Url);

        // Decode the URL-encoded pathname to handle spaces and special characters
        const decodedPathname = decodeURIComponent(url.pathname);
        const key = decodedPathname.substring(1); // Remove leading slash

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
        };

        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);

        console.log(`[deleteFileFromS3] Successfully deleted file: ${s3Url}`);
        return;
    } catch (error) {
        console.error(`[deleteFileFromS3] Error occurred: ${error}`);
        return;
    }
};
