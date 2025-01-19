import {Router} from "express"
import userLoginRouter from "../../controllers/users/loginusers.js"

const router = new Router()

router.use("/login",userLoginRouter)

export default router