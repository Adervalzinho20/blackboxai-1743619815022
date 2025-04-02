// DOM Elements
const display = document.getElementById('display');
const historyDisplay = document.getElementById('history-display');
const themeToggle = document.getElementById('theme-toggle');
const modeButtons = document.querySelectorAll('.mode-btn');
const basicButtons = document.getElementById('basic-buttons');
const scientificButtons = document.getElementById('scientific-buttons');
const financialButtons = document.getElementById('financial-buttons');

// Calculator state
let currentInput = '0';
let previousInput = '';
let operation = null;
let resetScreen = false;
let currentMode = 'basic';
let history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];

// Initialize calculator
function initCalculator() {
    updateDisplay();
    createBasicButtons();
    createScientificButtons();
    createFinancialButtons();
    loadThemePreference();
    updateHistoryDisplay();
}

// Button creation functions
function createBasicButtons() {
    const buttons = [
        'C', '⌫', '%', '÷',
        '7', '8', '9', '×',
        '4', '5', '6', '-',
        '1', '2', '3', '+',
        '±', '0', '.', '='
    ];

    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn;
        button.className = `calculator-btn p-4 text-lg font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`;
        
        if (btn === 'C') {
            button.className += ' bg-red-100 dark:bg-red-900';
        } else if (btn === '=') {
            button.className += ' bg-blue-500 text-white hover:bg-blue-600';
        } else if (isOperator(btn)) {
            button.className += ' bg-gray-100 dark:bg-gray-700';
        }

        button.addEventListener('click', () => handleButtonClick(btn));
        basicButtons.appendChild(button);
    });
}

function createScientificButtons() {
    const buttons = [
        'sin', 'cos', 'tan', 'log', 'ln',
        'π', 'e', 'x²', 'x³', '√',
        '(', ')', 'x^y', '10^x', 'e^x',
        'n!', '1/x', '|x|', 'RND', 'EE'
    ];

    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn;
        button.className = `calculator-btn p-3 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 bg-gray-50 dark:bg-gray-700`;
        button.addEventListener('click', () => handleScientificButton(btn));
        scientificButtons.appendChild(button);
    });
}

function createFinancialButtons() {
    const buttons = [
        'PV', 'FV', 'PMT', 'NPER', 'RATE',
        'IR', 'AMORT', 'NPV', 'IRR', 'ROI',
        'DB', 'SLN', 'SYD', 'VDB', 'MIRR',
        'EFF', 'NOM', 'PDUR', 'XIRR', 'XNPV'
    ];

    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn;
        button.className = `calculator-btn p-3 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 bg-gray-50 dark:bg-gray-700`;
        button.addEventListener('click', () => handleFinancialButton(btn));
        financialButtons.appendChild(button);
    });
}

// Calculator logic
function handleButtonClick(value) {
    if (value >= '0' && value <= '9') {
        handleNumber(value);
    } else if (value === '.') {
        handleDecimal();
    } else if (value === '±') {
        handlePlusMinus();
    } else if (value === 'C') {
        handleClear();
    } else if (value === '⌫') {
        handleBackspace();
    } else if (value === '=') {
        handleEquals();
    } else if (isOperator(value)) {
        handleOperator(value);
    }
    updateDisplay();
}

function handleNumber(number) {
    if (currentInput === '0' || resetScreen) {
        currentInput = number;
        resetScreen = false;
    } else {
        currentInput += number;
    }
}

function handleDecimal() {
    if (resetScreen) {
        currentInput = '0.';
        resetScreen = false;
        return;
    }
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
}

function handlePlusMinus() {
    currentInput = (parseFloat(currentInput) * -1).toString();
}

function handleClear() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    resetScreen = false;
}

function handleBackspace() {
    if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
}

function handleEquals() {
    if (operation === null || resetScreen) return;
    
    const result = calculate(previousInput, currentInput, operation);
    addToHistory(`${previousInput} ${getOperationSymbol(operation)} ${currentInput} = ${result}`);
    
    currentInput = result.toString();
    operation = null;
    resetScreen = true;
    updateHistoryDisplay();
}

function handleOperator(op) {
    if (operation !== null && !resetScreen) {
        handleEquals();
    }
    previousInput = currentInput;
    operation = op;
    resetScreen = true;
}

