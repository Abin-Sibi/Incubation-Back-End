
const {register, login ,addApplication,didApply,uploadLogo,fetchUser} = require("../Controllers/AuthControllers")
const {checkUser} = require("../Middlewares/AuthMiddlewares")
var router = require("express").Router();

router.get("/",checkUser)
router.post("/register",register)
router.post("/login",login)
router.post("/form",addApplication)
router.get('/didApply/:id',didApply)
router.get("/getUserInfo", fetchUser);
router.post('/upload-file/:id',uploadLogo)

module.exports = router;
