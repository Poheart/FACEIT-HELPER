// TODO: Auto server veto
// TODO: Flags on lobby
//

var $scope = angular.element(document).scope();

if($scope) {
	if(localStorage.bPremium == "true") {
		$scope.$on('USER_LOGGED_IN', function() {
		    $scope.$root.currentUser.membership.type = "premium";
		    $scope.$root.currentUser.membership.status = "active";
		});
	}
} else {
	angular.reloadWithDebugInfo();
}

/**********************************************************************/
var debug = {
	log: function(msg) {
		if(helper.userSettings.bDebugMode) {
			console.log('%c [DEBUG]' + msg, 'background: #222; color: #bada55');
		}
	}
}
var globalState = {
	match: {currentState: "", lastState: ""},
	user: {currentState: "", lastState: "", region: ""},
	set: {
		match: function(currentState, lastState) {
			globalState.match.currentState = currentState;
			globalState.match.lastState = lastState;
		},
		user: function(currentState, lastState) {
			globalState.user.currentState = currentState;
			globalState.user.lastState = lastState;
		}
	},
	get: {
		match: function() {
			return globalState.match.currentState;
		},
		user: function() {
			return globalState.user.currentState;
		}
	}
}
var helper = {
	userSettings: {
		bDebugMode: false,
		bAutoAccept: false,
		bAutoCopy: false,
		bAutoVeto: false,
		bPremium: false,
		bMatchedPlayers: false,
		bShowStats: false,
		arrayMapOrder: { }
	},
	buttons: [
		{
			id: "btnPremium",
			icon: "icon-ic_verified_user_black_48px",
			text: "Premium ",
			stateId: "sPremium",
			action: function() {
				helper.userSettings.bPremium = !helper.userSettings.bPremium;
				localStorage.bPremium = helper.userSettings.bPremium;
				helper.sendNotification('<span class="text-info"><strong>Setting will be applied and effective on next page refresh...<br>(Ctrl+R/F5)</strong><br></span>');

				var txtState = helper.userSettings.bPremium ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
			    $("#sPremium").html(txtState);
			}
		},
		{
			id: "btnMatchedPlayers",
			icon: "icon-ic_navigation_party_48px",
			text: "Show Matched Players ",
			stateId: "sMatchedPlayers",
			action: function() {
				helper.userSettings.bMatchedPlayers = !helper.userSettings.bMatchedPlayers;
				localStorage.bMatchedPlayers = helper.userSettings.bMatchedPlayers;

				var txtState = helper.userSettings.bMatchedPlayers ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
			    $("#sMatchedPlayers").html(txtState);
			}
		},
		{
			id: "btnAutoAccept",
			icon: "icon-ic_check_generic",
			text: "Auto-Accept ",
			stateId: "sAutoAccept",
			action: function() {
				helper.userSettings.bAutoAccept = !helper.userSettings.bAutoAccept;
				localStorage.bAutoAccept = helper.userSettings.bAutoAccept;

				var txtState = helper.userSettings.bAutoAccept ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
			    $("#sAutoAccept").html(txtState);
			}
		},
		{
			id: "btnAutoVeto",
			icon: "icon-map",
			text: "Auto-Veto ",
			stateId: "sAutoVeto",
			action: function() {
				helper.userSettings.bAutoVeto = !helper.userSettings.bAutoVeto;
				localStorage.bAutoVeto = helper.userSettings.bAutoVeto;

				var txtState = helper.userSettings.bAutoVeto ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
			    $("#sAutoVeto").html(txtState);
			}
		},
		{
			id: "btnAutoCopy",
			icon: "icon-clipboard_icon",
			text: "Auto-Copy IP ",
			stateId: "sAutoCopy",
			action: function() {
				helper.userSettings.bAutoCopy = !helper.userSettings.bAutoCopy;
				localStorage.bAutoCopy = helper.userSettings.bAutoCopy;

				var txtState = helper.userSettings.bAutoCopy ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
				$("#sAutoCopy").html(txtState);
			}
		},
		{
			id: "btnAutoJoin",
			icon: "icon-ic_navigation_friends_48px",
			text: "Auto-Join Server ",
			stateId: "sAutoJoin",
			action: function() {
				helper.userSettings.bAutoJoin = !helper.userSettings.bAutoJoin;
				localStorage.bAutoJoin = helper.userSettings.bAutoJoin;

				if(helper.userSettings.bAutoJoin) {
					helper.sendNotification('<strong><span class="text-success">Auto-Join Enabled</span><hr><small>The game will be launched via new Steam protocol connect command released on 10/6/2016<br>(Without causing FPS drop)</small></strong>');
				}

				var txtState = helper.userSettings.bAutoJoin ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
			    $("#sAutoJoin").html(txtState);
			}
		},
		{
			id: "btnShowStats",
			icon: "icon-stats",
			text: "Show extended stats ",
			stateId: "sShowStats",
			action: function() {
				helper.userSettings.bShowStats = !helper.userSettings.bShowStats;
				localStorage.bShowStats = helper.userSettings.bShowStats;

				var txtState = helper.userSettings.bShowStats ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
			    $("#sShowStats").html(txtState);
			}
		}
	],
	createButtons: function() {
		for (var i=0;i<helper.buttons.length;i++) {
			var btnCreate = $('<li/>', { id: helper.buttons[i].id })
				.append( $('<a/>')
				.append( $('<i/>').addClass("main-navigation__icon").addClass(helper.buttons[i].icon) )
				.append( $('<span/>', { class: 'main-navigation__name', text: helper.buttons[i].text })
				.append($('<span/>', { id: helper.buttons[i].stateId }))))
				.attr('unselectable', 'on')
                .css('user-select', 'none')
                .on('selectstart', false);

			$('.main-navigation ul[ng-controller="NavigationController"]').append(btnCreate);
			btnCreate.bind("click",  helper.buttons[i].action);
		}
		$('#helperDebug').bind("click", function() {
			helper.userSettings.bDebugMode = !helper.userSettings.bDebugMode;
			var Status = helper.userSettings.bDebugMode ? 'enabled' : 'disabled';
			helper.sendNotification("Debuging mode " + Status + "!");
		});
		setTimeout(function() { helper.updateButtons(); }, 500);
	},
	updateButtons: function() {
		// TODO: Remove this but make the thing that refeers to it work
		var txtState;
	    txtState = helper.userSettings.bAutoAccept ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
	    $("#sAutoAccept").html(txtState);

	    txtState = helper.userSettings.bAutoCopy ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
	    $("#sAutoCopy").html(txtState);

		txtState = helper.userSettings.bAutoVeto ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
		$("#sAutoVeto").html(txtState);

	    txtState = helper.userSettings.bPremium ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
	    $("#sPremium").html(txtState);

	    txtState = helper.userSettings.bMatchedPlayers ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
	    $("#sMatchedPlayers").html(txtState);

	    txtState = helper.userSettings.bAutoJoin ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
	    $("#sAutoJoin").html(txtState);

	    txtState = helper.userSettings.bShowStats ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
	    $("#sShowStats").html(txtState);
	},
	copyToClipboard: function(text) {
		document.dispatchEvent(new CustomEvent('FH_copyServerIP', {
	        detail:  { serverIP : text }
	    }));
	},
	acceptMatch: function() {
		// Some people reported checkIn(); will cause modal bug
		// Using legacy method for now...
		var acceptBtn = $('.modal-dialog__header__title[translate-once="MATCH-READY"]').parent().parent().find('button[translate-once="ACCEPT"]');
    	acceptBtn.click();
    	helper.sendNotification('<span class="text-info"><strong>has accepted the match for you</span></strong>');
	},
	pageRefresh: function() {
		angular.reloadWithDebugInfo();
	},
	sendNotification: function(messages, showTitle=true, debugMode=false) {
		if(debugMode && !helper.userSettings.bDebugMode) {
			return;
		}
		if(showTitle) {
			$scope.$root.$broadcast("NEW_GROWL", {message: '<div class="growl-text">'+
	            ' <span ng-bind-html="::growl.message"><strong>FACEIT HELPER</strong><br>'+ messages +'</div>'});
		} else {
			$scope.$root.$broadcast("NEW_GROWL", {message: '<div class="growl-text">'+
	            ' <span ng-bind-html="::growl.message">'+ messages +'</div>'});
		}
	},
	hideDialogBox: function() {
		var btnContinue = $('.modal-dialog__header__title[translate-once="QUICK-MATCH-QUEUING"]').parent().parent().find('button[translate-once="CONTINUE"]');
        if(btnContinue != null && btnContinue.is(":visible")) {
            btnContinue.click();
            helper.sendNotification('<span class="text-warning"><strong>is now queuing for a match...</strong><br></span>');
        }
		// You have been placed in queue..etc
	},
	appendPlayerList: function() {
		if($('#player_list').length > 0 ) {
			return;
		}
		var joined_players = angular.element('.queue--sm').scope().quickMatch.joined_players;
		$('.modal-dialog__actions').append('<hr><strong class="text-center">Players in this room</strong><ul id="player_list" class="list-unstyled"></ul>');
		var userGetQueries = []
		for (var i = 0; i < joined_players.length; i++) {
			userGetQueries.push(
				$.get('https://api.faceit.com/api/users/'+joined_players[i], function(e) {
					var fetchedValue = {
						guid: e.payload.guid,
						skill_level: 'https://cdn.faceit.com/frontend/231/assets/images/skill-icons/skill_level_'+e.payload.csgo_skill_level_label+'_sm.png',
						country: 'https://cdn.faceit.com/frontend/231/assets/images/flags/' + e.payload.country.toUpperCase() + '.png',
						nickname: e.payload.nickname,
						elo: e.payload.games.csgo.faceit_elo,
						type: e.payload.membership.type,
						teamid: e.payload.active_team_id
					};

					var list = $('<li/>').addClass("text-left")
						.append($('<i/>', { id: fetchedValue.guid, class: "icon-ic_state_checkmark_48px icon-md" }))
						.append($('<img/>', { class: "flag flag--16" , src: fetchedValue.country, onerror: "helper.loadError(this, 'country')" }))
						.append($('<img/>', { src: fetchedValue.skill_level ,onerror: "helper.loadError(this, 'skills')"}))
						.append($('<strong/>', {id: fetchedValue.guid , text: fetchedValue.nickname}))
						.append(' - ELO: '+ fetchedValue.elo +' - '+ fetchedValue.type +'</li>');
						// Temp party indicator - uses first 6 chars of team id as hex colour
						if (e.payload.active_team_id) { // This might solve the solo having party icon. Not sure bc faceit is funny
							list.append($('<i/>', {class: "icon-ic_navigation_party_48px" , style: 'color:#' + fetchedValue.teamid.substring(0,6) }));
						}
					$('#player_list').append(list);
				}, "json")
			);
		}
		$.when.apply($, userGetQueries).done(function() {
			helper.timerCheckAcceptedPlayers(globalState.user.currentState);
    	});
	},
	timerCheckAcceptedPlayers: function(currentState) {
		if(currentState != "CHECK_IN" && currentState != "WAITING") {
			return;
		}
		var timer = setInterval(function() {
			if(currentState != globalState.user.currentState) {
				debug.log("State Change detected! Exiting the loop...")
				clearInterval(timer);
				return;
			}
			if($('#player_list').length <= 0 ) {
				return;
			}
			// Do player-checkin checks here!
			var checkedin_players = angular.element('.queue--sm').scope().quickMatch.checkedin_players;
			for (var i = 0; i < checkedin_players.length; i++) {
				$('strong[id="'+checkedin_players[i] +'"]').addClass("text-info");
				// Color the checkBox to indicate accepted
				$('i[id="'+checkedin_players[i]+'"]').addClass("text-primary");
			}

			debug.log("timerCheckAcceptedPlayers is looping for accepted players...");


		}, 200);
	},
	joinServer: function(serverIP) {
		setTimeout(function() {
			var StartParameter = "steam://rungame/730/76561202255233023/+connect%20" + serverIP;
			debug.log("Triggering following address:" + StartParameter);
			window.location = StartParameter;
		}, 3000);
	},
	joinTimer: function(duration, serverIP) {
	    var timer = duration, minutes, seconds;
	    var timerHandle = setInterval(function () {
	        seconds = parseInt(timer % 60, 10);
	        seconds = seconds < 10 ? "0" + seconds : seconds;
	        $('#autojoinTimer').text(seconds);
	        if (--timer < 0) {
	        	clearInterval(timerHandle);
	        	// In case client changed their mind...
	        	if(helper.userSettings.bAutoJoin) {
		        	helper.sendNotification('<br><span class="text-success"><strong><h2>AUTO JOINNING THE GAME SERVER</h2></span><h3>Please wait....</h3><small>Your game will be started shortly</small></strong>');
		            helper.joinServer(serverIP);
		            $("#joinWarning").html('<h2><strong class="text-success"><center>YOU WILL BE CONNECTED TO THE SERVER MOMENTARILY</center></strong></h2>');
		            new Audio("https://faceit.poheart.net/sounds/autojoin_confirm.mp3").play();
		        } else {
		        	helper.sendNotification('<span class="text-danger"><strong><h2>Auto-Join cancelled</h2></span></strong>');
		        	$("#joinWarning").html('<h2><strong class="text-danger"><center>AUTOJOIN CANCELLED</center></strong></h2>');
		        	new Audio("https://faceit.poheart.net/sounds/autojoin_cancelled.mp3").play();
		        }
	        }
	    }, 1000);
	},
	userInMatchRoom: function() {
		return window.location.pathname.indexOf('/room/') != -1;
	},
	loadUserSettingsFromStorage: function() {
		helper.userSettings.bAutoAccept = localStorage.bAutoAccept == "true" ? true : false;
		helper.userSettings.bAutoCopy = localStorage.bAutoCopy == "true" ? true : false;
		helper.userSettings.bAutoVeto = localStorage.bAutoVeto == "true" ? true : false;
		helper.userSettings.bPremium = localStorage.bPremium == "true" ? true : false;
		helper.userSettings.bMatchedPlayers = localStorage.bMatchedPlayers == "true" ? true : false;
		helper.userSettings.bAutoJoin = localStorage.bAutoJoin == "true" ? true : false;
		helper.userSettings.bShowStats = localStorage.bShowStats == "true" ? true : false;
		// Fetch user map preferences
		helper.fetchMapPreference();
	},
	fetchMapPreference: function() {
		document.dispatchEvent(new CustomEvent('FH_getMapsPreference'));
	},
	loadError: function(img, type) {
		if(type == "country") {
			img.onerror = null;
			img.src = "https://faceit.poheart.net/images/country-notfound.png";
		} else if(type == "skills") {
			img.onerror = null;
			img.src = "https://cdn.faceit.com/frontend/231/assets/images/skill-icons/skill_level_0_sm.png";
		}
		return true;
	}
}

