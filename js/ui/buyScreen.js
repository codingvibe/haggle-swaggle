import { setButtonEnabled } from "../utils.js";

export default class BuyScreen {
  constructor(player, screenHeight, screenWidth, backgroundTexture, buyButtons) {
    this.player = player;
    this.container = new PIXI.Container();
    this.background = new PIXI.Sprite(backgroundTexture);
    this.background.height = screenHeight;
    this.background.width = screenWidth;
    this.container.addChild(this.background);
    this.boothBoostButtons = [];
    this.moneyDisplay = getPriceDisplay(player.money);
    this.moneyDisplay.y = screenHeight * 0.02;
    this.moneyDisplay.x = screenWidth * 0.75;
    this.container.addChild(this.moneyDisplay);
    this.buyButtons = buyButtons || [];
    displayBuyButtons(this.container, this.buyButtons, this.moneyDisplay, this.player);
    const parentContainer = this.container;
    this.closeButton = new PIXI.Text("X", {fontFamily : 'Verdana', fontSize: 28, fill : 0xFF0000, align : 'left', dropShadow: true, dropShadowDistance: 3});
    this.closeButton.eventMode = "static";
    this.closeButton.onclick = () => {
      parentContainer.visible = false;
    }
    this.closeButton.y = screenHeight * 0.02;
    this.closeButton.x = screenWidth * 0.95;
    this.container.addChild(this.closeButton);
    this.container.eventMode = "passive";
    this.container.zIndex = 5000;
  }

  updateBuyButtons(newBuyButtons) {
    this.buyButtons.forEach(buyButton => this.container.removeChild(buyButton));
    this.buyButtons = newBuyButtons;
    displayBuyButtons(this.container, this.buyButtons, this.moneyDisplay, this.player)
  }

  refreshStock() {
    displayBuyButtons(this.container, this.buyButtons, this.moneyDisplay, this.player)
  }
}

function displayBuyButtons(container, buyButtons, moneyDisplay, player) {
  if (!buyButtons || buyButtons.length == 0 ){
    return;
  }
  moneyDisplay.text = `\$${player.money.toFixed(2)}`
  let curX = container.width*0.02;
  let curButtonY = Math.floor((moneyDisplay.y + moneyDisplay.height)*1.02);
  let curHighestButtonHeight = 0;
  buyButtons.forEach(buyButton => { 
    if (buyButton.width > (container.width - curX)) {
      curX = container.width*0.02;
      curButtonY += curHighestButtonHeight*1.15;
      curHighestButtonHeight = 0;
    }
    buyButton.x = curX;
    curX += buyButton.width * 1.1;
    curHighestButtonHeight = Math.max(curHighestButtonHeight, buyButton.height);
    buyButton.y = curButtonY;
    const buttonFunction = buyButton.onclick;
    buyButton.onclick = () => {
      buttonFunction();
      setButtonsEnabled(buyButtons, player.money);
      moneyDisplay.text = `\$${player.money.toFixed(2)}`
    }
    if (buyButton.refresh) {
      buyButton.refresh();
    }
    container.addChild(buyButton);
  });
  setButtonsEnabled(buyButtons, player.money);
}

function setButtonsEnabled(buyButtons, money) {
  buyButtons.forEach(buyButton => {
    const enabled = !buyButton.shouldBeEnabled || buyButton.shouldBeEnabled(money)
    setButtonEnabled(buyButton, enabled);
  });
}

function getPriceDisplay(price) {
  return new PIXI.Text(`\$${price}` , {fontFamily : 'Verdana', fontSize: 32, fill : 0x00ff00, align : 'left', dropShadow: true, dropShadowDistance: 3});
}