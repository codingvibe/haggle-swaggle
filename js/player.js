import { Booth } from "./booth.js";
import { BOOTH_BOOSTS } from "./boothBoosts.js";
import { BOOTH_UPGRADES } from "./boothUpgades.js";

export class Player {
  constructor(
    baseMoney,
    haggleAbility,
    persuasionAbility,
    stock,
    boothAttractiveness,
    playerTexture,
    boothTextures,
    boostTextures,
    upgradeTextures,
    processingTime,
    screenWidth,
    screenHeight
  ) {
    this.money = baseMoney;
    this.haggleAbility = haggleAbility;
    this.persuasionAbility = persuasionAbility;
    this.stock = stock;
    const boothStandingArea = {
      "maxY": screenHeight - 100,
      "minY": screenHeight * 5/6,
      "maxX": screenWidth * 0.35,
      "minX": screenWidth * 0.3-100
    }
    this.booth = new Booth(boothAttractiveness, boothStandingArea, boothTextures['booth'], boothTextures['displayCase'], playerTexture, boostTextures, upgradeTextures);
    this.processingTime = processingTime;
    this.boostStock = {};
    Object.keys(BOOTH_BOOSTS).forEach(boostName => {
      this.boostStock[boostName] = 1
    });
  }

  addMoney(additionalMoney) {
    this.money += additionalMoney;
  }

  getHaggleOffer(inMoney, minPrice) {
    return (inMoney - minPrice) * ( 1 - this.haggleAbility) + minPrice;
  }

  applyPowerup(powerup) {
    switch (powerup.type) {
      case "TRANSACTION":
        this.transactionSpeed += powerup.delta;
        break;
      case "HAGGLE":
        this.haggleAbility += powerup.delta;
        break;
      case "PERSUASION":
        this.persuasionAbility += powerup.delta;
    }
  }

  addUpgrade(upgradeName) {
    if (upgradeName == 'upgradedProcessing') {
      this.processingTime = BOOTH_UPGRADES[upgradeName].processingTime;
      this.booth.upgrades.push(upgradeName);
    } else {
      this.booth.addUpgrade(upgradeName);
    }
  }
}