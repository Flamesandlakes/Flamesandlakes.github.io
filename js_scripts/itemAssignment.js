// Global state
let selectedColors = [];
let playerNames = {}; // {color: name}
let stageItems = {
    1: [],
    2: [],
    3: []
};

// DOM Elements
const colorCheckboxes = document.querySelectorAll('input[name="player-color"]');
const playerNamesContainer = document.getElementById('player-names-container');
const stage1Input = document.getElementById('stage1-input');
const stage2Input = document.getElementById('stage2-input');
const stage3Input = document.getElementById('stage3-input');
const stage1ItemsList = document.getElementById('stage1-items');
const stage2ItemsList = document.getElementById('stage2-items');
const stage3ItemsList = document.getElementById('stage3-items');
const resultsTableContainer = document.getElementById('results-table-container');

// Initialize
updatePlayerNameInputs();

// Event Listeners for color checkboxes
colorCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updatePlayerNameInputs);
});

// Update player name inputs based on selected colors
function updatePlayerNameInputs() {
    selectedColors = Array.from(colorCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    playerNamesContainer.innerHTML = '';
    
    selectedColors.forEach(color => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-input';
        playerDiv.innerHTML = `
            <label>${color}</label>
            <input type="text" data-color="${color}" placeholder="Player name">
        `;
        playerNamesContainer.appendChild(playerDiv);
    });
}

// Add item to a stage
function addItem(stage) {
    const input = document.getElementById(`stage${stage}-input`);
    const item = input.value.trim();
    if (item) {
        stageItems[stage].push(item);
        updateStageItemsList(stage);
        input.value = '';
    }
}

// Update the list of items for a stage
function updateStageItemsList(stage) {
    const itemsList = document.getElementById(`stage${stage}-items`);
    itemsList.innerHTML = '';
    
    stageItems[stage].forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item}
            <button onclick="removeItem(${stage}, ${index})">×</button>
        `;
        itemsList.appendChild(li);
    });
}

// Remove item from a stage
function removeItem(stage, index) {
    stageItems[stage].splice(index, 1);
    updateStageItemsList(stage);
}

// Assign items to players
function assignItems() {

    // Confirmation dialog
    if (!confirm("Are you sure you want to assign items? This will overwrite any previous assignments.")) {
        return;
    }

    // Get player names from inputs
    const nameInputs = playerNamesContainer.querySelectorAll('input[type="text"]');
    playerNames = {};
    nameInputs.forEach(input => {
        const color = input.getAttribute('data-color');
        const name = input.value.trim();
        if (name) {
            playerNames[color] = name;
        }
    });

    // Check if all stages have enough items
    const playerCount = Object.keys(playerNames).length;
    for (let stage = 1; stage <= 3; stage++) {
        if (stageItems[stage].length < playerCount) {
            alert(`Stage ${stage} does not have enough items for all players!`);
            return;
        }
    }

    // Shuffle items for each stage
    const shuffledStages = {};
    for (let stage = 1; stage <= 3; stage++) {
        shuffledStages[stage] = [...stageItems[stage]];
        shuffleArray(shuffledStages[stage]);
    }

    // Assign items
    const assignments = {};
    const usedItems = new Set();
    const colors = Object.keys(playerNames);
    
    // For each player, assign one item from each stage
    colors.forEach((color, playerIndex) => {
        const playerAssignments = [];
        for (let stage = 1; stage <= 3; stage++) {
            // Find the first unused item in this stage
            let assignedItem = null;
            for (let i = 0; i < shuffledStages[stage].length; i++) {
                const item = shuffledStages[stage][i];
                if (!usedItems.has(item)) {
                    assignedItem = item;
                    usedItems.add(item);
                    break;
                }
            }
            if (!assignedItem) {
                alert(`Not enough unique items to assign to all players!`);
                return;
            }
            playerAssignments.push(assignedItem);
        }
        assignments[color] = {
            name: playerNames[color],
            items: playerAssignments
        };
    });

    // Display results
    displayResults(assignments);
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Display results in a table
function displayResults(assignments) {
    const colors = Object.keys(assignments);
    const table = document.createElement('table');
    table.className = 'results-table';

    // Header row
    const headerRow = document.createElement('tr');
    headerRow.appendChild(document.createElement('th')); // Empty top-left cell
    
    colors.forEach(color => {
        const th = document.createElement('th');
        th.textContent = assignments[color].name;
        th.className = `colored-column ${color}`;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Rows for each stage
    for (let stage = 1; stage <= 3; stage++) {
        const row = document.createElement('tr');
        const stageCell = document.createElement('td');
        stageCell.textContent = `Stage ${stage}`;
        row.appendChild(stageCell);

        colors.forEach(color => {
            const td = document.createElement('td');
            td.textContent = assignments[color].items[stage - 1];
            td.className = `colored-column ${color}`;
            row.appendChild(td);
        });

        // Add unassigned items for this stage
        const unassignedTd = document.createElement('td');
        const assignedItemsForStage = new Set();
        colors.forEach(color => {
            assignedItemsForStage.add(assignments[color].items[stage - 1]);
        });
        const unassignedItems = stageItems[stage].filter(item => !assignedItemsForStage.has(item));
        unassignedTd.textContent = unassignedItems.join(', ');
        row.appendChild(unassignedTd);

        table.appendChild(row);
    }

    resultsTableContainer.innerHTML = '';
    resultsTableContainer.appendChild(table);
}