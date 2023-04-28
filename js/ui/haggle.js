export default class HaggleScreen {
  constructor(screenHeight, screenWidth, backgroundTexture, confirmButtonTexture, haggleButtonTexture, rejectButtonTexture) {
    this.container = new PIXI.Container();
    this.background = new PIXI.Sprite(backgroundTexture);
    this.background.height = screenHeight;
    this.background.width = screenWidth;
    this.container.addChild(this.background);
    this.acceptButton = getUIButton("ACCEPT", confirmButtonTexture);
    this.acceptButton.x = Math.floor(this.background.width * .1);
    this.acceptButton.y = Math.floor(this.background.height * .8);
    this.haggleButton = getUIButton("HAGGLE", haggleButtonTexture);
    this.haggleButton.x = Math.floor(this.background.width * .45);
    this.haggleButton.y = Math.floor(this.background.height * .8);
    this.rejectButton = getUIButton("REJECT", rejectButtonTexture);
    this.rejectButton.x = Math.floor(this.background.width * .8);
    this.rejectButton.y = Math.floor(this.background.height * .8);
    this.stockIcon = new PIXI.Sprite();
    this.stockIcon.x = Math.floor(this.background.width * .1);
    this.stockIcon.y = Math.floor(this.background.height * .1);
    this.stockName = getStockDisplay("dummy");
    this.stockName.anchor.set(0.5);
    this.stockName.y = this.stockIcon.y + this.stockIcon.height + 10;
    this.stockName.x = this.stockIcon.x + Math.floor(this.stockIcon.width/2);
    this.playerPrice = getPlayerPriceDisplay(10);
    this.playerPrice.x = Math.floor(this.background.width * .5);
    this.playerPrice.y = Math.floor(this.background.height * .1);
    this.customerPrice = getCustomerPriceDisplay(5);
    this.customerPrice.x = Math.floor(this.background.width * .4);
    this.customerPrice.y = Math.floor(this.background.height * .45);
    this.waitingBar = new PIXI.Graphics();
    this.waitingBar.beginFill(0x00fff00);
    this.waitingBar.drawRect(
      this.background.width * 0.2,
      this.background.height * 0.7,
      this.background.width * 0.6,
      this.background.height * 0.05
    );
    this.container.addChild(this.haggleButton);
    this.container.addChild(this.acceptButton);
    this.container.addChild(this.rejectButton);
    this.container.addChild(this.stockIcon);
    this.container.addChild(this.playerPrice);
    this.container.addChild(this.customerPrice);
    this.container.addChild(this.stockName);
    this.container.addChild(this.waitingBar);
    this.container.eventMode = "passive";
    this.currentCustomerPrice = 0;
  }

  updateHaggle(stockTexture, stockName, playerPrice, customerPrice, timeToInteract) {
    this.currentCustomerPrice = customerPrice;
    this.currentPlayerPrice = playerPrice;
    this.stockIcon.texture = stockTexture;
    this.stockName.text = stockName;
    this.stockIcon.height = stockTexture.height * 2.5;
    this.stockIcon.width = stockTexture.width * 2.5;
    this.stockName.y = this.stockIcon.y + this.stockIcon.height + 30;
    this.stockName.x = this.stockIcon.x + Math.floor(this.stockIcon.width/2);
    this.customerPrice.text = `Customer's Offer: \$${customerPrice.toFixed(2)}`;
    this.playerPrice.text = `Original Price: \$${playerPrice.toFixed(2)}`;
    this.waitingBar.clear();
    this.waitingBar.beginFill(0x00fff00);
    this.waitingBar.drawRect(
      this.background.width * 0.2,
      this.background.height * 0.7,
      this.background.width * 0.6,
      this.background.height * 0.05
    );
    let loadingBar = 0;
    const timeout = setInterval(() => {
      if (loadingBar > timeToInteract) {
        clearInterval(timeout);
        return;
      }
      loadingBar += 50;
      this.waitingBar.clear();
      this.waitingBar.beginFill(0x00fff00);
      this.waitingBar.drawRect(
        this.background.width * 0.2,
        this.background.height * 0.7,
        Math.floor((this.background.width * 0.6) * (1-(loadingBar/timeToInteract))),
        this.background.height * 0.05
      )
    }, 50)
  }

  updateInteractions(onHaggle, onAccept, onReject) {
    this.haggleButton.onclick = onHaggle;
    this.acceptButton.onclick = onAccept;
    this.rejectButton.onclick = onReject;
  }

  setIsInteractive(interactive) {
    const eventMode = interactive ? "static" : "none";
    const tint = interactive ? 0xFFFFFF : 0x222222;
    this.haggleButton.eventMode = eventMode;
    this.haggleButton.children.forEach(child => child.tint = tint)
    this.acceptButton.eventMode = eventMode;
    this.acceptButton.children.forEach(child => child.tint = tint)
    this.rejectButton.eventMode = eventMode;
    this.rejectButton.children.forEach(child => child.tint = tint)
  }
} 

function getUIButton(text, uiButtonTexture) {
  const container = new PIXI.Container();
  const buttonBackground = new PIXI.Sprite(uiButtonTexture);
  buttonBackground.width = uiButtonTexture.width* 2.2;
  buttonBackground.height = uiButtonTexture.height*2.2;
  const nameTexture = new PIXI.Text(text , {fontFamily : 'Verdana', fontSize: 32, fill : 0xffc182, align : 'left', dropShadow: true, dropShadowDistance: 3, wordWrap: true, wordWrapWidth: buttonBackground.texture.width-2});
  container.addChild(buttonBackground);
  container.addChild(nameTexture);
  nameTexture.anchor.set(0.5);
  nameTexture.x = Math.floor(buttonBackground.texture.width*1.1);
  nameTexture.y = Math.floor(buttonBackground.texture.height*1.1);

  container.eventMode = "static";
  //container.interactive = true;
  return container;
}

function getCustomerPriceDisplay(price) {
  return new PIXI.Text(`Customer's Offer: \$${price.toFixed(2)}` , {fontFamily : 'Verdana', fontSize: 48, fill : 0x00ff00, align : 'left', dropShadow: true, dropShadowDistance: 3});
}

function getPlayerPriceDisplay(price) {
  return new PIXI.Text(`Original Price: \$${price.toFixed(2)}` , {fontFamily : 'Verdana', fontSize: 28, fill : 0x00ff00, align : 'left', dropShadow: true, dropShadowDistance: 3});
}

function getStockDisplay(stockName) {
  return new PIXI.Text(stockName, {fontFamily : 'Verdana', fontSize: 36, fill : 0x5b4c8f, align : 'left', dropShadow: true, dropShadowDistance: 3});
}