import { expect } from 'chai';

import * as userApi from './api';

describe('users', () => {
    it('users is user', () => {
        expect('user').to.eql('user');
    })

    // Fix Tests
    describe('signUp(username, password): Token', () => {
        it('signs up a user and returns a token'), async () => {
            const data = await userApi.signUp({
                username: 'asdfasdf',
                password: 'asdfasdf',
            });

            expect(data.data.signUp).to.eql('tokeaaaaan');
        }
    })
})