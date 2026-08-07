<script lang="ts" setup>
definePageMeta({
  layout: 'auth',
  auth: 'protected',
});
</script>

<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bold text-primary q-ma-none">
          Gestión de Usuarios & Personal
        </h1>
        <p class="text-subtitle1 text-grey-7 q-mt-xs">
          Administre el personal médico, roles y accesos al sistema.
        </p>
      </div>
      <QBtn
        color="secondary"
        icon="mdi-account-plus"
        label="Nuevo Usuario"
        class="text-weight-bold"
        unelevated
      />
    </div>
  </q-page>
</template>
