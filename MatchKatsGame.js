// to do:

// add og remove player button bør ikke slette eksisterende piles; der bør i stedet være en dedikeret knap som ryder alle piles, men beholder antallet af spillere

// piles centreret på siden (både horisonalt og vertikalt)
// automatisk overgang til ny linje for piles, når der ikke er mere plads på skærmen
// labels for spiller nummer + mulighed for at indtaste navne
// labels for pile size
// turn tracker indicator
// skalering af alle elements (piles, cards, buttons) baseret på relative enheder
// kort countdown/delay mellem "draw card"-click og visning af nyt kort
// animation/visuel indikation/transition på nyt kort, både når nyt draw og efter drop i drag&drop (=> så trigger er nå topCard ændres) 
// draw cards to all

// Settings
const settings = {
    lang: "dansk",
    allowDuplicates: false
};

// Icon gallery
const iconGallery = {
    "1_red": "images/cats/cute-kitten1_red.png",
    "2_gold": "images/cats/cute-kitten2_gold.png",
    "3_purple": "images/cats/cute-kitten3_purple.png",
    "4_lightblue": "images/cats/cute-kitten4_lightblue.png",
    "5_lime": "images/cats/cute-kitten5_lime.png",
    "6_turquoise": "images/cats/cute-kitten6_turquoise.png",
    "7_pink": "images/cats/cute-kitten7_pink.png",
    "8_white": "images/cats/cute-kitten8_white.png",
    "3N8_pinkNpurple": "images/cats/cute-kitten3_8_Pair_pink_purple.png",
    "4N4_redNblue": "images/cats/cute-kitten4_Pair_red_white.png",
    "5N1_goldNlime": "images/cats/cute-kitten5_1_Pair_golden_lime.png"
};

// Add this temporarily after the iconGallery definition
console.log("Testing image path:", iconGallery["1_red"]);
const testImg = new Image();
testImg.onload = function() { console.log("Image loaded successfully!"); };
testImg.onerror = function() { console.log("Image failed to load!"); };
testImg.src = iconGallery["1_red"];

// Category library
const categoryLibrary = {
    dansk: [
        "Beatles sang", "Rapper", "Frugt", "Grøntsag", "Nordisk rock gruppe", "Amerikansk rock sang", "Boy band", "Klassisk komponist", "Insekt", "Kæledyr", "Blomst", "Træ", "Smykke", "Afrikansk land", "Krimi serie", "Musik instrument", "Bilmærke", "Tøjmærke", "Supermarked", "Animationsfilm", "Dansk sø", "Dansk ø", "Middelhavs ø", "Verdens hav", "Luftfartøj", "Asiatisk land", "Europæisk hovedstad", "Kortspil", "Brætspil", "Slik producent", "Helligdag", "Nordisk gud", "Græsk gud", "Overnaturlig væsen", "Dans", "Madret", "Cocktail", "Hobby", "Statsoverhoved", "Vejrfænomen", "Valuta", "Nordamerikansk by", "Tysk by", "Internet udbyder", "Køkken redskab", "Superhelt", "Dansk skuespillerinde", "Offentlig organsiation", "Synd", "Julesang", "Kærlighedsfilm", "Velgørenheds organisation", "Politisk ideologi", "Europæisk pop musiker", "Abe", "Dressing", "Krydderi", "Planet",
        "Musik genre", "Fisk", "Software-program", "Bjerg", "Skrive redskab", "Komiker"
    ],
    english: [
        "Beatles Song", "Rapper", "Fruit", "Vegetable", "American Rock Song", "Boy Band", "Classical Composer", "Insect", "Pet Animal", "Flower", "Tree Species", "Type of Jewelry", "African Country", "Crime Series (book/TV)", "Musical Instrument", "Car Brand", "Clothing Brand", "Supermarket Chain", "Animated Film Title", "Danish Lake", "Danish Island", "Mediterranean Island", "World Ocean", "Aircraft Type", "Asian Country", "European Capital City", "Card Game name", "Board Game", "Candy Brand", "Holiday", "Norse God", "Greek God", "Supernatural Creature", "Dance Style", "Food Dish", "Cocktail", "Hobby", "Head of State", "Weather Phenomenon", "Monetary Currency", "North American City", "German City", "Internet Provider", "Kitchen Utensils", "Superhero", "Danish Actress", "Public Institution", "Catholic Sin", "Christmas Song", "Romance Movie", "Charity Organization", "Political Ideology", "European Pop Musician", "Monkey Species", "Type of Spice", "Planet",
        "Music Genre", "Fish Species", "Software Program", "Mountain Name", "Writing Tool", "Comedian" 

    ]
};

