(function (window) {

    //Paddle Ref
	var p = createjs.extend(Paddle, createjs.Container);


    //Public properties:
	p.paddleBody;        //Responsible in creating the rectangular paddle shape ( createjs.Shape() )

    p.xPOS;              //X pos of paddle
	p.yPOS;              //Y pos of paddle

	p.paddleWidth;
	p.paddleHeight;

	p.isRobot;           //IF paddle belongs to robot, this is set to true. Else false. Straighforward eh?


    //Constructor
	function Paddle(isItRobotBool) {
		this.Container_constructor();
    
		this.paddleBody = new createjs.Shape();

		this.addChild(this.paddleBody);

		//Pos parameters
		this.xPOS=0;
		this.yPOS=0;

		this.paddleWidth  =20;
		this.paddleHeight =100;

		this.isRobot=isItRobotBool;

		//Draws the rectangular shape
		this.makeShape();

	}



  
// public methods:
	p.makeShape = function () {
		//draw ship body
       var squarePaddle = this.paddleBody;
       
       squarePaddle.graphics.beginFill("white").drawRect(0, this.yPOS, this.paddleWidth, this.paddleHeight);
		console.log("SHAPE!!");

	}



	p.tick = function (event) {

        //If paddle belongs to robot, start that smart AI and determine his/or her position
        //If not, well it's up to you
		if(this.isRobot==true){

        var desty = pongBall.y - (this.paddleHeight - 10)*0.5;
		this.y = this.y + ((desty - this.y)*0.1);

		}else{
			this.y = this.yPOS;
		}
	}



    //Performs change in Y position of paddles according to what key is being pressed
	p.movePaddleUp=function(){

		this.yPOS=this.yPOS-8;
		if(this.yPOS<0){
			this.yPOS=0;
		}

	}


	p.movePaddleDown=function(){

		this.yPOS=this.yPOS+8;
		if(this.yPOS> (canvasHeight -this.paddleHeight)){
			this.yPOS=(canvasHeight-this.paddleHeight);
		}

	}



	window.Paddle = createjs.promote(Paddle, "Container");

}(window));