function handleScientificButton(func) {
    let result;
    const input = parseFloat(currentInput);
    
    switch(func) {
        case 'sin': result = Math.sin(input * Math.PI / 180); break;
        case 'cos': result = Math.cos(input * Math.PI / 180); break;
        case 'tan': result = Math.tan(input * Math.PI / 180); break;
        case 'log': result = Math.log10(input); break;
        case 'ln': result = Math.log(input); break;
        case 'π': result = Math.PI; break;
        case 'e': result = Math.E; break;
        case 'x²': result = Math.pow(input, 2); break;
        case 'x³': result = Math.pow(input, 3); break;
        case '√': result = Math.sqrt(input); break;
        case 'x^y': 
            previousInput = currentInput;
            operation = '^';
            resetScreen = true;
            return;
        case '10^x': result = Math.pow(10, input); break;
        case 'e^x': result = Math.exp(input); break;
        case 'n!': result = factorial(input); break;
        case '1/x': result = 1 / input; break;
        case '|x|': result = Math.abs(input); break;
        case 'RND': result = Math.random(); break;
        case 'EE': 
            previousInput = currentInput;
            operation = 'EE';
            resetScreen = true;
            return;
        default: return;
    }
    
    addToHistory(`${func}(${currentInput}) = ${result}`);
    currentInput = result.toString();
    resetScreen = true;
    updateDisplay();
    updateHistoryDisplay();
}

function handleFinancialButton(func) {
    // Placeholder for financial functions
    // In a real implementation, these would be more complex
    let result;
    const input = parseFloat(currentInput);
    
    switch(func) {
        case 'PV': result = input / 1.1; break; // Simplified PV calculation
        case 'FV': result = input * 1.1; break; // Simplified FV calculation
        case 'PMT': result = input * 0.1; break; // Simplified PMT calculation
        case 'NPER': result = 10; break; // Simplified NPER
        case 'RATE': result = 0.05; break; // Simplified RATE
        default: 
            currentInput = 'Função financeira não implementada';
            resetScreen = true;
            updateDisplay();
            return;
    }
    
    addToHistory(`${func}(${currentInput}) = ${result}`);
    currentInput = result.toString();
    resetScreen = true;
    updateDisplay();
    updateHistoryDisplay();
}

// Helper functions
function isOperator(value) {
    return ['+', '-', '×', '÷', '%'].includes(value);
}

function getOperationSymbol(op) {
    const symbols = {
        '+': '+',
        '-': '-',
        '×': '×',
        '÷': '÷',
        '%': '%',
        '^': '^',
        'EE': 'EE'
    };
    return symbols[op] || '';
}

function calculate(num1, num2, op) {
    const a = parseFloat(num1);
    const b = parseFloat(num2);
    
    switch(op) {
        case '+': return a + b;
        case '-': return a - b;
        case '×': return a * b;
        case '÷': return a / b;
        case '%': return a % b;
        case '^': return Math.pow(a, b);
        case 'EE': return a * Math.pow(10, b);
        default: return b;
    }
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// History functions
function addToHistory(entry) {
    history.unshift(entry);
    if (history.length > 10) {
        history.pop();
    }
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
}

function updateHistoryDisplay() {
    historyDisplay.textContent = history.length > 0 ? history[0] : '';
}

// Theme functions
function loadThemePreference() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.documentElement.classList.add('dark');
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
}

// Mode switching
function switchMode(mode) {
    currentMode = mode;
    basicButtons.classList.add('hidden');
    scientificButtons.classList.add('hidden');
    financialButtons.classList.add('hidden');
    
    modeButtons.forEach(btn => {
        btn.classList.remove('bg-blue-100', 'dark:bg-blue-900');
    });
    
    const activeBtn = document.querySelector(`.mode-btn[data-mode="${mode}"]`);
    activeBtn.classList.add('bg-blue-100', 'dark:bg-blue-900');
    
    switch(mode) {
        case 'basic':
            basicButtons.classList.remove('hidden');
            break;
        case 'scientific':
            scientificButtons.classList.remove('hidden');
            break;
        case 'financial':
            financialButtons.classList.remove('hidden');
            break;
    }
}

// Event listeners
themeToggle.addEventListener('click', toggleTheme);

modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        switchMode(button.dataset.mode);
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        handleButtonClick(e.key);
    } else if (e.key === '.') {
        handleButtonClick('.');
    } else if (e.key === 'Enter') {
        handleButtonClick('=');
    } else if (e.key === 'Escape') {
        handleButtonClick('C');
    } else if (e.key === 'Backspace') {
        handleButtonClick('⌫');
    } else if (['+', '-', '*', '/', '%'].includes(e.key)) {
        const ops = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷',
            '%': '%'
        };
        handleButtonClick(ops[e.key]);
    }
});

// Display update
function updateDisplay() {
    display.value = currentInput;
}

// Initialize
initCalculator();