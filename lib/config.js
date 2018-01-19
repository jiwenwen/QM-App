function getRootPath() {
    var pathName = window.location.pathname.substring(1);
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    if (webName == "") {
        return window.location.protocol + '//' + window.location.host;
    }
    else {
        return window.location.protocol + '//' + window.location.host + '/' + webName;
    }
}
var home_url = getRootPath();
console.info(home_url);
seajs.config({
	base: home_url + "/",
	alias: {
		"jquery": "lib/jquery/jquery.min",
		"mobiscroll": "lib/jquery/mobiscroll",
		"mobiscroll_date": "lib/jquery/mobiscroll_date",
		"nicescroll": "lib/jquery/jquery.nicescroll.min",
		"validate": "lib/jquery/jquery.validate.min",
		"fileupload": "lib/jquery/ajaxfileupload",
		"echarts": "lib/echarts/echarts.min",
		"vue": "lib/vue/dist/vue.min",
		"vue_res": "lib/vue/dist/vue-resource.min",
		"util": "lib/util"
	},
	preload: ["jquery","vue"]
});
function gm_refreshToken(newToken){
	setTimeout(function(){
		localStorage.setItem("token",newToken);
		var str = location.href;
		if(str.indexOf("html/index.html")>-1){
			loadScript("../../lib/util_nm.js",function(){
				loadScript("../js/index2.js",function(){});
			});
		}else{
			loadScript("../../../lib/util_nm.js",function(){});
		}
	},1000);
}
