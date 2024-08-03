import {Router} from "express";
import { logoutController } from "../Controllers/logout";

const router = Router();

router.get("/logout" , logoutController)

export default router;