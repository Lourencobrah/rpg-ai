export class GameStatusDto {
    nome: string;
    classe: string;
    nivel: number;
    xp: number;
    hp: number;
    rodada: number;
    inimigo: {
        nome: string;
        hp: number;
        tipo: string;
        nivel: number;
    };
}