window.onload = function() {
  // setup variables
  var sessionTime = $('#session-time'),
    breakTime = $('#break-time'),
    minus = $('#minus'),
    minusBreak = $('#minus-break'),
    plus = $('#plus'),
    plusBreak = $('#plus-break'),
    clock = $('#clock'),
    start = $('#start'),
    resume = $('#resume'),
    pause = $('#pause'),
    reset = $('#reset'),
    isPaused = false,
    isBreak = false,
    breakAudio = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/25240/arpeggio.mp3'),
    sessionAudio = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/25240/good-news.mp3');

  // Setup inital button visibility
  resume.hide();
  pause.hide();
  reset.hide();

  // Event listeners for setting up session and break time
  minus.click(function() {
    var newTime = minusTime(sessionTime);
    sessionTime.text(newTime);
    clock.text(newTime);
  });
  minusBreak.click(function() {
    var newTime = minusTime(breakTime);
    breakTime.text(newTime);
  });
  plus.click(function() {
    var newTime = plusTime(sessionTime);
    sessionTime.text(newTime);
    clock.text(newTime);
  });
  plusBreak.click(function() {
    var newTime = plusTime(breakTime);
    breakTime.text(newTime);
  });
  
  // Helper functions for repeated code
  function minusTime(time){
    if(time.text() > 1){
      var newTime = parseInt(time.text()) - 1;
      return newTime;
    }
  }
  function plusTime(time){
    if(time.text() < 45 ){
      var newTime = parseInt(time.text()) + 1;
      return newTime;
    }
  }
  
  // Event listener for controls
  start.click(function() {
    startTimer();
  });
  pause.click(function() {
    isPaused = true;
    pause.hide();
    resume.show();
  });
  resume.click(function() {
    isPaused = false;
    resume.hide();
    pause.show();
  })
  reset.click(function() {
    resetTimer();
  });
  
  // Function that resets the timer to the current session length. 
  function resetTimer() {
    clearTimeout(pomodoro);
    clock.text(sessionTime.text());
    isPaused = false;
    clock.css('color', '#333');
    start.show();
    resume.hide();
    pause.hide();
    reset.hide();
  }
  
  // This function fires off when the session timer is done.
  // It plays the session done audio and sets up and starts the break.
  function setupBreak() {
    breakAudio.play();
    clearTimeout(pomodoro);
    clock.text(breakTime.text());
    isBreak = true;
    startTimer();
  }
  
  // Similarly this function fires off when the break timer is done.
  function setupSession() {
    sessionAudio.play();
    clearTimeout(pomodoro);
    clock.text(sessionTime.text());
    isBreak = false;
    startTimer();
  }
  
  
  // The guts of the clock. 
  function startTimer() {
    // Changes button visibility
    start.hide();
    pause.show();
    reset.show();
    // Disables and enabled the setup bottons based on if during a session or break
    if (!isBreak) {
      $('.set-session button').prop('disabled', false);
      $('.set-break button').prop('disabled', false);
    } else {
      $('.set-break button').prop('disabled', true);
      $('.set-session button').prop('disabled', true);
    }
    // sets up the timer variable, pulling the number of minutes from the clock div
    var timer = clock.text() * 60, minutes, seconds;
    
    // starts the timer
    pomodoro = setInterval(function() {
      if (!isPaused) {
        // converts the timer into minutes a seconds
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        
        // ternary operator to add a preceeding zero if applicable
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        
        // renders the clock
        clock.text(minutes + ":" + seconds);
        
        // changes the clock color to red in the final minute
        if (minutes == 0) {
          clock.css('color', '#D32F2F');
        }
        
        // when the clock runs out
        if (--timer < 0) {
          // resets clock color
          clock.css('color', '#333');
          // sets up the next clock based on the isBreak variable
          if (!isBreak) {
            setupBreak();
          } else {
            setupSession();
          }
        }
      }
    }, 1000);
  }

}