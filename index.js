let playCountVar = 0;
let winCountVar = 0;
let doorsOpened = 0;
let stayDoor = '';
let switchDoor = '';


let roundsSwitched = 0;
let roundsSwitchedAndWon = 0;

let roundsStayed = 0;
let roundsStayedAndWon = 0;

document.getElementById('stop-simulator').style.display = 'none';



carImagePath = "./resources/images/car.svg";
goatImagePath = "./resources/images/goat.svg";

let imgsObj = {
    car: carImagePath,
    goat: goatImagePath
}

setUpDoorPaths()

function setUpDoorPaths() {
document.getElementById("Door 1").src = "./resources/images/door.svg";
document.getElementById("Door 2").src = "./resources/images/door.svg";
document.getElementById("Door 3").src = "./resources/images/door.svg";
}







function isRoundWin(win, didSwitch) {
    //(`Did switch? ${didSwitch}`);
    let playCountElement = document.getElementById("playcount");
    let winCountElement = document.getElementById("wincount");
    let winPercentElement = document.getElementById("winpercent");

    playCountVar++

    playCountElement.innerHTML = playCountVar;

    if (win) {
        winCountVar++;
        winCountElement.innerHTML = winCountVar;
        didSwitch ? roundsSwitchedAndWon++ : roundsStayedAndWon++;


        if (didSwitch) {
            document.getElementById('switchWinCount').innerHTML = roundsSwitchedAndWon;
        } else {
            document.getElementById('stayWinCount').innerHTML = roundsStayedAndWon;
        }
    }

    didSwitch ? roundsSwitched++ : roundsStayed++;



    let winpercent =  winCountVar / playCountVar * 100;

    let switchWinPercent = (roundsSwitched != 0) ? roundsSwitchedAndWon / roundsSwitched * 100: 0;
    let stayWinPercent = (roundsStayed != 0) ? roundsStayedAndWon / roundsStayed * 100 : 0;

    document.getElementById('switchWinPercentage').innerHTML = switchWinPercent.toFixed(2);
    document.getElementById('stayWinPercentage').innerHTML = stayWinPercent.toFixed(2);

    winPercentElement.innerHTML = winpercent.toFixed(2);

    if (didSwitch) {
        document.getElementById('switchPlayCount').innerHTML = roundsSwitched;
        xSwitch.push(roundsSwitched);
        ySwitch.push(switchWinPercent);
    } else {
        document.getElementById('stayPlayCount').innerHTML = roundsStayed;
        xStay.push(roundsStayed);
        yStay.push(stayWinPercent);
    }

    //console.log(`Rounds switched ${roundsSwitched}`);
    //console.log(`Rounds switched and won ${roundsSwitchedAndWon}`);
    //console.log(`Rounds stayed ${roundsStayed}`);
    //console.log(`Rounds stayed and won ${roundsStayedAndWon}`);


    updateChart();




}

// This function returns an array of 2 nothings and a goat randomized in order
function generateDoors() {
    const goatDoor = Math.floor(Math.random() * 3) + 1;
    
    function generateDoorArray(goatDoor) {
        let doorsObj = {};

        for (let i = 1; i < 4; i++) {
            if (i == goatDoor) {
                doorsObj[`Door ${i}`] = "car";
            } else {
                doorsObj[`Door ${i}`] = "goat";
            }
        }

        //console.log(doorsObj);
        return doorsObj;
    }



    return generateDoorArray(goatDoor);
    
    

}

