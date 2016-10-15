var FontRain = (function() {

	var c = document.getElementById("c");
	var ctx = c.getContext("2d");

	//初始化画布为屏幕的尺寸
	c.height = window.innerHeight;
	c.width = window.innerWidth;

	//设置将要绘制的字符
	var chinese = "01";
	//将字符强转为数组
	chinese = chinese.split("");
	//设置绘制字体的大小（像素）
	var font_size = 10;
	//计算出屏幕所能存放的字体的行数
	var columns = c.width / font_size; 
	//drop的数量为列数，drop数组的内容代表着将要绘制的列数
	var drops = [];
	for(var x = 0; x < columns; x++)
		drops[x] = 1;

	//drawing the characters
	function draw() {
		//设置画布刷新的颜色为黑色半透明，目的是为了让已绘制上去的字体不会在刷新后立即消失
		ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
		//清除画布
		ctx.fillRect(0, 0, c.width, c.height);
		//设置绘制字体的颜色
		ctx.fillStyle = "#0780d4"; 
		//设置字体颜色
		ctx.font = font_size + "px arial";
		//循环绘制
		for(var i = 0; i < drops.length; i++) {
			//随机获取转换成数组的字符串中的字符
			var text = chinese[Math.floor(Math.random() * chinese.length)];
			//将字符绘制在画布上，text表示绘制的文本，i*font_size 表示将要绘制字体的x坐标，当然后面一个参数代表的是y坐标
			ctx.fillText(text, i * font_size, drops[i] * font_size);

			//目的是为了使每一列的数据以不同的速度出现
			if(Math.random() > 0.975) {
				drops[i] = 0;
			}

			//当一行画画满时，开始绘制下一行
			drops[i]++;
		}
	}
	//定时器没35毫秒执行一次
	function initRainFont(){
		setInterval(draw, 35);
	}
	return {
		initFontRain:initRainFont
	};
})();