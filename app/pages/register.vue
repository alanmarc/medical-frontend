<script lang="ts" setup>
definePageMeta({ layout: 'public' });

const loading = ref(false);
const error = ref<string | null>(null);

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const passwordMismatch = computed(
  () => form.confirmPassword.length > 0 && form.password !== form.confirmPassword,
);

async function onSubmit() {
  if (passwordMismatch.value) return;
  // Próximamente se integrará con el endpoint del backend para el registro
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
      <!-- Columna Izquierda: Banner Visual -->
      <div class="col-12 col-md-6 flex flex-center gt-sm q-pa-none">
        <div class="column items-center text-center q-gutter-y-lg full-width">
          <q-img
            src="/medical_register.png"
            spinner-color="white"
            style="width: 80%;"
          />
          <div class="text-secondary q-px-sm">
            <h2 class="text-h4 text-weight-bold q-mb-sm">
              Únete a MedicalSaaS
            </h2>
            <p class="text-subtitle1 opacity-80">
              Comienza a gestionar tus sedes clínicas de forma ordenada y 100% legal.
            </p>
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Formulario de Registro -->
      <div class="col-12 col-md-6 flex flex-center bg-grey-1 q-pa-lg">
        <div
          style="width: 100%; max-width: 420px;"
          class="q-py-md"
        >
          <div class="q-mb-lg text-center text-md-left">
            <h1 class="text-h4 text-weight-bold text-primary q-mb-xs">
              Crear cuenta
            </h1>
            <p class="text-grey-7">
              Complete los campos para solicitar el registro en el sistema.
            </p>
          </div>

          <q-form
            class="q-gutter-md"
            @submit.prevent="onSubmit"
          >
            <q-input
              v-model="form.name"
              label="Nombre completo"
              outlined
              color="accent"
              bg-color="white"
              lazy-rules
              :rules="[val => !!val || 'El nombre es obligatorio']"
            >
              <template #prepend>
                <q-icon
                  name="mdi-account-outline"
                  color="grey-6"
                />
              </template>
            </q-input>

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

            <q-input
              v-model="form.confirmPassword"
              type="password"
              label="Confirmar contraseña"
              outlined
              color="accent"
              bg-color="white"
              lazy-rules
              :error="passwordMismatch"
              error-message="Las contraseñas no coinciden"
              :rules="[val => !!val || 'Por favor confirma tu contraseña']"
            >
              <template #prepend>
                <q-icon
                  name="mdi-lock-check-outline"
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
                label="Registrarme"
                :loading="loading"
                unevaluated
                class="full-width q-py-sm text-weight-bold shadow-1 q-mt-lg"
              />
            </div>
          </q-form>

          <div class="text-center q-mt-xl text-grey-7">
            ¿Ya tienes cuenta?
            <NuxtLink
              to="/login"
              class="text-accent text-weight-bold text-decoration-none"
            >
              Inicia sesión
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
