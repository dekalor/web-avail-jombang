'use strict';

const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');

router.get('/', testimonialController.index);
router.get('/:id', testimonialController.show);

module.exports = router;
