import { S3Client,PutObjectCommand } from "@aws-sdk/client-s3";
import jwt from "jsonwebtoken"

const validateSchema = async(schema,object)=>{
    try {
        const options = {
            abortEarly: true, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: false // remove unknown props
        }
        const validate = await schema.validateAsync(object,options)
        return validate
    } catch (error) {
        console.log(error,error.message)
        let message = error.message
         message = message.replace(/"/g,"")
         throw {message} 
    }
    
}

export const hofSchemaValidation = (schema)=>{
    return async(req,res,next)=>{
        try {
        const object  = req.body
        console.log(req.body,"hhhhhhhhhhhhhhhhhhhhhh")
        const validateBody = await validateSchema(schema,object)
          req.body = validateBody
          next()
        } catch (error) {
            res.status(400).json({
                status:"Fail",
                message:error.message
            })
        }
        
    }
}

export const s3Client =()=> new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
    }
});

export const putObjectCommand = (params)=>new PutObjectCommand(params)
 


export const uploadImageToS3 = async (Bucket,Key,Body,ContentType,ContentDisposition)=>{
    try {
        const params = {
            Bucket,
            Key,
            Body,
            ContentType,
            ContentDisposition: ContentDisposition,  // Important inline   for viewing but not downloading
          };
          console.log(params)
          const command = putObjectCommand(params)
          const uploaded = await s3Client().send(command);
          return Key
    } catch (error) {
        console.log(error.message,"TTTTTTTTTTTTTTTT",error)
       return error
    }
   
}

export const parseFormData = (...args) => {
    return async (req, res, next) => {
      try {
        // Loop through the properties using 'for...of'
        for (const property of args) {
          try {
            console.log(req.body[property], "WWWWWWWWWWWWWWWW");
            const value = JSON.parse(req.body[property]);
            console.log(value, "VVVVVVVVVV");
            req.body[property] = value// Update the req.body[property]
            console.log(req.body, "AAAAAAAAAAQQQQQQQQQ",property);
          } catch (error) {
            throw {
              message: `${property} is not a valid JSON string`,
            };
          }
        }
        next(); // Move to the next middleware after processing all properties
      } catch (error) {
        res.status(400).json({
          message: error.message,
        });
      }
    };
};


export const generateOtp = ()=>{
  let a=  Math.random()*1000000
    a = Math.floor(a)
  a = a+""
  if(a.length<6){
     a = a.padStart(6,"0")
  }
  
  return a
}

export const jwtSignIn = (obj)=>{
  
    const token = jwt.sign(obj,process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE_IN});
 
  return token
}