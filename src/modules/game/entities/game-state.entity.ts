import { Inimigo } from "./inimigo.entity";
import { Player } from "./player.entity";

export class GameState {
    player: Player;
    inimigoAtual: Inimigo;
    rodada: number;
}