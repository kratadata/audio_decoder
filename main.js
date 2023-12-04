window.AudioContext = window.AudioContext || window.webkitAudioContext;

var line_Width = 2.5;
var line_WidthMin = 1;
var line_WidthMax = 5;
var line_WidthStep = 0.5;

var clear_Interval = 50;
var clear_IntervalMin = 10;
var clear_IntervalMax = 200;

var brightness_Level= 1;
var brightness_LevelMin = 0;
var brightness_LevelMax = 5;

var saturation_Level= 1;
var saturation_LevelMin = 0;
var saturation_LevelMax = 5;

let hFreq;
let vFreq;
let overScan;
let hOffset;
let pulseLength;

var blend_Lines = true;
var visible = true;

const changedEvent = new Event("changed");
let decoder;
let audioStarted = false

document.addEventListener( "DOMContentLoaded", _ => {
    let tv = document.getElementById( "tv" );
    decoder = new VC( tv,
        {
            //set options here
        } );

    tv.addEventListener( "click", _ => decoder.activate() );
    decoder.start().catch( console.error );
        
}, false );

document.addEventListener("changed", () => {
    decoder.setOptions({
        cl: clear_Interval,
        lw: line_Width,
        br: brightness_Level,
        sa: saturation_Level,
        bl: blend_Lines,
        hf: hFreq,
        vf: vFreq,
        os: overScan,
        hOffset: hOffset,
        pl: pulseLength

    });
    console.log(decoder);
});

function setup() {
    cvs = document.getElementById("tv")
    createCanvas(tv.width, tv.height)
    gui = createGui();
    gui.addGlobals('clear_Interval','line_Width','brightness_Level','saturation_Level','blend_Lines');
    getAudioContext().suspend();

      // input = select("#file-input");
    input = document.getElementById("file-input");
    input.addEventListener("change", handleFiles, false);
    
    noLoop();
  }
  
function draw() {
    document.dispatchEvent(changedEvent);
  }

  // check for keyboard events
function keyPressed() {
    visible = !visible;
    if(visible) gui.show(); else gui.hide();
}

function mousePressed() {
    if (!audioStarted) {
        userStartAudio();
        audioStarted = true;
    }
}

//add touchStarted() function to start audio on mobile
function touchStarted() {
    if (!audioStarted) {
        userStartAudio();
        audioStarted = true;
    }
}

//create handleFiles() function that will read json file
function handleFiles() {
    const fileList = this.files; /* now you can work with the file list */
    console.log(fileList[0]);
    const reader = new FileReader();
    reader.readAsText(fileList[0]);
    
    reader.onload = function (event) {
        const json = JSON.parse(event.target.result);
        hFreq = json.hf;
        vFreq = json.vf;
        overScan = json.os;
        hOffset = json.ho;
        pulseLength = json.pl;
        //dispatch event to update decoder
        document.dispatchEvent(changedEvent);
    }

}