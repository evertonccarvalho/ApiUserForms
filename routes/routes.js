var express = require("express");
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require("../controllers/UserController");
var AdminAuth = require("../middleware/AdminAuth");
var ObitosCrontoller = require("../controllers/ObitosCrontoller");

const multer = require("multer");
const upload = multer().none();

router.get("/", HomeController.index);
router.post("/user", UserController.create);
router.get("/user", AdminAuth, UserController.index);
router.get("/user/:id", AdminAuth, UserController.findUser);

router.delete("/user/:id", AdminAuth, UserController.remove);
router.post("/recoverpassword", UserController.recoverPassword);
router.post("/changepassword", UserController.changePassword);
router.post("/login", UserController.login);
router.post("/validate", AdminAuth, HomeController.validate);

router.delete("/formularios/:id", ObitosCrontoller.removeForm);
router.post("/obitos", ObitosCrontoller.createObitos);
router.get("/formularios", ObitosCrontoller.indexForm);
router.get("/formularios/:id", ObitosCrontoller.findForm);
router.put("/formularios", ObitosCrontoller.editForm);

// router.put("/user", AdminAuth, UserController.edit);
// router.put("/user", AdminAuth, upload, UserController.edit);
router.put(
  "/user",
  UserController.upload.single("profilePicture"),
  UserController.edit
);

// router.put("/user", this.upload.single("profilePicture"), UserController.edit);
module.exports = router;
