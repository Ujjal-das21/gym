const express =  require("express");
const { registerUser, loginUser, logOut, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUserRole } = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth.js");
// const { route } = require("./productRoute");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route('/logout').get(logOut);
router.route('/me').get(isAuthenticatedUser,getUserDetails);
router.route('/me/update').put(isAuthenticatedUser,updateProfile);
router.route("/password/update").put(isAuthenticatedUser ,updatePassword);
//admin routes
router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUser);
router
.route("/admin/user/:id")
.get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser)
.put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole)
.delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUserRole);
module.exports = router;