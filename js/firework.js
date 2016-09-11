var fireWork = (function() {
	//定义全局的工具函数
	/*1 返回给范围的随机数函数,四舍五入版*/
	function rand(minN, maxN) {
		return ~~((Math.random() * (maxN - minN + 1)) + minN);
	}
	/*2.返回给定范围的随机数，不四舍五入*/
	function randInt(minN, maxN) {
		return(Math.random() * (maxN - minN + 1)) + minN;
	}
	/*3.返回两点之间的距离函数*/
	function travelDistance(sx, sy, tx, ty) {
		var Xinstance = tx - sx;
		var Yinstance = ty - sy;
		return Math.sqrt(Math.pow(Xinstance, 2) + Math.pow(Yinstance, 2));
	}
	/*4.定义整个烟花效果的对象*/
	function Firework(canvas) {
		//全局变量
		//************************************
		this.canvas = canvas;
		//将canvas宽高设置为与屏幕同尺寸，同时设置全局变量cw,ch
		this.cw = this.canvas.width = window.innerWidth;
		this.ch = this.canvas.height = window.innerHeight;
		//设置全局变量context
		this.context = this.canvas.getContext('2d');
		//定义存储fire的数组结构
		this.firearr = [];
		//定义存储flower-line的数组
		this.particles = [];
		//最重要的一步缓冲全局变量this
		var _this = this;
		//*************************************

		//*****************************
		/*1.定义fire对象*/
		function Fire(sx, sy, tx, ty) {
			//设置想，和y的初始位置
			this.x = sx;
			this.y = sy;
			//将初始位置缓存到对象中
			this.sx = sx;
			this.sy = sy;
			//设置目标位置坐标
			this.tx = tx;
			this.ty = ty;
			//计算目标位置的距离
			this.travelTarget = travelDistance(sx, sy, tx, ty);
			//计算出两点之间的连线与x轴之间的夹角
			this.angle = Math.atan2(ty - sy, tx - sx);
			//初始化fire对象移动之后与原点之间的距离
			this.travelDist = 0;
			//为该Fire对象设置随机颜色
			this.hue = rand(0, 360);
			this.brightness = rand(50, 70);
			//初始化Fire对象的移动速度
			this.speed = 3;
			//设置加速度
			this.friction = 1.05;
			//初始化一个数组用于保存前一次Fire对象移动的位置
			this.coordinates = [];
			//设置存储位置的数量
			this.coordinatesCount = 3;
			//初始化coordinates
			while(this.coordinatesCount--) {
				this.coordinates.push([this.x, this.y]);
			}
		}
		/*Fire对象的constructor定义完毕*/
		//为Fire对象扩展为数据更新方法
		Fire.prototype.updata = function() {
				//将coordinates数组中的第一个位置的数据删除
				this.coordinates.pop();
				//向coordinates中插入最新的数据
				this.coordinates.unshift([this.x, this.y]);
				//更新速度
				this.speed *= this.friction;
				//计算水平和垂直方向的速度
				var vx = this.speed * Math.cos(this.angle);
				var vy = this.speed * Math.sin(this.angle);
				//改变位置
				this.x += vx;
				this.y += vy;
				//计算当前位置与原始点之间的距离
				this.travelDist = travelDistance(this.sx, this.sy, this.x, this.y);
			}
			//为Fire对象扩展边界判断方法
		Fire.prototype.judge = function(index) {
				if(this.travelDist >= this.travelTarget) {
					//移除到达目标点的fire对象
					_this.firearr.splice(index, 1);
					/*此处初始化flower*/
					_this.createParticles(this.x, this.y);
				}
			}
			//为Fire对象扩展绘画方法
		Fire.prototype.draw = function() {
				_this.context.beginPath();
				//将画笔移动至前一次fire位置
				_this.context.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
				//绘画纸当期那更新过的坐标位置
				_this.context.lineTo(this.x, this.y);
				//设置填充颜色
				_this.context.strokeStyle = 'hsl(' + this.hue + ', 100%, ' + this.brightness + '%)';
				//开始绘制
				_this.context.stroke();
				//关闭路径
				_this.context.closePath();
			}
			//*****************************

		//*****************************
		/*定义返回flower-line对象*/
		function particle(tx, ty) {
			//初始化particle对象的坐标位置
			this.x = tx;
			this.y = ty;
			//定义存储前一次particle对象的位置
			this.coordinates = [];
			//定义存储位置的个数
			this.coordinatesCount = 5;
			//初始化coordinates
			while(this.coordinatesCount--) {
				this.coordinates.push([this.x, this.y]);
			}
			//为particle对象初始化角度
			this.angle = randInt(0, Math.PI * 2);
			//初始化速度
			this.speed = rand(1, 10);
			//设置重力
			this.gravity = 1;
			//每一个Particle对象的颜色
			this.hue = rand(0, 360);
			this.brightness = rand(50, 70);
			//初始化透明度为1
			this.alpha = 1;
			//透明度递减量
			this.decay = 0.01;
			//设置加速度
			this.friction = 0.95;
		}
		//为particles扩展updata方法
		particle.prototype.updata = function(index) {
				//将第一个位置的数据记录清除
				this.coordinates.pop();
				//保存前一次的位置记录
				this.coordinates.unshift([this.x, this.y]);
				//改变速度
				this.speed *= this.friction;
				//通过角度及速度计算出水平和竖直方向的速度，并改变位置
				this.x += Math.cos(this.angle) * this.speed;
				this.y += Math.sin(this.angle) * this.speed + this.gravity;
				//透明度递减
				this.alpha -= this.decay;
			}
			/*particles绘制方法*/
		particle.prototype.draw = function() {
			_this.context.beginPath();
			_this.context.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
			_this.context.lineTo(this.x, this.y);
			_this.context.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
			_this.context.lineWidth = 2;
			_this.context.stroke();
			_this.context.closePath();
		}

		//**************************************************
		//操作函数
		this.createParticles = function(x, y) {
			var num = 50;
			while(num--) {
				this.particles.push(new particle(x, y));
			}
			return num; 
		}

		this.updataParticles = function() {
			var len = this.particles.length;
			if(len == 0) return;
			while(len--) {
				this.particles[len].updata();
				if(this.particles[len].alpha <= this.particles[len].decay) {
					this.particles.splice(len, 1);
				}
			}
		}
		this.drawParticles = function() {
			if(len == 0) return;
			var len = this.particles.length;
			while(len--) {
				this.particles[len].draw();
			}
		}

		//一: 初始化fire对象
		this.createFire = function() {
			if(this.firearr.length < 20) {
				this.firearr.push(new Fire(_this.cw / 2, this.ch - 5, rand(50, _this.cw), _this.ch / 3));
			}
		}
		this.updata = function() {
			var len = _this.firearr.length;
			while(len--) {
				this.firearr[len].updata();
			}
		}
		this.judge = function() {
			var len = this.firearr.length;
			while(len--) {
				this.firearr[len].judge();
			}
		}
		this.draw = function() {
			var len = this.firearr.length;
			while(len--) {
				this.firearr[len].draw();
			}
		}
		this.clean = function() {
			this.context.clearRect(0, 0, this.cw, this.ch);
		}

	}

	function loop() {
		requestAnimationFrame(loop);
		$fire.clean();
		$fire.createFire();
		$fire.drawParticles();
		$fire.draw();
		$fire.updata();
		$fire.updataParticles();
		$fire.judge();
	}

	function init(canvas) {
		$fire = new Firework(canvas);
		loop();
	}
	return {
		init: init
	}
})();