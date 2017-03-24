'use strict'

class User {
  constructor(name) {
    this._name = name;
  }

  say() {
    return 'My name is ' + this._name;
  }
}

module.exports = { User };