// Switch the language option
function switchLanguage() {
    if (settings.lang == "dansk"){
        settings.lang = "english"
    } else {
        settings.lang = "dansk"
    }

}

// Assign a random icon
function assignIcon() {
    const icons = Object.keys(iconGallery);
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    return randomIcon;
}

// Assign a random category
function assignCategory() {
    const categories = categoryLibrary[settings.lang];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return randomCategory;
}

// Card class
class Card {
    constructor(category = "None", icon = null, highlighted = false) {
        this.category = category;
        this.highlightedBorder = highlighted;

        if (icon === null) {
            this.icon = assignIcon();
        } else if (!iconGallery.hasOwnProperty(icon)) {
            console.log(`Not found in gallery: ${icon}`);
            console.log("Assigning blank icon instead.");
            this.icon = "blank";
            this.img_src = "intentionallyNotValid.png";
            return;
        }

        this.icon = icon;
        this.img_src = iconGallery[this.icon];
    }

    toString() {
        if (this.icon === null && this.category === "None") {
            return "Blank; No category";
        } else if (this.icon === null) {
            return `Blank; ${this.category}`;
        } else if (this.category === "None") {
            return `${this.icon}; No category`;
        } else {
            return `${this.icon}; ${this.category}`;
        }
    }
}

// CardPile class
class CardPile {
    constructor() {
        this.contents = []; // Will contain Cards, but only the top card will be shown on the board
        this.topCard = new Card(" "); // NOTE: Disallow empty cards from being movable
        this.highlightedBorder = false;
    }

    addToTop(card) {
        this.contents.push(card);
        this.topCard = card;
        this.highlightedBorder = false;
    }

    removeTop() {
        if (this.contents.length > 0) {
            this.contents.pop(); // Remove the top card
            if (this.contents.length > 0) {
                this.topCard = this.contents[this.contents.length - 1]; // Put the next highest card on top
            } else {
                this.topCard = new Card(" "); // If no cards left, set to empty
            }
        }
        this.highlightedBorder = false;
    }

    dragTopToOther(otherPile) {
        if (this.contents.length > 0) {
            const topCard = this.topCard
            otherPile.addToTop(topCard);
            this.removeTop();
        }
        this.highlightedBorder = false;
    }
}

// GameBoard class
class GameBoard {
    constructor(playerNumber = 1) {
        this.playerCount = playerNumber;
        this.currentPlayerTurn = 0;
        this.activeCard = new Card("blank");
        this.setupPiles();
    }

    setupPiles() {
        this.playerStatuses = {};
        if (this.playerCount > 1) {
            for (let playerNumber = 1; playerNumber <= this.playerCount; playerNumber++) {
                this.playerStatuses[`Player ${playerNumber}`] = new CardPile();
            }
        }
        this.currentPlayerTurn = 0;
    }

    addPlayer() {
        if ((this.playerCount + 2) < Object.keys(iconGallery).length){ // Only allow more players, if the addition still is less than the possible unique match icons
            this.playerCount += 1;
            this.setupPiles();
        }
    }

    removePlayer() {
        if (this.playerCount > 1){ // Minimum 1 player
            this.playerCount -= 1;
            this.setupPiles();
        }
    }

    getCurrentShownCategories() {
        const topCardCategories = [];
        for (const pile of Object.values(this.playerStatuses)) {
            topCardCategories.push(pile.topCard.category);
        }
        return topCardCategories;
    }

    removeAllHighlights() {
        for (const pile of Object.values(this.playerStatuses)) {
            pile.topCard.highlightedBorder = false;
            pile.highlightedBorder = false;
        }
    }

