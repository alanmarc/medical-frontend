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
          <span class="text-h5 text-weight-bold text-slate-900 logo-text">
            Medical<span class="text-primary text-weight-light">SaaS</span>
          </span>
        </div>
        <div class="gt-sm row items-center q-gutter-lg nav-links text-body2 text-weight-medium">
          <span
            class="cursor-pointer hover-link"
            @click="scrollToSection('features')"
          >Funcionalidades</span>
          <span
            class="cursor-pointer hover-link"
            @click="scrollToSection('security')"
          >Seguridad</span>
          <span
            class="cursor-pointer hover-link"
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
              color="slate-700"
              label="Iniciar Sesión"
              to="/login"
              class="q-px-md text-weight-medium"
            />
            <QBtn
              unelevated
              rounded
              color="emerald-accent"
              label="Agendar Demo"
              class="q-px-lg q-py-sm text-weight-bold cta-nav-btn text-white bg-emerald"
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
            <div class="hero-badge q-px-md q-py-xs q-mb-lg rounded-borders text-caption text-weight-bold text-primary bg-primary-light">
              🚀 CONTROL MULTISEDE DEFINITIVO
            </div>
            <h1 class="text-h2 text-weight-bold leading-tight q-mt-none q-mb-md text-slate-900">
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
                  class="bg-emerald text-white text-weight-bold q-px-xl q-py-md hover-scale shadow-2"
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
        <div class="col-12 col-md-6">
          <div class="mockup-wrapper relative-position">
            <!-- Círculo decorativo difuminado detrás -->
            <div class="blur-blob absolute-top-right" />
            <!-- Ventana del Navegador Mockup -->
            <div class="browser-window flat bordered shadow-3 bg-white">
              <!-- Barra del navegador -->
              <div class="browser-header row items-center justify-between q-px-md q-py-sm bg-grey-1">
                <div class="row q-gutter-xs">
                  <div class="dot bg-red" />
                  <div class="dot bg-yellow" />
                  <div class="dot bg-green" />
                </div>
                <div class="browser-search text-caption text-grey-5 text-center rounded-borders q-px-xl q-py-xs bg-white">
                  medicalsaas.com/app/dashboard
                </div>
                <div style="width: 32px" />
              </div>
              <!-- Contenido del Dashboard Mockup -->
              <div class="browser-content q-pa-lg">
                <div class="row justify-between items-center q-mb-md">
                  <div class="text-subtitle2 text-weight-bold text-slate-800">
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
                      class="stat-box q-pa-sm rounded-borders cursor-pointer transition-all"
                      :class="activeSucursal === sucursal ? 'bg-primary-light border-primary' : 'bg-grey-1 border-light'"
                      @click="activeSucursal = sucursal"
                    >
                      <div class="text-caption text-grey-7">
                        {{ sucursal }}
                      </div>
                      <div class="text-subtitle2 text-weight-bold text-slate-900">
                        {{ data.ingresos }}
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Gráfico de Ingresos Simulado -->
                <div class="chart-container rounded-borders q-pa-md bg-slate-50 relative-position border-light overflow-hidden">
                  <div
                    class="row items-end justify-between full-height q-pt-lg"
                    style="height: 120px;"
                  >
                    <div
                      class="chart-bar bg-blue-300"
                      style="height: 30%;"
                    />
                    <div
                      class="chart-bar bg-blue-400"
                      style="height: 45%;"
                    />
                    <div
                      class="chart-bar bg-blue-500"
                      style="height: 60%;"
                    />
                    <div
                      class="chart-bar bg-primary"
                      style="height: 85%;"
                    />
                    <div
                      class="chart-bar bg-teal-400"
                      style="height: 70%;"
                    />
                    <div
                      class="chart-bar bg-teal-500"
                      style="height: 95%;"
                    />
                  </div>
                  <div class="row justify-between text-caption text-grey-5 q-mt-sm">
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
                  <div class="row items-center q-gutter-sm">
                    <QAvatar
                      color="teal-1"
                      text-color="teal"
                      icon="mdi-account-check"
                      size="36px"
                    />
                    <div>
                      <div class="text-weight-bold text-slate-900 text-caption">
                        Consultas Hoy
                      </div>
                      <div class="text-subtitle2 text-teal font-jakarta text-weight-bold">
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
    <section class="trust-section bg-grey-50 q-py-lg text-center border-y">
      <div class="container">
        <div class="text-subtitle2 text-grey-6 text-uppercase tracking-wider q-mb-md">
          La plataforma en la que confían redes de clínicas en México
        </div>
        <div class="row items-center justify-around q-gutter-md trust-logos">
          <div class="trust-logo">
            Médica Integral
          </div>
          <div class="trust-logo">
            Clínica del Valle
          </div>
          <div class="trust-logo">
            SanaRed
          </div>
          <div class="trust-logo">
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
          <div class="text-caption text-primary text-weight-bold">
            FUNCIONALIDADES CLAVE
          </div>
          <h2 class="text-h4 text-weight-bold text-slate-900 q-mt-xs q-mb-sm">
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
            <div class="bento-card q-pa-xl flat bordered rounded-borders bg-slate-50 transition-all full-height column justify-between">
              <div>
                <div class="icon-box bg-blue-100 text-primary q-pa-sm rounded-borders q-mb-lg flex flex-center inline-block">
                  <QIcon
                    name="mdi-view-dashboard"
                    size="28px"
                  />
                </div>
                <h3 class="text-h6 text-weight-bold text-slate-900 q-mt-none q-mb-md">
                  Panel de Control Centralizado
                </h3>
                <p class="text-body2 text-grey-7 leading-relaxed text-weight-light">
                  Monitorea la operación, las agendas de todos tus médicos y los ingresos de cada sede en tiempo real y desde un solo lugar.
                </p>
              </div>
              <div class="decor-dot bg-blue-200" />
            </div>
          </div>
          <!-- Card 2: Los Datos -->
          <div class="col-12 col-md-4">
            <div class="bento-card q-pa-xl flat bordered rounded-borders bg-slate-50 transition-all full-height column justify-between">
              <div>
                <div class="icon-box bg-teal-100 text-teal q-pa-sm rounded-borders q-mb-lg flex flex-center inline-block">
                  <QIcon
                    name="mdi-chart-bar"
                    size="28px"
                  />
                </div>
                <h3 class="text-h6 text-weight-bold text-slate-900 q-mt-none q-mb-md">
                  Reportes Operativos en un Clic
                </h3>
                <p class="text-body2 text-grey-7 leading-relaxed text-weight-light">
                  Genera analíticas automáticas por sucursal o globales para tomar decisiones estratégicas basadas en datos reales, no en suposiciones.
                </p>
              </div>
              <div class="decor-dot bg-teal-200" />
            </div>
          </div>
          <!-- Card 3: La Seguridad -->
          <div class="col-12 col-md-4">
            <div class="bento-card q-pa-xl flat bordered rounded-borders bg-slate-50 transition-all full-height column justify-between">
              <div>
                <div class="icon-box bg-emerald-100 text-emerald q-pa-sm rounded-borders q-mb-lg flex flex-center inline-block">
                  <QIcon
                    name="mdi-shield-check"
                    size="28px"
                  />
                </div>
                <h3 class="text-h6 text-weight-bold text-slate-900 q-mt-none q-mb-md">
                  Blindaje Legal Garantizado
                </h3>
                <p class="text-body2 text-grey-7 leading-relaxed text-weight-light">
                  Expedientes clínicos que cumplen estrictamente con la NOM-004-SSA3-2012 y lineamientos de COFEPRIS de forma nativa en México.
                </p>
              </div>
              <div class="decor-dot bg-emerald-200" />
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- SECCIÓN 5: BLINDAJE LEGAL Y SEGURIDAD (FONDO OSCURO) -->
    <section
      id="security"
      class="security-section bg-slate-900 text-white q-py-xl"
    >
      <div class="container q-py-lg">
        <div class="row q-col-gutter-xl items-center">
          <div class="col-12 col-md-5">
            <div class="text-caption text-emerald text-weight-bold">
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
                color="emerald"
                class="q-pa-sm text-subtitle2 bg-emerald text-white"
              >
                HIPAA & COFEPRIS Compliant
              </QBadge>
            </div>
          </div>
          <div class="col-12 col-md-7 column q-gutter-y-lg">
            <!-- Bloque A -->
            <div class="row no-wrap items-start q-gutter-md security-block q-pa-lg rounded-borders">
              <QAvatar
                color="slate-800"
                text-color="emerald"
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
                color="slate-800"
                text-color="emerald"
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
      class="testimonials-section q-py-xl bg-slate-50"
    >
      <div class="container q-py-lg">
        <div class="text-center q-mb-xl">
          <div class="text-caption text-primary text-weight-bold">
            TESTIMONIOS
          </div>
          <h2 class="text-h4 text-weight-bold text-slate-900 q-mt-xs q-mb-none">
            Casos de Éxito en Clínicas
          </h2>
        </div>
        <div class="row justify-center">
          <div class="col-12 col-md-8">
            <!-- Card Testimonio Premium -->
            <QCard class="flat bordered q-pa-xl testimonial-card shadow-1 bg-white relative-position">
              <QIcon
                name="mdi-format-quote-open"
                size="64px"
                class="absolute-top-left quote-icon"
              />
              <QCardSection class="q-py-md relative-position">
                <p class="text-h5 text-slate-800 text-weight-light italic leading-relaxed quote-text">
                  "Pasamos de gestionar 3 clínicas con un caos administrativo terrible a coordinar 5 sucursales sin esfuerzo. Los reportes consolidados nos ahorran días enteros de trabajo cada mes."
                </p>
              </QCardSection>
              <QSeparator class="q-my-md" />
              <QCardSection class="row items-center q-py-none q-gutter-md">
                <QAvatar
                  size="56px"
                  color="primary-light"
                >
                  <QIcon
                    name="mdi-account-md"
                    size="36px"
                    color="primary"
                  />
                </QAvatar>
                <div>
                  <div class="text-subtitle1 text-weight-bold text-slate-900 leading-none">
                    Dra. Claudia Mendoza
                  </div>
                  <div class="text-caption text-teal text-weight-medium q-mt-xs">
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
        <!-- Caja con gradiente de fondo (Gradient Box) -->
        <div class="gradient-box q-pa-xl text-center rounded-borders shadow-3 text-white">
          <h2 class="text-h3 text-weight-bold q-mt-none q-mb-md text-white leading-tight">
            ¿Listo para dejar atrás el caos operativo y escalar tu red de clínicas?
          </h2>
          <p class="text-subtitle1 text-teal-100 q-mb-xl text-weight-light max-width-600 q-mx-auto">
            Únete a las redes de clínicas que ya automatizaron su administración, cobranza y cumplimiento legal.
          </p>
          <QBtn
            unelevated
            rounded
            size="lg"
            class="bg-emerald text-white text-weight-bold q-px-xl q-py-md hover-scale shadow-2"
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
/* PALETA DE COLORES PERSONALIZADA */
.text-slate-800 {
  color: #1e293b;
}
.text-slate-900 {
  color: #0f172a;
}
.bg-slate-50 {
  background-color: #f8fafc;
}
.bg-slate-900 {
  background-color: #0f172a;
}
.bg-primary-light {
  background-color: rgba(30, 58, 138, 0.08);
}
.bg-teal-1 {
  background-color: rgba(13, 148, 136, 0.08);
}
.bg-emerald {
  background-color: #059669;
}
.bg-emerald-100 {
  background-color: rgba(5, 150, 105, 0.08);
}
.text-emerald {
  color: #059669;
}
.text-teal-100 {
  color: #ccfbf1;
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
  color: #475569;
  transition: color 0.2s;
  &:hover {
    color: #1e3a8a;
  }
}
.cta-nav-btn {
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.03);
  }
}
/* HERO SECTION */
.hero-section {
  background-radial: radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
  min-height: 80vh;
}
.hero-text-container {
  max-width: 540px;
}
.hero-badge {
  display: inline-block;
  letter-spacing: 0.5px;
}
.text-gradient {
  background: linear-gradient(135deg, #1e3a8a 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
/* BUTTON HOVER EFFECTS */
.hover-scale {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(5, 150, 105, 0.2) !important;
  }
}
/* MOCKUP VISUALS */
.mockup-wrapper {
  perspective: 1000px;
}
.blur-blob {
  width: 300px;
  height: 300px;
  background-color: rgba(6, 182, 212, 0.15);
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
.browser-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.bg-red { background-color: #ef4444; }
.bg-yellow { background-color: #f59e0b; }
.bg-green { background-color: #10b981; }
.stat-box {
  border: 1px solid transparent;
  text-align: center;
}
.border-primary {
  border-color: rgba(30, 58, 138, 0.2) !important;
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
/* TRUST LOGOS */
.trust-logos {
  opacity: 0.7;
}
.trust-logo {
  font-size: 1.2rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: -0.5px;
}
/* BENTO GRID */
.bento-card {
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background-color: #f8fafc;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 30px rgba(15, 23, 42, 0.05);
    background-color: #ffffff;
    border-color: rgba(30, 58, 138, 0.1);
  }
}
.icon-box {
  width: 48px;
  height: 48px;
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
    border-color: rgba(5, 150, 105, 0.3);
  }
}
/* TESTIMONIOS */
.testimonial-card {
  border-radius: 24px;
}
.quote-icon {
  color: rgba(30, 58, 138, 0.04);
  top: 24px;
  left: 24px;
}
.quote-text {
  position: relative;
  z-index: 1;
}
/* FINAL CTA GRADIENT BOX */
.gradient-box {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  border-radius: 32px;
  box-shadow: 0 20px 50px rgba(30, 58, 138, 0.15);
}
.max-width-600 {
  max-width: 600px;
}
.footer-link {
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
  &:hover {
    color: #1e3a8a;
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
