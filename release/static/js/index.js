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
  "counter": "#dash #control #counter",
  "game": "#game #board #"
}

var cfg = {
  "power": false,
  "strict": false,
  "start": false
}

var game = new cycle();

/*****************************************************************************************************
*****************************************************************************************************
ui & states
*****************************************************************************************************
*****************************************************************************************************/

$( document ).ready( function() {

  $( ui.power ).click( function() {
    cfg.power = ( cfg.power ? false : true );
    cfg.strict = false;
    cfg.started = false;
    renderUI();
  } );

  $( ui.strict ).click( function() {
    cfg.strict = ( cfg.strict ? false : true );
    renderUI();
  } );

  $( ui.start ).click( function() {
    cfg.start = ( cfg.start ? false : true );
    renderUI();
    if ( cfg.start ) {
      game = new cycle();
      game.next( true );
    }
  } );

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
      $( ui.counter ).val( twoDigit( game.getCounter() ) );
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

function cycle() {
  var parent = this;
  var seq = [];
  var user = [];
  var counter = 0;
  var index = 0;
  var timeout = 0;
  this.getCounter = function() {
    return counter;
  };
  this.next = function( reset ) { // next cycle
    if ( cfg.power && cfg.start ) {
      console.log( "next" );
      counter = ( reset ? 1 : counter + 1 );
      index = 0;
      seq.push( getRand() );
      renderUI();
      setTimeout( parent.play, 1000 );
    }
  };
  this.play = function() { // play cycle
    if ( cfg.power && cfg.start ) {
      if ( index === counter ) {
        index = 0;
        setTimeout( parent.user, 1000 );
      } else {
        console.log( "play" );
        sound[ seq[ index ] ].play();
        index++;
        setTimeout( parent.play, 1000 );
      }
    }
  };
  this.user = function( key ) { // user input
    if ( cfg.power && cfg.start ) {
      console.log( "user" );
      parent.next();
    }
  };
  this.end = function( inCounter ) { // timer cooldown
    if ( cfg.power && cfg.start ) {
      console.log( "end" );
    }
  }
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