    drawCardToPlayer() {
        this.removeAllHighlights();

        const currentPile = this.playerStatuses[`Player ${this.currentPlayerTurn + 1}`];
        currentPile.highlightedBorder = true;

        let cardCategory = assignCategory();
        if (!settings.allowDuplicates) {
            const currentCategories = this.getCurrentShownCategories();
            while (currentCategories.includes(cardCategory)) {
                cardCategory = assignCategory();
            }
        }

        const icon = assignIcon()
        const drawnCard = new Card(cardCategory, icon, true);
        currentPile.addToTop(drawnCard);
        this.currentPlayerTurn += 1;
        this.currentPlayerTurn %= this.playerCount;


    }

    countIcons() {
        const currentIcons = [];
        for (const [player, pile] of Object.entries(this.playerStatuses)){
            currentIcons.push(pile.topCard.icon)
        }

        const count = [];
        currentIcons.forEach(element => {
            count[element] = (count[element] || 0) + 1;
        })
        return count
    
    }
    
    doesIconCountExceedLimit(limit = 2) {
        const iconCount = this.countIcons()
        for (const [icon, count] of Object.entries(iconCount)){
            if (count > limit){
                return true
            }
        }
        return false

    }

    
}

/* */

// Initialize the game board
const gameBoard = new GameBoard(3); // Example: 2 players

// declaring the source pile as a global variable, to track drag state
let dragSourcePile = null; 

// Function to render the game board
function renderGameBoard() {
    const gameBoardElement = document.getElementById("gameBoard");
    gameBoardElement.innerHTML = ""; // Clear the board

    // Loop through each player's pile and render it
    for (const [playerName, pile] of Object.entries(gameBoard.playerStatuses)) {
        const pileElement = document.createElement("div");
        pileElement.className = `player-pile ${pile.highlightedBorder ? "highlighted-border" : ""}`;
        pileElement.id = `pile-${playerName.replace(/\s/g, "-")}`; //pileElement.id = `pile-${playerName.replace(" ", "-")}`;

        // Render the top card of the pile
        if (pile.topCard) {
            const cardElement = document.createElement("div");
            cardElement.style.visibility = "invisible";
            if (pile.topCard.category == " "){
                cardElement.className = "card empty";
                } else {
                cardElement.className = "card";//`card ${pile.topCard.highlightedBorder ? "highlighted" : ""}`;
            }
            cardElement.id = `card-${Date.now()}-${Math.random()}`; // cardElement.id = `card-${Date.now()}`; // Use a unique ID for each card
            cardElement.draggable = true;

            // Store the current pile as a data attribute
            cardElement.setAttribute('data-pile', playerName);
            //console.log("Rendered card's pile:", cardElement.getAttribute('data-pile'))

            // Set the card image
            const imgElement = document.createElement("img");
            imgElement.style.visibility = "hidden";
            imgElement.src = pile.topCard.img_src;
            imgElement.alt = pile.topCard.category;
            
            //imgElement.style.maxHeight = "30%";
            //imgElement.style.maxWidth = "10rem";
            ///imgElement.style.maxWidth = "10rem";  // Set fixed width
            ///imgElement.style.maxHeight = "12rem"; // Set fixed height
            
            ///imgElement.style.position = "absolute";
            ///imgElement.style.top = "0";
            ///imgElement.style.left = "0";
            
            //imgElement.style.objectFit = "contain"; 

            //imgElement.style.position = "absolute";
            imgElement.style.top = "0";
            //imgElement.style.left = "0";


            // Calculate consistent scale factor for all images
            // Define the scale factor (adjust this value to fit your cards)
            const scaleFactor = 0.25; // This means 15% of original size

            // Set explicit dimensions to maintain pixel consistency
            imgElement.onload = function() {
                const scaledWidth = this.naturalWidth * scaleFactor;
                const scaledHeight = this.naturalHeight * scaleFactor;
                
                this.style.width = scaledWidth + "px";
                this.style.height = scaledHeight + "px";
                this.style.visibility = "visible";
            };


            const textElement = document.createElement("div");
            textElement.textContent = pile.topCard.category;
            textElement.style.position = "absolute";
            textElement.style.top = "9.375rem";  // Fixed position below icon space
            textElement.style.left = "0.3125rem";
            textElement.style.right = "0.3125rem";
            textElement.style.fontSize = "2.5rem";//String(250/pile.topCard.category)+"rem";
            textElement.style.fontWeight = "bold";
            textElement.style.color = "#333";
            textElement.style.textAlign = "center";
            textElement.style.wordWrap = "break-word";

            cardElement.appendChild(imgElement);
            cardElement.appendChild(textElement);

            cardElement.style.visibility = "visible";
            pileElement.appendChild(cardElement);
        }

        gameBoardElement.appendChild(pileElement);
    }

    // Add event listeners for drag-and-drop
    addDragAndDropListeners();
}


