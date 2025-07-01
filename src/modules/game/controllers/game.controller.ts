import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreatePlayerDto } from "../dto/create-player.dto";
import { AcaoRodadaDto } from "../dto/acao-rodada.dto";
import { GameService } from "../services/game.service";

@Controller('jogo')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Post('iniciar')
    criarJogador(@Body() dto: CreatePlayerDto){
        return this.gameService.criarJogador(dto);
    }

    @Post('rodada')
    async jogarRodada(@Body() dto: AcaoRodadaDto){
        return await this.gameService.executarRodada(dto);
    }

    @Get('status/:id')
    buscarStatus(@Param('id') playerId: string){
        return this.gameService.buscarStatus(playerId);
    }
}