class Grid {
    constructor(rows, cols, alienWidth, alienHeight, htmlElement,x, y) {
        this.rows = rows;
        this.cols = cols;
        this.alienWidth = alienWidth;
        this.alienHeight = alienHeight;
        this.htmlElement = htmlElement;
        this.x = x;
        this.y = y;
        this.aliens = [];
        this.hitArray = [];
    }
    // this function adjusts the grid's contents and styles the aliens 
        
        modify() {
            let rowId = 0; //row counter: variable to track html element ids for rows
            let id = 0; //row element counter: variable to track html element ids for individual row entries
            let aliencontainer = $("<div class='alien-grid'></div>");
            this.aliens.forEach(row => { //iterate through number of rows
                
                let rowElement = $("<div class='row' id='"+`${rowId}`+"'></div>"); //create row html element and assign id by row number
                let rowY =  rowId * row.height; //calculate y position of row according to row number
                rowElement.css ({
                    'top' : `${rowY}px`,  
                    'left': `${row.x}px`,
                    'height': `${row.height}px`,
                    'width': `${row.width}px`,
                    'position': 'absolute',
                    
                })
                row.array.forEach(alien => { //iterate through number of aliens per row
                    let alienId = `${rowId}`+"-"+`${id}`; //set alien id as a combination of row number and row element number
                    let alienElement = $("<div class='alien' id='"+`${alienId}`+"'></div>"); //create row html element and assign id
                    alienElement.css ({
                        'top' : `${alien.y}px`,
                        'left': `${alien.x}px`,
                        'height': `${alien.height}px`,
                        'width': `${alien.width}px`,
                        'background-image': 'url("icons/icons8-alien.svg")',
                        'position': 'absolute'
                    })
                    rowElement.append(alienElement);
                    id += 1; //set row element counter +1
                });
                id = 0; //reset row element counter to 0 after iterating through row elements for current row
                aliencontainer.append(rowElement);
                aliencontainer.css ({
                    'top' : `${row.height}px`,  
                    'left': `${row.x}px`,
                    'height': `${row.index * row.height + row.height}px`,
                    'width': `${row.width}px`,
                    'position': 'absolute',
                })
                this.htmlElement.append(aliencontainer);
                rowId += 1; //set row counter +1
            });
        }
    
    // this function fills the grid with the given amount of rows and aliens per row
    fill() {        
        for (let i=0; i < this.rows; i++) {
            let row = new Row(i,0,0, this.cols * this.alienWidth, this.alienHeight, []);
            // now fill the row with aliens
            for (let j=0; j < this.cols; j++) {
                let alien = new Alien(j, j * this.alienWidth, 0, this.alienWidth, this.alienHeight);
                row.array.push(alien);  
            }
            this.aliens.push(row); 
            
         } 
    }

    fillHitArray(aliens) {   
        aliens.forEach(row => {
            let rowId = row.index; 
            row.array.forEach(alien => {
                let id = alien.index;
                this.hitArray.push([rowId, id, "0"]);   
            });         
        });
    }

