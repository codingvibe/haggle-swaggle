/*
  - Wacky flailing arm inflatable tube man
  - Mariachi
  - churros
*/

import { getResizeProportions, setButtonEnabled } from "./utils.js";

export const BOOTH_BOOSTS = {
  "wackyArmMan": {
    "textureName": "wackyArmMan",
    "description": "A wacky friend to draw the crowds",
    "addAttract": 0.02,
    "buyPrice": 20,
    "timeout": 30000
  },
  "mariachi": {
    "textureName": "mariachi",
    "description": "Who doesn't love a mariachi band?",
    "addAttract": 0.05,
    "buyPrice": 40,
    "timeout": 30000
  },
  "churros": {
    "textureName": "churros",
    "description": "Cinnamon + sugar + fry = heart eyes",
    "addAttract": 0.03,
    "buyPrice": 25,
    "timeout": 30000
  }
}

export function getBoothBoostBuyButton(player, boothBoostName, uiButtonTexture, iconTexture) {
  const boothBoost = BOOTH_BOOSTS[boothBoostName]
  const container = new PIXI.Container();
  const buttonBackground = new PIXI.Sprite(uiButtonTexture);
  const iconSprite = new PIXI.Sprite(iconTexture);
  const priceDisplay = getPriceDisplay(boothBoost.buyPrice);
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
  const description = new PIXI.Text(boothBoost.description , {fontFamily : 'Verdana', fontSize: 32, fill : 0xffc182, align : 'left', dropShadow: true, dropShadowDistance: 3, wordWrap: true, wordWrapWidth: buttonBackground.width*10});
  container.addChild(priceDisplay);
  container.addChild(buttonContainer);
  container.addChild(description);
  description.x = buttonBackground.width + 3;
  description.y = Math.floor(buttonContainer.height / 2);
  container.eventMode = "static";
  container.onclick = () => {
    if (player.money > BOOTH_BOOSTS[boothBoostName].buyPrice) {
      player.boostStock[boothBoostName] += 1;
      player.money -= BOOTH_BOOSTS[boothBoostName].buyPrice;
      if (player.money < BOOTH_BOOSTS[boothBoostName].buyPrice) {
        setButtonEnabled(container, false)
      }
    } else {
      console.log(`You broke, can't afford ${boothBoostName}`)
    }
  };
  container.ontouchstart = container.onclick;
  setButtonEnabled(container, player.money > BOOTH_BOOSTS[boothBoostName].buyPrice);
  container.shouldBeEnabled = (money) => {
    return money >= BOOTH_BOOSTS[boothBoostName].buyPrice;
  }
  return container;
}

export function getUseBoothBoostButton(player, boothBoostName, uiButtonTexture, iconTexture) {
  const container = new PIXI.Container();
  const buttonBackground = new PIXI.Sprite(uiButtonTexture);
  const iconSprite = new PIXI.Sprite(iconTexture);
  iconSprite.height = 192;
  iconSprite.width = 192/iconTexture.height * iconTexture.width
  buttonBackground.width = iconSprite.width * 1.1;
  buttonBackground.height = iconSprite.height * 1.1;
  iconSprite.x = Math.floor(iconSprite.width * 0.05)
  iconSprite.y = Math.floor(iconSprite.height * 0.05)
  const description = new PIXI.Text(` x ${player.boostStock[boothBoostName]}\n${BOOTH_BOOSTS[boothBoostName].description}` , {fontFamily : 'Verdana', fontSize: 32, fill : 0xffc182, align : 'left', dropShadow: true, dropShadowDistance: 3, wordWrap: true, wordWrapWidth: buttonBackground.width*10});
  container.addChild(buttonBackground);
  container.addChild(iconSprite);
  container.addChild(description);
  description.x = Math.floor(buttonBackground.width*1.2);
  description.y = 0;
  container.onclick = () => {
    if (player.boostStock[boothBoostName] && player.boostStock[boothBoostName] > 0) {
      player.boostStock[boothBoostName] -= 1;
      player.booth.addBooster(boothBoostName);
      description.text = ` x ${player.boostStock[boothBoostName]}\n${BOOTH_BOOSTS[boothBoostName].description}`;
    } else {
      console.log(`You have no ${boothBoostName} stock`)
    }
  };
  container.ontouchstart = container.onclick;
  container.eventMode = "static";
  return container;
}

function getPriceDisplay(price) {
  return new PIXI.Text(`\$${price}` , {fontFamily : 'Verdana', fontSize: 32, fill : 0x00ff00, align : 'left', dropShadow: true, dropShadowDistance: 3});
}