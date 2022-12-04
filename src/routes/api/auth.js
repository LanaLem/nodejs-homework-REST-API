const express = require('express');
const authRouter = express.Router();
const {
    register,
    login,
    logout,
    currentUser,
    updateSubscription,
    changeAvatarUrl
} = require('../../controllers/authControllers');
const { tryCatchWrapper } = require('../../helpers/helpers');
const { auth } = require('../../middlewares/auth');
const {
    registrationUserSchema,
    loginUserSchema,
} = require('../../schemes/validationUserSchemes');
const { validation } = require('../../middlewares/validationBody');
const { upload } = require('../../middlewares/upload')

authRouter.post('/register', validation(registrationUserSchema), tryCatchWrapper(register));
authRouter.post('/login', validation(loginUserSchema), tryCatchWrapper(login));
authRouter.post('/logout', tryCatchWrapper(auth), tryCatchWrapper(logout));
authRouter.get('/current', tryCatchWrapper(auth), tryCatchWrapper(currentUser));
authRouter.patch('/', tryCatchWrapper(auth), tryCatchWrapper(updateSubscription));
authRouter.patch('/avatars', tryCatchWrapper(auth), upload.single("avatar"), tryCatchWrapper(changeAvatarUrl));

module.exports = authRouter;
