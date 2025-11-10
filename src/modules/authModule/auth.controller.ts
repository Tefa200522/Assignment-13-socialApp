import { Router } from "express";
import { AuthServices } from "./auth.services";
import validation from "../../meddileware/meddileware.validation";
import { confirmEmailSchema, loginSchema, resendOtpSchema, signupSchema } from "./auth.validation";
import { auth } from "../../meddileware/auth.meddileware";
import { multerFile, StoreInEnum } from "../../utils/multer/multer";
const router = Router()

const authServices = new AuthServices()
router.post('/signup',validation(signupSchema), authServices.signUp)
router.post('/login',validation(loginSchema),authServices.login)

router.patch('/confirm-email',validation(confirmEmailSchema),authServices.confirmEmail)
router.patch('/resend-otp',validation(resendOtpSchema),authServices.resendOtp)
router.post('/refresh-token',authServices.refreshToken)
router.patch('/forget-Password',authServices.forgetPassword)
router.patch('/reset-forgetten-password',authServices.resetForgettenPassword)
router.get('/me',auth,authServices.me)

router.patch('/profile-image',auth,multerFile({}).single('image'),authServices.profileImage)
export default router