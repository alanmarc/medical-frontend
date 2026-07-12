// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    'nuxt-quasar-ui',
    '@nuxt/fonts',
    'nuxt-auth-utils',
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.scss'],
  runtimeConfig: {
    public: {
      appName: '',
      companyName: '',
      apiBase: '',
    },
  },
  compatibilityDate: '2025-07-15',
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        semi: true,
        quotes: 'single',
        commaDangle: 'always-multiline',
        braceStyle: '1tbs',
      },
    },
  },
  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Plus Jakarta Sans', provider: 'google', weights: [600, 700, 800] },
    ],
  },
  quasar: {
    iconSet: 'mdi-v7',
    lang: 'es',
    sassVariables: '~/assets/css/quasar_variables.scss',
    plugins: ['Dialog', 'Loading', 'Notify'],
    extras: {
      fontIcons: ['mdi-v7'],
    },
  },
});
