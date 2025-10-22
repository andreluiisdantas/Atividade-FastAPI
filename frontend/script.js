// script.js

// --- Configurações da API ---
const MONSTER_API_URL = "http://127.0.0.1:8000/api/v1/monsters/";
const PET_API_URL = "http://127.0.0.1:8000/api/v1/pets/";

// --- Função genérica para criar um formulário de edição ---
// Agora aceita um array de definições de campo para maior flexibilidade
function createEditForm(itemData, itemType, itemId, apiUrl, fieldDefinitions, callback) {
    const existingEditForm = document.querySelector(`.edit-form[data-id="${itemId}"]`);
    if (existingEditForm) {
        existingEditForm.remove();
        return;
    }

    const itemCard = document.querySelector(`.${itemType}-card[data-id="${itemId}"]`);
    if (!itemCard) {
        console.error(`Card do tipo '${itemType}' com ID '${itemId}' não encontrado.`);
        return;
    }

    const formTitle = `Editar ${itemType.charAt(0).toUpperCase() + itemType.slice(1)} (ID: ${itemId})`;
    let formFieldsHtml = '';
    let initialValues = { nome: itemData.nome };

    fieldDefinitions.forEach(field => {
        initialValues[field.name] = itemData[field.name]; // Pega o valor do objeto itemData
        const inputType = field.type || 'text'; // 'text' por padrão
        formFieldsHtml += `
            <label for="edit_${field.name}_${itemType}_${itemId}">${field.label}:</label>
            <input type="${inputType}" id="edit_${field.name}_${itemType}_${itemId}" value="${initialValues[field.name]}" required><br>
        `;
    });

    const editForm = document.createElement('form');
    editForm.classList.add('edit-form');
    editForm.setAttribute('data-id', itemId);
    editForm.innerHTML = `
        <h3>${formTitle}</h3>
        <label for="edit_nome_${itemType}_${itemId}">Nome:</label>
        <input type="text" id="edit_nome_${itemType}_${itemId}" value="${initialValues.nome}" required><br>
        ${formFieldsHtml}
        <button type="submit">Salvar Edição</button>
        <button type="button" class="cancel-btn">Cancelar</button>
    `;

    itemCard.appendChild(editForm);

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const updatedData = {
            nome: document.getElementById(`edit_nome_${itemType}_${itemId}`).value,
        };

        fieldDefinitions.forEach(field => {
            let value = document.getElementById(`edit_${field.name}_${itemType}_${itemId}`).value;
            if (field.type === 'number') {
                value = parseInt(value, 10);
            }
            updatedData[field.name] = value;
        });

        try {
            await axios.put(`${apiUrl}${itemId}`, updatedData);
            alert(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} atualizado com sucesso!`);
            editForm.remove();
            callback();
        } catch (error) {
            console.error(`Erro ao atualizar ${itemType}:`, error);
            alert(`Erro ao atualizar ${itemType}. Verifique o console.`);
        }
    });

    editForm.querySelector('.cancel-btn').addEventListener('click', () => {
        editForm.remove();
    });
}


// --- Função genérica para deletar um item ---
async function deleteItem(itemId, apiUrl, itemType, callback) {
    if (confirm(`Tem certeza que deseja deletar o ${itemType} com ID ${itemId}?`)) {
        try {
            await axios.delete(`${apiUrl}${itemId}`);
            alert(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deletado com sucesso!`);
            callback(); // Recarrega a lista
        } catch (error) {
            console.error(`Erro ao deletar ${itemType}:`, error);
            alert(`Erro ao deletar ${itemType}. Verifique o console.`);
        }
    }
}


// ===========================================
// LÓGICA PARA MONSTROS
// ===========================================
const monsterContainer = document.getElementById("monsterContainer");
const createMonsterForm = document.getElementById("createMonsterForm");

async function loadMonsters() {
    if (!monsterContainer) return;

    try {
        const response = await axios.get(MONSTER_API_URL);
        const monsters = response.data;
        monsterContainer.innerHTML = '';

        if (monsters.length === 0) {
            monsterContainer.innerHTML = "<p>Nenhum monstro encontrado.</p>";
            return;
        }

        monsters.forEach(monster => {
            const monsterDiv = document.createElement('div');
            monsterDiv.classList.add('monster-card');
            monsterDiv.setAttribute('data-id', monster.id_monster);

            monsterDiv.innerHTML = `
                <h2>${monster.nome}</h2>
                <p><strong>ID:</strong> ${monster.id_monster}</p>
                <p><strong>Tipo de Monstro:</strong> ${monster.tipo_monstro}</p>
                <p><strong>Pai Famoso:</strong> ${monster.pai_famoso}</p>
                <p><strong>Cor Favorita:</strong> ${monster.cor_favorita}</p>
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Deletar</button>
            `;
            monsterContainer.appendChild(monsterDiv);
        });
    } catch (error) {
        console.error("Erro ao buscar dados da API de monstros:", error);
        monsterContainer.innerHTML = "<p>Ocorreu um erro ao carregar os monstros. Verifique o console para mais detalhes.</p>";
    }
}

