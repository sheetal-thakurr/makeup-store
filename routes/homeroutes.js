const express = require("express");
const router = express.Router();

const {home , homedummy} = require("../controllers/controllersHome");

router.route("/").get(home);
router.route("/dummy").get(homedummy);




module.exports = router;