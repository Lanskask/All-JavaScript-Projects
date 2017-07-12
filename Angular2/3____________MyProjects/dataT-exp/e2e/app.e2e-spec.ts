import { DataTExpPage } from './app.po';

describe('data-t-exp App', () => {
  let page: DataTExpPage;

  beforeEach(() => {
    page = new DataTExpPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
