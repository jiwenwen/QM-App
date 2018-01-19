var QMApp = new Vue({
    el: "#QMApp",
    data: {
    	
    },
    created: function(){

    },
    mounted: function(){
        this.init();
    },
    watch: {

    },
    methods: {
        init: function(){
        	this.getDatalevel();
        },
        getDatalevel: function(){
            var celarTime = null;
            clearTime = setTimeout(function(){
                $("#decoration").append("出现错误<br /><span style='color:red;'>请求超时</span>");
            },30000);
            $("#decoration").append("获取用户角色:");
        	this.$http.get("http://222.92.194.195:9087/api/PMQualityCheckApi/GetRoleByToken").then(function (response){
                clearTimeout(celarTime);
                var role = response.data.Role;
				localStorage.setItem("role",role);
            	if(response.data.Role==1){
                    $("#decoration").append("工管可操作<br />");
                    $("#decoration").append("跳转中...");
            		$.cookie("isall", 1, {path: "/"});
            		$.cookie("search","",{path: "/"});
            		$.cookie("status",2,{path: "/"});
            		window.location="staff/proList.html";
            	}
				else if(response.data.Role==2){
                    $("#decoration").append("项目经理可操作<br />");
                    $("#decoration").append("跳转中...");
					$.cookie("search","",{path: "/"});
            		$.cookie("status",1,{path: "/"});
            		window.location="manager/proList.html";
            	}
				else if (response.data.Role==3){
                    $("#decoration").append("项目经理仅查看<br />");
                    $("#decoration").append("跳转中...");
					$.cookie("search","",{path: "/"});
            		$.cookie("status",1,{path: "/"});
					window.location="manager/proList.html";
				}
				else if (response.data.Role==4){
                    $("#decoration").append("工管仅查看<br />");
                    $("#decoration").append("跳转中...");
					$.cookie("isall", 0, {path: "/"});
					$.cookie("search","",{path: "/"});
            		$.cookie("status",2,{path: "/"});
					window.location="staff/proList.html";
				}
                else if (response.data.Role==5){
                    $("#decoration").append("质量员可操作<br />");
                    $("#decoration").append("跳转中...");
                    $.cookie("isall", 1, {path: "/"});
                    $.cookie("search","",{path: "/"});
                    $.cookie("status",2,{path: "/"});
                    window.location="quality/proList.html";
                }
				else{
                    $("#decoration").append("没有权限<br />");
            		util.notification.simple("您没有权限，请联系管理员!!!");
            		setTimeout(function(){
            			if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
                            $(".qm-con").text("您没有权限，请联系管理员!!!");
                        }else{
                            window.GMQuality.logOut();
                        }
            		},2000);
            	}
            },function(response){
                clearTimeout(celarTime);
            	if(response.status==401){
                    $("#decoration").append("Token失效，正在重试...<br />");
                    // util.notification.simple("登录失效，请重试");
                    if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
                        refreshToken();
                    }else{
                        window.GMQuality.refreshToken();
                    }
                }else{
                    $("#decoration").append("网络异常<br />");
                    util.notification.simple("网络连接异常");
                }
            });
        }
    }
})