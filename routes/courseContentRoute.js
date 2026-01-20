const express = require("express");
const router = express.Router();
const controller = require("../controllers/courseContentCont");
const rateLimiters = require("../middlewares/rateLimiters");
router.use("/courseContent", (req, res, next) => {
  console.log("User Enter CourseContent Page Time:", Date.now());
  next();
});

router.get("/courseContent", controller.courseContent);
router.get("/courseContent/:name", controller.courseContentByName);
router.post(
  "/courseContent/:name/stars",
  rateLimiters.courseActionLimiter,
  controller.courseContentRate,
);
router.get(
  "/courseContent/:name/:Category",
  controller.courseContentByNameAndCategory,
);

module.exports = router;
