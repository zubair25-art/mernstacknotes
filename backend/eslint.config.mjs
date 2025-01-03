import { ESLint } from 'eslint';

export default [
  {
    files: ['*.ts', '*.tsx'],
    parserOptions: {
      project: './tsconfig.json', // Adjust if necessary
    },
  },
];
