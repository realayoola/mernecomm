const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../middlewares/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
// router.get('/', authController.getUsers);
router.get('/', authController.getUsers);



module.exports = router;
