import {Router} from "express";
import { logoutController } from "../Controllers/logout";

const router = Router();

router.post("/logout" , logoutController)

export default router;