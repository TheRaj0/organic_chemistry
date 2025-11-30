// -------------------------------
// Chem class
// -------------------------------

ALKANE = 0
ALKENE = 1
ALKYNE = 2
ALKYL_BROMIDE = 3
CARBOXYLATE_SALT = 4
DIBROMO_ALKANE = 5
ALCOHOL = 6
ALDEHYDE = 7
CARBOXYLIC_ACID = 8

function toSubscriptNumbers(str) {
    const subscriptMap = {
        '0': '₀',
        '1': '₁',
        '2': '₂',
        '3': '₃',
        '4': '₄',
        '5': '₅',
        '6': '₆',
        '7': '₇',
        '8': '₈',
        '9': '₉'
    };

    return str.toString().split('').map(char => {
        return subscriptMap[char] || char; // replace digit or keep other chars
    }).join('');
}

class Chem {
    constructor(carbons, chemType) {
        this.c = carbons;
        this.type = chemType;
        this.formula = toSubscriptNumbers(this.calculateFormula());
        this.bondenergy = this.calculateBongEnergy();
    }

    calculateFormula() {
        let c = this.c, type = this.type;

        switch(type) {
            case ALKANE:
                if (c === 1) return "CH4";
                return `C${c}H${2*c+2}`;
            case ALKENE:
                return `C${c}H${2*c}`;
            case ALKYNE:
                return `C${c}H${2*c-2}`;
            case ALCOHOL:
                if (c===1) return "CH3-OH";
                return `C${c}H${2*c+1}-OH`;
            case ALDEHYDE:
                if (c===1) return "H-CHO";
                if (c===2) return "CH3-CHO";
                return `C${c-1}H${2*(c-1)+1}-CHO`;
            case CARBOXYLIC_ACID:
                if (c===1) return "H-COOH";
                if (c===2) return "CH3-COOH";
                return `C${c-1}H${2*(c-1)+1}-COOH`;
            case ALKYL_BROMIDE:
                if (c===1) return "CH3Br";
                return `C${c}H${2*c+1}Br`;
            case CARBOXYLATE_SALT:
                if (c===1) return "H-COONa";
                if (c===2) return "CH3-COONa";
                return `C${c-1}H${2*(c-1)+1}-COONa`;
            case DIBROMO_ALKANE:
                if (c===2) return "CH2Br-CH2Br";
                if (c===3) return "CH3-CHBr-CH2Br";
                return `C${c-2}H${2*(c-2)+1}-CHBr-CH2Br`;
            default:
                return `${c}-${type}`;
        }
    }

    calculateBongEnergy() {
        const BE = {
    CH: 413,
    CC: 347,
    CdoubleC: 611,
    CtripC: 839,
    CO: 358,     // C–O single
    CdoubleO: 799, // C=O
    OH: 464,
    CBr: 275,
    avg_C_O_carboxylate: 550 // average of 358 + 799 ≈ 578 but literature ~550
};

        let nCH = 0;
        let nCC1 = 0;
        let nCC2 = 0;
        let nCC3 = 0;
        let nCO1 = 0;
        let nCO2 = 0;
        let nOH = 0;
        let nCBr = 0;
        let nCOOavg = 0;   // for carboxylate salts (COO−)

        switch (this.type) {

            case ALKANE:
                nCH = 2*this.c + 2;
                nCC1 = this.c - 1;
                break;

            case ALKENE:
                nCH = 2*this.c;
                nCC1 = this.c - 2;
                nCC2 = 1;
                break;

            case ALKYNE:
                nCH = 2*this.c - 2;
                nCC1 = this.c - 2;
                nCC3 = 1;
                break;

            case ALCOHOL:
                nCH = 2*this.c + 1;
                nCC1 = this.c - 1;
                nCO1 = 1;
                nOH = 1;
                break;

            case ALDEHYDE:
                nCH = 2*this.c;
                nCC1 = this.c - 1;
                nCO2 = 1;
                break;

            case CARBOXYLIC_ACID:
                nCH = 2*this.c - 1;
                nCC1 = this.c - 1;
                nCO1 = 1; // C–O single
                nOH = 1; // O–H
                nCO2 = 1; // C=O
                break;

            case CARBOXYLATE_SALT:
                // COO− resonance: 2 identical C–O bonds
                nCH = 2*this.c - 1;
                nCC1 = this.c - 1;
                nCOOavg = 2; // two identical average bonds
                break;

            case ALKYL_BROMIDE:
                nCH = 2*this.c + 1;
                nCC1 = this.c - 1;
                nCBr = 1;
                break;

            case DIBROMO_ALKANE:
                nCH = 2*this.c;
                nCC1 = this.c - 1;
                nCBr = 2;
                break;
        }

        return (
            nCH * BE.CH +
            nCC1 * BE.CC +
            nCC2 * BE.CdoubleC +
            nCC3 * BE.CtripC +
            nCO1 * BE.CO +
            nCO2 * BE.CdoubleO +
            nCOOavg * BE.avg_C_O_carboxylate +
            nOH * BE.OH +
            nCBr * BE.CBr
        );
    }