function addListenersToDoors(doorsObj) {
    
    let htmlDoors = document.getElementsByClassName("door");

    let countOfDoorsOpened = document.getElementById("doors-opened");
    let status = document.getElementById("status");
    let startButton = document.getElementById("start-button");

    for (door of htmlDoors) {

        let doorName = door.getAttribute('id');


        function handleClickEvent(e){

            let behindDoor = doorsObj[doorName];

            

            //let countOfDoorsOpenedInner = Number(document.getElementById("doors-opened").innerHTML);
            
            if (doorsOpened == 0) {
                doorsOpened++;
                
                let duplicateDoorsObj = JSON.parse(JSON.stringify(doorsObj));
                
                delete duplicateDoorsObj[doorName];
                
                let doorsToOpen = [];

                for (const key in duplicateDoorsObj) {
                if (duplicateDoorsObj[key] == "goat") {
                        doorsToOpen.push(key);
                    }
                }

                //console.log(doorsToOpen);

                //console.log(doorsToOpen.length);
                let doorToOpen;
                if (doorsToOpen.length > 1) {
                    doorToOpen = doorsToOpen[Math.floor(Math.random() * 2)];
                } else {
                    doorToOpen = doorsToOpen[0];
                }

               delete duplicateDoorsObj[doorToOpen];
                const remainingDoor = Object.keys(duplicateDoorsObj)[0];

                
                


                //document.getElementById("status").innerHTML = `You chose ${e.target.id}. Behind ${doorToOpen}`;
                const responseString = `Behind ${doorToOpen} is a goat. You chose ${e.target.id}. Given this new infromation, do you switch to ${remainingDoor} or stay on ${e.target.id}?`

                document.getElementById('status').innerHTML = ''; 
                
                document.getElementById('status').innerHTML = responseString;
                document.getElementById(doorName).style.border = "3px solid yellow";
                document.getElementById(doorToOpen).src = goatImagePath;


                /* This is to have it written like a type writter
                var x = 0;

                setInterval(() => {

                if (x < responseString.length) {
                    
                } else {
                    return
                };

                if (x == 10) {
                    document.getElementById(doorName).style.border = "3px solid yellow";

                }

                if (x == 1) {
                    document.getElementById(doorToOpen).src = goatImagePath;
                }
                x++;
                }, 25);
                */

                stayDoor = e.target.id;
                switchDoor = remainingDoor;

            } else

            if (doorsOpened == 1) {

                if (e.target.getAttribute('src') == goatImagePath) {
                    return;
                }
                
                //this opens what was behind the selected door
                e.target.src = imgsObj[behindDoor];

                let behidStayDoor = doorsObj[stayDoor];
                let behindSwitchDoor = doorsObj[switchDoor];
                let didSwitch;
                

                if (e.target.id == switchDoor) {
                    didSwitch = true;
                    //if the person switched, the src is the switch door, then we would open the stay door
                    status.innerHTML = `You switched to ${e.target.id}.`

                    document.getElementById(stayDoor).src = imgsObj[behidStayDoor];
                    //console.log('switch');
                    //console.log(doorsObj[doorName]);
                    

                } else if (e.target.id == stayDoor){
                    didSwitch = false;
                    status.innerHTML = `You stayed at ${e.target.id}.`
                    document.getElementById(switchDoor).src = imgsObj[behindSwitchDoor];
                    //console.log ('stay');
                    e.target.src = imgsObj[behindDoor];
                    //console.log(doorsObj[doorName]);
                }

                if (behindDoor == 'car') {
                    //console.log('You won');

                    //document.getElementById("status").innerHTML = `You chose ${e.target.id}`;    
                    doorsOpened++; 

                    isRoundWin(true, didSwitch);
                    status.innerHTML += ` Hooray you found the car!`;
                    startButton.innerHTML = "You win! Play again?";
                    //opean other door
                    return

                } else {
                    doorsOpened++; 
                    status.innerHTML += ` You lose!`;
                    isRoundWin(false, didSwitch);         
                    startButton.innerHTML = "Game Over! Play again?";
                    return;
                    //console.log('You lose');
                }


            }


            //console.log(doorToOpen);




            return;
            
        }

        door.onclick = handleClickEvent;
    }

}

//Each time the page is refreshed the area where the goat is is refreshed


