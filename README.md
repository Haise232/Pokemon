# 🎮 ¿Quién es ese Pokémon?

Un juego interactivo de adivinanzas de Pokémon con diseño moderno, múltiples modos de juego y cartas TCG coleccionables.

![Game Preview](https://img.shields.io/badge/Pokemon-Game-yellow?style=for-the-badge&logo=pokemon)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 📋 Descripción

**¿Quién es ese Pokémon?** es un juego web inspirado en el clásico segmento del anime de Pokémon. Los jugadores deben adivinar el nombre del Pokémon basándose en su silueta. El juego incluye múltiples niveles de dificultad, modos de juego variados, sistema de puntuación, logros, y revela hermosas cartas estilo TCG (Trading Card Game) al acertar.

## ✨ Características Principales

### 🎯 Modos de Juego
- **Normal**: Juega sin límites de tiempo ni vidas
- **Contrarreloj**: 60 segundos para adivinar todos los Pokémon posibles
- **Supervivencia**: 3 vidas - ¡no falles!

### 🎲 Niveles de Dificultad
- **Fácil**: Generación 1 (1-151 Pokémon)
- **Medio**: Generaciones 1-3 (1-386 Pokémon)
- **Difícil**: Todas las generaciones (1-898 Pokémon)

### 🃏 Cartas TCG Interactivas
Al adivinar correctamente, se revela una carta de Pokémon estilo Trading Card Game con:
- Nombre y número de Pokédex
- Tipos con símbolos únicos
- HP y estadísticas
- Ataques temáticos según el tipo
- Debilidades y resistencias
- Altura y peso
- Diseño premium con efectos glassmorfismo

### 🎨 Características de Diseño
- **Interfaz moderna** con efectos glassmorfismo
- **Animaciones fluidas** y transiciones suaves
- **Sistema de partículas** (confetti) al acertar
- **Gradientes dinámicos** de fondo
- **Diseño responsive** optimizado para móviles
- **Loader animado** con Pokébola

### 💡 Sistema de Pistas
- Pistas inteligentes que revelan información progresivamente
- Pista 1: Tipo(s) del Pokémon
- Pista 2: Primera letra del nombre
- Pista 3: Altura y peso
- Pista 4: Número de letras en el nombre
- Costo: 5 puntos por pista

### 📊 Estadísticas y Logros
- Total de Pokémon adivinados
- Porcentaje de precisión
- Mejor puntuación personal
- Mejor racha consecutiva
- Sistema de logros desbloqueables:
  - 🌟 Primera Victoria
  - 🔥 Racha de 5
  - 💯 Racha de 10
  - ⚡ Racha de 20
  - 🎯 50 Acertados
  - 🏆 100 Acertados
  - 👑 200 Acertados

### ⚙️ Configuración Personalizable
- Activar/desactivar efectos de sonido
- Activar/desactivar animaciones
- Activar/desactivar confetti
- Reiniciar estadísticas

### 🎮 Características de Jugabilidad
- **Sistema de intentos**: 3 intentos por Pokémon
- **Tolerancia a errores**: Algoritmo de Levenshtein para aceptar nombres con pequeños errores ortográficos
- **Feedback visual**: Mensajes de similitud cuando estás cerca del nombre correcto
- **Sistema de puntuación dinámico**:
  - Acierto al primer intento: +10 puntos
  - Acierto al segundo intento: +7 puntos
  - Acierto al tercer intento: +5 puntos
  - Racha consecutiva: +5 puntos extra

## 🚀 Inicio Rápido

### Instalación

1. Clona o descarga este repositorio:
```bash
git clone https://github.com/tuusuario/pokemon-game.git
```

2. Abre el archivo `index.html` en tu navegador preferido:
```bash
# En sistemas basados en Unix
open index.html

# En Windows
start index.html
```

¡No se requieren dependencias ni instalación adicional! 🎉

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a Internet (para cargar Pokémon desde la PokeAPI)

## 🎮 Cómo Jugar

1. **Observa la silueta** del Pokémon que aparece
2. **Escribe el nombre** en el campo de texto
3. **Presiona "Adivinar"** o Enter para verificar tu respuesta
4. Si necesitas ayuda, usa el botón **💡 Pista** (cuesta 5 puntos)
5. Al acertar, se revelará la **carta TCG** del Pokémon
6. Haz clic en **"Siguiente Pokémon"** para continuar

### Consejos
- ✅ Pequeños errores ortográficos son aceptados
- ✅ No distingue mayúsculas/minúsculas
- ✅ Tienes 3 intentos por cada Pokémon
- ✅ Acertar al primer intento da más puntos

## 🏗️ Estructura del Proyecto

```
Pokemon/
│
├── index.html          # Estructura HTML del juego
├── style.css           # Estilos, animaciones y diseño responsive
├── script.js           # Lógica del juego, API y funcionalidades
└── README.md           # Documentación del proyecto
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica del juego
- **CSS3**: 
  - Flexbox y Grid para layouts responsive
  - Animaciones y transiciones CSS
  - Efectos glassmorfismo
  - Variables CSS para tematización
- **JavaScript (Vanilla)**:
  - API Fetch para obtener datos de Pokémon
  - LocalStorage para persistencia de datos
  - Canvas API para animaciones de confetti
  - Algoritmo de Levenshtein para comparación de strings
- **APIs Externas**:
  - [PokéAPI](https://pokeapi.co/) - Base de datos de Pokémon
- **Fuentes**:
  - Press Start 2P - Estilo retro para título
  - Poppins - Texto moderno y legible

## 📡 API y Datos

El juego utiliza la [PokéAPI](https://pokeapi.co/) para obtener información en tiempo real de los Pokémon:
- Sprites oficiales (normal y artwork)
- Nombres en español
- Tipos y estadísticas
- Altura y peso
- Especies y cadenas evolutivas

## 💾 Persistencia de Datos

El juego utiliza **LocalStorage** del navegador para guardar:
- Estadísticas del jugador
- Configuración personal
- Mejor puntuación
- Logros desbloqueados
- Preferencia de no mostrar tutorial

## 🎨 Características de Diseño

### Sistema de Colores
- Gradiente de fondo dinámico
- Colores temáticos por tipo de Pokémon
- Efectos glassmorfismo con backdrop-filter
- Esquema de colores premium

### Animaciones
- Shake en respuestas incorrectas
- Bounce en respuestas correctas
- Fade-in/out para transiciones
- Animación del loader (Pokébola rotando)
- Confetti animado con Canvas

### Responsive Design
- Diseño optimizado para escritorio, tablet y móvil
- Breakpoints en 768px y 480px
- Grid adaptativo para estadísticas
- Controles táctiles optimizados

## 🔧 Configuración Avanzada

### Modificar Rangos de Dificultad

Edita el objeto `CONFIG` en `script.js`:
```javascript
const CONFIG = {
    difficulty: {
        easy: { min: 1, max: 151 },      // Gen 1
        medium: { min: 1, max: 386 },    // Gen 1-3
        hard: { min: 1, max: 898 }       // Todas
    }
}
```

### Personalizar Modos de Juego

```javascript
const CONFIG = {
    modes: {
        normal: { time: null, lives: null },
        timed: { time: 60, lives: null },
        survival: { time: null, lives: 3 }
    }
}
```

## 🐛 Solución de Problemas

### Las imágenes no cargan
- Verifica tu conexión a Internet
- La PokéAPI podría estar temporalmente fuera de servicio
- Comprueba la consola del navegador (F12) para errores

### El juego no guarda estadísticas
- Asegúrate de que LocalStorage esté habilitado en tu navegador
- Algunos navegadores en modo privado/incógnito no permiten LocalStorage

### Problemas de rendimiento
- Desactiva las animaciones en Configuración ⚙️
- Desactiva el confetti si experimentas lag
- Cierra otras pestañas del navegador

## 📈 Mejoras Futuras

- [ ] Modo multijugador online
- [ ] Ranking global de jugadores
- [ ] Más modos de juego (duelo, maratón)
- [ ] Sistema de colección de cartas
- [ ] Efectos de sonido temáticos
- [ ] Búsqueda por generación específica
- [ ] Modo oscuro/claro
- [ ] Soporte para más idiomas

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar el juego:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## 🙏 Agradecimientos

- [PokéAPI](https://pokeapi.co/) por proporcionar la API gratuita
- The Pokémon Company por los increíbles diseños
- Nintendo y Game Freak por crear Pokémon
- Comunidad de desarrolladores web por inspiración

## 📞 Contacto

¿Preguntas o sugerencias? ¡No dudes en contactar!

**Joaquín** - Desarrollador

---

<div align="center">

**¡Diviértete atrapándolos a todos!** 🎮✨

*"Hazte con todos"* 

</div>
