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

  const startGameBtn = document.getElementById("startGameBtn");
  const numPlayersInput = document.getElementById("numPlayersInput");
  const numSpiesInput = document.getElementById("numSpiesInput"); // <-- NUEVO
  const playerCardsSection = document.getElementById("playerCards");
  const nextCardBtn = document.getElementById("nextCardBtn");

  const cardFlipper = document.getElementById("cardFlipper");
  const cardFront   = document.getElementById("cardFront");
  const cardBack    = document.getElementById("cardBack");

  // (2) Cada vez que cambie el número de jugadores, revisamos si hay > 5
  numPlayersInput.addEventListener("input", () => {
    const numPlayers = parseInt(numPlayersInput.value);
    if (numPlayers > 5) {
      // Habilitamos la entrada de espías
      numSpiesInput.disabled = false;
    } else {
      // Deshabilitamos y forzamos 1 espía
      numSpiesInput.disabled = true;
      numSpiesInput.value = "1";
    }
  });

  // (3) Lógica para mazos predeterminados (igual que antes)
  document.querySelectorAll(".card-option").forEach(option => {
    option.addEventListener("click", () => {
      document.querySelectorAll(".card-option").forEach(opt => opt.classList.remove("selected"));
      option.classList.add("selected");

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

  // (4) Al iniciar el juego
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

    // (5) Si numPlayers > 5 => leemos de numSpiesInput, si no => 1 espía
    let spiesCount = 1; // valor por defecto
    if (numPlayers > 5) {
      const inputSpies = parseInt(numSpiesInput.value);
      // Validación básica: no puede haber más espías que (jugadores - 1)
      if (inputSpies < 1 || inputSpies >= numPlayers) {
        alert("Número de espías inválido. Debe ser al menos 1 y menor que el total de jugadores.");
        return;
      }
      spiesCount = inputSpies;
    }

    // (6) Creamos el deck: # de espías = spiesCount, resto = ubicación
    const chosenLocation = selectedDeck[Math.floor(Math.random() * selectedDeck.length)];
    const totalLocations = numPlayers - spiesCount; // cuántos NO espías
    gameDeck = Array(totalLocations).fill(chosenLocation);

    for (let i = 0; i < spiesCount; i++) {
      gameDeck.push("Espía");
    }
    shuffleArray(gameDeck);

    // Reseteamos
    currentPlayerIndex = 0;
    showingFront = true;

    // Mostramos sección de juego
    playerCardsSection.style.display = "block";
    nextCardBtn.disabled = false;

    cardFront.textContent = "???";
    cardBack.textContent  = "";
    cardFlipper.classList.remove("flip");
  });

  // (7) Siguiente Carta (flip)
  nextCardBtn?.addEventListener("click", () => {
    if (showingFront) {
      if (currentPlayerIndex >= gameDeck.length) {
        cardFront.textContent = "Fin del juego";
        cardBack.textContent  = "";
        nextCardBtn.disabled = true;
        return;
      }
      cardBack.textContent = `Jugador ${currentPlayerIndex + 1}: ${gameDeck[currentPlayerIndex]}`;
      cardFlipper.classList.add("flip");
      showingFront = false;
    } else {
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

  // (8) Resto de funciones (shuffle, switchToSection, etc.)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function switchToSection(sectionId) {
    document.querySelectorAll("section").forEach(sec => {
      sec.classList.toggle("active", sec.id === sectionId);
    });
    document.querySelectorAll(".nav-menu li").forEach(li => {
      li.classList.toggle("active", li.getAttribute("data-section") === sectionId);
    });
  }

  document.querySelectorAll(".nav-menu ul li").forEach(item => {
    item.addEventListener("click", () => {
      const targetSection = item.getAttribute("data-section");
      switchToSection(targetSection);
    });
  });

  // (9) Lógica para Mazo Personalizado (igual que antes)
  const addCardBtn      = document.getElementById("addCardBtn");
  const newCardInput    = document.getElementById("newCardInput");
  const customDeckList  = document.getElementById("customDeckList");
  const useCustomDeckBtn= document.getElementById("useCustomDeckBtn");
  let customDeck        = [];

  addCardBtn?.addEventListener("click", () => {
    const cardText = newCardInput.value.trim();
    if (cardText) {
      customDeck.push(cardText);
      newCardInput.value = "";
      renderCustomDeckList();
    }
  });

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

  useCustomDeckBtn?.addEventListener("click", () => {
    if (customDeck.length === 0) {
      alert("Tu mazo personalizado está vacío.");
      return;
    }
    selectedDeck = [...customDeck];
    switchToSection("play");
  });
});