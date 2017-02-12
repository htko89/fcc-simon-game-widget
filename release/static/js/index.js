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
  "game": "#game #board ",
  "disabled": "is-disabled",
  "pressed": "is-focused"
}

var cfg = {
  "power": false,
  "strict": false,
  "start": false,
  "user": false
}

var game = new cycle();

/*****************************************************************************************************
*****************************************************************************************************
inputs & states
*****************************************************************************************************
*****************************************************************************************************/

$( document ).ready( function() {

  $( ui.power ).click( function() {
    cfg.power = ( cfg.power ? false : true );
    cfg.strict = false;
    cfg.start = false;
    cfg.user = false;
    renderUI();
  } );

  $( ui.strict ).click( function() {
    cfg.strict = ( cfg.strict ? false : true );
    renderUI();
  } );

  $( ui.start ).click( function() {
    cfg.start = ( cfg.start ? false : true );
    cfg.user = false;
    if ( cfg.start ) {
      game = new cycle();
      game.start();
    }
    renderUI();
  } );

  $( ui.game + ".button" ).click( function() {
    game.user( parseInt( this.id, 10 ) );
  } );

} );

/*****************************************************************************************************
*****************************************************************************************************
game
*****************************************************************************************************
*****************************************************************************************************/

function cycle() {
  var parent = this;
  var user = false;
  var seq = [];
  var index = 0;
  var timer = 0;
  var timeWait = 1000;
  this.getCounter = function() {
    return seq.length;
  };
  this.start = function() { // start animation
    playCounter( 500, 0 );
    playCounter( 500, 1000 );
    setTimeout( parent.next, timeWait );
  };
  this.next = function() { // next cycle
    if ( cfg.power && cfg.start ) {
      if ( seq.length < 20 ) {
        console.log( "next" );
        index = 0;
        var key = getRand()
        seq.push( key );
        renderUI();
        setTimeout( parent.play, timeWait );
      } else {
        setTimeout( parent.win, timeWait );
      }
    }
  };
  this.play = function() { // play cycle
    if ( cfg.power && cfg.start ) {
      if ( index !== seq.length ) {
        console.log( "play" );
        playKey( seq[ index ], 500, 0 );
        index++;
        setTimeout( parent.play, timeWait );
      } else {
        index = 0;
        cfg.user = true;
        timer = setTimeout( parent.lose, 1000 * seq.length + timeWait );
      }
    }
  };
  this.user = function( key ) { // user input
    if ( cfg.power && cfg.start && cfg.user ) {
      if ( key === seq[ index ] ) {
        console.log( "user", key );
        playKey( key, 500, 0 );
        index++;
        if ( index === seq.length ) {
          cfg.user = false;
          setTimeout( parent.next, timeWait );
          clearTimeout( timer );
        }
      } else {
        cfg.user = false;
        parent.lose();
        clearTimeout( timer );
      }
    }
  };
  this.win = function() {
    if ( cfg.power && cfg.start ) {
      console.log( "win" );
      playKey( 3, 100, 0 );
      playKey( 2, 100, 100 );
      playKey( 1, 100, 200 );
      playKey( 0, 100, 300 );
    }
  }
  this.lose = function() {
    if ( cfg.power && cfg.start ) {
      cfg.user = false;
      console.log( "lose" );
      playKey( 0, 100, 0 );
      playKey( 1, 100, 100 );
      playKey( 2, 100, 200 );
      playKey( 3, 100, 300 );
      if ( !cfg.strict ) {
        index = 0;
        setTimeout( parent.play, timeWait );
      } else {
        cfg.start = false;
        renderUI();
      }
    }
  }
}

/*****************************************************************************************************
*****************************************************************************************************
ui
*****************************************************************************************************
*****************************************************************************************************/

function renderUI() {
  if ( cfg.power ) {
    $( ui.all ).removeClass( ui.disabled );
    if ( cfg.strict ) {
      $( ui.strict ).addClass( ui.pressed );
    } else {
      $( ui.strict ).removeClass( ui.pressed );
    }
    if ( cfg.start ) {
      $( ui.start ).addClass( ui.pressed );
      $( ui.counter ).val( twoDigit( game.getCounter() ) );
    } else {
      $( ui.start ).removeClass( ui.pressed );
      $( ui.counter ).val( "--" );
    }
  } else {
    $( ui.all ).addClass( ui.disabled );
    $( ui.strict ).removeClass( ui.pressed );
    $( ui.start ).removeClass( ui.pressed );
    $( ui.counter ).val( "" );
  }
}

function playKey( key, time, timeStart ) {
  setTimeout( function() {
    sound[ key ].play();
    $( ui.game + "#" + key ).addClass( ui.pressed );
    setTimeout( function() {
      $( ui.game + "#" + key ).removeClass( ui.pressed );
    }, time );
  }, timeStart );
}

function playCounter( time, timeStart ) {
  setTimeout( function() {
    $( ui.counter ).val( "" );
    setTimeout( function() {
      $( ui.counter ).val( "--" );
    }, time );
  }, timeStart );
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
