import { Customer } from "./customer.js";
import { Player } from "./player.js";
import { getVillainList } from "./villain.js";
import { STOCK, getStockBuyButton } from "./stock.js";
import HaggleScreen from "./ui/haggle.js";
import BuyScreen from "./ui/buyScreen.js";
import EndRound from "./ui/endRound.js";
import { BOOTH_BOOSTS, getBoothBoostBuyButton, getUseBoothBoostButton } from "./boothBoosts.js";
import { BOOTH_UPGRADES, getBoothUpgradeButton } from "./boothUpgades.js";
import { getMenuButton } from "./ui/menuButton.js";
import PowerupScreen from "./ui/usePowerupScreen.js";
import DialogueScreen, { DIALOGUES } from "./ui/dialogueScreen.js";

// TODOS:
// - Add more sounds
// - Add sound for villain making money
// - make villain booths
// - test

const stageWidth = 1920; //window.innerWidth
const stageHeight = 1080; //window.innerHeight

PIXI.Container.defaultSortableChildren = true;
PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST
const app = new PIXI.Application({
    resolution: 1, sharedTicker: true,
    height: stageHeight, width: stageWidth,
    backgroundAlpha: 0
});
document.getElementById("canvas").appendChild(app.view);
PIXI.sound.add('cashRegister', 'assets/sounds/cashRegister.wav');
PIXI.sound.add('background', 'assets/sounds/background.mp3');
PIXI.sound.add('garage', 'assets/sounds/garage.mp3');
PIXI.sound.add('villainMoney', 'assets/sounds/villainMoney.mp3');
PIXI.sound.add('mariachiTrumpet', 'assets/sounds/mariachiTrumpet.wav');
PIXI.sound.add('cool', 'assets/sounds/cool.wav');

PIXI.Assets.add('customer1', 'assets/customer1.png');
PIXI.Assets.add('customer1-back', 'assets/customer1-back.png');
PIXI.Assets.add('customer2', 'assets/customer2.png');
PIXI.Assets.add('customer2-back', 'assets/customer2-back.png');
PIXI.Assets.add('customer3', 'assets/customer3.png');
PIXI.Assets.add('customer3-back', 'assets/customer3-back.png');
PIXI.Assets.add('customer4', 'assets/customer4.png');
PIXI.Assets.add('customer4-back', 'assets/customer4-back.png');
PIXI.Assets.add('customer5', 'assets/customer5.png');
PIXI.Assets.add('customer5-back', 'assets/customer5-back.png');

PIXI.Assets.add('player', 'assets/player.png');

PIXI.Assets.add('villainDisplayCase', 'assets/villainDisplayCase.png');
PIXI.Assets.add('oldCouple', 'assets/villain1.png');
PIXI.Assets.add('hipster', 'assets/hipster.png');
PIXI.Assets.add('satan', 'assets/devil.png');
PIXI.Assets.add('oldCoupleBooth', 'assets/villainBooth1.png');
PIXI.Assets.add('hipsterBooth', 'assets/villainBooth2.png');
PIXI.Assets.add('satanBooth', 'assets/villainBooth3.png');

PIXI.Assets.add('generalPurposeButton', 'assets/generalPurposeButton.png');
PIXI.Assets.add('haggleButton', 'assets/hagglebutton.png');
PIXI.Assets.add('confirmButton', 'assets/confirmButton.png');
PIXI.Assets.add('rejectButton', 'assets/rejectButton.png');
PIXI.Assets.add('haggleBackground', 'assets/haggleBackground.png');
PIXI.Assets.add('background', 'assets/background.png');

PIXI.Assets.add('tools', 'assets/stock/tools.png');
PIXI.Assets.add('clothes', 'assets/stock/clothes.png');
PIXI.Assets.add('homeGoods', 'assets/stock/homeGoods.png');
PIXI.Assets.add('weebStuff', 'assets/stock/weebStuff.png');
PIXI.Assets.add('tech', 'assets/stock/tech.png');
PIXI.Assets.add('records', 'assets/stock/records.png');