    toString() {
        return this.formula;
    }
}


function makeReactionString(reactants, catalystTop, catalystBottom, products) {
    let output = `

 <li class="reaction">
    <span class="reactants">`+ reactants +`</span>
    <span class="arrow-container">
      <span class="arrow"></span>
      <span class="above">`+ catalystTop +`</span>
      <span class="below">`+ catalystBottom +`</span>
    </span>
    <span class="products">`+ products +`</span>
  </li>

    `

    return output
}

// -------------------------------
// Reactions
// -------------------------------










// Alkyl Halide reactions
function wurtz_coupling(chem) {
    if (chem.type === ALKYL_BROMIDE) {
        const product = new Chem(chem.c*2, ALKANE);
        let rxnstr = makeReactionString(`2${chem.formula} + 2Na`, `Dry Ether`, ``, `${product.formula} + 2NaBr`)
        return [product, rxnstr];
    }
    return null;
}
// Alkyl Halide reactions
function halide_to_alcohol(chem) {
    if (chem.type === ALKYL_BROMIDE) {
        const product = new Chem(chem.c, ALCOHOL);
        let rxnstr = makeReactionString(
            `${chem.formula} + NaOH(aq)`,
            '',          // catalyst/reagent on top
            '',          // condition on bottom
            `${product.formula} + NaBr`
        );
        return [product, rxnstr];
    }
    return null;
}

function dehydrohalogenation(chem) {
    if (chem.type === ALKYL_BROMIDE && chem.c >= 2) {
        const product = new Chem(chem.c, ALKENE);
        let rxnstr = makeReactionString(
            `${chem.formula} + NaOH(alc)`,
            '',           // catalyst/top info can be empty
            '',           // temp or Δ below
            `${product.formula} + H₂O + NaBr`
        );
        return [product, rxnstr];
    }
    return null;
}

// Carboxylic Acid
function neutralization(chem) {
    if (chem.type === CARBOXYLIC_ACID) {
        const product = new Chem(chem.c, CARBOXYLATE_SALT);
        let rxnstr = makeReactionString(
            `${chem.formula} + NaOH`,
            '',           // catalyst/top
            '',           // condition/bottom
            `${product.formula} + H₂O`
        );
        return [product, rxnstr];
    }
    return null;
}

function reduceCarboxylic(chem) {
    if (chem.type === CARBOXYLIC_ACID) {
        const product = new Chem(chem.c, ALDEHYDE);
        let rxnstr = makeReactionString(
            `${chem.formula} + 2[H]`,
            'LiAlH₄',
            '',           // nothing below
            `${product.formula} + H₂O`
        );
        return [product, rxnstr];
    }
    return null;
}

// Carboxylate Salt
function soda_lime_decarboxylation(chem) {
    if (chem.type === CARBOXYLATE_SALT && chem.c > 1) {
        const product = new Chem(chem.c - 1, ALKANE);
        let rxnstr = makeReactionString(
            `${chem.formula} + NaOH`,
            'Δ',
            'CaO',           // bottom empty
            `${product.formula} + Na₂CO₃`
        );
        return [product, rxnstr];
    }
    return null;
}

// Alkane
function halogenationAlkane(chem) {
    if (chem.type === ALKANE) {
        const product = new Chem(chem.c, ALKYL_BROMIDE);
        let rxnstr = makeReactionString(
            `${chem.formula} + Br₂`,
            'UV',
            '',           // bottom empty
            `${product.formula} + HBr`
        );
        return [product, rxnstr];
    }
    return null;
}

function AlkanetoCarboxylic(chem) {
    if (chem.type === ALKANE && chem.c <= 3) {
        const product = new Chem(chem.c, CARBOXYLIC_ACID);
        let rxnstr = makeReactionString(
            `${chem.formula} + 3[O]`,
            'High Temperature',
            'Low Pressure', 
            `${product.formula} + H₂O`
        );
        return [product, rxnstr];
    }
    return null;
}

// Alkene
function hydrogenationAlkene(chem) {
    if (chem.type === ALKENE) {
        const product = new Chem(chem.c, ALKANE);
        let rxnstr = makeReactionString(
            `${chem.formula} + H₂`,
            'Ni',
            '180 - 200°C', 
            `${product.formula}`
        );
        return [product, rxnstr];
    }
    return null;
}

function hydrationAlkene(chem) {
    if (chem.type === ALKENE) {
        const product = new Chem(chem.c, ALCOHOL);
        let rxnstr = makeReactionString(
            `${chem.formula} + H₂O`,
            'H₃PO₄',
            '300°C, 60atm', 
            `${product.formula}`
        );
        return [product, rxnstr];
    }
    return null;
}

