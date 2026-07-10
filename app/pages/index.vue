<script lang="ts" setup>
definePageMeta({ layout: 'public' })
</script>

<template>
  <div>
    <QToolbar class="bg-primary text-white">
      <QToolbarTitle>Medical CRM</QToolbarTitle>
      <QBtn flat to="/login" label="Iniciar sesión" />
      <QBtn outline text-color="white" to="/register" label="Registrarse" class="q-ml-sm" />
    </QToolbar>

    <div class="q-pa-xl text-center">
      <h1 class="text-h3 text-primary">Bienvenido a Medical CRM</h1>
      <p class="text-body1 q-mt-md">
        Gestiona pacientes, citas e historiales clínicos desde un solo lugar.
      </p>
      <QBtn color="primary" to="/register" label="Comenzar" class="q-mt-md" />
    </div>
  </div>
</template>