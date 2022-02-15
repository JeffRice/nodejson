'use strict';
const functions = require('./json_app');


test('converts decimal into 2 digit floating point number', () => {
  expect(parseFloat(functions.financial(123.456))).toBe(123.46);
});

test('adds 1 + 2 to equal 3', () => {
  expect(functions.tester(1, 2)).toBe(3);
});



test('shows user balance ', () => {

  // Set up our document body
  document.body.innerHTML =
    '<div>' +
    '  <section class="portfolio-output">' +
    '   </section>' +
    '</div>';
jest.mock(functions.showAmount(3122));

    expect($('.portfolio-output').text()).toEqual('3122');

});