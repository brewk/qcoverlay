// settings

var playerName = "";   //your name in Quake Champions
var channel = "#";       // #yourtwitchchannel (with # infront)
var botname ="";         // chat bot's name (you can also just use your twitch account, it doesn't matter)
var todayOnly = true;           //set to false if you want total instead of today
var compareTime = 60;            //number of seconds to display another player's stats
var oath ="oauth:";  //read instructions below

// get the oath from here: https://twitchapps.com/tmi/  (use your bot's account to sign in if you're using one)
// it'll be long and crazy looking and start with oath: (which you MUST include)
// it's basically a secret password so don't go showing it to people or else you're a ding dong



//--- don't touch anything below this unless you're a wizard --------
// ...but if you are a wizard, that's cool. can we hang out sometime?


var dingus = 0; //bool to use to see if we are have an "enemy" stat on the screen

var wait = 0; //antispam bool

var butts = function (divName, playerName){

	console.log("Doing the do");

	const app = document.getElementById('root');



	var requestURL = "https://stats.quake.com/api/v2/Player/GamesSummary?name=" + encodeURI(playerName);
	console.log(requestURL);

	var request = new XMLHttpRequest();

	request.open('GET', requestURL, true);

	request.onload =  function () {

		var today = new Date();
		var todayMonth = today.getMonth();
		var todayDay = today.getDate();

		var weaponCount = { "GAUNTLET": 0,
			"LAGBOLT": 0,
			"LIGHTNING_GUN": 0,
			"MACHINEGUN": 0,
			"MACHINEGUN_GRADE1": 0,
			"NAILGUN": 0,
			"NAILGUN_GRADE1": 0,
			"RAILGUN": 0,
			"ROCKET_LAUNCHER": 0,
			"SHOTGUN": 0,
			"SHOTGUN_GRADE1": 0
		};

		var weaponArray = { "GAUNTLET": 0,
			"LAGBOLT": 0,
			"LIGHTNING_GUN": 0,
			"MACHINEGUN": 0,
			"MACHINEGUN_GRADE1": 0,
			"NAILGUN": 0,
			"NAILGUN_GRADE1": 0,
			"RAILGUN": 0,
			"ROCKET_LAUNCHER": 0,
			"SHOTGUN": 0,
			"SHOTGUN_GRADE1": 0
		};

		// lets fondle some JSON


		var data = JSON.parse(this.response);

		if (request.status >= 200 && request.status < 400 && data.matches)
		{

			for(var i=0; i<data.matches.length; i++)
			{
				var matchDate = new Date(data.matches[i].time);
				var matchMonth = matchDate.getMonth();
				var matchDay = matchDate.getDate();


				if(matchMonth==todayMonth && matchDay == todayDay || divName == "enemyDiv" || todayOnly===false)
				{
					for (var k in data.matches[i].weaponAccuracy)
					{
						var accuracy = data.matches[i].weaponAccuracy[k];
						if(accuracy > 0)
						{
							weaponArray[k] += accuracy;
							weaponCount[k] = weaponCount[k]+1;
						}
					}

				}
			}
			const butts = document.createElement('div');
			butts.setAttribute('class', divName);

			if(divName == "enemyDiv")
			{
				if(dingus == 1)
				{
					$('.enemyDiv').remove();
				}
				const h1 = document.createElement('h1');
				h1.textContent = playerName;
				butts.appendChild(h1);
				h1.setAttribute('class', 'enemy');
				dingus = 1;
			}
			else
			{
				$('.playerDiv').remove();
			}

			for (var i in weaponArray)
			{
				const h1 = document.createElement('h1');
				if(weaponArray[i]==0)
				{
					h1.textContent = "-";
				}
				else
				{
					h1.textContent = (weaponArray[i]/weaponCount[i]).toFixed(0) + "%";
				}
				app.appendChild(butts);
				butts.appendChild(h1);
				h1.setAttribute('id', i)
			}
		}

		else 
		{
			console.log('you broke it');
		}
	}

	if(request.status < 400)
	{
		request.send();
	}

}





