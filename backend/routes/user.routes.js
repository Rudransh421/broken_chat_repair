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
import { Message } from "../model/message.model.js";

const router = Router();

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/getallusers").get(verifyJwt, getAllUsers);
router.route("/currentuser").get(verifyJwt, getCurrentUser);

router.route("/forgot-password").post(sendPasswordResetLink);
router.route("/reset-password/:resetToken").post(resetPassword);
router.route("/change-password").post(verifyJwt, changePassword);

router.get("/messages/:sender/:receiver", async (req, res) => {
  const { sender, receiver } = req.params;

  if (!sender || !receiver) {
    return res
      .status(400)
      .send({ error: "Sender and receiver IDs are required" });
  }

  try {
    const messages = await Message
      .find({
        $or: [
          { senderId: sender, receiverId: receiver },
          { senderId: receiver, receiverId: sender },
        ],
      })
      .populate("sender")
      .populate("receiver")
      .sort({ timestamp: 1 }); // 1 for ascending, -1 for descending
    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send({ error: "Failed to retrieve messages", data: error });
  }
});

router.post("/delete/:_id/:senderId", async (req, res) => {
  let id = req.params._id;
  let senderId = req.params.senderId;
  let sender = await senderModel.find({ _id: senderId });
  if (sender) {
    try {
      let data = await model.deleteOne({ _id: id });
      console.log(data);
      res.send(data.acknowledged);
    } catch (err) {
      res.send(err);
      console.log(err);
    }
  } else {
    res.send("user not authorised to delete this message");
  }
});

export default router;
