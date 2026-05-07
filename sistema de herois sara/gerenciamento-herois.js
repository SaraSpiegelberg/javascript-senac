//Antes de rodar o código rodar "npm install prompt-sync" para instalar biblioteca do prompt-sync 
//O prompt-sync é uma biblioteca que serve para uma única coisa: permitir que o programa peça informações ao usuário pelo teclado e espere a resposta.


//Imagino que chame ou configure a biblioteca PROMPT-SYNC como constantes
const prompt = require("prompt-sync")()
const fs = require("fs")


//Declara herois e deve continuar
let herois = buscarHerois()
let deveContinuar = true

//Declara um array? ou vários arrays? 
const CLASSES = [
    {
        id: "1",
        nome: "Guerreiro"
    },
    {
        id: "2",
        nome: "Mago"
    },
    {
        id: "3",
        nome: "Arqueiro"
    }
]

//declara oque é oque no menu , talcoisa = 1 etc
const OPCOES_MENU = {
    CRIAR_HEROI: "1",
    LISTAR_HEROIS: "2",
    EDITAR_HEROI: "3",
    EXCLUIR_HEROI: "4",
    SAIR: "0"
}

//declara constantes em geral
const CONSTANTES = {
    ATIVO: "1",
    INATIVO: "0",
    NIVEL_MINIMO: 1,
    NIVEL_MAXIMO: 100,
    VIDA_MINIMA: 0,
    MANA_MINIMA: 0,
    MENSAGEM_VOLTAR: "Digite enter para voltar"
}


//fica repetindo ENQUANTO variavel for true 
while (deveContinuar) {
    console.clear()
    console.log("Bem vindo ao jogo de gerenciamento de herois")
    console.log(`Escolha uma opção para continuar:\n1 - Criar um novo herói\n2 - Listar todos os heróis\n3 - Editar um herói\n4 - Excluir um herói\n0 - Sair do jogo`)
    const opcao = prompt() //deixa o usuario escolher

    // opcoesmenu abre variavel constante, criar heroi é o valor switch é tipo um "SE PRESSIONAR 1 então". Seria bem mais facil fazer com numeros. mas ... 
    //Fica mais legivel assim mesmo. 
    switch (opcao) {
        case OPCOES_MENU.CRIAR_HEROI: //se opção = 1 ou igual "CRIAR_HEROI" que vale 1
            criarNovoHeroi() //chama função
            break;
        case OPCOES_MENU.LISTAR_HEROIS:
            listarHerois(herois)
            break
        case OPCOES_MENU.EDITAR_HEROI:
            editarHeroi()
            break
        case OPCOES_MENU.EXCLUIR_HEROI:
            excluirHeroi()
            break
        case OPCOES_MENU.SAIR:
            finalizarJogo()
        default:
            console.log("Opção inválida. Selecione uma opção de 1 à 5.")
            break;
    }
}

//---------------------------------------------------------------- DAQUI PRA BAIXO é TUDO FUNÇÃO ----------------------------------------

function finalizarJogo() {
    console.log("Finalizando o jogo...")
    deveContinuar = false
}

function excluirHeroi() {
    console.clear()
    exibirHerois(herois)
    console.log("Digite o nome do herói que voce deseja excluir")
    const nome = prompt()

    const heroi = herois.find(x => x.nome === nome)
    if (heroi == null) {
        console.log(`Herói com o nome "${nome}" nao encontrado`);
        prompt(CONSTANTES.MENSAGEM_VOLTAR)
        return
    }

    herois = herois.filter(x => x.nome !== nome)

    salvarHerois(herois)

    console.log(`Herói ${heroi.nome} excluido com sucesso`);
    prompt(CONSTANTES.MENSAGEM_VOLTAR)
}

function editarHeroi() {
    console.clear()
    exibirHerois(herois)
    console.log("Digite o nome do herói que voce deseja editar")
    const nome = prompt()

    const heroi = herois.find(x => x.nome === nome)
    if (heroi == null) {
        console.log(`Herói com o nome "${nome}" nao encontrado`);
        prompt(CONSTANTES.MENSAGEM_VOLTAR)
        return
    }

    console.clear()
    console.log(`Editando o herói ${heroi.nome}`)
    exibirHerois([heroi])

    console.log("Digite o novo atributo do herói ou repita o atual para manter")
    heroi.nome = perguntarNome()
    heroi.classe = perguntarClasse()
    heroi.nivel = perguntarNivel()
    heroi.vidaMaxima = perguntarVidaMaxima()
    heroi.vidaAtual = perguntarVidaAtual(heroi.vidaMaxima)
    heroi.mana = perguntarMana()
    heroi.ativo = perguntarAtivo()

    salvarHerois(herois)

    console.clear()
    console.log(`Herói ${heroi.nome} atualizado`)
    exibirHerois(herois)
    prompt(CONSTANTES.MENSAGEM_VOLTAR)
}

function criarNovoHeroi() {
    const nome = perguntarNome()
    const classe = perguntarClasse()
    const nivel = perguntarNivel()
    const vidaMaxima = perguntarVidaMaxima()
    const vidaAtual = perguntarVidaAtual(vidaMaxima)
    const mana = perguntarMana()
    const ativo = perguntarAtivo()

    const heroi = {
        nome,
        classe: classe,
        nivel,
        vidaAtual,
        vidaMaxima,
        mana,
        ativo,
        dataCriacao: new Date()
    }

    herois.push(heroi)
    salvarHerois(herois)

    console.clear()
    console.log(`Herói ${heroi.nome} cadastrado com sucesso`)
    prompt(CONSTANTES.MENSAGEM_VOLTAR)
}

