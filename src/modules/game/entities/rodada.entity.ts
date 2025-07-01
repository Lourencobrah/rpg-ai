export class Player {
    id: string;
    acao: 'atacar' | 'defender' | 'fugir';
    resultadoDado: number;
    narrativaIA: string;
    danoJogador: number;
    danoInimigo: number;
    jogadorSobreviveu: boolean;
    inimigoDerrotado: boolean;
}