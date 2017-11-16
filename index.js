// Food 对象
		;(function(window){
			// 建立一个数组 用来存 放入页面的食物
			var ele = [];
			function Food(x,y,width,height,color) {
				// 做一个默认处理 如果传入数据 按照传入的来    否则 按照默认走
				this.x = x || 0;
				this.y = y || 0;
				this.width = width || 20;
				this.height = height || 20;
				this.color = color || "green";
				
			}
			function randColor() {
				return "rgb("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+")"
			}
			// 渲染方法 将食物创建出来 放在map上
			Food.prototype.render = function(map) {
				remove();
				var oDiv = document.createElement("div");
				// 位置是随机的  800/20  = 40   0--40===0--39  *20  0---780 一个20位单位的一个随机位置
				this.x = Math.floor(Math.random()*(map.offsetWidth/this.width))*this.width;
				this.y = Math.floor(Math.random()*(map.offsetHeight/this.height))*this.height;
				// 将this对象上面的数据依次 赋给这个食物
				oDiv.style.left = this.x + "px";
				oDiv.style.top = this.y + "px";
				// 将食物变为绝对定位
				oDiv.style.position = "absolute";
				oDiv.style.width = this.width + "px";
				oDiv.style.height = this.height + 'px';
				this.color = randColor();
				oDiv.style.backgroundColor = this.color;
				//最后要把这个食物div 放入页面中map里面
				map.appendChild(oDiv);
				// 将这个放入页面的div食物 存入数组ele
				ele.push(oDiv);
			}
			
			
			
			//如果你要是不想挂载到对象身上  不想暴露到外面 去  指向在内部用一下 可以建立 私有方法
			// 属于当前食物环境里面的私有方法
			function remove() {
				for(var i = 0; i < ele.length; i++) {
					
				 	ele[i].parentNode.removeChild(ele[i]);
					
				}
				ele = [];
			}
			
			// 最后肯定要暴露出去这个构造函数
			window.Food = Food;
			
		})(window);
		
//===================

// 蛇对象
		;(function(window,Food){
			// 建立一个数组 用来存往页面上放置的蛇的组成部分
			var ele = [];
			
			// 把蛇抽象成一个对象
			// 属性： width  height  方向   body蛇的组成部分（头 两个身子）
			
			// 方法 render 把蛇放入页面中
			
		
			function Snake(width,height,direction) {
				// 蛇的宽高
				this.width = width || 20;
				this.height = height || 20;
				// 设定一个蛇的方向  默认为右
				this.direction = direction || "right";
				
				// 蛇的身体 建立一个数组  用来存三节身 每一个部位 都有颜色color和位置（x,y）
				this.body = [
					{x:3,y:2,color:"red"},
					{x:2,y:2,color:"orange"},
					{x:1,y:2,color:"orange"}
				];
			}
			
			Snake.prototype.render = function(map) {
				// 渲染之前先删除原来的页面上的蛇
				remove();
				
				// 根据蛇的身体这个数组 来循环生成蛇
				for(var i = 0; i < this.body.length; i++) {
					
					var oDiv = document.createElement("div");
					
					if(i==0) {
						oDiv.style.zIndex = 2;
					}
					
					oDiv.style.width = this.width + "px";
					oDiv.style.height = this.height + "px";
					oDiv.style.position = "absolute";
					// 让div生成的这部分 位置 等于body里面的坐标 依次循环赋值
					oDiv.style.left = this.body[i].x*this.width + "px";
					oDiv.style.top = this.body[i].y*this.height + "px";
					
					oDiv.style.backgroundColor = this.body[i].color;
					
					map.appendChild(oDiv);
					// 在循环渲染当中 只要 加进去一个蛇的部位 那么就将这个部位存到ele数组
					ele.push(oDiv);
				}
				
				
			}
			
			// 建立一个私有的方法成员 用来删除页面上原来的蛇的身体
			function remove() {
				for(var i = 0; i < ele.length; i++) {
					ele[i].parentNode.removeChild(ele[i]);
				}
				ele = [];
			}
			
			
			// 想要让蛇移动 ： 需要将蛇的每一部分都往前挪一下
			Snake.prototype.move = function(food,map){
				//让蛇的除了头　其他身体都已经往前挪了
				for(var i = this.body.length-1; i > 0; i--) {
					
					this.body[i].x = this.body[i-1].x;
					this.body[i].y = this.body[i-1].y;
					
				}
				
				//　头往哪走 取决于方向direction
				switch(this.direction) {
					
					case "left" :
						this.body[0].x -= 1;
					break;
					case "right":
						this.body[0].x += 1;
					break;
					case "up":
						this.body[0].y -= 1;
					break;
					case "down":
						this.body[0].y += 1;
					break;
				}
				
				// 检测是否碰到食物 如果 碰到 食物 则自身加一个最后的身体 让map上食物删除，重新生成一个随机的新的食物
				// 获取一下当前的蛇的头部坐标
				var headX = this.body[0].x * this.width; 
				var headY = this.body[0].y * this.height;
				// 判断是否碰撞上了食物
				if(headX == food.x && headY == food.y) {
					// 如果碰上了 则让自己的身体长一部分
					// 将原来的身体的最后一部分 存起来
					var last = this.body[this.body.length-1];
					// 往数组body里面添加进去最后一部分  最后效果就是增加了一节
					this.body.push({
						x: last.x,
						y: last.y,
						color :last.color
					})
					// 如果蛇已经把食物吃了 那么则食物应该删除 重新生成新的食物
					food.render(map);
				}
			}
			
			window.Snake = Snake;
			
		})(window,Food);
		
//=================
	// 游戏对象
			;(function(window,Food,Snake){
				function Game(map) {
					this.Food = new Food(); // this.Food.render();
					this.Snake = new Snake();
					this.map = map;
				}
				Game.prototype.start = function() {
					
					this.Food.render(this.map);
					this.Snake.render(this.map);
					// 下面是让蛇走起来
					runSnake(this);
					bindKey(this);
				}
				function runSnake(that) {
					var timer = setInterval(function(){
						that.Snake.move(that.Food,that.map);
						that.Snake.render(that.map);
						var headX = that.Snake.body[0].x * that.Snake.width;
						var headY = that.Snake.body[0].y * that.Snake.height;
						var maxX  = that.map.offsetWidth - that.Snake.width;
						var maxY = that.map.offsetHeight - that.Snake.height;
						if(headX <0 || headX > maxX) {
							clearInterval(timer);//停止蛇的运动
							alert("Game Over");
						}
						
						if(headY < 0 || headY > maxY) {
							clearInterval(timer);//停止蛇的运动
							alert("Game Over");
						}
					},200)
				}		
				function bindKey(that) {
					document.addEventListener("keydown",function(e){
						e = e || event;
						switch(e.keyCode) {
							case 37 :
								that.Snake.direction = "left";
							break;
							case 38 :
								that.Snake.direction = "up";
							break;
							case 39 :
								that.Snake.direction = "right";
							break;
							case 40 :
								that.Snake.direction = "down";
							break;
						}
					},false);
				}
				window.Game = Game;
			})(window,Food,Snake);
			
			
		
		
			