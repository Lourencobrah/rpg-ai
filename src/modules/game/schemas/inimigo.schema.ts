import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type InimigoDocument = Inimigo & Document;

@Schema()
export class Inimigo {
    @Prop()
    nome: string;

    @Prop()
    tipo: string;

    @Prop()
    nivel: number;

    @Prop()
    hp: number;

    @Prop()
    ataque: number;
}

export const InimigoSchema = SchemaFactory.createForClass(Inimigo);