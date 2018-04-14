/**TODO
* FINISH KEYWORDS
* CHANGE CSS TO LOOK NICER
* FINISH INCOME IMPLEMENTATION
* FINISH TAX IMPLEMENTATION
* FIGURE OUT STATUS SYSTEM
* 	DETAIL LIST WITH STATUS EFFECTS LISTED
* BUILD ANNOUNCEMENT SYSTEM
* BUILD SHOP
* BUILD DAY/NIGHT CYCLE
* BUILD SIGN TRICKS
* BUILD EXPLORATION WITH RANDOM OUTCOMES
* BUILD WEATHER
* DETAIL TO SIGN
* 	DIFFERENT TYPES OF SIGNS
*	CROSS OUT PREVIOUS MESSAGES INSTEAD OF REMOVAL
*	INK COLORS
* BRAINSTORM
* PETTING ANIMALS?
* TWEAK LIKE EVERYTHING
* 
* FIGURE OUT SIGN RATING SYSTEM FOR OTHER PLAYERS???
*/

//CACHE DOM ELEMENTS
function cacheDOMElements(){
	moneyDispElement = document.getElementById("moneyDisp");
	timerDispElement = document.getElementById("timerDisp");
	gameTimeDispElement = document.getElementById("gameTimeDisp");
	
	storeNameElement = document.getElementById("storeName");
	signPrefixElement = document.getElementById("signPrefix");
	signMessageElement = document.getElementById("signMessage");
	signPopularityElement = document.getElementById("signPopularity");
	signActionButtonElement = document.getElementById("signActionButton");
	signChangeElement = document.getElementById("signChange");
	signChangeDispElement = document.getElementById("signChangeDisp");
	
	statusListElement = document.getElementById("statusList");
	
	taxesButtonElement = document.getElementById("taxesButton");
	taxesAmountElement = document.getElementById("taxesAmount");
	taxesPaidDispElement = document.getElementById("taxesPaidDisp");
	
	govtDivElement = document.getElementById("govtDiv");
	govtMoneyDispElement = document.getElementById("govtMoneyDisp");
	
	signInputElement = document.getElementById("signInput");
	signInputButtonElement = document.getElementById("signInputButton");
	inkDispElement = document.getElementById("inkDisp");
	inkCostElement = document.getElementById("inkCost");
}

//INITIALIZE DOM ELEMENTS
var moneyDispElement;
var timerDispElement;
var gameTimeDispElement;

var storeNameElement;
var signPrefixElement;
var signMessageElement;
var signPopularityElement;
var signActionButtonElement;
var signChangeElement;
var signChangeDispElement;

var statusListElement;

var taxesButtonElement;
var taxesAmountElement;
var taxesPaidDispElement;

var govtDivElement;
var govtMoneyDispElement;

var signInputElement;
var signInputButtonElement;
var inkDispElement;
var inkCostElement;

cacheDOMElements();

//INITIALIZE VARIABLES
var timerVal = 0;
var gameTimeTimer = 0;
var gameTime = 0;
var timerRealToScaleMin = 10;
var timerScaleHrToReal = 6;
var timerAMPM = "AM";

var moneyVal = 0;
var dispMoneyVal = 0;
var hourlyIncome = 0;
var baseIncome = 1000;
var popularityVal = 0;
var keywordPopularityMod = 0;

var signMessage = "";

var inkVal = 100;
var inkVis = "";
var inkAmount = 0;
var inkCost = 100;

var taxVal = 0;
var prevTaxAmount = 0;
var taxAmount = 100;
var govtAmount = 1000;
var govtFlag = 0;

var govtMoneyVal = 0;

var vowels = ["a","e","i","o","u"];