PIXI.Assets.add('booth', 'assets/customerBooth.png');
PIXI.Assets.add('displayCase', 'assets/customerDisplayCase.png');
PIXI.Assets.add('luckyCat', 'assets/luckyCat.png');
PIXI.Assets.add('churros', 'assets/churros.png');
PIXI.Assets.add('mariachi', 'assets/mariachi.png');
PIXI.Assets.add('wackyArmMan', 'assets/wackyMan.png');
PIXI.Assets.add('fruitWater', 'assets/fruitWater.png');
PIXI.Assets.add('upgradedBooth', 'assets/coolerCustomerBooth.png');
PIXI.Assets.add('upgradedDisplayCase', 'assets/coolerDisplayCase.png');
PIXI.Assets.add('upgradedProcessing', 'assets/upgradedProcessing.png');

PIXI.Assets.add('garage', 'assets/garage.png');
PIXI.Assets.add('computer', 'assets/computer.png');
PIXI.Assets.add('bookshelf', 'assets/bookshelf.png');
PIXI.Assets.add('workbench', 'assets/boothBoostBuyButton.png');

PIXI.Assets.add('sunrise', 'assets/sunrise.png');

const backgroundTextures = await PIXI.Assets.load(['background', 'garage']);
const currentBackground = new PIXI.Sprite();
currentBackground.texture = backgroundTextures['background'];
app.stage.addChild(currentBackground);
currentBackground.height = stageHeight;
currentBackground.width = stageWidth;

const haggleTextures = await PIXI.Assets.load(['haggleButton', 'confirmButton', 'rejectButton', 'haggleBackground', 'generalPurposeButton']);
const haggleScreen = new HaggleScreen(.8 * stageHeight, .8 * stageWidth, haggleTextures['haggleBackground'], haggleTextures['confirmButton'], haggleTextures['haggleButton'], haggleTextures['rejectButton']);
haggleScreen.container.visible = false;
app.stage.addChild(haggleScreen.container);

const stockTextures = await PIXI.Assets.load(['tools','clothes','homeGoods','weebStuff','tech','records']);
const customerTextures = await PIXI.Assets.load(['customer1','customer1-back','customer2','customer2-back','customer3','customer3-back','customer4','customer4-back','customer5','customer5-back']);
const numDifferentCustomerTextures = 5;

const STARTING_CASH = 100; 
const STARTING_HAGGLE = 0.3;
const STARTING_PERSUASION = 0.2;
const STARTING_BOOTH_ATTRACTIVENESS = 0.05;
const STARTING_PROCESSING_TIME = 1250;
const STARTING_STOCK = [
  {
    "name": "Weeb Stuff",
    "inventory": 50
  },
  {
    "name": "Home Goods",
    "inventory": 50
  }
];

const villainTextures = await PIXI.Assets.load(['oldCouple', 'hipster', 'satan']);
const villainBoothTextures = await PIXI.Assets.load(['oldCoupleBooth', 'hipsterBooth', 'satanBooth']);
const villainDisplayCase = await PIXI.Assets.load('villainDisplayCase');
const VILLAIN_LIST = getVillainList(stageHeight, stageWidth, villainTextures, villainBoothTextures, villainDisplayCase, villainCustomerResolver)

let onUIScreen = false;
let paused = true;
let currentScene = "fleaMarket";
let currentMusic = "background";

const playerTexture = await PIXI.Assets.load('player');
const boothTextures = await PIXI.Assets.load(['booth', 'displayCase']);
const boostTextures = await PIXI.Assets.load(['wackyArmMan', 'churros', 'mariachi']);
const upgradeTextures = await PIXI.Assets.load(['luckyCat','fruitWater','upgradedBooth', 'upgradedDisplayCase', 'upgradedProcessing']);
const currentPlayer = new Player(STARTING_CASH, STARTING_HAGGLE, STARTING_PERSUASION, STARTING_STOCK, STARTING_BOOTH_ATTRACTIVENESS, playerTexture, boothTextures, boostTextures, upgradeTextures, STARTING_PROCESSING_TIME, stageWidth, stageHeight);
app.stage.addChild(currentPlayer.booth.container);
currentPlayer.booth.container.x = stageWidth*0.02;
currentPlayer.booth.container.y = stageHeight - currentPlayer.booth.container.height;
let currentVillainIndex = 0;
let villain = VILLAIN_LIST[currentVillainIndex];
villain.booth.container.x = stageWidth - villain.booth.container.width;
villain.booth.container.y = stageHeight - villain.booth.container.height;
app.stage.addChild(villain.booth.container);

