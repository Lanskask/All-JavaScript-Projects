import { TestingMaterialPage } from './app.po';

describe('testing-material App', () => {
  let page: TestingMaterialPage;

  beforeEach(() => {
    page = new TestingMaterialPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
