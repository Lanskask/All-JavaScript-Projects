import { DataTableTest2Page } from './app.po';

describe('data-table-test2 App', () => {
  let page: DataTableTest2Page;

  beforeEach(() => {
    page = new DataTableTest2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
