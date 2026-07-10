<script lang="ts" setup>
definePageMeta({ layout: 'public' })

const loading = ref(false)
const error = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const passwordMismatch = computed(
  () => form.password !== form.confirmPassword && form.confirmPassword.length > 0
)

async function onSubmit() {
}
</script>

<template>
  <div class="row justify-center items-center window-height">
    <QCard class="q-pa-lg" style="width: 100%; max-width: 400px">
      <QCardSection>
        <div class="text-h5 text-primary">Crear cuenta</div>
      </QCardSection>

      <QCardSection>
        <QForm class="q-gutter-md" @submit.prevent="onSubmit">
          <QInput v-model="form.name" label="Nombre completo" filled required />
          <QInput v-model="form.email" type="email" label="Correo" filled required />
          <QInput v-model="form.password" type="password" label="Contraseña" filled required />
          <QInput
            v-model="form.confirmPassword"
            type="password"
            label="Confirmar contraseña"
            filled
            required
            :error="passwordMismatch"
            error-message="Las contraseñas no coinciden"
          />

          <QBanner v-if="error" class="bg-negative text-white" dense>
            {{ error }}
          </QBanner>

          <QBtn type="submit" color="primary" label="Registrarme" :loading="loading" class="full-width" />
        </QForm>
      </QCardSection>

      <QCardSection class="text-center">
        ¿Ya tienes cuenta?
        <NuxtLink to="/login" class="text-primary">Inicia sesión</NuxtLink>
      </QCardSection>
    </QCard>
  </div>
</template>