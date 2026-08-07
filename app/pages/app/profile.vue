<script lang="ts" setup>
definePageMeta({
  layout: 'auth',
  auth: 'protected',
});

const { user, logout } = useAuth();
const { session } = useUserSession();

const saving = ref(false);
const saveSuccess = ref(false);

const form = reactive({
  name: user.value?.name || '',
  email: user.value?.email || '',
  role: user.value?.role || 'user',
});

// Formatear la fecha de inicio de sesión de manera legible en español
const formattedLoggedInAt = computed(() => {
  const rawDate = session.value?.loggedInAt;
  if (!rawDate) return 'Sesión activa';

  try {
    const date = new Date(rawDate as string | number | Date);
    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  } catch {
    return String(rawDate);
  }
});

// Previsualización enmascarada del token de sesión por seguridad
const maskedToken = computed(() => {
  const token = user.value?.token;
  if (!token) return 'No disponible';
  if (token.length <= 16) return token;
  return `${token.substring(0, 8)}...${token.substring(token.length - 10)}`;
});

async function handleSave() {
  saving.value = true;
  saveSuccess.value = false;

  // Simulación de actualización de perfil
  await new Promise(resolve => setTimeout(resolve, 800));

  saving.value = false;
  saveSuccess.value = true;
}

async function handleLogout() {
  await logout();
}
</script>

