document.addEventListener("DOMContentLoaded", () => {
  let selectedDeck = null;
  let gameDeck = [];
  let currentPlayerIndex = 0;

  // IMPORTANTE: declaramos showingFront en el ámbito global
  let showingFront = true;

  // Lista de mazos predeterminados
  const presetDecks = {
    "paises": ["Argentina", "Brasil", "Canadá", "China", "Egipto", "España", "Francia", "India", "Italia", "Japón", "México", "Rusia", "Sudáfrica", "Estados Unidos"],
    "ciudades": ["Nueva York", "Londres", "Tokio", "París", "Roma", "Sídney", "Berlín", "Beijing", "São Paulo", "Moscú", "Toronto", "Dubái", "Madrid", "Los Ángeles"],
    "animales": ["Elefante", "León", "Tigre", "Oso", "Jirafa", "Cebra", "Gorila", "Panda", "Canguro", "Hipopótamo", "Rinoceronte", "Lobo", "Águila"],
    "frutas": ["Manzana", "Banana", "Cereza", "Durazno", "Fresa", "Kiwi", "Limón", "Mango", "Naranja", "Pera", "Piña", "Sandía", "Uva"],
    "personajesHistoricos": ["Napoleón", "Cleopatra", "Einstein", "Gandhi", "Lincoln", "Mandela", "Newton", "Shakespeare", "Tesla"],
    "peliculasClasicas": ["Casablanca", "El Padrino", "Lo que el viento se llevó", "Psicosis", "Ciudadano Kane", "Cantando bajo la lluvia", "La Dolce Vita"],
    "deportes": ["Fútbol", "Baloncesto", "Tenis", "Natación", "Atletismo", "Ciclismo", "Boxeo", "Golf", "Rugby", "Voleibol"],
    "espacio": ["Estación Espacial Internacional", "Marte", "Luna", "Júpiter", "Saturno", "Vía Láctea", "Andrómeda", "Nebulosa", "Agujero Negro"],
    "librosClasicos": ["Don Quijote", "Moby Dick", "Orgullo y Prejuicio", "1984", "Hamlet", "El Gran Gatsby", "Ulises", "La Odisea", "Crimen y Castigo"],
    "naturaleza": ["Bosque", "Desierto", "Montaña", "Océano", "Río", "Lago", "Cascada", "Volcán", "Glaciar"],
    "comidas": ["Pizza", "Hamburguesa", "Sushi", "Tacos", "Pasta", "Paella", "Curry", "Ensalada", "Sopa", "Sandwich"],
    "superheroes": ["Superman", "Batman", "Spiderman", "Ironman", "Wonder Woman", "Hulk", "Thor", "Capitán América", "Flash", "Aquaman"],
    "musica": ["Rock", "Pop", "Jazz", "Clásica", "Hip-Hop", "Reggae", "Blues", "Country", "Electrónica", "Folk"],
    "tecnologia": ["Computadora", "Smartphone", "Internet", "Robótica", "Inteligencia Artificial", "Realidad Virtual", "Drones", "Nanotecnología", "Blockchain"],
    "profesiones": ["Doctor", "Ingeniero", "Profesor", "Abogado", "Arquitecto", "Científico", "Artista", "Músico", "Escritor", "Chef"]
  };

  // Referencias de elementos
  const startGameBtn     = document.getElementById("startGameBtn");
  const numPlayersInput  = document.getElementById("numPlayersInput");
  const playerCardsSection = document.getElementById("playerCards");
  const nextCardBtn      = document.getElementById("nextCardBtn");

  // Referencias a la única carta que tendremos en pantalla
  const cardFlipper      = document.getElementById("cardFlipper");
  const cardFront        = document.getElementById("cardFront");
  const cardBack         = document.getElementById("cardBack");

  // =============== LÓGICA DE MAZOS PREDEFINIDOS ===============
  document.querySelectorAll(".card-option").forEach(option => {
    option.addEventListener("click", () => {
      // Quitar selección previa
      document.querySelectorAll(".card-option").forEach(opt => opt.classList.remove("selected"));
      option.classList.add("selected");

      // Obtiene la key del mazo
      const deckKey = option.getAttribute("data-value");
      if (presetDecks[deckKey]) {
        selectedDeck = [...presetDecks[deckKey]];
        console.log("Mazo seleccionado:", selectedDeck);
      } else {
        selectedDeck = [];
        console.error("Mazo no encontrado:", deckKey);
      }

      if (selectedDeck.length) {
        switchToSection("play");
      } else {
        alert("Mazo vacío o no encontrado.");
      }
    });
  });

  // =============== INICIAR PARTIDA ===============
  startGameBtn?.addEventListener("click", () => {
    const numPlayers = parseInt(numPlayersInput.value);
    if (numPlayers < 3) {
      alert("Debe haber al menos 3 jugadores.");
      return;
    }
    if (!selectedDeck || selectedDeck.length === 0) {
      alert("No hay un mazo seleccionado.");
      return;
    }

    // Crear el deck de la partida
    const chosenLocation = selectedDeck[Math.floor(Math.random() * selectedDeck.length)];
    gameDeck = Array(numPlayers - 1).fill(chosenLocation);
    gameDeck.push("Espía");
    shuffleArray(gameDeck);

    currentPlayerIndex = 0;
    showingFront = true;

    // Mostrar la sección de juego y habilitar botón
    playerCardsSection.style.display = "block";
    nextCardBtn.disabled = false;

    // Estado inicial de la carta
    cardFront.textContent = "???";
    cardBack.textContent  = "";
    cardFlipper.classList.remove("flip");
  });

  // =============== SIGUIENTE CARTA (FLIP) ===============
  nextCardBtn?.addEventListener("click", () => {
    if (showingFront) {
      // Mostrar la parte trasera (espía o ubicación)
      if (currentPlayerIndex >= gameDeck.length) {
        cardFront.textContent = "Fin del juego";
        cardBack.textContent  = "";
        nextCardBtn.disabled  = true;
        return;
      }

      cardBack.textContent = `Jugador ${currentPlayerIndex + 1}: ${gameDeck[currentPlayerIndex]}`;
      cardFlipper.classList.add("flip");  // Se voltea a la trasera
      showingFront = false;
    } else {
      // Venimos de la trasera, quitamos flip y avanzamos al siguiente
      cardFlipper.classList.remove("flip");
      currentPlayerIndex++;

      if (currentPlayerIndex >= gameDeck.length) {
        cardFront.textContent = "Fin del juego";
        cardBack.textContent  = "";
        nextCardBtn.disabled = true;
      } else {
        cardFront.textContent = "???";
        cardBack.textContent  = "";
      }
      showingFront = true;
    }
  });

  // =============== FUNCIÓN PARA BARAJAR ===============
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // =============== FUNCIÓN PARA CAMBIAR SECCIONES ===============
  function switchToSection(sectionId) {
    document.querySelectorAll("section").forEach(sec => {
      sec.classList.toggle("active", sec.id === sectionId);
    });
    document.querySelectorAll(".nav-menu li").forEach(li => {
      li.classList.toggle("active", li.getAttribute("data-section") === sectionId);
    });
  }

  // Navegación en el menú
  document.querySelectorAll(".nav-menu ul li").forEach(item => {
    item.addEventListener("click", () => {
      const targetSection = item.getAttribute("data-section");
      switchToSection(targetSection);
    });
  });

  // =============== LÓGICA MAZO PERSONALIZADO ===============
  const addCardBtn      = document.getElementById("addCardBtn");
  const newCardInput    = document.getElementById("newCardInput");
  const customDeckList  = document.getElementById("customDeckList");
  const useCustomDeckBtn= document.getElementById("useCustomDeckBtn");
  let customDeck        = [];

  // Agregar carta al mazo personalizado
  addCardBtn?.addEventListener("click", () => {
    const cardText = newCardInput.value.trim();
    if (cardText) {
      customDeck.push(cardText);
      newCardInput.value = "";
      renderCustomDeckList();
    }
  });

  // Renderizar la lista de cartas en el UL
  function renderCustomDeckList() {
    customDeckList.innerHTML = "";
    customDeck.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = item;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "X";
      deleteBtn.addEventListener("click", () => {
        customDeck.splice(index, 1);
        renderCustomDeckList();
      });

      li.appendChild(deleteBtn);
      customDeckList.appendChild(li);
    });
  }

  // Usar el mazo personalizado
  useCustomDeckBtn?.addEventListener("click", () => {
    if (customDeck.length === 0) {
      alert("Tu mazo personalizado está vacío.");
      return;
    }
    selectedDeck = [...customDeck];
    console.log("Mazo personalizado seleccionado:", selectedDeck);
    switchToSection("play");
  });
});
