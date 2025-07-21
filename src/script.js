// =================================================================
// ========================= GAME STATE ============================
// =================================================================
localStorage.removeItem('hackerClickerInsaneSave');
let gameState = {
    score: 0,
    linesPerClick: 1,
    linesPerSecond: 0,
    prestigePoints: 0,
    totalLcEver: 0,
    prestigeCost: 1000000,
    globalLpcMultiplier: 1,
    globalLpsMultiplier: 1,
    globalCostMultiplier: 1,
};

// =================================================================
// ==================== UPGRADES DEFINITION ========================
// =================================================================
// Custos base de todos os upgrades foram reduzidos!
let clickUpgrades = [
    { name: "Mouse Melhorado", baseCost: 10, lpc_increase: 1, owned: 0 },
    { name: "Teclado Mecânico", baseCost: 50, lpc_increase: 5, owned: 0 },
    { name: "Script de AutoClick", baseCost: 250, lpc_increase: 20, owned: 0 },
    { name: "Monitor Duplo", baseCost: 1000, lpc_increase: 45, owned: 0 },
    { name: "Café Forte", baseCost: 8000, lpc_increase: 150, owned: 0 },
    { name: "Cadeira Gamer", baseCost: 90000, lpc_increase: 1000, owned: 0 },
    { name: "Fibra Ótica", baseCost: 1e6, lpc_increase: 8500, owned: 0 },
    { name: "Processador Overclockado", baseCost: 1.5e7, lpc_increase: 5e4, owned: 0 },
    { name: "Implante Neural", baseCost: 2.5e8, lpc_increase: 4e5, owned: 0 },
    { name: "Mãos Biônicas", baseCost: 4e9, lpc_increase: 2.5e6, owned: 0 },
    { name: "Conexão Direta à Matrix", baseCost: 6e10, lpc_increase: 1.8e7, owned: 0 },
    { name: "Download de Conhecimento", baseCost: 8e11, lpc_increase: 1e8, owned: 0 },
    { name: "Acelerador de Partículas Pessoal", baseCost: 1.5e13, lpc_increase: 9e8, owned: 0 },
    { name: "Singularidade de Papel", baseCost: 3e15, lpc_increase: 5e10, owned: 0 },
    { name: "Dedo Cósmico", baseCost: 5e17, lpc_increase: 1e12, owned: 0 },
];

let autoUpgrades = [
    { name: "Estagiário", baseCost: 20, lps_increase: 1, owned: 0 },
    { name: "Dev Júnior", baseCost: 200, lps_increase: 5, owned: 0 },
    { name: "Dev Sênior", baseCost: 2500, lps_increase: 25, owned: 0 },
    { name: "Equipe de TI", baseCost: 18000, lps_increase: 150, owned: 0 },
    { name: "Servidor Dedicado", baseCost: 300000, lps_increase: 1200, owned: 0 },
    { name: "Data Center", baseCost: 5e6, lps_increase: 9000, owned: 0 },
    { name: "Cluster de IA", baseCost: 7e7, lps_increase: 5e4, owned: 0 },
    { name: "Computador Quântico", baseCost: 1e9, lps_increase: 3e5, owned: 0 },
    { name: "Botnet Global", baseCost: 1.5e10, lps_increase: 2.2e6, owned: 0 },
    { name: "Fazenda de Servidores Lunar", baseCost: 2.5e11, lps_increase: 1.5e7, owned: 0 },
    { name: "Exército de Drones", baseCost: 4e12, lps_increase: 1.1e8, owned: 0 },
    { name: "IA Senciente", baseCost: 6e13, lps_increase: 9e8, owned: 0 },
    { name: "Esfera de Dyson", baseCost: 1e15, lps_increase: 7.5e9, owned: 0 },
    { name: "Simulação de Realidade", baseCost: 2e17, lps_increase: 5e11, owned: 0 },
    { name: "Motor de Dobra Computacional", baseCost: 5e19, lps_increase: 1e14, owned: 0 },
];

