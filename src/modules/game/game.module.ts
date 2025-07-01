import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Player, PlayerSchema } from "./schemas/player.schema";
import { Inimigo, InimigoSchema } from "./schemas/inimigo.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Player.name, schema: PlayerSchema },
            { name: Inimigo.name, schema: InimigoSchema }
        ])
    ]
})

export class GameModule {}