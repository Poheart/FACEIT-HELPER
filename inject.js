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

/**********************************************************************
					Array, Functions, variable declaration
***********************************************************************/
var userSettings = {
	bDebugMode: true,
	bAutoAccept: false,
	bAutoCopy: false,
	bAutoVeto: false,
	bPremium: false,
	bMatchedPlayers: false,
	arrayMapOrder: { }
}

var debug = {
	log: function(msg) {
		if(userSettings.bDebugMode) {
			console.log('%c [DEBUG]' + msg, 'background: #222; color: #bada55');
		}
	}
}
var globalState = {
	match: {currentState: "", lastState: ""},
	user: {currentState: "", lastState: ""},
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
var buttons = [
	{
		id: "btnAutoAccept",
		icon: "icon-ic_check_generic",
		text: "Auto-Accept ",
		stateId: "sAutoAccept",
		action: function() {
			userSettings.bAutoAccept = !userSettings.bAutoAccept;
			localStorage.bAutoAccept = userSettings.bAutoAccept;

			var txtState = userSettings.bAutoAccept ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
		    $("#sAutoAccept").html(txtState);
		}
	},
	{
		id: "btnAutoCopy",
		icon: "icon-clipboard_icon",
		text: "Autocopy IP ",
		stateId: "sAutoCopy",
		action: function() {
			userSettings.bAutoCopy = !userSettings.bAutoCopy;
			localStorage.bAutoCopy = userSettings.bAutoCopy;

			var txtState = userSettings.bAutoCopy ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
		    $("#sAutoCopy").html(txtState);
		}
	},
	{
		id: "btnAutoVeto",
		icon: "icon-map",
		text: "Auto-Veto ",
		stateId: "sAutoVeto",
		action: function() {
			userSettings.bAutoVeto = !userSettings.bAutoVeto;
			localStorage.bAutoVeto = userSettings.bAutoVeto;

			var txtState = userSettings.bAutoVeto ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
		    $("#sAutoVeto").html(txtState);
		}
	},
	{
		id: "btnPremium",
		icon: "icon-ic_verified_user_black_48px",
		text: "Premium ",
		stateId: "sPremium",
		action: function() {
			userSettings.bPremium = !userSettings.bPremium;
			localStorage.bPremium = userSettings.bPremium;
			helper.sendNotification('<span class="text-info"><strong>'+
			'Setting will be applied and effective on next page refresh...<br>(Ctrl+R/F5)</strong><br>'+
			'</span>');

			var txtState = userSettings.bPremium ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
		    $("#sPremium").html(txtState);
		}
	},
	{
		id: "btnMatchedPlayers",
		icon: "icon-ic_navigation_party_48px",
		text: "Show Matched Players ",
		stateId: "sMatchedPlayers",
		action: function() {
			userSettings.bMatchedPlayers = !userSettings.bMatchedPlayers;
			localStorage.bMatchedPlayers = userSettings.bMatchedPlayers;

			var txtState = userSettings.bMatchedPlayers ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
		    $("#sMatchedPlayers").html(txtState);
		}
	},
	{
		id: "btnAutoJoin",
		icon: "icon-ic_navigation_friends_48px",
		text: "Auto-Join Server ",
		stateId: "sAutoJoin",
		action: function() {
			userSettings.bAutoJoin = !userSettings.bAutoJoin;
			localStorage.bAutoJoin = userSettings.bAutoJoin;

			if(userSettings.bAutoJoin) {
				helper.sendNotification('<strong><span class="text-success">'+
			'Auto-Join Enabled</span><hr><small>The game will be launched via new Steam protocol connect command released on 10/6/2016'+
			'<br>(Without causing FPS drop)</small>'+
			'</strong>');
			}

			var txtState = userSettings.bAutoJoin ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
		    $("#sAutoJoin").html(txtState);
		}
	}
];

var helper = {
	UpdateButtons: function() {
		// TODO: Remove this but make the thing that refeers to it work
		var txtState;
	    txtState = userSettings.bAutoAccept ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
	    $("#sAutoAccept").html(txtState);

	    txtState = userSettings.bAutoCopy ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
	    $("#sAutoCopy").html(txtState);

		txtState = userSettings.bAutoVeto ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
		$("#sAutoVeto").html(txtState);

	    txtState = userSettings.bPremium ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
	    $("#sPremium").html(txtState);

	    txtState = userSettings.bMatchedPlayers ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
	    $("#sMatchedPlayers").html(txtState);

	    txtState = userSettings.bAutoJoin ? $('<span/>',{class:"text-success",text:"Enabled"}) : $('<span/>',{class:"text-danger",text:"Disabled"});
	    $("#sAutoJoin").html(txtState);
	},
	CopyToClipboard: function(text) {
		document.dispatchEvent(new CustomEvent('FH_copyServerIP', {
	        detail:  { serverIP : text }
	    }));
	},
	AcceptMatch: function() {
		// Some people reported checkIn(); will cause modal bug
		// Using legacy method for now...
		var acceptBtn = $('.modal-dialog__header__title[translate-once="MATCH-READY"]').parent().parent().find('button[translate-once="ACCEPT"]');
    	acceptBtn.click();
    	helper.sendNotification('<span class="text-info"><strong>'+
                'has accepted the match for you'+
                '</span></strong>');
	},
	pageRefresh: function() {
		angular.reloadWithDebugInfo();
	},
	sendNotification: function(messages, showTitle=true, debugMode=false) {
		if(debugMode && !userSettings.bDebugMode) {
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
            helper.sendNotification('<span class="text-warning"><strong>'+
                'is now queuing for a match...</strong><br>'+
                '</span>');
        }
		// You have been placed in queue..etc
	},
	appendPlayerList: function() {
		if($('#player_list').length > 0 ) {
			return;
		}
		var joined_players = angular.element('.queue--sm').scope().quickMatch.joined_players;
		$('.modal-dialog__actions').append('<hr><strong class="text-center">Players in this room</strong><ul id="player_list" class="list-unstyled"></ul>');
		for (var i = 0; i < joined_players.length; i++) {
			$.get('https://api.faceit.com/api/users/'+joined_players[i], function(e) {
				var list = $('<li/>').addClass("text-left")
					.append($('<i/>', { id: e.payload.guid, class: "icon-ic_state_checkmark_48px icon-md" }))
					.append('<img src="https://cdn.faceit.com/frontend/231/assets/images/skill-icons/skill_level_'+
				e.payload.csgo_skill_level_label+'_sm.png">')
					.append($('<strong/>', {id: e.payload.guid , text: e.payload.nickname})).append(' - ELO: '+ e.payload.games.csgo.faceit_elo+' - '+ e.payload.membership.type +'</li>');

				$('#player_list').append(list);
			}, "json");
		}
		setTimeout(function() {
			helper.timerCheckAcceptedPlayers(globalState.user.currentState);
		}, 1000);
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
	        	if(userSettings.bAutoJoin) {
		        	helper.sendNotification('<br><span class="text-success"><strong>'+
			                        '<h2>AUTO JOINNING THE GAME SERVER</h2></span><h3>Please wait....</h3><small>Your game will be started shortly</small>'+
			                        '</strong>');
		            helper.joinServer(serverIP);
		            $("#joinWarning").html('<h2><strong class="text-success"><center>YOU WILL BE CONNECTED TO THE SERVER MOMENTARILY</center></strong></h2>');
		        } else {
		        	helper.sendNotification('<br><span class="text-danger"><strong>'+
		                        '<h2>Auto-Join cancelled</h2></span>'+
		                        '</strong>');
		        	$("#joinWarning").html('<h2><strong class="text-danger"><center>AUTOJOIN CANCELLED</center></strong></h2>');

		        }
	        }
	    }, 1000);
	},
	initMatchRoom: function() {
		var matchPlayers = $(".match-team-member.match-team-member--team");
		for (var i = 0; i < matchPlayers.length; i++) {
			var name = $(matchPlayers[i]).find("strong").text();
			if(name == "Poheart") {
				var badge = $(".dev-badge");
				if(badge.length <= 0) {
					$(matchPlayers[i]).find(".match-team-member__details__name > div")
						.prepend($('<span/>', { class: "label label-info dev-badge", text: "FACEIT HELPER DEV", style: "background-color:#9B59B6" } ));
				}
			}
		}
	},
	userInMatchRoom: function() {
		return window.location.pathname.indexOf('/room/') != -1;
	}
}

