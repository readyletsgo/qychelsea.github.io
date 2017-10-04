var queryResult;
var yoff = 0.0;

var textSizeLarge = 40;
var textSizeSmall = 14;
var screenNum =0;

var currentWeather, hourlyWeather, dailyWeather;
var backgroundColour = 190;

var check=0;

function setup() {
    createCanvas(640, 1136);
    background(backgroundColour);
    query();
}

function query() {
    var url= 'https://api.darksky.net/forecast/e1da4ae08ea5f7bb0c60853d974b98b0/42.361936, -71.097309';
//e1da4ae08ea5f7bb0c60853d974b98b0//436fdc35bab87ffdf2f6cf130fc5ddc5
    loadJSON(url, gotData, 'jsonp');
}


function gotData(data) {
    console.log(data);
    queryResult = data;

    currentWeather = queryResult.currently;
    hourlyWeather = queryResult.hourly.data;
    dailyWeather = queryResult.daily.data;

    drawHome();
}

function drawHome(){
    screenNum = 0;
    check = 0;
    var yPos = 350;
    var yGap = 200;
    background(backgroundColour);

    fill(255);
    textStyle(NORMAL);
    textAlign(CENTER);
    noStroke();

    var xPos = width/2;

    textSize(textSizeLarge);
    text("Currently",xPos, yPos);
    yPos+=yGap;
    text("Hourly",xPos, yPos);
    yPos+=yGap;
    text("Daily",xPos, yPos);
}
function mousePressed(){
    if (screenNum===0){
        if (mouseY>300&&mouseY<390){drawCurrent();}
        if (mouseY>500&&mouseY<590){drawHour();}
        if (mouseY>700&&mouseY<790){drawDay();}
    }else{
        if (mouseX>30&&mouseX<80&&mouseY>30&&mouseY<80){
            drawHome();
            check=1;
        }
    }
}

function drawCurrent(){
    screenNum = 1;
    var c1,c2;//c1 cloud cover; c2 temperature

    //var currentWeather = queryResult.currently;
    c1 = 255-Math.round(map(currentWeather.cloudCover,0,1,0,255));
    c1 = color(c1,c1,c1);

   c2 = currentWeather.temperature;
    var cNew = c2RGB(c2);
    setGradient(c1, cNew);
    setNoise();
    backLevel();
}

function drawHour(){
    screenNum = 2;

    var c1 = [],c2 = [],i,cr,cg,cb;//c1 cloud cover; c2 temperature
    for (i=1;i<=48; i++){
        c1[i] = 255-Math.round(map(hourlyWeather[i].cloudCover,0,1,0,255));
        c1[i] = color(c1[i],c1[i],c1[i]);
    }

    for (i=1;i<=48; i++){
        c2 [i] = Math.round(hourlyWeather[i].temperature);
    }
    var cNew = c2RGB(c2);
    setGradient(c1,cNew);
    backLevel();
    setNoise();
}

function drawDay(){
    screenNum = 3;

}

function setGradient(c1, c2) {
    noFill();
    var inter;
    var c,i;
    var xPos=0;

    if (screenNum === 1) {
        for (i = 0; i <= height; i++) {
            inter = map(i, 0, height, 0, 1);
            c = lerpColor(c1, c2, inter);
            stroke(c);
            line(0, i, width, i);
        }
    }
    if (screenNum === 2) {
        for (var h=1;h<=48;h++){
            for (i = 0; i <= height; i++){
                inter = map(i, 0, height, 0, 1);
                c = lerpColor(c1[h], c2[h], inter);
                stroke(c);
                line(xPos, i, width*(h)/48, i);
            }
            xPos = width*(h)/48;
        }

    }
}

