import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config({ path: './config.env' });
import app from "./app.js"



const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// mongoose.set('strictQuery', false);
mongoose
  .connect(DB)
  .then((con) => {
  
   
  })
  .catch((err) =>{
    console.log(err)
    return err
  } );
const port = 4000;
app.listen(port, () => {
  console.log(`app runing on port ${port}`);
});
//////////
console.log('i am server.js')