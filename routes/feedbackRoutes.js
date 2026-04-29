const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController.js");

router.get("/", feedbackController.getAllFeedbacks);
router.get("/customer/:customerName", feedbackController.getFeedbackByCustomer);
router.get("/:id", feedbackController.getFeedbackById);
router.post('/new', feedbackController.newFeedbackForm);
router.post('/new', feedbackController.createFeedback);
router.put('/edit/:id', feedbackController.updateFeedback);
router.put('/edit/:id', feedbackController.editFeedbackForm);
router.delete('/delete/:id', feedbackController.deleteFeedback);

module.exports = router;

