<script setup lang="ts">
const props = defineProps({
  error: {
    type: Object,
    default: null,
  },
});

const statusCode = computed(() => props.error?.statusCode || 500);
const message = computed(() => props.error?.statusMessage || props.error?.message || 'Ha ocurrido un error inesperado.');

function handleError() {
  clearError({ redirect: '/' });
}
</script>

<template>
  <div class="error-page window-height window-width flex flex-center bg-grey-1">
    <QCard
      class="flat bordered q-pa-xl text-center shadow-2"
      style="max-width: 480px; width: 90%;"
    >
      <QCardSection>
        <QIcon
          :name="statusCode === 404 ? 'mdi-alert-circle-outline' : 'mdi-alert-octagon-outline'"
          size="72px"
          :color="statusCode === 404 ? 'warning' : 'negative'"
        />

        <div class="text-h2 text-weight-bold text-primary q-mt-md">
          {{ statusCode }}
        </div>

        <div class="text-h5 text-grey-8 text-weight-medium q-mt-sm">
          {{ statusCode === 404 ? 'Página no encontrada' : 'Error en el servidor' }}
        </div>

        <p class="text-body1 text-grey-6 q-mt-md leading-relaxed">
          {{ message }}
        </p>
      </QCardSection>

      <QCardSection class="q-pt-none">
        <QBtn
          color="primary"
          unelevated
          icon="mdi-home"
          label="Volver a Inicio"
          class="q-px-lg q-py-sm text-weight-medium"
          @click="handleError"
        />
      </QCardSection>
    </QCard>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  background-radial: radial-gradient(circle, #ffffff 0%, #f5f5f5 100%);
}
</style>
