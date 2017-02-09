/*****************************************************************************************************
*****************************************************************************************************
init
*****************************************************************************************************
*****************************************************************************************************/

var sound = [
  new Audio( "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3" ),
  new Audio( "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3" ),
  new Audio( "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3" ),
  new Audio( "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3" )
];

var ui = {
  "all": "#game #board .button, #dash #control #start, #dash #control #strict",
  "power": "#dash #control #power",
  "strict": "#dash #control #strict",
  "start": "#dash #control #start",
  "counter": "#dash #control #counter"
}

var cfg = {
  "power": false,
  "strict": false,
  "start": false,
  "counter": 0
}

var game = {
  "seq": [],
  "user": [],
  "index": 0,
  "timeout": 0
}

/*****************************************************************************************************
*****************************************************************************************************
ui & States
*****************************************************************************************************
*****************************************************************************************************/

$( document ).ready( function() {

  $( ui.power ).click( function() {
    cfg.power = ( cfg.power ? false : true );
    cfg.strict = false;
    cfg.started = false;
    cfg.counter = 0;
    renderUI();
  } );

  $( ui.strict ).click( function() {
    cfg.strict = ( cfg.strict ? false : true );
    renderUI();
    console.log( cfg, game );
  } );

  $( ui.start ).click( function() {
    cfg.start = ( cfg.start ? false : true );
    game.seq = [];
    game.user = [];
    game.index = 0;
    game.timeout = 0;
    renderUI();
    nextCycle();
  } );

  function renderUI() {
    if ( cfg.power ) {
      $( ui.all ).removeClass( "is-disabled" );
      if ( cfg.strict ) {
        $( ui.strict ).addClass( "is-focused" );
      } else {
        $( ui.strict ).removeClass( "is-focused" );
      }
      if ( cfg.start ) {
        $( ui.start ).addClass( "is-focused" );
        $( ui.counter ).val( twoDigit( cfg.counter ) );
      } else {
        $( ui.start ).removeClass( "is-focused" );
        $( ui.counter ).val( "--" );
      }
    } else {
      $( ui.all ).addClass( "is-disabled" );
      $( ui.strict ).removeClass( "is-focused" );
      $( ui.start ).removeClass( "is-focused" );
      $( ui.counter ).val( "" );
    }
  }

  /*****************************************************************************************************
  *****************************************************************************************************
  game
  *****************************************************************************************************
  *****************************************************************************************************/

  function nextCycle() {
    if ( cfg.power && cfg.start ) {
      var rand = getRand();
      cfg.counter++;
      game.seq.push( rand );
      game.index = 0;
      renderUI();
      setTimeout( seqCycle, 1000 );
    }
  }

  function addSeq() {
    var rand = getRand();
    game.seq.push( rand );

  }
  function seqCycle() {
    if ( cfg.power && cfg.start ) {
      if ( game.index === cfg.counter ) {
        userCycle();
      } else {
        game.index++;
        playKey( game.seq[ game.index ] );
        console.log( rand, game.index, cfg.counter )
        setTimeout( seqCycle, 1000 );
      }
    }
  }

  function userCycle() {
    console.log( cfg, game );
    nextCycle();
  }

  /*****************************************************************************************************
  *****************************************************************************************************
  misc
  *****************************************************************************************************
  *****************************************************************************************************/

  function twoDigit( str ) {
    return ( "0" + str ).slice( -2 );
  }

  function getRand() { // 0, 1, 2, or 3
    return Math.floor( Math.random() * 4 );
  }

  function playKey( key ) {
    sound[ key ].play();
  }

} );
