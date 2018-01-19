$("#decoration").append("判断系统平台:");
if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
	$("#decoration").append("IOS<br />");
	$("#decoration").append("获取Token:");
	getToken();
}else{
	$("#decoration").append("Android<br />");
	var lastTime = window.GMQuality.getCurrentTime();//获取上一次进入的时间
	var currentTime = new Date().getTime();//获取当前时间
	if((currentTime-lastTime)>=10000){
		window.GMQuality.logOut();
	}else{
		$("#decoration").append("获取Token:已获取<br />");
		localStorage.setItem("token",window.GMQuality.getToken());
		loadScript("../../lib/util_nm.js",function(){
			loadScript("../js/index2.js",function(){});
		});
		// window.GMQuality.refreshToken();
	}
}
function gm_getToken(oldToken){
	$("#decoration").append("已获取<br />");
	setTimeout(function(){
		localStorage.setItem("token",oldToken);
		loadScript("../../lib/util_nm.js",function(){
			loadScript("../js/index2.js",function(){});
		});
	},1000);
		
}