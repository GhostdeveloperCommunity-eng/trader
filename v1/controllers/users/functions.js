import redisInstance from "../../../redisClient.js"
import CommonModel from "../../model/commonmodel.js";
import { generateOtp,jwtSignIn } from "../../utils/functions.js"; 
import bcrypt from "bcrypt"

export const signupSendOtp = async(req,res,next)=>{
    
     try {
          const {firstName="",lastName="",email,mobile,dob="",password=""} = req.body;
          const user = await CommonModel.find({$or:[{pk:mobile},{sk:email}]})
          
          if(user&&user.length>0){
               throw{
                    message:"This number or email is  registerd with us .Please login or use another number and email to signin"
               }
          }
          
          const value = JSON.stringify({firstName,lastName,email,mobile,dob,password})
          const otp = generateOtp()
          const key = `${mobile}:${otp}:signup}`
          const response = await redisInstance.set(key,value,"EX",300);
          console.log("Redis Response",response)
           res.status(200).json({
               code:1,
               data:{otp},
               message:"This is your otp"
           })
           return
     } catch (error) {
        res.status(200).json({
          code:0,
          data:null,
          message:error.message||"SOMETHING WENT WRONG"
        })
     }
}


export const verifySignupOtp = async (req,res,next)=>{
     try {
          const {otp,mobile} = req.body
        const key = `${mobile}:${otp}:signup}`
       const response = await  redisInstance.get(key)
    
       if(!response){
          throw {
               message :"Invalid otp Or mobile number                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       "
          }
       }
       
       const userDetail = JSON.parse(response);
      
       const userEntry = {
          pk:mobile,
          sk:userDetail.email,
          type:"user",
          roles:["user"],
          details:{
               firstName:userDetail.firstName,
               lastName:userDetail.lastName,
               mobile,
               email:userDetail.email,
               dob:userDetail.dob
          },
       } 

       const createResponse = await CommonModel.create(userEntry);
       if(!createResponse){
           throw {
               message:"mongodb query error"
           }
       }
       const {_id,type,roles,details} = createResponse
       const token = jwtSignIn({_id})
       const data= {
          token,
          user:{_id,type,roles,details}
       }

       return res.status(200).json({
          code:1,
          data,
          message:"otp verified successfully"
       })
       
     } catch (error) {
          res.status(200).json({
               code :0,
               message:`${error.message||"SOMETHING WENT WRONG"}`,
               data:null

          })
     }
}


export const loginOtp = async (req,res,next)=>{
       try {
          const {identity}  = req.body;
          const response =  await CommonModel.find({$or:[{pk:identity},{sk:identity}]});
          if(!response||response.length==0 ){
               throw {
                    message:"you does not exist with us"
               }
          }
          const otp = generateOtp()

          const key = `${otp}:login`;
            const value = JSON.stringify({_id:response[0]._id,email:response[0].sk,mobile:response[0].pk})
           const redisResponse = await redisInstance.set(key,value,"EX",300);
           const getValue = await redisInstance.get(key)
          return res.status(200).json({
               code:1,
               message:"This is your otp",
              data:{otp}
           })
       } catch (error) {
          return res.status(200).json({
               code:0,
               data:null,
               message:error.message||"SOMETHING WENT WRONG"
          })
       }

}

export const verifyLoginOtp = async (req,res,next)=>{
     try {
          const {identity,otp} = req.body;
          const key = `${otp}:login`
         let value = await  redisInstance.get(key);
         value = JSON.parse(value)
        if(!value||value.email!==identity&&value.mobile!==identity){
            throw {
               message:"Invalid otp"
            }
        }

        const token = jwtSignIn({_id:value._id})
        return res.status(200).json({
          code:1,
          message:"otp has been verified",
          data:{
               token
          }
        })
     } catch (error) {
          res.status(200).json({
               code : 0,
               data:null,
               message:error.message||"SOMETHING WENT WRONG"
          })
     }
     
     
}