const playerMoneyDisplay = getPriceDisplay(currentPlayer.money);
playerMoneyDisplay.x = stageWidth * 0.01;
playerMoneyDisplay.y = stageHeight * 0.01;
const villainMoneyDisplay = getPriceDisplay(villain.money);
villainMoneyDisplay.x = stageWidth * 0.95 - villainMoneyDisplay.width;
villainMoneyDisplay.y = stageHeight * 0.01;
app.stage.addChild(playerMoneyDisplay);
app.stage.addChild(villainMoneyDisplay);

const backgroundResize = {
  width: currentBackground.width/currentBackground.texture.width,
  height: currentBackground.height/currentBackground.texture.height
}
const garageTextures = await PIXI.Assets.load(['bookshelf', 'computer', 'workbench']);
const computerSprite = new PIXI.Sprite(garageTextures['computer']);
const computerSpriteLabel = getLabel("Stock");
computerSprite.width = backgroundResize.width * computerSprite.texture.width;
computerSprite.height = backgroundResize.height * computerSprite.texture.height;
const computer = new PIXI.Container();
computer.addChild(computerSprite);
computer.addChild(computerSpriteLabel);
computerSprite.y = computerSpriteLabel.height;
computer.x = stageWidth*0.05;
computer.y = stageHeight*0.55;

const bookshelfSprite = new PIXI.Sprite(garageTextures['bookshelf']);
const bookshelfSpriteLabel = getLabel("Shelf Improvement");
bookshelfSprite.width = backgroundResize.width * bookshelfSprite.texture.width;
bookshelfSprite.height = backgroundResize.height * bookshelfSprite.texture.height;
const bookshelf = new PIXI.Container();
bookshelf.addChild(bookshelfSprite);
bookshelf.addChild(bookshelfSpriteLabel);
bookshelfSprite.y = bookshelfSpriteLabel.height;
bookshelf.x = stageWidth*0.82;
bookshelf.y = stageHeight*0.25;

const workbenchSprite = new PIXI.Sprite(garageTextures['workbench']);
const workbenchSpriteLabel = getLabel("Trick Out Your Booth");
workbenchSprite.width = backgroundResize.width * workbenchSprite.texture.width;
workbenchSprite.height = backgroundResize.height * workbenchSprite.texture.height;
const workbench = new PIXI.Container();
workbench.addChild(workbenchSprite);
workbench.addChild(workbenchSpriteLabel)
workbenchSprite.y = workbenchSpriteLabel.height;
workbench.x = stageWidth*0.45;
workbench.y = stageHeight-workbenchSprite.height;

app.stage.addChild(computer);
app.stage.addChild(bookshelf);
app.stage.addChild(workbench);

const endScreen = new EndRound(.8 * stageHeight, .8 * stageWidth, haggleTextures['haggleBackground'], haggleTextures['confirmButton'], () => {}, haggleTextures['rejectButton'], () => {}, {"money":0,"customers":0}, {"money":0,"customers":0})
endScreen.container.visible = false;
endScreen.container.x = Math.floor((stageWidth - endScreen.container.width)/2)
endScreen.container.y = Math.floor((stageHeight - endScreen.container.height)/2)
app.stage.addChild(endScreen.container);

let dialogueIndex = 0;
const dialogueScreen = new DialogueScreen(.8 * stageHeight, .8 * stageWidth, haggleTextures['haggleBackground'], haggleTextures['confirmButton'], DIALOGUES[dialogueIndex], () => {
  paused = false;
  playBackgroundMusic(currentMusic);
  dialogueScreen.container.visible = false;
})
dialogueScreen.container.visible = true;
dialogueScreen.container.x = Math.floor((stageWidth - endScreen.container.width)/2)
dialogueScreen.container.y = Math.floor((stageHeight - endScreen.container.height)/2)
app.stage.addChild(dialogueScreen.container);

const buyScreen = new BuyScreen(currentPlayer, .8 * stageHeight, .8 * stageWidth, haggleTextures['haggleBackground']);
const boothBoostButtons = Object.keys(BOOTH_BOOSTS).map(boothBoostName => {
  return getBoothBoostBuyButton(currentPlayer, boothBoostName, haggleTextures['generalPurposeButton'], boostTextures[BOOTH_BOOSTS[boothBoostName].textureName])
});
const boothUpgradesButtons = Object.keys(BOOTH_UPGRADES).map(boothUpgradeName => {
  return getBoothUpgradeButton(currentPlayer, boothUpgradeName, haggleTextures['generalPurposeButton'], upgradeTextures[BOOTH_UPGRADES[boothUpgradeName].textureName])
});
const stockButtons = Object.keys(STOCK).map(stockName => {
  return getStockBuyButton(currentPlayer, stockName, haggleTextures['generalPurposeButton'], stockTextures[STOCK[stockName].textureName])
});
buyScreen.updateBuyButtons(boothBoostButtons);
buyScreen.container.visible = false;
buyScreen.container.x = Math.floor((stageWidth - buyScreen.container.width) / 2);
buyScreen.container.y = Math.floor((stageHeight - buyScreen.container.height) / 2);

