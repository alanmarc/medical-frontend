# API Integration Guide — Medical CRM

> **Versión:** Julio 2026 · **Stack:** AdonisJS 6 · Lucid ORM · VineJS · Bouncer · PostgreSQL  
> **Base URL:** `http://<host>/api`  
> **Propósito:** Referencia autocontenida para que el equipo Frontend (o un agente de IA) integre esta API sin requerir contexto adicional.

---

## Tabla de Contenidos

- [Sección A — Diagrama y Orden Recomendado de Integración](#sección-a)
- [Sección B — Interfaces TypeScript (Modelos y DTOs)](#sección-b)
- [Sección C — Catálogo Detallado de Endpoints](#sección-c)
- [Sección D — Reglas de Negocio y Consideraciones de Integración](#sección-d)

---

## Sección A — Diagrama y Orden Recomendado de Integración

### Flujo de integración recomendado

```
PASO 1 — Autenticación (POST /api/login)
  Obtener Bearer Token → guardarlo en el cliente
  TODAS las rutas subsiguientes requieren este token

       ↓

PASO 2 — Configuración del Tenant (hospitales + sucursales)
  GET /api/hospitals  →  GET /api/branches
  Necesario para obtener branchId y hospitalId del contexto del usuario

       ↓

PASO 3 — Catálogos de referencia (users + products + suppliers)
  GET /api/users      → para asignar médicos/responsables
  GET /api/products   → para selects en prescripciones/inventario
  GET /api/suppliers  → para crear órdenes de compra

       ↓

PASO 4 — Módulos clínicos principales
  POST /api/patients          → registrar paciente
  POST /api/appointments      → crear cita
  POST /api/medical_histories → registrar historial
  POST /api/prescriptions     → emitir receta con items

       ↓

PASO 5 — Módulo de Inventario y Compras
  GET  /api/inventory                          → consultar stock
  POST /api/purchases                          → crear orden de compra
  PUT  /api/purchases/:id/receive              → recibir y actualizar stock
  PUT  /api/prescriptions/:id/items/:itemId/dispense → dispensar
  POST /api/inventory/transfers                → traspasar entre sucursales
```

### Justificación del orden

| Paso | Por qué primero |
|------|-----------------|
| **1. Auth** | El token Bearer es requerido en todos los demás endpoints. Sin él, toda petición devuelve `401`. |
| **2. Hospitales y Sucursales** | El `branchId` es la fuente de verdad multi-tenant. Usuarios, pacientes, inventario y compras siempre se asocian a una sucursal. Debe estar disponible antes de cualquier formulario de creación. |
| **3. Catálogos** | Usuarios (para el selector de doctor), Productos (para recetas e inventario) y Proveedores (para compras) son datos de referencia que alimentan los selectores del UI. |
| **4. Módulos clínicos** | Dependen de pacientes, usuarios (doctores) y citas previamente creados. El orden interno: Paciente → Cita → Historial → Receta. |
| **5. Inventario/Compras** | Requiere productos y sucursales existentes. La dispensación de recetas depende de que las recetas del paso 4 estén creadas. |

---

## Sección B — Interfaces TypeScript (Modelos y DTOs)

> Copia estas interfaces directamente en tu proyecto Frontend. Los campos marcados con `?` son opcionales. Todos los timestamps son strings ISO 8601.

### Enums

```typescript
export type AppointmentStatus = 'scheduled' | 'completed' | 'canceled' | 'missed'
export type PrescriptionItemStatus = 'pending' | 'dispensed' | 'declined'
export type PurchaseStatus = 'draft' | 'received' | 'cancelled'
export type TransferStatus = 'completed' | 'cancelled'
export type InventoryMovementType =
  | 'purchase'
  | 'purchase_return'
  | 'adjustment_in'
  | 'adjustment_out'
  | 'consumption'
  | 'patient_return'
  | 'transfer_out'
  | 'transfer_in'
export type AdjustDirection = 'in' | 'out'
```

### Wrappers de respuesta de la API

```typescript
export interface ApiSuccessResponse<T> {
  status: 'success'
  message: string
  data: T
}

export interface ApiPaginatedResponse<T> {
  status: 'success'
  message: string
  data: T[]
  meta: {
    pagination: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
      firstPage: number
      firstPageUrl: string
      lastPageUrl: string
      nextPageUrl: string | null
      previousPageUrl: string | null
    }
  }
}

export interface ApiErrorResponse {
  status: 'error'
  message: string
  code: number
  details: { errors: Array<{ field: string; message: string }> } | string | null
}
```

### Modelos de respuesta (entidades)

```typescript
// --- PERMISSION ---
export interface Permission {
  id: number
  name: string // ej: "patients.view", "appointments.create"
}

// --- ROLE ---
export interface Role {
  id: number
  name: 'super_admin' | 'admin' | 'doctor' | 'assistant' | 'patient'
  permissions?: Permission[]
}

// --- HOSPITAL ---
export interface Hospital {
  id: number
  name: string
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
  branches?: Branch[]
}

// --- BRANCH (SUCURSAL) ---
export interface Branch {
  id: number
  hospitalId: number
  name: string
  phone: string
  email: string
  address: string
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
  hospital?: Hospital
}

// --- USER ---
export interface User {
  id: number
  fullName: string | null
  email: string
  // password NUNCA se serializa en las respuestas
  roleId: number
  branchId: number
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
  role?: Role
  branch?: Branch
}

// --- AUTH TOKEN (respuesta del login) ---
export interface AuthToken {
  type: string              // siempre "bearer"
  value: string             // usar como "Bearer <value>"
  expiresAt: string | null  // ISO 8601, expira en 1 día
}

// --- PATIENT ---
export interface Patient {
  id: number
  firstName: string
  lastName: string
  email: string | null
  dob: string | null        // ISO 8601
  phone: string | null
  address: string | null
  note: string | null
  userId: number            // ID del doctor asignado
  branchId: number
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
  user?: User
  branch?: Branch
}

// --- APPOINTMENT ---
export interface Appointment {
  id: number
  patientId: number
  userId: number            // ID del doctor
  branchId: number
  dateTime: string          // ISO 8601 UTC
  duration: number          // minutos
  status: AppointmentStatus
  reason: string
  notes?: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  patient?: Patient
  user?: User
  branch?: Branch
}

// --- MEDICAL HISTORY ---
export interface MedicalHistory {
  id: number
  userId: number
  patientId: number
  appointmentId: number | null
  branchId: number
  diagnosis: string | null
  treatment: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  user?: User
  patient?: Patient
  appointment?: Appointment
  branch?: Branch
  prescriptions?: Prescription[]
}

// --- PRESCRIPTION ITEM ---
export interface PrescriptionItem {
  id: number
  prescriptionId: number
  medicationName: string
  dosage: string
  frequency: string
  durationDays: number
  instructions: string | null
  status: PrescriptionItemStatus
  dispensedAt: string | null
  dispensedBy: number | null
  productId: number | null
  createdAt: string
  updatedAt: string
  dispenser?: User
  product?: Product
}

// --- PRESCRIPTION ---
export interface Prescription {
  id: number
  userId: number
  patientId: number
  appointmentId: number | null
  medicalHistoryId: number | null
  branchId: number
  notes: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  user?: User
  patient?: Patient
  appointment?: Appointment
  medicalHistory?: MedicalHistory
  branch?: Branch
  items?: PrescriptionItem[]
}

// --- PRODUCT ---
export interface Product {
  id: number
  hospitalId: number
  name: string
  code: string | null
  unit: string | null
  allowsNegativeStock: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  hospital?: Hospital
}

// --- SUPPLIER ---
export interface Supplier {
  id: number
  hospitalId: number
  name: string
  phone: string | null
  email: string | null
  address: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

// --- INVENTORY ---
export interface Inventory {
  id: number
  branchId: number
  productId: number
  quantity: number
  createdAt: string
  updatedAt: string
  branch?: Branch
  product?: Product
}

// --- INVENTORY MOVEMENT ---
export interface InventoryMovement {
  id: number
  branchId: number
  productId: number
  type: InventoryMovementType
  quantity: number
  purchaseId: number | null
  transferId: number | null
  appointmentId: number | null
  prescriptionId: number | null
  prescriptionItemId: number | null
  userId: number
  notes: string | null
  createdAt: string
  // NO tiene updatedAt ni deletedAt — ledger inmutable
  branch?: Branch
  product?: Product
  user?: User
}

// --- INVENTORY TRANSFER ---
export interface InventoryTransfer {
  id: number
  productId: number
  fromBranchId: number
  toBranchId: number
  quantity: number
  status: TransferStatus
  requestedBy: number
  notes: string | null
  createdAt: string
  updatedAt: string
  product?: Product
  fromBranch?: Branch
  toBranch?: Branch
  requester?: User
  movements?: InventoryMovement[]
}

// --- PURCHASE ITEM ---
export interface PurchaseItem {
  id: number
  purchaseId: number
  productId: number
  quantity: number
  unitCost: number | null
  createdAt: string
  updatedAt: string
  product?: Product
}

// --- PURCHASE ---
export interface Purchase {
  id: number
  supplierId: number
  branchId: number
  status: PurchaseStatus
  invoiceNumber: string | null
  notes: string | null
  createdBy: number
  receivedAt: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  supplier?: Supplier
  branch?: Branch
  creator?: User
  items?: PurchaseItem[]
}
```

### DTOs de Request (Payloads)

```typescript
// --- AUTH ---
export interface LoginPayload {
  email: string
  password: string
}

// --- USER ---
export interface StoreUserPayload {
  fullName: string
  email: string       // único en el sistema
  password: string    // mínimo 8 caracteres
  branchId: number
  roleId: number
}

export interface UpdateUserPayload {
  fullName?: string
  email?: string
  roleId?: number     // requiere permiso users.assign_role
  branchId?: number
}

// --- HOSPITAL ---
export interface StoreHospitalPayload { name: string }
export interface UpdateHospitalPayload { name?: string }

// --- BRANCH ---
export interface StoreBranchPayload {
  hospitalId: number
  name: string
  phone: string
  email: string
  address: string
}

export interface UpdateBranchPayload {
  hospitalId?: number
  name?: string
  phone?: string
  email?: string
  address?: string
}

// --- PATIENT ---
export interface StorePatientPayload {
  userId: number    // DEBE ser un usuario con rol "doctor"
  firstName: string
  lastName: string
  email?: string
  dob?: string      // ISO 8601: "YYYY-MM-DD"
  phone?: string
  address?: string
  note?: string
}

export interface UpdatePatientPayload {
  userId?: number
  firstName?: string
  lastName?: string
  email?: string
  dob?: string
  phone?: string
  address?: string
  note?: string
}

// --- APPOINTMENT ---
export interface StoreAppointmentPayload {
  userId: number       // DEBE ser un usuario con rol "doctor"
  patientId: number
  dateTime: string     // ISO 8601 UTC: "2026-08-10T14:00:00.000Z"
  duration: number     // minutos
  status: AppointmentStatus
  reason: string
}

export interface UpdateAppointmentPayload {
  patientId?: number
  userId?: number
  dateTime?: string
  duration?: number
  status?: AppointmentStatus
  reason?: string
  note?: string
}

// --- MEDICAL HISTORY ---
export interface StoreMedicalHistoryPayload {
  userId: number
  patientId: number
  appointmentId?: number
  diagnosis: string
  treatment: string
  notes?: string
}

export interface UpdateMedicalHistoryPayload {
  userId?: number
  patientId?: number
  appointmentId?: number | null
  diagnosis?: string
  treatment?: string
  notes?: string | null
}

// --- PRESCRIPTION ---
export interface PrescriptionItemInput {
  productId?: number
  medicationName: string    // mínimo 1 caracter
  dosage: string
  frequency: string
  durationDays: number      // mínimo 1
  instructions?: string | null
}

export interface StorePrescriptionPayload {
  userId: number            // DEBE tener rol "doctor"
  patientId: number
  appointmentId?: number
  medicalHistoryId?: number
  notes?: string | null
  items: PrescriptionItemInput[] // mínimo 1
}

export interface UpdatePrescriptionPayload {
  userId?: number
  patientId?: number
  appointmentId?: number | null
  medicalHistoryId?: number | null
  notes?: string | null
}

// --- PRODUCT ---
export interface StoreProductPayload {
  name: string
  code?: string
  unit?: string
  allowsNegativeStock?: boolean // default: false
}

export interface UpdateProductPayload {
  name?: string
  code?: string
  unit?: string
  allowsNegativeStock?: boolean
}

// --- SUPPLIER ---
export interface StoreSupplierPayload {
  name: string
  phone?: string
  email?: string
  address?: string
}

export interface UpdateSupplierPayload {
  name?: string
  phone?: string
  email?: string
  address?: string
}

// --- INVENTORY ---
export interface AdjustInventoryPayload {
  productId: number
  branchId: number
  quantity: number       // siempre positivo
  direction: AdjustDirection  // 'in' | 'out'
  notes?: string
}

export interface StoreInventoryTransferPayload {
  productId: number
  fromBranchId: number
  toBranchId: number
  quantity: number       // mínimo 1
  notes?: string
}

// --- PURCHASE ---
export interface PurchaseItemInput {
  productId: number
  quantity: number       // mínimo 1
  unitCost?: number      // mínimo 0
}

export interface StorePurchasePayload {
  supplierId: number
  branchId: number
  invoiceNumber?: string
  notes?: string
  items: PurchaseItemInput[] // mínimo 1
}

export interface ReturnPurchasePayload {
  items: Array<{
    purchaseItemId: number
    quantity: number     // mínimo 1
  }>
}
```

---

## Sección C — Catálogo Detallado de Endpoints

> **Convención de middlewares:**
> - `auth` = Requiere header `Authorization: Bearer <token>`
> - `loadPermissions` = Carga el rol y permisos del usuario autenticado (siempre acompaña a `auth`)
> - `bouncer` = Autorización granular basada en roles/permisos (aplicada internamente por el controlador)

---

### 1. Autenticación

#### `POST /api/login` — Iniciar sesión

| Atributo | Detalle |
|----------|---------|
| **Método** | `POST` |
| **URL** | `/api/login` |
| **Acceso** | Público |
| **Middlewares** | Ninguno |

**Headers requeridos:**
```
Content-Type: application/json
```

**Body:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `email` | `string` | ✅ | Email válido |
| `password` | `string` | ✅ | Contraseña en texto plano |

**Ejemplo de request:**
```json
{
  "email": "doctor@clinica.com",
  "password": "miPassword123"
}
```

**Respuesta exitosa `200 OK`:**
```json
{
  "status": "success",
  "message": "Acceso exitoso",
  "data": {
    "type": "bearer",
    "value": "oat_MTIz.abc123tokenvalue...",
    "expiresAt": "2026-08-08T06:47:00.000Z"
  }
}
```

> **IMPORTANTE:** Guarda `data.value` y úsalo en TODAS las peticiones subsiguientes como:
> `Authorization: Bearer oat_MTIz.abc123tokenvalue...`

**Errores posibles:**
```json
// 401 — Credenciales inválidas
{ "status": "error", "message": "Credenciales inválidas", "code": 401, "details": null }

// 422 — Validación
{
  "status": "error",
  "message": "Error de validación",
  "code": 422,
  "details": {
    "errors": [{ "field": "email", "message": "The email field must be a valid email address" }]
  }
}
```

---

#### `GET /api/tokens` — Listar tokens activos (utilitario de depuración)

| Atributo | Detalle |
|----------|---------|
| **Método** | `GET` |
| **URL** | `/api/tokens` |
| **Acceso** | Privado (`auth`) |

**Headers:** `Authorization: Bearer <token>`

**Respuesta `200 OK`:** Array directo de `AccessToken[]` (sin wrapper `ApiSuccessResponse`).

---

### 2. Usuarios

> **Middlewares en todos los endpoints:** `auth` + `loadPermissions`
> **Base URL:** `/api/users`

#### `POST /api/users` — Crear usuario

| Atributo | Detalle |
|----------|---------|
| **Permiso requerido** | `users.create` |

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Body (`StoreUserPayload`):**

| Campo | Tipo | Requerido | Restricciones |
|-------|------|-----------|---------------|
| `fullName` | `string` | ✅ | |
| `email` | `string` | ✅ | Email único en el sistema |
| `password` | `string` | ✅ | Mínimo 8 caracteres |
| `branchId` | `number` | ✅ | Sucursal existente en BD |
| `roleId` | `number` | ✅ | Rol existente en BD |

> **Regla de negocio:** No puedes crear usuarios para sucursales de otro hospital, a menos que seas `super_admin`.

**Respuesta `201 Created`:** `ApiSuccessResponse<User>`

```json
{
  "status": "success",
  "message": "Usuario registrado",
  "data": {
    "id": 5,
    "fullName": "Dr. María González",
    "email": "maria@clinica.com",
    "roleId": 3,
    "branchId": 2,
    "createdAt": "2026-08-07T06:00:00.000Z",
    "updatedAt": "2026-08-07T06:00:00.000Z",
    "deletedAt": null
  }
}
```

---

#### `GET /api/users` — Listar usuarios

| Atributo | Detalle |
|----------|---------|
| **Permiso requerido** | `users.view` |

**Query params:** `page` (default: 1), `limit` (default: 10)

**Respuesta `200 OK`:** `ApiPaginatedResponse<User>`

> **Scoping:** `super_admin` ve todos los usuarios. Otros roles solo ven usuarios de su propio hospital.

---

#### `PUT /api/users/:id` — Actualizar usuario

| Atributo | Detalle |
|----------|---------|
| **Permiso requerido** | `users.update` (+ `users.assign_role` si cambia `roleId`) |

**Body:** `UpdateUserPayload` (todos los campos opcionales)

> **Regla:** Nadie puede editar su propio usuario. Cambiar `roleId` requiere el permiso adicional `users.assign_role`.

**Respuesta `200 OK`:** `ApiSuccessResponse<User>`

---

#### `DELETE /api/users/:id` — Soft-delete usuario

| Atributo | Detalle |
|----------|---------|
| **Permiso requerido** | `users.delete` |

> Soft-delete: establece `deletedAt`. No elimina físicamente.

**Respuesta `200 OK`:** `ApiSuccessResponse<User>` con `deletedAt` poblado.

---

#### `PUT /api/users/:id/restore` — Restaurar usuario eliminado

| Atributo | Detalle |
|----------|---------|
| **Permiso requerido** | `users.restore` |

**Respuesta `200 OK`:** `ApiSuccessResponse<User>` con `deletedAt: null`

---

### 3. Hospitales

> **Middlewares:** `auth` + `loadPermissions`
> **Base URL:** `/api/hospitals`
> **Nota:** Solo el rol `super_admin` puede crear/modificar hospitales.

#### `POST /api/hospitals` — Crear hospital

**Body:** `{ "name": "Clínica Central" }`

**Respuesta `201 Created`:** `ApiSuccessResponse<Hospital>`

---

#### `GET /api/hospitals` — Listar hospitales

**Query params:** `page`, `limit`

**Respuesta `200 OK`:** `ApiPaginatedResponse<Hospital>`

> `super_admin` ve todos; otros roles solo ven su propio hospital.

---

#### `PUT /api/hospitals/:id` — Actualizar hospital

**Body:** `UpdateHospitalPayload`

**Respuesta `200 OK`:** `ApiSuccessResponse<Hospital>`

---

#### `DELETE /api/hospitals/:id` — Soft-delete hospital

**Respuesta `200 OK`:** `ApiSuccessResponse<Hospital>`

---

#### `PUT /api/hospitals/:id/restore` — Restaurar hospital

**Respuesta `200 OK`:** `ApiSuccessResponse<Hospital>`

---

### 4. Sucursales (Branches)

> **Middlewares:** `auth` + `loadPermissions`
> **Base URL:** `/api/branches`

#### `POST /api/branches` — Crear sucursal

**Body (`StoreBranchPayload`):**

| Campo | Tipo | Requerido |
|-------|------|-----------|
| `hospitalId` | `number` | ✅ |
| `name` | `string` | ✅ |
| `phone` | `string` | ✅ |
| `email` | `string` | ✅ |
| `address` | `string` | ✅ |

**Respuesta `201 Created`:** `ApiSuccessResponse<Branch>`

---

#### `GET /api/branches` — Listar sucursales

**Query params:** `page`, `limit`

**Respuesta `200 OK`:** `ApiPaginatedResponse<Branch>`

> `super_admin` ve todas; otros roles solo ven las sucursales de su hospital.

---

#### `PUT /api/branches/:id` — Actualizar sucursal

**Body:** `UpdateBranchPayload`

**Respuesta `200 OK`:** `ApiSuccessResponse<Branch>`

---

#### `DELETE /api/branches/:id` — Soft-delete sucursal

**Respuesta `200 OK`:** `ApiSuccessResponse<Branch>`

---

#### `PUT /api/branches/:id/restore` — Restaurar sucursal

**Respuesta `200 OK`:** `ApiSuccessResponse<Branch>`

---

### 5. Pacientes

> **Middlewares:** `auth` + `loadPermissions`
> **Base URL:** `/api/patients`

#### `POST /api/patients` — Crear paciente

| Atributo | Detalle |
|----------|---------|
| **Permiso requerido** | `patients.create` |

**Body (`StorePatientPayload`):**

| Campo | Tipo | Requerido | Restricciones |
|-------|------|-----------|---------------|
| `userId` | `number` | ✅ | Debe ser un usuario con rol `doctor` |
| `firstName` | `string` | ✅ | |
| `lastName` | `string` | ✅ | |
| `email` | `string` | ❌ | Formato email |
| `dob` | `string` | ❌ | ISO 8601: `"1985-03-15"` |
| `phone` | `string` | ❌ | |
| `address` | `string` | ❌ | |
| `note` | `string` | ❌ | |

**Ejemplo de request:**
```json
{
  "userId": 3,
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@email.com",
  "dob": "1985-03-15",
  "phone": "+52 55 1234 5678",
  "address": "Calle Reforma 100, CDMX"
}
```

**Respuesta `201 Created`:**
```json
{
  "status": "success",
  "message": "Paciente registrado",
  "data": {
    "id": 12,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@email.com",
    "dob": "1985-03-15T00:00:00.000Z",
    "phone": "+52 55 1234 5678",
    "address": "Calle Reforma 100, CDMX",
    "note": null,
    "userId": 3,
    "branchId": 2,
    "createdAt": "2026-08-07T07:00:00.000Z",
    "updatedAt": "2026-08-07T07:00:00.000Z",
    "deletedAt": null
  }
}
```

---

#### `GET /api/patients` — Listar pacientes

**Query params:** `page`, `limit`

**Respuesta `200 OK`:** `ApiPaginatedResponse<Patient>`

> **Scoping:**
> - `super_admin`: todos los pacientes.
> - `admin`: pacientes de su hospital.
> - `doctor`/`assistant`: solo pacientes asignados a él (`userId === actor.id`), a menos que tenga `patients.view.any`.

---

#### `PUT /api/patients/:id` — Actualizar paciente

**Body:** `UpdatePatientPayload`

**Respuesta `200 OK`:** `ApiSuccessResponse<Patient>`

---

#### `DELETE /api/patients/:id` — Soft-delete paciente

**Respuesta `200 OK`:** `ApiSuccessResponse<Patient>`

---

#### `PUT /api/patients/:id/restore` — Restaurar paciente

**Respuesta `200 OK`:** `ApiSuccessResponse<Patient>`

---

### 6. Citas (Appointments)

> **Middlewares:** `auth` + `loadPermissions`
> **Base URL:** `/api/appointments`

#### `POST /api/appointments` — Crear cita

| Atributo | Detalle |
|----------|---------|
| **Permiso requerido** | `appointments.create` |

**Body (`StoreAppointmentPayload`):**

| Campo | Tipo | Requerido | Restricciones |
|-------|------|-----------|---------------|
| `userId` | `number` | ✅ | Debe ser usuario con rol `doctor` |
| `patientId` | `number` | ✅ | Paciente existente en BD |
| `dateTime` | `string` | ✅ | ISO 8601 UTC: `"2026-08-10T14:00:00.000Z"` |
| `duration` | `number` | ✅ | Minutos (ej: 30, 45, 60) |
| `status` | `AppointmentStatus` | ✅ | `"scheduled"` / `"completed"` / `"canceled"` / `"missed"` |
| `reason` | `string` | ✅ | Motivo de la consulta |

**Ejemplo de request:**
```json
{
  "userId": 3,
  "patientId": 12,
  "dateTime": "2026-08-10T14:00:00.000Z",
  "duration": 45,
  "status": "scheduled",
  "reason": "Revisión de caries"
}
```

**Respuesta `201 Created`:** `ApiSuccessResponse<Appointment>` con relaciones `patient`, `user`, `branch` precargadas.

---

#### `GET /api/appointments` — Listar citas

**Query params:**

| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `page` | `number` | `1` | |
| `limit` | `number` | `10` | |
| `status` | `AppointmentStatus` | - | Filtrar por estado |

**Respuesta `200 OK`:** `ApiPaginatedResponse<Appointment>` con `patient`, `user`, `branch` precargados.

> **Scoping:** Sin permiso `appointments.view.any`, el doctor solo ve sus propias citas.

---

#### `PUT /api/appointments/:id` — Actualizar cita

**Body:** `UpdateAppointmentPayload`

**Respuesta `200 OK`:** `ApiSuccessResponse<Appointment>`

---

#### `DELETE /api/appointments/:id` — Soft-delete cita

**Respuesta `200 OK`:** `ApiSuccessResponse<Appointment>`

---

#### `PUT /api/appointments/:id/restore` — Restaurar cita

**Respuesta `200 OK`:** `ApiSuccessResponse<Appointment>`

---

### 7. Historiales Clínicos

> **Middlewares:** `auth` + `loadPermissions`
> **Base URL:** `/api/medical_histories`

#### `POST /api/medical_histories` — Crear historial

| Atributo | Detalle |
|----------|---------|
| **Permiso requerido** | `medical_histories.create` |

**Body (`StoreMedicalHistoryPayload`):**

| Campo | Tipo | Requerido |
|-------|------|-----------|
| `userId` | `number` | ✅ |
| `patientId` | `number` | ✅ |
| `appointmentId` | `number` | ❌ |
| `diagnosis` | `string` | ✅ |
| `treatment` | `string` | ✅ |
| `notes` | `string` | ❌ |

**Respuesta `201 Created`:** `ApiSuccessResponse<MedicalHistory>`

---

#### `GET /api/medical_histories` — Listar historiales

**Query params:** `page`, `limit`

**Respuesta `200 OK`:** `ApiPaginatedResponse<MedicalHistory>`

---

#### `PUT /api/medical_histories/:id` — Actualizar historial

**Body:** `UpdateMedicalHistoryPayload`

**Respuesta `200 OK`:** `ApiSuccessResponse<MedicalHistory>`

---

#### `DELETE /api/medical_histories/:id` — Soft-delete historial

**Respuesta `200 OK`:** `ApiSuccessResponse<MedicalHistory>`

---

#### `PUT /api/medical_histories/:id/restore` — Restaurar historial

**Respuesta `200 OK`:** `ApiSuccessResponse<MedicalHistory>`

---

### 8. Recetas (Prescriptions)

> **Middlewares:** `auth` + `loadPermissions`
> **Base URL:** `/api/prescriptions`

#### `POST /api/prescriptions` — Crear receta con ítems

| Atributo | Detalle |
|----------|---------|
| **Permiso requerido** | `prescriptions.create` |

**Body (`StorePrescriptionPayload`):**

| Campo | Tipo | Requerido | Restricciones |
|-------|------|-----------|---------------|
| `userId` | `number` | ✅ | Debe tener rol `doctor` |
| `patientId` | `number` | ✅ | No eliminado |
| `appointmentId` | `number` | ❌ | No eliminado |
| `medicalHistoryId` | `number` | ❌ | No eliminado |
| `notes` | `string\|null` | ❌ | |
| `items` | `PrescriptionItemInput[]` | ✅ | **Mínimo 1 ítem** |

**Estructura de cada ítem (`items[]`):**

| Campo | Tipo | Requerido | Restricciones |
|-------|------|-----------|---------------|
| `productId` | `number` | ❌ | Si se provee, vincula con inventario |
| `medicationName` | `string` | ✅ | Mínimo 1 caracter |
| `dosage` | `string` | ✅ | Ej: `"500mg"` |
| `frequency` | `string` | ✅ | Ej: `"Cada 8 horas"` |
| `durationDays` | `number` | ✅ | Mínimo 1 |
| `instructions` | `string\|null` | ❌ | |

**Ejemplo de request:**
```json
{
  "userId": 3,
  "patientId": 12,
  "appointmentId": 7,
  "notes": "Tomar con alimentos",
  "items": [
    {
      "productId": 5,
      "medicationName": "Amoxicilina",
      "dosage": "500mg",
      "frequency": "Cada 8 horas",
      "durationDays": 7,
      "instructions": "Tomar 30 min después de comer"
    },
    {
      "medicationName": "Ibuprofeno",
      "dosage": "400mg",
      "frequency": "Cada 6 horas",
      "durationDays": 3,
      "instructions": null
    }
  ]
}
```

**Respuesta `201 Created`:**
```json
{
  "status": "success",
  "message": "Receta creada",
  "data": {
    "id": 8,
    "userId": 3,
    "patientId": 12,
    "appointmentId": 7,
    "medicalHistoryId": null,
    "branchId": 2,
    "notes": "Tomar con alimentos",
    "createdAt": "2026-08-07T08:00:00.000Z",
    "updatedAt": "2026-08-07T08:00:00.000Z",
    "deletedAt": null,
    "items": [
      {
        "id": 1,
        "prescriptionId": 8,
        "productId": 5,
        "medicationName": "Amoxicilina",
        "dosage": "500mg",
        "frequency": "Cada 8 horas",
        "durationDays": 7,
        "instructions": "Tomar 30 min después de comer",
        "status": "pending",
        "dispensedAt": null,
        "dispensedBy": null
      }
    ]
  }
}
```

---

#### `GET /api/prescriptions` — Listar recetas

**Query params:** `page`, `limit`

**Respuesta `200 OK`:** `ApiPaginatedResponse<Prescription>` con `items[]` precargados.

---

#### `PUT /api/prescriptions/:id` — Actualizar cabecera de receta

**Body:** `UpdatePrescriptionPayload` (NO modifica los ítems)

**Respuesta `200 OK`:** `ApiSuccessResponse<Prescription>`

---

#### `DELETE /api/prescriptions/:id` — Soft-delete receta

**Respuesta `200 OK`:** `ApiSuccessResponse<Prescription>`

---

#### `PUT /api/prescriptions/:id/restore` — Restaurar receta

**Respuesta `200 OK`:** `ApiSuccessResponse<Prescription>`

---

#### `PUT /api/prescriptions/:id/items/:itemId/dispense` — Dispensar ítem de receta

| Atributo | Detalle |
|----------|---------|
| **Método** | `PUT` |
| **URL** | `/api/prescriptions/:id/items/:itemId/dispense` |
| **Acceso** | Privado · Permiso: `prescriptions.dispense` |

> **No requiere body.**
> El actor autenticado queda registrado como `dispensedBy`.
> Si el ítem tiene `productId`, **descuenta automáticamente 1 unidad del inventario** de la sucursal (movimiento tipo `consumption`).
> Retorna `422` si el ítem ya fue procesado (`status !== 'pending'`).

**Respuesta `200 OK`:**
```json
{
  "status": "success",
  "message": "Medicamento dispensado exitosamente",
  "data": {
    "id": 1,
    "status": "dispensed",
    "dispensedAt": "2026-08-07T09:00:00.000Z",
    "dispensedBy": 5,
    "medicationName": "Amoxicilina",
    "prescriptionId": 8,
    "productId": 5,
    "dosage": "500mg",
    "frequency": "Cada 8 horas",
    "durationDays": 7,
    "instructions": "Tomar 30 min después de comer"
  }
}
```

**Errores:**
```json
// 422 — Ítem ya procesado
{ "status": "error", "message": "Este ítem ya fue procesado", "code": 422, "details": null }

// 422 — Stock insuficiente (si el producto no permite stock negativo)
{ "status": "error", "message": "Stock insuficiente para el producto...", "code": 422, "details": null }
```

---

#### `PUT /api/prescriptions/:id/items/:itemId/decline` — Declinar ítem de receta

| Atributo | Detalle |
|----------|---------|
| **Método** | `PUT` |
| **URL** | `/api/prescriptions/:id/items/:itemId/decline` |
| **Acceso** | Privado · Permiso: `prescriptions.decline` |

> **No requiere body.** Marca el ítem como `declined`. Solo se puede declinar un ítem en estado `pending`.

**Respuesta `200 OK`:** `ApiSuccessResponse<PrescriptionItem>` con `status: "declined"`

---

### 9. Productos

> **Middlewares:** `auth` + `loadPermissions`
> **Base URL:** `/api/products`
> **Nota:** Los productos son del **hospital** (no de la sucursal). Están disponibles para todas las sucursales del mismo hospital.

#### `POST /api/products` — Crear producto

| Atributo | Detalle |
|----------|---------|
| **Permiso requerido** | `products.create` |

**Body (`StoreProductPayload`):**

| Campo | Tipo | Requerido | Notas |
|-------|------|-----------|-------|
| `name` | `string` | ✅ | Mínimo 1 caracter |
| `code` | `string` | ❌ | Código interno del producto |
| `unit` | `string` | ❌ | Ej: `"cápsulas"`, `"ml"`, `"unidad"` |
| `allowsNegativeStock` | `boolean` | ❌ | Default: `false` |

**Respuesta `201 Created`:** `ApiSuccessResponse<Product>`

---

#### `GET /api/products` — Listar productos

**Query params:** `page`, `limit`

**Respuesta `200 OK`:** `ApiPaginatedResponse<Product>`

---

#### `PUT /api/products/:id` — Actualizar producto

**Body:** `UpdateProductPayload`

**Respuesta `200 OK`:** `ApiSuccessResponse<Product>`

---

#### `DELETE /api/products/:id` — Soft-delete producto

**Respuesta `200 OK`:** `ApiSuccessResponse<Product>`

---

#### `PUT /api/products/:id/restore` — Restaurar producto

**Respuesta `200 OK`:** `ApiSuccessResponse<Product>`

---

### 10. Proveedores (Suppliers)

> **Middlewares:** `auth` + `loadPermissions`
> **Base URL:** `/api/suppliers`
> **Nota:** Los proveedores son del **hospital** (como los productos).

#### `POST /api/suppliers` — Crear proveedor

**Body (`StoreSupplierPayload`):**

| Campo | Tipo | Requerido |
|-------|------|-----------|
| `name` | `string` | ✅ |
| `phone` | `string` | ❌ |
| `email` | `string` | ❌ |
| `address` | `string` | ❌ |

**Respuesta `201 Created`:** `ApiSuccessResponse<Supplier>`

---

#### `GET /api/suppliers` — Listar proveedores

**Query params:** `page`, `limit`

**Respuesta `200 OK`:** `ApiPaginatedResponse<Supplier>`

---

#### `PUT /api/suppliers/:id` — Actualizar proveedor

**Body:** `UpdateSupplierPayload`

**Respuesta `200 OK`:** `ApiSuccessResponse<Supplier>`

---

#### `DELETE /api/suppliers/:id` — Soft-delete proveedor

**Respuesta `200 OK`:** `ApiSuccessResponse<Supplier>`

---

#### `PUT /api/suppliers/:id/restore` — Restaurar proveedor

**Respuesta `200 OK`:** `ApiSuccessResponse<Supplier>`

---

### 11. Inventario

> **Middlewares:** `auth` + `loadPermissions`
> **Base URL:** `/api/inventory`
>
> **Concepto clave:** `inventories` almacena el **saldo actual** (stock). `inventory_movements` es el ledger inmutable de todos los cambios históricos.

#### `GET /api/inventory` — Consultar saldos de inventario

| Atributo | Detalle |
|----------|---------|
| **Permiso requerido** | `inventory.view` |

**Query params:**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `page` | `number` | Default: 1 |
| `limit` | `number` | Default: 10 |
| `productId` | `number` | Filtrar por producto específico |
| `branchId` | `number` | Filtrar por sucursal específica |

**Respuesta `200 OK`:** `ApiPaginatedResponse<Inventory>`

---

#### `GET /api/inventory/movements` — Historial de movimientos de inventario

| Atributo | Detalle |
|----------|---------|
| **Permiso requerido** | `inventory.view` |

**Query params:**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `page` | `number` | Default: 1 |
| `limit` | `number` | Default: 10 |
| `productId` | `number` | Filtrar por producto |
| `branchId` | `number` | Filtrar por sucursal |
| `type` | `InventoryMovementType` | Filtrar por tipo de movimiento |

**Respuesta `200 OK`:** `ApiPaginatedResponse<InventoryMovement>` (ordenado por `createdAt DESC`)

---

#### `POST /api/inventory/adjust` — Ajustar inventario manualmente

| Atributo | Detalle |
|----------|---------|
| **Permiso requerido** | `inventory.adjust` |

**Body (`AdjustInventoryPayload`):**

| Campo | Tipo | Requerido | Restricciones |
|-------|------|-----------|---------------|
| `productId` | `number` | ✅ | |
| `branchId` | `number` | ✅ | |
| `quantity` | `number` | ✅ | Siempre positivo — la dirección la controla `direction` |
| `direction` | `AdjustDirection` | ✅ | `"in"` = entrada, `"out"` = salida |
| `notes` | `string` | ❌ | |

**Ejemplo:**
```json
{
  "productId": 5,
  "branchId": 2,
  "quantity": 50,
  "direction": "in",
  "notes": "Reposición mensual de Amoxicilina"
}
```

**Respuesta `200 OK`:** `ApiSuccessResponse<Inventory>` con el saldo actualizado.

---

#### `POST /api/inventory/transfers` — Crear transferencia entre sucursales

| Atributo | Detalle |
|----------|---------|
| **Permiso requerido** | `inventory.transfer` |

**Body (`StoreInventoryTransferPayload`):**

| Campo | Tipo | Requerido | Restricciones |
|-------|------|-----------|---------------|
| `productId` | `number` | ✅ | No eliminado |
| `fromBranchId` | `number` | ✅ | Sucursal de origen existente |
| `toBranchId` | `number` | ✅ | Sucursal de destino existente |
| `quantity` | `number` | ✅ | Mínimo 1 |
| `notes` | `string` | ❌ | |

> **Efecto:** Crea 2 movimientos (`transfer_out` en origen y `transfer_in` en destino) y actualiza ambos saldos de inventario atómicamente.
> Retorna `422` si no hay stock suficiente en la sucursal origen (y `allowsNegativeStock === false`).

**Respuesta `201 Created`:** `ApiSuccessResponse<InventoryTransfer>`

---

#### `GET /api/inventory/transfers` — Listar transferencias

**Query params:** `page`, `limit`

**Respuesta `200 OK`:** `ApiPaginatedResponse<InventoryTransfer>`

---

### 12. Compras (Purchases)

> **Middlewares:** `auth` + `loadPermissions`
> **Base URL:** `/api/purchases`
> **Ciclo de vida:** `draft` → `received` (al recibir mercancía) o `cancelled`

#### `POST /api/purchases` — Crear orden de compra (draft)

| Atributo | Detalle |
|----------|---------|
| **Permiso requerido** | `purchases.create` |

**Body (`StorePurchasePayload`):**

| Campo | Tipo | Requerido | Restricciones |
|-------|------|-----------|---------------|
| `supplierId` | `number` | ✅ | Del mismo hospital que la sucursal |
| `branchId` | `number` | ✅ | Del mismo hospital que el actor |
| `invoiceNumber` | `string` | ❌ | |
| `notes` | `string` | ❌ | |
| `items` | `PurchaseItemInput[]` | ✅ | Mínimo 1 ítem |

**Estructura de cada ítem:**

| Campo | Tipo | Requerido | Restricciones |
|-------|------|-----------|---------------|
| `productId` | `number` | ✅ | Del mismo hospital |
| `quantity` | `number` | ✅ | Mínimo 1 |
| `unitCost` | `number` | ❌ | Mínimo 0 |

**Ejemplo de request:**
```json
{
  "supplierId": 2,
  "branchId": 1,
  "invoiceNumber": "FAC-2026-001",
  "notes": "Pedido mensual",
  "items": [
    { "productId": 5, "quantity": 100, "unitCost": 12.50 },
    { "productId": 8, "quantity": 50 }
  ]
}
```

**Respuesta `201 Created`:**
```json
{
  "status": "success",
  "message": "Compra creada en borrador",
  "data": {
    "id": 3,
    "supplierId": 2,
    "branchId": 1,
    "status": "draft",
    "invoiceNumber": "FAC-2026-001",
    "notes": "Pedido mensual",
    "createdBy": 1,
    "receivedAt": null,
    "createdAt": "2026-08-07T10:00:00.000Z",
    "updatedAt": "2026-08-07T10:00:00.000Z",
    "deletedAt": null,
    "items": [
      { "id": 1, "purchaseId": 3, "productId": 5, "quantity": 100, "unitCost": "12.50" },
      { "id": 2, "purchaseId": 3, "productId": 8, "quantity": 50, "unitCost": null }
    ]
  }
}
```

---

#### `GET /api/purchases` — Listar compras

**Query params:** `page`, `limit`

**Respuesta `200 OK`:** `ApiPaginatedResponse<Purchase>` (ordenado por `createdAt DESC`)

---

#### `PUT /api/purchases/:id/receive` — Marcar compra como recibida

| Atributo | Detalle |
|----------|---------|
| **Permiso requerido** | `purchases.receive` |

> **No requiere body.**
> Cambia `status` a `"received"`, registra `receivedAt = now()` y **suma la cantidad de cada ítem al inventario** de la sucursal (movimiento tipo `purchase`).
> Solo funciona si la compra está en estado `draft`. Retorna `422` si ya fue recibida o cancelada.

**Respuesta `200 OK`:** `ApiSuccessResponse<Purchase>` con `status: "received"` y `receivedAt` poblado.

---

#### `PUT /api/purchases/:id/cancel` — Cancelar compra

| Atributo | Detalle |
|----------|---------|
| **Permiso requerido** | `purchases.cancel` |

> **No requiere body.** Solo se puede cancelar una compra en estado `draft`.

**Respuesta `200 OK`:** `ApiSuccessResponse<Purchase>` con `status: "cancelled"`

---

#### `POST /api/purchases/:id/return` — Devolver artículos de una compra

| Atributo | Detalle |
|----------|---------|
| **Permiso requerido** | `purchases.return` |

**Body (`ReturnPurchasePayload`):**

```json
{
  "items": [
    { "purchaseItemId": 1, "quantity": 10 }
  ]
}
```

| Campo | Restricciones |
|-------|---------------|
| `items[].purchaseItemId` | `purchaseItem` debe existir en BD |
| `items[].quantity` | Mínimo 1 |

> **Efecto:** Crea movimientos de tipo `purchase_return` y **descuenta el stock** correspondiente en la sucursal.

**Respuesta `200 OK`:** `ApiSuccessResponse`

---

## Sección D — Reglas de Negocio y Consideraciones de Integración

### D.1 Convención global de manejo de errores

Todos los endpoints retornan errores en el siguiente formato estándar:

```typescript
interface ApiErrorResponse {
  status: 'error'
  message: string    // Mensaje legible por humanos
  code: number       // HTTP status code repetido en el body
  details: any | null
}
```

**Mapa de errores:**

| HTTP Code | Causa típica |
|-----------|-------------|
| `400` | Request malformado |
| `401` | Token ausente, inválido o expirado |
| `403` | El usuario no tiene el permiso Bouncer requerido (`"No tienes los permisos necesarios"`) |
| `404` | El registro solicitado (`:id`) no existe en BD (Lucid `E_ROW_NOT_FOUND`) |
| `422` | Datos del body no pasan la validación de VineJS, o reglas de negocio violadas (stock insuficiente, hospital cruzado, ítem ya procesado) |
| `500` | Error inesperado en el servidor |

**Ejemplo de error 422 de validación:**
```json
{
  "status": "error",
  "message": "Error de validación",
  "code": 422,
  "details": {
    "errors": [
      { "field": "email", "message": "The email field must be a valid email address" },
      { "field": "items.0.durationDays", "message": "The durationDays field must be at least 1" }
    ]
  }
}
```

> Los errores en arrays anidados usan notación `fieldName.index.subField` (ej. `items.0.durationDays`).

---

### D.2 Formato de respuestas con paginación

Todos los listados retornan el mismo objeto de paginación:

```json
{
  "status": "success",
  "message": "Pacientes encontrados",
  "data": [ ...registros... ],
  "meta": {
    "pagination": {
      "total": 150,
      "perPage": 10,
      "currentPage": 2,
      "lastPage": 15,
      "firstPage": 1,
      "firstPageUrl": "/?page=1",
      "lastPageUrl": "/?page=15",
      "nextPageUrl": "/?page=3",
      "previousPageUrl": "/?page=1"
    }
  }
}
```

**Parámetros disponibles en todos los listados:**

| Param | Default | Descripción |
|-------|---------|-------------|
| `page` | `1` | Página a consultar |
| `limit` | `10` | Registros por página |

---

### D.3 Manejo de tokens y expiración de sesión

- **Tipo:** Bearer Token (Opaque Access Token via `DbAccessTokensProvider`)
- **Duración:** 1 día (`expiresIn: '1 day'`)
- **Header requerido en TODOS los endpoints privados:**
  ```
  Authorization: Bearer <token_value>
  ```
- **Cuando el token expira o es inválido:** El servidor responde `401`.
- **No hay endpoint de refresh token.** La única forma de obtener un nuevo token es volviendo a hacer `POST /api/login`.

**Estrategia recomendada para el Frontend:**
1. Guardar el token en `localStorage` o una cookie httpOnly segura.
2. Interceptar todas las respuestas `401` globalmente (interceptor de Axios/Fetch).
3. Al recibir `401`, limpiar el token almacenado, redirigir al login.

**Ejemplo con Axios:**
```typescript
const apiClient = axios.create({
  baseURL: 'http://<host>/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

---

### D.4 Multi-tenancy y scoping automático

El backend filtra automáticamente los datos según el rol del usuario autenticado. **El Frontend NO necesita enviar filtros de hospital/sucursal en los listados.**

| Rol | Lo que puede ver |
|-----|-----------------|
| `super_admin` | Todos los datos de todos los hospitales |
| `admin` | Solo datos de su hospital |
| `doctor` | Solo sus propios pacientes/citas/historiales/recetas (a menos que tenga permiso `.view.any`) |
| `assistant` | Solo datos de su sucursal asignada |
| `patient` | Solo sus propias citas |

---

### D.5 Soft-delete — Registros eliminados

- `DELETE` establece `deletedAt = now()` (no elimina físicamente)
- Los listados (`GET`) **excluyen automáticamente** registros con `deletedAt != null`
- Para restaurar, usa `PUT /:id/restore`
- Los validators también rechazan referencias a registros eliminados (ej. `patientId` de un paciente borrado)

---

### D.6 Formato de fechas

- **Todas las fechas en ISO 8601 UTC**
- Fecha-hora: `"2026-08-10T14:00:00.000Z"`
- Solo fecha (ej. `dob`): `"1985-03-15"` o `"1985-03-15T00:00:00.000Z"`
- Las respuestas siempre retornan fechas en UTC.

---

### D.7 Reglas de negocio críticas

| Regla | Descripción |
|-------|-------------|
| **userId = doctor** | Al crear pacientes, citas o recetas, el `userId` debe ser un usuario con rol `doctor`. La API lo valida en BD y retorna `422` si no se cumple. |
| **Hospital cruzado** | Ningún usuario (salvo `super_admin`) puede operar sobre datos de otro hospital. La API retorna `422` si se intenta. |
| **Proveedor/Sucursal del mismo hospital** | En compras, el `supplierId` y el `branchId` deben pertenecer al mismo hospital. |
| **Dispensar solo `pending`** | Un ítem de receta solo puede dispensarse o declinarse si su `status === "pending"`. Retorna `422` si ya fue procesado. |
| **Recibir solo `draft`** | Una compra solo puede recibirse si está en `status === "draft"`. |
| **Stock insuficiente** | Si un producto tiene `allowsNegativeStock: false` y no hay stock suficiente para una operación de salida, la API retorna `422`. |
| **Dispensación = consumo de inventario** | Si un ítem de receta tiene `productId`, dispensarlo registra automáticamente un movimiento `consumption` y descuenta 1 unidad del inventario de la sucursal. |
| **Recepción de compra = aumento de inventario** | `PUT /purchases/:id/receive` suma automáticamente las cantidades al inventario de la sucursal (transacción atómica). |
| **No auto-edición** | Nadie puede editar o eliminar su propio usuario. La API retorna `403`. |

---

### D.8 Estructura jerárquica del dominio

```
Hospital (tenant)
 └── Branch (N por hospital)
      ├── User (staff: admin, doctor, assistant — N por sucursal)
      ├── Patient (N por sucursal, asignado a un doctor)
      │    └── Appointment (belongsTo Patient + User/doctor + Branch)
      │         ├── MedicalHistory (opcionalmente ligada a Appointment)
      │         │    └── Prescription (ligada a MedicalHistory y/o Appointment)
      │         │         └── PrescriptionItem (N por receta, opcionalmente con Product)
      │         └── Prescription (puede existir sin MedicalHistory)
      └── Inventory (saldo de stock: uno por par branch+producto)

Hospital
 ├── Product   (catálogo, N por hospital — visible en TODAS sus sucursales)
 └── Supplier  (proveedores, N por hospital)

Purchase (pertenece a Branch + Supplier)
 └── PurchaseItem (N por compra)

InventoryTransfer (entre dos sucursales del mismo hospital)
 └── genera 2 InventoryMovement (transfer_out en origen + transfer_in en destino)
```

---

*Documento generado mediante análisis exhaustivo del código fuente. Actualización: Agosto 2026.*
