/*
- Stock
  - tech X
    - 10x, 25x, 50x, 100x...
      - more stock = better discount
  - house goods X
  - weeb stuff X
  - clothes X
  - tools X
  - records X
*/

import { getResizeProportions, setButtonEnabled } from "./utils.js";

export const STOCK = {
  "Tech": {
    "textureName": "tech",
    "buyPrice": 10,
    "sellPrice": 20,
    "interest": 0.5,
    "description": "Electronics, stereophonics, all the onics"
  },
  "Home Goods": {
    "textureName": "homeGoods",
    "buyPrice": 2,
    "sellPrice": 5,
    "interest": 0.75,
    "description": "Want your house to look like a hotel?"
  },
  "Weeb Stuff": {
    "textureName": "weebStuff",
    "buyPrice": 5,
    "sellPrice": 15,
    "interest": 0.2,
    "description": "C'mon. ( ͡° ͜ʖ ͡°)"
  },
  "Clothes": {
    "textureName": "clothes",
    "buyPrice": 5,
    "sellPrice": 9,
    "interest": 0.8,
    "description": "Popular, fashionable, on everyone"
  },
  "Tools": {
    "textureName": "tools",
    "buyPrice": 8,
    "sellPrice": 15,
    "interest": 0.6,
    "description": "Hammer time"
  },
  "Records": {
    "textureName": "records",
    "buyPrice": 5,
    "sellPrice": 10,
    "interest": 0.4,
    "description": "Scratchy audio, just how I like it"
  },
}

export function getStockBuyButton(player, stockName, uiButtonTexture, iconTexture) {
  let stockIndex = -1
  for (let i = 0 ; i < player.stock.length; i++) {
    if (player.stock[i].name == stockName) {
      stockIndex = i;
    }
  }
  if (stockIndex == -1) {
    player.stock.push({
      "name": stockName,
      "inventory": 0
    })
    stockIndex = player.stock.length - 1;
  }
  const stock = STOCK[stockName]
  const container = new PIXI.Container();
  const buttonBackground = new PIXI.Sprite(uiButtonTexture);
  const iconSprite = new PIXI.Sprite(iconTexture);
  const buyPriceDisplay = getPriceDisplay(stock.buyPrice*5, true);
  const sellPriceDisplay = getPriceDisplay(stock.sellPrice*5, false);
  const description = getTextDisplay(`x5 ${stock.description}`);
  const stockDisplay = getTextDisplay(player.stock[stockIndex].inventory, 0xfcba03);
  const buttonProportions = getResizeProportions(iconTexture.width, iconTexture.height, 110);
  const iconProportions = getResizeProportions(iconTexture.width, iconTexture.height, 100);
  buttonBackground.width = buttonProportions.width;
  buttonBackground.height = buttonProportions.height;
  iconSprite.width = iconProportions.width;
  iconSprite.height = iconProportions.height;
  iconSprite.x = Math.floor((buttonBackground.width - iconSprite.width)/2)
  iconSprite.y = Math.floor((buttonBackground.height - iconSprite.height)/2)
  const buttonContainer = new PIXI.Container();
  buttonContainer.addChild(buttonBackground);
  buttonContainer.addChild(iconSprite);
  buyPriceDisplay.x = buttonContainer.width * 1.05;
  buyPriceDisplay.y = 0;
  sellPriceDisplay.x = buttonContainer.width * 1.05;
  sellPriceDisplay.y = buyPriceDisplay.height * 1.05;
  description.x = buttonContainer.width * 0.65;
  description.y = sellPriceDisplay.y + sellPriceDisplay.height * 1.05;
  buttonContainer.x = 0;
  buttonContainer.y = 0;
  stockDisplay.x = buttonContainer.width * 0.05
  stockDisplay.y = buttonContainer.height * 0.05
  container.addChild(buyPriceDisplay);
  container.addChild(sellPriceDisplay);
  container.addChild(buttonContainer);
  container.addChild(description);
  container.addChild(stockDisplay)
  container.eventMode = "static";
  container.onclick = () => {
    if (player.money > STOCK[stockName].buyPrice*5) {
      player.stock[stockIndex].inventory += 5;
      stockDisplay.text = player.stock[stockIndex].inventory;
      player.money -= STOCK[stockName].buyPrice*5;
      if (player.money < STOCK[stockName].buyPrice*5) {
        setButtonEnabled(container, false)
      }
    } else {
      console.log(`You broke, can't afford ${stockName}`)
    }
  };
  container.ontouchstart = container.onclick;
  setButtonEnabled(container, player.money > STOCK[stockName].buyPrice);
  container.shouldBeEnabled = (money) => {
    return money >= STOCK[stockName].buyPrice*5;
  }
  container.refresh = () => {
    stockDisplay.text = player.stock[stockIndex].inventory;
  }
  return container;
}

function getPriceDisplay(price, isBuyPrice) {
  const prepend = isBuyPrice ? "Costs " : "Sells for";
  return getTextDisplay(`${prepend} \$${price}`);
}

function getTextDisplay(text, color = 0x00ff00) { 
  return new PIXI.Text(text , {fontFamily : 'Verdana', fontSize: 32, fill : color, align : 'left', dropShadow: true, dropShadowDistance: 3});
}