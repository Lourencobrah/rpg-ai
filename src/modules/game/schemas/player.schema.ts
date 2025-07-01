import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type PlayerDocument = Player & Document;

@Schema()
export class Player {
    @Prop({ required: true })
    nome: string;

    @Prop({ required: true })
    classe: string;

    @Prop({ default: 1 })
    nivel: number;

    @Prop({ default: 0 })
    xp: number;

    @Prop({ default: 100 })
    hp: number;

    @Prop({ default: true })
    vivo: boolean;

    @Prop({ default: 1 })
    rodadaAtual: number
}

export const PlayerSchema = SchemaFactory.createForClass(Player);