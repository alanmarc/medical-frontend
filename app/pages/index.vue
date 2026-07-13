<script lang="ts" setup>
definePageMeta({ layout: 'public' });

const { loggedIn, user } = useAuth();

// Estado interactivo del mockup
const activeSucursal = ref('Condesa');
const sucursalesData = ref({
  Condesa: { ingresos: '$142,500', consultas: 320, estado: 'Óptimo', color: 'teal' },
  Roma: { ingresos: '$118,200', consultas: 280, estado: 'Óptimo', color: 'primary' },
  Polanco: { ingresos: '$189,400', consultas: 410, estado: 'Verificando', color: 'warning' },
});

// Función de scroll suave
function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>

<template>
  <div class="landing-page font-jakarta">
    <!-- SECCIÓN 1: NAVBAR -->
    <QToolbar class="bg-white text-dark shadow-1 q-py-md fixed-navbar">
      <div class="container row items-center justify-between full-width no-wrap">
        <div
          class="row items-center cursor-pointer"
          @click="scrollToSection('hero')"
        >
          <QIcon
            name="mdi-stethoscope"
            size="32px"
            color="primary"
            class="q-mr-xs"
          />
          <span class="text-h5 text-weight-bold text-primary logo-text">
            Medical<span class="text-secondary text-weight-light">SaaS</span>
          </span>
        </div>

        <div class="gt-sm row items-center q-gutter-lg nav-links text-body2 text-weight-medium">
          <span
            class="cursor-pointer hover-link text-grey-8"
            @click="scrollToSection('features')"
          >Funcionalidades</span>
          <span
            class="cursor-pointer hover-link text-grey-8"
            @click="scrollToSection('security')"
          >Seguridad</span>
          <span
            class="cursor-pointer hover-link text-grey-8"
            @click="scrollToSection('testimonials')"
          >Testimonios</span>
        </div>

        <div class="row items-center q-gutter-sm">
          <template v-if="loggedIn">
            <QBtn
              flat
              rounded
              color="primary"
              label="Ir al Dashboard"
              to="/app/dashboard"
              class="q-px-md text-weight-medium"
            />
            <QAvatar
              color="primary"
              text-color="white"
              size="32px"
              class="q-ml-sm shadow-1"
            >
              {{ user?.name?.charAt(0).toUpperCase() }}
            </QAvatar>
          </template>
          <template v-else>
            <QBtn
              flat
              rounded
              color="grey-9"
              label="Iniciar Sesión"
              to="/login"
              class="q-px-md text-weight-medium"
            />
            <QBtn
              unelevated
              rounded
              color="secondary"
              label="Agendar Demo"
              class="q-px-lg q-py-sm text-weight-bold hover-scale"
              @click="scrollToSection('cta-final')"
            />
          </template>
        </div>
      </div>
    </QToolbar>

    <!-- SECCIÓN 2: HERO SECTION -->
    <section
      id="hero"
      class="hero-section q-py-xl flex flex-center"
    >
      <div class="container row q-col-gutter-xl items-center">
        <!-- Columna Izquierda: Texto e Impacto -->
        <div class="col-12 col-md-6 flex flex-start">
          <div class="hero-text-container">
            <div class="q-px-md q-py-xs q-mb-lg rounded-borders text-caption text-weight-bold text-secondary bg-blue-1 inline-block">
              🚀 CONTROL MULTISEDE DEFINITIVO
            </div>

            <h1 class="text-h2 text-weight-bold leading-tight q-mt-none q-mb-md text-primary">
              Toma el
              <span class="text-gradient text-weight-extrabold">control total</span>
              de tus clínicas multisede.
            </h1>

            <p class="text-subtitle1 text-grey-8 leading-relaxed q-mb-xl text-weight-light">
              Centraliza agendas, médicos y reportes operativos sin importar cuántas sucursales manejes.
              Simplifica tu gestión, elimina el caos administrativo y asegura el cumplimiento legal de COFEPRIS en México.
            </p>

            <div class="column q-gutter-y-sm">
              <div class="row items-center q-gutter-sm">
                <QBtn
                  unelevated
                  rounded
                  size="lg"
                  color="secondary"
                  class="text-weight-bold q-px-xl q-py-md hover-scale shadow-2"
                  @click="scrollToSection('cta-final')"
                >
                  <span class="q-mr-sm">Agendar Demo Corporativa</span>
                  <QIcon
                    name="mdi-arrow-right"
                    size="20px"
                  />
                </QBtn>
              </div>
              <div class="text-caption text-grey-6 q-pl-sm">
                Sin tarjetas de crédito &bull; Demo personalizada de 15 min
              </div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Visual Mockup -->
        <div class="col-12 col-md-6">
          <div class="mockup-wrapper relative-position">
            <!-- Círculo decorativo difuminado detrás -->
            <div class="blur-blob absolute-top-right" />

            <!-- Ventana del Navegador Mockup -->
            <div class="browser-window flat bordered shadow-3 bg-white">
              <!-- Barra del navegador -->
              <div class="browser-header row items-center justify-between q-px-md q-py-sm bg-grey-2">
                <div class="row q-gutter-xs">
                  <div class="dot bg-negative" />
                  <div class="dot bg-warning" />
                  <div class="dot bg-positive" />
                </div>
                <div class="browser-search text-caption text-grey-6 text-center rounded-borders q-px-xl q-py-xs bg-white">
                  medicalsaas.com/app/dashboard
                </div>
                <div style="width: 32px" />
              </div>

              <!-- Contenido del Dashboard Mockup -->
              <div class="browser-content q-pa-lg">
                <div class="row justify-between items-center q-mb-md">
                  <div class="text-subtitle2 text-weight-bold text-primary">
                    Resumen Médico Consolidado
                  </div>
                  <QBadge
                    color="positive"
                    class="q-pa-xs text-caption"
                  >
                    COFEPRIS NOM-004 Ok
                  </QBadge>
                </div>

                <div class="row q-col-gutter-md q-mb-md">
                  <div
                    v-for="(data, sucursal) in sucursalesData"
                    :key="sucursal"
                    class="col-4"
                  >
                    <div
                      class="stat-box q-pa-sm rounded-borders cursor-pointer transition-all border-light"
                      :class="activeSucursal === sucursal ? 'bg-blue-1 text-primary border-primary-light' : 'bg-grey-2 text-grey-8'"
                      @click="activeSucursal = sucursal"
                    >
                      <div class="text-caption text-grey-7">
                        {{ sucursal }}
                      </div>
                      <div class="text-subtitle2 text-weight-bold text-primary">
                        {{ data.ingresos }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Gráfico de Ingresos Simulado -->
                <div class="chart-container rounded-borders q-pa-md bg-grey-2 relative-position border-light overflow-hidden">
                  <div
                    class="row items-end justify-between full-height q-pt-lg"
                    style="height: 120px;"
                  >
                    <div
                      class="chart-bar bg-blue-3"
                      style="height: 30%;"
                    />
                    <div
                      class="chart-bar bg-blue-4"
                      style="height: 45%;"
                    />
                    <div
                      class="chart-bar bg-blue-5"
                      style="height: 60%;"
                    />
                    <div
                      class="chart-bar bg-primary"
                      style="height: 85%;"
                    />
                    <div
                      class="chart-bar bg-accent"
                      style="height: 70%;"
                    />
                    <div
                      class="chart-bar bg-secondary"
                      style="height: 95%;"
                    />
                  </div>
                  <div class="row justify-between text-caption text-grey-6 q-mt-sm">
                    <span>Ene</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Abr</span>
                    <span>May</span>
                    <span>Jun</span>
                  </div>
                </div>

                <!-- Tarjeta Flotante Glassmorphic -->
                <div class="floating-glass-card absolute-bottom-left shadow-2 rounded-borders q-pa-md">
                  <div class="row items-center q-gutter-sm no-wrap">
                    <QAvatar
                      color="blue-1"
                      text-color="primary"
                      icon="mdi-account-check"
                      size="36px"
                    />
                    <div>
                      <div class="text-weight-bold text-primary text-caption">
                        Consultas Hoy
                      </div>
                      <div class="text-subtitle2 text-secondary font-jakarta text-weight-bold">
                        {{ sucursalesData[activeSucursal as keyof typeof sucursalesData].consultas }} pac.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECCIÓN 3: LOGOS DE CONFIANZA -->
    <section class="trust-section bg-grey-2 q-py-lg text-center border-y">
      <div class="container">
        <div class="text-subtitle2 text-grey-6 text-uppercase tracking-wider q-mb-md">
          La plataforma en la que confían redes de clínicas en México
        </div>
        <div class="row items-center justify-around q-gutter-md trust-logos">
          <div class="trust-logo text-grey-5 text-h6 text-weight-bold">
            Médica Integral
          </div>
          <div class="trust-logo text-grey-5 text-h6 text-weight-bold">
            Clínica del Valle
          </div>
          <div class="trust-logo text-grey-5 text-h6 text-weight-bold">
            SanaRed
          </div>
          <div class="trust-logo text-grey-5 text-h6 text-weight-bold">
            Hospital Lomas
          </div>
        </div>
      </div>
    </section>

    <!-- SECCIÓN 4: DOLORES VS SOLUCIONES (BENTO GRID) -->
    <section
      id="features"
      class="features-section q-py-xl bg-white"
    >
      <div class="container">
        <div class="text-center q-mb-xl">
          <div class="text-caption text-secondary text-weight-bold">
            FUNCIONALIDADES CLAVE
          </div>
          <h2 class="text-h4 text-weight-bold text-primary q-mt-xs q-mb-sm">
            Diseñado para resolver el caos de la administración médica
          </h2>
          <p class="text-body1 text-grey-6 text-weight-light">
            Todo lo que necesitas para escalar tu negocio y coordinar tus sucursales en un solo sistema.
          </p>
        </div>

        <!-- Bento Grid Layout -->
        <div class="row q-col-gutter-lg justify-center">
          <!-- Card 1: El Control -->
          <div class="col-12 col-md-4">
            <QCard class="bento-card q-pa-xl flat bordered bg-grey-1 transition-all full-height column justify-between rounded-borders">
              <div>
                <div class="bg-blue-1 text-primary q-pa-md rounded-borders inline-block q-mb-lg flex flex-center">
                  <QIcon
                    name="mdi-view-dashboard"
                    size="28px"
                  />
                </div>
                <h3 class="text-h6 text-weight-bold text-primary q-mt-none q-mb-md">
                  Panel de Control Centralizado
                </h3>
                <p class="text-body2 text-grey-7 leading-relaxed text-weight-light">
                  Monitorea la operación, las agendas de todos tus médicos and los ingresos de cada sede en tiempo real y desde un solo lugar.
                </p>
              </div>
              <div class="decor-dot bg-blue-200" />
            </QCard>
          </div>

          <!-- Card 2: Los Datos -->
          <div class="col-12 col-md-4">
            <QCard class="bento-card q-pa-xl flat bordered bg-grey-1 transition-all full-height column justify-between rounded-borders">
              <div>
                <div class="bg-blue-1 text-secondary q-pa-md rounded-borders inline-block q-mb-lg flex flex-center">
                  <QIcon
                    name="mdi-chart-bar"
                    size="28px"
                  />
                </div>
                <h3 class="text-h6 text-weight-bold text-primary q-mt-none q-mb-md">
                  Reportes Operativos en un Clic
                </h3>
                <p class="text-body2 text-grey-7 leading-relaxed text-weight-light">
                  Genera analíticas automáticas por sucursal o globales para tomar decisiones estratégicas basadas en datos reales, no en suposiciones.
                </p>
              </div>
              <div class="decor-dot bg-teal-200" />
            </QCard>
          </div>

          <!-- Card 3: La Seguridad -->
          <div class="col-12 col-md-4">
            <QCard class="bento-card q-pa-xl flat bordered bg-grey-1 transition-all full-height column justify-between rounded-borders">
              <div>
                <div class="bg-blue-1 text-accent q-pa-md rounded-borders inline-block q-mb-lg flex flex-center">
                  <QIcon
                    name="mdi-shield-check"
                    size="28px"
                  />
                </div>
                <h3 class="text-h6 text-weight-bold text-primary q-mt-none q-mb-md">
                  Blindaje Legal Garantizado
                </h3>
                <p class="text-body2 text-grey-7 leading-relaxed text-weight-light">
                  Expedientes clínicos que cumplen estrictamente con la NOM-004-SSA3-2012 y lineamientos de COFEPRIS de forma nativa en México.
                </p>
              </div>
              <div class="decor-dot bg-emerald-200" />
            </QCard>
          </div>
        </div>
      </div>
    </section>

    <!-- SECCIÓN 5: BLINDAJE LEGAL Y SEGURIDAD (FONDO OSCURO) -->
    <section
      id="security"
      class="bg-primary text-white q-py-xl"
    >
      <div class="container q-py-lg">
        <div class="row q-col-gutter-xl items-center">
          <div class="col-12 col-md-5">
            <div class="text-caption text-accent text-weight-bold">
              COMPLIANCE & DATOS
            </div>
            <h2 class="text-h4 text-weight-bold leading-tight q-mt-xs q-mb-md text-white">
              Seguridad de nivel bancario y cumplimiento 100% legal
            </h2>
            <p class="text-body1 text-grey-4 text-weight-light leading-relaxed">
              Sabemos lo delicado que es el manejo de datos de salud en México. Por eso implementamos las mayores protecciones técnicas y normativas vigentes.
            </p>
            <div class="q-mt-xl">
              <QBadge
                color="secondary"
                class="q-pa-sm text-subtitle2 text-white"
              >
                HIPAA & COFEPRIS Compliant
              </QBadge>
            </div>
          </div>

          <div class="col-12 col-md-7 column q-gutter-y-lg">
            <!-- Bloque A -->
            <div class="row no-wrap items-start q-gutter-md security-block q-pa-lg rounded-borders">
              <QAvatar
                color="grey-10"
                text-color="accent"
                icon="mdi-balance-sheet"
                size="48px"
                class="flex-shrink shadow-1"
              />
              <div>
                <div class="text-h6 text-weight-bold q-mb-xs text-white">
                  Cumplimiento Normativo
                </div>
                <p class="text-body2 text-grey-4 text-weight-light leading-relaxed">
                  Diseñado bajo los estándares de la <strong>NOM-004-SSA3-2012</strong> para el expediente clínico electrónico y totalmente preparado para verificaciones rutinarias de <strong>COFEPRIS</strong>.
                </p>
              </div>
            </div>

            <!-- Bloque B -->
            <div class="row no-wrap items-start q-gutter-md security-block q-pa-lg rounded-borders">
              <QAvatar
                color="grey-10"
                text-color="accent"
                icon="mdi-lock-pattern"
                size="48px"
                class="flex-shrink shadow-1"
              />
              <div>
                <div class="text-h6 text-weight-bold q-mb-xs text-white">
                  Seguridad Multisede Avanzada
                </div>
                <p class="text-body2 text-grey-4 text-weight-light leading-relaxed">
                  Control estricto de permisos de usuario (RBAC) para que cada médico acceda únicamente a sus expedientes, mientras tú mantienes una visión global cifrada de extremo a extremo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECCIÓN 6: PRUEBA SOCIAL (TESTIMONIOS) -->
    <section
      id="testimonials"
      class="q-py-xl bg-grey-1"
    >
      <div class="container q-py-lg">
        <div class="text-center q-mb-xl">
          <div class="text-caption text-secondary text-weight-bold">
            TESTIMONIOS
          </div>
          <h2 class="text-h4 text-weight-bold text-primary q-mt-xs q-mb-none">
            Casos de Éxito en Clínicas
          </h2>
        </div>

        <div class="row justify-center">
          <div class="col-12 col-md-8">
            <!-- Card Testimonio Premium -->
            <QCard
              class="flat bordered q-pa-xl testimonial-card shadow-1 bg-white relative-position"
              style="border-radius: 20px;"
            >
              <QIcon
                name="mdi-format-quote-open"
                size="64px"
                class="absolute-top-left quote-icon"
              />

              <QCardSection class="q-py-md relative-position">
                <p class="text-h5 text-primary text-weight-light italic leading-relaxed quote-text text-grey-9">
                  "Pasamos de gestionar 3 clínicas con un caos administrativo terrible a coordinar 5 sucursales sin esfuerzo. Los reportes consolidados nos ahorran días enteros de trabajo cada mes."
                </p>
              </QCardSection>

              <QSeparator class="q-my-md" />

              <QCardSection class="row items-center q-py-none q-gutter-md">
                <QAvatar
                  size="56px"
                  color="blue-1"
                >
                  <QIcon
                    name="mdi-account-md"
                    size="36px"
                    color="secondary"
                  />
                </QAvatar>
                <div>
                  <div class="text-subtitle1 text-weight-bold text-primary leading-none">
                    Dra. Claudia Mendoza
                  </div>
                  <div class="text-caption text-secondary text-weight-medium q-mt-xs">
                    Directora de Operaciones en Médica Integral
                  </div>
                </div>
              </QCardSection>
            </QCard>
          </div>
        </div>
      </div>
    </section>

    <!-- SECCIÓN 7: FOOTER / CTA FINAL -->
    <section
      id="cta-final"
      class="cta-final-section q-py-xl bg-white"
    >
      <div class="container">
        <!-- Caja con gradiente de fondo (Gradient Box) utilizando variables CSS del core de Quasar -->
        <div
          class="gradient-box q-pa-xl text-center shadow-3 text-white"
          style="background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%); border-radius: 24px;"
        >
          <h2 class="text-h3 text-weight-bold q-mt-none q-mb-md text-white leading-tight">
            ¿Listo para dejar atrás el caos operativo y escalar tu red de clínicas?
          </h2>
          <p class="text-subtitle1 text-blue-1 q-mb-xl text-weight-light max-width-600 q-mx-auto">
            Únete a las redes de clínicas que ya automatizaron su administración, cobranza y cumplimiento legal.
          </p>
          <QBtn
            unelevated
            rounded
            size="lg"
            color="white"
            text-color="primary"
            class="text-weight-bold q-px-xl q-py-md hover-scale shadow-2"
          >
            <span>Agendar demostración personalizada</span>
            <QIcon
              name="mdi-chevron-right"
              size="24px"
              class="q-ml-xs"
            />
          </QBtn>
        </div>

        <!-- Footer Clásico -->
        <footer class="q-mt-xl q-pt-lg border-t text-caption text-grey-6 text-center">
          <div class="row justify-between items-center q-col-gutter-md">
            <div>
              &copy; {{ new Date().getFullYear() }} MedicalSaaS. Todos los derechos reservados.
            </div>
            <div class="row q-gutter-md justify-center text-weight-medium">
              <a
                href="#"
                class="footer-link cursor-pointer"
              >Términos y Condiciones</a>
              <a
                href="#"
                class="footer-link cursor-pointer"
              >Aviso de Privacidad</a>
            </div>
          </div>
        </footer>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
/* FUENTE Y DISEÑO GLOBAL */
.font-jakarta {
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.border-light {
  border: 1px solid rgba(0, 0, 0, 0.08);
}
.border-y {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

/* NAVBAR */
.fixed-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(12px);
  background-color: rgba(255, 255, 255, 0.9) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.logo-text {
  letter-spacing: -0.5px;
}

.hover-link {
  transition: color 0.2s;
  &:hover {
    color: var(--q-primary) !important;
  }
}

/* HERO SECTION */
.hero-section {
  background-radial: radial-gradient(circle at 80% 20%, rgba(2, 132, 199, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
  min-height: 80vh;
}

.hero-text-container {
  max-width: 540px;
}

.text-gradient {
  background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* BUTTON HOVER EFFECTS */
.hover-scale {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(2, 132, 199, 0.2) !important;
  }
}

/* MOCKUP VISUALS */
.mockup-wrapper {
  perspective: 1000px;
}

.blur-blob {
  width: 300px;
  height: 300px;
  background-color: rgba(14, 165, 233, 0.15);
  filter: blur(80px);
  border-radius: 50%;
  z-index: 0;
}

.browser-window {
  border-radius: 16px;
  overflow: hidden;
  z-index: 1;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.stat-box {
  border: 1px solid transparent;
  text-align: center;
}

.border-primary-light {
  border-color: rgba(2, 132, 199, 0.2) !important;
}

.chart-bar {
  width: 12%;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease-out;
}

.floating-glass-card {
  backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.4);
  bottom: 20px;
  left: -30px;
  width: 180px;
  z-index: 10;
}

/* BENTO GRID */
.bento-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 30px rgba(15, 23, 42, 0.05);
    background-color: #ffffff !important;
    border-color: rgba(2, 132, 199, 0.2);
  }
}

.decor-dot {
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  opacity: 0.15;
  filter: blur(10px);
}

/* SEGURIDAD COMPLIANCE */
.security-block {
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s;
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(14, 165, 233, 0.3);
  }
}

/* TESTIMONIOS */
.quote-icon {
  color: rgba(15, 23, 42, 0.03);
  top: 24px;
  left: 24px;
}

.quote-text {
  position: relative;
  z-index: 1;
}

.max-width-600 {
  max-width: 600px;
}

.footer-link {
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
  &:hover {
    color: var(--q-primary);
  }
}

/* RESPONSIVE DESIGN ADJUSTMENTS */
@media (max-width: 960px) {
  .hero-text-container {
    text-align: center;
    margin: 0 auto;
  }
  .flex-start {
    justify-content: center;
  }
  .floating-glass-card {
    left: 20px;
    bottom: -15px;
  }
  .text-h2 {
    font-size: 2.8rem;
  }
}
</style>
