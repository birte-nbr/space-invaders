$(document).ready(function () {

    // first create variable for alien container
    
    let gameborder = $(".game-border");
    //console.log(gameborder.offset().left);
    //console.log(aliengrid.offset().left, aliengrid.offset().top); bruachen wir wahrscheinlich nicht mehr 
    
    // create aliens within the grid
    
    let grid = new Grid(5, 8, 50, 50, gameborder, 0,0);
    
    grid.fill(); // the grid is filled with aliens
    
    grid.modify(); // then modified 
    
    grid.move(0.3); // and starts to move at certain speed
    console.log(grid.aliens);
    
    // now let's create the spaceship 
    const css_spaceship = $(".spaceship");
    const spaceship = new Spaceship(200,10,10,10, css_spaceship);
  
    
    // and the bullet
    // const goodBullet = new Bullet(spaceship.x,10 ,50,10,2, true); // set y to bottom of the container 
    
    // now let's move the bullets that are shot by the aliens 
    // first pick random alien to shoot
    
    // now shoot the bullets
    
    function execute(grid) {
        let badBullet = new Bullet(20,10,50,10,1, false);
        badBullet.fillHitArray(grid.aliens); // fill the array that checks if alien is still there
        let { firstDigit, secondDigit, alienNumber } = badBullet.pickRandom();
        //console.log(alienNumber);
        //console.log(alienNumber.offset().top);  
        badBullet.create($(".game-border"));
        let chosenAlien = grid.aliens[firstDigit].array[secondDigit]; // this is the alien that was randomly chosen
        //console.log("chosenAlien", chosenAlien);
        //console.log(grid.aliens[firstDigit].array[secondDigit]);
        badBullet.update(chosenAlien.x + (alienNumber.width() *0.5), alienNumber.offset().top);
        badBullet.move(); // ### hier musste ich das nervigerweise übergeben weil ich das chosenAlien in registerHit brauche und das wird in move aufgerufen. könnte man bestimmt auch anders lösen aber kp  
    }
    
    setInterval(() => execute(grid), 3000);
    
    /* 
    let badBullet = new Bullet(20,10,50,10,1, false);
    setInterval(() => badBullet.execute(grid), 5000);
    */
    
    
    // create alien to be able to call methods
    //let alien = new Alien (0,0,0,0);
    
    //badBullet.registerHit();
    
    // here I was trying to make the bullets stop shooting by getting a callback from the grid.move that tells us if the grid is still moving
    // this didn't work bc while isGridMoving was true, the interval would explode, many bullets at once were fired. 
    // the clearInterval function did not help either, because then the bullets would not appear at all (no errors in the console tho)
    /* let shootInterval;
    
    grid.move(0.3,(isGridMoving, speed) => {
        //console.log("Is the grid still moving?", movingGrid);
        if (!isGridMoving && shootInterval) {
                // Stop shooting when the grid no longer moves
                clearInterval(shootInterval);
        }
      });
      shootInterval = setInterval(shootBullets, 5000); */
    
     // add time stamp to wait inbetween shooting bad Bullets 
     
    //badBullet.update(individual.offset().left, individual.offset().top);
    //badBullet.move();
    
    //setInterval(shootBullets, 5000);
    
    // here we document the player's action 
    let numberOfHits = 0; 
    $(document).on("keydown", function(e) {
        //console.log(e.which);
        if (e.which == "37") {
            
            spaceship.move(css_spaceship, "left");
        }
        if (e.which == "39") {
            
            spaceship.move(css_spaceship,"right");
        }
        if (e.which == "32") { 
            // ### wenn jedes mal eine neue Bullet erstellt wird, musst du auch nicht mehr die number of shoots als entscheidungskriterium nutzen 
            // ### eine neue Instanz für Bullet wird beim drücken von Space erstellt
            
            let goodBullet = new Bullet(spaceship.x,10 ,50,10,2, true);  
            goodBullet.create(gameborder)    // create bullet  
            goodBullet.update(spaceship.x + (css_spaceship.width() *0.5), css_spaceship.offset().top); // keep track of position of ship 
            goodBullet.move();
        }  
        // what needs to be added here: control start, enter name for hs
    })
    
    
    
    
    
    
    })