<script lang="ts" setup>
definePageMeta({ layout: 'public' });
const { loggedIn, user } = useAuth();
</script>

<template>
  <div>
    <QToolbar class="bg-primary text-white">
      <QIcon
        name="mdi-stethoscope"
        size="28px"
        class="q-mr-sm"
      />
      <QToolbarTitle>Medical CRM</QToolbarTitle>

      <template v-if="loggedIn">
        <QBtn
          flat
          icon="mdi-view-dashboard"
          label="Ir al Dashboard"
          to="/app/dashboard"
        />
        <span class="q-ml-md text-subtitle2 text-weight-medium text-white">
          Hola, {{ user?.name }}
        </span>
      </template>
      <template v-else>
        <QBtn
          flat
          icon="mdi-login"
          label="Iniciar sesión"
          to="/login"
        />
        <QBtn
          outline
          text-color="white"
          icon="mdi-account-plus"
          label="Registrarse"
          to="/register"
          class="q-ml-sm"
        />
      </template>
    </QToolbar>

    <div class="q-pa-xl text-center">
      <h1 class="text-h3 text-primary">
        Bienvenido a Medical CRM
      </h1>
      <p class="text-body1 q-mt-md">
        Gestiona pacientes, citas e historiales clínicos desde un solo lugar.
      </p>
      <QBtn
        color="primary"
        icon="mdi-arrow-right"
        :label="loggedIn ? 'Ir al Dashboard' : 'Comenzar'"
        :to="loggedIn ? '/app/dashboard' : '/register'"
        class="q-mt-md"
      />

      <QSeparator class="q-my-xl" />

      <!-- Bloque de inspección: fonts + iconos -->
      <div
        class="text-left q-mx-auto"
        style="max-width: 500px"
      >
        <div class="text-h6 q-mb-sm">
          Verificación de tipografías
        </div>

        <h2 class="text-h4">
          Encabezado (Plus Jakarta Sans)
        </h2>
        <p class="text-body1">
          Este párrafo usa Inter, la fuente de cuerpo. Deberías notar la diferencia
          de trazo respecto al encabezado de arriba.
        </p>

        <div class="q-mt-md">
          <div class="text-subtitle2 q-mb-xs">
            Iconos MDI
          </div>
          <QIcon
            name="mdi-heart-pulse"
            size="32px"
            color="negative"
            class="q-mr-md"
          />
          <QIcon
            name="mdi-calendar-check"
            size="32px"
            color="positive"
            class="q-mr-md"
          />
          <QIcon
            name="mdi-account-group"
            size="32px"
            color="info"
            class="q-mr-md"
          />
          <QIcon
            name="mdi-file-document-outline"
            size="32px"
            color="primary"
          />
        </div>
      </div>
    </div>
  </div>
</template>
