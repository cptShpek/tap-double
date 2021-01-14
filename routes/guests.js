const express = require('express');
const router = express.Router();
const { getGuests, addGuest } = require('../controllers/guests');

router.route('/').get(getGuests).post(addGuest);

module.exports = router;
