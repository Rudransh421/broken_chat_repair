import { Router } from "express";
import {
  changePassword,
  getAllUsers,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  sendPasswordResetLink,
} from "../controller/user.controller.js";

import { verifyJwt } from "../middleware/auth.middleware.js";
import { getSpecificMessages } from "../controller/msg.controller.js";


const router = Router();

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/getallusers").get(verifyJwt, getAllUsers);
router.route("/currentuser").get(verifyJwt, getCurrentUser);

router.route("/forgot-password").post(sendPasswordResetLink);
router.route("/reset-password/:resetToken").post(resetPassword);
router.route("/change-password").post(verifyJwt, changePassword);

router.route('/messages/:senderId/:receiverId/:page').get(verifyJwt,getSpecificMessages)



export default router;
