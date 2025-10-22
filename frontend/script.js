const BASE_URL = "http://127.0.0.1:8000/api/v1";

// GET all Monsters
function puxar_api() {
    axios.get(`${BASE_URL}/monsters/`)
        .then((response) => {
            const monsters = response.data;
            const container = document.getElementById("monsterContainer");
            if (container) {
                container.innerHTML = ''; 
                monsters.forEach(element => {
                    const monsterId = element.id_monster;

                    const monsterDiv = document.createElement('div');
                    monsterDiv.classList.add('monster');

                    monsterDiv.innerHTML = `
                        <h2>${element.nome}</h2>
                        <p><strong>Tipo:</strong> ${element.tipo_monstro}</p>
                        <p><strong>Pai:</strong> ${element.pai_famoso}</p>
                        <p><strong>Cor:</strong> ${element.cor_favorita}</p>
                        <button onclick="editarMonstro(${monsterId}, '${element.nome}', '${element.tipo_monstro}', '${element.pai_famoso}', '${element.cor_favorita}')">Editar</button>
                        <button onclick="excluirMonstro(${monsterId})">Excluir</button>
                        <hr>
                    `;
                    container.appendChild(monsterDiv);
                });
            } else {
            }
        })
        .catch((error) => {
            console.error("Failed to fetch monsters:", error);
        });
}

// POST Monster
const formCadastro = document.getElementById('createMonsterForm');
if (formCadastro) {
    formCadastro.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('create_nome').value;
        const tipoMonstro = document.getElementById('create_tipo_monstro').value;
        const paiFamoso = document.getElementById('create_pai_famoso').value;
        const corFavorita = document.getElementById('create_cor_favorita').value;

        const dadosMonstro = {
            nome: nome,
            tipo_monstro: tipoMonstro,
            pai_famoso: paiFamoso,
            cor_favorita: corFavorita
        };

        axios.post(`${BASE_URL}/monsters/`, dadosMonstro)
            .then(response => {
                console.log("Monstro criado com sucesso:", response.data);
                formCadastro.reset();
                puxar_api(); 
            })
            .catch(error => {
                console.error("Erro ao criar monstro:", error);
                alert(`Erro ao criar monstro: ${error.response ? error.response.data.detail : error.message}`);
            });
    });
}

// DELETE Monster
function excluirMonstro(id) {
    if (confirm("Tem certeza que quer excluir este monstro?")) {
        
        axios.delete(`${BASE_URL}/monsters/${id}/`)
            .then(response => {
                console.log("Monstro excluído com sucesso.");
                puxar_api(); 
            })
            .catch(error => {
                console.error("Erro ao excluir monstro:", error);
                alert(`Erro ao excluir monstro: ${error.response ? error.response.data.detail : error.message}`);
            });
    }
}

// PUT/PATCH Monster (CORRIGIDO)
function editarMonstro(id, nomeAtual, tipoAtual, paiAtual, corAtual) {
    
    const nome = prompt("Editar Nome:", nomeAtual);
    const tipo = prompt("Editar Tipo de Monstro:", tipoAtual);
    const pai = prompt("Editar Pai Famoso:", paiAtual);
    const cor = prompt("Editar Cor Favorita:", corAtual);

    if (nome === null || tipo === null || pai === null || cor === null) {
        console.log("Edição de Monstro cancelada.");
        return;
    }

    const dadosAtualizados = {
        nome: nome,
        tipo_monstro: tipo,
        pai_famoso: pai,
        cor_favorita: cor
    };

    axios.put(`${BASE_URL}/monsters/${id}/`, dadosAtualizados)
        .then(response => {
            console.log("Monstro atualizado com sucesso:", response.data);
            puxar_api();
        })
        .catch(error => {
            console.error("Erro ao atualizar monstro:", error);
            alert(`Erro ao atualizar monstro: ${error.response ? error.response.data.detail : error.message}`);
        });
}