var storeNames = ["Bobby's","Jericho's","Ned's","Gregor's","Slippy Slim's","Jon's","Isaac's","Nate's","Wyatt's","Mary's","Sydney's","Suzanne's","Riley's","Banan's","Drake from Drake and Josh's","Josh from Drake and Josh's","Drake and Josh from Drake and Josh's","Jon from Garfield's","Sugar Daddy's","Bartholomew's","Lil' Pump's","Sheldon's","Shelley's","Helga's","Hel's","Satan's","Missy's","Matthew's","Dillon's","Emma's","Rosie's","Chris's","Tina's","Darth Vader's","Batman's","Bluth's"];
var storeItems = ["Sausage","Chair","Pizza","Wheel","Clothing","Tattoo","Tea","Lemon","Mint","Philosophy","Dog","Cat","Healthcare","Banana","Electronics","Marker","Internet","Money","Gaming","Death","Indoor Trampoline","Meat","Supply","Vehicle","Incarceration","Religion","Window and Door","Bath and Body","Everything","Sign","Water"];
var storeTitles = ["Store","Shoppe","Palace","Parlor","Empire","Land","Hut","Building","Company","Overlords","Corporation","Complex","Republic","Emporium","Provider","Station","Prison","Insurance","Morgue","Advertisement Company","Park","Place","Cult","Shack"];

var personPrefix = ["old","young","large","happy","rich","poor","depressed","deaf","blind","foreign"];
var personType = ["lady","dude","man","bro","girl","scientist","homeowner","woman","friend","relative","teacher","alien","superhero"];

var signKeywords1 = ["buy","sell","here"];
var signKeywords2 = ["best","value","quality"];
var signKeywords3 = ["purchase","deal","variety"];

//BUTTON HANDLING
function pressed(){
	statusListElement.innerHTML += "<li id='onFire'>On Fire!</li>";
}

function pressed2(){
	statusListElement.innerHTML += "<li id='notOnFire'>Not On Fire</li>";
}

function writeSign(){
	var inkCost = 0;
	signMessage = signInputElement.value;
	for(i = 0; i < signMessage.length; i++){
		if(signMessage.charAt(i) != " "){
			inkCost++;
		}
	}
	if(inkCost <= inkVal){
		if(signMessage == ""){
			signMessageElement.innerHTML = "Nothing.";
		} else {
			signMessageElement.innerHTML = signMessage;
			useInk(inkCost);
		}
	}
}

function signAction(){
	var money = Math.floor(Math.random() * popularityVal);// + Math.floor((Math.random() + 0.5) * (baseIncome / 2)) + 1;
	moneyVal += money;
	
	var particleWord = "A";
	var person = [];
	person = personGenerator();
	
	for(i = 0; i < vowels.length; i++){
		if(person[0].charAt(0) == vowels[i]){
			particleWord = "An";
		}
	}
	
	signChangeElement.innerHTML = particleWord + " " + person[0] + " " + person[1] + " gives you ";
	signChangeDispElement.innerHTML = changeMuncher(money, 2);
}

//UPDATE FUNCTIONS
function timerUpdate(){
	timerVal += 1;
	gameTimeTimer += 1;
	timerRound = Math.floor(timerVal);
}

function moneyUpdate(){
	hourlyIncome = divide(baseIncome, popularityVal);
	moneyVal += Math.round(hourlyIncome / 6);
}

function flagUpdate(){
	if(govtFlag == 0){
		govtDivElement.style.display="none";
	} else {
		govtDivElement.style.display="";
	}
}

function taxUpdate(){
	if(taxVal >= govtAmount){
		govtFlag = 1;
	}
	taxesAmountElement.innerHTML = numberMuncher(taxAmount, 2);
	taxesPaidDispElement.innerHTML = numberMuncher(taxVal, 2);
	taxAmount = Math.floor(hourlyIncome / 5);
}

function signUpdate(){
	var hit = false;
	
	keywordPopularityMod = 0;
	
	for(j = 0; j < signKeywords1.length; j++){
		var re = new RegExp(signKeywords1[j], "i");
		hit = false;
		hit = re.test(signMessage);
		
		if(hit == true){
			keywordPopularityMod += 5;
		}
	}
	
	popularityVal = keywordPopularityMod;
}

