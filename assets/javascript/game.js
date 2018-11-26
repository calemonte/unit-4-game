$(document).ready(function() {

	// Array of objects containing four available characters. 
	var fruits = [
		{
			name: "apple",
			hp: 120,
			ap: 11,
			cap: 16,
			imgSrc: "assets/images/apple.png",
			altText: "Black and white illustration of an apple."
		},
		{
			name: "orange",
			hp: 130,
			ap: 10,
			cap: 15,
			imgSrc: "assets/images/orange.png",
			altText: "Black and white illustration of an orange."
		},
		{
			name: "strawberry",
			hp: 150,
			ap: 12,
			cap: 17,
			imgSrc: "assets/images/strawberry.png",
			altText: "Black and white illustration of a strawberry."

		},
		{
			name: "pear",
			hp: 160,
			ap: 15,
			cap: 16,
			imgSrc: "assets/images/pear.png",
			altText: "Black and white illustration of a pear."
		}
	];

	// Create variables that keep tabs on significant game events and values.
	var characterChosen = false;
	var opponentChosen = false;
	var opponentsDefeated = 0;
	var yourCharacter;
	var yourOpponent;
	var characterHP = 0;
	var characterBaseAP = 0;
	var characterAP = 0;
	var opponentHP = 0;
	var opponentCAP = 0;

	// Function that resets global variables, clears DOM, and displays fruits.
	function reset() {
		characterChosen = false;
		opponentChosen = false;
		opponentsDefeated = 0;
		yourCharacter;
		yourOpponent;
		characterHP = 0;
		characterBaseAP = 0;
		characterAP = 0;
		opponentHP = 0;
		opponentCAP = 0;

		// Hide attack button, game events, and graveyard at start of game.
		$("#attack-button").hide(); 
		$("#game-events").hide();
		$("#graveyard").hide();

		// Empty DOM values.
		$("#select-row, #your-characters-spot, #your-stats, #your-opponents-spot, #opponent-stats, #attack-comment, #counterattack-comment").empty();

		// Create fruit images with their own unique ids and data values.
		for (var i = 0; i < fruits.length; i++) {
			var fruitImage = $("<img>");
			fruitImage.addClass("fruit-select");
			fruitImage.attr({
				"src": fruits[i].imgSrc,
				"alt": fruits[i].altText,
				"data-name": fruits[i].name,
				"data-hp": fruits[i].hp,
				"data-ap": fruits[i].ap,
				"data-cap": fruits[i].cap
			});
		
		// Append fruits to the DOM.
		$("#select-row").append(fruitImage);
		}

		// Display select character text to start off game.
		$("#select-character-text").text("Select your fruit fighter!");

	};

	// Reset the game.
	reset();

	// Handle character and opponent selection.
	$(".fruit-select").on("click", function() {

		// Local variables for caching references.
		var $fruit = $(this);
		var $name = $(this).attr("data-name"); 

		// If nothing has been chosen, the first choice is your character.
		if (!characterChosen && !opponentChosen) {
			$fruit.attr("id", "your-character").removeClass("fruit-select");

			// Append fruit and its stats to your character location. 
			$("#your-characters-spot").append($fruit, [ $("<div id='your-stats'>" + "Health: " + $(this).attr('data-hp')+ "</div>") ]);
			yourCharacter = $name;

			// Set global variable for keeping tabs on character HP and AP.
			characterHP = ($("#your-character").attr("data-hp"));
			characterHP = parseInt(characterHP);
			characterBaseAP = ($("#your-character").attr("data-ap"));
			characterBaseAP = parseInt(characterBaseAP);
			characterAP = characterBaseAP;

			// Chararacter has now been selected.
			characterChosen = true;
			$("#select-character-text").text("Select your opponent!");

		// If your character has been chosen, then the next choice is your opponent.
		} else if (characterChosen && !opponentChosen && $fruit.hasClass("fruit-select")) {
			$fruit.attr("id", "your-opponent").removeClass("fruit-select");
			
			// Append fruit and its stats to opponent location. 
			$("#your-opponents-spot").append($fruit, [ $("<div id='opponent-stats'>" + "Health: " + $(this).attr('data-hp')+ "</div>") ]);
			yourOpponent = $name;
			
			// Set global variable for keeping tabs on character HP and AP.
			opponentHP = ($("#your-opponent").attr("data-hp"));
			opponentHP = parseInt(opponentHP);
			opponentCAP = ($("#your-opponent").attr("data-cap"));
			opponentCAP = parseInt(opponentCAP);

			// Display the attack button.
			$("#attack-button").show();
			
			// Opponent has now been selected.
			opponentChosen = true;
			$("#select-character-text").text("Fight!");

		} else {
			return false;
		}
	});
	// When user clicks attack, handle damage and health logic.
	$("#attack-button").on("click", function() {

		if (characterChosen && opponentChosen) {
			opponentHP -= characterAP;

			// Don't register opponent counter-attack if opponent dies first.
			if (opponentHP > 0) {
				characterHP -= opponentCAP;
			}

			// Update displayed stats.
			$("#your-stats").text("Health: " + characterHP);
			$("#opponent-stats").text("Health: " + opponentHP);

			// Display the attack values for your character and the opponent.
			$("#game-events").show();
			$("#attack-comment").text(yourCharacter.toUpperCase() + " attacked " +  yourOpponent.toUpperCase() + " for " + characterAP + " damage.");
			$("#counterattack-comment").text(yourOpponent.toUpperCase() + " counter-attacked " +  yourCharacter.toUpperCase() + " for " + opponentCAP + " damage.");

			// Add to character attack power.
			characterAP += characterBaseAP;

			// If attacker HP is less than or equal to 0 && opponent HP is greater than or equal to 0, attacker loses and the game is over. 
			if (characterHP <= 0) {
				// Empty attack comment.
				$("#attack-comment").empty();

				// Display counter-attack vicitory comment.
				$("#counterattack-comment").text(yourCharacter.toUpperCase() + " was defeated by " +  yourOpponent.toUpperCase() + ".");

				// Display you lost text.
				$("#select-character-text").text("Yikes! You got turned into " + yourCharacter + " jam." );
				
				// Create and display restart button. 
				$("#select-character-text").append($("<div>" + "<button id='restart'>" + "Try again!" + "</button>"));

				// Restart game if pressed.
				$("#restart").on("click", function() {
					location.reload();
				});

			} else if (opponentHP <= 0 && opponentsDefeated <= 3) {

				// Cache local reference to your current opponent.
				var $defeated = $("#your-opponent");

				// Show graveyard.
				$("#graveyard").show();

				// Remove old classes and append defeated fruit image to graveyard.
				$defeated.removeClass("combat-fruit-wrapper")
					.addClass("graveyard-item")
					.removeAttr("id");
				$("#graveyard-row").append($defeated);

				// Display defeated text.
				$("#attack-comment").text(yourCharacter.toUpperCase() + " defeated " +  yourOpponent.toUpperCase() + ".");

				// Empty counter-attack comment.
				$("#counterattack-comment").empty();

				// Clear opponent stats.
				$("#opponent-stats").remove();

				// Increment defeated tally.
				opponentsDefeated++;

				// Reset opponent chosen.
				opponentChosen = false;
				
				// Change text to select your opponent.
				$("#select-character-text").text("Select your next opponent!");
			}
		} else {
			alert("You need to select an opponent!");
		}

		// Handle end of game if all characters defeated.
		if (opponentsDefeated === 3) {

			// Display victory text.
			$("#select-character-text").text("Splendid! You're the fiercest fruit fighter around." );

			// Create and display restart button. 
			$("#select-character-text").append($("<div>" + "<button id='restart'>" + "Play again" + "</button>"));

			// Restart game if pressed.
			$("#restart").on("click", function() {
				location.reload();
			});
		}
	});
});