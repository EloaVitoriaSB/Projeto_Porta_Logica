document.addEventListener('DOMContentLoaded', () => {
    // Variáveis globais do sistema de simulação
    let currentGate = 'and';
    let inputA = 0;
    let inputB = 0;

    // Elementos da Interface DOM
    const btnGateSelector = document.querySelectorAll('.gate-btn');
    const btnA = document.getElementById('btn-a');
    const btnB = document.getElementById('btn-b');
    const containerInputB = document.getElementById('container-input-b');
    const currentGateTitle = document.getElementById('current-gate-title');
    const labOutput = document.getElementById('lab-output');
    const gateDescriptionText = document.getElementById('gate-description-text');
    const dynamicTable = document.getElementById('dynamic-table');

    // Banco de informações das portas lógicas
    const gateDetails = {
        and: {
            title: 'AND',
            desc: 'A saída só será verdadeira (1) se ambas as entradas A E B forem 1 simultaneamente.',
            headers: ['A', 'B', 'Saída']
        },
        or: {
            title: 'OR',
            desc: 'A saída será verdadeira (1) se pelo menos uma das entradas (A OU B) for igual a 1.',
            headers: ['A', 'B', 'Saída']
        },
        not: {
            title: 'NOT',
            desc: 'Possui apenas uma entrada. Inverte totalmente o sinal recebido de A.',
            headers: ['A', 'Saída']
        },
        xor: {
            title: 'XOR',
            desc: 'A saída será 1 apenas quando as entradas forem opostas/exclusivas.',
            headers: ['A', 'B', 'Saída']
        }
    };

    // Alternador de seleção de Porta Lógica
    btnGateSelector.forEach(button => {
        button.addEventListener('click', () => {
            btnGateSelector.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            
            currentGate = button.getAttribute('data-gate');
            
            // Se for a porta NOT, esconde visualmente a segunda entrada (B)
            if (currentGate === 'not') {
                containerInputB.style.display = 'none';
            } else {
                containerInputB.style.display = 'flex';
            }

            renderTableStructure();
            calculateCircuit();
        });
    });

    // Manipulador de clique nos interruptores interativos
    [btnA, btnB].forEach(btn => {
        btn.addEventListener('click', () => {
            let currentValue = parseInt(btn.getAttribute('data-value'));
            let newValue = currentValue === 0 ? 1 : 0;
            
            btn.setAttribute('data-value', newValue);
            btn.textContent = newValue;

            if (newValue === 1) btn.classList.add('active');
            else btn.classList.remove('active');

            // Sincroniza variáveis locais
            if (btn.id === 'btn-a') inputA = newValue;
            if (btn.id === 'btn-b') inputB = newValue;

            calculateCircuit();
        });
    });

    // Monta a tabela verdade de acordo com a porta ativa
    function renderTableStructure() {
        const specs = gateDetails[currentGate];
        gateDescriptionText.textContent = specs.desc;
        currentGateTitle.textContent = specs.title;

        let html = `<thead><tr>`;
        specs.headers.forEach(h => {
            html += `<th>${h}</th>`;
        });
        html += `</tr></thead><tbody id="table-rows-body">`;

        if (currentGate === 'not') {
            html += `<tr id="row-0"><td>0</td><td>1</td></tr>`;
            html += `<tr id="row-1"><td>1</td><td>0</td></tr>`;
        } else if (currentGate === 'and') {
            html += `<tr id="row-00"><td>0</td><td>0</td><td>0</td></tr>`;
            html += `<tr id="row-01"><td>0</td><td>1</td><td>0</td></tr>`;
            html += `<tr id="row-10"><td>1</td><td>0</td><td>0</td></tr>`;
            html += `<tr id="row-11"><td>1</td><td>1</td><td>1</td></tr>`;
        } else if (currentGate === 'or') {
            html += `<tr id="row-00"><td>0</td><td>0</td><td>0</td></tr>`;
            html += `<tr id="row-01"><td>0</td><td>1</td><td>1</td></tr>`;
            html += `<tr id="row-10"><td>1</td><td>0</td><td>1</td></tr>`;
            html += `<tr id="row-11"><td>1</td><td>1</td><td>1</td></tr>`;
        } else if (currentGate === 'xor') {
            html += `<tr id="row-00"><td>0</td><td>0</td><td>0</td></tr>`;
            html += `<tr id="row-01"><td>0</td><td>1</td><td>1</td></tr>`;
            html += `<tr id="row-10"><td>1</td><td>0</td><td>1</td></tr>`;
            html += `<tr id="row-11"><td>1</td><td>1</td><td>0</td></tr>`;
        }

        html += `</tbody>`;
        dynamicTable.innerHTML = html;
    }

    // Processamento e cálculo matemático da saída
    function calculateCircuit() {
        let output = 0;

        if (currentGate === 'not') {
            output = inputA === 0 ? 1 : 0;
        } else if (currentGate === 'and') {
            output = (inputA === 1 && inputB === 1) ? 1 : 0;
        } else if (currentGate === 'or') {
            output = (inputA === 1 || inputB === 1) ? 1 : 0;
        } else if (currentGate === 'xor') {
            output = inputA !== inputB ? 1 : 0;
        }

        // Aplica o valor calculado na tela
        labOutput.textContent = output;
        if (output === 1) labOutput.classList.add('active');
        else labOutput.classList.remove('active');

        // Destaca dinamicamente qual linha da tabela verdade representa o estado atual
        const allRows = dynamicTable.querySelectorAll('tbody tr');
        allRows.forEach(r => r.classList.remove('active-row'));

        const activeRowId = currentGate === 'not' ? `row-${inputA}` : `row-${inputA}${inputB}`;
        const targetRow = document.getElementById(activeRowId);
        if (targetRow) {
            targetRow.classList.add('active-row');
        }
    }

    // Inicialização da primeira renderização limpa do app
    renderTableStructure();
    calculateCircuit();
});