// -------------------------------
// Chem class
// -------------------------------
class Chem {
    constructor(carbons, chemType) {
        this.c = carbons;
        this.type = chemType;
        this.formula = this.calculateFormula();
    }

    calculateFormula() {
        let c = this.c, type = this.type;

        switch(type) {
            case "Alkane":
                if (c === 1) return "CH4";
                return `C${c}H${2*c+2}`;
            case "Alkene":
                return `C${c}H${2*c}`;
            case "Alkyne":
                return `C${c}H${2*c-2}`;
            case "Alcohol":
                if (c===1) return "CH3-OH";
                return `C${c}H${2*c+1}-OH`;
            case "Aldehyde":
                if (c===1) return "H-CHO";
                if (c===2) return "CH3-CHO";
                return `C${c-1}H${2*(c-1)+1}-CHO`;
            case "Carboxylic Acid":
                if (c===1) return "H-COOH";
                if (c===2) return "CH3-COOH";
                return `C${c-1}H${2*(c-1)+1}-COOH`;
            case "Alkyl Bromide":
                if (c===1) return "CH3Br";
                return `C${c}H${2*c+1}Br`;
            case "Carboxylate Salt":
                if (c===1) return "H-COONa";
                if (c===2) return "CH3-COONa";
                return `C${c-1}H${2*(c-1)+1}-COONa`;
            case "Dibromo Alkane":
                if (c===2) return "CH2Br-CH2Br";
                if (c===3) return "CH3-CHBr-CH2Br";
                return `C${c-2}H${2*(c-2)+1}-CHBr-CH2Br`;
            default:
                return `${c}-${type}`;
        }
    }

    toString() {
        return this.formula;
    }
}

// -------------------------------
// Reactions
// -------------------------------

// Alkyl Halide reactions
function wurtz_coupling(chem) {
    if (chem.type === "Alkyl Bromide") {
        const product = new Chem(chem.c*2, "Alkane");
        return [product, `2 ${chem.formula} + 2 Na <span>⟶dry ether⟶</span> ${product.formula} + 2 NaBr`];
    }
    return null;
}

function halide_to_alcohol(chem) {
    if (chem.type === "Alkyl Bromide") {
        const product = new Chem(chem.c, "Alcohol");
        return [product, `${chem.formula} + NaOH(aq) <span>⟶⟶</span> ${product.formula} + NaBr`];
    }
    return null;
}

function dehydrohalogenation(chem) {
    if (chem.type === "Alkyl Bromide" && chem.c>=2) {
        const product = new Chem(chem.c, "Alkene");
        return [product, `${chem.formula} + NaOH(alc) <span>⟶⟶</span> ${product.formula} + H2O + NaBr`];
    }
    return null;
}

// Carboxylic Acid
function neutralization(chem) {
    if (chem.type === "Carboxylic Acid") {
        const product = new Chem(chem.c, "Carboxylate Salt");
        return [product, `${chem.formula} + NaOH <span>⟶⟶</span> ${product.formula} + H2O`];
    }
    return null;
}

function reduceCarboxylic(chem) {
    if (chem.type === "Carboxylic Acid") {
        const product = new Chem(chem.c, "Aldehyde");
        return [product, `${chem.formula} + 2[H] <span>⟶LiAlH4⟶</span> ${product.formula} + H2O`];
    }
    return null;
}

// Carboxylate Salt
function soda_lime_decarboxylation(chem) {
    if (chem.type === "Carboxylate Salt" && chem.c>1) {
        const product = new Chem(chem.c-1, "Alkane");
        return [product, `${chem.formula} + NaOH(CaO) <span>⟶Heat⟶</span> ${product.formula} + Na2CO3(CaO)`];
    }
    return null;
}

// Alkane
function halogenationAlkane(chem) {
    if (chem.type==="Alkane") {
        const product = new Chem(chem.c, "Alkyl Bromide");
        return [product, `${chem.formula} + Br2 <span>⟶UV⟶</span> ${product.formula} + HBr`];
    }
    return null;
}

function AlkanetoCarboxylic(chem) {
    if (chem.type==="Alkane" && chem.c<=3) {
        const product = new Chem(chem.c, "Carboxylic Acid");
        return [product, `${chem.formula} + 3[O] <span>⟶High Temp, Low Pressure⟶</span> ${product.formula} + H2O`];
    }
    return null;
}

// Alkene
function hydrogenationAlkene(chem) {
    if (chem.type==="Alkene") {
        const product = new Chem(chem.c, "Alkane");
        return [product, `${chem.formula} + H2 <span>⟶Ni, 180-200°C⟶</span> ${product.formula}`];
    }
    return null;
}

function hydrationAlkene(chem) {
    if (chem.type==="Alkene") {
        const product = new Chem(chem.c, "Alcohol");
        return [product, `${chem.formula} + H2O <span>⟶300°C, 60atm, H3PO4⟶</span> ${product.formula}`];
    }
    return null;
}

function halogenationAlkene(chem) {
    if (chem.type==="Alkene") {
        const product = new Chem(chem.c, "Alkyl Bromide");
        return [product, `${chem.formula} + HBr <span>⟶H2O2⟶</span> ${product.formula}`];
    }
    return null;
}

