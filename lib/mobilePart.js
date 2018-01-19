function gm_refreshToken(newToken){
	setTimeout(function(){
		localStorage.setItem("token",newToken);
		var str = location.href;
		if(str.indexOf("html/index.html")>-1){
			$("#decoration").append("Token更新成功<br />");
			loadScript("../../lib/util_nm.js",function(){
				loadScript("../js/index2.js",function(){});
			});
		}else{
			$("#decoration").append("Token更新成功<br />");
			loadScript("../../../lib/util_nm.js",function(){});
		}
	},1000);
}
