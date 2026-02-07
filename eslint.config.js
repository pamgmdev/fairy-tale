import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin' // Importamos Stylistic

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@stylistic': stylistic // Registramos el plugin
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // --- REGLAS DE ESTILO PERSONALIZADAS ---
      
      // Llaves en la línea siguiente (Allman)
      '@stylistic/brace-style': ['error', 'allman'],
      
      // Espacio antes de los paréntesis en funciones: ejemplo ()
      '@stylistic/space-before-function-paren': ['error', 'always'],
      
      // Alineación de los dos puntos en objetos
      '@stylistic/key-spacing': ['error', { 'align': 'colon' }],
      
      // Manejo de nuevas líneas en objetos para que sea consistente
      '@stylistic/object-curly-newline': ['error', { 'consistent': true }],
      
      // Indentación (opcional, suele ser necesaria con Allman)
      '@stylistic/indent': ['error', 2],

      '@stylistic/key-spacing': ['error', { 
        "beforeColon": false, 
        "afterColon": true, 
        "align": "colon" 
      }],
    },
  },
)