function bromineAddition(chem) {
    if (chem.type==="Alkene") {
        const product = new Chem(chem.c, "Dibromo Alkane");
        return [product, `${chem.formula} + Br2 <span>⟶⟶</span> ${product.formula}`];
    }
    return null;
}

// Dibromo Alkane
function dibromotoAlkyne(chem) {
    if (chem.type==="Dibromo Alkane") {
        const product = new Chem(chem.c, "Alkyne");
        return [product, `${chem.formula} <span>⟶NaNH2⟶</span> ${product.formula} + 2HBr`];
    }
    return null;
}

// Alkyne
function hydrogenationAlkyne(chem) {
    if (chem.type==="Alkyne") {
        const product = new Chem(chem.c, "Alkene");
        return [product, `${chem.formula} + H2 <span>⟶Ni, 180-200°C⟶</span> ${product.formula}`];
    }
    return null;
}

function hydrationAlkyne(chem) {
    if (chem.type==="Alkyne" && chem.c<=3) {
        const product = new Chem(chem.c, "Aldehyde");
        return [product, `${chem.formula} + H2O <span>⟶80°C, 20% H2SO4, 2% HgSO4⟶</span> ${product.formula}`];
    }
    return null;
}

// Alcohol
function dehydration(chem) {
    if (chem.type==="Alcohol" && chem.c>=2) {
        const product = new Chem(chem.c, "Alkene");
        return [product, `${chem.formula} <span>⟶H2SO4⟶</span> ${product.formula} + H2O`];
    }
    return null;
}

function oxidationAlcohol(chem) {
    if (chem.type==="Alcohol") {
        const product = new Chem(chem.c, "Aldehyde");
        return [product, `${chem.formula} + [O] <span>⟶K2Cr2O7, H2SO4⟶</span> ${product.formula} + H2O`];
    }
    return null;
}

// Aldehyde
function oxidationAldehyde(chem) {
    if (chem.type==="Aldehyde") {
        const product = new Chem(chem.c, "Carboxylic Acid");
        return [product, `${chem.formula} + [O] <span>⟶K2Cr2O7, H2SO4⟶</span> ${product.formula}`];
    }
    return null;
}

function reduceAldehyde(chem) {
    if (chem.type==="Aldehyde") {
        const product = new Chem(chem.c, "Alcohol");
        return [product, `${chem.formula} + 2[H] <span>⟶LiAlH4⟶</span> ${product.formula}`];
    }
    return null;
}

// -------------------------------
// Reactions list
// -------------------------------
const reactions = [
    halogenationAlkane, AlkanetoCarboxylic,
    hydrogenationAlkene, halogenationAlkene, hydrationAlkene, bromineAddition,
    hydrogenationAlkyne, hydrationAlkyne,
    dehydration, oxidationAlcohol,
    oxidationAldehyde, reduceAldehyde,
    reduceCarboxylic, neutralization,
    wurtz_coupling, dehydrohalogenation, halide_to_alcohol,
    soda_lime_decarboxylation,
    dibromotoAlkyne
];

// -------------------------------
// BFS Path Finder
// -------------------------------
function findPathWithReactions(start, end, reactions) {
    const queue = [[start, [start], []]];
    const visited = new Set();
    visited.add(start.toString());

    while(queue.length>0) {
        const [chem, path, rxnSteps] = queue.shift();

        if (chem.toString() === end.toString()) {
            return { path, steps: rxnSteps };
        }

        for(const rule of reactions) {
            const result = rule(chem);
            if(!result) continue;
            const [nxt, rxnStr] = result;
            if(!visited.has(nxt.toString())) {
                visited.add(nxt.toString());
                queue.push([nxt, path.concat([nxt]), rxnSteps.concat([rxnStr])]);
            }
        }
    }

    return { path: null, steps: null };
}

// -------------------------------
// Carbon validation
// -------------------------------
const minCarbons = {
    "Alkane": 1,
    "Alkene": 2,
    "Alkyne": 2,
    "Alcohol": 1,
    "Aldehyde": 1,
    "Carboxylic Acid": 1,
    "Alkyl Bromide": 1,
    "Carboxylate Salt": 1,
    "Dibromo Alkane": 2
};

// -------------------------------
// UI Interaction
// -------------------------------
function runReaction() {
    const startType = document.getElementById("startType").value;
    const targetType = document.getElementById("targetType").value;
    const startC = parseInt(document.getElementById("startC").value);
    const targetC = parseInt(document.getElementById("targetC").value);
    const resultBox = document.getElementById("result");

    // Validate inputs
    if (isNaN(startC) || isNaN(targetC)) {
        alert("Carbon numbers must be integers.");
        return;
    }
    if (startC < minCarbons[startType]) {
        alert(`Start chemical "${startType}" must have at least ${minCarbons[startType]} carbon(s).`);
        return;
    }
    if (targetC < minCarbons[targetType]) {
        alert(`Target chemical "${targetType}" must have at least ${minCarbons[targetType]} carbon(s).`);
        return;
    }

    const start = new Chem(startC, startType);
    const end = new Chem(targetC, targetType);

    const { path, steps } = findPathWithReactions(start, end, reactions);

    if(!path) {
        resultBox.value = "No path found!";
    } else {
        let output = "<ul>";
        output += steps.map(s=>"<li>"+s+"</li>").join("\n");
        output += "</ul>"
        resultBox.innerHTML = output;
    }
}
