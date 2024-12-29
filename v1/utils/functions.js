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