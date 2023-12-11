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
        //this.isGridMoving = false;
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
        
        // establish the rows for the aliens 
        //let rowX = this.htmlElement.offset().left;
        //let rowY = this.htmlElement.offset().top;
        
        for (let i=0; i < this.rows; i++) {
            //rowY += 50;
            let row = new Row(i,0,0, this.cols * this.alienWidth, this.alienHeight, []);
            
            // now fill the row with aliens
            for (let j=0; j < this.cols; j++) {
                let alien = new Alien(j, j * this.alienWidth, 0, this.alienWidth, this.alienHeight);
                row.array.push(alien);  
            }
            this.aliens.push(row);
           
            
         }
        
    }
    // this function lets the grid move with a given speed 
    move(speed) {  // add callback when needed 
        //Coordinates of grid
        let gridLeft =  $(".alien-grid").offset().left;
        let gridRight = gridLeft + $(".alien-grid").width();
        let gridTop = $(".alien-grid").offset().top;
        let gridBottom = gridTop + $(".alien-grid").height(); // ### your not using this rn but it will be helpful for the game mechanics to register when the grid reaches the bottom of the frame. Delete this variable if you don't use it in the version u submit

        //Coordinates of bounding box / game screen
        let borderLeft = this.htmlElement.offset().left;
        let borderRight = borderLeft + this.htmlElement.width();
        let borderTop = this.htmlElement.offset().top; // ### Same with this variable
        let borderHeight = this.htmlElement.height(); // ### And this one
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
          //this.isGridmoving = true;
          //callback(this.isGridMoving, speed);

        }else{
            //this.isGridMoving = false;
            console.log("This is the end"); // hier später level beenden einfügen
            //callback(this.isGridMoving, speed);
        }
         
    }
}

    
// maybe unnecessary

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
        //this.htmlElement = htmlElement;
    }
   
    
}




// class for the different types of bullets in the game 

class Bullet extends Space {
    constructor(x,y, width, height, speed, isGood) {
        super(x,y,width,height);
        this.speed = speed; 
        this.isGood = isGood;
        this.bulletId = 0;
        this.hitArray = [];
        //this.htmlElement = htmlElement;
    }
    //static currentAlien = 0;
    //static currentRow = 0;

    fillHitArray(aliens) {   // ## hier wird funktion erstellt 
        aliens.forEach(row => {
            let rowId = row.index; 
            row.array.forEach(alien => {
                let id = alien.index;
                this.hitArray.push([rowId, id, "0"]);   
            });         
        });
        //console.log(this.hitArray);
    }

    updateHitArray(row, id){
        console.log("initial hitarray:", this.hitArray);
        console.log("Updating entry for row:", row, "id:", id);
        let findEntry = this.hitArray.find(entry => entry[0] === row && entry[1] === id);
        if (findEntry) {
            findEntry[2] = "x";
            console.log("entry updated", findEntry);
        } else {
            console.log("entry not found");
        }
    }

    pickRandom(){
        let firstDigit = Math.floor(Math.random() * 5);
        let secondDigit = Math.floor(Math.random() * 8);
        //Bullet.currentRow = firstDigit;
        //Bullet.currentAlien = secondDigit;
        //console.log(Bullet.currentRow, Bullet.currentAlien);
        let alienNumber; 
        // hier testen ob alien x oder 0 im hitArray hat
        //let randomValue = this.hitArray[0][2];
        //console.log(randomValue); // 0
        let foundElement = this.hitArray.find(element => element[0] === firstDigit && element[1] === secondDigit);

        //let rowToAccess = this.hitArray[firstDigit]
        //let rowToAccess = this.hitArray[firstDigit];
        //let valueToAccess = rowToAccess[2]; // not 100% sure if this is correct, chatgpt says row * numberofAliens 
        //console.log(valueToAccess);
        if (foundElement[2] == "0") {
        //if (this.hitArray[firstDigit,secondDigit] == "0") {
            //console.log(foundElement[2]);
            alienNumber = $("#"+`${firstDigit}`+"-"+`${secondDigit}`);
        } else {
            this.pickRandom() // ### hier soll die funktion neu gestartet werden aber kp ob da return reicht oder rekursion braucht
        } 
       
        //console.log(firstDigit, secondDigit);
        //console.log(alienNumber);
        return { firstDigit, secondDigit, alienNumber };
    }

    /*execute(grid) { // ### moved that to script.js
        let { firstDigit, secondDigit, alienNumber } = this.pickRandom();  
        this.create($(".game-border"));
        let chosenAlien = grid.aliens[firstDigit].array[secondDigit]; // this is the alien that was randomly chosen
        //console.log("chosenAlien", chosenAlien);
        //console.log(grid.aliens[firstDigit].array[secondDigit]);
        this.update(chosenAlien.x + (alienNumber.width() *0.5), alienNumber.offset().top);
        this.move();
        
    }*/
   
