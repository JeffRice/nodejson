'use strict';
const financial = require('./json_app');



test('converts decimal into 2 digit floating point number', () => {
  expect(parseFloat(financial(123.456))).toBe(123.46);
});

