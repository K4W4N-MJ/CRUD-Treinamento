const form = document.getElementById('projetoForm');
const lista = document.getElementById('listaProjetos');

// 1. Função para buscar e exibir os projetos (O botão de excluir fica AQUI dentro)
async function carregarProjetos() {
    const resposta = await fetch('http://localhost:3000/projetos');
    const projetos = await resposta.json();
    
    lista.innerHTML = ''; // Limpa a lista antes de carregar

    projetos.forEach(p => {
        // Criamos o card e injetamos o ID do MongoDB ('p._id') no botão
        lista.innerHTML += `
            <div class="projeto-card" style="border: 1px solid #444; padding: 15px; margin-bottom: 10px; border-radius: 8px; background: #202024;">
                <strong>${p.cliente}</strong> - ${p.servico}<br>
                <small>Valor: R$ ${p.valor} | Status: ${p.status}</small><br>
                
                <button onclick="excluirProjeto('${p._id}')" 
                    style="background: #e53935; color: white; border: none; padding: 5px 15px; border-radius: 4px; cursor: pointer; margin-top: 10px;">
                    Excluir
                </button>
            </div>
        `;
    });
}

// 2. Evento de envio do formulário (Criar)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        cliente: document.getElementById('cliente').value,
        servico: document.getElementById('servico').value,
        valor: document.getElementById('valor').value
    };

    const resposta = await fetch('http://localhost:3000/projetos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

    if (resposta.ok) {
        alert("Projeto salvo com sucesso!");
        form.reset();
        carregarProjetos(); 
    }
});

// 3. Função para EXCLUIR (Deletar)
async function excluirProjeto(id) {
    if (confirm("Tem certeza que quer apagar este projeto?")) {
        try {
            const resposta = await fetch(`http://localhost:3000/projetos/${id}`, { 
                method: 'DELETE' 
            });

            if (resposta.ok) {
                carregarProjetos(); // Recarrega a lista sem o item deletado
            } else {
                alert("Erro ao excluir do banco de dados.");
            }
        } catch (erro) {
            console.error("Erro na requisição:", erro);
        }
    }
}

// Inicia carregando os dados
carregarProjetos();