// =================================================================
// ================= PRESTIGE SKILL TREE DEF =======================
// =================================================================
// Custos em Fragmentos de Dados (FD) foram reduzidos!
let prestigeUpgrades = [
    // Coluna 1: Bônus de Clique
    { id: 'c1', name: 'Synergy I', desc: 'LC/Clique +10% por cada tipo de upgrade de clique possuído.', cost: 1, purchased: false, effect: 'synergy_click', value: 0.1 },
    { id: 'c2', name: 'Click Forte', desc: 'Aumenta permanentemente o LC/Clique base em 100%.', cost: 1, purchased: false, dependencies: ['c1'], effect: 'mult_lpc', value: 2 },
    { id: 'c3', name: 'Click Duplo', desc: '5% de chance de ganhar 10x LC de um clique.', cost: 3, purchased: false, dependencies: ['c2'], effect: 'double_click_chance', value: 0.05 },
    { id: 'c4', name: 'Click Forte II', desc: 'Aumenta permanentemente o LC/Clique base em mais 200%.', cost: 5, purchased: false, dependencies: ['c3'], effect: 'mult_lpc', value: 3 },
    { id: 'c5', name: 'Crítico Garantido', desc: 'O primeiro clique após comprar um upgrade de clique é 5x mais forte.', cost: 15, purchased: false, dependencies: ['c4'], effect: 'crit_guaranteed', value: 5 },
    { id: 'c6', name: 'Ressonância', desc: 'LC/Clique recebe +1% do seu LC/Segundo.', cost: 30, purchased: false, dependencies: ['c5'], effect: 'lps_to_lpc', value: 0.01 },
    { id: 'c7', name: 'Click Apocalíptico', desc: 'Aumenta permanentemente o LC/Clique base em 1000%.', cost: 60, purchased: false, dependencies: ['c6'], effect: 'mult_lpc', value: 11 },

    // Coluna 2: Bônus de Automação
    { id: 'a1', name: 'Synergy II', desc: 'LC/Segundo +10% por cada tipo de upgrade de automação possuído.', cost: 1, purchased: false, effect: 'synergy_auto', value: 0.1 },
    { id: 'a2', name: 'Automação Melhorada', desc: 'Aumenta permanentemente o LC/Segundo em 100%.', cost: 1, purchased: false, dependencies: ['a1'], effect: 'mult_lps', value: 2 },
    { id: 'a3', name: 'Overdrive', desc: 'Aumenta o LC/Segundo em 25% por 30s após um clique.', cost: 3, purchased: false, dependencies: ['a2'], effect: 'overdrive', value: 0.25 },
    { id: 'a4', name: 'Automação Melhorada II', desc: 'Aumenta permanentemente o LC/Segundo em mais 200%.', cost: 5, purchased: false, dependencies: ['a3'], effect: 'mult_lps', value: 3 },
    { id: 'a5', name: 'Eficiência Quântica', desc: 'Upgrades de automação são 5% mais baratos.', cost: 12, purchased: false, dependencies: ['a4'], effect: 'cost_auto', value: 0.95 },
    { id: 'a6', name: 'Consciência Coletiva', desc: 'LC/Segundo recebe +0.1% do seu LC/Clique.', cost: 25, purchased: false, dependencies: ['a5'], effect: 'lpc_to_lps', value: 0.001 },
    { id: 'a7', name: 'Deus da Máquina', desc: 'Aumenta permanentemente o LC/Segundo em 1000%.', cost: 60, purchased: false, dependencies: ['a6'], effect: 'mult_lps', value: 11 },

    // Coluna 3: Economia e Prestígio
    { id: 'e1', name: 'Startup', desc: 'Comece cada nova vida com 100 LC.', cost: 1, purchased: false, effect: 'start_lc', value: 100 },
    { id: 'e2', name: 'Negociador', desc: 'Todos os upgrades são 2% mais baratos.', cost: 2, purchased: false, dependencies: ['e1'], effect: 'cost_all', value: 0.98 },
    { id: 'e3', name: 'Fragmentos de Memória', desc: 'Ganhe 5% mais Fragmentos de Dados ao recomeçar.', cost: 4, purchased: false, dependencies: ['e2'], effect: 'more_prestige', value: 0.05 },
    { id: 'e4', name: 'Negociador II', desc: 'Todos os upgrades são mais 3% mais baratos.', cost: 8, purchased: false, dependencies: ['e3'], effect: 'cost_all', value: 0.97 },
    { id: 'e5', name: 'Persistência', desc: 'Mantenha 1% do seu LC/S após recomeçar.', cost: 20, purchased: false, dependencies: ['e4'], effect: 'persist_lps', value: 0.01 },
    { id: 'e6', name: 'Fragmentos de Memória II', desc: 'Ganhe mais 10% de Fragmentos de Dados.', cost: 40, purchased: false, dependencies: ['e5'], effect: 'more_prestige', value: 0.10 },
    { id: 'e7', name: 'Legado Digital', desc: 'Todos os bônus de Fragmentos de Dados são 25% mais eficazes.', cost: 80, purchased: false, dependencies: ['e6'], effect: 'prestige_boost', value: 1.25 },

    // Coluna 4: Bônus Gerais
    { id: 'g1', name: 'Conexão Inicial', desc: 'Comece com 1 Estagiário grátis.', cost: 1, purchased: false, effect: 'free_intern', value: 1 },
    { id: 'g2', name: 'Otimização', desc: 'Upgrades de clique são 5% mais baratos.', cost: 2, purchased: false, dependencies: ['g1'], effect: 'cost_click', value: 0.95 },
    { id: 'g3', name: 'Juros Compostos', desc: 'Gere 0.1% do seu LC atual por segundo.', cost: 6, purchased: false, dependencies: ['g2'], effect: 'interest', value: 0.001 },
    { id: 'g4', name: 'Otimização II', desc: 'Upgrades de automação são mais 5% mais baratos.', cost: 10, purchased: false, dependencies: ['g3'], effect: 'cost_auto', value: 0.95 },
    { id: 'g5', name: 'Singularidade Próxima', desc: 'Todos os ganhos de LC (clique e segundo) +1% para cada ordem de magnitude de LC.', cost: 25, purchased: false, dependencies: ['g4'], effect: 'magnitude_boost', value: 0.01 },
    { id: 'g6', name: 'Eficiência Absoluta', desc: 'Todos os upgrades são mais 5% mais baratos.', cost: 50, purchased: false, dependencies: ['g5'], effect: 'cost_all', value: 0.95 },
    { id: 'g7', name: 'Onipresença Digital', desc: 'Dobra todos os outros bônus desta árvore.', cost: 120, purchased: false, dependencies: ['g6'], effect: 'double_all', value: 2 },
    
    // Coluna 5: Upgrades Finais
    { id: 'f1', name: 'Eco do Prestígio', desc: 'Gere 0.1% dos seus Fragmentos de Dados como LC/S.', cost: 150, purchased: false, dependencies: ['c7', 'a7'], effect: 'prestige_to_lps', value: 0.001 },
    { id: 'f2', name: 'Quebra de Limite', desc: 'Remove o limite de todos os bônus de "Synergy".', cost: 300, purchased: false, dependencies: ['e7', 'g7'], effect: 'synergy_cap_off', value: 1 },
    { id: 'f3', name: 'A Centelha Divina', desc: 'Aumenta todos os ganhos de LC em 1% para cada habilidade permanente comprada.', cost: 500, purchased: false, dependencies: ['f1', 'f2'], effect: 'god_spark', value: 0.01 },
];