// Function to add drag-and-drop listeners
function addDragAndDropListeners() {
   // Remove existing listeners to avoid duplicates
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
    });

    document.querySelectorAll('.player-pile').forEach(pile => {
        pile.addEventListener('dragover', handleDragOver);
        pile.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    //e.dataTransfer.setData('text/plain', e.target.id);
    //console.log("Dragging card with data-pile:", e.target.getAttribute('data-pile'));
    dragSourcePile = e.target.getAttribute('data-pile');
    console.log("Dragging card from pile:", dragSourcePile);
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e){
    e.preventDefault();

    // const cardId = e.dataTransfer.getData('text/plain');
    // console.log(cardId)
    // const cardElement = document.getElementById(cardId);

    // // Get the source pile from the card's data attribute
    // const sourcePileName = cardElement.getAttribute('data-pile');
    // const sourcePile = gameBoard.playerStatuses[sourcePileName];
    // console.log("Source pile:", sourcePileName);
    // console.log("Source pile:", sourcePile);
    // // Target pile
    // const targetPileName = e.currentTarget.id.replace('pile-', '').replace("-", " ");
    // const targetPile = gameBoard.playerStatuses[targetPileName];
    // console.log("Target pile:", targetPileName);
    // // Update the game state
    // sourcePile.dragTopToOther(targetPile);

    // console.log(cardElement.getAttribute('data-pile'))
    // cardElement.setAttribute('data-pile', targetPileName);
    // console.log(cardElement.getAttribute('data-pile'))
    
    let targetPileElement = e.currentTarget;
    const targetPileName = targetPileElement.id.replace('pile-', '').replace(/-/g, " ")

    console.log("Source pile:", dragSourcePile);
    console.log("Target pile:", targetPileName);

    // Don't allow dropping on the same pile
    if (dragSourcePile === targetPileName) {
        return;
    }

    const sourcePile = gameBoard.playerStatuses[dragSourcePile];
    const targetPile = gameBoard.playerStatuses[targetPileName];

    if (sourcePile && targetPile){
        sourcePile.dragTopToOther(targetPile)

        // Re-render the board to reflect changes
        renderGameBoard();
    }

   
};

function drawToAllPiles() { // Draw a card to each pile
    for (let i = 0;  i < gameBoard.playerCount; i++){
        gameBoard.drawCardToPlayer();
    }
}


// Add event listener for the "Draw Card" button
document.getElementById("drawCardButton").addEventListener("click", () => {
    gameBoard.drawCardToPlayer();
    renderGameBoard(); // Re-render the board to show the new card
});
document.getElementById("drawCardButton2").addEventListener("click", () => {
    gameBoard.drawCardToPlayer();
    renderGameBoard(); // Re-render the board to show the new card
});

// Add listener for the "Draw for All"
document.getElementById("drawCardAllButton").addEventListener("click", () => {
    
    do {
    drawToAllPiles();
    }   
    while (gameBoard.doesIconCountExceedLimit(limit = 2) == true )

    renderGameBoard(); // Re-render the board to show the new cards
});

// Add listeners for player count adjusters
document.getElementById("removePlayerButton").addEventListener("click", () => {
    gameBoard.removePlayer();
    renderGameBoard(); // Re-render the board to show the new card
});
document.getElementById("addPlayerButton").addEventListener("click", () => {
    gameBoard.addPlayer();
    renderGameBoard(); // Re-render the board to show the new card
});

// Add listener for reset button
document.getElementById("resetButton").addEventListener("click", () => {
    gameBoard.setupPiles();
    renderGameBoard();
}
);

// Add listener for language switch
document.getElementById("switchLangButton").addEventListener("click", () => {
    switchLanguage(); // toggle between "dansk" and "english"
    gameBoard.setupPiles();
    renderGameBoard();
}
);






// Initial render
renderGameBoard();
