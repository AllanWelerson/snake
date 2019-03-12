let runGame
const table = []
const state = [ 'ground', 'snake', 'food']
let snake = {}
const ground = {
    state : 0,
    line : 0,
    col : 0,
    velocity: 0

}
const food = {
    line : 0,
    col: 0,
    state: 2
}

let eatSound = new Audio('eat-sound.mp3')


function playEatSound(){
    eatSound.play()
}


function setLineCol(){
    if ('ontouchstart' in window || navigator.msMaxTouchPoints){
        ground.line = 20
        ground.col = 15
        ground.velocity = 120
    }else{
        ground.line = 30
        ground.col = 30
        ground.velocity = 110
    }
}

setLineCol() 
startGame()

function startGame(){

    

    document.querySelector("#info button").style.display = "none"
    document.querySelector("#info .tutorial").style.display = "flex"
    
    snake = { life: true , state: 1 ,
        body : { direction: ''},
        positions : [
            { line : 2, col : 0},
            { line : 1, col : 0},
           
            ]
         }  

          
    createTable()
    renderDisplay()
    createSnake()
    throwFood()
    run()

}


function run(){
    runGame = setInterval(moveSnake, ground.velocity)
}
 

function createTable (){

    for( line = 0; line < ground.line; line++){
        table[line] = []
        for(col = 0; col < ground.col; col++){
            table[line][col] = { state : 0}
        }
    }


}

function renderDisplay(){

    const display = document.querySelector("#display");

    let html = ``

    for(line = 0; line < table.length; line++ ){
        html += `<div class="line line-${line}">`
        for(col = 0; col < table[line].length; col++){
            html += `<div class="square col-${col} ${state[table[line][col].state]}"></div>`
        }
        html += `</div>`
    }

    displayGame = `<div class="display-game" 
                    ontouchstart="touchStart(event)"
                    ontouchend="touchEnd(event)"></div>`


    display.innerHTML = html + displayGame;

    
      

}

function throwFood(){
    let done = false
    while(!done){
        let line = Math.floor(Math.random() * table.length)
        let col = Math.floor(Math.random() * table[0].length)

        for(position = 0; position < snake.positions.length; position++){
            if(snake.positions[position].line === line &&
                snake.positions[position].col === col  ){
                    done = false 
                }else{
                    done = true
                }
        }
        if(done){
            food.line = line
            food.col = col
        }
    }

   
}

function createSnake(){
    
    for( position = 0; position < snake.positions.length; position++){
        table[snake.positions[position].line][snake.positions[position].col].state = snake.state    
    }
    
    renderDisplay()

}

function moveSnake(){

            switch (snake.body.direction){
                case 'down':
                    moviment( 1, "line")
                    break
                case 'up':
                    moviment( -1, "line")
                    break
                case 'right':
                    moviment( 1, "col")
                    break
                case 'left':
                    moviment(-1, "col")
                    break
            }
            
     
        
        if(snake.life){
            
            renderDisplay()
        } else{
            clearInterval(runGame)
            document.querySelector("#info button").style.display = "block" 
            document.querySelector("#info .tutorial").style.display = "none"
            document.querySelector("#msg").style.display = "block" 
           // alert("Fim de jogo")
        }

}

function moviment(value, direction){
       
    const col = snake.positions[0].col
    const line = snake.positions[0].line
    makeMoviment(value, direction)
    if ( eat() ){
        const last = snake.positions.length - 1
        const lastLine = snake.positions[last].line
        const lastCol = snake.positions[last].col
        deleteLast()
        
        const position = { line : lastLine, col : lastCol}
        snake.positions.push(position)
    }else {
        deleteLast()
          
    }
    changePositions(col,line)
    table[food.line][food.col].state = food.state
    
    
     

}

function deleteLast(){
    
        let last = snake.positions.length - 1
        table[snake.positions[last].line][snake.positions[last].col].state = ground.state
    
}

function eat(){

    if( snake.positions[0].line === food.line &&
        snake.positions[0].col === food.col){
        
        playEatSound()
            
        throwFood()    
        return true
                
    }
              
    return false

}

function changePositions(col1,line1){
    
    if(snake.positions.length > 1){
        let col = col1
        let line = line1
        let newCol = 0
        let newLine = 0
        for( position = 1; position < snake.positions.length; position++ ){
            
            newCol = snake.positions[position].col
            newLine = snake.positions[position].line  
            
            snake.positions[position].col = col
            snake.positions[position].line = line
        
            col = newCol
            line = newLine

        }
    }
}

function makeMoviment(value, direction){

   
        if(direction === "col"){
            snake.positions[0].col += value
            if(checkLife()){
                table[snake.positions[0].line][snake.positions[0].col].state = snake.state                              
            }
        }else if (direction === "line"){
            snake.positions[0].line += value
            if(checkLife()){
                table[snake.positions[0].line][snake.positions[0].col].state = snake.state
               
            }
        }
   

}

function checkLife(){
    if (snake.positions[0].line < 0 ||
        snake.positions[0].line >= table.length ||
        snake.positions[0].col < 0 || 
        snake.positions[0].col >= table.length ){

            snake.life = false
            return false
    }else if(snakeKillItself()){

        snake.life = false
        return false
    }    
    else{
        return true
    }
}

function snakeKillItself(){
    let position = 1
    while(position < snake.positions.length){

        if( snake.positions[position].line === snake.positions[0].line &&
            snake.positions[position].col === snake.positions[0].col){
                
                return true
                
            }
            position++
            
    }
    return false
}

document.onkeypress = function(key){

    switch (key.keyCode){
        case 119:
            if(snake.body.direction != "down" && checkSquareFree("up"))
                snake.body.direction = "up"
                break
      
        case 100:
            if(snake.body.direction != "left" && checkSquareFree("right"))
                snake.body.direction = "right"
                break
        
        case 115:
            if(snake.body.direction != "up" && checkSquareFree("down"))
                snake.body.direction = "down"
                break
          
        case 97:
            if(snake.body.direction != "right" && checkSquareFree("left"))
                snake.body.direction = "left"
                break
        
        default:
            console.log(snake.body.direction)

    }

    
}

function startButton(){

    if (!snake.life){
        startGame()
        
    }
}

function closeMsg(){
    document.querySelector("#msg").style.display = "none"
}

let touchX;
let touchY;

function touchStart(e){
    e.preventDefault()
    touchX = e.touches[0].clientX
    touchY = e.touches[0].clientY   
}

function touchEnd(e){
    e.preventDefault()
    touchX = e.changedTouches[0].clientX - touchX
    touchY = e.changedTouches[0].clientY - touchY

    if(Math.abs(touchY) > Math.abs(touchX)){
        if(touchY > 0){
            if(snake.body.direction != "up")
                snake.body.direction = "down"
            
        }else{
            if(snake.body.direction != "down")
                snake.body.direction = "up"
            
        }
    }else{
        if(touchX > 0){
            if(snake.body.direction != "left")
                snake.body.direction = "right"
            
        }else{
            if(snake.body.direction != "right")
                snake.body.direction = "left"
            
        }
    }

}


function checkSquareFree(direction){

    position = snake.positions[0]    

    switch (direction){
        case 'down':
            if(table[position.line + 1][position.col].state === 1){
                return false
            }
            break
        case 'up':
            if(table[position.line - 1][position.col].state === 1){
                return false
            }
            break
        case 'right':
            if(table[position.line][position.col + 1].state === 1){
                return false
            }
            break
        case 'left':
            if(table[position.line][position.col - 1].state === 1){
                return false
            }
            break
    }

    return true 

}




