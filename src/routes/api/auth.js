const express = require('express');
const authRouter = express.Router();
const {
    register,
    login,
    logout,
    currentUser,
    updateSubscription,
    changeAvatarUrl,
    verifyEmail,
    repeatedVerify
} = require('../../controllers/authControllers');
const { tryCatchWrapper } = require('../../helpers/helpers');
const { auth } = require('../../middlewares/auth');
const {
    registrationUserSchema,
    loginUserSchema,
    verifySchema
} = require('../../schemes/validationUserSchemes');
const { validation } = require('../../middlewares/validationBody');
const { upload } = require('../../middlewares/upload')

authRouter.post('/register', validation(registrationUserSchema), tryCatchWrapper(register));
authRouter.post('/login', validation(loginUserSchema), tryCatchWrapper(login));
authRouter.post('/logout', tryCatchWrapper(auth), tryCatchWrapper(logout));
authRouter.get('/current', tryCatchWrapper(auth), tryCatchWrapper(currentUser));
authRouter.patch('/', tryCatchWrapper(auth), tryCatchWrapper(updateSubscription));
authRouter.patch('/avatars', tryCatchWrapper(auth), upload.single("avatar"), tryCatchWrapper(changeAvatarUrl));
authRouter.get('/verify/:verificationToken', tryCatchWrapper(verifyEmail));
authRouter.post('/verify', validation(verifySchema), tryCatchWrapper(repeatedVerify));

module.exports = authRouter;