function c2RGB(c2){
    var cr,cg,cb;
    var c2Mapped;
    if (screenNum ===1){
        c2Mapped = map(c2,18,90,0,1);
        if (c2Mapped>=0.75){cr=255;Math.round(cg =-764*c2Mapped+64); cb=0;}
        if (c2Mapped>=0.5&&c2Mapped<0.75){cr = Math.round(764*c2Mapped-382); cg = 255; cb = 0;}
        if (c2Mapped>=0.25&&c2Mapped<0.5){cr = 0;cg = 255; cb = Math.round(-764*c2Mapped+446);}
        if (c2Mapped<0.25){cr = 0;cg = Math.round(764*c2Mapped); cb = 255;}

        c2 = color(cr,cg,cb);
        return c2;}

    if (screenNum===2){
        for (var i = 1;i<=48;i++){
           // console.log("c2=",c2[i]);
            c2Mapped = map(c2[i],18,90,0,1);
            if (c2Mapped[i]>=0.75){cr=255;cg =Math.round(-764*c2Mapped[i]+64); cb=0;}
            if (c2Mapped[i]>=0.5&&c2Mapped[i]<0.75){cr = Math.round(764*c2Mapped[i]-382); cg = 255; cb = 0;}
            if (c2Mapped[i]>=0.25&&c2Mapped[i]<0.5){cr = 0;cg = 255; cb = Math.round(-764*c2Mapped[i]+446);}
            if (c2Mapped[i]<0.25){cr = 0;cg = Math.round(764*c2Mapped[i]); cb = 255;}
            c2[i]= color(cr,cg,cb);
            console.log(c2[i]);
        }
        return c2;
    }
}
/*if (c2[i]<66){cr=0;}
if (c2[i]>=66&&c2[i]<=80){cr=138;}
if (c2[i]>80){cr=255;}

if (c2[i]<40){cg=0;}
if (c2[i]>=40&&c2[i]<=54){cg=138;}
if (c2[i]>54){cg=255;}

if (c2[i]<58){cb=0;}
if (c2[i]>=58&&c2[i]<=66){cb=138;}
if (c2[i]>66){cb=255;}*/

function setNoise(){
    var precipProb,humidity;
    var pPos,hPos;
    var xoff = 0;
    var x, y;
    if (screenNum===1){
        var currentWeather = queryResult.currently;
        precipProb = currentWeather.precipProbability;
        humidity = currentWeather.humidity;
        pPos = map(precipProb,0,1,0,height);
        hPos = map(humidity,0,1,height,200);
        strokeWeight(6);
        stroke(255);
        beginShape();// We are going to draw a polygon out of the wave points

        for (x = 0; x <= width; x += 10) {  // Iterate over horizontal pixels
            y = map(noise(xoff, hPos), 0, 1, 80,height/6);// Calculate a y value according to noise, map to
            vertex(x, y+pPos*.8); // Set the vertex
            xoff += pPos;  // Increment x dimension for noise
        }
        //yoff += 0.1;  // increment y dimension for noise
        endShape();
        console.log(precipProb,humidity);
    }
    if (screenNum===2){
        var hourlyWeather = queryResult.hourly.data;
        var precipProbs = [], humidities = [];

        for (var i=1;i<=48;i++){
            precipProbs[i] = hourlyWeather[i].precipProbability;
            humidities[i] = hourlyWeather[i].humidity;
        }
        var strokeNum = 255;
        var trans = 255;



        for (i=1;i<=48;i+=3){
            beginShape();// We are going to draw a polygon out of the wave points
            strokeWeight(3);
            stroke(strokeNum,strokeNum,strokeNum,trans);
            trans = trans * 0.8;
            pPos = map(precipProbs[i],0,1,0,height);
            hPos = map(humidities[i],0,1,height,200);
            for (x = 0; x <= width; x += 10) {  // Iterate over horizontal pixels
                y = map(noise(xoff, hPos), 0, 1, 80,height/6);// Calculate a y value according to noise, map to
                vertex(x, y+pPos*.8); // Set the vertex
                xoff += .99;  // Increment x dimension for noise
            }
            yoff += 0.1;  // increment y dimension for noise
            endShape();


        }

        console.log(precipProbs,humidities);}

}

function backLevel() {
    stroke(255);
    strokeWeight(8);
    line(50, 30, 30, 50);
    line(30, 50, 50, 70);
}