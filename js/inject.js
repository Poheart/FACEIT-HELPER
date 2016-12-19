var global = {
    mix: function(a, b, v) {
        return (1-v)*a + v*b;
    },

    HSVtoRGB: function(H, S, V) {
        var V2 = V * (1 - S);
        var r  = ((H>=0 && H<=60) || (H>=300 && H<=360)) ? V : ((H>=120 && H<=240) ? V2 : ((H>=60 && H<=120) ? global.mix(V,V2,(H-60)/60) : ((H>=240 && H<=300) ? global.mix(V2,V,(H-240)/60) : 0)));
        var g  = (H>=60 && H<=180) ? V : ((H>=240 && H<=360) ? V2 : ((H>=0 && H<=60) ? global.mix(V2,V,H/60) : ((H>=180 && H<=240) ? global.mix(V,V2,(H-180)/60) : 0)));
        var b  = (H>=0 && H<=120) ? V2 : ((H>=180 && H<=300) ? V : ((H>=120 && H<=180) ? global.mix(V2,V,(H-120)/60) : ((H>=300 && H<=360) ? global.mix(V,V2,(H-300)/60) : 0)));

        return {
            r : Math.round(r * 255),
            g : Math.round(g * 255),
            b : Math.round(b * 255)
        };
    }
};