// TODO: Set default in init?
document.addEventListener('FH_returnMapsPreference', function(e) {
	// if array is not set.
	if(!e.detail.arrayMapOrder) {
		// Give some default setting
		helper.userSettings.arrayMapOrder= "de_dust2>de_cache>de_mirage>de_nuke>de_cbble>de_inferno>de_train>de_overpass>";
	}
	helper.userSettings.arrayMapOrder = e.detail.arrayMapOrder.split(">");
});

function playerRoomInfo(id) {
	this.id = id;
	this.roomid;
	this.nickname;
	this.county;
	this.country_flag;
	this.party_id;
	this.elo;
	this.totalGames = 0;
	this.avgKills = 0;
	this.avgHsPer = 0;
	this.avgKRRatio = 0;
	this.wins = 0;
	this.winstreak = 0;
	this.teamId;
	this.faction;

	this.parseProfileData = function(data)
	{
		this.roomid = data.roomid;
        this.nickname = data.nickname;
        this.country = data.country;
        this.country_flag = data.country_flag;
        this.elo = data.elo;
	}

	this.parseTotalGames = function(data)
	{
		this.totalGames = data.totalGames;
	}

	this.parseAverageData = function(data)
	{
		this.avgKills = data.avgKills;
		this.avgHsPer = data.avgHsPer;
		this.avgKRRatio = data.avgKRRatio;
		this.wins = data.wins;
		this.winstreak = data.winstreak
	}

	this.parseTeamData = function(data)
	{
		this.party_id = data.team;
		this.faction = data.faction;
	}

}
playerRoomInfo.prototype.toString = function()
{
    return "id: " + this.id + " roomId: " + roomId + " nickname: "+ this.nickname + " country: " + this.country + " party_id: " + party_id + " elo: " + this.elo + " totalGames: " + this.totalGames + " avgKills: " + this.avgKills + " avgHsPer: " + this.avgHsPer + " avgKRRatio: " + this.avgKRRatio + " wins: " + this.wins + " winstreak: " + this.winstreak + " teamId: " + this.teamId + " faction: " + this.faction;
}