// =================================================================
// ======================= DOM ELEMENTS ============================
// =================================================================
const scoreDisplay = document.getElementById('score');
const lpcDisplay = document.getElementById('lpc');
const lpsDisplay = document.getElementById('lps');
const prestigePointsDisplay = document.getElementById('prestige-points-display');
const modalPrestigePoints = document.getElementById('modal-prestige-points');
const clickUpgradesList = document.getElementById('click-upgrades-list');
const autoUpgradesList = document.getElementById('auto-upgrades-list');
const clickerSection = document.getElementById('clicker-section');
const gameContainer = document.getElementById('game-container');
const backgroundAnimation = document.getElementById('background-animation');
const prestigeBtn = document.getElementById('prestige-btn');
const prestigeGainDisplay = document.getElementById('prestige-gain');
const prestigeCostDisplay = document.getElementById('prestige-cost');
const skillTreeBtn = document.getElementById('skill-tree-btn');
const prestigeModal = document.getElementById('prestige-modal');
const skillTreeContainer = document.getElementById('skill-tree-container');
const winButton = document.getElementById('win-button');
const winScreen = document.getElementById('win-screen');

// =================================================================
// =================== UTILITY FUNCTIONS ===========================
// =================================================================
function calculateCost(baseCost, owned) {
    // Fator de multiplicação de custo foi reduzido para 1.08
    return Math.floor(baseCost * Math.pow(1.08, owned));
}

