import { ExcelKendExpPage } from './app.po';

describe('excel-kend-exp App', () => {
  let page: ExcelKendExpPage;

  beforeEach(() => {
    page = new ExcelKendExpPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
