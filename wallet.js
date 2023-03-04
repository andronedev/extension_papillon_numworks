// currently available cards is CarteJeune

class Wallet {
    constructor() {
        this.availableCards = [new CarteJeune];
        this.selectedCard = JSON.parse(localStorage.getItem("wallet_selectedCard"))

        this.storedCards = JSON.parse(localStorage.getItem("wallet_configuredCards"));
        this.configuredCards = [];

        // init cards
        if (this.storedCards != null) {
            for (let i = 0; i < this.storedCards.length; i++) {
                let card = this.storedCards[i];
                let cardClass = this.availableCards.find(c => c.constructor.name == card.type).constructor;

                if (cardClass != null) {
                    let newCard = new cardClass();
                    newCard.setCard(JSON.parse(card.card));
                    this.configuredCards.push(newCard);
                }
            }
        }
        if (this.selectedCard == null && this.configuredCards.length > 0) {
            this.selectedCard = this.configuredCards[0];
        }
    }

    getAvailableCards() {
        return this.availableCards == null ? [] : this.availableCards;
    }

    addNewCard(card) {
        // avoid undefined push
        if (this.configuredCards == null) {
            this.configuredCards = [];
        }
        // avoid duplicate
        if (this.configuredCards.find(c => c.constructor.name == card.constructor.name) != null) {
            return;
        }
        this.configuredCards.push({
            type: card.constructor.name,
            card: card.getCardAsJson()
        });
        this.save();
    }

    getSelectedCard() {
        return this.selectedCard == null ? null : this.selectedCard;
    }

    setSelectedCard(card) {
        this.selectedCard = card;
        this.save();
    }

    getConfiguredCards() {
        console.log("getConfiguredCards", this.configuredCards);
        return this.configuredCards == null ? [] : this.configuredCards;
    }

    getStoredCards() {
        return this.storedCards == null ? [] : this.storedCards;
    }

    save() {
        localStorage.setItem("wallet_selectedCard", JSON.stringify(this.selectedCard));
        localStorage.setItem("wallet_configuredCards", JSON.stringify(this.configuredCards));
    }

}