    // this function lets the grid move with a given speed 
    move(speed) {  // add callback when needed 
        //Coordinates of grid
        let gridLeft =  $(".alien-grid").offset().left;
        let gridRight = gridLeft + $(".alien-grid").width();
        let gridTop = $(".alien-grid").offset().top;
        let gridBottom = gridTop + $(".alien-grid").height(); 

        //Coordinates of bounding box / game screen
        let borderLeft = this.htmlElement.offset().left;
        let borderRight = borderLeft + this.htmlElement.width();
        let borderTop = this.htmlElement.offset().top; 
        let borderHeight = this.htmlElement.height();
        let borderBottom = borderTop + borderHeight;

        //move grid in x direction
        this.x += speed;
        $(".alien-grid").css("left",` ${this.x}px`);


        // boolean for saving current direction
        let movingright;
        if(Math.sign(speed) == 1){
            movingright = true;
        }else{
            movingright = false;
        }
      
        //Check collition with left or right end of box depending on the movement direction of the grid
        if (movingright) { 
            //collition check for right border when moving right
            if (gridRight >= borderRight) {
                //flip the x direction
                speed *= -1; 
                //move grid in y direction by 50px
                this.y += 50;
                $(".alien-grid").css("top",` ${this.y}px`);
                //register updated moving direction in boolean movingright
                movingright = false;
            } 
        }else{
            //collition check for left border when moving left
            if (borderLeft >= gridLeft) {
                //flip the x direction by changing the sign of speed
                speed *= -1; 
                
                //move grid in y direction by 50px
                this.y += 50;
                $(".alien-grid").css("top",` ${this.y}px`);
                //register updated moving direction in boolean movingright
                movingright = true;
            } 
        }
        if(gridBottom <= borderBottom){
          window.requestAnimationFrame(() => this.move(speed)); // add callback when needed 
        }else{
            if (confirm("GAMEOVER! Restart?")) {
                location.reload();
              } else {
                alert("You canceled! Please manually refresh the page to restart!");
              }
        }
         
    }
}

class Row {
    constructor(index,x,y, width, height, array) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.array = array;
    }

}

// general class that contains features for alien and spaceship 

class Space {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
   
    
}

// class for the different types of bullets in the game 

class Bullet extends Space {
    constructor(x,y, width, height, speed, isGood, grid, ship, css_ship) {
        super(x,y,width,height);
        this.speed = speed; 
        this.isGood = isGood;
        this.bulletId = 0;
        this.grid = grid;
        this.ship = ship;
        this.css_ship = css_ship;
    }

    updateHitArray(row, id){
        let findEntry = this.grid.hitArray.find(entry => entry[0] === row && entry[1] === id);
        if (findEntry) {
            findEntry[2] = "x";
            console.log("hit entry updated", findEntry);
        } else {
            console.log("entry not found");
        }
        this.testHitArray(row);
    }

    testHitArray(row){
        let isEmpty = true;
        let isEmptyRow = true;
        this.grid.hitArray.forEach(element => { 
            if(element[2] == "0"){
                isEmpty = false;
                if(element[0] == row){
                    isEmptyRow = false;
                }
            }
        });
        if(isEmptyRow){
            let rowId = "#" + row;
            $(rowId).remove();
            let oldheight =  $(".alien-grid").height();
            $(".alien-grid").height(oldheight - 50);
        }
        if(isEmpty){
            location.reload();
        }
    }

    pickRandom(){
        let firstDigit = Math.floor(Math.random() * 5);
        let secondDigit = Math.floor(Math.random() * 8);
        let alienNumber; 
        let foundElement = this.grid.hitArray.find(element => element[0] === firstDigit && element[1] === secondDigit);
        if (foundElement[2] == "0") { // check if alien is still alive 
            alienNumber = $("#"+`${firstDigit}`+"-"+`${secondDigit}`);
            console.log("alien alive");
        } else {
            console.log("alien dead, picking again");
            this.pickRandom() // pick another alien
        } 
        return { firstDigit, secondDigit, alienNumber };
    }

   
  create(parent) { // method creates either a bad bullet or a good bullet
    //let result = this.test(parent);
    if (this.isGood == true) {  // if false, create a good bullet
        this.htmlElement = $("<div class='bullet' id='goodBullet'></div>");
        parent.append(this.htmlElement);
        this.htmlElement.css ({
            'border-color': '#8ceb34',            
        })
        } else {
            this.htmlElement = $("<div class='bullet' id='badBullet"+`${this.bulletId}`+"'></div>"); // if true create bad bullet
            parent.append(this.htmlElement);
            this.htmlElement.css ({
                'border-color': '#ff5e00',            
            })
            this.bulletId += 1; // if we have more than one bullet, we want to keep them apart
        }
    }

    update(shooterX, shooterY) { 
        this.x = shooterX;            
        this.htmlElement.css("left",` ${this.x}px`);
        this.y = shooterY;
        this.htmlElement.css("top",` ${this.y}px`);

    }

