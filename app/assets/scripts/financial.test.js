const financial = require('./financial');

test('converts decimal into 2 digit floating point number', () => {
  expect(financial(123.456)).toBe(123.46);
});