app.stage.addChild(buyScreen.container);
computerSprite.eventMode = "static";
computerSprite.onclick = () => {
  buyScreen.updateBuyButtons(stockButtons);
  buyScreen.container.visible = true;
}
computerSprite.ontouchstart = computerSprite.onclick;

bookshelfSprite.eventMode = "static";
bookshelfSprite.onclick = () => {
  buyScreen.updateBuyButtons(boothUpgradesButtons);
  buyScreen.container.visible = true;
}
bookshelfSprite.ontouchstart = bookshelfSprite.onclick;

workbenchSprite.eventMode = "static";
workbenchSprite.onclick = () => {
  buyScreen.updateBuyButtons(boothBoostButtons);
  buyScreen.container.visible = true;
}
workbenchSprite.ontouchstart = workbenchSprite.onclick;

PIXI.Assets.add('nextDayMenu', 'assets/sunrise.png');
const nextDaySprite = await PIXI.Assets.load('nextDayMenu');
const nextDayButton = getMenuButton(haggleTextures['generalPurposeButton'], nextDaySprite, "NEXT", () =>{
  paused = false;
  app.stage.removeChild(villain.booth.container);
  currentVillainIndex++;
  villain = VILLAIN_LIST[currentVillainIndex];
  villain.booth.container.x = stageWidth - villain.booth.container.width;
  villain.booth.container.y = stageHeight - villain.booth.container.height;
  app.stage.addChild(villain.booth.container);
  playerMoneyDisplay.text = `\$${currentPlayer.money.toFixed(2)}`;
  villainMoneyDisplay.text = `\$${villain.money.toFixed(2)}`;
  setScene('fleaMarket');
  playBackgroundMusic(currentMusic);
  setRoundStartSnapshot();
});
nextDayButton.x = stageWidth * 0.75;
nextDayButton.y = stageHeight * 0.05;
nextDayButton.visible = false;
app.stage.addChild(nextDayButton);

const powerupScreen = new PowerupScreen(.8 * stageHeight, .8 * stageWidth, haggleTextures['haggleBackground'], [], () => {
  onUIScreen = false;
});
PIXI.Assets.add('boothBoostMenu', 'assets/megaphone.png');
const menuButtonIcons = await PIXI.Assets.load(['boothBoostMenu']);
const boothBoostMenuButton = getMenuButton(haggleTextures['generalPurposeButton'], menuButtonIcons['boothBoostMenu'], "BOOST", () =>{
  if (!onUIScreen) {
    onUIScreen = true;
    powerupScreen.container.visible = true;
  }
});

// TODO: update this to have an update function for player stock
const useBoothBoostButtons = Object.keys(BOOTH_BOOSTS).map(boothBoostName => {
  return getUseBoothBoostButton(currentPlayer, boothBoostName, haggleTextures['generalPurposeButton'], boostTextures[boothBoostName])
});
powerupScreen.updatePowerupButtons(useBoothBoostButtons);
powerupScreen.container.x = Math.floor((stageWidth - powerupScreen.container.width) / 2)
powerupScreen.container.y = Math.floor((stageHeight - powerupScreen.container.height) / 2)
powerupScreen.container.visible = false;
app.stage.addChild(powerupScreen.container);

boothBoostMenuButton.x = Math.floor(stageWidth * .3);
boothBoostMenuButton.y = Math.floor(stageHeight * .05);
boothBoostMenuButton.zIndex = 400;
app.stage.addChild(boothBoostMenuButton);

let currentCustomers = [];
let maxCustomers = 4;
let customerSpawnRate = 0.5;
let currentCustomerConfig = {
  "maxMoney": 60,
  "maxWait": 5000,
  "additionalMoney": 0,
  "additionalInfluencability": 0.2,
  "additionalHaggle": 0,
  "additionalHaggleTolerance": 0.5,
  "additionalWaitTolerance": 0.25
}
const customerSprites = [];
const customerIndicators = [];
const roundLength = 120;

