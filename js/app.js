'strict'
var TILE_WIDTH = 101,
    TILE_HEIGHT = 83;
// 这是我们的玩家要躲避的敌人 
var Enemy = function(x,y,z) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
	this.x = x;
	this.y = y;
	this.spd = z;
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
	//console.log(this.x+' '+this.y);
	this.x += (dt*this.spd)*TILE_WIDTH;
	var rand_col; 

	if(this.x > 505)
	{
		this.x = -TILE_WIDTH;
		var v_rand = Math.random();
		rand_col = 10*v_rand;
		rand_col %= 10;
		
		//if(rand_col > 6)
			rand_col /= 2;
		rand_col = parseInt(rand_col);
		if(rand_col > 3)
			rand_col /= 2;
		//console.log(rand_col+' '+v_rand);
		if(rand_col*TILE_HEIGHT < TILE_HEIGHT){
			this.y = TILE_HEIGHT-20;
		}else if(rand_col*TILE_HEIGHT > 340){
			this.y = 300;
		}else{
			this.y = rand_col*TILE_HEIGHT - 20;
		}
	}
		
	
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function() {
	this.sprite = 'images/char-boy.png';
	this.x = 2*TILE_WIDTH;
	this.y = 5*TILE_HEIGHT-20;
	this.died = 0;
	this.win = 0;
}

Player.prototype.update = function() {
	if(this.x > 4*TILE_WIDTH)
		this.x = 4*TILE_WIDTH;
	if(this.x < 0)
		this.x = 0;
	if(this.y > 5*TILE_HEIGHT)
		this.y = 5*TILE_HEIGHT-20;
	if(this.y < 0)
		this.y = -20;
	//console.log(this.x+' '+this.y);
};

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
	//console.log(key);
	switch(key)
	{
		case 'left':
			this.x = this.x - TILE_WIDTH;
			break;
		case 'up':
			this.y = this.y - TILE_HEIGHT;
			break;
		case 'right':
			this.x = this.x + TILE_WIDTH;
			break;
		case 'down':
			this.y = this.y + TILE_HEIGHT;
			break;
	}
};
var enemy1 = new Enemy(30, TILE_HEIGHT*1-20, 1);
var enemy2 = new Enemy(30, TILE_HEIGHT*2-20, 2);
var enemy3 = new Enemy(30, TILE_HEIGHT*3-20, 3);

var allEnemies = [enemy1, enemy2, enemy3];
// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var player = new Player();

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

function checkCollisions()
{
	
	allEnemies.forEach(function(enemy) {
        if(enemy.y === player.y)
		{
			if(Math.abs(enemy.x-player.x) < 50)
			{
				player.died++;
				console.log('died '+player.died);
				//$('#lose').text('YOU LOSE ' + player.win + ' times ');
				player.x = 2*TILE_WIDTH;
				player.y = 5*TILE_HEIGHT-20;				
			}
		}
    });
	
	if(player.y < 0)//in the river
	{
		player.x = 2*TILE_WIDTH;
		player.y = 5*TILE_HEIGHT-20;		
		player.win++;
		console.log('win '+player.win);
		//var ptext = $('#win').text();
		$('#num').text(player.win + ' times ');
		$('#win').animateCss('wobble');
	}
}

//$(document).ready(
	$(function(){
		$('body').prepend('<div id=\'win\' class=\'win\'>YOU WIN</div>');
		$('<div id=\'num\' class=\"num\">0 times</div>').insertAfter('#win');
	});
//)
//扩展$对象，添加方法animateCss
    $.fn.extend({
        animateCss: function (animationName) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            $(this).addClass('animated ' + animationName).one(animationEnd, function() {
                $(this).removeClass('animated ' + animationName);
            });
    }
});