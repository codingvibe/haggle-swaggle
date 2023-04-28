import { BOOTH_BOOSTS } from "./boothBoosts.js";
import { BOOTH_UPGRADES } from "./boothUpgades.js";

export class Booth {
  constructor(baseAttractiveness, customerStandingArea, boothTexture, displayCaseTexture, playerTexture, boostTextures, upgradeTextures, isVillain = false) {
    this.attractiveness = baseAttractiveness;
    this.customerStandingArea = customerStandingArea
    this.upgrades = [];
    this.currentBoosters = [];
    this.upgradeTextures = upgradeTextures;
    this.boosterDisplayMap = {};
    this.upgradeDisplayMap = {};
    this.playerSprite = new PIXI.Sprite(playerTexture);
    this.boothSprite = new PIXI.Sprite(boothTexture);
    this.displayCaseSprite = new PIXI.Sprite(displayCaseTexture);
    if(boostTextures) {
      Object.keys(BOOTH_BOOSTS).forEach(boostName => {
        this.boosterDisplayMap[boostName] = getBoostDisplay(boostName, boostTextures[BOOTH_BOOSTS[boostName].textureName], this.boothSprite)
      });
    }
    if(upgradeTextures) {
      Object.keys(BOOTH_UPGRADES)
        .filter(upgradeName => upgradeName != "upgradedBooth" && upgradeName != "upgradedDisplayCase" && upgradeName != "upgradedProcessing")
        .forEach(upgradeName => {
          this.upgradeDisplayMap[upgradeName] = getUpgradeDisplay(upgradeName, upgradeTextures[BOOTH_UPGRADES[upgradeName].textureName], this.boothSprite)
        });
    }
    this.container = getBoothDisplay(this.boothSprite, this.displayCaseSprite, Object.values(this.upgradeDisplayMap), Object.values(this.boosterDisplayMap), this.playerSprite, isVillain);
  }

  addUpgrade(upgradeName) {
    this.upgrades.push(upgradeName);
    if (upgradeName == "upgradedBooth") {
      this.boothSprite.y += this.boothSprite.height - this.upgradeTextures["upgradedBooth"].height;
      this.boothSprite.texture = this.upgradeTextures["upgradedBooth"]
      this.boothSprite.height = this.boothSprite.texture.height;
    } else if (upgradeName == "upgradedDisplayCase") {
      this.displayCaseSprite.texture = this.upgradeTextures["upgradedDisplayCase"]
    } else {
      this.upgradeDisplayMap[upgradeName].visible = true;
    }
    this.attractiveness += BOOTH_UPGRADES[upgradeName].addAttract;
  }

  addBooster(boostName) {
    this.boosterDisplayMap[boostName].visible = true;
    this.attractiveness += BOOTH_BOOSTS[boostName].addAttract;
    if (boostName == 'mariachi') {
      PIXI.sound.play('mariachiTrumpet', { loop: true });
      PIXI.sound.volume('background', 0);
    }
    setTimeout(() => {
      PIXI.sound.stop('mariachiTrumpet');
      PIXI.sound.volume('background', 1);
      if (this.boosterDisplayMap[boostName].visible == true) {
        this.boosterDisplayMap[boostName].visible = false;
        this.attractiveness -= BOOTH_BOOSTS[boostName].addAttract;
      }
    }, BOOTH_BOOSTS[boostName].timeout);
  }

  clearAllBoosters() {
    Object.keys(this.boosterDisplayMap).forEach(boostName => {
      if (this.boosterDisplayMap[boostName].visible == true) {
        this.boosterDisplayMap[boostName].visible = false;
        this.attractiveness -= BOOTH_BOOSTS[boostName].addAttract;
      }
    });
  }
}

function getBoothDisplay(boothSprite, displayCase, upgrades, boosters, player, isVillain) {
  const container = new PIXI.Container();
  player.height = boothSprite.height * .6;
  player.width = ( player.height / player.texture.height ) * player.texture.width;
  player.x = boothSprite.width * 0.7 - player.width;
  player.y = boothSprite.height * 0.98 - player.height;
  boothSprite.zIndex = 15;
  displayCase.zIndex = 13;
  if (isVillain) {
    displayCase.x = 0
    player.zIndex = 12;
  } else {
    displayCase.x = boothSprite.width - displayCase.width;
    player.zIndex = 16;
  }
  displayCase.y = boothSprite.height - displayCase.height;
  boosters.forEach(booster => container.addChild(booster));
  upgrades.forEach(upgrade => container.addChild(upgrade));
  container.addChild(player);
  container.addChild(displayCase);
  container.addChild(boothSprite);
  container.width *= 4;
  container.height *= 4;
  return container;
}

function getBoostDisplay(boostName, boostTexture, boothSprite) {
  switch(boostName) {
    case "wackyArmMan":
      const wackySprite = new PIXI.Sprite(boostTexture);
      wackySprite.x = boothSprite.width / 2;
      wackySprite.y = boothSprite.height * 0.8 - wackySprite.height;
      wackySprite.zIndex = 10
      wackySprite.visible = false;
      return wackySprite;
    case "mariachi":
      const mariachiSprite = new PIXI.Sprite(boostTexture);
      mariachiSprite.x = boothSprite.width * 0.6;
      mariachiSprite.y = boothSprite.height * 0.8 - mariachiSprite.height;
      mariachiSprite.zIndex = 11
      mariachiSprite.visible = false;
      return mariachiSprite;
    case "churros":
      const churrosSprite = new PIXI.Sprite(boostTexture);
      churrosSprite.x = boothSprite.width * 0.1;
      churrosSprite.y = boothSprite.height - churrosSprite.height;
      churrosSprite.zIndex = 20;
      churrosSprite.visible = false;
      return churrosSprite;
    default:
      return null;
  }
}

function getUpgradeDisplay(upgradeName, upgradeTexture, boothSprite) {
  switch(upgradeName) {
    case "luckyCat":
      const luckyCatSprite = new PIXI.Sprite(upgradeTexture);
      luckyCatSprite.x = boothSprite.width * 0.4;
      luckyCatSprite.y = boothSprite.height - luckyCatSprite.height;
      luckyCatSprite.zIndex = 17;
      luckyCatSprite.visible = false;
      return luckyCatSprite;
    case "fruitWater":
      const fruitWaterSprite = new PIXI.Sprite(upgradeTexture);
      fruitWaterSprite.x = boothSprite.width * 0.75;
      fruitWaterSprite.y = boothSprite.height * 0.72 - fruitWaterSprite.height;
      fruitWaterSprite.zIndex = 14;
      fruitWaterSprite.visible = false;
      return fruitWaterSprite;
    default:
      return null;
  }
}