//boilerplate twitch chat bot stuff
var chatClient = function chatClient(){
  this.username = botname;
  this.password = oath;
  this.channel = channel;
  
  this.server = 'irc-ws.chat.twitch.tv';
  this.port = 443;
}
chatClient.prototype.open = function open(){
  this.webSocket = new WebSocket('wss://' + this.server + ':' + this.port + '/', 'irc');
  
  this.webSocket.onmessage = this.onMessage.bind(this);
  this.webSocket.onerror = this.onError.bind(this);
  this.webSocket.onclose = this.onClose.bind(this);
  this.webSocket.onopen = this.onOpen.bind(this);
};
chatClient.prototype.onError = function onError(message){
  console.log('Error: ' + message);
};

chatClient.prototype.onMessage = function onMessage(message){
 
	if(message !== null)
	{
	    var parsed = this.parseMessage(message.data);
	    spawner = parsed.username;
	    
	    if(parsed !== null)
	    {
	    	if(parsed.command === "PRIVMSG") 
	    	{

		        var firstWord = parsed.message.replace(/ .*/,'',);
		        firstWord = firstWord.trim();
		        firstWord = firstWord.toLowerCase();





		        if(firstWord == "!stats" || firstWord == "!compare"  || firstWord == "!yousuck"  || firstWord == "!thisiswhyyourebad")
		        {
		        	var name = parsed.message.split(' ');
		        }

		        var stuff = parsed.message.replace(firstWord,'');
		        stuff = stuff.trim();

		        if(stuff.length < 4)
		        {
		        	stuff = stuff + " ";
		        }
		        console.log('looking up ' + stuff);


		        if(stuff != "" && !wait) 
		        {
		        	butts("enemyDiv", stuff);
		        	setTimeout(function () {$('.enemyDiv').remove(); dingus = 0; }, compareTime*1000);
		        	setTimeout(function () { wait  = 0; }, 10000); //reset antispam
		        }

		        wait = 1;
		    }



		}
	}
}


chatClient.prototype.onOpen = function onOpen(){
  var socket = this.webSocket;
  
  if (socket !== null && socket.readyState === 1) {
    console.log('Connecting and authenticating...');
    
    socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
    socket.send('PASS ' + this.password);
    socket.send('NICK ' + this.username);
    socket.send('JOIN ' + this.channel);
  }
};

chatClient.prototype.onClose = function onClose(){
  console.log('Disconnected from the chat server.');
};

chatClient.prototype.close = function close(){
  if(this.webSocket){
    this.webSocket.close();
  }
};

chatClient.prototype.parseMessage = function parseMessage(rawMessage) {
  var parsedMessage = {
    message: null,
    tags: null,
    command: null,
    original: rawMessage,
    channel: null,
    username: null
  };
  
  if(rawMessage[0] === '@'){
    var tagIndex = rawMessage.indexOf(' '),
    userIndex = rawMessage.indexOf(' ', tagIndex + 1),
    commandIndex = rawMessage.indexOf(' ', userIndex + 1),
    channelIndex = rawMessage.indexOf(' ', commandIndex + 1),
    messageIndex = rawMessage.indexOf(':', channelIndex + 1);
    
    parsedMessage.tags = rawMessage.slice(0, tagIndex);
    parsedMessage.username = rawMessage.slice(tagIndex + 2, rawMessage.indexOf('!'));
    parsedMessage.command = rawMessage.slice(userIndex + 1, commandIndex);
    parsedMessage.channel = rawMessage.slice(commandIndex + 1, channelIndex);
    parsedMessage.message = rawMessage.slice(messageIndex + 1);
    } else if(rawMessage.startsWith("PING")) {
    parsedMessage.command = "PING";
    parsedMessage.message = rawMessage.split(":")[1];
  }
  
  return parsedMessage;
}




setInterval(butts("playerDiv", playerName), 30000);  //auto refresh stat every 5 minutes