var lobbyStats = {
	statsReady: false,
	fetchData: function() {
		// Do action here
		var playerList = lobbyStats.fetchPlayerlist();
		if(playerList.length != 10) {
			debug.log("[fetchData] Warning: playerList.length:" + playerList.length + ", insufficient data to process.");
		}

		var profileData = [];
		var playerStatsQueries = [];
		var totalGames = [];
		var averageData = [];
		var teamData = [];

		lobbyStats.data = {};


		var roomID = lobbyStats.getRoomGUID();
		for (var i = 0; i < playerList.length; i++) {
			//Initializing players
			lobbyStats.data[playerList[i]] = new playerRoomInfo(playerList[i]);

			//Player stats
			playerStatsQueries.push(
					$.get('https://api.faceit.com/api/users/'+playerList[i], function(userProfile) {
						userProfile = userProfile.payload;
						profileData.push({
							id: userProfile.guid,
							roomid: roomID,
							nickname: userProfile.nickname,
							country:  userProfile.country,
							country_flag: 'https://cdn.faceit.com/frontend/231/assets/images/flags/' + userProfile.country.toUpperCase() + '.png',
							elo: userProfile.games.csgo.faceit_elo
						});
					}, "json")
				);

			//Total games:
			playerStatsQueries.push(
				$.get('https://api.faceit.com/stats/api/v1/stats/users/'+playerList[i]+'/games/csgo', function(amountGamesData) {
					if(amountGamesData.lifetime.hasOwnProperty("_id"))
					{
						totalGames.push({
							id : amountGamesData.lifetime["_id"].playerId,
							totalGames:amountGamesData.lifetime.m1
						});
					}
					
				}, "json")
			);


			//Averages of latest games
			playerStatsQueries.push(
				$.get("https://api-gateway.faceit.com/stats/api/v1/stats/time/users/" + playerList[i] + "/games/csgo?size=10", function(userMatchData) {
					//no stats recoreded
					if(userMatchData.length == 0)
					{
						return;
					}
					var winstreak = 0;
		            var wins = 0;
		            var coherent = true;
		            var avgKills = 0;
		            var avgHsPer = 0;
		            var avgKRRatio = 0;
		            var playerId = "";
		            for(var m = 0; m<userMatchData.length; m++){
		                avgKRRatio += parseFloat(userMatchData[m].c3);
		                avgKills += parseInt(userMatchData[m].i6);
		                avgHsPer += parseFloat(userMatchData[m].c4);
		                playerId = userMatchData[m].playerId;
		                //find winner of game
		                if(userMatchData[m].i2 === userMatchData[m].teamId)
					    {
					        wins++;
		                    if(coherent)
		                        winstreak++;
					    } else
					    {
					       coherent = false;
					    }
		            }

		            averageData.push({
		            	id : playerId,
			            avgKills : Math.round(avgKills/userMatchData.length),
			            avgHsPer : avgHsPer/userMatchData.length,
			            avgKRRatio : Math.round(avgKRRatio/userMatchData.length*100)/100,
			            winstreak : winstreak,
			            wins : wins,
		        	});
				}, "json")
			);
		}

		//Stackinfo, who is playing with who
		//This is needed because this is the active team_id from this match. The Active team_id in user is what team he currently is in, and not what he was in, in a certain game!
		$.get('https://api.faceit.com/api/matches/' + roomID, function(data) {
			data.payload.faction1.forEach(function(player){
				teamData.push({
					id: player.guid,
					team: player.active_team_id,
					faction: 1
				});
			});
			data.payload.faction2.forEach(function(player){
				teamData.push({
					id: player.guid,
					team: player.active_team_id,
					faction: 2
				});
			});
		});

		 $.when.apply($, playerStatsQueries).then(function() {
        	debug.log("[fetchData] Fetch data completed");
        	debug.log("[fetchData] Merging lists into players");

        	profileData.forEach(function (player) {
        		lobbyStats.data[player.id].parseProfileData(player);
        	});

        	totalGames.forEach(function (player) {
        		lobbyStats.data[player.id].parseTotalGames(player);
        	});

        	averageData.forEach(function (player) {
        		lobbyStats.data[player.id].parseAverageData(player);
        	});
        	teamData.forEach(function (player) {
        		lobbyStats.data[player.id].parseTeamData(player);
        	});

        	debug.log("[fetchData] Requesting content inject.");
			lobbyStats.injectContent();
    	});

	},
	isInjected: function() {
		var injectCount = $('.helper-stats');
		return injectCount.length > 0;
	},
	isDataReady: function(roomID) {
		var validResult = 0;
		for(var key in lobbyStats.data)
		{
			if(lobbyStats.data[key].roomid == roomID)
			{
				validResult++;
			}
		}
		return validResult >= 10;
	},
	getRoomGUID: function() {
		if(!helper.userInMatchRoom()) {
			return false;
		}
		var matchScope = angular.element('.match-vs').scope();
		if(!matchScope) {
			return false;
		}
		return matchScope.match.guid;

	},
	fetchPlayerlist: function() {
		var matchPlayers = [];
		var matchScope = angular.element('.match-vs').scope();
		if(!matchScope) {
			return false;
		}
		var fraction1 = matchScope.match.faction1;
		var fraction2 = matchScope.match.faction2;

		if(!fraction1 || !fraction2) {
			return false;
		}
		if(fraction1.length + fraction2.length != 10) {
			return false;
		}

		for(var i=0;i<fraction1.length;i++) {
			matchPlayers.push(fraction1[i].guid);
		}
		for(var i=0;i<fraction2.length;i++) {
			matchPlayers.push(fraction2[i].guid);
		}
		debug.log("[fetchPlayerlist] Pulled " + matchPlayers.length + " data from player list");
		return matchPlayers;

	},
	injectContent: function() {

		//should probably have a separate file to helper methods, but dont know who to create so i'll place here for now
		function mix(a, b, v)
		{
		    return (1-v)*a + v*b;
		}

		function HSVtoRGB(H, S, V)
		{
		    var V2 = V * (1 - S);
		    var r  = ((H>=0 && H<=60) || (H>=300 && H<=360)) ? V : ((H>=120 && H<=240) ? V2 : ((H>=60 && H<=120) ? mix(V,V2,(H-60)/60) : ((H>=240 && H<=300) ? mix(V2,V,(H-240)/60) : 0)));
		    var g  = (H>=60 && H<=180) ? V : ((H>=240 && H<=360) ? V2 : ((H>=0 && H<=60) ? mix(V2,V,H/60) : ((H>=180 && H<=240) ? mix(V,V2,(H-180)/60) : 0)));
		    var b  = (H>=0 && H<=120) ? V2 : ((H>=180 && H<=300) ? V : ((H>=120 && H<=180) ? mix(V2,V,(H-120)/60) : ((H>=300 && H<=360) ? mix(V,V2,(H-300)/60) : 0)));

		    return {
		        r : Math.round(r * 255),
		        g : Math.round(g * 255),
		        b : Math.round(b * 255)
		    };
		}

		//show average teamElo
		var faction1 = 0;
		var faction1Count = 0;
		var faction2 = 0;
		var faction2Count = 0;
		for(var key in lobbyStats.data){
			var player = lobbyStats.data[key];
			if(player.faction == 1)
			{
				faction1 += player.elo;
				faction1Count++;
			}
			if(player.faction == 2)
			{
				faction2 += player.elo;
				faction2Count++;
			}
		}
		faction1 = Math.round(faction1/faction1Count);
		faction2 = Math.round(faction2/faction2Count);

		$("h3[ng-bind='::nickname']" ).first().append(document.createTextNode(" - ELO:" + faction1));
		$("h3[ng-bind='::nickname']" ).last().append(document.createTextNode(" - ELO:" + faction2));
							
		var matchScope = angular.element('.match-vs').scope();

		var matchPlayers = $(".match-team-member.match-team-member--team");

		debug.log("[injectContent] lobbyStats.data.length: " + lobbyStats.data.length);
		var lobbies = [];
		for(var key in lobbyStats.data){ // Data length
			for (var j = 0; j < matchPlayers.length; j++) { // DOM Content team member length
				var name = $(matchPlayers[j]).find('strong[ng-bind="::teamMember.nickname"]').text();
				var state = $(matchPlayers[j]).find("span").hasClass("helper-stats");
				if(name == lobbyStats.data[key].nickname && !state) {
					// Our targered users for this loop
						var faceitstats_link = "http://faceitstats.com/profile,name," +  name;
						var flag_style = $(matchPlayers[j]).find('.match-team-member__details').hasClass('match-team-member__details--right') ? "left:initial;right:0;" : "right:initial;left:0;";
						$(matchPlayers[j]).find('.match-team-member__details__skill')
							.after($('<div>', { class: "match-team-member__details__skill player_flag faction"+lobbyStats.data[key].fraction, style: flag_style }).append($('<img>', { src: lobbyStats.data[key].country_flag, class: "flag flag--16 skill-icon", onerror: "helper.loadError(this, 'country')" })));
						$(matchPlayers[j]).find('.match-team-member__controls--team')
							.prepend($($('<a>', { target: "_blank", class: "match-team-member__controls__button helper-stats" ,href: faceitstats_link }).append($('<i>', { class:"icon-ic-social-facebook" } ))));
						$(matchPlayers[j]).find('.match-team-member__details__name > div')
							.append($('<br>')).append($('<strong>', { text: "ELO: " + lobbyStats.data[key].elo, class: "text-info" }));
						

						var border = ""
						if(lobbyStats.data[key].faction == 1 )
						{
							border = "left";
						} else
						{
							border = "right";
						}

						var partyid = lobbyStats.data[key].party_id;
						if(partyid == null)
						{
							partyid = lobbies.length;
							lobbies.push(partyid);
						} else 
						{
						    if (lobbies.indexOf(partyid) == -1)
								lobbies.push(partyid);
						}
						var colors = [0, 60, 120, 180, 240, 300, 30, 270, 210, 90];
					    var inRange = colors[lobbies.indexOf(partyid)];
						
					    //http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
					    var rgb = HSVtoRGB(inRange , 1.0, 0.8);
					    var color = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
						$(matchPlayers[j]).css("border-" + border, "3px solid " + color);

						if(helper.userSettings.bShowStats)
						{				
							var container = $("<div>").css({'border-top' : '1px solid #e2e4e6',
															'padding' : '3px 2px 2px 5px'});
							var statCss = {'margin' : '0', 'padding' : '0', 'width' : '100%'}
							var winNode = $("<p>").css(statCss).html("Wins: <strong>" + lobbyStats.data[key].wins + "</strong> - Winstreak: <strong>" + lobbyStats.data[key].winstreak + "</strong>");
							var statNode = $("<p>").css(statCss).html("Avg. kills: <strong>" + lobbyStats.data[key].avgKills + "</strong> - Avg. hs%: <strong>" + lobbyStats.data[key].avgHsPer + "</strong>");
							var statNode2 = $("<p>").css(statCss).html("Avg. K/R: <strong>" + lobbyStats.data[key].avgKRRatio + "</strong> - Games: <strong>" + lobbyStats.data[key].totalGames + "</strong>");

                   			container.append(winNode);
                   			container.append(statNode);
                   			container.append(statNode2);

                   			$(matchPlayers[j]).append(container);
						}


						// if(lobbyStats.data[key].party_id) {
						// 	$(matchPlayers[j]).find("strong")
						// 		.after($('<i/>', {class: "icon-ic_navigation_party_48px" , style: 'color:#' + lobbyStats.data[key].party_id.substring(0,6) }));
						// }

					//break;
				}

				if(name == "Poheart") {
				var badge = $(".dev-badge");
				if(badge.length <= 0) {
					$(matchPlayers[j]).find(".match-team-member__details__name > div")
						.prepend($('<span/>', { class: "label label-info dev-badge", text: "FACEIT HELPER DEV", style: "background-color:#9B59B6" } ));
				}
			}

			}
		}
		debug.log("[injectContent] Run success.");

	},
	data: []
};
var eventStage = {
	OnUserStateChange: function(currentState, lastState) {
		// This function will be called when user stage changed from one to another
		debug.log("eventStage CURRENT USERSTATE:" + currentState + " & LAST:" + lastState);
		if(currentState == "CHECK_IN" || currentState == "WAITING") {
			if(helper.userSettings.bMatchedPlayers) {
				setTimeout(function() {
					helper.appendPlayerList();
				}, 1500);
			}
		}

		// Perform action when under certain conditional
		if(currentState == "IN_QUEUE") {
			setTimeout(function() {
				// Save user current region for later server veto implementation
				globalState.user.region = angular.element('.queue--sm').scope().quickMatch.region;
				helper.hideDialogBox();
			}, 200);

			if(lastState == "MATCH") {
				helper.sendNotification('<span class="text-danger"><strong>will now refresh page to prevent match accept bug</strong><hr>Attempting page refresh now...</span>');
                setTimeout(function() {
                	helper.pageRefresh();
                }, 3000);
			}
		}

		if(currentState == "CHECK_IN") {
			if(helper.userSettings.bAutoAccept) {
				helper.acceptMatch();
			}
		}
	},

	OnMatchStateChange: function(currentState, lastState) {
		// This function will be called when match state changed from one to another
		debug.log("eventStage CURRENT MATCHSTATE:" + currentState+ " & LAST:" + lastState);

		if(currentState == "voting") {
			// Re-fetch the user voting preferences again
			helper.fetchMapPreference();
		}

		if(currentState == "ready") {
			if(helper.userSettings.bAutoCopy) {
				setTimeout(function() {
				var btnCopy = $('[clipboard]');
				// Check if there is any IP for us to copy
	                if(btnCopy.is(":visible") && btnCopy != null) {

	                    var serverIP = $('[ng-if="serverConnectData.active"] span[select-text]').text();
	                    debug.log("ServerIP is " + serverIP);
	                    helper.copyToClipboard(serverIP);
	                    helper.sendNotification('<br><span class="text-success"><strong>IP address copied to clipboard</span></strong>');
	                    new Audio("https://faceit.poheart.net/sounds/copied.mp3").play();
	                }

            	}, 1000);
			}

			if(lastState == "configuring" && helper.userSettings.bAutoJoin) {
				setTimeout(function() {
					var btnCopy = $('[clipboard]');
					if(btnCopy.is(":visible") && btnCopy != null) {
						$(".match-vs__details").append('<div id="joinWarning"><h2><strong><center>AUTO-JOIN SERVER IN <span id="autojoinTimer">10</span> SECONDS</center></strong></h2></div>');
						var serverIP = $('[ng-if="serverConnectData.active"] span[select-text]').text().replace("connect ", "");
						debug.log("ServerIP is " + serverIP);
						helper.joinTimer(10, serverIP);
					}
				}, 1000);
			}
		}

		if (currentState == "ongoing") {
			helper.sendNotification('<h2><span class="text-success"><strong>GLHF!</span></strong></h2>');
			$("#joinWarning").remove();
		}

		if (currentState == "cancelled") {
			$("#joinWarning").remove();
		}
	},
	OnUserVoteStateChanged: function(isCurrentUserVoting, oldValue) {
		// This function will be called when user voting access is changed
		debug.log("Current user voting state is " + isCurrentUserVoting + " & userSettings.bAutoVeto:" + helper.userSettings.bAutoVeto);
		if(isCurrentUserVoting && helper.userSettings.bAutoVeto) {
			// Perform ban map
			setTimeout(function() {
				for(i=helper.userSettings.arrayMapOrder.length - 1;i > 0 - 1;i--) {
		            var bSelected = false;
		            $(".match-vote-item__name").each(function() {
		                if ($(this).text() == helper.userSettings.arrayMapOrder[i] && $(this).parent().find("button").is(":enabled") && !bSelected) {
		                    $(this).parent().find("button").click();
		                    bSelected = true;
		                    helper.sendNotification('<h3>Auto-veto has <span class="text-danger">banned</span> <strong>'+helper.userSettings.arrayMapOrder[i] + '</strong></h3>');
		                    debug.log("Auto-veto has banned map " + helper.userSettings.arrayMapOrder[i]);
		                }
		            });
	        	}
	        }, 1000);
		}
	},
	OnTeamMemberElementUpdate: function() {
		// Say goodbye if we not in active match room
		if(!helper.userInMatchRoom()) {
			return;
		}

		// Check if injected element exist by counting class
		if(lobbyStats.isInjected()){
			return;
		}

		var roomID = lobbyStats.getRoomGUID();
		debug.log("Retrived RoomID: " + roomID);
		// Check if we get 10 enough player data for this room
		if(!lobbyStats.isDataReady(roomID)) {
			// fetch data and wait to be called on next update
			lobbyStats.fetchData();
			return;
		}

		// Begin the injection of script
		lobbyStats.injectContent();


	}
}

