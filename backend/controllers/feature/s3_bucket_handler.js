const { uploadImageToS3, uploadFileToS3 } = require("../../utils/s3");

module.exports.uploadImage = async (req, res) => {
    try {
        console.log("[uploadImage] req.files : ", req.files);
        if (req.files.length == 0) throw { message: "please send image" };
        const bucketName = process.env.BUCKET_NAME;
        const folderName = process.env.S3_FOLDER_NAME;

        // Use Promise.allSettled to handle all file uploads
        const uploadResults = await Promise.allSettled(
            req.files.map(async (file) => {
                const key = `${folderName}/${Date.now()}-${file.originalname}`;

                return await uploadFileToS3(file, key, bucketName);
            })
        );

        console.log("[uploaded images] uploadResults : ", uploadResults);
        const data = uploadResults.map((obj) => {
            if (obj.value) {
                return obj.value;
            }
        });
        res.status(200).json({
            code: 1,
            message: "Images uploaded successfylly",
            data,
        });
    } catch (error) {
        console.error("Error uploading files:", error);
        return res.status(200).json({
            data: [],
            code: 0,
            message: `error while uploading image ${error.message}`,
        });
    }
};
