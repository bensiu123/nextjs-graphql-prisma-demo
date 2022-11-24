import S3 from "aws-sdk/clients/s3";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  try {
    console.log(process.env);

    const { file } = req.query;

    const s3 = new S3({
      region: process.env.APP_AWS_REGION,
      credentials: {
        accessKeyId: process.env.APP_AWS_ACCESS_KEY,
        secretAccessKey: process.env.APP_AWS_SECRET_KEY,
      },
      signatureVersion: "v4",
    });

    const post = await s3.createPresignedPost({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Fields: {
        key: file,
      },
      Expires: 60, // seconds
      Conditions: [["content-length-range", 0, 1024 * 1024]], // 1MB
    });

    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default handler;