  create(parent) { // method creates either a bad bullet or a good bullet
    //let result = this.test(parent);
    
    //console.log("function called with parent:", parent);
    if (this.isGood == true) {  // if false, create a good bullet
        this.htmlElement = $("<div class='bullet' id='goodBullet'></div>");
        parent.append(this.htmlElement);
        this.htmlElement.css ({
            'border-color': '#8ceb34',            
        })
        //this.registerHit();
        } else {
            //console.log("bad bullet created");
            this.htmlElement = $("<div class='bullet' id='badBullet"+`${this.bulletId}`+"'></div>"); // if true create bad bullet
            parent.append(this.htmlElement);
            this.htmlElement.css ({
                'border-color': '#ff5e00',            
            })
            this.bulletId += 1; // if we have more than one bullet, we want to keep them apart
            //this.move(1); // direction is positive
        }
    }

// later: animate object to make shooting smooth, speed needs to be adjusted 
    update(shooterX, shooterY) { 
        //console.log("function called with shooter:",shooterX, shooterY);
        this.x = shooterX;            // the id of the alien and then top / left of that css alien as parameter 
        this.htmlElement.css("left",` ${this.x}px`);
        this.y = shooterY;
        this.htmlElement.css("top",` ${this.y}px`);

    }

    move() {
    
       if (this.isGood == true) {
            this.htmlElement.css("top",` ${this.y}px`);
            if (this.y >= $(".game-border").offset().top){ 
                this.y -= 3; // move up
                this.registerHit(); // 
            }else{ // ### wenn die Kugel über den oberen rand des schwarzen kastens ist, wir die kugel gelöscht
                this.htmlElement.remove();
            }
       } else {
            this.y += 1; // move down
            this.htmlElement.css("top",` ${this.y}px`); 

            if (this.y >= $(".game-border").offset().top + $(".game-border").height()) { 
                this.htmlElement.remove(); 
            }

        }
        window.requestAnimationFrame(() => this.move());
    }

     // function for registering getting hit by bullets 
     registerHit() { // later this function can also be adjusted to register hits of the spaceship 
        // ### habe die Variablen entfernt, die an dieser Stelle nicht benötigt werden
        let tolerance = 1; // ### wird jetzt in x und y Richtung umgesetzt
        let bulletHtml = this.htmlElement; // ### wird extra gespeichert, damit die Bullet später gelöscht werden kann
        let bulletTop = bulletHtml.offset().top; 
        let bulletLeft = bulletHtml.offset().left;
        let bulletWidth = bulletHtml.width();
        let allAliens = $(".alien");
        //let self = this;
        

        allAliens.each((index, element) => {
            let $alien = $(element); // ### das ist bereits das html element des aktuell geprüften Aliens. Du musst dir das nicht nochmal mit jquery holen :)
            let alienBottom = $alien.offset().top + $alien.height();
            let alienLeft = $alien.offset().left;
            let alienWidth = $alien.width();
            let alienID = $alien.attr('id');
            let [row, id] = alienID.split('-').map(Number);
             

            if (bulletTop <= alienBottom - tolerance) { // ### geprüft wird hier, ob die Bullet auf der y höhe des aliens ist
                if((bulletLeft >= alienLeft - tolerance) && (bulletLeft + bulletWidth <= alienLeft + alienWidth + tolerance) ){ // ### hier wird geprüft ob die Bullet vom aktuell untersuchten alien im rahmen der x werte des aliens (breite) liegt 
                    console.log("alien was hit", alienID);
                    this.updateHitArray(row, id);
                     // add x to hitArray here ### der Zugriff klappt noch nicht ganz
                    //console.log("hit array updated", newEntry);
                    $alien.remove(); // ### alien wird komplett aus dem html dom gelöscht und schlägt dann auch nicht mehr an (unsichtbare aliens können ja trotzdem von Bullets getroffen werden)
                    bulletHtml.remove(); 
                    return; 
                }
            } 
        });    
    }    
}


// class for the spaceship the user controls 

class Spaceship extends Space  {
    constructor(x,y,width, height, htmlElement) {
        super(x,y,width, height);
        this.htmlElement = htmlElement;
        this.lives =3;
    }
  
    
    // allow spaceship to move

    move(element, direction) {
        //console.log(this.htmlElement);
        let containerLeft = $(".game-border").offset().left;
        let containerRight = $(".game-border").width() - this.htmlElement.width();

   
        
        
        if (direction == "right") {
            this.x += 6;
            if ((this.htmlElement.offset().left + this.htmlElement.width()) >= containerRight) {
                console.log("hit border right");
                this.x = containerRight;
            }
        }
        if (direction == "left") {
            this.x -= 6;
            if (this.htmlElement.offset().left  <= containerLeft) {
                console.log("hit border left");
                this.x = containerLeft + this.htmlElement.width();
            }
        }
        element.css("left",` ${this.x}px`);


    }
}

class Alien extends Space {

    constructor(index, x,y, width, height) {
        super(x,y,width,height);
        this.index = index;
    }

   
     
}

