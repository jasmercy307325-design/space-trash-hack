onst PRODUCTION_RATES = {
    METHANE_A: 15.0, // kg/Sol from Photo-Forge
    METHANE_B: 5.0,  // kg/Sol from Microbial-Goo
    PHA: 2.0         // kg/Sol of Bioplastic from Methane
};

const MAX_STORAGE = {
    METHANE: 10000, // Total Methane Goal in KG
    PHA: 1000       // Total PHA Goal in KG
};

let currentSol = 1;
let totalMethane = 0.0;
let totalPHA = 0.0;
let methaneA_output = 0.0;
let methaneB_output = 0.0;

// --- DOM Element References ---
const solDisplay = document.getElementById('martian-sol');
const methaneA_Output = document.getElementById('methane-a-output');
const waterA_Output = document.getElementById('water-a-output');
const methaneB_Output = document.getElementById('methane-b-output');
const phaOutput = document.getElementById('pha-output');
const totalMethaneStorage = document.getElementById('total-methane-storage');
const totalPHAStorage = document.getElementById('total-pha-storage');
const progressMethaneA = document.getElementById('progress-methane-a');
const progressMethaneB = document.getElementById('progress-methane-b');
const progressPHA = document.getElementById('progress-pha');


// --- Core Simulation Function (Runs every "Sol") ---
function runAetheraSimulation() {
    // 1. Update Sol Counter
    currentSol++;
    solDisplay.textContent = String(currentSol).padStart(3, '0');

    // 2. Module A: Photo-Forge Production
    const methane_A_produced = PRODUCTION_RATES.METHANE_A;
    // Assuming water byproduct is 2.25 times the mass of methane (based on reaction mass ratio)
    const water_A_recycled = methane_A_produced * 2.25;
   
    totalMethane += methane_A_produced;
    methaneA_output = methane_A_produced;

    // 3. Module B: Microbial-Goo Production
    const methane_B_produced = PRODUCTION_RATES.METHANE_B;
    totalMethane += methane_B_produced;
    methaneB_output = methane_B_produced;

    // 4. Module C: Poly-Printer Production (Uses Methane)
    // For simplicity, we assume continuous PHA production is prioritized
    const pha_produced = PRODUCTION_RATES.PHA;
    totalPHA += pha_produced;
   
    // NOTE: In a real system, the methane used for PHA would be subtracted from totalMethane,
    // but for this dashboard, we'll keep the storage increasing toward the goal.

    // 5. Update the Dashboard Display
   
    // Module A Output
    methaneA_Output.textContent = ${methaneA_output.toFixed(2)} KG CH₄ (+${(totalMethane/MAX_STORAGE.METHANE * 100).toFixed(2)}%);
    waterA_Output.textContent = ${water_A_recycled.toFixed(2)} L H₂O (Recycled);
    progressMethaneA.value = totalMethane;

    // Module B Output
    methaneB_Output.textContent = ${methaneB_output.toFixed(2)} KG CH₄;
    progressMethaneB.value = totalMethane;
   
    // Module C Output
    phaOutput.textContent = ${pha_produced.toFixed(2)} KG PHA Plastic (+${(totalPHA/MAX_STORAGE.PHA * 100).toFixed(2)}%);
    progressPHA.value = totalPHA;

    // Total Storage Display
    totalMethaneStorage.textContent = totalMethane.toFixed(2);
    totalPHAStorage.textContent = totalPHA.toFixed(2);
   
    // 6. Check for Mission Complete (Optional)
    if (totalMethane >= MAX_STORAGE.METHANE && totalPHA >= MAX_STORAGE.PHA) {
        clearInterval(simulationInterval);
        alert(PROJECT AETHERA COMPLETE! Mission goals achieved in ${currentSol} Sols.);
        solDisplay.textContent = ${currentSol} (GOAL MET);
    }

    // 7. Data Styling (Optional: Change colors when goals are near)
    if (totalMethane > MAX_STORAGE.METHANE * 0.9) {
        totalMethaneStorage.style.color = '#00ff99'; // Neon Green near completion
    }
}

// Initialize the display with the starting values
function initializeDashboard() {
    solDisplay.textContent = String(currentSol).padStart(3, '0');
    progressMethaneA.max = MAX_STORAGE.METHANE;
    progressMethaneB.max = MAX_STORAGE.METHANE;
    progressPHA.max = MAX_STORAGE.PHA;
    // Run the simulation once after a short delay for a nice start
    setTimeout(runAetheraSimulation, 500);
}

// Start the Simulation
initializeDashboard();

// Set the simulation to run every 1000 milliseconds (1 second) - represents one "Sol" in the simulation
const simulationInterval = setInterval(runAetheraSimulation, 1000);