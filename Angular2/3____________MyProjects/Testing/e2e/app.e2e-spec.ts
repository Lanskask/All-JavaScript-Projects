import { TestingPage } from './app.po';

describe('testing App', () => {
  let page: TestingPage;

  beforeEach(() => {
    page = new TestingPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