// GET all Pets
function puxar_pets() {
    axios.get(`${BASE_URL}/pets/`)
        .then((response) => {
            const pets = response.data;
            const container = document.getElementById("petContainer");
            if (container) {
                container.innerHTML = ''; 
                pets.forEach(element => {
                    const petId = element.id_pet;
                    const donoId = element.dono_id;

                    const petDiv = document.createElement('div');
                    petDiv.classList.add('pet');

                    petDiv.innerHTML = `
                        <h2>${element.nome} (${element.especie})</h2>
                        <p><strong>Descrição:</strong> ${element.descricao}</p>
                        <p><strong>ID do Dono:</strong> ${element.dono_id}</p>
                        <button onclick="editarPet(${petId}, '${element.nome}', '${element.especie}', '${element.descricao}', ${donoId})">Editar</button>
                        <button onclick="excluirPet(${petId})">Excluir</button>
                        <hr>
                    `;
                    container.appendChild(petDiv);
                });
            } else {
            }
        })
        .catch((error) => {
            console.error("Failed to fetch pets:", error);
             const container = document.getElementById("petContainer");
             if(container) container.innerHTML = '<p>Erro ao carregar pets.</p>';
        });
}


// POST Pet
const formCadastroPet = document.getElementById('createPetForm');

if (formCadastroPet) {
    formCadastroPet.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('create_nome_pet').value;
        const especie = document.getElementById('create_especie_pet').value;
        const descricao = document.getElementById('create_descricao_pet').value;
        const donoId = parseInt(document.getElementById('create_dono_id_pet').value, 10); 

        const dadosPet = {
            nome: nome,
            especie: especie,
            descricao: descricao,
            dono_id: donoId
        };

        axios.post(`${BASE_URL}/pets/`, dadosPet)
            .then(response => {
                console.log("Pet criado com sucesso:", response.data);
                formCadastroPet.reset();
                puxar_pets(); 
            })
            .catch(error => {
                console.error("Erro ao criar pet:", error);
                alert(`Erro ao criar pet: ${error.response ? error.response.data.detail : error.message}`);
            });
    });
}

// DELETE Pet
function excluirPet(id) {
    if (confirm("Tem certeza que quer excluir este pet?")) {
        
        axios.delete(`${BASE_URL}/pets/${id}/`)
            .then(response => {
                console.log("Pet excluído com sucesso.");
                puxar_pets(); 
            })
            .catch(error => {
                console.error("Erro ao excluir pet:", error);
                alert(`Erro ao excluir pet: ${error.response ? error.response.data.detail : error.message}`);
            });
    }
}

// PUT/PATCH Pet (NOVO)
function editarPet(id, nomeAtual, especieAtual, descricaoAtual, donoIdAtual) {
    
    const nome = prompt("Editar Nome:", nomeAtual);
    const especie = prompt("Editar Espécie:", especieAtual);
    const descricao = prompt("Editar Descrição:", descricaoAtual);
    const donoIdStr = prompt("Editar ID do Dono:", donoIdAtual.toString());

    if (nome === null || especie === null || descricao === null || donoIdStr === null) {
        console.log("Edição de Pet cancelada.");
        return;
    }

    const donoId = parseInt(donoIdStr, 10);

    if (isNaN(donoId)) {
        alert("O ID do Dono deve ser um número válido.");
        return;
    }

    const dadosAtualizados = {
        nome: nome,
        especie: especie,
        descricao: descricao,
        dono_id: donoId
    };

    axios.put(`${BASE_URL}/pets/${id}/`, dadosAtualizados)
        .then(response => {
            console.log("Pet atualizado com sucesso:", response.data);
            puxar_pets();
        })
        .catch(error => {
            console.error("Erro ao atualizar pet:", error);
            alert(`Erro ao atualizar pet: ${error.response ? error.response.data.detail : error.message}`);
        });
}

if (document.getElementById("monsterContainer")) {
    puxar_api();
}

if (document.getElementById("petContainer")) {
    puxar_pets();
}