document.addEventListener('DOMContentLoaded', () => {
    let selectedDeck = null;
    let gameDeck = [];
    let currentPlayerIndex = 0;
    let showingPlaceholder = false; // Controla el estado "???"
  
    // Mazos predeterminados
    const presetDecks = {
      paises: ["Argentina", "Brasil", "Canadá", "China", "Egipto", "España", "Francia", "India", "Italia", "Japón", "México", "Rusia", "Sudáfrica", "Estados Unidos"],
      ciudades: ["Nueva York", "Londres", "Tokio", "París", "Roma", "Sídney", "Berlín", "Beijing", "São Paulo", "Moscú", "Toronto", "Dubái", "Madrid", "Los Ángeles"],
      animales: ["Elefante", "León", "Tigre", "Oso", "Jirafa", "Cebra", "Gorila", "Panda", "Canguro", "Hipopótamo", "Rinoceronte", "Lobo", "Águila"],
      frutas: ["Manzana", "Banana", "Cereza", "Durazno", "Fresa", "Kiwi", "Limón", "Mango", "Naranja", "Pera", "Piña", "Sandía", "Uva"],
      personajesHistoricos: ["Napoleón", "Cleopatra", "Einstein", "Gandhi", "Lincoln", "Mandela", "Newton", "Shakespeare", "Tesla"],
      peliculasClasicas: ["Casablanca", "El Padrino", "Lo que el viento se llevó", "Psicosis", "Ciudadano Kane", "Cantando bajo la lluvia", "La Dolce Vita"],
      deportes: ["Fútbol", "Baloncesto", "Tenis", "Natación", "Atletismo", "Ciclismo", "Boxeo", "Golf", "Rugby", "Voleibol"],
      espacio: ["Estación Espacial Internacional", "Marte", "Luna", "Júpiter", "Saturno", "Vía Láctea", "Andrómeda", "Nebulosa", "Agujero Negro"],
      librosClasicos: ["Don Quijote", "Moby Dick", "Orgullo y Prejuicio", "1984", "Hamlet", "El Gran Gatsby", "Ulises", "La Odisea", "Crimen y Castigo"],
      naturaleza: ["Bosque", "Desierto", "Montaña", "Océano", "Río", "Lago", "Cascada", "Volcán", "Glaciar"],
      comidas: ["Pizza", "Hamburguesa", "Sushi", "Tacos", "Pasta", "Paella", "Curry", "Ensalada", "Sopa", "Sandwich"],
      superheroes: ["Superman", "Batman", "Spiderman", "Ironman", "Wonder Woman", "Hulk", "Thor", "Capitán América", "Flash", "Aquaman"],
      musica: ["Rock", "Pop", "Jazz", "Clásica", "Hip-Hop", "Reggae", "Blues", "Country", "Electrónica", "Folk"],
      tecnologia: ["Computadora", "Smartphone", "Internet", "Robótica", "Inteligencia Artificial", "Realidad Virtual", "Drones", "Nanotecnología", "Blockchain"],
      profesiones: ["Doctor", "Ingeniero", "Profesor", "Abogado", "Arquitecto", "Científico", "Artista", "Músico", "Escritor", "Chef"]
    };
  
    // Obtener elementos del menú y secciones
    const navItems = document.querySelectorAll('.nav-menu ul li');
    const sections = document.querySelectorAll('section');
  
    // Función para cambiar de sección
    function switchToSection(sectionId) {
      sections.forEach(sec => sec.classList.toggle('active', sec.id === sectionId));
      navItems.forEach(item => item.classList.toggle('active', item.getAttribute('data-section') === sectionId));
    }
  
    // Configurar navegación en el menú
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        switchToSection(item.getAttribute('data-section'));
      });
    });
  
    // Botón "Volver" en Instrucciones
    const backFromInfo = document.getElementById('backFromInfo');
    if (backFromInfo) {
      backFromInfo.addEventListener('click', () => {
        switchToSection('deck');
      });
    }
  
    // **Selección automática de mazo y paso directo al juego**
    const cardOptions = document.querySelectorAll('.card-option');
    cardOptions.forEach(option => {
      option.addEventListener('click', () => {
        cardOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
  
        // **Seleccionar mazo y pasar a la pantalla de juego**
        const deckKey = option.getAttribute('data-value');
        selectedDeck = presetDecks[deckKey] || [];
        console.log('Mazo seleccionado:', selectedDeck); // Depuración en consola
  
        if (selectedDeck.length > 0) {
          switchToSection('play');
        } else {
          alert("Mazo vacío o no encontrado.");
        }
      });
    });
  
    // **Sección de juego**
    const startGameBtn = document.getElementById('startGameBtn');
    const numPlayersInput = document.getElementById('numPlayersInput');
    const playerCardsSection = document.getElementById('playerCards');
    const currentCard = document.getElementById('currentCard');
    const nextCardBtn = document.getElementById('nextCardBtn');
  
    if (startGameBtn) {
      startGameBtn.addEventListener('click', () => {
        const numPlayers = parseInt(numPlayersInput.value);
        if (numPlayers < 3) {
          alert('Debe haber al menos 3 jugadores.');
          return;
        }
        if (!selectedDeck || selectedDeck.length === 0) {
          alert('No hay un mazo seleccionado.');
          return;
        }
  
        // **Elegir una ubicación al azar**
        const randomIndex = Math.floor(Math.random() * selectedDeck.length);
        const chosenLocation = selectedDeck[randomIndex];
  
        // **Crear el mazo: (numPlayers - 1) cartas con la ubicación + 1 carta de "Espía"**
        gameDeck = Array(numPlayers - 1).fill(chosenLocation);
        gameDeck.push("Espía");
        shuffleArray(gameDeck);
  
        console.log('Cartas mezcladas:', gameDeck); // Depuración en consola
  
        // **Inicializar el índice del jugador**
        currentPlayerIndex = 0;
        playerCardsSection.style.display = "block";
        nextCardBtn.disabled = false;
        showingPlaceholder = false; // Reiniciar estado
  
        // **Mostrar la primera carta con "???"**
        showNextCard();
      });
    }
  
    if (nextCardBtn) {
      nextCardBtn.addEventListener('click', showNextCard);
    }
  
    // **Mostrar cartas una por una con el efecto "???"**
    function showNextCard() {
      if (currentPlayerIndex >= gameDeck.length) {
        currentCard.innerHTML = `<span class="card-text">Fin del juego</span>`;
        nextCardBtn.disabled = true; // **Desactivar el botón cuando termine el juego**
        console.log("Fin del juego.");
        return;
      }
  
      if (showingPlaceholder) {
        // **Si se estaba mostrando "???", ahora sí mostramos la carta real**
        currentCard.innerHTML = `<span class="card-text">Jugador ${currentPlayerIndex + 1}: ${gameDeck[currentPlayerIndex]}</span>`;
        currentCard.classList.add("card-flip");
  
        setTimeout(() => {
          currentCard.classList.remove("card-flip");
        }, 600);
  
        console.log(`Carta mostrada para el Jugador ${currentPlayerIndex + 1}: ${gameDeck[currentPlayerIndex]}`);
  
        currentPlayerIndex++; // Avanza al siguiente jugador después de mostrar la carta real
        showingPlaceholder = false;
      } else {
        // **Mostrar "???" antes de la carta real**
        currentCard.innerHTML = `<span class="card-placeholder">???</span>`;
        showingPlaceholder = true;
        console.log("Mostrando ??? antes de revelar carta.");
      }
    }
  
    // **Función para mezclar un array (shuffle)**
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  });