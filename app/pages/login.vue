<script lang="ts" setup>
definePageMeta({ layout: 'public' });

const { fetch: fetchSession } = useUserSession();

const loading = ref(false);
const error = ref<string | null>(null);

const form = reactive({
  email: '',
  password: '',
});

async function onSubmit() {
  loading.value = true;
  error.value = null;

  try {
    // 1. Llamar al endpoint del servidor Nuxt (BFF)
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: form,
    });

    // 2. Refrescar la sesión en el cliente (nuxt-auth-utils)
    await fetchSession();

    // 3. Redirigir a la vista privada
    navigateTo('/app/dashboard');
  } catch (err: unknown) {
    console.error('Error al iniciar sesión:', err);
    const errorObj = err as { statusMessage?: string; message?: string };
    error.value = errorObj.statusMessage || errorObj.message || 'Error de autenticación. Inténtelo más tarde.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="row justify-center items-center window-height">
    <QCard
      class="q-pa-lg"
      style="width: 100%; max-width: 400px"
    >
      <QCardSection>
        <div class="text-h5 text-primary">
          Iniciar sesión
        </div>
      </QCardSection>

      <QCardSection>
        <QForm
          class="q-gutter-md"
          @submit.prevent="onSubmit"
        >
          <QInput
            v-model="form.email"
            type="email"
            label="Correo"
            filled
            required
          />
          <QInput
            v-model="form.password"
            type="password"
            label="Contraseña"
            filled
            required
          />

          <QBanner
            v-if="error"
            class="bg-negative text-white"
            dense
          >
            {{ error }}
          </QBanner>

          <QBtn
            type="submit"
            color="primary"
            label="Entrar"
            :loading="loading"
            class="full-width"
          />
        </QForm>
      </QCardSection>

      <QCardSection class="text-center">
        ¿No tienes cuenta?
        <NuxtLink
          to="/register"
          class="text-primary"
        >Regístrate</NuxtLink>
      </QCardSection>
    </QCard>
  </div>
</template>
