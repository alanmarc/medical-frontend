<script lang="ts" setup>
definePageMeta({
  layout: 'public',
  auth: 'public',
});

const { loggedIn, user } = useAuth();

// Función de scroll suave
function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>

<template>
  <q-page class="bg-grey-1 text-primary q-pb-xl">
    <!-- 1. BARRA DE NAVEGACIÓN -->
    <q-toolbar class="bg-white text-primary shadow-1 q-py-md sticky-top">
      <div class="row justify-center full-width q-px-md">
        <div class="col-12 col-lg-10 row items-center justify-between no-wrap">
          <!-- Logotipo: Escudo con Cruz + MediSecure Pro -->
          <div
            class="row items-center cursor-pointer"
            @click="scrollToSection('hero')"
          >
            <q-avatar
              color="white"
              text-color="accent"
              size="md"
              class="q-mr-sm"
            >
              <q-icon
                name="mdi-shield-plus-outline"
                size="md"
                color="accent"
              />
            </q-avatar>
            <span class="text-h6 text-weight-bold text-primary">
              MediSecure <span class="text-weight-light text-primary">Pro</span>
            </span>
          </div>

          <!-- Enlaces de navegación en el centro (oculto en pantallas pequeñas) -->
          <div class="gt-sm row items-center q-gutter-md">
            <q-btn
              flat
              color="primary"
              no-caps
              label="Funcionalidades"
              class="text-weight-bold"
              @click="scrollToSection('features')"
            />
            <q-btn
              flat
              color="primary"
              no-caps
              label="Seguridad"
              class="text-weight-bold"
              @click="scrollToSection('security')"
            />
            <q-btn
              flat
              color="primary"
              no-caps
              label="Testimonios"
              class="text-weight-bold"
              @click="scrollToSection('testimonials')"
            />
          </div>

          <!-- Acciones de la derecha -->
          <div class="row items-center q-gutter-sm">
            <template v-if="loggedIn">
              <q-btn
                flat
                rounded
                color="primary"
                label="Ir al Dashboard"
                to="/app/dashboard"
                class="text-weight-medium"
              />
              <q-avatar
                color="primary"
                text-color="white"
                size="md"
                class="q-ml-sm shadow-1"
              >
                {{ user?.name?.charAt(0).toUpperCase() || 'U' }}
              </q-avatar>
            </template>
            <template v-else>
              <q-btn
                flat
                color="primary"
                label="Iniciar Sesión"
                to="/login"
                class="text-weight-medium"
              />
              <q-btn
                unelevated
                rounded
                color="secondary"
                label="Agendar Demo"
                class="text-weight-bold q-px-md"
                @click="scrollToSection('cta-final')"
              />
            </template>
          </div>
        </div>
      </div>
    </q-toolbar>

    <!-- 2. SECCIÓN HERO -->
    <div
      id="hero"
      class="row justify-center q-py-xl q-px-md bg-white"
    >
      <div class="col-12 col-lg-10 row q-col-gutter-xl items-center">
        <!-- Izquierda: Texto principal y CTA -->
        <div class="col-12 col-md-6 column justify-center">
          <!-- Badge superior con micro-indicador color morado (accent) -->
          <q-badge
            color="accent"
            class="q-pa-sm q-mb-lg self-start text-caption text-weight-bold row items-center q-gutter-xs bg-purple-1 text-accent"
          >
            <q-icon
              name="mdi-rocket-launch"
              color="accent"
              size="14px"
            />
            <span>CONTROL MULTISEDE DEFINITIVO</span>
          </q-badge>

          <!-- Título principal con realce de color morado (accent) -->
          <h1 class="text-h2 text-weight-bold leading-tight q-mt-none q-mb-md text-primary">
            Toma el <span class="text-accent text-weight-extrabold">control total</span> de tus clínicas multisede.
          </h1>

          <!-- Descripción del producto -->
          <p class="text-subtitle1 text-grey-8 leading-relaxed q-mb-xl text-weight-light">
            Centraliza agendas, médicos y reportes operativos sin importar cuántas sucursales manejes. Simplifica tu gestión, elimina el caos administrativo y asegura el cumplimiento legal de COFEPRIS en México.
          </p>

          <!-- Botón de acción principal usando color corporativo secundario (CTA) -->
          <q-btn
            unelevated
            rounded
            color="secondary"
            size="lg"
            class="text-weight-bold q-px-xl q-py-md shadow-2 q-mb-sm self-start"
            @click="scrollToSection('cta-final')"
          >
            <span>AGENDAR DEMO CORPORATIVA</span>
            <q-icon
              name="mdi-arrow-right"
              class="q-ml-sm"
              size="20px"
            />
          </q-btn>

          <!-- Leyenda aclaratoria -->
          <div class="row items-center q-gutter-xs text-caption text-grey-6 q-pl-xs q-mt-sm">
            <q-icon
              name="mdi-check-circle"
              color="secondary"
              size="16px"
            />
            <span>Sin tarjetas de crédito &bull; Demo personalizada de 15 min</span>
          </div>
        </div>

        <!-- Derecha: Imagen del Mockup del Dashboard -->
        <div class="col-12 col-md-6">
          <q-card class="bg-white q-pa-xs rounded-borders shadow-3">
            <q-img
              src="/medical_hero_dashboard.png"
              class="rounded-borders"
            />
          </q-card>
        </div>
      </div>
    </div>

    <!-- 3. BANDA DE LOGOS DE CONFIANZA -->
    <div class="row justify-center q-py-xl q-px-md bg-grey-2 border-y">
      <div class="col-12 col-lg-10 text-center">
        <div class="text-caption text-grey-6 text-uppercase tracking-wider q-mb-lg">
          La plataforma en la que confían redes de clínicas en México
        </div>
        <div class="row items-center justify-around q-col-gutter-lg">
          <div class="col-6 col-sm-3 text-h6 text-grey-5 text-weight-bold text-center">
            Médica Integral
          </div>
          <div class="col-6 col-sm-3 text-h6 text-grey-5 text-weight-bold text-center">
            Clínica del Valle
          </div>
          <div class="col-6 col-sm-3 text-h6 text-grey-5 text-weight-bold text-center">
            SanaRed
          </div>
          <div class="col-6 col-sm-3 text-h6 text-grey-5 text-weight-bold text-center">
            Hospital Lomas
          </div>
        </div>
      </div>
    </div>

    <!-- 4. SECCIÓN FUNCIONALIDADES (BENTO GRID) -->
    <div
      id="features"
      class="row justify-center q-py-xl q-px-md bg-white"
    >
      <div class="col-12 col-lg-10 column items-center">
        <div class="text-center q-mb-xl">
          <div class="text-caption text-accent text-weight-bold text-uppercase">
            FUNCIONALIDADES CLAVE
          </div>
          <h2 class="text-h4 text-weight-bold text-primary q-mt-xs q-mb-sm">
            Diseñado para resolver el caos de la administración médica
          </h2>
          <p class="text-body1 text-grey-6 text-weight-light">
            Todo lo que necesitas para escalar tu negocio y coordinar tus sucursales en un solo sistema centralizado y seguro.
          </p>
        </div>

        <!-- Bento Grid Layout -->
        <div class="row q-col-gutter-lg justify-center full-width">
          <!-- Card 1 -->
          <div class="col-12 col-md-4 row">
            <q-card class="bg-white flat bordered q-pa-lg column justify-between rounded-borders full-width shadow-1">
              <div class="column">
                <div class="bg-purple-1 text-accent rounded-borders q-pa-md q-mb-lg self-start flex flex-center">
                  <q-icon
                    name="mdi-view-dashboard"
                    size="sm"
                    color="accent"
                  />
                </div>
                <h3 class="text-h6 text-weight-bold text-primary q-mt-none q-mb-md">
                  Panel de Control Centralizado
                </h3>
                <p class="text-body2 text-grey-7 leading-relaxed text-weight-light">
                  Monitorea la operación, las agendas de todos tus médicos y los ingresos de cada sede en tiempo real y desde un solo lugar.
                </p>
              </div>
            </q-card>
          </div>

          <!-- Card 2 -->
          <div class="col-12 col-md-4 row">
            <q-card class="bg-white flat bordered q-pa-lg column justify-between rounded-borders full-width shadow-1">
              <div class="column">
                <div class="bg-purple-1 text-accent rounded-borders q-pa-md q-mb-lg self-start flex flex-center">
                  <q-icon
                    name="mdi-chart-bar"
                    size="sm"
                    color="accent"
                  />
                </div>
                <h3 class="text-h6 text-weight-bold text-primary q-mt-none q-mb-md">
                  Reportes Operativos en un Clic
                </h3>
                <p class="text-body2 text-grey-7 leading-relaxed text-weight-light">
                  Genera analíticas automáticas por sucursal o globales para tomar decisiones estratégicas basadas en datos reales, no en suposiciones.
                </p>
              </div>
            </q-card>
          </div>

          <!-- Card 3 -->
          <div class="col-12 col-md-4 row">
            <q-card class="bg-white flat bordered q-pa-lg column justify-between rounded-borders full-width shadow-1">
              <div class="column">
                <div class="bg-purple-1 text-accent rounded-borders q-pa-md q-mb-lg self-start flex flex-center">
                  <q-icon
                    name="mdi-shield-check"
                    size="sm"
                    color="accent"
                  />
                </div>
                <h3 class="text-h6 text-weight-bold text-primary q-mt-none q-mb-md">
                  Blindaje Legal Garantizado
                </h3>
                <p class="text-body2 text-grey-7 leading-relaxed text-weight-light">
                  Expedientes clínicos que cumplen estrictamente con la NOM-004-SSA3-2012 y lineamientos de COFEPRIS de forma nativa en México.
                </p>
              </div>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. SECCIÓN SEGURIDAD Y COMPLIANCE (FONDO OSCURO) -->
    <div
      id="security"
      class="row justify-center q-py-xl q-px-md bg-primary text-white"
    >
      <div class="col-12 col-lg-10 row q-col-gutter-xl items-center">
        <!-- Columna Izquierda -->
        <div class="col-12 col-md-5 column justify-center">
          <div class="text-caption text-accent text-weight-bold text-uppercase q-mb-sm">
            COMPLIANCE & DATOS
          </div>
          <h2 class="text-h4 text-weight-bold leading-tight q-mt-none q-mb-md text-white">
            Seguridad de nivel bancario y cumplimiento 100% legal
          </h2>
          <p class="text-body1 text-grey-4 text-weight-light leading-relaxed q-mb-lg">
            Sabemos lo delicado que es el manejo de datos de salud en México. Por eso implementamos las mayores protecciones técnicas y normativas vigentes.
          </p>

          <!-- Badge HIPAA -->
          <q-btn
            outline
            rounded
            color="secondary"
            icon="mdi-shield-check"
            label="HIPAA & COFEPRIS Compliant"
            class="text-weight-bold self-start q-px-md"
          />
        </div>

        <!-- Columna Derecha (Lista de Bloques Semánticos) -->
        <div class="col-12 col-md-7">
          <q-list class="q-gutter-y-md">
            <!-- Bloque 1 -->
            <q-item class="bg-grey-10 q-pa-lg rounded-borders row no-wrap items-start q-gutter-md">
              <q-item-section
                avatar
                class="self-start"
              >
                <q-avatar
                  rounded
                  color="accent"
                  text-color="white"
                  icon="mdi-file-document-outline"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h6 text-weight-bold text-white q-mb-xs">
                  Cumplimiento Normativo
                </q-item-label>
                <q-item-label class="text-body2 text-grey-4 text-weight-light leading-relaxed">
                  Diseñado bajo los estándares de la <strong>NOM-004-SSA3-2012</strong> para el expediente clínico electrónico y totalmente preparado para verificaciones rutinarias de <strong>COFEPRIS</strong>.
                </q-item-label>
              </q-item-section>
            </q-item>

            <!-- Bloque 2 -->
            <q-item class="bg-grey-10 q-pa-lg rounded-borders row no-wrap items-start q-gutter-md">
              <q-item-section
                avatar
                class="self-start"
              >
                <q-avatar
                  rounded
                  color="accent"
                  text-color="white"
                  icon="mdi-lock-outline"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h6 text-weight-bold text-white q-mb-xs">
                  Seguridad Multisede Avanzada
                </q-item-label>
                <q-item-label class="text-body2 text-grey-4 text-weight-light leading-relaxed">
                  Control estricto de permisos de usuario (RBAC) para que cada médico acceda únicamente a sus expedientes, mientras tú mantienes una visión global cifrada de extremo a extremo.
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>

    <!-- 6. SECCIÓN TESTIMONIOS -->
    <div
      id="testimonials"
      class="row justify-center q-py-xl q-px-md bg-grey-1"
    >
      <div class="col-12 col-lg-10 column items-center">
        <div class="text-center q-mb-xl">
          <div class="text-caption text-accent text-weight-bold text-uppercase">
            TESTIMONIOS
          </div>
          <h2 class="text-h4 text-weight-bold text-primary q-mt-xs q-mb-none">
            Casos de Éxito en Clínicas
          </h2>
        </div>

        <!-- Tarjeta de Testimonio -->
        <q-card
          class="bg-white flat bordered q-pa-xl rounded-borders shadow-1 full-width text-center"
          style="max-width: 800px;"
        >
          <!-- Icono de comillas -->
          <q-icon
            name="mdi-format-quote-open"
            size="64px"
            color="purple-1"
            class="q-mb-md"
          />

          <p class="text-h5 text-primary text-weight-light italic leading-relaxed text-grey-9 q-mb-xl">
            "Pasamos de gestionar 3 clínicas con un caos administrativo terrible a coordinar 5 sucursales sin esfuerzo. Los reportes consolidados nos ahorran días enteros de trabajo cada mes."
          </p>

          <q-separator class="q-my-lg" />

          <!-- Autor del testimonio -->
          <div class="row items-center justify-center q-gutter-md">
            <q-avatar
              size="56px"
              class="shadow-1"
            >
              <q-img src="/doctor_avatar.png" />
            </q-avatar>
            <div class="text-left">
              <div class="text-subtitle1 text-weight-bold text-primary leading-none">
                Dra. Claudia Mendoza
              </div>
              <div class="text-caption text-accent text-weight-medium q-mt-xs">
                Directora de Operaciones en Médica Integral
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- 7. SECCIÓN CTA FINAL & FOOTER -->
    <div
      id="cta-final"
      class="row justify-center q-py-xl q-px-md bg-white"
    >
      <div class="col-12 col-lg-10">
        <!-- Caja CTA -->
        <q-card class="bg-primary text-white q-pa-xl text-center shadow-3 rounded-borders">
          <h2 class="text-h3 text-weight-bold q-mt-none q-mb-md text-white leading-tight">
            ¿Listo para dejar atrás el caos operativo y escalar tu red de clínicas?
          </h2>
          <p class="text-subtitle1 text-grey-3 q-mb-xl text-weight-light q-mx-auto">
            Únete a las redes de clínicas que ya automatizaron su administración, cobranza y cumplimiento legal.
          </p>

          <q-btn
            unelevated
            rounded
            color="secondary"
            size="lg"
            class="text-weight-bold q-px-xl q-py-md shadow-2"
            @click="scrollToSection('hero')"
          >
            <span>AGENDAR DEMOSTRACIÓN PERSONALIZADA</span>
            <q-icon
              name="mdi-chevron-right"
              size="24px"
              class="q-ml-xs"
            />
          </q-btn>
        </q-card>

        <!-- Pie de página -->
        <footer class="q-mt-xl q-pt-lg border-t text-caption text-grey-6">
          <div class="row justify-between items-center q-col-gutter-md">
            <div>
              &copy; {{ new Date().getFullYear() }} MediSecure Pro. Todos los derechos reservados. Cumplimiento HIPAA/GDPR/COFEPRIS.
            </div>
            <div class="row q-gutter-md justify-center text-weight-medium">
              <q-btn
                flat
                dense
                no-caps
                label="Términos y Condiciones"
                class="text-grey-6"
              />
              <q-btn
                flat
                dense
                no-caps
                label="Aviso de Privacidad"
                class="text-grey-6"
              />
              <q-btn
                flat
                dense
                no-caps
                label="Soporte Técnico"
                class="text-grey-6"
              />
              <q-btn
                flat
                dense
                no-caps
                label="Contacto"
                class="text-grey-6"
              />
            </div>
          </div>
        </footer>
      </div>
    </div>
  </q-page>
</template>
