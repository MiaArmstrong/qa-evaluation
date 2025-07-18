import {
  setHeadlessWhen,
  setCommonPlugins
} from '@codeceptjs/configure';
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

export const config: CodeceptJS.MainConfig = {
  tests: './tests/**/*.ts',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'http://localhost:5173',
      show: true,
      restart: "session", //Keep browser open between scenarios
      keepCookies: true,
      keepBrowserState: true
    },
  },
  include: {
    I: './steps_file',
    flagsPage: "./pages/flags.ts",
  },
  "mocha": {
    "reporterOptions": {
        "reportDir": "output"
    }
  },
  

  name: 'automated-tests'
}