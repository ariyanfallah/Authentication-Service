import { Router } from 'express';
import { loginController } from '../Controllers/login';
import { tokenManagement } from '../Middleware/tokenManagement';

const router = Router();

router.post("/login"    , tokenManagement
                        , loginController);

export default router;