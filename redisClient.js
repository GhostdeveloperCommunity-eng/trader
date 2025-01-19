import {Redis} from "ioredis"

let redisInstance 

function getRedisInstance (){
    try {
        if(!redisInstance){
    
            redisInstance = new Redis({
                host:process.env.REDIS_HOST,
                password:process.env.REDIS_PASSWORD,
                port:6379,
                tls:{}
            })
            redisInstance.on('connect', () => {
                console.log("Connected to Redis successfully!");
              });
        
              redisInstance.on('error', (err) => {
                console.error("Redis connection error:", err);
              });
    
            return redisInstance
        }
        return redisInstance
    } catch (error) {
        console.log(error,error.message)
    }
   

}

export default getRedisInstance()
