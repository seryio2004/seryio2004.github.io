document.addEventListener("DOMContentLoaded", () => {
    let selectedDeck = null;
    let gameDeck = [];
    let currentPlayerIndex = 0;
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


    console.log("Mazos disponibles:", Object.keys(presetDecks));

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

            selectedDeck.length ? switchToSection("play") : alert("Mazo vacío o no encontrado.");
        });
    });

    const startGameBtn = document.getElementById("startGameBtn");
    const numPlayersInput = document.getElementById("numPlayersInput");
    const playerCardsSection = document.getElementById("playerCards");
    const currentCard = document.getElementById("currentCard");
    const nextCardBtn = document.getElementById("nextCardBtn");

    if (startGameBtn) {
        startGameBtn.addEventListener("click", () => {
            const numPlayers = parseInt(numPlayersInput.value);
            if (numPlayers < 3) return alert("Debe haber al menos 3 jugadores.");
            if (!selectedDeck || selectedDeck.length === 0) return alert("No hay un mazo seleccionado.");

            const chosenLocation = selectedDeck[Math.floor(Math.random() * selectedDeck.length)];
            gameDeck = Array(numPlayers - 1).fill(chosenLocation);
            gameDeck.push("Espía");
            shuffleArray(gameDeck);

            currentPlayerIndex = 0;
            playerCardsSection.style.display = "block";
            nextCardBtn.disabled = false;
            showNextCard();
        });
    }

    function showNextCard() {
        if (currentPlayerIndex >= gameDeck.length) {
            currentCard.innerHTML = `<span class="card-text">Fin del juego</span>`;
            nextCardBtn.disabled = true;
        } else {
            currentCard.innerHTML = `<span class="card-text">Jugador ${currentPlayerIndex + 1}: ${gameDeck[currentPlayerIndex]}</span>`;
            currentPlayerIndex++;
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function switchToSection(sectionId) {
        document.querySelectorAll("section").forEach(sec => sec.classList.toggle("active", sec.id === sectionId));
    }

    nextCardBtn?.addEventListener("click", showNextCard);
});
