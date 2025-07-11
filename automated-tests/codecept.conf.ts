export const config: CodeceptJS.MainConfig = {
  tests: './*_test.ts',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'http://localhost:5173/flags',
      show: true
    }
  },
  include: {
    I: './steps_file'
  },
  name: 'automated-tests'
}