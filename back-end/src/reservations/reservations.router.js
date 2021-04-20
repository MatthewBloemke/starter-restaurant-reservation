/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const cors = require('cors')
router.use(cors())

router.route("/").get(controller.list).post( controller.create);

module.exports = router;