function dispUpdate(){
	moneyDispElement.innerHTML = numberMuncher(moneyVal, 2);
	timerDispElement.innerHTML = timerVal;
	gameTimeDispElement.innerHTML = timeFormat(gameTimeTimer);
	signPopularityElement.innerHTML = popularityVal;
	inkCostElement.innerHTML = numberMuncher(inkCost * inkAmount, 2);
	govtMoneyDispElement.innerHTML = numberMuncher(govtMoneyVal, 2);
	
	inkVis = "";
	for(i = 0; i < 10; i++){
		var x = inkVal - (i * 10)
		if(x > 9){
			inkVis += "█";
		} else if(x > 5){
			inkVis += "▓";
		} else if(x > 0){
			inkVis += "▒";
		} else if(x <= 0){
			inkVis += "░";
		}
	}
	inkDispElement.innerHTML = inkVis;
}

function useInk(amount){
	inkVal -= amount;
	inkAmount += amount;
}

function buyInk(amount){
	if(moneyVal >= amount * inkCost){
		inkVal = 100;
		moneyVal -= amount * inkCost;
		inkAmount = 0;
	}
}

function payTaxes(amount){
	if(moneyVal >= amount){
		moneyVal -= amount;
		taxVal += amount;
		govtMoneyVal += amount;
	} else {
		//ERROR MESSAGE
	}
}

function timeFormat(realTime){
	var remainder = realTime % timerScaleHrToReal;
	var minutes = remainder * timerRealToScaleMin;
	var hours = (realTime - remainder) / timerScaleHrToReal;
	
	if(hours > 12){
		gameTimeTimer -= 72;
		
		if(timerAMPM == "AM"){
			timerAMPM = "PM";
		} else {
			timerAMPM = "AM";
		}
	} else if(hours < 10){
		hours = "0" + hours;
	}
	
	if(minutes == 0){
		minutes = "00";
	}
	
	return(hours + ":" + minutes + " " + timerAMPM);
}

function numberMuncher(number, precision){
	var decimal = number % (Math.pow(10, precision));
	var integer = (number - decimal) / (Math.pow(10, precision));
	
	if(decimal < 10){
		decimal = "0" + decimal;
	}
	
	return(integer + "." + decimal);
}

function changeMuncher(number, precision){
	var decimal = number % (Math.pow(10, precision));
	var integer = (number - decimal) / (Math.pow(10, precision));
	
	var statement = "";
	
	if(integer <= 0){
		if(decimal == 1){
			statement = "a penny";
		}else if(decimal == 5){
			statement = "a nickel";
		}else if(decimal == 10){
			statement = "a dime";
		}else if(decimal == 25){
			statement = "a quarter";
		}else{
			if(decimal < 10){
			decimal = "0" + decimal;
			}
			statement = "$" + integer + "." + decimal;
		}
	}else if(decimal <= 0){
		if(integer == 1){
			statement = "a dollar bill";
		}else if(integer == 2){
			statement = "a two dollar bill";
		}else if(integer == 5){
			statement = "a five";
		}else if(integer == 10){
			statement = "a ten";
		}else if(integer == 20){
			statement = "a twenty";
		}else if(integer == 50){
			statement = "a fifty";
		}else{
			if(decimal < 10){
			decimal = "0" + decimal;
			}
			statement = "$" + integer + "." + decimal;
		}
	}
	
	return statement;
}

function personGenerator(){
	var prefix = Math.floor(Math.random() * personPrefix.length);
	var type = Math.floor(Math.random() * personType.length);
	
	return [personPrefix[prefix],personType[type]];
}

function divide(numerator, denominator){
	var value = 0;
	
	if(denominator != 0){
		value = numerator / denominator;
	}
	
	return value;
}

//INITIALIZATION
timerDispElement.innerHTML = timerVal;
moneyDispElement.innerHTML = numberMuncher(moneyVal, 2);

var fullStoreTitle = storeNames[Math.floor(Math.random() * storeNames.length)] + " " + storeItems[Math.floor(Math.random() * storeItems.length)] + " " + storeTitles[Math.floor(Math.random() * storeTitles.length)] + ".";
storeNameElement.innerHTML = fullStoreTitle;

//PARENT UPDATE FUNCTION (SLOW)
window.setInterval(function(){
	timerUpdate();
	moneyUpdate();
}, 1000);

//PARENT UPDATE FUNCTION(FAST)
window.setInterval(function(){
	taxUpdate();
	flagUpdate();
	dispUpdate();
	signUpdate();
}, 10);