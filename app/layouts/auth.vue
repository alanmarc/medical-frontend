<script lang="ts" setup>
const { user, logout } = useAuth();
const leftDrawerOpen = ref(true);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

async function handleLogout() {
  await logout();
}

const navItems = [
  { label: 'Panel de Control', icon: 'mdi-view-dashboard', to: '/app/dashboard' },
  { label: 'Pacientes', icon: 'mdi-account-group', to: '/app/patients' },
  { label: 'Usuarios & Personal', icon: 'mdi-account-multiple-outline', to: '/app/users' },
  { label: 'Citas Médicas', icon: 'mdi-calendar-check', to: '/app/appointments' },
  { label: 'Expedientes Clínicos', icon: 'mdi-file-document-outline', to: '/app/records' },
  { label: 'Mi Perfil', icon: 'mdi-account-circle-outline', to: '/app/profile' },
];
</script>

<template>
  <QLayout view="lHh LpR lff">
    <!-- BARRA SUPERIOR (TOOLBAR) -->
    <QHeader
      elevated
      class="bg-primary text-white q-py-xs"
    >
      <QToolbar>
        <QBtn
          flat
          dense
          round
          icon="mdi-menu"
          aria-label="Menu"
          class="q-mr-sm"
          @click="toggleLeftDrawer"
        />

        <div
          class="row items-center cursor-pointer"
          @click="navigateTo('/app/dashboard')"
        >
          <QAvatar
            color="white"
            text-color="primary"
            size="32px"
            class="q-mr-sm"
          >
            <QIcon
              name="mdi-shield-plus-outline"
              size="22px"
              color="secondary"
            />
          </QAvatar>
          <QToolbarTitle class="text-weight-bold text-subtitle1">
            MediSecure <span class="text-weight-light">Pro</span>
            <span class="gt-xs text-caption text-grey-4 text-weight-light q-ml-sm">| CRM Médico</span>
          </QToolbarTitle>
        </div>

        <QSpace />

        <!-- INFORMACIÓN DEL USUARIO LOGUEADO -->
        <div
          v-if="user"
          class="row items-center q-gutter-sm q-mr-md cursor-pointer"
          @click="navigateTo('/app/profile')"
        >
          <QAvatar
            color="secondary"
            text-color="white"
            size="34px"
            class="shadow-1"
          >
            {{ user.name?.charAt(0).toUpperCase() || 'U' }}
          </QAvatar>

          <div class="column text-right text-caption leading-tight gt-xs">
            <span class="text-weight-bold text-body2 text-white">{{ user.name }}</span>
            <span class="text-grey-4 text-xs">Rol: {{ user.role }}</span>
          </div>
        </div>

        <!-- BOTÓN CERRAR SESIÓN -->
        <QBtn
          flat
          round
          dense
          icon="mdi-logout"
          color="white"
          @click="handleLogout"
        >
          <QTooltip>Cerrar Sesión</QTooltip>
        </QBtn>
      </QToolbar>
    </QHeader>

    <!-- MENÚ LATERAL (DRAWER) -->
    <QDrawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="260"
      class="bg-grey-1"
    >
      <!-- Cabecera del Menú Lateral -->
      <div class="q-pa-md bg-white border-b">
        <div class="text-caption text-uppercase text-weight-bold text-grey-6">
          Navegación Principal
        </div>
      </div>

      <!-- Lista de Navegación -->
      <QList
        padding
        class="q-px-sm"
      >
        <QItem
          v-for="item in navItems"
          :key="item.to"
          v-ripple
          clickable
          :to="item.to"
          active-class="bg-blue-1 text-secondary text-weight-bold rounded-borders"
          class="rounded-borders q-mb-xs text-grey-8"
        >
          <QItemSection avatar>
            <QIcon
              :name="item.icon"
              size="22px"
            />
          </QItemSection>

          <QItemSection>
            <QItemLabel class="text-weight-medium">
              {{ item.label }}
            </QItemLabel>
          </QItemSection>
        </QItem>
      </QList>

      <!-- Pie del Menú Lateral -->
      <div class="absolute-bottom q-pa-md bg-white border-t text-center text-caption text-grey-6">
        <div class="row items-center justify-center q-gutter-xs">
          <QIcon
            name="mdi-shield-check"
            color="positive"
            size="16px"
          />
          <span>COFEPRIS &bull; HIPAA Compliant</span>
        </div>
      </div>
    </QDrawer>

    <!-- CONTENIDOR PRINCIPAL DE PÁGINAS -->
    <QPageContainer>
      <slot />
    </QPageContainer>
  </QLayout>
</template>

<style lang="scss" scoped>
.leading-tight {
  line-height: 1.25;
}
.border-b {
  border-bottom: 1px solid #e0e0e0;
}
.border-t {
  border-top: 1px solid #e0e0e0;
}
</style>
