const express = require('express')
const router = express.Router()
const {body} = require('express-validator')
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middlleware');

router.post('/register', 
    body('email').isEmail().withMessage("Invalid Email"),
    body('fullname.firstname').isLength({min: 3}).withMessage("Firstname must be atleast 3 characters long"),
    body('password').isLength({min: 6}).withMessage("Password must be atleast 6 characters long"),
    userController.registerUser
) 

router.post('/login', 
    [body('email').isEmail().withMessage("Invalid Email"),
    body('password').isLength({min: 6}).withMessage("Password must be atleast 6 characters long")],
    userController.loginUser
)


router.get('/profile', authMiddleware.authUser, userController.getUserProfile);

router.get('/logout', authMiddleware.authUser, userController.logoutUser);

router.get('/dashboard', authMiddleware.authUser, (req, res) => {
  res.status(200).json({ message: "Dashboard accessed", user: req.user });
});

module.exports = router;

