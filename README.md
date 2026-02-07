# 📖 Interactive Flipbook Project

Un libro digital interactivo y responsivo construido con **React** y **Vite**. Este proyecto permite visualizar capítulos de una historia con un efecto de cambio de página realista, incluyendo navegación avanzada y portadas dinámicas.

## ✨ Características

* **Efecto Flipbook:** Cambio de página fluido utilizando `react-pageflip`.
* **Navegación Inteligente:** * Botones de navegación (Anterior/Siguiente).
    * **Slider de búsqueda:** Una barra deslizable que aparece al pulsar la lupa para navegar rápidamente por todo el libro.
    * **Acceso Rápido:** Botón de inicio para volver a la portada principal.
* **Diseño Adaptable (Responsive):** Ajuste automático de tamaño para modo Retrato (móvil) y Paisaje (escritorio).
* **Manejo de Portadas:** Lógica específica para `cover-1` (front) y `cover-2` (back) que garantiza que las tapas se vean centradas y aisladas del resto de páginas.
* **Estilo de Código Estricto:** Configuración de ESLint con estilo **Allman** y alineación de propiedades para máxima legibilidad.

## 🛠️ Tecnologías Utilizadas

* [React](https://reactjs.org/) - Biblioteca de UI.
* [Vite](https://vitejs.dev/) - Herramienta de construcción ultra rápida.
* [React-PageFlip](https://nodlik.github.io/react-pageflip/) - Motor del libro interactivo.
* [TypeScript](https://www.typescriptlang.org/) - Tipado estático para un código robusto.
* [Stylistic ESLint](https://eslint.style/) - Formateo de código personalizado.

## 🚀 Instalación y Uso

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)
    cd tu-repositorio
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar el entorno de desarrollo:**
    ```bash
    npm run dev
    ```

4.  **Formatear el código (opcional):**
    Para aplicar el estilo de llaves Allman y alineación de dos puntos:
    ```bash
    npx eslint . --fix
    ```

## 📂 Estructura de Imágenes

El proyecto carga las imágenes automáticamente desde la carpeta `src/assets/images/` siguiendo esta estructura:
* `/covers/`: Contiene `cover-1` y `cover-2`.
* `/chapter-0/`: Prólogo.
* `/character-description/`: Información de personajes.
* `/chapter-01/` a `/chapter-13/`: Capítulos principales.
* `/final-chapter/`: Conclusión.

## ✒️ Estilo de Código

Este proyecto utiliza una configuración de ESLint específica:
* **Brace Style:** Allman (llaves en la siguiente línea).
* **Key Spacing:** Dos puntos alineados verticalmente en objetos.
* **Functions:** Espacio obligatorio antes de los paréntesis: `function ()`.

---
Desarrollado con ❤️ Pam.