for (let i = 0; i < maxCustomers; i++) {
  customerSprites.push(new PIXI.Sprite());
  customerIndicators.push(new PIXI.Graphics());
}
// TODO: set this to the height of the stage.
const customerSpawnBox = {
  "maxY": 1080,
  "minY": 1080 * 0.4
}

// Game Loop
let secondsPassed = 0;
let loopsDone = 0;
let villainCustomersProcessed = 0;
let playerCustomersProcessed = 0;

let roundStartSnapshot;
setRoundStartSnapshot();
setScene("fleaMarket");

const logicInterval = setInterval(() => {
  if (!paused) {
    const shouldSpawnCustomers = currentCustomers.length < maxCustomers && customerSprites.length > 0 && Math.random() < customerSpawnRate && loopsDone % 25 == 0
    if (shouldSpawnCustomers && currentScene == "fleaMarket") {
      const newCustomer = createNewCustomer(haggleScreen);
      newCustomer.sprite.y = newCustomer.moveDirection == "UP" ? customerSpawnBox.maxY : customerSpawnBox.minY
      newCustomer.sprite.x = getCustomerXSpawn();
      newCustomer.indicator.y = newCustomer.sprite.y - newCustomer.indicator.height;
      newCustomer.indicator.x = newCustomer.sprite.x + newCustomer.sprite.width/2;
      newCustomer.indicator.visible = false;
      app.stage.addChild(newCustomer.sprite);
      app.stage.addChild(newCustomer.indicator);
    }
    let customersToRemove = [];
    let customersToPlayer = [];
    let customersToVillain = [];
    for (let i = 0; i < currentCustomers.length; i++) {
      const customer = currentCustomers[i];
      // Do Booth Stuff.
      const stockAttractionToPlayer = Math.max(...currentPlayer.stock
        .filter(stock => stock.inventory > 0)
        .map(stock => customer.getPersuadability(stock.name)));
      const stockAttractionToVillain = Math.max(...villain.stock
        .filter(stock => stock.inventory > 0)
        .map(stock => customer.getPersuadability(stock.name)));

      const interestInPlayer = currentPlayer.booth.attractiveness + currentPlayer.persuasionAbility + stockAttractionToPlayer;
      const interestInVillain = villain.booth.attractiveness + villain.persuasionAbility + stockAttractionToVillain;

      if (interestInPlayer > interestInVillain && customer.isInfluenced(interestInPlayer)) {
        console.log("Customer interested in player!");
        customersToPlayer.push(i);
      } else if (interestInVillain > interestInPlayer && customer.isInfluenced(interestInVillain)) {
        console.log("Customer interested in villain!");
        customersToVillain.push(i);
      } else {
        customer.sprite.y += customer.moveSpeed * (customer.moveDirection == "UP" ? -1 : 1);
        resizeCustomer(customerSpawnBox.maxY, customerSpawnBox.minY, customer, 0.3);
        customer.sprite.zIndex = Math.floor(customer.sprite.y/10);
        if (customer.sprite.y > customerSpawnBox.maxY || customer.sprite.y < customerSpawnBox.minY) {
          console.log("Customer left without being served :(");
          customersToRemove.push(i);
        }
      }
    }

    for (let i = 0; i < currentCustomers.length; i++) {
      if (customersToRemove.includes(i)) {
        app.stage.removeChild(currentCustomers[i].sprite);
        app.stage.removeChild(currentCustomers[i].indicator);
        customerSprites.push(currentCustomers[i].sprite);
        customerIndicators.push(currentCustomers[i].indicator);
      } else if (customersToPlayer.includes(i)) {
        const currCustomer = currentCustomers[i];
        const timeout = new Date().getTime() + currCustomer.maxWaitTime;
        const customerRefreshInterval = setInterval(() => {
          const now = new Date().getTime()
          if (now > timeout) {
            if (!currCustomer.isHaggling) {
              app.stage.removeChild(currCustomer.sprite);
              app.stage.removeChild(currCustomer.indicator);
              customerSprites.push(currCustomer.sprite);
              customerIndicators.push(currCustomer.indicator);
            }
            clearInterval(customerRefreshInterval);
          }
          const trianglePercentage = Math.max(0, (timeout - now)/currCustomer.maxWaitTime);
          drawTriangle(currCustomer.indicator, currCustomer.sprite.width*0.25, currCustomer.sprite.width*0.25, trianglePercentage);
          currCustomer.indicator.x = currCustomer.sprite.x + currCustomer.sprite.width/2 - currCustomer.indicator.width/2;
        }, currCustomer.maxWaitTime/100);
        currCustomer.sprite.x = getNumberBetween(currentPlayer.booth.customerStandingArea.minX, currentPlayer.booth.customerStandingArea.maxX);
        currCustomer.sprite.y = getNumberBetween(currentPlayer.booth.customerStandingArea.minY, currentPlayer.booth.customerStandingArea.maxY);
        resizeCustomer(customerSpawnBox.maxY, customerSpawnBox.minY, currCustomer, 0.8);
        currCustomer.indicator.x = currCustomer.sprite.x + currCustomer.indicator.width/2;
        currCustomer.indicator.y = currCustomer.sprite.y - currCustomer.indicator.height;
        currCustomer.indicator.visible = true;
        currCustomer.isAtPlayerBooth = true;
      } else if (customersToVillain.includes(i)) {
        const currCustomer = currentCustomers[i];
        currCustomer.sprite.x = getNumberBetween(villain.booth.customerStandingArea.minX, villain.booth.customerStandingArea.maxX);
        currCustomer.sprite.y = getNumberBetween(villain.booth.customerStandingArea.minY, villain.booth.customerStandingArea.maxY);
        resizeCustomer(customerSpawnBox.maxY, customerSpawnBox.minY, currCustomer, 0.8);
        villain.addCustomerToQueue(currCustomer);
      }
    }

    currentCustomers = currentCustomers.filter((_, index) => !customersToRemove.includes(index) && !customersToPlayer.includes(index) && !customersToVillain.includes(index))
    customersToRemove = [];
    customersToPlayer = [];
    customersToVillain = [];

    loopsDone++;
    if (loopsDone == 50) {
      secondsPassed++;
      loopsDone = 0;
    }
    if (secondsPassed == roundLength) {
      paused = true;
      currentCustomers.forEach(customer => {
        if (customer.isHaggling) {
          app.stage.removeChild(customer.sprite)
          app.stage.removeChild(customer.indicator)
        }
      })
      haggleScreen.container.visible = false;
      const playerStats = {
        "money": currentPlayer.money,
        "startMoney": roundStartSnapshot.money,
        "customersServed": playerCustomersProcessed
      }
      const villainStats = {
        "money": villain.money,
        "startMoney": roundStartSnapshot.villainMoney,
        "customersServed": villainCustomersProcessed
      }
      const playerWon = (playerStats.money - playerStats.startMoney) > (villainStats.money - villainStats.startMoney)
      endScreen.updateEndScreen(playerWon, playerStats, villainStats, () => {
        // on continue
        endScreen.container.visible = false;
        dialogueIndex++;
        if (currentVillainIndex != VILLAIN_LIST.length-1) {
          dialogueScreen.updateDialogueBox(DIALOGUES[dialogueIndex], () => {
            dialogueScreen.container.visible = false;
            setScene("garage");
            playBackgroundMusic(currentMusic);
          });
        } else {
          dialogueScreen.updateDialogueBox(DIALOGUES[dialogueIndex], () => {
            PIXI.sound.play("cool");
          }, "COOL");
        }
        dialogueScreen.container.visible = true;
      }, () => {
        // on retry
        currentPlayer.money = roundStartSnapshot.money;
        currentPlayer.boostStock = {...roundStartSnapshot.boostStock};
        villain.money = roundStartSnapshot.villainMoney;
        playerMoneyDisplay.text = `\$${currentPlayer.money.toFixed(2)}`;
        villainMoneyDisplay.text = `\$${villain.money.toFixed(2)}`;
        const useBoothBoostButtons = Object.keys(BOOTH_BOOSTS).map(boothBoostName => {
          return getUseBoothBoostButton(currentPlayer, boothBoostName, haggleTextures['generalPurposeButton'], boostTextures[boothBoostName])
        });
        powerupScreen.updatePowerupButtons(useBoothBoostButtons);
        currentPlayer.booth.clearAllBoosters();
        paused = false;
        endScreen.container.visible = false;
      });
        endScreen.container.visible = true;
      secondsPassed = 0;
      loopsDone = 0;
      villainCustomersProcessed = 0;
      playerCustomersProcessed = 0;
    }
  }
}, 20)

