import {Router} from "express";
import logger from "../Configs/logger";
import authorization from "../Middleware/authorization";

const router = Router();

router.get("/authorize", authorization);

export default router;