function formatNumber(num) {
    if (num < 1000) return num.toFixed(0);
    const suffixes = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
    const i = Math.floor(Math.log10(num) / 3);
    if (i >= suffixes.length) {
        return num.toExponential(2).replace('+', '');
    }
    const shortNum = (num / Math.pow(1000, i)).toFixed(2);
    return shortNum.replace(/\.00$/, '') + suffixes[i];
}

// =================================================================
// =================== UI RENDER FUNCTIONS =========================
// =================================================================
function createInitialUpgrades() {
    clickUpgrades.forEach((u, i) => createUpgradeElement(u, i, 'click'));
    autoUpgrades.forEach((u, i) => createUpgradeElement(u, i, 'auto'));
}

function createUpgradeElement(upgrade, index, type) {
    const list = type === 'click' ? clickUpgradesList : autoUpgradesList;
    const upgradeDiv = document.createElement('div');
    upgradeDiv.id = `${type}-upgrade-${index}`;
    upgradeDiv.className = 'upgrade';
    upgradeDiv.innerHTML = `
        <div class="upgrade-info">
            <span><strong>${upgrade.name}</strong><br>+${formatNumber(upgrade[`${type === 'click' ? 'lpc' : 'lps'}_increase`])} LC/${type === 'click' ? 'clique' : 'segundo'}</span>
            <span id="${type}-owned-${index}">Qtd: 0</span>
        </div>
        <button id="${type}-btn-${index}" onclick="buyUpgrade('${type}', ${index})">
            Comprar: ${formatNumber(upgrade.baseCost)} LC
        </button>`;
    list.appendChild(upgradeDiv);
}

function updateDisplays() {
    scoreDisplay.textContent = formatNumber(Math.floor(gameState.score));
    lpcDisplay.textContent = formatNumber(gameState.linesPerClick);
    lpsDisplay.textContent = formatNumber(gameState.linesPerSecond);
    prestigePointsDisplay.textContent = formatNumber(gameState.prestigePoints);
    modalPrestigePoints.textContent = formatNumber(gameState.prestigePoints);

    // Prestige button update
    const gain = calculatePrestigeGain();
    prestigeGainDisplay.textContent = formatNumber(gain);
    prestigeCostDisplay.textContent = formatNumber(gameState.prestigeCost);
    // Corrigido: Usa Math.floor para consistência com o que é exibido na tela
    prestigeBtn.disabled = Math.floor(gameState.score) < gameState.prestigeCost;
    
    // Win button update
    winButton.disabled = gameState.score < 1e30;
}

function updateUpgradesUI() {
    updateUpgradeListUI(clickUpgrades, 'click');
    updateUpgradeListUI(autoUpgrades, 'auto');
}

function updateUpgradeListUI(upgrades, type) {
    upgrades.forEach((upgrade, index) => {
        const cost = calculateCost(upgrade.baseCost, upgrade.owned) * gameState.globalCostMultiplier;
        const upgradeDiv = document.getElementById(`${type}-upgrade-${index}`);
        const ownedSpan = document.getElementById(`${type}-owned-${index}`);
        const button = document.getElementById(`${type}-btn-${index}`);
        
        button.disabled = gameState.score < cost;
        button.innerHTML = `Comprar: ${formatNumber(cost)} LC`;
        ownedSpan.innerHTML = `Qtd: ${upgrade.owned}`;
        
        upgradeDiv.classList.toggle('enabled', gameState.score >= cost);
    });
}