function startGame() {
    let startButtonVal = document.getElementById("start-button").innerHTML;

    if (startButtonVal == "Start Game") {

            // Generate the doors Object per game
            const doorsObj = generateDoors();


            // Use the doors Object and pass it to this function to add the listeners

            //insert playgamefunction with doorsObj arguement
            // Playgame functions adds the listeners

            addListenersToDoors(doorsObj);
            // Informs the user that the game has started
    
            let htmlDoors = document.getElementsByClassName("door");
        
            for (let i = 0; i < htmlDoors.length; i++) {
                    htmlDoors[i].style.cursor = "pointer";
            }
        
        
            document.getElementById("status").innerHTML = "Pick a door";
        
            document.getElementById("start-button").innerHTML = "Game Started";

    } else if (startButtonVal == "You win! Play again?" ||  startButtonVal == "Game Over! Play again?") {
        resetGame();
        startGame();
        
    }

    



}

function resetGame() {
    let countOfDoorsOpened = document.getElementById("doors-opened");
    countOfDoorsOpened.innerHTML = 0;
    document.getElementById("status").innerHTML = "Let's Play a game?";

    let htmlDoors = document.getElementsByClassName("door");
    doorsOpened = 0;

    stayDoor = '';
    switchDoor = '';


    let i = 0;

    //document.getElementById(doorName).style.border = "3px solid yellow";

    for (door of htmlDoors) {
        htmlDoors[i].style.cursor = "default";
        htmlDoors[i].style.border = 'none';
        door.onclick = "";
        i++;
    
    }

    setUpDoorPaths()

    document.getElementById("start-button").innerHTML = "Start Game";
}

function startButtonPress() {
;

}

// generate the object that says where the goat is

document.getElementById("start-button").addEventListener("click", startGame);








document.getElementById('simulator').addEventListener('click', async (e) => {
    const numOfRounds = document.getElementById('numOfRounds').value;
    const strategy = document.getElementById('strategy-type').value;
    let stopSimulation = false;
    document.getElementById('simulator').style.display = 'none';
    document.getElementById('stop-simulator').style.display = 'inline';

    document.getElementById('stop-simulator').addEventListener('click', e => {
        
        document.getElementById('stop-simulator').style.display = 'none';
        document.getElementById('simulator').style.display = 'inline';
        stopSimulation = true;
    });

    console.log(numOfRounds);
    console.log(strategy);

    let doors = ['Door 1', 'Door 2', 'Door 3'];
    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function Play(animate) {
        delayVal = 1000;

        if (animate) {
            delayVal = 1000;
        } else {
            delayVal = 5;
        }

        const doorToOpen = doors[Math.floor(Math.random() * 3)];

        console.log(doorToOpen);


        await delay(delayVal);
        document.getElementById('start-button').click();
        await delay(delayVal);
        document.getElementById(doorToOpen).click();
        await delay(delayVal);

        if (strategy == 'stay') {
            document.getElementById(stayDoor).click();
        } else if (strategy == 'switch') {
            document.getElementById(switchDoor).click();
    
        }

    }

    for (let i = 0; i < numOfRounds; i++) {
        const doAnimate = document.getElementById('animate-toggle').checked;
        if (stopSimulation) {
            console.log('Exiting simulation loop');
            break;
        }

        await Play(doAnimate);
        
    }

    document.getElementById('stop-simulator').style.display = 'none';
    document.getElementById('simulator').style.display = 'inline';


})


var xSwitch= [];
var ySwitch = [];

var xStay= [];
var yStay = [];


function updateChart() {


// Define Data
var switchData = {
  x:xSwitch,
  y:ySwitch,
  mode:"markers",
  name: 'switch'
};

var stayData = {
    x:xStay,
    y:yStay,
    mode:"markers",
    name: 'stay'
  };


data = [switchData, stayData]

let maxLength = Math.max(xSwitch.length, xStay.length);


if (!maxLength || maxLength < 200) {
    maxLength = 200;
}

  


// Define Layout
var layout = {
    xaxis: {range: [0, maxLength], title: "# of Rounds"},
    yaxis: {range: [0, 100], title: "Win Rate"},  
    title: "Switch vs. Stay",
    showlegend: true,
};

const config = {
    displayModeBar: false, // this is the line that hides the bar.
};



Plotly.newPlot("scatterplot", data, layout, config);

}

updateChart()
  