var faceitHelper = {

    // Properties
    $scope: angular.element(document).scope(),
    userSettings: {
		debugMode: false,
		autoAccept: false,
		autoCopy: false,
		autoVeto: false,
        autoJoin: false,
		premium: false,
		matchedPlayers: false,
		showStats: false,
		arrayMapOrder: {},
		BlackList: false
	},
    buttons: [
		{
			id: "btnPremium",
			icon: "icon-ic_verified_user_black_48px",
			text: "Premium ",
			stateId: "sPremium",
			settingName: "premium",
			action: function() {
				faceitHelper.userSettings.premium = !faceitHelper.userSettings.premium;
				localStorage.bPremium = faceitHelper.userSettings.premium;
				faceitHelper.sendNotification('<span class="text-info"><strong>Setting will be applied and effective on next page refresh...<br>(Ctrl+R/F5)</strong><br></span>');

				faceitHelper.updateButtons();
			}
		},
		{
			id: "btnMatchedPlayers",
			icon: "icon-ic_navigation_party_48px",
			text: "Show Matched Players ",
			stateId: "sMatchedPlayers",
			settingName: "matchedPlayers",
			action: function() {
				faceitHelper.userSettings.matchedPlayers = !faceitHelper.userSettings.matchedPlayers;
				localStorage.bMatchedPlayers = faceitHelper.userSettings.matchedPlayers;

				faceitHelper.updateButtons();
			}
		},
		{
			id: "btnAutoAccept",
			icon: "icon-ic_check_generic",
			text: "Auto-Accept ",
			stateId: "sAutoAccept",
			settingName: "autoAccept",
			action: function() {
				faceitHelper.userSettings.autoAccept = !faceitHelper.userSettings.autoAccept;
				localStorage.bAutoAccept = faceitHelper.userSettings.autoAccept;

				faceitHelper.updateButtons();
			}
		},
		{
			id: "btnAutoVeto",
			icon: "icon-map",
			text: "Auto-Veto ",
			stateId: "sAutoVeto",
			settingName: "autoVeto",
			action: function() {
				faceitHelper.userSettings.autoVeto = !faceitHelper.userSettings.autoVeto;
				localStorage.bAutoVeto = faceitHelper.userSettings.autoVeto;

				faceitHelper.updateButtons();
			}
		},
		{
			id: "btnAutoCopy",
			icon: "icon-clipboard_icon",
			text: "Auto-Copy IP ",
			stateId: "sAutoCopy",
			settingName: "autoCopy",
			action: function() {
				faceitHelper.userSettings.autoCopy = !faceitHelper.userSettings.autoCopy;
				localStorage.bAutoCopy = faceitHelper.userSettings.autoCopy;

				faceitHelper.updateButtons();
			}
		},
		{
			id: "btnAutoJoin",
			icon: "icon-ic_navigation_friends_48px",
			text: "Auto-Join Server ",
			stateId: "sAutoJoin",
			settingName: "autoJoin",
			action: function() {
				faceitHelper.userSettings.autoJoin = !faceitHelper.userSettings.autoJoin;
				localStorage.bAutoJoin = faceitHelper.userSettings.autoJoin;

				if(faceitHelper.userSettings.autoJoin) {
					faceitHelper.sendNotification('<strong><span class="text-success">Auto-Join Enabled</span><hr><small>The game will be launched via new Steam protocol connect command released on 10/6/2016<br>(Without causing FPS drop)</small></strong>');
				}

				faceitHelper.updateButtons();
			}
		},
		{
			id: "btnShowStats",
			icon: "icon-stats",
			text: "Show extended stats ",
			stateId: "sShowStats",
			settingName: "showStats",
			action: function() {
				faceitHelper.userSettings.showStats = !faceitHelper.userSettings.showStats;
				localStorage.bShowStats = faceitHelper.userSettings.showStats;

				faceitHelper.updateButtons();
			}
		}
	],
    // Methods
    init: function() {
		if(faceitHelper.$scope) {
            faceitHelper.loadUserSettingsFromStorage();
        	faceitHelper.createButtons();

			if(localStorage.bPremium == "true") {
				faceitHelper.$scope.$on('USER_LOGGED_IN', function() {
				    faceitHelper.$scope.$root.currentUser.membership.type = "premium";
				    faceitHelper.$scope.$root.currentUser.membership.status = "active";
				});
			}
		} else {
			faceitHelper.pageRefresh();
		}
	},
    acceptMatch: function() {
		// Some people reported checkIn(); will cause modal bug
		// Using legacy method for now...
		var acceptBtn = $('.modal-dialog__header__title[translate-once="MATCH-READY"]').parent().parent().find('button[translate-once="ACCEPT"]');
    	acceptBtn.click();
    	faceitHelper.sendNotification('<span class="text-info"><strong>has accepted the match for you</span></strong>');
	},
    appendPlayerList: function() {
		if($('#player_list').length > 0 ) {
			return;
		}
		faceitHelper.globalstate.user.currentGame = angular.element('.queue--sm').scope().gameData.name;
		var roomID = angular.element('.queue--sm').scope().quickMatch.match_id;
		var joined_players = angular.element('.queue--sm').scope().quickMatch.joined_players;
		$('.modal-dialog__actions').append('<hr><strong class="text-center">Players in this room</strong><ul id="player_list" class="list-unstyled"></ul>');
		var userGetQueries = [];
		var playerNameinQueue = [];
		for (var i = 0; i < joined_players.length; i++) {
			userGetQueries.push(
				$.get('https://api.faceit.com/api/users/'+joined_players[i], function(e) {
					var playerElo = faceitHelper.getFaceitEloFromGame(e.payload.games, faceitHelper.globalstate.user.currentGame);
					var playerSkillLabel = faceitHelper.getFaceitSkillLabelFromGame(e.payload.games, faceitHelper.globalstate.user.currentGame);
					var fetchedValue = {
						guid: e.payload.guid,
						skill_level: 'https://cdn.faceit.com/frontend/231/assets/images/skill-icons/skill_level_'+playerSkillLabel+'_sm.png',
						country: 'https://cdn.faceit.com/frontend/231/assets/images/flags/' + e.payload.country.toUpperCase() + '.png',
						nickname: e.payload.nickname,
						elo: playerElo,
						type: e.payload.membership.type,
						teamid: e.payload.active_team_id,
						registered: e.payload.created_at
					};
					// Add player name in the array for checking blacklist later
					playerNameinQueue.push(e.payload.nickname);
					var AccountAge = Math.floor(( new Date() - new Date(fetchedValue.registered)) / 86400000);
					var list = $('<li/>').addClass("text-left")
						.append($('<i/>', { id: fetchedValue.guid, class: "icon-ic_state_checkmark_48px icon-md" }))
						.append($('<img/>', { class: "flag flag--16" , src: fetchedValue.country, onerror: "faceitHelper.imgLoadError(this, 'country')" }))
						.append($('<img/>', { src: fetchedValue.skill_level ,onerror: "faceitHelper.imgLoadError(this, 'skills')"}))
						.append($('<strong/>', {id: fetchedValue.guid , text: fetchedValue.nickname}))
						.append(' - ELO: '+ fetchedValue.elo +' - '+ fetchedValue.type +'</li>')
						.append(' - ['+ AccountAge +' days ago]</li>');
						// Temp party indicator - uses first 6 chars of team id as hex colour
						if (e.payload.active_team_id) { // This might solve the solo having party icon. Not sure bc faceit is funny
							list.append($('<i/>', {class: "icon-ic_navigation_party_48px" , style: 'color:#' + fetchedValue.teamid.substring(0,6) }));
						}
					$('#player_list').append(list);
				}, "json")
			);
		}


		$.when.apply($, userGetQueries).done(function() {
			faceitHelper.timerCheckAcceptedPlayers(faceitHelper.globalstate.user.currentState);

			if(faceitHelper.userSettings.BlackList && faceitHelper.globalstate.user.currentState == "CHECK_IN") {
				// Blacklist function
				var blackListArray = localStorage.BlackList.split('\n');
				var blackListedPlayerCount = 0;
				for(var i = 0; i < playerNameinQueue.length; i++) {
					for(var j=0;j< blackListArray.length;j++ ){
						if(playerNameinQueue[i] == blackListArray[j]){
							blackListedPlayerCount++;
						}
					}
				}
				if(blackListedPlayerCount == 0) {
					faceitHelper.acceptMatch();
					faceitHelper.sendNotification("<br><strong>No blacklisted player were found in the queue</strong><hr>Accepting the match...");
				} else {
					faceitHelper.sendNotification('<hr><span class="label label-danger">'+ blackListedPlayerCount + ' Blacklisted player(s) is found!</span><span class="text-danger"><strong><h3>Auto-accept disengaged</h3></strong></span>');
					new Audio("https://faceit.poheart.net/sounds/autojoin_cancelled.mp3").play();
				}

			}
			if(roomID) {
				$.get('https://api.faceit.com/api/matches/' + roomID, function(data) {
						data.payload.faction1.forEach(function(player){
							$('#' + player.guid).parent().css("border-right", "3px solid rgb(153, 92, 92)");
						});
						data.payload.faction2.forEach(function(player){
							$('#' + player.guid).parent().css("border-right", "3px solid rgb(92, 92, 153)");
						});
				});
			}
    	});
	},
    createButtons: function() {
		for (var i=0;i<faceitHelper.buttons.length;i++) {
			var btnCreate = $('<li/>', { id: faceitHelper.buttons[i].id })
				.append( $('<a/>')
				.append( $('<i/>').addClass("main-navigation__icon").addClass(faceitHelper.buttons[i].icon) )
				.append( $('<span/>', { class: 'main-navigation__name', text: faceitHelper.buttons[i].text })
				.append($('<span/>', { id: faceitHelper.buttons[i].stateId }))))
				.attr('unselectable', 'on')
                .css('user-select', 'none')
                .on('selectstart', false);

			$('.main-navigation ul[ng-controller="NavigationController"]').append(btnCreate);
			btnCreate.bind("click",  faceitHelper.buttons[i].action);
		}
		$('#helperDebug').bind("click", function() {
			faceitHelper.userSettings.debugMode = !faceitHelper.userSettings.debugMode;
			var Status = faceitHelper.userSettings.debugMode ? 'enabled' : 'disabled';
			faceitHelper.sendNotification("Debuging mode " + Status + "!");
		});
		setTimeout(function() { faceitHelper.updateButtons(); }, 500);
	},
    copyToClipboard: function(text) {
		document.dispatchEvent(new CustomEvent('FH_copyServerIP', {
	        detail:  { serverIP : text }
	    }));
	},
    dispatchStateChange: function(currentState, lastState, mode) {
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
					faceitHelper.eventStage.OnMatchStateChange(currentState, lastState);
					faceitHelper.globalstate.set.match(currentState, lastState);
				}, 500);
				break;
			case "user":
				setTimeout(function() {
					faceitHelper.eventStage.OnUserStateChange(currentState, lastState);
					faceitHelper.globalstate.set.user(currentState, lastState);
				}, 500);
				break;
			case "match_actionUpdate":
				faceitHelper.debug.log(faceitHelper.globalstate.get.user());
				// To ensure that the user is currently in match room
				if(faceitHelper.globalstate.get.user() == "MATCH") {
					faceitHelper.eventStage.OnUserVoteStateChanged(currentState, lastState);
				}
				break;
			case "members_elementupdate":
				faceitHelper.eventStage.OnTeamMemberElementUpdate();
				break;
			default:
				console.error("Unknown mode type caught on dispatchStateChange");
				break;
		}

	},
    fetchMapPreference: function() {
		document.dispatchEvent(new CustomEvent('FH_getMapsPreference'));
	},
    hideAddedToQueueDialogBox: function() {
		var btnContinue = $('.modal-dialog__header__title[translate-once="QUICK-MATCH-QUEUING"]').parent().parent().find('button[translate-once="CONTINUE"]');
        if(btnContinue != null && btnContinue.is(":visible")) {
            btnContinue.click();
            faceitHelper.sendNotification('<span class="text-primary"><strong>is now queuing for a match...</strong><br></span>');
        }
		// You have been placed in queue..etc
	},
    imgLoadError: function(img, type) {
		if(type == "country") {
			img.onerror = null;
			img.src = "https://cdn.faceit.com/frontend/244/assets/images/flags/undefined.png";
		} else if(type == "skills") {
			img.onerror = null;
			img.src = "https://cdn.faceit.com/frontend/231/assets/images/skill-icons/skill_level_0_sm.png";
		}
		return true;
	},
    loadUserSettingsFromStorage: function() {
        // Move to userSettings at top
		faceitHelper.userSettings.autoAccept = (localStorage.bAutoAccept == "true") ? true : false;
		faceitHelper.userSettings.autoCopy = (localStorage.bAutoCopy == "true") ? true : false;
		faceitHelper.userSettings.autoVeto = (localStorage.bAutoVeto == "true") ? true : false;
		faceitHelper.userSettings.premium = (localStorage.bPremium == "true") ? true : false;
		faceitHelper.userSettings.matchedPlayers = (localStorage.bMatchedPlayers == "true") ? true : false;
		faceitHelper.userSettings.autoJoin = (localStorage.bAutoJoin == "true") ? true : false;
		faceitHelper.userSettings.showStats = (localStorage.bShowStats == "true") ? true : false;
		// Chrome extension option
		faceitHelper.userSettings.BlackList = (localStorage.bBlackList == "true") ? true : false;
		// Fetch user map preferences
		faceitHelper.fetchMapPreference();
	},
    joinServer: function(serverIP) {
		setTimeout(function() {
			var StartParameter = "steam://rungame/730/76561202255233023/+connect%20" + serverIP;
			faceitHelper.debug.log("Triggering following address:" + StartParameter);
			window.location = StartParameter;
		}, 3000);
	},
    pageRefresh: function() {
		angular.reloadWithDebugInfo();
	},
    sendNotification: function(messages, showTitle=true, debugMode=false) {
		if(debugMode && !faceitHelper.userSettings.debugMode) {
			return;
		}
		if(showTitle) {
			faceitHelper.$scope.$root.$broadcast("NEW_GROWL", {
				message: '<div class="growl-text"><span ng-bind-html="::growl.message"><strong>FACEIT HELPER</strong><br>'+ messages +'</div>'
			});
		} else {
			faceitHelper.$scope.$root.$broadcast("NEW_GROWL", {
				message: '<div class="growl-text"> <span ng-bind-html="::growl.message">'+ messages +'</div>'
			});
		}
	},
    timerCheckAcceptedPlayers: function(currentState) {
		if(currentState != "CHECK_IN" && currentState != "WAITING") {
			return;
		}
		var timer = setInterval(function() {
			if(currentState != faceitHelper.globalstate.user.currentState) {
				faceitHelper.debug.log("State Change detected! Exiting the loop...")
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
			faceitHelper.debug.log("timerCheckAcceptedPlayers is looping for accepted players...");
		}, 200);
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
	        	if(faceitHelper.userSettings.autoJoin) {
		        	faceitHelper.sendNotification('<br><span class="text-success"><strong><h2>AUTO JOINING THE GAME SERVER</h2></span><h3>Please wait....</h3><small>Your game will be started shortly</small></strong>');
		            faceitHelper.joinServer(serverIP);
		            $("#joinWarning").html('<h2><strong class="text-success"><center>YOU WILL BE CONNECTED TO THE SERVER MOMENTARILY</center></strong></h2>');
		            new Audio("https://faceit.poheart.net/sounds/autojoin_confirm.mp3").play();
		        } else {
		        	faceitHelper.sendNotification('<span class="text-danger"><strong><h2>Auto-Join cancelled</h2></span></strong>');
		        	$("#joinWarning").html('<h2><strong class="text-danger"><center>AUTOJOIN CANCELLED</center></strong></h2>');
		        	new Audio("https://faceit.poheart.net/sounds/autojoin_cancelled.mp3").play();
		        }
	        }
	    }, 1000);
	},
    updateButtons: function() {
        var buttonKeys = Object.keys(faceitHelper.buttons);
        for (var i = 0; i < buttonKeys.length; i++) {
            var text = faceitHelper.userSettings[faceitHelper.buttons[buttonKeys[i]].settingName] ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
            $("#"+faceitHelper.buttons[buttonKeys[i]].stateId).html(text);
        }
    },
    userInMatchRoom: function() {
		return window.location.pathname.indexOf('/room/') != -1;
	},
	getFaceitEloFromGame: function(userProfile, game) {
		var faceit_elo;
		switch(game) {
			case "csgo":
				faceit_elo = userProfile.csgo.faceit_elo;
				break;
			case "dota2":
				faceit_elo = userProfile.dota2.faceit_elo;
				break;
			case "wot_EU":
				faceit_elo = userProfile.wot_EU.faceit_elo;
				break;
			case "wot_NA":
				faceit_elo = userProfile.wot_NA.faceit_elo;
				break;
			case "wot_RU":
				faceit_elo = userProfile.wot_RU.faceit_elo;
				break;
			case "smite":
				faceit_elo = userProfile.smite.faceit_elo;
				break;
			case "smite_xbox":
				faceit_elo = userProfile.smite_xbox.faceit_elo;
				break;
			case "tf2":
				faceit_elo = userProfile.tf2.faceit_elo;
				break;
			case "lol_EUW":
				faceit_elo = userProfile.lol_EUW.faceit_elo;
				break;
			case "lol_EUN":
				faceit_elo = userProfile.lol_EUN.faceit_elo;
				break;
			case "lol_NA":
				faceit_elo = userProfile.lol_NA.faceit_elo;
				break;
			case "overwatch_EU":
				faceit_elo = userProfile.overwatch_EU.faceit_elo;
				break;
			case "overwatch_US":
				faceit_elo = userProfile.overwatch_US.faceit_elo;
				break;
			default:
				faceit_elo = userProfile.csgo.faceit_elo;
		}
		return faceit_elo;

	},
	getFaceitSkillLabelFromGame: function(userProfile, game) {
		var skill_label;
		switch(game) {
			case "csgo":
				skill_label = userProfile.csgo.skill_level_label;
				break;
			case "dota2":
				skill_label = userProfile.dota2.skill_level_label;
				break;
			case "wot_EU":
				skill_label = userProfile.wot_EU.skill_level_label;
				break;
			case "wot_NA":
				skill_label = userProfile.wot_NA.skill_level_label;
				break;
			case "wot_RU":
				skill_label = userProfile.wot_RU.skill_level_label;
				break;
			case "smite":
				skill_label = userProfile.smite.skill_level_label;
				break;
			case "smite_xbox":
				skill_label = userProfile.smite_xbox.skill_level_label;
				break;
			case "tf2":
				skill_label = userProfile.tf2.skill_level_label;
				break;
			case "lol_EUN":
				skill_label = userProfile.lol_EUN.skill_level_label;
				break;
			case "lol_EUW":
				skill_label = userProfile.lol_EUW.skill_level_label;
				break;
			case "lol_NA":
				skill_label = userProfile.lol_NA.skill_level_label;
				break;
			case "overwatch_EU":
				skill_label = userProfile.overwatch_EU.skill_level_label;
				break;
			case "overwatch_US":
				skill_label = userProfile.overwatch_US.skill_level_label;
				break;
			default:
				skill_label = userProfile.csgo.skill_level_label;
		}
		return skill_label;

	},
    debug: {
		log: function(msg) {
			if(faceitHelper.userSettings.debugMode) {
				console.log('%c [DEBUG]' + msg, 'background: #222; color: #bada55');
			}
		}
	},
	globalstate: {
		match: {currentState: "", lastState: ""},
		user: {currentState: "", lastState: "", region: "", currentGame: ""},
		set: {
			match: function(currentState, lastState) {
				faceitHelper.globalstate.match.currentState = currentState;
				faceitHelper.globalstate.match.lastState = lastState;
			},
			user: function(currentState, lastState) {
				faceitHelper.globalstate.user.currentState = currentState;
				faceitHelper.globalstate.user.lastState = lastState;
			}
		},
		get: {
			match: function() {
				return faceitHelper.globalstate.match.currentState;
			},
			user: function() {
				return faceitHelper.globalstate.user.currentState;
			}
		}
	},
    eventStage: {
		OnUserStateChange: function(currentState, lastState) {
			// This function will be called when user stage changed from one to another
			faceitHelper.debug.log("eventStage CURRENT USERSTATE:" + currentState + " & LAST:" + lastState);
			if(currentState == "CHECK_IN" || currentState == "WAITING") {
				if(faceitHelper.userSettings.matchedPlayers) {
					setTimeout(function() {
						faceitHelper.appendPlayerList();
					}, 1500);
				}
			}

			// Perform action when under certain conditional
			if(currentState == "IN_QUEUE") {
				setTimeout(function() {
					// Save user current region for later server veto implementation
					faceitHelper.globalstate.user.region = angular.element('.queue--sm').scope().quickMatch.region;
					faceitHelper.hideAddedToQueueDialogBox();
				}, 200);

				if(lastState == "MATCH") {
					faceitHelper.sendNotification('<span class="text-danger"><strong>will now refresh page to prevent match accept bug</strong><hr>Attempting page refresh now...</span>');
	                setTimeout(function() {
	                	faceitHelper.pageRefresh();
	                }, 3000);
				}
			}

			if(currentState == "CHECK_IN") {
				if(faceitHelper.userSettings.autoAccept && !faceitHelper.userSettings.BlackList) {
					faceitHelper.acceptMatch();
				} else if (faceitHelper.userSettings.autoAccept && (faceitHelper.userSettings.BlackList && faceitHelper.userSettings.matchedPlayers)){
					faceitHelper.sendNotification('<span class="text-info"><strong>Player Blacklist enabled</strong><br>Waiting for player list before accept...</span>');
				}
			}
		},
		OnMatchStateChange: function(currentState, lastState) {
			// This function will be called when match state changed from one to another
			faceitHelper.debug.log("eventStage CURRENT MATCHSTATE:" + currentState+ " & LAST:" + lastState);
			var match_type = angular.element('.match-vs').scope().match.match_type;
			if(currentState == "captain_pick") { // FPL/CFPL
				if(match_type == "5v5PRO" || match_type == "5v5CFPL") {
					faceitHelper.sendNotification('Welcome.<br><strong>FPL/CFPL mode activated</strong><br><span class="label label-danger">Experimental/Test Feature</span>');
				}
			}

			if(currentState == "voting") {
				// Re-fetch the user voting preferences again
				faceitHelper.fetchMapPreference();
			}

			if(currentState == "ready") {
				if(faceitHelper.userSettings.autoCopy) {
					setTimeout(function() {
					var btnCopy = $('[clipboard]');
					// Check if there is any IP for us to copy
		                if(btnCopy.is(":visible") && btnCopy != null) {
		                    var serverIP = $('[ng-if="serverConnectData.active"] span[select-text]').text();
		                    faceitHelper.debug.log("ServerIP is " + serverIP);
		                    faceitHelper.copyToClipboard(serverIP);
		                    faceitHelper.sendNotification('<br><span class="text-success"><strong>IP address copied to clipboard</span></strong>');
		                    new Audio("https://faceit.poheart.net/sounds/copied.mp3").play();
		                }

	            	}, 1000);
				}

				if(lastState == "configuring" && faceitHelper.userSettings.autoJoin) {
					setTimeout(function() {
						var btnCopy = $('[clipboard]');
						if(btnCopy.is(":visible") && btnCopy != null) {
							$(".match-vs__details").append('<div id="joinWarning"><h2><strong><center>AUTO-JOIN SERVER IN <span id="autojoinTimer">10</span> SECONDS</center></strong></h2></div>');
							var serverIP = $('[ng-if="serverConnectData.active"] span[select-text]').text().replace("connect ", "");
							faceitHelper.debug.log("ServerIP is " + serverIP);
							faceitHelper.joinTimer(10, serverIP);
						}
					}, 1000);
				}
			}

			if (currentState == "ongoing") {
				faceitHelper.sendNotification('<h2><span class="text-success"><strong>GL & HF!</span></strong></h2>');
				$("#joinWarning").remove();
			}

			if (currentState == "cancelled") {
				$("#joinWarning").remove();
			}
		},
		OnUserVoteStateChanged: function(isCurrentUserVoting, oldValue) {
			// This function will be called when user voting access is changed
			faceitHelper.debug.log("Current user voting state is " + isCurrentUserVoting + " & userSettings.autoVeto:" + faceitHelper.userSettings.autoVeto);
			if(isCurrentUserVoting && faceitHelper.userSettings.autoVeto) {
				// Perform ban map
				setTimeout(function() {
					for(i=faceitHelper.userSettings.arrayMapOrder.length - 1;i > 0 - 1;i--) {
			            var bSelected = false;
			            $(".match-vote-item__name").each(function() {
			                if ($(this).text() == faceitHelper.userSettings.arrayMapOrder[i] && $(this).parent().find("button").is(":enabled") && !bSelected) {
			                    $(this).parent().find("button").click();
			                    bSelected = true;
			                    faceitHelper.sendNotification('<h3>Auto-veto has <span class="text-danger">banned</span> <strong>'+faceitHelper.userSettings.arrayMapOrder[i] + '</strong></h3>');
			                    faceitHelper.debug.log("Auto-veto has banned map " + faceitHelper.userSettings.arrayMapOrder[i]);
			                }
			            });
		        	}
		        }, 1000);
			}
		},
		OnTeamMemberElementUpdate: function() {
			// Say goodbye if we not in active match room
			if(!faceitHelper.userInMatchRoom()) {
				return;
			}

			// Check if injected element exist by counting class
			if(faceitHelper.lobbyStats.isInjected()){
				return;
			}

			var roomID = faceitHelper.lobbyStats.getRoomGUID();
			faceitHelper.debug.log("Retrived RoomID: " + roomID);

			faceitHelper.globalstate.user.currentGame = window.location.pathname.split('/')[2];
			faceitHelper.debug.log("User currentGame: " + faceitHelper.globalstate.user.currentGame);
			// Check if we get 10 enough player data for this room
			if(!faceitHelper.lobbyStats.isDataReady(roomID)) {
				// fetch data and wait to be called on next update
				faceitHelper.lobbyStats.fetchData();
				return;
			}

			// Begin the injection of script
			faceitHelper.lobbyStats.injectContent();
		}
	},
    lobbyStats: {
		statsReady: false,
		fetchData: function() {
			// Do action here
			var playerList = faceitHelper.lobbyStats.fetchPlayerlist();
			if(playerList.length != 10) {
				faceitHelper.debug.log("[fetchData] Warning: playerList.length:" + playerList.length + ", insufficient data to process.");
			}

			var profileData = [];
			var playerStatsQueries = [];
			var totalGames = [];
			var averageData = [];
			var teamData = [];

			faceitHelper.lobbyStats.data = {};


			var roomID = faceitHelper.lobbyStats.getRoomGUID();
			for (var i = 0; i < playerList.length; i++) {
				//Initializing players
				faceitHelper.lobbyStats.data[playerList[i]] = new faceitHelper.playerRoomInfo.playerRoomInfo(playerList[i]);

				//Player stats
				playerStatsQueries.push(
						$.get('https://api.faceit.com/api/users/'+playerList[i], function(userProfile) {
							userProfile = userProfile.payload;

							var playerElo = faceitHelper.getFaceitEloFromGame(userProfile.games, faceitHelper.globalstate.user.currentGame);
							var playerSkillLabel = faceitHelper.getFaceitSkillLabelFromGame(userProfile.games, faceitHelper.globalstate.user.currentGame);
							profileData.push({
								id: userProfile.guid,
								roomid: roomID,
								nickname: userProfile.nickname,
								country:  userProfile.country,
								country_flag: 'https://cdn.faceit.com/frontend/231/assets/images/flags/' + userProfile.country.toUpperCase() + '.png',
								elo: playerElo,
								skill_level: 'https://cdn.faceit.com/frontend/231/assets/images/skill-icons/skill_level_'+playerSkillLabel+'_sm.png'
							});
						}, "json")
					);

				//Total games:
				playerStatsQueries.push(
					$.get('https://api.faceit.com/stats/api/v1/stats/users/'+playerList[i]+'/games/'+faceitHelper.globalstate.user.currentGame, function(amountGamesData) {
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
					$.get("https://api.faceit.com/stats/api/v1/stats/time/users/" + playerList[i] + "/games/"+faceitHelper.globalstate.user.currentGame+"?size=10", function(userMatchData) {
						//no stats recoreded
						if(userMatchData.length == 0) {
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
			                if(userMatchData[m].i2 === userMatchData[m].teamId) {
						        wins++;
			                    if(coherent) {
									winstreak++;
								}
						    } else {
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
				faceitHelper.debug.log("[fetchData] Fetch data completed");
				faceitHelper.debug.log("[fetchData] Merging lists into players");

				profileData.forEach(function (player) {
				faceitHelper.lobbyStats.data[player.id].parseProfileData(player);
			});

			totalGames.forEach(function (player) {
				faceitHelper.lobbyStats.data[player.id].parseTotalGames(player);
			});

			averageData.forEach(function (player) {
				faceitHelper.lobbyStats.data[player.id].parseAverageData(player);
			});
			teamData.forEach(function (player) {
				faceitHelper.lobbyStats.data[player.id].parseTeamData(player);
			});

			faceitHelper.debug.log("[fetchData] Requesting content inject.");
				faceitHelper.lobbyStats.injectContent();
			});

		},
		isInjected: function() {
			var injectCount = $('.helper-stats');
			return injectCount.length > 0;
		},
		isDataReady: function(roomID) {
			var validResult = 0;
			for(var key in faceitHelper.lobbyStats.data) {
				if(faceitHelper.lobbyStats.data[key].roomid == roomID) {
					validResult++;
				}
			}
			return validResult >= 10;
		},
		getRoomGUID: function() {
			if(!faceitHelper.userInMatchRoom()) {
				return false;
			}
			var matchScope = angular.element('.match-vs').scope();
			if(!matchScope) {
				return false;
			}
			return matchScope.match.guid;
		},
		fetchPlayerlist: function() {
			/*
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

			if(fraction1.length + fraction2.length != matchScope.match.team_size * 2) {
				return false;
			}

			for(var i=0;i<fraction1.length;i++) {
				matchPlayers.push(fraction1[i].guid);
			}
			for(var i=0;i<fraction2.length;i++) {
				matchPlayers.push(fraction2[i].guid);
			}
			faceitHelper.debug.log("[fetchPlayerlist] Pulled " + matchPlayers.length + " data from player list");
			return matchPlayers;*/
			return angular.element('.match-vs').scope().match.joined_players;

		},
		injectContent: function() {

		if($('#fh-steam').length == 0 ) {
			$('.page-title__actions')
			.prepend($('<a/>', { class: "btn btn-sm btn-default", id: "fh-steam" , href: "http://steamcommunity.com/groups/faceithelper", target: "_blank"})
			.append( $('<i/>', {class: "icon-ic-social-steam"}))
			.append(' FACEIT HELPER GROUP'));

			//show average teamElo
			var faction1 = 0;
			var faction1Count = 0;
			var faction2 = 0;
			var faction2Count = 0;
			for(var key in faceitHelper.lobbyStats.data){
				var player = faceitHelper.lobbyStats.data[key];
				if(player.faction == 1) {
					faction1 += player.elo;
					faction1Count++;
				}
				if(player.faction == 2) {
					faction2 += player.elo;
					faction2Count++;
				}
			}
			faction1 = Math.round(faction1/faction1Count);
			faction2 = Math.round(faction2/faction2Count);

			$("h3[ng-bind='::nickname']" ).first().append(document.createTextNode(" - AVERAGE ELO:" + faction1));
			$("h3[ng-bind='::nickname']" ).last().append(document.createTextNode(" - AVERAGE ELO:" + faction2));
		}


			var matchScope = angular.element('.match-vs').scope();

			var matchPlayers = $(".match-team-member.match-team-member--team");

			faceitHelper.debug.log("[injectContent] lobbyStats.data.length: " + faceitHelper.lobbyStats.data.length);
			var lobbies = [];
			for(var key in faceitHelper.lobbyStats.data){ // Data length
				for (var j = 0; j < matchPlayers.length; j++) { // DOM Content team member length
					var name = $(matchPlayers[j]).find('strong[ng-bind="::teamMember.nickname"]').text();
					var state = $(matchPlayers[j]).find("span").hasClass("helper-stats");
					if(name == faceitHelper.lobbyStats.data[key].nickname && !state) {
						// Our targered users for this loop
							var flag_style = $(matchPlayers[j]).find('.match-team-member__details').hasClass('match-team-member__details--right') ? "left:initial;right:0;" : "right:initial;left:0;";
							$(matchPlayers[j]).find('.match-team-member__details__skill')
								.after($('<div>', { class: "match-team-member__details__skill player_flag faction"+faceitHelper.lobbyStats.data[key].fraction, style: flag_style }).append($('<img>', { src: faceitHelper.lobbyStats.data[key].country_flag, class: "flag flag--16 skill-icon", onerror: "faceitHelper.imgLoadError(this, 'country')" })));
							$(matchPlayers[j]).find('.match-team-member__details__name > div')
								.append($('<br>')).append($('<strong>', { text: "ELO: " + faceitHelper.lobbyStats.data[key].elo, class: "text-info" }));

							$(matchPlayers[j]).find('.skill-icon.ng-scope').attr({src: faceitHelper.lobbyStats.data[key].skill_level , onerror: "faceitHelper.imgLoadError(this, 'skills')"});
							var partyid = faceitHelper.lobbyStats.data[key].party_id;
							if(partyid == null) {
								partyid = lobbies.length;
								lobbies.push(partyid);
							} else {
							    if (lobbies.indexOf(partyid) == -1) {
									lobbies.push(partyid);
								}
							}
							var colors = [0, 60, 120, 180, 240, 300, 30, 270, 210, 90];
						    var inRange = colors[lobbies.indexOf(partyid)];

						    //http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
						    var rgb = global.HSVtoRGB(inRange , 0.4, 0.6);
						    var color = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
							var border = (faceitHelper.lobbyStats.data[key].faction == 1 ) ? "left" : "right";
							$(matchPlayers[j]).css("border-" + border, "3px solid " + color);

							if(faceitHelper.userSettings.showStats) {
								var container = $("<div>").css({'border-top' : '1px solid #e2e4e6','padding' : '3px 2px 2px 5px'});
								var statCss = {'margin' : '0', 'padding' : '0', 'width' : '100%'};
								var winNode = $("<p>").css(statCss).html("Wins: <strong>" + faceitHelper.lobbyStats.data[key].wins + "</strong> - Winstreak: <strong>" + faceitHelper.lobbyStats.data[key].winstreak + "</strong>");
								var statNode = $("<p>").css(statCss).html("Avg. kills: <strong>" + faceitHelper.lobbyStats.data[key].avgKills + "</strong> - Avg. hs%: <strong>" + faceitHelper.lobbyStats.data[key].avgHsPer + "</strong>");
								var statNode2 = $("<p>").css(statCss).html("Avg. K/R: <strong>" + faceitHelper.lobbyStats.data[key].avgKRRatio + "</strong> - Games: <strong>" + faceitHelper.lobbyStats.data[key].totalGames + "</strong>");

	                   			container.append(winNode);
	                   			container.append(statNode);
	                   			container.append(statNode2);

	                   			$(matchPlayers[j]).append(container);
							}
					}

					if(name == "Poheart") {
						var badge = $(".dev-badge");
						if(badge.length <= 0) {
							$(matchPlayers[j]).find(".match-team-member__details__name > div")
								.prepend($('<span/>', { class: "label label-info dev-badge", text: "FACEIT HELPER DEV", style: "background-color:#9B59B6" } ));
						}
					}

				}
				if(faceitHelper.globalstate.get.match() == "captain_pick") {
					$(".match-vote-item__name").each(function() {
			                if ($(this).text() == faceitHelper.lobbyStats.data[key].nickname) {
			                    $(this).prepend($("<img>", {src: faceitHelper.lobbyStats.data[key].skill_level}));
			                    $(this).append(document.createTextNode(" - ELO: " + faceitHelper.lobbyStats.data[key].elo));
			                }
			        });
				}
			}
			faceitHelper.debug.log("[injectContent] Run success.");

		},
		data: []
	},
    playerRoomInfo: {
		playerRoomInfo: function(id) {
			this.id = id;
			this.roomid;
			this.nickname;
			this.county;
			this.country_flag;
			this.party_id;
			this.elo;
			this.skill_level;
			this.totalGames = 0;
			this.avgKills = 0;
			this.avgHsPer = 0;
			this.avgKRRatio = 0;
			this.wins = 0;
			this.winstreak = 0;
			this.teamId;
			this.faction;

			this.parseProfileData = function(data) {
				this.roomid = data.roomid;
		        this.nickname = data.nickname;
		        this.country = data.country;
		        this.country_flag = data.country_flag;
		        this.elo = data.elo;
		        this.skill_level = data.skill_level;
			}

			this.parseTotalGames = function(data) {
				this.totalGames = data.totalGames;
			}

			this.parseAverageData = function(data) {
				this.avgKills = data.avgKills;
				this.avgHsPer = data.avgHsPer;
				this.avgKRRatio = data.avgKRRatio;
				this.wins = data.wins;
				this.winstreak = data.winstreak
			}

			this.parseTeamData = function(data) {
				this.party_id = data.team;
				this.faction = data.faction;
			}
		}
	}
};

faceitHelper.playerRoomInfo.playerRoomInfo.prototype.toString = function() {
	return "id: " + this.id + " roomId: " + roomId + " nickname: "+ this.nickname + " country: " + this.country + " party_id: " + party_id + " elo: " + this.elo + " totalGames: " + this.totalGames + " avgKills: " + this.avgKills + " avgHsPer: " + this.avgHsPer + " avgKRRatio: " + this.avgKRRatio + " wins: " + this.wins + " winstreak: " + this.winstreak + " teamId: " + this.teamId + " faction: " + this.faction;
}

document.addEventListener('FH_returnMapsPreference', function(e) {
	// if array is not set.
	if(!e.detail.arrayMapOrder) {
		// Give some default setting
		faceitHelper.userSettings.arrayMapOrder= "de_dust2>de_cache>de_mirage>de_nuke>de_cbble>de_inferno>de_train>de_overpass>";
	}
	faceitHelper.userSettings.arrayMapOrder = e.detail.arrayMapOrder.split(">");
});

angular.element(document).ready(function () {
	faceitHelper.init();


	// Watch for user stage change
	faceitHelper.$scope.$watch(
		function () {
			var queueScope = angular.element('.queue--sm').scope();
			if(queueScope && queueScope != null) {
				return queueScope.stage;
			}
		},
		function(newValue, oldValue) {
			faceitHelper.dispatchStateChange(newValue, oldValue, "user");
		}
	);

	// Watch for match state change
	faceitHelper.$scope.$watch(
		function () {
			var matchScope = angular.element('.full-hr').scope();
			if(matchScope && matchScope.match != null) {
				return matchScope.match.state;
			}
		},
		function(newValue, oldValue) {
			faceitHelper.dispatchStateChange(newValue, oldValue, "match");
		}
	);

	// Watch for match room action change while in same state(e.g: map veto)
	faceitHelper.$scope.$watch(
		function () {
			var matchVoteScope = angular.element('.match-vs').scope();
			if(matchVoteScope) {
				return matchVoteScope.isCurrentUserVoting;
			}
		},
		function(newValue, oldValue) {
			setTimeout(function() {
				faceitHelper.dispatchStateChange(newValue, oldValue, "match_actionUpdate");
			}, 2000);
		}
	);

	// Prevent injected information being deleted on lobby page
	faceitHelper.$scope.$watch(function () {
			var teamMemberScope = angular.element('match-team-member > div').scope();
			if(teamMemberScope && teamMemberScope != null && faceitHelper.userInMatchRoom()) {
				return teamMemberScope;
			}
		},
		function(newValue, oldValue) {
			faceitHelper.dispatchStateChange(newValue, oldValue, "members_elementupdate");
		}
	);
});
