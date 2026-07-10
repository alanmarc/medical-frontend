// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', 'nuxt-quasar-ui'],
  quasar: {
    iconSet: 'mdi-v7',
    lang: 'es',
    sassVariables: '~/assets/css/quasar_variables.scss',
    plugins: ['Dialog', 'Loading', 'Notify'],
  },
  runtimeConfig: {
    public: {
      appName: '',
      companyName: '',
      apiBase: '',
    },
  },
})