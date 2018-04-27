const { assert } = require('chai');
const createEnsureAuth = require('../../lib/util/ensure-auth');
const tokenService = require('../../lib/util/token-service');

describe.only('Ensure Auth Middleware Test', () => {

    const user = { _id: 69 };
    let token = '';

    beforeEach(() => token = tokenService.sign(user));

    const ensureAuth = createEnsureAuth();

    it('adds payload a req.user', done => {
        const req = {
            get(header) {
                if(header === 'Authorization') return token;
            }
        };
        const next = () => {
            assert.equal(req.user.id, user._id);
            done();
        };

        ensureAuth(req, null, next);
    });

    it('calls next with bad token', done => {
        const req = {
            get() { return 'bad-token';}
        };
        
        const next = err => {
            assert.equal(err.status, 401);
            done();
        };

        ensureAuth(req, null, next);

    });
});