function halogenationAlkene(chem) {
    if (chem.type === ALKENE) {
        const product = new Chem(chem.c, ALKYL_BROMIDE);
        let rxnstr = makeReactionString(
            `${chem.formula} + HBr`,
            'H₂O₂',
            '', 
            `${product.formula}`
        );
        return [product, rxnstr];
    }
    return null;
}

function bromineAddition(chem) {
    if (chem.type === ALKENE) {
        const product = new Chem(chem.c, DIBROMO_ALKANE);
        let rxnstr = makeReactionString(
            `${chem.formula} + Br₂`,
            '', 
            '', 
            `${product.formula}`
        );
        return [product, rxnstr];
    }
    return null;
}

// Dibromo Alkane
function dibromotoAlkyne(chem) {
    if (chem.type === DIBROMO_ALKANE) {
        const product = new Chem(chem.c, ALKYNE);
        let rxnstr = makeReactionString(
            `${chem.formula}`,
            'NaNH₂',
            '', 
            `${product.formula} + 2HBr`
        );
        return [product, rxnstr];
    }
    return null;
}

// Alkyne
function hydrogenationAlkyne(chem) {
    if (chem.type === ALKYNE) {
        const product = new Chem(chem.c, ALKENE);
        let rxnstr = makeReactionString(
            `${chem.formula} + H₂`,
            'Ni',
            '180 - 200°C', 
            `${product.formula}`
        );
        return [product, rxnstr];
    }
    return null;
}

function hydrationAlkyne(chem) {
    if (chem.type === ALKYNE && chem.c <= 3) {
        const product = new Chem(chem.c, ALDEHYDE);
        let rxnstr = makeReactionString(
            `${chem.formula} + H₂O`,
            '80°C, 2% HgSO₄',
            '20% H2SO4', 
            `${product.formula}`
        );
        return [product, rxnstr];
    }
    return null;
}

// Alcohol
function dehydration(chem) {
    if (chem.type === ALCOHOL && chem.c >= 2) {
        const product = new Chem(chem.c, ALKENE);
        let rxnstr = makeReactionString(
            `${chem.formula}`,
            'H₂SO₄',
            '', 
            `${product.formula} + H₂O`
        );
        return [product, rxnstr];
    }
    return null;
}

function oxidationAlcohol(chem) {
    if (chem.type === ALCOHOL) {
        const product = new Chem(chem.c, ALDEHYDE);
        let rxnstr = makeReactionString(
            `${chem.formula} + [O]`,
            'K₂Cr₂O₇',
            'H₂SO₄', 
            `${product.formula} + H₂O`
        );
        return [product, rxnstr];
    }
    return null;
}

// Aldehyde
function oxidationAldehyde(chem) {
    if (chem.type === ALDEHYDE) {
        const product = new Chem(chem.c, CARBOXYLIC_ACID);
        let rxnstr = makeReactionString(
            `${chem.formula} + [O]`,
            'K₂Cr₂O₇',
            'H₂SO₄', 
            `${product.formula}`
        );
        return [product, rxnstr];
    }
    return null;
}

function reduceAldehyde(chem) {
    if (chem.type === ALDEHYDE) {
        const product = new Chem(chem.c, ALCOHOL);
        let rxnstr = makeReactionString(
            `${chem.formula} + 2[H]`,
            'LiAlH₄',
            '', 
            `${product.formula}`
        );
        return [product, rxnstr];
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
    ALKANE: 1,
    ALKENE: 2,
    ALKYNE: 2,
    ALCOHOL: 1,
    ALDEHYDE: 1,
    CARBOXYLIC_ACID: 1,
    ALKYL_BROMIDE: 1,
    CARBOXYLATE_SALT: 1,
    DIBROMO_ALKANE: 2
};

// -------------------------------
// UI Interaction
// -------------------------------








const typeMap = {
    "Alkane": ALKANE,
    "Alkene": ALKENE,
    "Alkyne": ALKYNE,
    "Alkyl Bromide": ALKYL_BROMIDE,
    "Carboxylate Salt": CARBOXYLATE_SALT,
    "Dibromo Alkane": DIBROMO_ALKANE,
    "Alcohol": ALCOHOL,
    "Aldehyde": ALDEHYDE,
    "Carboxylic Acid": CARBOXYLIC_ACID
};



function runReaction() {
    const startType = typeMap[document.getElementById("startType").value];
    const targetType = typeMap[document.getElementById("targetType").value];
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
        resultBox.innerText = "No path found!";
    } else {
        let output = "<ul>";
        output += steps.join("\n");
        output += "</ul>"
        resultBox.innerHTML = output;
    }
}
