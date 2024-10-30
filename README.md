# To-Do App (FrontEnd)

Esta es una aplicación web para gestionar tareas, desarrollada con Next.js, TypeScript y CSS. Proporciona una interfaz de usuario intuitiva para gestionar tareas, incluyendo funcionalidades de autenticación y edición en tiempo real.

### Requisitos Previos

- **Node.js** (versión recomendada: 16.x o superior)

### Dependencias

Para instalar las dependencias del proyecto:

```
npm install
```

### Ejecución del Proyecto

Una vez completada la instalación de las dependencias ejecuta:

```
npm run dev
```

Esto ejecutará el proyecto en modo de desarrollo.

La Aplicacion web estará disponible en `http://localhost:3001/` por default.

### Interfaz de Usuario

Diseñada con un enfoque en la simplicidad y la accesibilidad, esta aplicación utiliza CSS nativo para una experiencia visual limpia y sin distracciones. La navegación y edición de tareas es rápida y directa.

### Gestión de Tareas

- **Lista de tareas**: Muestra todas las tareas del usuario en un solo listado, con el título de cada tarea y su estado actual. Cada tarea es un elemento clicable que abre un modal de edición.
- **Tablero de tareas**: Organizado en columnas para cada estado de tarea (Pendiente, En Progreso, Completada). Cada columna tiene:
  - **Encabezado de estado**: Muestra el nombre del estado ("Pendiente," "En Progreso," "Completada").
  - **Tarjetas de tareas**: Las tareas filtradas según el estado correspondiente. Cada tarjeta contiene el título de la tarea y su estado, y al hacer clic en ella, se abre el modal de edición.
- **Botón Crear Tarea**: Ubicado en la parte inferior de la lista de tareas y el tablero, permite al usuario abrir un modal para crear una nueva tarea.

##### Modal de Creación y Edición de Tareas

- **Modal de Creación**: Aparece al hacer clic en "Crear Tarea," permitiendo ingresar un título, descripción y fecha de vencimiento para una nueva tarea.
- **Modal de Edición**: Aparece al hacer clic en una tarea existente y permite actualizar su título, descripción, fecha de vencimiento, y estado. Incluye un botón adicional de "Borrar" para eliminar la tarea.



Este proyecto ha sido desarrollado con un enfoque en la experiencia de usuario y es el resultado de un desarrollo ágil en un plazo de 24 horas, manteniendo un diseño sencillo y funcional.

#### 