// =================================================================
// ======================= GAME LOGIC ==============================
// =================================================================
function computerClicked(event) {
    // Chance de click duplo da árvore de habilidades
    const skillDoubleClick = prestigeUpgrades.find(s => s.id === 'c3' && s.purchased);
    let clickMultiplier = 1;
    if (skillDoubleClick && Math.random() < skillDoubleClick.value) {
        clickMultiplier = 10;
    }

    gameState.score += gameState.linesPerClick * clickMultiplier;
    gameState.totalLcEver += gameState.linesPerClick * clickMultiplier;
    showClickFeedback(event, gameState.linesPerClick * clickMultiplier);
    gameContainer.classList.add('shake');
    setTimeout(() => gameContainer.classList.remove('shake'), 100);
}

function showClickFeedback(event, amount) {
    const feedback = document.createElement('div');
    feedback.className = 'click-feedback';
    feedback.textContent = `+${formatNumber(amount)}`;
    
    const rect = clickerSection.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    feedback.style.left = `${x}px`;
    feedback.style.top = `${y}px`;
    
    clickerSection.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1000);
}

function buyUpgrade(type, index) {
    const upgrades = type === 'click' ? clickUpgrades : autoUpgrades;
    const upgrade = upgrades[index];
    const cost = calculateCost(upgrade.baseCost, upgrade.owned) * gameState.globalCostMultiplier;

    if (gameState.score >= cost) {
        gameState.score -= cost;
        upgrade.owned++;
        recalculateStats();
    }
}

function recalculateStats() {
    let baseLpc = 1;
    clickUpgrades.forEach(u => { baseLpc += u.lpc_increase * u.owned; });
    
    let baseLps = 0;
    autoUpgrades.forEach(u => { baseLps += u.lps_increase * u.owned; });

    // Aplicar bônus de prestígio
    gameState.linesPerClick = baseLpc * gameState.globalLpcMultiplier;
    gameState.linesPerSecond = baseLps * gameState.globalLpsMultiplier;
    
    // Bônus específicos da árvore
    const lpsToLpcSkill = prestigeUpgrades.find(s => s.id === 'c6' && s.purchased);
    if (lpsToLpcSkill) {
        gameState.linesPerClick += gameState.linesPerSecond * lpsToLpcSkill.value;
    }
    
    const lpcToLpsSkill = prestigeUpgrades.find(s => s.id === 'a6' && s.purchased);
    if (lpcToLpsSkill) {
        gameState.linesPerSecond += gameState.linesPerClick * lpcToLpsSkill.value;
    }

    const interestSkill = prestigeUpgrades.find(s => s.id === 'g3' && s.purchased);
    if (interestSkill) {
        // Este bônus é aplicado no game loop
    }
    
    const magnitudeSkill = prestigeUpgrades.find(s => s.id === 'g5' && s.purchased);
    if (magnitudeSkill) {
        const magnitude = Math.floor(Math.log10(gameState.score + 1));
        const boost = 1 + (magnitude * magnitudeSkill.value);
        gameState.linesPerClick *= boost;
        gameState.linesPerSecond *= boost;
    }
    
    const godSparkSkill = prestigeUpgrades.find(s => s.id === 'f3' && s.purchased);
    if (godSparkSkill) {
        const purchasedCount = prestigeUpgrades.filter(s => s.purchased).length;
        const boost = 1 + (purchasedCount * godSparkSkill.value);
        gameState.linesPerClick *= boost;
        gameState.linesPerSecond *= boost;
    }
}

// =================================================================
// ===================== PRESTIGE SYSTEM ===========================
// =================================================================
function calculatePrestigeGain() {
    // Corrigido: Usa Math.floor para consistência com o que é exibido na tela
    if (Math.floor(gameState.score) < gameState.prestigeCost) return 0;
    
    // Ganho de prestígio aumentado (multiplicador de 5 para 10)
    let gain = Math.floor(10 * Math.pow(gameState.score / gameState.prestigeCost, 0.5));
    
    // Aplicar bônus de ganho de prestígio
    const prestigeGainBonus = prestigeUpgrades
        .filter(s => s.effect === 'more_prestige' && s.purchased)
        .reduce((acc, s) => acc + s.value, 0);
    
    return Math.floor(gain * (1 + prestigeGainBonus));
}

