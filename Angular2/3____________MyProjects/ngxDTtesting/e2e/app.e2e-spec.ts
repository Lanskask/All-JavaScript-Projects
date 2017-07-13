import { ModulesTestPage } from './app.po';

describe('modules-test App', () => {
  let page: ModulesTestPage;

  beforeEach(() => {
    page = new ModulesTestPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
