import {Router} from "express";
import authorization from "../Middleware/authorization";

const router = Router();

router.get("/authorize", authorization);

export default router;