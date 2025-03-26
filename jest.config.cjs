module.exports = {
  testEnvironment: 'jsdom', // Simulates a browser environment
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js', // Your custom setup file
    '@testing-library/jest-dom' // Include Jest DOM matchers
  ],
  setupFiles: [], // Add this if you need setup before environment (optional, can be empty)
  moduleNameMapper: {
    // Handle CSS imports and other static assets
    '^.+\\.(css|less|scss|png|jpg|jpeg|gif|svg)$': 'identity-obj-proxy'
  },
  transform: {
    // Use Babel to transpile JS/JSX files
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  collectCoverage: true, // Enable coverage collection
  coverageDirectory: 'coverage', // Directory for coverage reports
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'], // Fixed pattern to include all subdirectories
  coverageReporters: ['lcov']
};

// module.exports = {
//     testEnvironment: 'jsdom', // Simulates a browser environment
//     setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Optional setup file
//     moduleNameMapper: {
//       // Handle CSS imports and other static assets
//       '^.+\\.(css|less|scss|png|jpg|jpeg|gif|svg)$': 'identity-obj-proxy'
//     },
//     transform: {
//       // Use Babel to transpile JS/JSX files
//       '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
//     },
//     collectCoverage: true, // Ensure this is set to true
//       coverageDirectory: "coverage", // Optional: Set custom directory for coverage reports
//       collectCoverageFrom: ["src/*/.{js,jsx,ts,tsx}"], // Define which files to check
//       coverageReporters: ["lcov"]
//   };