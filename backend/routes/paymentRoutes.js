import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import {createPaymentOrder,verifyPaymentOrder,getMyReceipts ,getAllReceipts} from "../controllers/paymentController.js"


const router = Router()


router.post("/createOrder", verifyToken, createPaymentOrder)
router.post("/verifyOrder", verifyToken, verifyPaymentOrder)
router.get("/my-receipts", verifyToken, getMyReceipts);
router.get("/receipts", verifyToken, getAllReceipts);

export default router;