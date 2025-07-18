/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file');
type flagsPage = typeof import('./pages/flags');

declare namespace CodeceptJS {
  interface SupportObject { I: I, current: any, flagsPage: flagsPage }
  interface Methods extends Playwright {}
  interface I extends ReturnType<steps_file> {}
  namespace Translation {
    interface Actions {}
  }
}
