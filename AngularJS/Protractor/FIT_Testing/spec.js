// spec.js
describe('Protractor Demo App', function() {
  it('should have a title', function() {
    // browser.get('http://juliemr.github.io/protractor-demo/');
    browser.get('http://192.168.0.213:8080/system_table/roles');

    expect(browser.getTitle()).toEqual('Бонусный сервер');
  });
});