function createNewCustomer(haggleScreen) {
  const newCustomerSprite = new PIXI.Sprite();
  const customerIndicator = new PIXI.Graphics();
  const newCustomer = new Customer(
    newCustomerSprite,
    customerIndicator,
    getCustomerInterestPercentages(),
    Math.max(1, Math.round(Object.keys(STOCK).length - 1 * Math.random())),
    currentCustomerConfig.maxMoney,
    currentCustomerConfig.maxWait,
    app.screen.height * 0.5,
    currentCustomerConfig.additionalMoney,
    currentCustomerConfig.additionalInfluencability,
    currentCustomerConfig.additionalHaggle,
    currentCustomerConfig.additionalHaggleTolerance,
    currentCustomerConfig.additionalWaitTolerance
  )
  const customerIndex = Math.floor(Math.random() * numDifferentCustomerTextures) + 1;
  const textureName = newCustomer.moveDirection == "UP" ? `customer${customerIndex}-back` : `customer${customerIndex}`
  newCustomer.sprite.texture = customerTextures[textureName];
  newCustomer.sprite.onclick = () => {
    if (!haggleScreen.container.visible && newCustomer.isAtPlayerBooth && !paused) {
      let stock;
      for (let i = 0; i < newCustomer.interests.length; i++) {
        const curStock = currentPlayer.stock.filter(inv => inv.name == newCustomer.interests[i].name && inv.inventory > 0)
        if (curStock && curStock.length > 0) {
          stock = curStock[0];
          break;
        }
      }
      if (!stock) {
        stock = currentPlayer.stock
                  .filter(inv => inv.inventory > 0)
                  .sort((a,b) => STOCK[a.name].sellPrice - STOCK[b.name].sellPrice)
                  .slice(-1)[0];
      }
      if (!stock) {
        app.stage.removeChild(newCustomer.sprite);
        app.stage.removeChild(newCustomer.indicator);
        return;
      }

      newCustomer.isHaggling = true;
      haggleScreen.container.visible = true;
      haggleScreen.setIsInteractive(false);
      setTimeout(() => {
        haggleScreen.setIsInteractive(true);
      }, currentPlayer.processingTime);

      haggleScreen.updateHaggle(
        stockTextures[STOCK[stock.name].textureName],
        stock.name,
        STOCK[stock.name].sellPrice,
        newCustomer.getHaggleOffer(STOCK[stock.name].sellPrice, STOCK[stock.name].sellPrice * 0.5),
        currentPlayer.processingTime,
      );
      haggleScreen.updateInteractions(
        () => {
          if (newCustomer.isFrustratedByHaggling()) {
            console.log("Customer is fed up with haggling. Dirty pool, old chap")
            app.stage.removeChild(newCustomer.sprite);
            app.stage.removeChild(newCustomer.indicator);
            haggleScreen.container.visible = false;
            newCustomer.isHaggling = false;
          } else {
            haggleScreen.setIsInteractive(false);
            setTimeout(() => {
              haggleScreen.setIsInteractive(true);
            }, currentPlayer.processingTime);
            // Commented this out because we don't want to confuse the player
            // with the haggle rebuttal.
            const newCustomerPrice = newCustomer.getHaggleOffer(haggleScreen.currentPlayerPrice, haggleScreen.currentCustomerPrice)
            haggleScreen.updateHaggle(stockTextures[STOCK[stock.name].textureName], stock.name, STOCK[stock.name].sellPrice, newCustomerPrice, currentPlayer.processingTime);
          }
        },
        () => {
          PIXI.sound.play('cashRegister');
          playerCustomersProcessed++;
          currentPlayer.addMoney(haggleScreen.currentCustomerPrice)
          playerMoneyDisplay.text = `\$${currentPlayer.money.toFixed(2)}`
          app.stage.removeChild(newCustomer.sprite);
          app.stage.removeChild(newCustomer.indicator);
          for (let i = 0; i < currentPlayer.stock.length; i++ ) {
            if (currentPlayer.stock[i].name == stock.name) {
              currentPlayer.stock[i].inventory -= 1;
            }
          }
          haggleScreen.container.visible = false;
          newCustomer.isHaggling = false;
        },
        () => {
          app.stage.removeChild(newCustomer.sprite);
          app.stage.removeChild(newCustomer.indicator);
          haggleScreen.container.visible = false;
          newCustomer.isHaggling = false;
        }
      )
      haggleScreen.container.x = stageWidth*.1;
      haggleScreen.container.y = stageHeight*.1;
      haggleScreen.container.zIndex = 500;
    }
  };
  newCustomer.sprite.ontouchstart = newCustomer.sprite.onclick;
  console.log("Spawned new customer!")
  currentCustomers.push(newCustomer);
  return newCustomer;
}

