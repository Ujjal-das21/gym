const express= require('express');
const {
    route
} = require("express/lib/application");
const {getAllMembers, addMember, updateMember, deleteMember, getMemberDetails, recharge, setDefaulters, searchMembers} = require('../controllers/memberController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const router= express.Router();

router.route('/members').get(isAuthenticatedUser, authorizeRoles("admin"),getAllMembers)
router.route('/member').get(isAuthenticatedUser, authorizeRoles("admin"),searchMembers);
router.route('/member/add').post(isAuthenticatedUser, authorizeRoles("admin"), addMember);
router.route('/member/:id').put(isAuthenticatedUser, authorizeRoles("admin"), updateMember).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteMember)
router.route("/member/:id").get(isAuthenticatedUser, authorizeRoles("admin"),getMemberDetails);
router.route("/member/recharge/:id").put(isAuthenticatedUser, authorizeRoles("admin"),recharge);
router.route("/member/defaulters/:id").put(isAuthenticatedUser, authorizeRoles("admin"),setDefaulters);
module.exports=router