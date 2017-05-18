(function (window) {

    //PongBall Ref
	var p = createjs.extend(PongBall, createjs.Container);

    // public properties
	p.pongBallBody;

	p.vX;                  //X Velocity of pongball
	p.vY;                  //Y Velocity of pongball

	p.radiusOfBall;        //Radius of pongball

	p.speed;               //Speed


    //Constructor
	function PongBall() {

		this.Container_constructor();

		this.pongBallBody = new createjs.Shape();
		this.addChild(this.pongBallBody);

		this.vX = 0;
		this.vY = 0;

		this.radiusOfBall=10;
		this.speed=6;

		//Draws the circle shape
		this.makeShape();

	}



	

// public methods:
	p.makeShape = function () {

		//draw ship body
       var circle = this.pongBallBody;
       circle.graphics.beginFill("white").drawCircle(0, 0, this.radiusOfBall);
       circle.x = 0;
       circle.y = 0;
		
	}



    p.respawnBall = function(side){

    	// Will be used to determine respawn position
		var r = Math.random();

        //If 'player' scored a point, then pong ball must respawn from right side of canvas. If 'robot' scored, then respawn must occur from left side
		this.x = side===1 ? playerPaddle.x+20 : robotPaddle.x - this.radiusOfBall;

		//Pong Ball can be respawned in any y position
		this.y = (canvasHeight - this.radiusOfBall)*r;

		// calculates outer angle on y axis
		var phi = 0.1*pi*(1 - 2*r);
		
		// set velocity direction and magnitude
		this.vX=side*this.speed*Math.cos(phi);
		this.vY=this.speed*Math.cos(phi);
			
    }



    p.updateScore = function(playerScored){

        //increases score count and displays it on canvas
    	if(playerScored==false){
           robotScore++;
           robotScoreDisplayField.text=robotScore.toString();
    	}else{
           playerScore++;
           playerScoreDisplayField.text=playerScore.toString();
    	}

    }




    p.tick = function (event) {

    	//Updates ball pos according to given velocity
		this.x = this.x + this.vX;
		this.y = this.y + this.vY;

        //Will bounce when hitting top or bottom of canvas
        if(this.y<0 || this.y+this.radiusOfBall > canvasHeight){
			
			//Will be used to correct the slightly passed through the top or bottom look that may happen when bouncing occurs.
			var offset = this.vY < 0 ? 0 - this.y : canvasHeight - (this.y + this.radiusOfBall);
			this.y=this.y+2*offset;

			this.vY *= -1;
		}

        

        //Paddle which will block the ball
		var paddleThatWillHitBall =this.vX <0 ? playerPaddle : robotPaddle;



		var Paddle_PongBall_CollisionDetector=function(paddleXRef , paddleYRef , paddleWidthRef , paddleHeightRef , ballXRef , ballYRef , ballWidthRef ,ballHeightRef){
			
			//Check if positions satisfy for collision
			return paddleXRef<ballXRef+ballWidthRef && paddleYRef< ballYRef + ballHeightRef && ballXRef<paddleXRef+paddleWidthRef && ballYRef <paddleYRef +paddleHeightRef;
		};


        //Check for paddle/pongBall collision
		if(Paddle_PongBall_CollisionDetector(paddleThatWillHitBall.x, paddleThatWillHitBall.y,  paddleThatWillHitBall.paddleWidth , paddleThatWillHitBall.paddleHeight,
			
			this.x,this.y,this.radiusOfBall,this.radiusOfBall)){
			
			this.x = (paddleThatWillHitBall ===  playerPaddle) ? (playerPaddle.x + paddleThatWillHitBall.paddleWidth) : (robotPaddle.x - this.radiusOfBall);
			
            //Checks which side of paddle did the pong ball hit at. It will change x,y velocities according it 
			var n= (this.y + this.radiusOfBall - paddleThatWillHitBall.y)/(paddleThatWillHitBall.paddleHeight + this.radiusOfBall);
			var phi=0.25*pi*(2*n -1);
			var smash = Math.abs(phi)> 0.2*pi?1.5:1;

            //Updates x,y velocity
			this.vX=smash*(paddleThatWillHitBall===playerPaddle ? 1:-1)* this.speed*Math.cos(phi);
			this.vY= smash*this.speed*Math.sin(phi);

		}

 
        //If ball hits left or right side of canvas, then it updates the score and respawns
		if(0>this.x + this.radiusOfBall|| this.x > canvasWidth){
	        	this.respawnBall(paddleThatWillHitBall===playerPaddle ? 1:-1);
	        	this.updateScore(paddleThatWillHitBall===playerPaddle ? false:true);
	        		
	    }    

	}

	window.PongBall = createjs.promote(PongBall, "Container");


}(window));