    move() {
    
       if (this.isGood == true) {            
            if (this.y >= $(".game-border").offset().top){ 
                this.y -= 3; // move up
                this.htmlElement.css("top",` ${this.y}px`);
                this.registerHit(); // 
            }else{
                this.htmlElement.remove();
            }
       } else {
            if (this.y <= $(".game-border").offset().top + $(".game-border").height()) { 
                this.y += 1; // move down
                this.htmlElement.css("top",` ${this.y}px`); 
                this.registerBadHit();
            }else{
                this.htmlElement.remove();
            }

        }
        window.requestAnimationFrame(() => this.move());
    }
     // function for registering getting hit by bullets 
     registerHit() { // later this function can also be adjusted to register hits of the spaceship 
        
        let tolerance = 1; 
        let bulletHtml = this.htmlElement; // saved separately so it can be deleted 
        let bulletTop = bulletHtml.offset().top; 
        let bulletLeft = bulletHtml.offset().left;
        let bulletWidth = bulletHtml.width();
        let allAliens = $(".alien");
        //let self = this;
        

        allAliens.each((index, element) => {
            let $alien = $(element); 
            let alienBottom = $alien.offset().top + $alien.height();
            let alienLeft = $alien.offset().left;
            let alienWidth = $alien.width();
            let alienID = $alien.attr('id');
            let [row, id] = alienID.split('-').map(Number); // converts the alienID into separate numbers 
             

            if (bulletTop <= alienBottom - tolerance) { 
                if((bulletLeft >= alienLeft - tolerance) && (bulletLeft + bulletWidth <= alienLeft + alienWidth + tolerance) ){ // ### hier wird geprüft ob die Bullet vom aktuell untersuchten alien im rahmen der x werte des aliens (breite) liegt 
                    console.log("alien was hit", alienID);
                    this.updateHitArray(row, id); // update the alien in the hitArray, it has been hit
                    $alien.remove(); 
                    bulletHtml.remove(); 
                    return; 
                }
            } 
        });    
    }   
    
    registerBadHit(){
        let tolerance = 1; 
        let bulletHtml = this.htmlElement; // saved separately so it can be deleted 
        let bulletTop = bulletHtml.offset().top; 
        let bulletLeft = bulletHtml.offset().left;
        let bulletWidth = bulletHtml.width();

        let shipTop = this.css_ship.offset().top;
        let shipLeft = this.css_ship.offset().left;
        let shipWidth = this.css_ship.width();

        if (bulletTop >= shipTop - tolerance) { 
            if((bulletLeft >= shipLeft - tolerance) && (bulletLeft + bulletWidth <= shipLeft + shipWidth + tolerance) ){ 
                console.log("ship was hit");
                console.log("lives:", this.ship.lives);
                this.ship.lives -= 1;
                if(this.ship.lives <= 0){
                    if (confirm("GAMEOVER! Ship was shot down 3 times! Restart?")) {
                        location.reload();
                      } else {
                        alert("You canceled! Please manually refresh the page to restart!");
                      }
                }
                bulletHtml.remove(); 
                return; 
            }
        }
    }
}

// class for the spaceship the user controls 

class Spaceship extends Space  {
    constructor(x,y,width, height, htmlElement) {
        super(x,y,width, height);
        this.htmlElement = htmlElement;
        this.lives = 3;
    }
    
    // allow spaceship to move
    move(element, direction) {
        let containerLeft = $(".game-border").offset().left;
        let containerRight = $(".game-border").width() - this.htmlElement.width();

        if (direction === "right") {
            this.x += 6;
            if (this.x >= containerRight) {
                this.x = containerRight;
            }
        }
        if (direction === "left") {
            this.x -= 6;
            if (this.x <= containerLeft) {
                this.x = containerLeft;
            }
        }
        element.css("left", `${this.x}px`);
}

}

class Alien extends Space {

    constructor(index, x,y, width, height) {
        super(x,y,width,height);
        this.index = index;
    }

   
     
}

