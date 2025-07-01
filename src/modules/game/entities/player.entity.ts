export class Player {
    id: string;
    nome: string;
    classe: 'guerreiro' | 'mago' | 'ladino';
    hp: number;
    nivel: number;
    xp: number;
    vivo: boolean;
    rodadaAtual: number;
}