function triggerPrestige() {
    // Corrigido: Usa Math.floor para consistência com o que é exibido na tela
    if (Math.floor(gameState.score) < gameState.prestigeCost) return;

    if (!confirm("Você tem certeza? Isso irá reiniciar seu progresso de LC e upgrades, mas você ganhará Fragmentos de Dados para melhorias permanentes.")) {
        return;
    }

    const gainedPoints = calculatePrestigeGain();
    gameState.prestigePoints += gainedPoints;
    gameState.prestigeCost = Math.pow(10, 6 + Math.log10(gameState.prestigePoints + 1)); // Custo de prestígio escala a partir de 1M

    // Reset
    gameState.score = 0;
    gameState.totalLcEver = 0;
    
    // Aplicar bônus de 'começar com LC'
    const startLcSkill = prestigeUpgrades.find(s => s.id === 'e1' && s.purchased);
    if (startLcSkill) {
        gameState.score = startLcSkill.value;
    }

    clickUpgrades.forEach(u => u.owned = 0);
    autoUpgrades.forEach(u => u.owned = 0);
    
    // Manter % de LPS se a skill for comprada
    const persistLpsSkill = prestigeUpgrades.find(s => s.id === 'e5' && s.purchased);
    const persistedLps = persistLpsSkill ? gameState.linesPerSecond * persistLpsSkill.value : 0;

    recalculateStats();
    gameState.linesPerSecond += persistedLps;
}

// =================================================================
// ===================== SKILL TREE LOGIC ==========================
// =================================================================
function openPrestigeModal() {
    renderPrestigeTree();
    prestigeModal.style.display = 'flex';
}

function closePrestigeModal() {
    prestigeModal.style.display = 'none';
}

function renderPrestigeTree() {
    skillTreeContainer.innerHTML = '';
    prestigeUpgrades.forEach(skill => {
        const skillDiv = document.createElement('div');
        skillDiv.className = 'skill';
        skillDiv.id = `skill-${skill.id}`;
        
        const dependenciesMet = !skill.dependencies || skill.dependencies.every(depId => prestigeUpgrades.find(s => s.id === depId).purchased);
        
        if (skill.purchased) {
            skillDiv.classList.add('purchased');
        } else if (dependenciesMet && gameState.prestigePoints >= skill.cost) {
            skillDiv.classList.add('available');
            skillDiv.onclick = () => buyPrestigeUpgrade(skill.id);
        } else if (!dependenciesMet) {
            skillDiv.style.opacity = '0.3';
        }

        skillDiv.innerHTML = `
            <strong>${skill.name}</strong>
            <p>${skill.desc}</p>
            <p class="cost">Custo: ${formatNumber(skill.cost)} FD</p>
        `;
        skillTreeContainer.appendChild(skillDiv);
    });
}

function buyPrestigeUpgrade(id) {
    const skill = prestigeUpgrades.find(s => s.id === id);
    if (!skill || skill.purchased || gameState.prestigePoints < skill.cost) return;

    const dependenciesMet = !skill.dependencies || skill.dependencies.every(depId => prestigeUpgrades.find(s => s.id === depId).purchased);
    if (!dependenciesMet) return;

    gameState.prestigePoints -= skill.cost;
    skill.purchased = true;

    applyAllPrestigeBonuses();
    recalculateStats();
    renderPrestigeTree();
    updateDisplays(); // Atualiza o display de FD no modal
}

function applyAllPrestigeBonuses() {
    // Reset multipliers
    gameState.globalLpcMultiplier = 1;
    gameState.globalLpsMultiplier = 1;
    gameState.globalCostMultiplier = 1;

    let allBonusesMultiplier = 1;
    if (prestigeUpgrades.find(s => s.id === 'g7' && s.purchased)) {
        allBonusesMultiplier = prestigeUpgrades.find(s => s.id === 'g7').value;
    }
    
    prestigeUpgrades.forEach(skill => {
        if (skill.purchased) {
            let value = skill.value;
            if (skill.id !== 'g7') { // Don't let the 'double all' skill double itself
                 value = (skill.effect.startsWith('mult_') || skill.effect.startsWith('cost_')) ? 1 + ((value - 1) * allBonusesMultiplier) : value * allBonusesMultiplier;
            }

            switch(skill.effect) {
                case 'mult_lpc':
                    gameState.globalLpcMultiplier *= value;
                    break;
                case 'mult_lps':
                    gameState.globalLpsMultiplier *= value;
                    break;
                case 'cost_click':
                case 'cost_auto':
                case 'cost_all':
                    gameState.globalCostMultiplier *= value;
                    break;
                // Outros efeitos são aplicados dinamicamente em recalculateStats ou no loop
            }
        }
    });
}