/**********************************************************************/

var dispatchStateChange = function(currentState, lastState, mode) {
	// This function check for data validity before passing to designated function
	if(!currentState) {
		return;
	}

	if(!lastState) {
		// This value is undefined after page load suceed
		// Hence i am giving it a value rather than undefined
		lastState = "PAGE_LOAD";
	}

	switch(mode) {
		case "match":
			setTimeout(function() {
				eventStage.OnMatchStateChange(currentState, lastState);
				globalState.set.match(currentState, lastState);
			}, 500);
			break;
		case "user":
			setTimeout(function() {
				eventStage.OnUserStateChange(currentState, lastState);
				globalState.set.user(currentState, lastState);
			}, 500);
			break;
		case "match_actionUpdate":
			debug.log(globalState.get.user());
			// To ensure that the user is currently in match room
			if(globalState.get.user() == "MATCH") {
				eventStage.OnUserVoteStateChanged(currentState, lastState);
			}
			break;
		case "members_elementupdate":
			eventStage.OnTeamMemberElementUpdate();
			break;
		default:
			console.error("Unknown mode type caught on dispatchStateChange");
			break;
	}

}
angular.element(document).ready(function () {
	// Watch for user stage change
	$scope.$watch(
		function () {
			var queueScope = angular.element('.queue--sm').scope();
			if(queueScope && queueScope != null) {
				return queueScope.stage;
			}
		},
		function(newValue, oldValue) {
			dispatchStateChange(newValue, oldValue, "user");
		}
	);

	// Watch for match state change
	$scope.$watch(
		function () {
			var matchScope = angular.element('.full-hr').scope();
			if(matchScope && matchScope.match != null) {
				return matchScope.match.state;
			}
		},
		function(newValue, oldValue) {
			dispatchStateChange(newValue, oldValue, "match");
		}
	);

	// Watch for match room action change while in same state(e.g: map veto)
	$scope.$watch(
		function () {
			var matchVoteScope = angular.element('.match-vs').scope();
			if(matchVoteScope) {
				return matchVoteScope.isCurrentUserVoting;
			}
		},
		function(newValue, oldValue) {
			setTimeout(function() {
				dispatchStateChange(newValue, oldValue, "match_actionUpdate");
			}, 2000);
		}
	);

	// Prevent injected information being deleted on lobby page
	$scope.$watch(
		function () {
			var teamMemberScope = angular.element('match-team-member > div').scope();
			if(teamMemberScope && teamMemberScope != null && helper.userInMatchRoom()) {
				return teamMemberScope;
			}
		},
		function(newValue, oldValue) {
			dispatchStateChange(newValue, oldValue, "members_elementupdate");
		}
	);



	// Fetch value from localStorage
	helper.loadUserSettingsFromStorage();
	// Create button
	helper.createButtons();
});
