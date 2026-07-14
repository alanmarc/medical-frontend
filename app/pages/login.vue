<script lang="ts" setup>
definePageMeta({
  layout: 'public',
});

const { fetchSession } = useAuth();

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
    // Llamada al endpoint local de Nitro (BFF)
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: form,
    });

    // Refrescar la sesión en el cliente (nuxt-auth-utils)
    await fetchSession();

    // Redirección segura a la zona privada
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
  <div
    class="flex flex-center bg-accent"
    :class="$q.screen.gt.xs ? 'q-pa-xl' : 'q-pa-md'"
    style="min-height: 100vh; width: 100%;"
  >
    <q-card
      class="row shadow-3"
      style="background: #E0E8F6; width: 100%; max-width: 960px; min-height: 600px; border-radius: 16px; overflow: hidden;"
    >
      <div class="col-12 col-md-6 flex flex-center gt-sm q-pa-none">
        <div class="column items-center text-center q-gutter-y-lg full-width">
          <q-img
            src="/medical_login.png"
            spinner-color="white"
            style="width: 100%;"
          />
          <div class="text-secondary q-px-sm">
            <h2 class="text-h4 text-weight-bold q-mb-sm">
              Control Médico Centralizado
            </h2>
            <p class="text-subtitle1 opacity-80">
              Gestione sus expedientes clínicos, citas y recetas en un entorno seguro y ágil.
            </p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 flex flex-center bg-grey-1 q-pa-lg">
        <div
          style="width: 100%; max-width: 420px;"
          class="q-py-md"
        >
          <div class="q-mb-lg text-center text-md-left">
            <h1 class="text-h4 text-weight-bold text-primary q-mb-xs">
              Bienvenido de nuevo
            </h1>
            <p class="text-grey-7">
              Ingrese sus credenciales para acceder a la plataforma médica.
            </p>
          </div>

          <q-form
            class="q-gutter-md"
            @submit.prevent="onSubmit"
          >
            <q-input
              v-model="form.email"
              type="email"
              label="Correo electrónico"
              outlined
              color="accent"
              bg-color="white"
              lazy-rules
              :rules="[val => !!val || 'El correo electrónico es obligatorio']"
            >
              <template #prepend>
                <q-icon
                  name="mdi-email-outline"
                  color="grey-6"
                />
              </template>
            </q-input>

            <q-input
              v-model="form.password"
              type="password"
              label="Contraseña"
              outlined
              color="accent"
              bg-color="white"
              lazy-rules
              :rules="[val => !!val || 'La contraseña es obligatoria']"
            >
              <template #prepend>
                <q-icon
                  name="mdi-lock-outline"
                  color="grey-6"
                />
              </template>
            </q-input>

            <q-banner
              v-if="error"
              class="bg-negative text-white q-my-md"
              dense
            >
              <template #avatar>
                <q-icon
                  name="mdi-alert-circle"
                  color="white"
                />
              </template>
              {{ error }}
            </q-banner>
            <div class="flex flex-center">
              <q-btn
                type="submit"
                color="accent"
                label="Iniciar Sesión"
                :loading="loading"
                unevaluated
                class="full-width q-py-sm text-weight-bold shadow-1 q-mt-lg"
              />
            </div>
          </q-form>

          <div class="text-center q-mt-xl text-grey-7">
            ¿No tienes una cuenta en el sistema?
            <NuxtLink
              to="/register"
              class="text-accent text-weight-bold text-decoration-none"
            >
              Solicitar registro
            </NuxtLink>
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
.opacity-80 {
  opacity: 0.8;
}
.text-decoration-none {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
</style>
