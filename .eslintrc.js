// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  ignorePatterns: ['/dist/*', 'expo-env.d.ts'],
  rules: {
    'prettier/prettier': 'error'
  }
}
