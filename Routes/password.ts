import {Router} from 'express'
import {changePasswordController} from '../Controllers/changePassword'

const router = Router();

router.post("/change" , changePasswordController)

export default router;