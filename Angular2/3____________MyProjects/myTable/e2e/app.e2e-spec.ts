import { MyTablePage } from './app.po';

describe('my-table App', () => {
  let page: MyTablePage;

  beforeEach(() => {
    page = new MyTablePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