function listarHerois(listaHerois) {
    exibirHerois(listaHerois)
    prompt(CONSTANTES.MENSAGEM_VOLTAR)
}

function exibirHerois(listaHerois) {
    console.clear()
    if (listaHerois.length === 0) {
        console.log("Não há heróis para serem exibidos. Volte ao menu inicial para cadastrar alguns")
    }

    let contador = 1
    for (const heroi of listaHerois) {
        console.log(`Herói ${contador}`);
        const ativo = heroi.ativo ? "Ativo" : "Inativo"
        const dataCriacao = heroi.dataCriacao.toLocaleString("pt-BR", { timeZone: "UTC" })
        const statusVida = obterStatusVida(heroi)

        console.log(`${heroi.nome}\n${heroi.classe.nome}\nNivel ${heroi.nivel}\nVida atual ${heroi.vidaAtual}\nVida Maxima  ${heroi.vidaMaxima}\nStatus vida: ${statusVida}\nMana: ${heroi.mana}\n${ativo}\nData de criacao: ${dataCriacao}`);
        console.log("")
        contador++
    }
}

function obterStatusVida(heroi) {
    const setentaPorCentoVida = heroi.vidaMaxima * 0.7
    const trintaPorCentoVida = heroi.vidaMaxima * 0.3

    if (heroi.vidaAtual > setentaPorCentoVida) {
        return "Saudável"
    } else if (heroi.vidaAtual > trintaPorCentoVida && heroi.vidaAtual < setentaPorCentoVida) {
        return "Ferido"
    } else {
        return "Crítico"
    }
}

function perguntarNome() {
    return nome = prompt("Qual é o nome do herói? ")
}

function perguntarAtivo() {
    while (true) {
        const ativo = prompt("O herói está ativo? (1 - Sim; 0 - Nao) ")

        if (ativo !== "1" && ativo !== "0") {
            console.log("Digite 1 ou 0 para definir se o herói está ativo")
        } else {
            return ativo === CONSTANTES.ATIVO
        }
    }
}

function perguntarMana() {
    while (true) {
        const manaInput = prompt("Qual é a mana do herói? ")

        if (isNaN(manaInput)) {
            console.log("A mana deve ser um valor numérico")
        } else {
            const mana = Number(manaInput)

            if (manaInput < CONSTANTES.VIDA_MINIMA) {
                console.log("A mana não pode ser negativa")
            } else {
                return mana
            }
        }
    }
}

function perguntarNivel() {
    while (true) {
        const nivelInput = prompt("Qual é o nivel do herói? (1 - 100) ")

        if (isNaN(nivelInput)) {
            console.log("O nivel deve ser um valor numérico")
        } else {
            const nivel = Number(nivelInput)
            if (nivel < CONSTANTES.NIVEL_MINIMO || nivel > CONSTANTES.NIVEL_MAXIMO) {
                console.log("O nivel deve estar entre 1 e 100")
            } else {
                return nivel
            }
        }

    }
}

function perguntarVidaAtual(vidaMaxima) {
    while (true) {
        const vidaAtualInput = prompt("Qual é a vida atual do herói? ")

        if (isNaN(vidaAtualInput)) {
            console.log("A vida atual deve ser um valor numérico")
        } else {
            const vida = Number(vidaAtualInput)
            if (vida < CONSTANTES.VIDA_MINIMA || vida > vidaMaxima) {
                console.log("A vida atual não pode ser negativa ou maior que a vida máxima")
            } else {
                return vida
            }
        }

    }
}

function perguntarVidaMaxima() {
    while (true) {
        const vidaMaximaInput = prompt("Qual é a vida maxima do herói? ")

        if (isNaN(vidaMaximaInput)) {
            console.log("O a vida máxima deve ser um valor numérico")
        } else {
            const vidaMaxima = Number(vidaMaximaInput)
            if (vidaMaxima < CONSTANTES.VIDA_MINIMA) {
                console.log("A vida máxima não pode ser negativa")
            } else {
                return vidaMaxima
            }
        }
    }
}

function perguntarClasse() {
    while (true) {
        const classeId = prompt("Qual é a classe do herói? (1 - Guerreiro; 2 - Mago; 3 - Arqueiro) ")

        const classe = CLASSES.find(x => x.id === classeId)

        if (classe == null) {
            console.log(`Não foi encontrado uma classe com o id ${classeId}`)
        } else {
            return classe
        }
    }
}

function salvarHerois(listaHerois) {
    const arquivoJson = JSON.stringify(listaHerois, null, 2)

    fs.writeFileSync("herois.json", arquivoJson)
}

function buscarHerois() {
    try {
        const arquivoJson = fs.readFileSync("herois.json", "utf-8")

        const listaHerois = JSON.parse(arquivoJson)

        return listaHerois
    } catch (error) {
        const listaHeroisVazia = []
        salvarHerois(listaHeroisVazia)

        return listaHeroisVazia
    }
}