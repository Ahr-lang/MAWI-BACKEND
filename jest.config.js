module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Directorios donde buscar archivos de prueba
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  // Patrones para encontrar archivos de prueba
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  // Transformar archivos TypeScript
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  // Archivos a incluir en la cobertura
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
};