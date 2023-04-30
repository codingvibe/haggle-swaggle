import { getResizeProportions } from "./utils.js";

export const BOOTH_UPGRADES = {
  "luckyCat": {
    "textureName": "luckyCat",
    "description": "A shiny business omen",
    "addAttract": 0.05,
    "buyPrice": 200,
  },
  "fruitWater": {
    "textureName": "fruitWater",
    "description": "A nice pitcher of fruit water on a hot day.",
    "addAttract": 0.01,
    "buyPrice": 50
  },
  "upgradedDisplayCase": {
    "textureName": "upgradedDisplayCase",
    "description": "RADICAL",
    "addAttract": 0.02,
    "buyPrice": 75
  },
  "upgradedBooth": {
    "textureName": "upgradedBooth",
    "description": "A serious improvement for a serious business",
    "addAttract": 0.03,
    "buyPrice": 150
  },
  "upgradedProcessing": {
    "textureName": "upgradedProcessing",
    "description": "Process customers faster with this fast talkin' mod",
    "processingTime": 500,
    "buyPrice": 150
  }
}

export function getBoothUpgradeButton(player, boothUpgradeName, uiButtonTexture, iconTexture) {
  const boothUpgrade = BOOTH_UPGRADES[boothUpgradeName]
  const container = new PIXI.Container();
  const buttonBackground = new PIXI.Sprite(uiButtonTexture);
  const iconSprite = new PIXI.Sprite(iconTexture);
  const priceDisplay = getPriceDisplay(boothUpgrade.buyPrice);
  priceDisplay.x = 0;
  priceDisplay.y = 0;
  const buttonProportions = getResizeProportions(iconTexture.width, iconTexture.height, 110);
  const iconProportions = getResizeProportions(iconTexture.width, iconTexture.height, 100)
  buttonBackground.width = buttonProportions.width;
  buttonBackground.height = buttonProportions.height;
  iconSprite.width = iconProportions.width;
  iconSprite.height = iconProportions.height;
  iconSprite.x = Math.floor((buttonBackground.width - iconSprite.width)/2)
  iconSprite.y = Math.floor((buttonBackground.height - iconSprite.height)/2)
  const buttonContainer = new PIXI.Container();
  buttonContainer.addChild(buttonBackground);
  buttonContainer.addChild(iconSprite);
  buttonContainer.x = 0;
  buttonContainer.y = priceDisplay.height + 5;
  const description = new PIXI.Text(boothUpgrade.description , {fontFamily : 'Verdana', fontSize: 32, fill : 0xffc182, align : 'left', dropShadow: true, dropShadowDistance: 3, wordWrap: true, wordWrapWidth: buttonBackground.width*10});
  container.addChild(priceDisplay);
  container.addChild(buttonContainer);
  container.addChild(description);
  description.x = buttonBackground.width + 3;
  description.y = Math.floor(buttonContainer.height / 2);
  container.eventMode = "static";
  container.onclick = () => {
    if (player.money > BOOTH_UPGRADES[boothUpgradeName].buyPrice) {
      player.addUpgrade(boothUpgradeName);
      disableUpgrade(container)
      player.money -= BOOTH_UPGRADES[boothUpgradeName].buyPrice;
    } else {
      console.log(`You broke, can't afford ${boothUpgradeName}`)
    }
  };
  container.ontouchstart = container.onclick;
  if (player.booth.upgrades.includes(boothUpgradeName)) {
    disableUpgrade(container);
  }
  container.shouldBeEnabled = (money) => {
    return !player.booth.upgrades.includes(boothUpgradeName) && money >= BOOTH_UPGRADES[boothUpgradeName].buyPrice;
  }
  return container;
}

function disableUpgrade(container) {
  container.eventMode = "none";
  container.children.forEach(child => {
    if (child.children && child.children.length > 0) {
      child.children.forEach(innerChild => innerChild.tint = 0x222222);
    } else {
      child.tint = 0x222222
    }
  });
}

function getPriceDisplay(price) {
  return new PIXI.Text(`\$${price}` , {fontFamily : 'Verdana', fontSize: 32, fill : 0x00ff00, align : 'left', dropShadow: true, dropShadowDistance: 3});
}