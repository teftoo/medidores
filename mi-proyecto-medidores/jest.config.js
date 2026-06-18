const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  testEnvironment: 'jsdom',

  collectCoverage: true,

  coverageReporters: [
    'html',
    'lcov',
    'cobertura'
  ],

  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './coverage',
        outputName: 'junit.xml'
      }
    ]
  ]
}

module.exports = createJestConfig(customJestConfig)