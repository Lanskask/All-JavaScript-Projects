// spec.js
describe('Protractor Demo App', function() {
  it('should have a title', function() {
     browser.get('http://juliemr.github.io/protractor-demo/');
     expect(browser.getTitle()).toEqual('Super Calculator');
  });

  // it fails couse google isn't a AngularJS app
  //it('Google should have a title ', function(){
  //  browser.get('http://www.google.com');
  //  expect(browser.getTitle()).toEqual('Google');
  //});
});
