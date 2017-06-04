import { Angular2projPage } from './app.po';

describe('angular2proj App', function() {
  let page: Angular2projPage;

  beforeEach(() => {
    page = new Angular2projPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
