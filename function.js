document.addEventListener("DOMContentLoaded", () => {
    let selectedDeck = null;
    let gameDeck = [];
    let currentPlayerIndex = 0;
  
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
  
    // Referencias para la sección "Mazo Predeterminado"
    document.querySelectorAll(".card-option").forEach(option => {
      option.addEventListener("click", () => {
        // Quita la selección previa
        document.querySelectorAll(".card-option").forEach(opt => opt.classList.remove("selected"));
        // Marca la nueva selección
        option.classList.add("selected");
  
        const deckKey = option.getAttribute("data-value");
        if (presetDecks[deckKey]) {
          selectedDeck = [...presetDecks[deckKey]];
          console.log("Mazo seleccionado:", selectedDeck);
        } else {
          selectedDeck = [];
          console.error("Mazo no encontrado:", deckKey);
        }
        // Cambiamos a la sección de juego
        if (selectedDeck.length) switchToSection("play");
        else alert("Mazo vacío o no encontrado.");
      });
    });
  
    const startGameBtn = document.getElementById("startGameBtn");
    const numPlayersInput = document.getElementById("numPlayersInput");
    const playerCardsSection = document.getElementById("playerCards");
    const currentCard = document.getElementById("currentCard");
    const nextCardBtn = document.getElementById("nextCardBtn");
  
    // Al iniciar la partida
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
  
      // Elegimos una ubicación al azar
      const chosenLocation = selectedDeck[Math.floor(Math.random() * selectedDeck.length)];
      // Creamos el 'gameDeck': todos con la ubicación menos 1 "Espía"
      gameDeck = Array(numPlayers - 1).fill(chosenLocation);
      gameDeck.push("Espía");
  
      shuffleArray(gameDeck);
  
      currentPlayerIndex = 0;
      playerCardsSection.style.display = "block";
      nextCardBtn.disabled = false;
      showNextCard();
    });
  
    // Mostrar siguiente carta
    function showNextCard() {
      if (currentPlayerIndex >= gameDeck.length) {
        currentCard.innerHTML = `<span class="card-text">Fin del juego</span>`;
        nextCardBtn.disabled = true;
      } else {
        currentCard.innerHTML = `<span class="card-text">Jugador ${currentPlayerIndex + 1}: ${gameDeck[currentPlayerIndex]}</span>`;
        currentPlayerIndex++;
      }
    }
  
    nextCardBtn?.addEventListener("click", showNextCard);
  
    // Función para barajar
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  
    // Cambiar entre secciones
    function switchToSection(sectionId) {
      document.querySelectorAll("section").forEach(sec => {
        sec.classList.toggle("active", sec.id === sectionId);
      });
      // También actualizar la clase 'active' en el menú
      document.querySelectorAll(".nav-menu li").forEach(li => {
        li.classList.toggle("active", li.getAttribute("data-section") === sectionId);
      });
    }
  
    // Navegación para cada elemento del menú
    document.querySelectorAll(".nav-menu ul li").forEach(item => {
      item.addEventListener("click", () => {
        const targetSection = item.getAttribute("data-section");
        switchToSection(targetSection);
      });
    });
  
    // ---------------------
    // Lógica "Mazo Personalizado"
    // ---------------------
    const addCardBtn = document.getElementById("addCardBtn");
    const newCardInput = document.getElementById("newCardInput");
    const customDeckList = document.getElementById("customDeckList");
    const useCustomDeckBtn = document.getElementById("useCustomDeckBtn");
  
    let customDeck = [];
  
    // Agregar carta al mazo personalizado
    addCardBtn?.addEventListener("click", () => {
      const cardText = newCardInput.value.trim();
      if (cardText) {
        customDeck.push(cardText);
        newCardInput.value = "";
        renderCustomDeckList();
      }
    });
  
    // Eliminar carta de la lista
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
  
    // Al pulsar "Usar este Mazo", se lo asignamos a selectedDeck
    useCustomDeckBtn?.addEventListener("click", () => {
      if (customDeck.length === 0) {
        alert("Tu mazo personalizado está vacío.");
        return;
      }
      selectedDeck = [...customDeck];
      
      switchToSection("play");
    });
  });
