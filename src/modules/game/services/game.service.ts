import { Injectable } from "@nestjs/common";
import { IaService } from "./ia.service";
import { CreatePlayerDto } from "../dto/create-player.dto";
import { AcaoRodadaDto } from "../dto/acao-rodada.dto";
import { ResultadoRodadaDto } from "../dto/resultado-rodada.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Player, PlayerDocument } from "../schemas/player.schema";
import { Inimigo, InimigoDocument } from "../schemas/inimigo.schema";

@Injectable()
export class GameService {
    constructor(
        private readonly iaService: IaService,
        @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
        @InjectModel(Inimigo.name) private inimigoModel: Model<InimigoDocument>,
    ) { }

    async criarJogador(dto: CreatePlayerDto) {
        const player = new this.playerModel({
            nome: dto.nome,
            classe: dto.classe
        });

        const inimigo = new this.inimigoModel({
            ...this.gerarInimigo(player.nivel),
            playerId: player.id
        });

        await player.save();
        await inimigo.save();

        return { player, inimigo };
    }

    async buscarStatus(playerId: string) {
        const player = await this.playerModel.findById(playerId);
        const inimigo = await this.inimigoModel.findOne({ playerId }).sort({ _id: -1 })

        if(!player || !inimigo) throw new Error('Dados não encontrados');

        return { 
            ...player?.toObject,
            inimigo: inimigo.toObject()
        }
    }

    async executarRodada(dto: AcaoRodadaDto): Promise<ResultadoRodadaDto> {
        const player = await this.playerModel.findById(dto.playerId);
        if (!player) throw new Error('Jogador não encontrado');

        let inimigo = await this.inimigoModel.findOne({ playerId: player.id }).sort({ _id: -1 });

        if (!inimigo) {
            inimigo = new this.inimigoModel({
                ...this.gerarInimigo(player.nivel),
                playerId: player.id,
            });
            await inimigo.save();
        }

        const acao = dto.acao;
        const dado = this.rolarDado(20);
        let danoJogador = 0;
        let danoInimigo = 0;

        switch (acao) {
            case 'atacar':
                danoJogador = dado + player.nivel * 2;
                inimigo.hp -= danoJogador;
                break;

            case 'defender':
                danoJogador = 0;
                break;

            case 'fugir':
                if (dado >= 15) {
                    inimigo = new this.inimigoModel({
                        ...this.gerarInimigo(player.nivel),
                        playerId: player.id,
                    });
                    await inimigo.save();

                    return {
                        narrativa: 'Você fugiu com sucesso e encontrou um novo inimigo!',
                        hpJogador: player.hp,
                        hpInimigo: inimigo.hp,
                        danoCausado: 0,
                        danoRecebido: 0,
                        inimigoDerrotado: false,
                        jogadorDerrotado: false,
                        rodadaAtual: ++player.rodadaAtual,
                    };
                }

                danoInimigo = this.rolarDado(8);
                player.hp -= danoInimigo;
                break;
        }

        if (inimigo.hp > 0 && acao !== 'fugir') {
            danoInimigo = this.rolarDado(10);
            player.hp -= danoInimigo;
        }

        const jogadorDerrotado = player.hp <= 0;
        const inimigoDerrotado = inimigo.hp <= 0;

        if (jogadorDerrotado) {
            player.hp = 0;
            player.vivo = false;
        }

        if (inimigoDerrotado) {
            player.xp += 10;
            if (player.xp >= 50) {
                player.nivel += 1;
                player.xp = 0;
            }
            player.rodadaAtual++;

            inimigo = new this.inimigoModel({
                ...this.gerarInimigo(player.nivel),
                playerId: player.id,
            });
            await inimigo.save();
        }

        await player.save();
        await inimigo.save();

        const narrativa = await this.iaService.gerarNarrativa(player, inimigo, acao);

        return {
            narrativa,
            hpJogador: player.hp,
            hpInimigo: inimigo.hp,
            danoCausado: danoJogador,
            danoRecebido: danoInimigo,
            inimigoDerrotado,
            jogadorDerrotado,
            rodadaAtual: player.rodadaAtual,
        };
    }

    private rolarDado(lados: number): number {
        return Math.floor(Math.random() * lados) + 1;
    }

    private gerarInimigo(nivelJogador: number) {
        const nomes = ['Goblin', 'Lobo Sombrio', 'Bandido', 'Espectro'];
        const tipos = ['monstro', 'fera', 'bandido', 'místico'];

        return {
            nome: nomes[Math.floor(Math.random() * nomes.length)],
            tipo: tipos[Math.floor(Math.random() * tipos.length)],
            hp: 50 + Math.floor(Math.random() * 30),
            ataque: 5 + nivelJogador * 2,
            nivel: nivelJogador
        };
    }
} 