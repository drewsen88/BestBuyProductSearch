module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-safe-area-context|react-native-screens)/)',
  ],
  moduleNameMapper: {
    '^@react-navigation/(.*)$':
      '<rootDir>/node_modules/@react-navigation/$1/lib/commonjs',
  },
};
