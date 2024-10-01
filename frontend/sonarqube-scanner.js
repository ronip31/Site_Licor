// Importando de forma mais segura para Node.js v18 e superiores
const sonarqubeScanner = require('sonarqube-scanner').default || require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: 'http://localhost:9000',
    token: 'sqp_1eec2de55c2d78359b9416e3d0ebd8832ae78656',
    options: {
      'sonar.projectKey': 'Analyze "frontend"',
      'sonar.sources': './src',
      'sonar.exclusions': 'node_modules/**',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
    },
  },
  () => process.exit()
);
