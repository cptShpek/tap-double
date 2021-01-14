const express = require("express");
const router = express.Router();
const advancedResults = require("../middleware/advancedResults");
const Referral = require("../models/Referral");
const {
  getReferrals,
  createReferralLink,
  getReferralsByUser,
} = require("../controllers/referrals");

router
  .route("/")
  .get(advancedResults(Referral), getReferrals)
  .post(createReferralLink);

router.route("/:id").get(getReferralsByUser);

module.exports = router;