if (createMonsterForm) {
    createMonsterForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const newMonster = {
            nome: document.getElementById('create_nome').value,
            tipo_monstro: document.getElementById('create_tipo_monstro').value,
            pai_famoso: document.getElementById('create_pai_famoso').value,
            cor_favorita: document.getElementById('create_cor_favorita').value,
        };

        try {
            await axios.post(MONSTER_API_URL, newMonster);
            alert('Monstro criado com sucesso!');
            createMonsterForm.reset();
            loadMonsters();
        } catch (error) {
            console.error("Erro ao criar monstro:", error);
            alert('Erro ao criar monstro. Verifique o console.');
        }
    });
}

if (monsterContainer) {
    monsterContainer.addEventListener('click', async (event) => {
        const target = event.target;
        const monsterCard = target.closest('.monster-card');
        if (!monsterCard) return;

        const monsterId = monsterCard.getAttribute('data-id');

        if (target.classList.contains('delete-btn')) {
            deleteItem(monsterId, MONSTER_API_URL, 'monstro', loadMonsters);
        }

        if (target.classList.contains('edit-btn')) {
            const nome = monsterCard.querySelector('h2').textContent;
            const tipo_monstro = monsterCard.querySelector('p:nth-of-type(3)').textContent.replace('Tipo de Monstro: ', '');
            const pai_famoso = monsterCard.querySelector('p:nth-of-type(4)').textContent.replace('Pai Famoso: ', '');
            const cor_favorita = monsterCard.querySelector('p:nth-of-type(5)').textContent.replace('Cor Favorita: ', '');

            const currentMonsterData = {
                nome: nome,
                tipo_monstro: tipo_monstro,
                pai_famoso: pai_famoso,
                cor_favorita: cor_favorita
            };
            const fieldDefinitions = [
                { name: "tipo_monstro", label: "Tipo de Monstro", type: "text" },
                { name: "pai_famoso", label: "Pai Famoso", type: "text" },
                { name: "cor_favorita", label: "Cor Favorita", type: "text" }
            ];

            createEditForm(currentMonsterData, 'monstro', monsterId, MONSTER_API_URL, fieldDefinitions, loadMonsters);
        }
    });
}


// ===========================================
// LÓGICA PARA PETS
// ===========================================
const petContainer = document.getElementById("petContainer");
const createPetForm = document.getElementById("createPetForm");

async function loadPets() {
    if (!petContainer) return;

    try {
        const response = await axios.get(PET_API_URL);
        const pets = response.data;
        petContainer.innerHTML = '';

        if (pets.length === 0) {
            petContainer.innerHTML = "<p>Nenhum pet encontrado.</p>";
            return;
        }

        pets.forEach(pet => {
            const petDiv = document.createElement('div');
            petDiv.classList.add('pet-card');
            petDiv.setAttribute('data-id', pet.id_pet);

            petDiv.innerHTML = `
                <h2>${pet.nome}</h2>
                <p><strong>ID:</strong> ${pet.id_pet}</p>
                <p><strong>Espécie:</strong> ${pet.especie}</p>
                <p><strong>Descrição:</strong> ${pet.descricao}</p>
                <p><strong>ID do Dono:</strong> ${pet.dono_id}</p>
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Deletar</button>
            `;
            petContainer.appendChild(petDiv);
        });
    } catch (error) {
        console.error("Erro ao buscar dados da API de pets:", error);
        petContainer.innerHTML = "<p>Ocorreu um erro ao carregar os pets. Verifique o console para mais detalhes.</p>";
    }
}

if (createPetForm) {
    createPetForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const newPet = {
            nome: document.getElementById('create_nome_pet').value,
            especie: document.getElementById('create_especie_pet').value,
            descricao: document.getElementById('create_descricao_pet').value,
            dono_id: parseInt(document.getElementById('create_dono_id_pet').value, 10),
        };

        try {
            await axios.post(PET_API_URL, newPet);
            alert('Pet criado com sucesso!');
            createPetForm.reset();
            loadPets();
        } catch (error) {
            console.error("Erro ao criar pet:", error);
            alert('Erro ao criar pet. Verifique o console.');
        }
    });
}

if (petContainer) {
    petContainer.addEventListener('click', async (event) => {
        const target = event.target;
        const petCard = target.closest('.pet-card');
        if (!petCard) return;

        const petId = petCard.getAttribute('data-id');

        if (target.classList.contains('delete-btn')) {
            deleteItem(petId, PET_API_URL, 'pet', loadPets);
        }

        if (target.classList.contains('edit-btn')) {
            const nome = petCard.querySelector('h2').textContent;
            const especie = petCard.querySelector('p:nth-of-type(3)').textContent.replace('Espécie: ', '');
            const descricao = petCard.querySelector('p:nth-of-type(4)').textContent.replace('Descrição: ', '');
            const dono_id = petCard.querySelector('p:nth-of-type(5)').textContent.replace('ID do Dono: ', '');

            const currentPetData = {
                nome: nome,
                especie: especie,
                descricao: descricao,
                dono_id: dono_id // Passa como string, a função createEditForm converterá para número
            };
            const fieldDefinitions = [
                { name: "especie", label: "Espécie", type: "text" },
                { name: "descricao", label: "Descrição", type: "text" },
                { name: "dono_id", label: "ID do Dono", type: "number" }
            ];

            createEditForm(currentPetData, 'pet', petId, PET_API_URL, fieldDefinitions, loadPets);
        }
    });
}


// ===========================================
// LÓGICA DE INICIALIZAÇÃO
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('pets.html')) {
        loadPets();
    } else {
        loadMonsters();
    }
});