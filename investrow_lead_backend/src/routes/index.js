const router = express.Router();
import express from "express";
import {
  login,
  addLead,
  editLead,
  deleteLead,
  getAllLeads,
  addUser,
  assignLead,
  getAllUsers,
  sendVerificationCode,
  verifyCodeAndUpdatePassword,
  updatePassword
} from "../controllers/userController.js";

import { isAdmin } from "../middlewares/authMiddleware.js";

router.post("/login", login);
router.get("/", getAllLeads);
router.post("/login",isAdmin, login);
router.get("/",isAdmin, getAllLeads);
router.post("/add-lead", addLead);
router.put("/edit-lead/", editLead);
router.delete("/delete-lead/", deleteLead);
router.post("/assign-lead/", assignLead);
router.post("/send-code", sendVerificationCode);
router.post("/verify-code-update-password", verifyCodeAndUpdatePassword);
router.post("/update-password", updatePassword);

export default router;

/* const bodyParser = require("body-parser");
app.use(bodyParser.json());
 */
/* app.post("/send-code", (req, res) => {
  const { email } = req.body;

  sendVerificationCode(email, (err, message) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.send(message);
  });
}); */

/* app.post("/verify-code-and-update-password", (req, res) => {
  const { email, code, newPassword } = req.body;

  verifyCodeAndUpdatePassword(email, code, newPassword, (err, message) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.send(message);
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
 */
