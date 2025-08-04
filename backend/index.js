const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const serverless = require("serverless-http");
const authRouter = require("./routers/authentication_router");
const brandRouter = require("./routers/brand_router");
const categoryRouter = require("./routers/category_router");
const masterRouter = require("./routers/master_router");
const productRouter = require("./routers/product_router");
const featureRouter = require("./routers/feature_router");

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/auth", authRouter);
app.use("/api/brand", brandRouter);
app.use("/api/category", categoryRouter);
app.use("/api/master", masterRouter);
app.use("/api/product", productRouter);
app.use("/api/feature", featureRouter);

// to run and test locally
if (process.env.DEVELOPMENT) {
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`Server is running on PORT: ${port}.`);
    });
}

// lambda entry point
// module.exports.handler = async (event, context) => {
//     try {
//         return await serverless(app)(event, context);
//     } catch (error) {
//         console.error(`Lambda Handler Error: ${JSON.stringify(error)}`);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({
//                 error: error?.message ? error.message : `Internal server error`,
//             }),
//         };
//     }
// };
