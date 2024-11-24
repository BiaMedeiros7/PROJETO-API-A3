document.addEventListener('DOMContentLoaded', () => {
    function inicializarBox(box) {
        const addTarefaBtn = box.querySelector('.addTarefaBtn');
        const inputBoxTarefas = box.querySelector('.inputBoxTarefas');
        const lista = box.querySelector('.lista');

        function carregarTarefas() {
            let idBox = box.id; // aqui é onde identifica a box pelos ids
            let tarefasSalvas = JSON.parse(localStorage.getItem(idBox)) || [];
            tarefasSalvas.forEach((tarefa) => {
                criarTarefa(tarefa.nome, tarefa.feito);
            });
        }

        // Salva as tarefas no localStorage (trocar para o banco de dados dps)
        function salvarTarefas() {
            let idBox = box.id; 
            let tarefas = [];
            box.querySelectorAll('.tarefaItem').forEach((li) => {
                tarefas.push({
                    nome: li.querySelector('.textoTarefa').innerText,
                    feito: li.classList.contains('feito'),
                });
            });
            localStorage.setItem(idBox, JSON.stringify(tarefas)); 
        }

        
        function criarTarefa(tarefaNome, feito = false) {
            let li = document.createElement('li');
            li.classList.add('tarefaItem');
            if (feito) li.classList.add('feito'); 

           
            let iconeFeito = document.createElement('img');
            iconeFeito.src = feito ? 'imagens/cheio.png' : 'imagens/vazio.png'; 
            iconeFeito.alt = 'Marcar como feito';
            iconeFeito.classList.add('iconeFeito');

            
            iconeFeito.addEventListener('click', () => {
                if (iconeFeito.src.includes('imagens/vazio.png')) {
                    iconeFeito.src = 'imagens/cheio.png';
                    li.classList.add('feito');
                } else {
                    iconeFeito.src = 'imagens/vazio.png';
                    li.classList.remove('feito');
                }
                salvarTarefas();
            });

           
            let textoTarefa = document.createElement('span');
            textoTarefa.classList.add('textoTarefa');
            textoTarefa.innerText = tarefaNome;

            
            let btnEditar = document.createElement('button');
            btnEditar.classList.add('btnAcao');
            btnEditar.innerHTML = '<i class="bx bxs-pencil"></i>';
            btnEditar.addEventListener('click', () => {
                editarTarefa(li, textoTarefa);
            });

            
            let btnDeletar = document.createElement('button');
            btnDeletar.classList.add('btnAcao');
            btnDeletar.innerHTML = '<i class="bx bxs-trash bx-tada"></i>';
            btnDeletar.addEventListener('click', () => {
                li.remove();
                salvarTarefas();
            });

            
            li.prepend(iconeFeito);
            li.appendChild(textoTarefa);
            li.appendChild(btnEditar);
            li.appendChild(btnDeletar);

            
            lista.appendChild(li);
        }

        
        function addTarefa() {
            let tarefaNome = inputBoxTarefas.value.trim();
            if (tarefaNome === '') return; // Não permite adicionar tarefa vazia
            criarTarefa(tarefaNome);
            salvarTarefas();
            inputBoxTarefas.value = ''; // Limpa o campo de entrada
        }

        // Função para editar a tarefa diretamente no box
        function editarTarefa(li, textoTarefa) {
            // Substitui o texto por um campo de input
            let inputEdicao = document.createElement('input');
            inputEdicao.type = 'text';
            inputEdicao.value = textoTarefa.innerText;
            inputEdicao.classList.add('inputEdicao');

            
            li.replaceChild(inputEdicao, textoTarefa);

           
            inputEdicao.addEventListener('blur', () => {
                textoTarefa.innerText = inputEdicao.value.trim();
                li.replaceChild(textoTarefa, inputEdicao);
                salvarTarefas();
            });

            inputEdicao.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    textoTarefa.innerText = inputEdicao.value.trim();
                    li.replaceChild(textoTarefa, inputEdicao);
                    salvarTarefas();
                }
            });

           
            inputEdicao.focus();
        }

        
        addTarefaBtn.addEventListener('click', addTarefa);

        
        inputBoxTarefas.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTarefa();
            }
        });

        //aqui é o antigo showtask() se não me engano
        carregarTarefas();
    }

    
    document.querySelectorAll('.box').forEach((box) => {
        inicializarBox(box);
    });
});