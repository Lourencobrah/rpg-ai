import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Injectable()
export class IaService {
    constructor(private readonly http: HttpService) { }

    async gerarNarrativa(playerData: any, inimigoData: any, acao: string): Promise<string> {
        const prompt = this.montarPrompt(playerData, inimigoData, acao);

        const res = await firstValueFrom(
            this.http.post(
                'https://openrouter.ai/api/v1/chat/completions',
                {
                    model: 'mistralai/mistral-7b-instruct:free',
                    messages: [
                        {
                            role: 'system',
                            content: 'Você é um mestre de RPG de fantasia. Narre os combates com emoção e intensidade, como se estivesse mestrando uma mesa de D&D'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ]
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
        );

        return res?.data.choices[0].message.content;
    }

    private montarPrompt(player: any, inimigo: any, acao: string): string {
        return `
O jogador de nome ${player.nome}, classe ${player.classe}, nível ${player.nivel}, com ${player.hp} de HP, decidiu realizar a ação: ${acao}.

Ele está enfrentando o inimigo ${inimigo.nome}, uma criatura do tipo ${inimigo.tipo}, de nível ${inimigo.nivel}, com ${inimigo.hp} de HP.

Descreva a cena de forma imersiva, narrando o que acontece com base nessa ação.
Se possível, finalize a narração com o impacto da ação.
    `.trim();
    }
}