import { Router } from 'express';
import { loginController } from '../Controllers/login';

const router = Router();

router.post("/login" , loginController);

export default router;