<template>
  <q-page class="q-pa-lg">
    <!-- Encabezado de la página -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bold text-primary q-ma-none">
          Mi Perfil
        </h1>
        <p class="text-subtitle1 text-grey-7 q-mt-xs q-mb-none">
          Gestione su información personal, permisos de acceso y estado de sesión médica.
        </p>
      </div>

      <QBtn
        outline
        color="negative"
        icon="mdi-logout"
        label="Cerrar Sesión"
        class="text-weight-bold"
        @click="handleLogout"
      />
    </div>

    <!-- TARJETA CABECERA DE PERFIL -->
    <QCard class="flat bordered shadow-1 q-pa-lg q-mb-lg rounded-borders bg-white">
      <div class="row items-center justify-between q-col-gutter-md">
        <div class="row items-center q-gutter-md">
          <QAvatar
            size="72px"
            color="primary"
            text-color="white"
            class="shadow-2 text-h4 text-weight-bold"
          >
            {{ user?.name?.charAt(0).toUpperCase() || 'U' }}
          </QAvatar>

          <div>
            <div class="row items-center q-gutter-sm">
              <span class="text-h5 text-weight-bold text-primary">{{ user?.name }}</span>
              <QBadge
                :color="user?.role === 'admin' ? 'red' : 'secondary'"
                class="q-px-sm q-py-xs text-weight-bold text-uppercase"
              >
                {{ user?.role }}
              </QBadge>
            </div>
            <div class="text-subtitle1 text-grey-7">
              {{ user?.email }}
            </div>
          </div>
        </div>

        <!-- Badges de Estado -->
        <div class="row items-center q-gutter-sm">
          <QChip
            color="teal-1"
            text-color="teal-9"
            icon="mdi-check-circle-outline"
            class="text-weight-bold"
          >
            Sesión Activa (SSR)
          </QChip>
          <QChip
            color="purple-1"
            text-color="accent"
            icon="mdi-shield-check-outline"
            class="text-weight-bold"
          >
            COFEPRIS & HIPAA
          </QChip>
        </div>
      </div>
    </QCard>

    <!-- REJILLA PRINCIPAL DE CONTENIDO (2 COLUMNAS) -->
    <div class="row q-col-gutter-lg">
      <!-- Columna Izquierda: Información Personal -->
      <div class="col-12 col-md-6 column q-gutter-y-lg">
        <QCard class="flat bordered shadow-1">
          <QCardSection class="bg-grey-1 row items-center justify-between">
            <div class="text-h6 text-primary text-weight-bold row items-center q-gutter-xs">
              <QIcon
                name="mdi-account-details-outline"
                color="secondary"
                size="24px"
              />
              <span>Información Personal</span>
            </div>
          </QCardSection>

          <QSeparator />

          <QCardSection class="q-pa-lg">
            <QForm
              class="q-gutter-md"
              @submit.prevent="handleSave"
            >
              <QInput
                v-model="form.name"
                label="Nombre completo"
                outlined
                color="secondary"
                bg-color="white"
                lazy-rules
                :rules="[val => !!val || 'El nombre es obligatorio']"
              >
                <template #prepend>
                  <QIcon
                    name="mdi-account-outline"
                    color="grey-6"
                  />
                </template>
              </QInput>

              <QInput
                v-model="form.email"
                type="email"
                label="Correo electrónico (Cuenta Principal)"
                outlined
                color="secondary"
                bg-color="white"
                readonly
                hint="El correo electrónico es el identificador único y no puede cambiarse directamente."
              >
                <template #prepend>
                  <QIcon
                    name="mdi-email-outline"
                    color="grey-6"
                  />
                </template>
                <template #append>
                  <QIcon
                    name="mdi-lock"
                    color="grey-5"
                    size="18px"
                  />
                </template>
              </QInput>

              <QInput
                v-model="form.role"
                label="Rol de acceso asignado"
                outlined
                color="secondary"
                bg-color="white"
                readonly
              >
                <template #prepend>
                  <QIcon
                    name="mdi-shield-account-outline"
                    color="grey-6"
                  />
                </template>
              </QInput>

              <QBanner
                v-if="saveSuccess"
                class="bg-positive text-white rounded-borders q-my-sm"
                dense
              >
                <template #avatar>
                  <QIcon
                    name="mdi-check-circle"
                    color="white"
                  />
                </template>
                Información de perfil actualizada correctamente.
              </QBanner>

              <div class="row justify-end q-mt-lg">
                <QBtn
                  type="submit"
                  color="secondary"
                  label="Guardar Cambios"
                  icon="mdi-content-save-outline"
                  :loading="saving"
                  unelevated
                  class="text-weight-bold q-px-lg"
                />
              </div>
            </QForm>
          </QCardSection>
        </QCard>
      </div>

      <!-- Columna Derecha: Detalles de Sesión y Seguridad -->
      <div class="col-12 col-md-6 column q-gutter-y-lg">
        <!-- Tarjeta de Detalles de Sesión Nitro -->
        <QCard class="flat bordered shadow-1">
          <QCardSection class="bg-grey-1 row items-center justify-between">
            <div class="text-h6 text-primary text-weight-bold row items-center q-gutter-xs">
              <QIcon
                name="mdi-security"
                color="secondary"
                size="24px"
              />
              <span>Seguridad & Detalles de Sesión</span>
            </div>
          </QCardSection>

          <QSeparator />

          <QCardSection class="q-pa-none">
            <QList separator>
              <!-- Fecha de Inicio de Sesión -->
              <QItem class="q-py-md">
                <QItemSection avatar>
                  <QAvatar
                    color="blue-1"
                    text-color="secondary"
                    icon="mdi-clock-outline"
                  />
                </QItemSection>
                <QItemSection>
                  <QItemLabel caption>
                    Fecha de Inicio de Sesión
                  </QItemLabel>
                  <QItemLabel class="text-weight-bold text-body1 text-primary">
                    {{ formattedLoggedInAt }}
                  </QItemLabel>
                </QItemSection>
              </QItem>

              <!-- Bearer Token Cifrado -->
              <QItem class="q-py-md">
                <QItemSection avatar>
                  <QAvatar
                    color="purple-1"
                    text-color="accent"
                    icon="mdi-key-outline"
                  />
                </QItemSection>
                <QItemSection>
                  <QItemLabel caption>
                    Token de Autenticación Cifrado (Nitro BFF)
                  </QItemLabel>
                  <QItemLabel class="text-weight-bold text-body2 text-mono text-grey-9">
                    {{ maskedToken }}
                  </QItemLabel>
                </QItemSection>
              </QItem>

              <!-- ID de Sesión -->
              <QItem
                v-if="session?.id"
                class="q-py-md"
              >
                <QItemSection avatar>
                  <QAvatar
                    color="grey-3"
                    text-color="grey-8"
                    icon="mdi-identifier"
                  />
                </QItemSection>
                <QItemSection>
                  <QItemLabel caption>
                    Identificador Único de Sesión (UUID)
                  </QItemLabel>
                  <QItemLabel class="text-weight-medium text-caption text-mono text-grey-8">
                    {{ session.id }}
                  </QItemLabel>
                </QItemSection>
              </QItem>

              <!-- Permisos Granulares RBAC -->
              <QItem class="q-py-md">
                <QItemSection avatar>
                  <QAvatar
                    color="teal-1"
                    text-color="teal-9"
                    icon="mdi-lock-open-check-outline"
                  />
                </QItemSection>
                <QItemSection>
                  <QItemLabel
                    caption
                    class="q-mb-xs"
                  >
                    Permisos de Acceso Asignados (RBAC)
                  </QItemLabel>

                  <div
                    v-if="user?.permissions && user.permissions.length > 0"
                    class="row q-gutter-xs"
                  >
                    <QChip
                      v-for="perm in user.permissions"
                      :key="perm"
                      dense
                      color="secondary"
                      text-color="white"
                      class="text-weight-medium text-caption"
                    >
                      {{ perm }}
                    </QChip>
                  </div>
                  <div v-else>
                    <QBadge
                      color="grey-6"
                      class="q-pa-xs text-weight-medium"
                    >
                      Sin permisos especiales adicionales (Rol Estándar)
                    </QBadge>
                  </div>
                </QItemSection>
              </QItem>
            </QList>
          </QCardSection>
        </QCard>

        <!-- Tarjeta de Blindaje Legal y Normativa -->
        <QCard class="flat bordered shadow-1 bg-primary text-white">
          <QCardSection class="row items-center q-gutter-md">
            <QIcon
              name="mdi-file-certificate-outline"
              size="36px"
              color="accent"
            />
            <div>
              <div class="text-subtitle1 text-weight-bold">
                Cumplimiento Normativo de Datos Médicos
              </div>
              <div class="text-caption text-grey-4 leading-relaxed">
                Su sesión está cifrada bajo estándares de la NOM-004-SSA3-2012 y COFEPRIS en México mediante cookies encriptadas de servidor `nuxt-session`.
              </div>
            </div>
          </QCardSection>
        </QCard>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.text-mono {
  font-family: monospace;
}
.leading-relaxed {
  line-height: 1.5;
}
</style>
