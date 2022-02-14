'use strict';
const functions = require('./json_app');


test('converts decimal into 2 digit floating point number', () => {
  expect(parseFloat(functions.financial(123.456))).toBe(123.46);
});

test('adds 1 + 2 to equal 3', () => {
  expect(functions.tester(1, 2)).toBe(3);
});