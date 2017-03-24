'use strict'
const test = require('../scripts/test')

describe('main', function() {
  it('introduce', function() {
    let testName = 'Alice';
    const testUser = new test.User(testName);
    expect(testUser.say()).toEqual('My name is ' + testName);
  });
});