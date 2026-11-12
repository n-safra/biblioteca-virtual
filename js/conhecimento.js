/*
Descricao: Projeto integrador - Biblioteca Virtual de Olímpia
nome_arquivo: js/conhecimento.js
nome_exercicio: Projeto Biblioteca Virtual de Olímpia - Feira de Tecnologia FATEC
nome_aluno: Nicolas Safra Gazige
email_aluno: nicolas.gazige@aluno.cps.sp.gov.br
turma: WEBI-ISW028-A
*/

/*
  BASE DE CONHECIMENTO DA CORUJA

  Tudo o que a assistente de leitura sabe sobre cada livro está aqui.
  Ela não usa inteligência artificial: procura as respostas neste arquivo.

  Cada resposta tem até três níveis, para a coruja se adaptar ao leitor:
    s = simples      (frases curtas, palavras fáceis)
    p = padrão       (explicação completa)
    x = aprofundado  (um detalhe a mais, para quem quer estudar)

  Para ensinar algo novo à coruja, basta acrescentar um item nas listas.
  Regra da casa: nada de contar o que acontece depois do trecho (sem spoiler).
*/

window.CONHECIMENTO = {

  /* ===================== DOM CASMURRO ===================== */
  dom: {
    titulo: "Dom Casmurro",

    resumo: {
      s: "O narrador volta para casa de trem. Um rapaz do bairro lê poemas para ele. O narrador cochila, e o rapaz fica chateado. No dia seguinte, o rapaz dá a ele o apelido de Dom Casmurro, e os vizinhos espalham o apelido.",
      p: "No primeiro capítulo, o narrador explica de onde veio o nome do livro. Voltando de trem para o Engenho Novo, ele encontra um rapaz do bairro que recita versos. Cansado, o narrador fecha os olhos algumas vezes, e o rapaz, ofendido, para de ler. No dia seguinte, o rapaz passa a chamá-lo de Dom Casmurro, e os vizinhos, que não gostam do jeito calado dele, espalham o apelido.",
      x: "O capítulo se chama Do título porque explica o nome do livro. Machado começa com uma cena pequena e bem-humorada, e o narrador conta tudo do jeito dele. Isso é importante: em Dom Casmurro, só conhecemos a história pelo ponto de vista de quem a conta."
    },

    // O mesmo trecho em linguagem simples, parágrafo por parágrafo
    simples: [
      "Uma noite, eu voltava da cidade para o meu bairro, o Engenho Novo. No trem, encontrei um rapaz do bairro. Eu só conhecia ele de cumprimentar. Ele se sentou do meu lado, falou da lua e da política, e começou a ler poemas para mim. A viagem era curta, e os poemas até que não eram ruins. Mas eu estava cansado e fechei os olhos algumas vezes. Por isso, ele parou de ler e guardou os poemas no bolso.",
      "— Continue, eu disse, acordando. — Já acabei, ele respondeu baixinho. — São muito bonitos, eu disse.",
      "Ele quase tirou os poemas do bolso de novo, mas desistiu. Estava chateado. No dia seguinte, começou a falar mal de mim e me deu um apelido: Dom Casmurro. Os vizinhos não gostam do meu jeito calado e de eu ficar sempre em casa. Por isso, espalharam o apelido, e ele pegou."
    ],

    // Um comentário de estudo para cada parágrafo
    estudo: [
      "Repare no humor de Machado: o narrador diz que os versos pode ser que não fossem inteiramente maus. É um elogio fraco que, na verdade, é uma crítica. A cena é pequena e comum, mas já apresenta o narrador: alguém cansado, que se afasta das pessoas.",
      "O diálogo é curto e seco. O narrador elogia versos que nem ouviu inteiros, e o leitor percebe o constrangimento dos dois.",
      "Aqui nasce o título do livro. O apelido vem de uma mágoa pequena, e o narrador o aceita com ironia. Machado usa um fato sem importância para mostrar como as pessoas são."
    ],

    palavras: [
      { termo: "Engenho Novo", outras: ["engenho"],
        s: "Um bairro da cidade do Rio de Janeiro.",
        p: "Engenho Novo é um bairro do Rio de Janeiro, onde o narrador mora. Na época do livro, ficava longe do centro, e as pessoas iam até lá de trem.",
        x: "O nome vem de um antigo engenho de açúcar que existia na região." },
      { termo: "trem da Central", outras: ["central", "trem"],
        s: "O trem que ligava o centro do Rio de Janeiro aos bairros.",
        p: "É o trem da Estrada de Ferro Central do Brasil, que levava as pessoas do centro do Rio de Janeiro para os bairros, como o Engenho Novo.",
        x: "A estação Central do Brasil existe até hoje, no centro do Rio de Janeiro." },
      { termo: "de vista e de chapéu", outras: ["de chapeu", "chapeu", "de vista"],
        s: "Conhecer pouco, só de cumprimentar.",
        p: "Quer dizer conhecer a pessoa só de cumprimentar. Naquela época, os homens tiravam o chapéu para cumprimentar alguém na rua. Conhecer de chapéu é conhecer só desse cumprimento, sem amizade." },
      { termo: "ao pé de mim", outras: ["ao pe"],
        s: "Do meu lado.",
        p: "Quer dizer do meu lado, bem perto de mim. O rapaz se sentou ao lado do narrador no trem." },
      { termo: "ministros", outras: ["ministro"],
        s: "Pessoas importantes do governo.",
        p: "Os ministros do governo. Falar da lua e dos ministros quer dizer conversar sobre assuntos comuns, como o tempo e a política." },
      { termo: "sucedeu", outras: ["suceder"],
        s: "Aconteceu.",
        p: "Sucedeu quer dizer aconteceu. Sucedeu, porém, é o mesmo que mas aconteceu que." },
      { termo: "amuado", outras: ["amuada"],
        s: "Chateado, emburrado.",
        p: "Amuado é quem está chateado e de cara fechada. O rapaz ficou amuado porque o narrador cochilou enquanto ele lia." },
      { termo: "alcunha", outras: ["alcunhando", "alcunhar", "alcunhou"],
        s: "Apelido.",
        p: "Alcunha quer dizer apelido. Alcunhando-me quer dizer me dando um apelido.",
        x: "Hoje a palavra é rara, mas ainda aparece em jornais, quando se fala do apelido de alguém." },
      { termo: "casmurro", outras: ["casmurra"],
        s: "Pessoa calada e fechada.",
        p: "Casmurro é uma pessoa calada, fechada, que fica na dela. Foi assim que o rapaz do trem viu o narrador.",
        x: "Logo depois deste trecho, o narrador avisa que não está usando a palavra no sentido do dicionário, que é teimoso, mas no sentido popular de homem calado e metido consigo." },
      { termo: "Dom", outras: [],
        s: "Um título de nobreza, como o de um rei.",
        p: "Dom é um título que vinha antes do nome de reis e nobres. No apelido, é uma brincadeira: é como chamar alguém de senhor de um jeito irônico." },
      { termo: "reclusos", outras: ["recluso", "reclusa"],
        s: "Que fica sempre em casa, longe das pessoas.",
        p: "Recluso é quem vive fechado em casa e evita as pessoas. Os vizinhos não gostam dos hábitos reclusos do narrador." },
      { termo: "deram curso", outras: ["curso"],
        s: "Espalharam.",
        p: "Dar curso quer dizer espalhar, fazer correr. Os vizinhos espalharam o apelido, e ele pegou." }
    ],

    personagens: [
      { nome: "O narrador", chaves: ["narrador", "dom casmurro", "casmurro", "bento", "bentinho", "ele mesmo"],
        s: "É quem conta a história. Ele mora no Engenho Novo e gosta de ficar quieto em casa. Ganhou o apelido de Dom Casmurro.",
        p: "É quem conta a história. É um homem mais velho, que mora no Engenho Novo, gosta de ficar em casa e fala pouco. Por isso ganhou o apelido de Dom Casmurro.",
        x: "Ao longo do livro, descobrimos que ele se chama Bento Santiago, e que na juventude era chamado de Bentinho. Tudo o que sabemos vem do ponto de vista dele." },
      { nome: "O rapaz do trem", chaves: ["rapaz", "poeta", "moco", "menino", "trem"],
        s: "Um rapaz do bairro que gosta de fazer poemas. Foi ele quem inventou o apelido Dom Casmurro.",
        p: "Um rapaz do bairro, que o narrador conhece só de cumprimentar. Ele lê seus versos no trem, fica ofendido quando o narrador cochila e, no dia seguinte, inventa o apelido Dom Casmurro." },
      { nome: "Os vizinhos", chaves: ["vizinho", "vizinhos"],
        s: "Moram perto do narrador e espalharam o apelido.",
        p: "Os vizinhos não gostam do jeito calado e fechado do narrador. Por isso espalharam o apelido Dom Casmurro, que acabou pegando." }
    ],

    // Personagens famosos que ainda não aparecem no trecho: a coruja não estraga a história
    semSpoiler: [
      { chaves: ["capitu", "capitolina"], texto: "Capitu é uma personagem muito importante deste livro, mas ela ainda não aparece neste capítulo. Para não estragar a sua leitura, eu falo dela quando ela aparecer." },
      { chaves: ["escobar"], texto: "Escobar aparece mais adiante no livro. Para não estragar a sua leitura, eu falo dele quando ele aparecer." },
      { chaves: ["jose dias"], texto: "José Dias aparece logo nos próximos capítulos. Para não estragar a sua leitura, eu falo dele quando ele aparecer." },
      { chaves: ["traiu", "traicao", "final", "fim do livro", "como termina"], texto: "Essa é uma das perguntas mais famosas da literatura brasileira, mas ela só faz sentido no fim do livro. Vamos ler juntos até lá." }
    ],

    // Perguntas comuns: a coruja responde quando encontra TODAS as palavras-chave
    duvidas: [
      { chaves: ["por que", "casmurro"],
        s: "Porque o narrador cochilou enquanto o rapaz lia poemas. O rapaz ficou chateado e deu o apelido a ele.",
        p: "O rapaz do trem ficou chateado porque o narrador cochilou enquanto ele lia seus versos. No dia seguinte, apelidou o narrador de Dom Casmurro, que quer dizer homem calado e fechado. Os vizinhos espalharam o apelido, e ele pegou." },
      { chaves: ["apelido"],
        s: "O apelido é Dom Casmurro. Quem deu foi o rapaz do trem.",
        p: "O apelido é Dom Casmurro. Quem deu foi o rapaz do trem, chateado porque o narrador cochilou durante a leitura dos versos. Os vizinhos espalharam o apelido." },
      { chaves: ["quem escreveu"], s: "Machado de Assis, em 1899.",
        p: "Dom Casmurro foi escrito por Machado de Assis, um dos maiores escritores do Brasil, e publicado em 1899." },
      { chaves: ["autor"], s: "Machado de Assis, em 1899.",
        p: "Dom Casmurro foi escrito por Machado de Assis, um dos maiores escritores do Brasil, e publicado em 1899." },
      { chaves: ["onde", "passa"], s: "No Rio de Janeiro.",
        p: "A história se passa no Rio de Janeiro, no fim do século dezenove. O narrador mora no bairro do Engenho Novo." },
      { chaves: ["fechou", "olhos"], s: "Porque estava cansado.",
        p: "Porque estava cansado. Ele conta que fechou os olhos três ou quatro vezes, e isso bastou para o rapaz parar de ler." },
      { chaves: ["dormiu"], s: "Ele cochilou porque estava cansado.",
        p: "Ele cochilou porque estava cansado. Fechou os olhos três ou quatro vezes, e isso bastou para o rapaz parar de ler." }
    ],

    quiz: [
      { pergunta: "Onde o narrador encontrou o rapaz?",
        opcoes: ["No trem da Central", "Numa festa no bairro", "Na biblioteca"], certa: 0,
        explica: "Ele encontrou o rapaz no trem, voltando da cidade para o Engenho Novo." },
      { pergunta: "Por que o rapaz parou de ler os versos?",
        opcoes: ["Porque o trem chegou", "Porque o narrador fechou os olhos", "Porque esqueceu os versos"], certa: 1,
        explica: "O narrador estava cansado e fechou os olhos algumas vezes. O rapaz achou que ele não estava ouvindo." },
      { pergunta: "O que quer dizer casmurro, no apelido?",
        opcoes: ["Homem muito rico", "Homem muito alegre", "Homem calado e fechado"], certa: 2,
        explica: "Casmurro é a pessoa calada e fechada, que fica na dela. Os vizinhos achavam o narrador assim." }
    ]
  },

  /* ===================== IRACEMA ===================== */
  iracema: {
    titulo: "Iracema",

    resumo: {
      s: "O narrador fala com o mar verde do Ceará, a terra onde nasceu. Ele pede que o mar se acalme para um barco passar em paz.",
      p: "O livro começa quase como um poema. O narrador fala com os verdes mares do Ceará, descreve a jandaia, as carnaúbas, as praias brancas e os coqueiros, e pede que o mar se acalme para que um barco passe tranquilo.",
      x: "Esse jeito de escrever, quase como poesia, é chamado de prosa poética. José de Alencar faz parte do Romantismo e queria criar uma literatura com a natureza e a história do Brasil. Por isso o começo exalta a paisagem do Ceará."
    },

    simples: [
      "Mar verde e agitado da terra onde eu nasci, onde a jandaia canta nas folhas das palmeiras de carnaúba;",
      "Mar verde, que brilha como uma pedra preciosa verde quando o sol nasce, passando pelas praias brancas cheias de sombra de coqueiros;",
      "Acalme-se, mar verde, e deixe suas ondas fortes mais lisas, para o barco que se aventura passar tranquilo por cima da água."
    ],

    estudo: [
      "O narrador fala diretamente com o mar, como se ele pudesse ouvir. Essa figura de linguagem se chama apóstrofe. A jandaia e a carnaúba mostram que a paisagem é do Ceará.",
      "Comparar o mar com a líquida esmeralda é uma metáfora de cor e de brilho. Repare no ritmo: as frases parecem versos, mesmo sendo prosa.",
      "O pedido ao mar cria expectativa: quem está naquele barco? O leitor já sente que essa viagem vai ser importante para a história."
    ],

    palavras: [
      { termo: "bravios", outras: ["bravio", "bravia"],
        s: "Bravos, agitados.",
        p: "Bravio quer dizer bravo, agitado, selvagem. Os verdes mares bravios são um mar de ondas fortes." },
      { termo: "terra natal", outras: ["natal"],
        s: "A terra onde a pessoa nasceu.",
        p: "Terra natal é o lugar onde a pessoa nasceu. Para José de Alencar, é o Ceará." },
      { termo: "jandaia", outras: ["jandaias"],
        s: "Um pássaro parecido com um periquito.",
        p: "A jandaia é um pássaro parecido com um periquito, de penas coloridas, comum no Nordeste do Brasil." },
      { termo: "frondes", outras: ["fronde"],
        s: "As folhas do alto da árvore.",
        p: "Frondes são as folhas e os galhos do alto de uma árvore. A jandaia canta lá em cima, nas folhas da carnaúba." },
      { termo: "carnaúba", outras: ["carnauba", "carnaubas"],
        s: "Uma palmeira do Nordeste.",
        p: "A carnaúba é uma palmeira do Nordeste do Brasil, muito comum no Ceará.",
        x: "A carnaúba é a árvore símbolo do Ceará. Dela se aproveita quase tudo, das folhas à cera." },
      { termo: "líquida esmeralda", outras: ["esmeralda", "liquida"],
        s: "O mar verde e brilhante, como uma pedra preciosa.",
        p: "Esmeralda é uma pedra preciosa verde. Líquida esmeralda compara o mar verde e brilhante a uma esmeralda que virou água." },
      { termo: "perlongando", outras: ["perlongar"],
        s: "Passando ao longo.",
        p: "Perlongar quer dizer ir ao longo de, acompanhar a margem. O mar passa ao longo das praias." },
      { termo: "alvas", outras: ["alva", "alvo"],
        s: "Brancas.",
        p: "Alvo quer dizer branco. As alvas praias são as praias de areia branca." },
      { termo: "ensombradas", outras: ["ensombrada"],
        s: "Com sombra.",
        p: "Ensombrado é o que está na sombra. As praias têm a sombra dos coqueiros." },
      { termo: "serenai", outras: ["serenar"],
        s: "Acalmem-se.",
        p: "Serenai é um pedido: acalmem-se, fiquem serenos. O narrador pede que o mar se acalme." },
      { termo: "alisai", outras: ["alisar"],
        s: "Deixem liso.",
        p: "Alisai é um pedido: deixem liso. O narrador pede que o mar deixe as ondas mais lisas." },
      { termo: "vaga", outras: ["vagas"],
        s: "Onda.",
        p: "Vaga, aqui, quer dizer onda do mar." },
      { termo: "impetuosa", outras: ["impetuoso"],
        s: "Forte, agitada.",
        p: "Impetuoso é o que tem muita força e movimento. A vaga impetuosa é uma onda forte." },
      { termo: "resvale", outras: ["resvalar"],
        s: "Deslize.",
        p: "Resvalar quer dizer deslizar. O narrador quer que o barco deslize suave pela água." },
      { termo: "à flor das águas", outras: ["flor das aguas", "a flor"],
        s: "Por cima da água.",
        p: "À flor das águas quer dizer na superfície da água, por cima dela." }
    ],

    personagens: [
      { nome: "O narrador", chaves: ["narrador", "quem fala", "quem esta falando"],
        s: "É quem fala no começo. Ele conversa com o mar da terra onde nasceu.",
        p: "Quem fala no começo é o narrador. Ele conversa com o mar do Ceará, a terra onde nasceu, e pede que o mar se acalme." },
      { nome: "A jandaia", chaves: ["jandaia", "passaro", "ave"],
        s: "Um pássaro que canta nas palmeiras.",
        p: "A jandaia é um pássaro parecido com um periquito. No começo do livro, ela canta no alto das carnaúbas." },
      { nome: "O barco aventureiro", chaves: ["barco", "jangada"],
        s: "Um barco que está no mar.",
        p: "É um barco que está no mar. O narrador pede que as ondas se acalmem para ele passar. Logo depois deste trecho, o livro conta quem está nele." },
      { nome: "Iracema", chaves: ["iracema"],
        s: "É a personagem principal do livro. Ela ainda não aparece neste trecho.",
        p: "Iracema é a personagem principal do livro, uma jovem indígena da tribo tabajara. Ela ainda não aparece neste trecho." }
    ],

    semSpoiler: [
      { chaves: ["martim"], texto: "Martim é um personagem importante, mas ainda não aparece neste trecho. Para não estragar a sua leitura, eu falo dele quando ele aparecer." },
      { chaves: ["moacir"], texto: "Moacir aparece mais adiante no livro. Para não estragar a sua leitura, eu falo dele quando ele aparecer." },
      { chaves: ["final", "fim do livro", "como termina", "morre"], texto: "Isso só se descobre no fim do livro. Vamos ler juntos até lá." }
    ],

    duvidas: [
      { chaves: ["com quem"], s: "O narrador está falando com o mar.",
        p: "O narrador está falando com o mar do Ceará, como se o mar pudesse ouvir. Ele pede que o mar se acalme." },
      { chaves: ["quem escreveu"], s: "José de Alencar, em 1865.",
        p: "Iracema foi escrito por José de Alencar, escritor do Romantismo brasileiro nascido no Ceará, e publicado em 1865." },
      { chaves: ["autor"], s: "José de Alencar, em 1865.",
        p: "Iracema foi escrito por José de Alencar, escritor do Romantismo brasileiro nascido no Ceará, e publicado em 1865." },
      { chaves: ["onde", "passa"], s: "No litoral do Ceará.",
        p: "A história se passa no litoral do Ceará, no começo da colonização portuguesa." },
      { chaves: ["significa", "iracema"], s: "O nome Iracema quer dizer lábios de mel.",
        p: "O próprio José de Alencar explicou que Iracema quer dizer lábios de mel, em língua indígena.",
        x: "Muitos estudiosos também repararam que Iracema tem as mesmas letras de América, em outra ordem." },
      { chaves: ["o que", "pede"], s: "Ele pede que o mar se acalme.",
        p: "O narrador pede que o mar se acalme e deixe as ondas mais lisas, para que o barco passe tranquilo." }
    ],

    quiz: [
      { pergunta: "Com quem o narrador está falando?",
        opcoes: ["Com Iracema", "Com o mar", "Com um pássaro"], certa: 1,
        explica: "Ele fala com os verdes mares do Ceará, como se o mar pudesse ouvir." },
      { pergunta: "O que é a jandaia?",
        opcoes: ["Um pássaro", "Uma árvore", "Um barco"], certa: 0,
        explica: "A jandaia é um pássaro parecido com um periquito, que canta no alto das carnaúbas." },
      { pergunta: "O que o narrador pede ao mar?",
        opcoes: ["Que fique mais verde", "Que leve o barco embora", "Que se acalme para o barco passar"], certa: 2,
        explica: "Ele pede que o mar se acalme e alise as ondas, para o barco passar tranquilo." }
    ]
  }
};
