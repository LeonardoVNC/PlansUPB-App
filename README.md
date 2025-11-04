## PlansUPB - Aplicación de Planificación de Eventos Sociales

PlansUPB es una aplicación móvil de red social diseñada para la gestión de eventos dentro de la Universidad Privada Boliviana. [1](#0-0)  Permite a los usuarios crear, descubrir y participar en eventos sociales (llamados "planes"), facilitar la toma de decisiones grupales mediante encuestas, y fomentar discusiones comunitarias a través de publicaciones. <cite/>

## Características Principales

### Gestión de Planes
- **Creación de eventos** con título, descripción, ubicación, fecha/hora y multimedia <cite/>
- **Ciclo de vida de estados**: `draft` → `open` → `closed`/`cancelled` <cite/>
- **Selector de ubicación** basado en mapas para puntos de encuentro <cite/>
- **Vista geográfica** de planes en mapa interactivo <cite/>

### Sistema de Confirmaciones (RSVP)
- **Respuesta a invitaciones**: aceptar o rechazar invitaciones a planes <cite/>
- **Confirmación de asistencia**: confirmación final de asistencia con sí/no <cite/>
- **Estadísticas en tiempo real** de asistencia para organizadores <cite/>

### Encuestas y Votaciones
- Soporte para encuestas de **opción única y múltiple** <cite/>
- **Cierre automático** por quórum o fecha límite <cite/>
- **Métodos de desempate**: aleatorio o voto más temprano <cite/>

### Publicaciones Sociales
- Creación de posts con **texto e imágenes** [2](#0-1) 
- **Categorización** de contenido [3](#0-2) 
- Sistema de **likes** y notificaciones push <cite/>

## Stack Tecnológico

### Frontend
```
React Native + Expo ~54.0.12
├── expo-router ^6.0.10          # Navegación basada en archivos
├── @ui-kitten/components ^5.3.1 # Sistema de diseño Eva
├── react-native-maps 1.20.1     # Integración de mapas
├── zustand ^5.0.8               # Gestión de estado
└── react-native-reanimated ~4.1.1 # Animaciones
```

### Backend
```
Firebase ^12.4.0
├── Authentication              # Gestión de usuarios
├── Firestore                  # Base de datos NoSQL
└── Storage                    # Almacenamiento de archivos

Cloudinary ^1.3.0              # CDN de imágenes
Expo Push Notifications ~0.32.12 # Mensajería push
```

## Arquitectura del Proyecto

La aplicación sigue una **arquitectura en capas** con separación estricta de responsabilidades: <cite/>

```
┌─────────────────────────────────────┐
│  UI Layer (Screens/Components)     │
├─────────────────────────────────────┤
│  Business Logic (Custom Hooks)     │
│  usePlans, usePolls, usePosts       │
├─────────────────────────────────────┤
│  State Management (Zustand Stores) │
│  usePlanStore, usePostStore         │
├─────────────────────────────────────┤
│  Service Layer (Firebase/APIs)     │
│  planService, postService           │
└─────────────────────────────────────┘
```
<cite/>

### Estructura de Directorios
```
plansUPB/
├── app/                    # Rutas de navegación (Expo Router)
│   ├── auth/              # Pantallas de autenticación
│   └── (drawer)/          # Navegación principal
├── src/
│   ├── components/        # Componentes reutilizables
│   ├── hooks/            # Lógica de negocio (usePlans, usePolls)
│   ├── services/         # Integración con Firebase
│   ├── store/            # Stores de Zustand
│   ├── interfaces/       # Tipos TypeScript
│   └── utils/            # Funciones auxiliares
└── assets/               # Recursos estáticos
```
<cite/>

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- Yarn o npm
- Expo CLI
- Cuenta de Firebase
- Cuenta de Cloudinary (para imágenes)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/LeonardoVNC/PlansUPB-App.git
cd PlansUPB-App/plansUPB
```

2. **Instalar dependencias**
```bash
yarn install
# o
npm install
```

3. **Configurar Firebase**
   - Crear proyecto en Firebase Console
   - Habilitar Authentication, Firestore y Storage
   - Agregar configuración en archivo de entorno

4. **Configurar Cloudinary**
   - Crear cuenta en Cloudinary
   - Obtener credenciales API

5. **Ejecutar la aplicación**
```bash
yarn start        # Iniciar servidor de desarrollo
yarn android      # Ejecutar en Android
yarn ios          # Ejecutar en iOS
```

## Configuración de la Aplicación

La configuración principal se encuentra en `app.json`: [7](#0-6) 

### Permisos Requeridos
- **Android**: Ubicación (fina y aproximada), lectura/escritura de almacenamiento [8](#0-7) 
- **iOS**: Acceso a galería de fotos y cámara [9](#0-8) 

## Sistema de Autenticación

El sistema utiliza Firebase Authentication con registro personalizado que incluye: [10](#0-9) 
- Nombre completo y nombre de usuario
- Correo electrónico institucional
- Carrera académica
- Biografía opcional
- Contraseña segura (mínimo 6 caracteres)

## Gestión de Estado

La aplicación utiliza **Zustand** para gestión de estado global con persistencia en AsyncStorage: [11](#0-10) 

**Stores principales:**
- `useUserStore` - Sesión de usuario
- `usePlanStore` - Planes (todos, gestionados, guardados)
- `usePostStore` - Publicaciones
- `usePollStore` - Encuestas
- `useConfirmationStore` - Confirmaciones RSVP
- `useThemeStore` - Tema claro/oscuro

<cite/>

## Sistema de Notificaciones Push

Integración con Expo Push Notifications para: [12](#0-11) 
- **Notificaciones broadcast**: Nuevas publicaciones a todos los usuarios
- **Notificaciones dirigidas**: Invitaciones a planes específicos
- Navegación automática al contenido relevante al tocar la notificación

<cite/>

## Funcionalidades de Ubicación

Utiliza `expo-location` y `react-native-maps` para: [13](#0-12) 
- Selección de ubicación en mapa interactivo
- Visualización geográfica de planes
- Permisos de ubicación en tiempo real [14](#0-13) 

## Sistema de Diseño

La UI está construida con **Eva Design System** a través de `@ui-kitten/components`: [15](#0-14) 
- Componentes consistentes y accesibles
- Soporte para tema claro y oscuro
- Iconos de Eva Icons Pack

## Utilidades de Fecha

El proyecto incluye funciones de formateo de fechas localizadas en español: [16](#0-15) 
- Formato completo con día de la semana
- Formato simple de fecha y hora
- Fechas relativas ("Hoy", "Mañana", "En X días")

## Componentes de Usuario

Ejemplo de componente de tarjeta de organizador: [17](#0-16) 
- Muestra foto de perfil, nombre, username
- Información de carrera académica
- Diseño consistente con el sistema de diseño
