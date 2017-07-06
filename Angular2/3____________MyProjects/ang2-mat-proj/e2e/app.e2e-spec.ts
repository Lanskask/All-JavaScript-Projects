import { Ang2MatProjPage } from './app.po';

describe('ang2-mat-proj App', () => {
  let page: Ang2MatProjPage;

  beforeEach(() => {
    page = new Ang2MatProjPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