// =================================================================
// ===================== END GAME & ANIMATIONS =====================
// =================================================================
function hackTheWorld() {
    if (gameState.score >= 1e30) {
        winScreen.style.display = 'flex';
        clearInterval(gameLoopInterval);
        clearInterval(saveInterval);
    }
}

function createBinaryChar() {
    const char = document.createElement('div');
    char.className = 'binary-char';
    char.textContent = Math.random() > 0.5 ? '1' : '0';
    char.style.left = `${Math.random() * 100}vw`;
    char.style.animationDuration = `${5 + Math.random() * 10}s`;
    char.style.fontSize = `${0.8 + Math.random()}em`;
    backgroundAnimation.appendChild(char);

    setTimeout(() => {
        char.remove();
    }, 15000);
}

// =================================================================
// ================= SAVE/LOAD & GAME LOOP =========================
// =================================================================
function saveGame() {
    const saveData = {
        gameState: gameState,
        clickUpgrades: clickUpgrades.map(u => ({ owned: u.owned })),
        autoUpgrades: autoUpgrades.map(u => ({ owned: u.owned })),
        prestigeUpgrades: prestigeUpgrades.map(s => ({ id: s.id, purchased: s.purchased }))
    };
    localStorage.setItem('hackerClickerInsaneSave', JSON.stringify(saveData));
}

function loadGame() {
    const savedData = localStorage.getItem('hackerClickerInsaneSave');
    if (savedData) {
        const data = JSON.parse(savedData);
        // Verifica se a estrutura do save é compatível antes de carregar
        if (data.gameState && data.clickUpgrades && data.autoUpgrades && data.prestigeUpgrades) {
            gameState = data.gameState;
            data.clickUpgrades.forEach((u, i) => {
                if(clickUpgrades[i]) clickUpgrades[i].owned = u.owned
            });
            data.autoUpgrades.forEach((u, i) => {
                if(autoUpgrades[i]) autoUpgrades[i].owned = u.owned
            });
            data.prestigeUpgrades.forEach(s => {
                const skill = prestigeUpgrades.find(ps => ps.id === s.id);
                if (skill) skill.purchased = s.purchased;
            });

            applyAllPrestigeBonuses();
            recalculateStats();
            console.log("Jogo carregado com sucesso!");
        } else {
             console.log("Save corrompido ou de uma versão antiga. Começando novo jogo.");
             // Opcional: Limpar o save antigo
             // localStorage.removeItem('hackerClickerInsaneSave');
        }
    } else {
        console.log("Nenhum save encontrado. Começando novo jogo.");
    }
}

function gameLoop() {
    let passiveGain = gameState.linesPerSecond;
    
    const interestSkill = prestigeUpgrades.find(s => s.id === 'g3' && s.purchased);
    if (interestSkill) {
        passiveGain += gameState.score * interestSkill.value;
    }
    
    const prestigeToLpsSkill = prestigeUpgrades.find(s => s.id === 'f1' && s.purchased);
    if(prestigeToLpsSkill) {
        passiveGain += gameState.prestigePoints * prestigeToLpsSkill.value;
    }

    const gainThisTick = passiveGain / 10;
    gameState.score += gainThisTick;
    gameState.totalLcEver += gainThisTick;
    
    updateDisplays();
    updateUpgradesUI();
}

// =================================================================
// ======================= INITIALIZE GAME =========================
// =================================================================
window.onload = () => {
    createInitialUpgrades();
    loadGame();
    setInterval(createBinaryChar, 100);
    gameLoopInterval = setInterval(gameLoop, 100);
    saveInterval = setInterval(saveGame, 5000);
};

let gameLoopInterval;
let saveInterval;