'use strict';
const functions = require('./json_app');
const mockFunctions = require('./__mocks__/json_app');

test('adds 1 + 2 to equal 3', () => {
  expect(functions.tester(1, 2)).toBe(3);
});

// testing the financial function
test('converts decimal into 2 digit floating point number', () => {
  expect(parseFloat(functions.financial(123.456))).toBe(123.46);
});

// testing the showAmount function
test('shows user balance ', () => {

  // Set up our document body
  document.body.innerHTML =
    '<div>' +
    '  <section class="portfolio-output">' +
    '   </section>' +
    '</div>';
// mock showAmount with a value, should update the DOM
jest.mock(functions.showAmount(3122));
expect($('.portfolio-output').text()).toEqual('3122');
});


// Created a new file to use mock functions. getPortfolio has a literal array response
const testPortfolioObject = [
                                        { symbol: 'MSFT', shares: 164 },
                                        { symbol: 'AMZN', shares: 48 },
                                        { symbol: 'TSLA', shares: 22 }
                                      ];

it('works with promises', () => {

  // Set up our document body
  document.body.innerHTML =
    '<div>' +
    '  <section class="portfolio-output">' +
    '   </section>' +
    '</div>';

  jest.mock(functions.buildPortfolio(testPortfolioObject));
  expect.assertions(2);
  return mockFunctions.getPortfolio().then(data => expect(data).toEqual([{"shares": 164, "symbol": "MSFT"}, {"shares": 48, "symbol": "AMZN"}, {"shares": 22, "symbol": "TSLA"}]))
  .then(expect($('.portfolio-output').text()).toEqual('xyz'));

});
