<script lang="ts" setup>
definePageMeta({
  auth: 'protected',
});

const { user, logout } = useAuth();

async function handleLogout() {
  await logout();
}

// Datos mockeados para que la vista dashboard se vea atractiva y "premium"
const stats = ref([
  { title: 'Pacientes Activos', value: '142', icon: 'mdi-account-group', color: 'primary' },
  { title: 'Citas Hoy', value: '8', icon: 'mdi-calendar-check', color: 'positive' },
  { title: 'Historiales Clínicos', value: '389', icon: 'mdi-file-document-outline', color: 'info' },
  { title: 'Prescripciones', value: '12', icon: 'mdi-pill', color: 'warning' },
]);

const upcomingAppointments = ref([
  { id: 1, time: '09:00 AM', patient: 'María López', type: 'Consulta General', status: 'Confirmada' },
  { id: 2, time: '10:30 AM', patient: 'Carlos Mendoza', type: 'Limpieza Dental', status: 'Pendiente' },
  { id: 3, time: '12:00 PM', patient: 'Ana Gómez', type: 'Ortodoncia', status: 'Confirmada' },
]);
</script>

<template>
  <div>
    <!-- Barra de navegación privada -->
    <QToolbar class="bg-primary text-white shadow-2 q-py-sm">
      <QIcon
        name="mdi-stethoscope"
        size="28px"
        class="q-mr-sm"
      />
      <QToolbarTitle class="text-weight-bold">
        Dental CRM <span class="text-subtitle2 text-weight-light">| Portal Privado</span>
      </QToolbarTitle>

      <QSpace />

      <!-- Información del usuario logueado -->
      <div
        v-if="user"
        class="row items-center q-gutter-sm q-mr-md"
      >
        <QAvatar
          color="white"
          text-color="primary"
          size="32px"
        >
          {{ user.name?.charAt(0).toUpperCase() || 'U' }}
        </QAvatar>
        <div class="column text-right text-caption leading-tight">
          <span class="text-weight-bold text-body2">{{ user.name }}</span>
          <span class="text-grey-4 text-xs">Rol: {{ user.role }}</span>
        </div>
      </div>

      <QBtn
        flat
        round
        dense
        icon="mdi-logout"
        @click="handleLogout"
      >
        <QTooltip>Cerrar Sesión</QTooltip>
      </QBtn>
    </QToolbar>

    <!-- Contenido del Dashboard -->
    <div class="q-pa-lg">
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <h1 class="text-h4 text-weight-bold text-primary q-ma-none">
            Panel de Control
          </h1>
          <p class="text-subtitle1 text-grey-7 q-mt-xs">
            Bienvenido de nuevo, <span class="text-weight-medium">{{ user?.email }}</span>. Aquí tienes el resumen del día.
          </p>
        </div>
        <QBadge
          :color="user?.role === 'admin' ? 'red' : 'blue'"
          class="q-pa-sm text-subtitle2"
        >
          {{ user?.role?.toUpperCase() }}
        </QBadge>
      </div>

      <!-- Tarjetas de Estadísticas -->
      <div class="row q-col-gutter-md q-mb-xl">
        <div
          v-for="stat in stats"
          :key="stat.title"
          class="col-12 col-sm-6 col-md-3"
        >
          <QCard
            class="my-card flat bordered shadow-1 text-white"
            :class="`bg-${stat.color}`"
          >
            <QCardSection class="row items-center justify-between q-py-sm">
              <div class="text-subtitle2 text-uppercase text-weight-medium">
                {{ stat.title }}
              </div>
              <QIcon
                :name="stat.icon"
                size="24px"
              />
            </QCardSection>

            <QCardSection class="q-pt-none q-pb-md">
              <div class="text-h3 text-weight-bold">
                {{ stat.value }}
              </div>
            </QCardSection>
          </QCard>
        </div>
      </div>

      <!-- Sección de Citas y Acciones -->
      <div class="row q-col-gutter-lg">
        <!-- Próximas citas -->
        <div class="col-12 col-md-8">
          <QCard class="flat bordered shadow-1">
            <QCardSection class="bg-grey-1 row items-center justify-between">
              <div class="text-h6 text-primary text-weight-bold">
                Próximas Citas Médicas
              </div>
              <QBtn
                flat
                round
                color="primary"
                icon="mdi-refresh"
              />
            </QCardSection>

            <QSeparator />

            <QCardSection class="q-pa-none">
              <QList separator>
                <QItem
                  v-for="appointment in upcomingAppointments"
                  :key="appointment.id"
                  class="q-py-md"
                >
                  <QItemSection avatar>
                    <QAvatar
                      color="teal-1"
                      text-color="teal"
                      icon="mdi-calendar"
                    />
                  </QItemSection>

                  <QItemSection>
                    <QItemLabel class="text-weight-bold text-subtitle1">
                      {{ appointment.patient }}
                    </QItemLabel>
                    <QItemLabel caption>
                      {{ appointment.type }} &bull; {{ appointment.time }}
                    </QItemLabel>
                  </QItemSection>

                  <QItemSection side>
                    <QBadge
                      :color="appointment.status === 'Confirmada' ? 'positive' : 'warning'"
                      class="q-pa-xs"
                    >
                      {{ appointment.status }}
                    </QBadge>
                  </QItemSection>
                </QItem>
              </QList>
            </QCardSection>
          </QCard>
        </div>

        <!-- Panel lateral de accesos rápidos -->
        <div class="col-12 col-md-4">
          <QCard class="flat bordered shadow-1">
            <QCardSection class="bg-grey-1">
              <div class="text-h6 text-primary text-weight-bold">
                Accesos Rápidos
              </div>
            </QCardSection>

            <QSeparator />

            <QCardSection class="q-gutter-y-sm">
              <QBtn
                color="primary"
                icon="mdi-account-plus"
                label="Registrar Paciente"
                align="left"
                class="full-width q-py-sm"
                flat
                bordered
              />
              <QBtn
                color="primary"
                icon="mdi-calendar-plus"
                label="Agendar Cita"
                align="left"
                class="full-width q-py-sm"
                flat
                bordered
              />
              <QBtn
                color="primary"
                icon="mdi-file-document-plus"
                label="Nueva Historia Clínica"
                align="left"
                class="full-width q-py-sm"
                flat
                bordered
              />
            </QCardSection>
          </QCard>
        </div>
      </div>
    </div>
  </div>
</template>