// TODO: Set default in init?
document.addEventListener('FH_returnMapsPreference', function(e) {
	// if array is not set.
	if(!e.detail.arrayMapOrder) {
		// Give some default setting
		userSettings.arrayMapOrder= "de_dust2>de_cache>de_mirage>de_nuke>de_cbble>de_inferno>de_train>de_overpass>";
	} else {
		userSettings.arrayMapOrder = e.detail.arrayMapOrder.split(">");
	}
});

var helperSetting = {
	loadUserSettingsFromStorage: function() {
		userSettings.bAutoAccept = localStorage.bAutoAccept == "true" ? true : false;
		userSettings.bAutoCopy = localStorage.bAutoCopy == "true" ? true : false;
		userSettings.bAutoVeto = localStorage.bAutoVeto == "true" ? true : false;
		userSettings.bPremium = localStorage.bPremium == "true" ? true : false;
		userSettings.bMatchedPlayers = localStorage.bMatchedPlayers == "true" ? true : false;
		userSettings.bAutoJoin = localStorage.bAutoJoin == "true" ? true : false;
		// Fetch user map preferences
		helperSetting.fetchMapPreference();
	},
	fetchMapPreference: function() {
		document.dispatchEvent(new CustomEvent('FH_getMapsPreference'));
	},
	createButtons: function() {
		for (var i=0;i<buttons.length;i++) {
			var btnCreate = $('<li/>', { id: buttons[i].id })
				.append( $('<a/>')
				.append( $('<i/>').addClass("main-navigation__icon").addClass(buttons[i].icon) )
				.append( $('<span/>', { class: 'main-navigation__name', text: buttons[i].text })
				.append($('<span/>', { id: buttons[i].stateId }))))
				.attr('unselectable', 'on')
                .css('user-select', 'none')
                .on('selectstart', false);

			$('.main-navigation ul[ng-controller="NavigationController"]').append(btnCreate);
			btnCreate.bind("click",  buttons[i].action);
		}
		$('#helperDebug').bind("click", function() {
			userSettings.bDebugMode = !userSettings.bDebugMode;
			var Status = userSettings.bDebugMode ? 'enabled' : 'disabled';
			helper.sendNotification("Debuging mode " + Status + "!");
		});
		setTimeout(function() { helper.UpdateButtons(); }, 500);
	}
}

