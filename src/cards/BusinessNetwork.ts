
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectCard } from "../inputs/SelectCard";
import { SelectOption } from "../inputs/SelectOption";
import { IProjectCard } from "./IProjectCard";

export class BusinessNetwork implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = "Business Network";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Look at the top card and either buy it or discard it.";
    public text: string = "Decrease your mega credit production 1 step.";
    public description: string = "Investing in social events can open up new opportunities.";
    public play(player: Player, _game: Game): Promise<void> {
        player.megaCreditProduction--;
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            const dealtCard = game.dealer.getCards(1)[0];
            player.setWaitingFor(
                new OrOptions(
                    new SelectCard(this.name, "Buy card", [dealtCard], (_foundCards: Array<IProjectCard>) => {
                        if (player.megaCredits < 3) {
                            game.dealer.discard(dealtCard);
                            reject("Not enough mega credits to buy card");
                        } else {
                            player.megaCredits -= 3;
                            player.cardsInHand.push(dealtCard);
                            resolve();
                        }
                    }),
                    new SelectOption(this.name, "Discard", () => {
                        game.dealer.discard(dealtCard);
                        resolve();
                    })
                )
            );
        });
    }
}
