import { App3Page } from './app.po';

describe('app3 App', () => {
  let page: App3Page;

  beforeEach(() => {
    page = new App3Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
