export default {
  /** Globs to analyze */
  globs: ['src/**/calendar.ts', 'src/**/date-picker.ts'],
  /** Globs to exclude */
  exclude: [],
  /** Directory to output CEM to */
  outdir: '/',
  /** Run in dev mode, provides extra logging */
  dev: false,
  /** Run in watch mode, runs on file changes */
  watch: false,
  /** Enable special handling for litelement */
  litelement: true,
  /** Enable special handling for catalyst */
  catalyst: false,
  /** Enable special handling for fast */
  fast: false,
  /** Enable special handling for stencil */
  stencil: false,
  /** Provide custom plugins */
  plugins: [removeMembers()],

  /** Overrides default module creation: */
  //   overrideModuleCreation: ({ ts, globs }) => {
  //     const program = ts.createProgram(globs, defaultCompilerOptions);
  //     const typeChecker = program.getTypeChecker();

  //     return program
  //       .getSourceFiles()
  //       .filter((sf) => globs.find((glob) => sf.fileName.includes(glob)));
  //   },
};

function removeMembers() {
  return {
    name: 'clean-for-storybook',
    analyzePhase({ ts, node, moduleDoc, context }) {
      if (!context.dev) {
        return;
      }

      switch (node.kind) {
        case ts.SyntaxKind.ClassDeclaration: {
          const className = node.name.getText();
          const classDoc = moduleDoc?.declarations?.find(
            declaration => declaration.name === className
          );
          classDoc.members = [];
        }
      }
    },
  };
}
