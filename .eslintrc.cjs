module.exports = {
  // 환경 설정: 브라우저와 Node.js 환경에서 전역 변수를 인식하게 합니다.
  env: {
    browser: true,
    es2020: true,
    node: true,
  },

  // React 컴포넌트의 타입스크립트(.tsx) 파일을 처리하기 위한 설정
  extends: [
    'eslint:recommended',
    'plugin:react/recommended', // React 권장 설정
    'plugin:@typescript-eslint/recommended', // TypeScript 권장 설정
    'plugin:prettier/recommended', // Prettier 규칙을 ESLint에 통합 (가장 마지막에 위치해야 함)
  ],

  // 파서 설정: TypeScript 코드를 ESLint가 이해할 수 있도록 합니다.
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // JSX 구문 허용
    },
    ecmaVersion: 'latest', // 최신 ECMAScript 문법 사용
    sourceType: 'module',
  },

  // 사용할 플러그인 설정
  plugins: ['react', '@typescript-eslint', 'prettier'],

  // 사용자 지정 규칙 (0: off, 1: warn, 2: error)
  rules: {
    // 예시: TypeScript에서 any 사용 경고 (필요에 따라 설정)
    '@typescript-eslint/no-explicit-any': 'off',

    // React 17+ 사용 시 import React from 'react'가 불필요하므로 해당 규칙 끄기
    'react/react-in-jsx-scope': 'off',

    // prop-types 검사 끄기 (TypeScript 사용으로 대체)
    'react/prop-types': 'off',

    // Prettier 규칙을 ESLint 오류로 표시
    'prettier/prettier': 'error',

    // 파일 확장자 명시(TypeScript에서 필요)
    'import/extensions': 'off',
  },

  // React 버전을 자동으로 감지하도록 설정
  settings: {
    react: {
      version: 'detect',
    },
  },
};