var eventStage = {
	OnUserStateChange: function(currentState, lastState) {
		// This function will be called when user stage changed from one to another
		debug.log("eventStage CURRENT USERSTATE:" + currentState + " & LAST:" + lastState);
		helper.sendNotification("<strong>eventStage</strong><br>NOW:" + currentState + "<BR>PAST:" +lastState, false, true);
		if(currentState == "CHECK_IN" || currentState == "WAITING") {
			if(userSettings.bMatchedPlayers) {
				setTimeout(function() {
					helper.appendPlayerList();
				}, 1500);
			}
		}

		// Perform action when under certain conditional
		if(currentState == "IN_QUEUE") {
			setTimeout(function() {
				helper.hideDialogBox();
			}, 200);

			if(lastState == "MATCH") {
				helper.sendNotification('<span class="text-danger"><strong>'+
                'will now refresh page to prevent match accept bug</strong><hr>'+
                'Attempting page refresh now...'+
                '</span>');
                setTimeout(function() {
                	helper.pageRefresh();
                }, 3000);
			}
		}

		if(currentState == "CHECK_IN") {
			if(userSettings.bAutoAccept) {
				helper.AcceptMatch();
			}
		}
	},

	OnMatchStateChange: function(currentState, lastState) {
		// This function will be called when match state changed from one to another
		helper.sendNotification("<strong>eventStage</strong><br>NOW:" + currentState + "<BR>PAST:" +lastState, false, true);
		debug.log("eventStage CURRENT MATCHSTATE:" + currentState+ " & LAST:" + lastState);

		if(currentState == "voting") {
			// Re-fetch the user voting preferences again
			helperSetting.fetchMapPreference();
		}

		if(currentState == "ready") {
			if(userSettings.bAutoCopy) {
				setTimeout(function() {
				var btnCopy = $('[clipboard]');
				// Check if there is any IP for us to copy
	                if(btnCopy.is(":visible") && btnCopy != null) {

	                    var serverIP = $('[ng-if="serverConnectData.active"] span[select-text]').text();
	                    debug.log("ServerIP is " + serverIP);
	                    helper.CopyToClipboard(serverIP);
	                    helper.sendNotification('<br><span class="text-success"><strong>'+
	                        'IP address copied to clipboard'+
	                        '</span></strong>');
	                }

            	}, 1000);
			}

			if(lastState == "configuring" && userSettings.bAutoJoin) {
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
		debug.log("Current user voting state is " + isCurrentUserVoting + " & userSettings.bAutoVeto:" + userSettings.bAutoVeto);
		if(isCurrentUserVoting && userSettings.bAutoVeto) {
			// Perform ban map
			setTimeout(function() {
				for(i=userSettings.arrayMapOrder.length - 1;i > 0 - 1;i--) {
		            var bSelected = false;
		            $(".match-vote-item__name").each(function() {
		                if ($(this).text() == userSettings.arrayMapOrder[i] && $(this).parent().find("button").is(":enabled") && !bSelected) {
		                    $(this).parent().find("button").click();
		                    bSelected = true;
		                    helper.sendNotification('<h3>Auto-veto has <span class="text-danger">banned</span> <strong>'+userSettings.arrayMapOrder[i] + '</strong></h3>');
		                    debug.log("Auto-veto has banned map " + userSettings.arrayMapOrder[i]);
		                }
		            });
	        	}
	        }, 1000);
		}
	}
}

/**********************************************************************
								Action
***********************************************************************/

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
		default:
			console.error("Unknown mode type caught on dispatchStdateChange");
			break;
	}
	if(helper.userInMatchRoom()) {
		setTimeout(function() { helper.initMatchRoom() }, 500);
	}
}
angular.element(document).ready(function () {
    // TODO: Place $watch here to look for stage(.queue--sm) && match.stage(.full-hr) changes DONE
    // TODO: Use HTML5 localStorage to store variable DONE
    // TODO: use array to store option setting DONE
    // TODO: Watch for match room update time and perform action (veto) DONE
	// http://stackoverflow.com/questions/15112584/using-scope-watch-and-scope-apply-in-angularjs
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
			dispatchStateChange(newValue, oldValue, "match_actionUpdate");
		}
	);

	// Fetch value from localStorage
	helperSetting.loadUserSettingsFromStorage();
	// Create button
	helperSetting.createButtons();
});
