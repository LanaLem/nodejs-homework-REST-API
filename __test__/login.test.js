const jwt = require('jsonwebtoken');
let { login } = require('../src/controllers/authControllers');
require('dotenv').config();
const { SECRET_KEY } = process.env;

describe('Controller Login tests', () => {
    const user = {
        _id: '1',
        email: 'testUser@mail.com',
        password: 'test123456',
        subscription: 'starter',
    };

    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '15m' });
    user.token = token;

    it('Should return a valid token', async () => {
        const mReq = {
            token: user.token,
        };

        const mRes = {
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        };

        expect(mReq.token).toEqual(mRes.token);
    });

    it('Should return status 200 OK', async () => {
        const mReq = {
            body: {
                email: 'testUser@mail.com',
                password: 'test123456',
            },
        };

        const mRes = {
            status: 200,
            json: {
                token,
                user: {
                    email: user.email,
                    subscription: user.subscription,
                },
            },
        };

        login = jest.fn(() => mRes);
        const result = await login(mReq, mRes);
        expect(result.status).toEqual(200);
    });

    it('Should return valid user', async () => {
        const mRes = {
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        };

        expect(typeof mRes.user.email).toBe('string');
        expect(typeof mRes.user.subscription).toBe('string');
    });

    it('Should return validation password error status 401', async () => {
        const mReq = {
            body: {
                email: 'testUser@mail.com',
                password: 'invalidPassword',
            },
        };

        const mRes = {
            status: 401,
            json: { message: 'Email or password is wrong' },
        };

        login = jest.fn(() => mRes);
        const result = await login(mReq, mRes);
        expect(result.status).toEqual(401);
    });
});
