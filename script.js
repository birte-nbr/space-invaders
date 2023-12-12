$(document).ready(function () {

    // first create variable for alien container
    
    let gameborder = $(".game-border");
    
    // create aliens within the grid
    
    let grid = new Grid(5, 8, 50, 50, gameborder, 0,0);
    
    grid.fill(); // the grid is filled with aliens
    
    grid.modify(); // then modified 

    grid.fillHitArray(grid.aliens);
    
    grid.move(0.1); // and starts to move at certain speed

    // now let's create the spaceship 
    const css_spaceship = $(".spaceship");
    const initialX = 200; // Set the initial X position directly
    const spaceship = new Spaceship(initialX, 10, 70, 70, css_spaceship);
      
    
    // now let's move the aliens and bullets that are shot by the aliens 
   
    function execute(grid) {
        let badBullet = new Bullet(20,10,50,10,1, false, grid, spaceship, css_spaceship);
        let { firstDigit, secondDigit, alienNumber } = badBullet.pickRandom();
        let chosenAlien = grid.aliens[firstDigit].array[secondDigit]; // this is the alien that was randomly chosen
        try{
            badBullet.create($(".game-border"));
            badBullet.update(chosenAlien.x + (alienNumber.width() *0.5), alienNumber.offset().top);
            badBullet.move(); 
        }catch{
            console.log("shot too fast. no problem");
        }
    }
    
    setInterval(() => execute(grid), 3000);
  
    // here we document the player's action 
   
    $(document).on("keydown", function(e) {
 
        if (e.which == 37) {
            
            spaceship.move(css_spaceship, "left");
        }
        if (e.which == 39) {
            
            spaceship.move(css_spaceship,"right");
        }
        if (e.which == "32") { 
            if($("#goodBullet").length == 0){
                let goodBullet = new Bullet(spaceship.x, 10 ,50,30,10, true, grid, spaceship, css_spaceship);  
                goodBullet.create(gameborder)    // create bullet  
                goodBullet.update(spaceship.x + (css_spaceship.width() *0.5), css_spaceship.offset().top); // keep track of position of ship 
                goodBullet.move();
            }
        }  
    })
    
    })