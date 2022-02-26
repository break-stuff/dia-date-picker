import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';

// https://modern-web.dev/docs/test-runner/overview/
export default ({
  files: 'src/**/*tests.ts',
  browsers: [
    // https://modern-web.dev/docs/test-runner/browser-launchers/overview/#playwright
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'webkit' }),
    playwrightLauncher({ product: 'firefox' })
  ],
  nodeResolve: true,
  rootDir: '.',
  plugins: [
    // https://modern-web.dev/docs/dev-server/plugins/esbuild/
    esbuildPlugin({ ts: true })
  ]
});
