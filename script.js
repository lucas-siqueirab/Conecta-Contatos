var ordenar = true;

function organizarContatos(){
    ordenar = !ordenar;

    document.getElementById('seta').style.transform =
        ordenar ? 'rotate(90deg)' : 'rotate(-90deg)'

    const contatos = pegarDadosLocalStorage();

    contatos.sort((a, b) =>  {
        return ordenar ?
        a.nome.toLowerCase() > b.nome.toLowerCase() ? 1 : -1 :
        b.nome.toLowerCase() > a.nome.toLowerCase() ? 1 : -1
    })

    gravarDadosLocalStorage(contatos);
    limparContatos();
    listarContatos(contatos);
}

function abrirModal(){
    document.getElementById('modal-container').classList.remove('oculto')
}

function abrirModalEditar(index){
    const contatos = pegarDadosLocalStorage();
    const contato = contatos[index];

    document.getElementById('form').classList.add(`edit-${index}`);
    document.getElementById('action').innerText = 'Editar Contato';
    document.getElementById('title-modal').innerText = `Editar ${contato.nome}`;

    document.getElementById('nome').value = contato.nome
    document.getElementById('email').value = contato.email
    document.getElementById('fone').value = contato.fone
    document.getElementById('badge').value = contato.badge

    abrirModal();
}

function abrirModalCriar(){
    document.getElementById('form').classList.add('criar')
    document.getElementById('action').innerText = 'Criar Contato'
    document.getElementById('title-modal').innerText = 'Criar Contato'

    abrirModal()
}

function fecharModal(){
    document.getElementById('modal-container').classList.add('oculto')
    document.getElementById('form').removeAttribute('class');

    limparModal()
}

function limparModal(){
    document.getElementById('nome').value = ""
    document.getElementById('email').value = ""
    document.getElementById('fone').value = ""
    document.getElementById('badge').value = "Categoria"
}

function limparContatos(){
    document.getElementById('contatos-wrapper').innerHTML = ''
}

function pegarDadosLocalStorage(){
    return JSON.parse(localStorage.getItem('contatos')) || []
}

function gravarDadosLocalStorage(contatos){
    localStorage.setItem('contatos', JSON.stringify(contatos))
}

// C.R.U.D

// C - Create
function criarContato(){
    const contatos = pegarDadosLocalStorage() 
    const nome = document.getElementById('nome').value
    const email = document.getElementById('email').value
    const fone = document.getElementById('fone').value
    const badge = document.getElementById('badge').value

    const contato = {nome, email, fone, badge}

    contatos.push(contato)
    
    localStorage.setItem('contatos', JSON.stringify(contatos))

    gravarDadosLocalStorage(contatos)

    fecharModal()
    limparModal()
    listarContatos()
    fecharModal()
}

// R - Read

function listarContatos(arrayContatos = []){

    let contatos = arrayContatos;

    if(contatos.length < 1){
        contatos = pegarDadosLocalStorage();
    }

    const contContatos = document.getElementById('cont-contatos')

    if(contatos.length < 1) {
        contContatos.innerText = 'Nenhum Contato'   
    } if (contatos.length > 1) {
        contContatos.innerText = `${contatos.length} Contatos` 
    } 

    contatos.forEach((contato, index) => {
        const contatoCard = document.createElement('div')
        contatoCard.classList.add('contato-card')
        contatoCard.innerHTML = `
            <div class="contato-info">
                <div>
                    <h3>${contato.nome}</h3>
                    <span class="badge">${contato.badge}</span>
                </div>
                <span>${contato.email}</span>
                <span>${contato.fone}</span>
            </div>
            <div class="contato-cta">
                <button onclick="abrirModalEditar(${index})"><img src="./assets/edit.svg" alt="editar"></button>
                <button onclick='deletarContato(${index})'><img src="./assets/delete.svg" alt="deletar"></button>
            </div>
        `
        document.getElementById('contatos-wrapper').appendChild(contatoCard)
    })
}

listarContatos()

// U - Updade

function atualizarContato(index){
    const contatos = pegarDadosLocalStorage();

    const nome = document.getElementById('nome').value
    const email = document.getElementById('email').value
    const fone = document.getElementById('fone').value
    const badge = document.getElementById('badge').value

    const contatoAtualizado = {nome, email, fone, badge};

    contatos[index] = contatoAtualizado;

    gravarDadosLocalStorage(contatos);

    limparModal();
    limparContatos();
    listarContatos();
    fecharModal();
}

// D - Delete

function deletarContato(index){
    const contatos = pegarDadosLocalStorage();

    if (confirm('Deseja mesmo deletar este contato ?') === true) {
        contatos.splice(index, 1) // 9 // Splice aceita dois argumentos, o primeiro é a posição no array e o segundo é quantos elementos do array é para ser deletado.
        gravarDadosLocalStorage(contatos) // 9
        limparContatos();
        listarContatos();
    }
    
}

// Eventos

document.getElementById('form').addEventListener('submit', (event) => {
    const acao = document.getElementById('form').getAttribute('class').split('-')[0]
    const posicao = document.getElementById('form').getAttribute('class').split('-')[1]

    switch(acao){
        case 'edit':
            event.preventDefault();
            atualizarContato(posicao);
            document.getElementById('form').removeAttribute('class');
            break;
        case 'criar':
            event.preventDefault();
            criarContato();
            document.getElementById('form').removeAttribute('class')
            break;
    } 

})

document.getElementById('pesquisar').addEventListener('keyup', (event) => {
    const contatos = pegarDadosLocalStorage();
    const pesquisa = event.target.value.toLowerCase();

    const contatosFiltrados = contatos.filter(contato => {
        return contato.nome.toLowerCase().includes(pesquisa)
    })

    limparContatos();
    listarContatos(contatosFiltrados);
    
    
}) 