function resizeCustomer(maxY, minY, customer, minSizePercent) {
  const custSize = 1 - ((1 - minSizePercent) * (maxY - customer.sprite.y) / (maxY - minY));
  customer.sprite.height = customer.sprite.texture.height * custSize;
  customer.sprite.width = customer.sprite.texture.width * custSize;
}

function getCustomerInterestPercentages() {
  // TODO: Before each round, select interests that are more likely
  // to be higher percentage
  return Object.keys(STOCK).map(interestName => {
    return  {
      "name": interestName,
      "interestPercentage": Math.random()
    }
  })
}

function setRoundStartSnapshot() {
  roundStartSnapshot = {
    "money": currentPlayer.money,
    "boostStock": {...currentPlayer.boostStock},
    "villainMoney": villain.money
  }
}

function setScene(scene) {
  currentScene = scene;
  if (scene === 'garage') {
    PIXI.sound.stopAll();
    currentMusic = 'garage';
    currentCustomers.forEach(customer => customer.sprite.visible = false)
    currentBackground.texture = backgroundTextures['garage'];
    currentPlayer.booth.container.visible = false;
    villain.booth.container.visible = false;
    computer.visible = true;
    bookshelf.visible = true;
    workbench.visible = true;
    nextDayButton.visible = true;
    boothBoostMenuButton.visible = false;
    villainMoneyDisplay.visible = false;
    playerMoneyDisplay.visible = false;
  } else {
    PIXI.sound.stopAll();
    currentMusic = 'background';
    currentCustomers.forEach(customer => customer.sprite.visible = true)
    currentBackground.texture = backgroundTextures['background'];
    currentPlayer.booth.container.visible = true;
    villain.booth.container.visible = true;
    computer.visible = false;
    bookshelf.visible = false;
    workbench.visible = false;
    nextDayButton.visible = false;
    boothBoostMenuButton.visible = true;
    villainMoneyDisplay.visible = true;
    playerMoneyDisplay.visible = true;
  }
}

