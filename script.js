// Initialize a new Chess game using Chess.js
var game = new Chess();

// Declare the board variable that will hold the Chessboard.js board instance
var board = null;

/**
 * This function is called when a piece is picked up.
 * It prevents moving pieces if the game is over or if the wrong piece is picked up.
 */
function onDragStart(source, piece, position, orientation) {
  // Do not pick up pieces if the game is over
  if (game.game_over()) return false;

  // Only allow moves for the side whose turn it is
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
}

/**
 * This function is called when a piece is dropped.
 * It validates the move and updates the game state.
 */
function onDrop(source, target) {
  // Try to make the move with a default promotion to queen
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // Automatically promote to a queen for simplicity
  });

  // If move is illegal, snap the piece back to its original square
  if (move === null) return 'snapback';

  // Update game status and move history
  updateStatus();
}

/**
 * Called after the piece snap for smooth piece placement.
 */
function onSnapEnd() {
  board.position(game.fen());
}

/**
 * Updates the game status message and move history.
 */
function updateStatus() {
  var status = '';
  var moveColor = (game.turn() === 'w') ? 'White' : 'Black';

  // Check for checkmate, draw, or normal play
  if (game.in_checkmate()) {
    status = 'Game over, ' + (game.turn() === 'w' ? 'Black' : 'White') + ' wins by checkmate!';
  } else if (game.in_draw()) {
    status = 'Game over, drawn position';
  } else {
    status = moveColor + ' to move';

    // If in check, notify the player
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check';
    }
  }

  // Update the status message in the HTML
  $('#status').html(status);

  // Update move history (using an ordered list)
  var history = game.history();
  var movesHtml = '';
  for (var i = 0; i < history.length; i++) {
    movesHtml += '<li>' + history[i] + '</li>';
  }
  $('#moves').html(movesHtml);
}

/**
 * Configuration object for Chessboard.js.
 */
var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};

// Initialize the chessboard
board = Chessboard('board', config);

// Update the initial status message
updateStatus();

// Event listener for the Reset button to restart the game
$('#resetButton').on('click', function() {
  game.reset();
  board.start();
  updateStatus();
});