function getCustomerXSpawn() {
  const minX = stageWidth/2 - 100
  const maxX = stageWidth/2 + 100
  return getNumberBetween(minX, maxX)
}

function getNumberBetween(min, max) {
  return Math.floor(Math.random()*(max - min) + min)
}

function getPriceDisplay(price) {
  return new PIXI.Text(`\$${price.toFixed(2)}` , {fontFamily : 'Verdana', fontSize: 28, fill : 0x00ff00, align : 'left', dropShadow: true, dropShadowDistance: 3});
}

function getLabel(label) {
  return new PIXI.Text(label , {fontFamily : 'Verdana', fontSize: 28, fill : 0xffc182, align : 'left', dropShadow: true, dropShadowDistance: 3});
}

function playBackgroundMusic(trackAlias) {
  PIXI.sound.play(trackAlias, { loop: true, volume: 0.25 });
}

function drawTriangle(triangle, width, height, percentage) {
  const adjustedHeight = height * percentage;
  const adjustedWidth = width * percentage;
  const point = adjustedWidth/2;

  // draw triangle
  triangle.clear();
  triangle.beginFill(0xFF0000, 1);
  triangle.lineStyle(0, 0xFF0000, 1);
  triangle.moveTo(adjustedWidth, 0);
  triangle.lineTo(point, adjustedHeight); 
  triangle.lineTo(0, 0);
  triangle.lineTo(point, 0);
  triangle.endFill();
}

function villainCustomerResolver (result) {
  if (result.result == "SOLD") {
    villainCustomersProcessed++;
    PIXI.sound.play('villainMoney');
  }
  villainMoneyDisplay.text = `\$${villain.money.toFixed(2)}`
  console.log("Processed customer for villain!")
  console.log(result);
  app.stage.removeChild(result.customer.sprite);
  app.stage.removeChild(result.customer.indicator);
}

setInterval(() => {
  if (!paused && !villain.processingCustomer && villain.customerQueue.length > 0) {
    const processData = villain.customerQueue.shift();
    villain.processCustomer(processData.customer, processData.timeout);
  }
}, 500);