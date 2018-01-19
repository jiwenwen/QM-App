
//function openGallery(e){};
var para="";
var QMApp = new Vue({
    el: "#QMApp",
    data: {
    	checkId:"",
//      提交用
		ImgUrls:[],
		/*ImgUrls:[
        	{"Doc_Name":"image00.jpg","Doc_Path":"2017\\\\12\\\\9\\\\image003444.jpg","Doc_Size":30201}
    	],*/
//      显示用
		Imgs:[],
		/*Imgs:[
        	{"Doc_Path":"http://222.92.194.195:9087/DownLoad/2017/12/9/image003444.jpg"}
    	],*/
		viewImg:[],
		displacement:'',
    	problemType:"",
    	description:"",
    	projectName:"",
    	projName:{Project_Name:"",Project_Id:""},
    	draftMessage:{
    		Project_Name:'',
    		Project_Id:'',
    		Question_Level:'',
    		Question_Type:'',
    		Type_Name:'',
    		Question_Desc:'',
    		Memo:''
    	}/*,
    	projectId : util._param.projectId,
    	listId : util._param.listId*/
    },
    created: function(){
		
    },
    beforeUpdate:function(){
    	
    },
    updated:function(){
    	
    },
    mounted: function(){
        this.initpage();
    },
    beforeMount:function(){
    	
    },
    watch: {
		
    },
    methods: {
        init: function(){
        	this.getproblemType();
        	this.initDate();
        	this.things();
//			上传图片
        	$(".uploadPhotos").on("click",".choose-photo",function(){
        		var num = $(".uploadPhotos img").length;
//      		调用移动端方法
				if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
					openGallery(num+3);
				}else{
					window.GMQuality.openGallery(num+3);
				}
        	});
        	function fun_date(aa){
			    var date1 = new Date(),
			        time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
			    var date2 = new Date(date1);
			    date2.setDate(date1.getDate()+aa);
			    var month = date2.getMonth() + 1;
			    var strDate = date2.getDate();
			    if (month >= 1 && month <= 9) {
			        month = "0" + month;
			    }
			    if (strDate >= 0 && strDate <= 9) {
			        strDate = "0" + strDate;
			    }
			    var time2 = date2.getFullYear()+"-"+ month+"-"+strDate;
			    return time2;
			}
        	var deadline = fun_date(7);
        	$(".pub-content .closeTime input").val(deadline);
        },
//      是否进行初始化
		initpage:function(){
			/*判断设备*/
			/*var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
			if(isiOS){
				$("html").css("padding-top","20px");
				$("html").css("box-sizing","border-box");
			}*/
			if(util._param.status){
				$(".header").children("span").text("编辑草稿");
			}else{
				$(".header").children("span").text("添加整改");
			}
			var projectId;
			if(util._param.projectId){
				projectId = util._param.projectId;
				if(util._param.listId){
					var listId = util._param.listId;
					this.draftDetail(projectId,listId);
					$(".submit-cover").show();
				}else{
					this.getprojectList(0,"",projectId,function(){});
					$(".submit-cover").show();
				}
			}
			this.init();
		},
		/*searchResults:function(){
			setTimeout();
		},*/
//      时间控件
		initDate: function(){
			var currYear = (new Date()).getFullYear();
			var opt = {};
			opt.date = {
				preset: 'date'
			};
			opt.datetime = {
				preset: 'datetime'
			};
			opt.time = {
				preset: 'time'
			};
			opt.default = {
				theme: 'android-ics light', //皮肤样式
				display: 'modal', //显示方式 
				mode: 'scroller', //日期选择模式
				dateFormat: 'yyyy-mm-dd',
				lang: 'zh',
				showNow: true,
				nowText: "今天",
				startYear: (new Date()).getFullYear(), //开始年份
				startMonth:(new Date()).getMonth(),
            	startDay:(new Date()).getDate(),
				endYear: currYear //结束年份
			};
        	$("#closeTime").mobiscroll($.extend(opt['date'], opt['default']));
		},
		workflow:function(checkId,projectId){
			/*初始化工作流*/
            var params2={
                Check_Id:checkId,
                Project_Id:projectId
            };
            QMApp.$http.get(util.baseUrl + "PMQualityCheckApi/InitWorkFlow",{params:params2}).then(function(response){
                var result1=response.data.WorkFlow;
				if(response.data.Flag){
				    /*提交表单到工作流*/
				    var params3={
				        Comand:1,
				        EnumPageMode:result1.EnumPageMode,
				        keyID:checkId,
				        Idea:result1.Idea,
				        checkStatus:1,
				        wfName:result1.WFName,
				        wfPublishID:result1.WFPublishID,
				        isCustomFlow:result1.IsCustomFlow,
				        selectUserID:result1.SelectUserID,
				        IsEmergency:result1.IsEmergency,
				        ActorTokenId:result1.ActorTokenId,
				        MenuID:result1.MenuID,
				        DeptID:result1.DeptID,
				        CurrentUser:result1.CurrentUser,
				        DeptName:result1.DeptName,
				        SubmitPrefix:result1.SubmitPrefix,
				        WFTokenName:result1.WFTokenName,
				        Amount:result1.Amount,
				        ProjectId:projectId
				    };
                    this.$http.post(util.baseUrl + "WorkFlowApi/Confirm",params3,{emulateJSON:true}).then(function(response){
                    	var result3=response.data.checkStatus;
						util.notification.simple(response.data.message);
						/*工作流回调*/
						var params4={
						    KeyID:result3.KeyID,
						    Completed:result3.Completed,
						    Started:result3.Started,
						    Viewed:result3.Viewed
						};
                        this.$http.post(util.baseUrl + "PMQualityCheckApi/SetCheckStatus",params4).then(function(response){
                            var result4=response.data;
                            if(result4.Flag){
                            	$(".submit-cover").hide();
                            	setTimeout(function(){
                            		if(util._param.status){
                            			history.back();
                            		}else{
                            			window.location="submitQ.html?projectId="+projectId;
                            		}
                            	},2000);
                            }else{
                            	$(".submit-cover").hide();
								util.notification.simple("接口异常类型6");
                            }
						}, function(response){
							$(".submit-cover").hide();
                            util.tokenFailure(response,util);
		                	util.notification.simple("网络连接异常6");
                        });
                    }, function(response){
                    	$(".submit-cover").hide();
                        util.tokenFailure(response,util);
	                	util.notification.simple("网络连接异常5");
                    });
                }else{
                	$(".submit-cover").hide();
                    util.notification.simple(result.Msg+"\n\r接口异常类型4");
                }
            }, function(response){
            	$(".submit-cover").hide();
                util.tokenFailure(response,util);
                util.notification.simple("网络连接异常4");
            });
		},
//			非空验证
		validMessage:function(){
//			获取项目id
			var projectId = $(".projectName input").attr("projectId");
//			获取问题等级
			var problemLevel = $(".levelSelect").text();
//			获取问题类别id
			var problemType = $(".problemType input").attr("problemType");
//			获取问题描述
			var problemDes;
			if($(".problemType .problemList").val()=="其他"){
				problemDes = $(".problemDescription textarea").val();
			}else{
				problemDes = $(".problemDescription input").val();
			}
			var note = $(".remarks textarea").val();
			var Files = QMApp.ImgUrls;
			if(projectId!=""){
				return false;
			}else if(problemLevel!="C"){
				return false;
			}else if(problemType!=""){
				return false;
			}else if(problemDes!=""){
				return false;
			}else if(note!=""){
				return false;
			}else if(Files.length!=0){
				return false;
			}else{
				return true;
			}
		},
//          事件
        things:function(){
//      	网页跳转前进行离开警告
			$(".header").on("click","div",function(){
				var value = $(this).attr("value");
				if(QMApp.validMessage()){
					if(value=="back"){
						history.back();
					}else{
						window.location="proList.html";
					}
				}else{
					var confirm = util.notification.confirm("存在未保存的数据，确认要离开吗？", function(e, type) {
					    if (type == true) {
					        if(value=="back"){
								history.back();
							}else{
								window.location="proList.html";
							}
					    }else{
					        confirm.hide();
					    }
					});
					confirm.show();
				}
			});
        	/*window.onbeforeunload=function(){
			    return "你确定要离开吗";
			}*/
			/*window.onunload = function(){
			   return "你确定要离开吗"
			}*/
//      	图片预览
        	$(".uploadPhotos").on("click","img",function(){
        		var basewidth = parseInt($(".view").width());
        		QMApp.viewImg=QMApp.Imgs;
        		var index = $(this).parent().index()-1;
        		var displacement = (-1*index*100);
        		QMApp.displacement = displacement;
        		$(".view").show();
        		setTimeout(function(){
        			var pressedObj;  // 当前左滑的对象
                    var lastLeftObj; // 上一个左滑的对象
	        		for(var i=0;i<$(".touch").length;i++){
						$(".touch")[i].addEventListener("touchstart",function(e){
							lastXForMobile = e.changedTouches[0].pageX;
						    pressedObj = this; // 记录被按下的对象
						    // 记录开始按下时的点
						    var touches = event.touches[0];
						    start = {
						        x: touches.pageX, // 横坐标
						        y: touches.pageY  // 纵坐标
						    };
						});
						$(".touch")[i].addEventListener("touchmove",function(e){
							// 计算划动过程中x和y的变化量
						    var touches = event.touches[0];
						    delta = {
						        x: touches.pageX - start.x,
						        y: touches.pageY - start.y
						    };
						    // 横向位移大于纵向位移，阻止纵向滚动
						    if (Math.abs(delta.x) > Math.abs(delta.y)) {
						        event.preventDefault();
						    }
						});
						$(".touch")[i].addEventListener('touchend', function(e){
						    var diffX = e.changedTouches[0].pageX - lastXForMobile;
						    if (diffX < -45&&index<$(".touch").length-1) {
						    	QMApp.displacement=QMApp.displacement-100;
						    	index=index+1;
						    } else if (diffX > 45&&index>0) {
						        QMApp.displacement=QMApp.displacement+100;
						        index=index-1;
						    }
						});
					}
	        	},50);
        	});
        	$(".view").on("click","div",function(){
        		$(".view").hide();
        		QMApp.viewImg="";
        	});
//      	手动滑动图片轮流播
			
//      	删除图片
        	$(".uploadPhotos").on("click","i",function(){
        		var route = $(this).next().attr("src");
        		var index;
//      		alert(route);
				for(var i= 0;i<QMApp.Imgs.length;i++){
    				if(route==QMApp.Imgs[i].Doc_Path){
    					index = i;
    				}
    		}
				QMApp.Imgs.splice(index,1);
				QMApp.ImgUrls.splice(index,1);
				return false;
        	});
//          打开选择问题类别弹窗
			$(".problemType").on("click","input",function(){
				$(".problemTypewindow").show(10,function(){
        			$(".problemTypewindow").addClass("problemSubclass");
        			setTimeout(function(){
        				$(".problemTypewindow-header").show();
        			},150);
        		});
			});
//			选择问题类别关闭
			$(".problemTypewindow-header").on("click","span",function(){
				$(".problemSubclass").removeClass("problemSubclass");
				setTimeout(function(){
					$(".problemTypewindow").hide();
    				$(".problemTypewindow-header").hide();
    			},150);
			});
//          	选择问题类型
			$(".problemTypewindow").on("click","li",function(){
				QMApp.draftMessage.Question_Type=$(this).attr("value");
				QMApp.draftMessage.Type_Name=$(this).text();
				/*$(".problemType input").attr("problemType",$(this).attr("value"));
				$(".problemType input").val($(this).text());*/
				var parentId=$(this).attr("value"),
					name = $(this).text();
				if(name == "其他"){
        			/*$(".probdes1").parent().hide();
        			$(".probdes2").parent().attr("colspan","2");*/
//          			$(".probdes2").show();
        		}else{
//          			$(".probdes2").hide();
//          			$(".probdes2").parent().attr("colspan","1");
//          			$(".probdes1").parent().show();
					QMApp.draftMessage.Question_Desc="";
        			QMApp.getproblemDes(parentId);
        			$(".submit-cover").show();
        		}
        		
        		$(".problemTypewindow-header span").trigger("click");
        		
        		/*$(".problemSubclass").removeClass("problemSubclass");
				setTimeout(function(){
					$(".problemTypewindow").hide();
    				$(".problemTypewindow-header").hide();
    			},400);*/
    			
			});
//          	进入选择项目
        	$(".form_submitType1").on("click",".projectList",function(){
        		QMApp.getprojectList(0,"","0",function(result){
        			if(result=="-1"||result==-1){
        				$(".project_list .pbuttom").attr("cango","false");
        			}else{
        				$(".project_list .pbuttom").attr("cango","true");
        			}
        		});
        		$(".submit-cover").show();
        		$(".project_list").show(function(){
        			$(".project_list").addClass("project_listShow");
            		setTimeout(function(){
        				$(".project_list .pheader").show();
        			},250);
        		});
	        });
//          	项目搜索触发1
        	$(".pheader").on("click",".psearchbtn",function(){
        		var value = $(this).next().val();
        		$(".project_list .pbuttom").attr("index","0");
        		QMApp.getprojectList("0",value,"0",function(result){
        			if(result=="-1"||result==-1){
        				$(".project_list .pbuttom").attr("cango","false");
        			}else{
        				$(".project_list .pbuttom").attr("cango","true");
        			}
        		});
        		$(".submit-cover").show();
        	});
//          	项目搜索触发2   
			$(".pheader .psearchbox").on("keydown","input",function(event){
				if (event.keyCode == 13){
					var value = $(".project_list input").val();
					$(".project_list .pbuttom").attr("index","0");
        			QMApp.getprojectList("0",value,"0",function(result){
        				if(result=="-1"||result==-1){
	        				$(".project_list .pbuttom").attr("cango","false");
	        			}else{
	        				$(".project_list .pbuttom").attr("cango","true");
	        			}
        			});
        			$(".submit-cover").show();
				}
			});
			$(".pheader").on("click",".psearchclear",function(){
				$(this).prev().val("");
				$(".project_list .pbuttom").attr("index","0");
				QMApp.getprojectList("0","","0",function(result){
    				if(result=="-1"||result==-1){
        				$(".project_list .pbuttom").attr("cango","false");
        			}else{
        				$(".project_list .pbuttom").attr("cango","true");
        			}
    			});
    			$(".submit-cover").show();
			});
//          	项目取消选择
        	$(".project_list").on("click",".pcancel",function(){
        		QMApp.projectName="";
        		$(".project_list input").val("");
        		$(".project_list .pbuttom").attr("index","0");
        		$(".project_listShow").removeClass("project_listShow");
        		setTimeout(function(){
    				$(".project_list .pheader").hide();
    				$(".project_list").hide();
    			},150);
        	});
//          	选择项目
        	$(".project_list").on("click","li",function(){
//          		$(".projectList").val($($(this).children("span")[0]).text()+$($(this).children("span")[1]).text());
//          		$(".projectList").val($($(this).children("span")[1]).text());
//          		$(".projectList").attr("projectId",$(this).attr("projectId"));
				QMApp.draftMessage.Project_Name=$($(this).children("span")[1]).text();
				QMApp.draftMessage.Project_Id=$(this).attr("projectId");
        		$(".project_list .pcancel").trigger("click");
        	});
//          	上一页下一页
			$(".project_list").on("click",".pbuttom>span",function(){
				var $this = $(this);
				var value=$(".psearchbox input").val();
				var currentIndex = parseInt($(this).parent().attr("index"));
				var num = parseInt($(this).attr("value"));
				var cango = $(this).parent().attr("cango");
				var index ;
				if(num<0){
					$(".project_list .pleft").css("background-position-y","-6.4rem");
					$(".project_list .pright").css("background-position-y","-6.3rem");
				}else{
					$(".project_list .pright").css("background-position-y","-1.2rem");
					$(".project_list .pleft").css("background-position-y","-1.2rem");
				}
				if(currentIndex==0){
					if(num<0){
						util.notification.simple("已经是第一页");
						return false;
					}else{
						if(cango=="false"){
							util.notification.simple("结果仅有一页");
							return false;
						}else{
							index = currentIndex+num;
							$(this).parent().attr("cango",true);
						}
					}
				}else{
					if(num<0){
						index = currentIndex+num;
						$(this).parent().attr("cango",true);
					}else{
						if(cango=="false"){
							util.notification.simple("已经是最后一页");
							return false;
						}else{
							index = currentIndex+num;
							$(this).parent().attr("cango",true);
						}
					}
				}
				if(index>=0){
					QMApp.getprojectList(index,value,"0",function(result){
						if(result=="-1"||result==-1){
							util.notification.simple("已经到最后一页");
							$this.parent().attr("cango","false");
						}else{
							$this.parent().attr("cango","true");
						}
						$this.parent().attr("index",index);
//						$(".project_list .pbuttom").attr("index",index);
						$(".project_list .pcontent").scrollTop(0);
					});
					$(".submit-cover").show();
				}
			});
			/*$(".asdf").on("click",function(){
				openGallery(3);
			})*/
//          	点击选择类别
        	/*$(".formTable").on("change",".problemType input",function(){
        		var parentId = $(this).attr("problemType"),
        				name = $(this).val();
        		if(name == "其他"){
        			$(".probdes1").hide();
        			$(".probdes2").parent().attr("colspan","2");
        			$(".probdes2").show();
        		}else{
        			$(".probdes2").hide();
        			$(".probdes2").parent().attr("colspan","1");
        			$(".probdes1").show();
        			QMApp.getproblemDes(parentId);
        		}
        	})*/
//          	问题描述选择打开页面
        	$(".problemDescription").on("click","input",function(){
        		if($(".problemList").attr("problemType")=="0"){
        			util.notification.simple("请选择问题类别！");
        			return false;
        		}
        		// QMApp.getproblemDes(0); 
        		$(".problemSub").show(10,function(){
        			$(".problemSub").addClass("problemSubclass");
        			setTimeout(function(){
        				$(".problemList-header").show();
        			},350);
        		});
        	});
//          	问题描述选择
			$(".problemSub").on("click","li",function(){
				if($(this).children("span").hasClass("problemSelect")){
//						console.info($(this).next().html());
				}else{
					$(".problemSelect").css("background-image","url(../../images/staff/form/radio-un.png)");
					$(".problemSelect").removeClass("problemSelect");
					$(this).children("span").addClass("problemSelect");
					$(".problemSelect").css("background-image","url(../../images/staff/form/radio-ye.png)");
				}
			});
			$(".problemSub").on("focus","textarea",function(){
				if($(this).prev("span").hasClass("problemSelect")){
//						
				}else{
					$(".problemSelect").css("background-image","url(../../images/staff/form/radio-un.png)");
					$(".problemSelect").removeClass("problemSelect");
					$(this).prev("span").addClass("problemSelect");
					$(".problemSelect").css("background-image","url(../../images/staff/form/radio-ye.png)");
				}
			});
//			问题描述选择提交
			$(".problemSub").on("click",".sure",function(){
				if($(".problemSub span").hasClass("problemSelect")){
					var name = $(".problemSelect").next().prop("tagName");
					if(name == "P"){
						QMApp.draftMessage.Question_Desc=$(".problemSelect").next().html();
					}else{
						QMApp.draftMessage.Question_Desc=$(".problemSelect").next().val();
					}
//					$(".problemSelect").next().val("");
					$(".problemSub").find(".back").trigger("click");
				}else{
					$(".problemSub").find(".back").trigger("click");
					QMApp.draftMessage.Question_Desc="";
				}
//				$(".problemSub textarea").val("");
			});
//          问题描述选择返回
			$(".problemSub").on("click",".back",function(){
				setTimeout(function(){
					$(".problemList-header").hide();
    				$(".problemSub").hide();
//  				$(".problemSelect").css("background-image","url(../../images/staff/form/radio-un.png)");
//  				$(".problemSelect").removeClass("problemSelect");
    			},150);
				$(".problemSub").removeClass("problemSubclass");
			});
//          	等级的选择
        	$(".levelClass").on("click","li",function(){
        		var val = $(this).attr("value");
        		$(".levelSelect").removeClass("levelSelect");
        		$(this).addClass("levelSelect");
        		if(val == 1){
        			if($(this).hasClass("problemLevel1")){}
        			else{
        				$(this).addClass("problemLevel1");
        				$(".problemLevel2").removeClass("problemLevel2");
        				$(".problemLevel3").removeClass("problemLevel3");
        				QMApp.draftMessage.Question_Level="A";
        			}
	        	}else if(val == 2){
        			if($(this).hasClass("problemLevel2")){}
        			else{
        				$(this).addClass("problemLevel2");
        				$(".problemLevel1").removeClass("problemLevel1");
        				$(".problemLevel3").removeClass("problemLevel3");
        				QMApp.draftMessage.Question_Level="B";
        			}
	        	}else{
        			if($(this).hasClass("problemLevel3")){}
        			else{
        				$(this).addClass("problemLevel3");
        				$(".problemLevel2").removeClass("problemLevel2");
        				$(".problemLevel1").removeClass("problemLevel1");
        				QMApp.draftMessage.Question_Level="C";
        			}
        		}
        	});
//          	确认提交弹窗取消确定之确定
			$(".pub-confirmSub").on("click",".pub-buttom>div",function(){
				var val = $(this).attr("value");
				if(val == "true"){
					$(".submit-cover").show();
				}
//				获取项目id
				var projectId = $(".projectName input").attr("projectId");
//				获取问题等级
				var problemLevel = $(".levelSelect").text();
//				获取问题类别id
				var problemType = $(".problemType input").attr("problemType");
//				获取问题描述
				var problemDes;
				if($(".problemType .problemList").val()=="其他"){
					problemDes = $(".problemDescription textarea").val();
				}else{
					problemDes = $(".problemDescription input").val();
				}
//				获取照片文件流对象base64
				var Files = QMApp.ImgUrls;
//				var a=JSON.stringify(QMApp.ImgUrls),b=JSON.stringify(QMApp.Imgs);
//				console.info(a+"*------*"+b);
//				获取备注
				var note = $(".remarks textarea").val();
				var closeTime=$(this).parent().prev().find("input").val();
//				debugger;
				var listID;
				if(util._param.listId){
					listID=util._param.listId;
				}else{
					listID="0";
				}
				var checkID;
//				待完成
				if(util._param.checkId){
					checkID=util._param.checkId;
				}else{
					checkID="0";
				}
				if(closeTime==""){
					$(".submit-cover").hide();
					util.notification.simple("关闭时间未确定");
					return false;
				}
				
				if(val == "false"){
					$(".form_submitType1Blur").removeClass("form_submitType1Blur");
					$(".pub-confirmSub").css({"top":"100%","opacity":"0"},function(){
						$(".pub-confirmSub").hide();
					});
				}else{
					QMApp.submitText(checkID,listID,projectId,closeTime,problemLevel,problemType,problemDes,Files,note,1);
					$(".submit-cover").show();
					$(".form_submitType1Blur").removeClass("form_submitType1Blur");
					$(".pub-confirmSub").css({"top":"100%","opacity":"0"},function(){
						$(".pub-confirmSub").hide();
					});
				}
			});
//			新增整改的保存草稿
			$(".sb_bottom").on("click","div",function(){
				var type=$(this).attr("value");
				if(type == "save"){
					$(".submit-cover").show();
				}
//				获取项目id
				var projectId = $(".projectName input").attr("projectId");
//				获取问题等级
				var problemLevel = $(".levelSelect").text();
//				获取问题类别id
				var problemType = $(".problemType input").attr("problemType");
//				获取问题描述
				var problemDes;
				if($(".problemType .problemList").val()=="其他"){
					problemDes = $(".problemDescription textarea").val();
				}else{
					problemDes = $(".problemDescription input").val();
				}
//				获取照片文件流对象base64
				var Files = QMApp.ImgUrls;
//				获取备注
				var note = $(".remarks textarea").val();
				var listID;
				if(util._param.listId){
					listID=util._param.listId;
				}else{
					listID="0";
				}
				var checkID;
//				待完成
				if(util._param.checkId){
					checkID=util._param.checkId;
				}else{
					checkID="0";
				}
				
				
				if(type == "none"){
					
				}else if(type == "save"){/*保存*/
					if(projectId==""){
						$(".submit-cover").hide();
						util.notification.simple("项目未选择");
						return false;
					}else{
						if(problemType==""){
							problemType = 0;
						}
					}
					QMApp.submitText(checkID,listID,projectId,"",problemLevel,problemType,problemDes,Files,note,0);
					// $(".submit-cover").show();
				}else{/*提交*/
					if(projectId==""){
						util.notification.simple("项目未选择");
						return false;
					}else if(problemLevel==""){
						util.notification.simple("问题等级参数有误,请检查数据或者联系管理员");
						return false;
					}else if(problemType==""||problemType==0||problemType=="0"){
						util.notification.simple("问题类别未选择");
						return false;
					}else if(problemDes==""){
						util.notification.simple("问题描述未选择");
						return false;
					}else if(QMApp.ImgUrls.length==0){
						util.notification.simple("请上传图片");
						return false;
					}
					$(".header").addClass("form_submitType1Blur");
					$(".form_submitType1").addClass("form_submitType1Blur");
					$(".footer").addClass("form_submitType1Blur");
					$(".pub-confirmSub").show();
					$(".pub-confirmSub").css({"top":"0","opacity":"1"});
				}
			});
				
			$("#pict").on("change",function () {
				function readFile(){
		            var files=$("#pict")[0].files;
		            for(var i = 0;i<files.length;i++){
		            	var file = files[i];
		            	var reader=new FileReader();
			            reader.readAsDataURL(file);
			            reader.onload=function(){
							QMApp.imgBase64.push({"ContentType":file.type,"FileName":file.name,"FileBase":this.result});
			            };
		            }
		        }
				if($("#pict")[0].files[0]){
					readFile();
				}else{
					return false;
				}
			});
        },
//      获取项目编号名称
        getprojectList:function(pageIndex,condition,projectId,callback){
        	var params;
        	if(condition==""){
        		params={
        			"PageIndex":pageIndex,
            		"PageSize":"30",
            		"projectId":projectId
        		};
        	}else{
        		params={
        			"PageIndex":pageIndex,
            		"PageSize":"30",
            		"projectId":projectId,
            		"searchcriteria":condition
        		};
        	}
        	util.timeOut();
       		this.$http.get(util.baseUrl + 'PMQualityCheckApi/GetProjectList',{params:params}).then(function(response){
       			if(response.data.Flag){
       				$(".submit-cover").hide();
       				this.projectName=response.data.Content;
       				util.timeOut(1);
       				if(projectId!="0"){
       					this.draftMessage.Project_Name = response.data.Content[0].Project_Name;
       					this.draftMessage.Project_Id = util._param.projectId;
       				}
       				if(response.data.Content.length==0&&pageIndex==0){
       					util.notification.simple("查询结果为空");
       				}
       				if(response.data.Content.length<30){
       					callback(-1);
       				}else{
       					callback(1);
       				}
       			}else{
       				$(".submit-cover").hide();
       				util.timeOut(1);
       				util.notification.simple("接口异常");
       			}
       		},function(response){
       			$(".submit-cover").hide();
       			util.tokenFailure(response,util);
       		});
        },
//          获取问题类别
        getproblemType:function(){
        	util.timeOut();
       		this.$http.get(util.baseUrl + 'PMQualityCheckApi/GetQualityTypeList').then(function(response){
       			if(response.data.Flag){
       				util.timeOut(1);
       				$(".submit-cover").hide();
       				this.problemType=response.data.Content;
       				// this.getproblemDes(response.data.Content[0].Type_Id);
       			}else{
       				util.timeOut(1);
       				$(".submit-cover").hide();
       				util.notification.simple("接口异常");
       			}
       		},function(response){
       			$(".submit-cover").hide();
       			util.tokenFailure(response,util);
       		});
        },
//          获取问题描述
        getproblemDes:function(parentId){
        	util.timeOut();
        	this.$http.get(util.baseUrl + 'PMQualityCheckApi/GetQualityCheckDetailList',{params:{"parentID":parentId}}).then(function(response){
        		if(response.data.Flag){
        			util.timeOut(1);
        			this.description=response.data.Content;
        			$(".submit-cover").hide();
        		}else{
        			util.timeOut(1);
       				$(".submit-cover").hide();
       				util.notification.simple("接口异常");
       			}
        	},function(response){
        		$(".submit-cover").hide();
       			util.tokenFailure(response,util);
        	});
        },
//          获取草稿详情
        draftDetail:function(projectId,listId){
        	this.$http.get(util.baseUrl + 'PMQualityCheckApi/GetQualityDetailList',{params:{"PageIndex":"0","PageSize":"10",
        	"ProjectId":projectId,"Status":"0","List_Id":listId}}).then(function(response){
        		if(response.data.Flag){
        			this.draftMessage.Project_Name=response.data.Content[0].Project_Name;
        			this.draftMessage.Project_Id=response.data.Content[0].Project_Id;
        			this.draftMessage.Question_Level=response.data.Content[0].Question_Level;
        			this.draftMessage.Type_Name=response.data.Content[0].Type_Name;
        			this.draftMessage.Question_Type=response.data.Content[0].Question_Type;
        			this.draftMessage.Question_Desc=response.data.Content[0].Question_Desc;
        			this.draftMessage.Memo=response.data.Content[0].Memo;
        			this.draftMessage.Check_History_Id = response.data.Check_History_Id;
//					问题类别预加载
					if(this.draftMessage.Question_Type!=0){
						this.getproblemDes(this.draftMessage.Question_Type); 
					}     			
//      			图片初始化
					var Attachments=response.data.Content[0].Attachments;
					var do_imgs=[],do_Imgs=[];
					for(var i=0;i<Attachments.length;i++){
						do_imgs.push({"Doc_Path":Attachments[i].filePath});
						do_Imgs.push({"Doc_Name":Attachments[i].fileName,"Doc_Path":Attachments[i].relativePath,"Doc_Size":Attachments[i].doc_size});
					}
					QMApp.Imgs = do_imgs;
					QMApp.ImgUrls = do_Imgs;
//      			问题等级初始化
        			$(".problemLevel3").removeClass("problemLevel3");
        			$(".levelSelect").removeClass("levelSelect");
        			if(this.draftMessage.Question_Level=="A"||this.draftMessage.Question_Level=="a"){
        				$($(".levelClass").children("li")[0]).addClass("problemLevel1");
        				$($(".levelClass").children("li")[0]).addClass("levelSelect");
        			}else if(this.draftMessage.Question_Level=="B"||this.draftMessage.Question_Level=="b"){
        				$($(".levelClass").children("li")[1]).addClass("problemLevel2");
        				$($(".levelClass").children("li")[1]).addClass("levelSelect");
        			}else if(this.draftMessage.Question_Level=="C"||this.draftMessage.Question_Level=="c"){
        				$($(".levelClass").children("li")[2]).addClass("problemLevel3");
        				$($(".levelClass").children("li")[2]).addClass("levelSelect");
        			}else{
        				util.notification.simple("问题等级参数有误,请检查数据或者联系管理员！");
        				$($(".levelClass").children("li")[2]).addClass("problemLevel3");
        				$($(".levelClass").children("li")[2]).addClass("levelSelect");
        			}
//          		图片先不绑定
        			/*if(response.data.Content[0].Attachments){
        				for(var i=0)
        			}*/
        			$(".submit-cover").hide();
        		}else{
        			$(".submit-cover").hide();
       				util.notification.simple("初始接口异常");
        		}
        	},function(response){
        		$(".submit-cover").hide();
       			util.tokenFailure(response,util);
        	});
        },
//      提交需要整改的文本内容
		submitText:function(checkID,listID,projectId,closeTime,problemLevel,problemType,problemDes,Files,note,status){
			var params={
				"Pm_Quality_Check.Project_Id":projectId,
				"Pm_Quality_Check.Request_Close_Time":closeTime,
				"Pm_Quality_Check.Check_Id":checkID,
				"Pm_Quality_Check_List.Memo":note,
				"Pm_Quality_Check_List.List_Id":listID,
				"Pm_Quality_Check_List.Question_Level":problemLevel,
				"Pm_Quality_Check_List.Question_Type":problemType,
				"Pm_Quality_Check_List.Question_Desc":problemDes,
				"Status":status,
				"Check_History_Id":this.draftMessage.Check_History_Id?this.draftMessage.Check_History_Id:0,
				"File.Attachments":Files
			};
			this.$http.post(util.baseUrl + 'PMQualityCheckApi/PostQuality',params,{emulateJSON:true}).then(function(response){
				console.info(response.data.Flag);
				if(response.data.Flag){
					if(status==0){
						$(".submit-cover").hide();
						util.notification.simple("保存成功");
						setTimeout(function(){
							if(util._param.status){
								history.back();
							}else{
								window.location="list.html?status=0&isall=0&pjId="+projectId;
							}
						},2000);
					}else{
						util.notification.simple(response.data.wfmsg);
						$(".submit-cover").hide();
                    	setTimeout(function(){
                    		if(util._param.status){
                    			history.back();
                    		}else{
                    			window.location="submitQ.html?projectId="+projectId;
                    		}
                    	},2000);
					}
					/*if(status==1||status=="1"){
						this.workflow(checkID,projectId);
					}else{
						$(".submit-cover").hide();
						util.notification.simple("保存成功");
						setTimeout(function(){
							if(util._param.status){
								history.back();
							}else{
								window.location="list.html?status=0&isall=0&pjId="+projectId;
							}
						},2000);
					}*/
					// this.unloadFile(listId,projectId,historyId,checkId,Files,status);
				}else{
					if(response.data.Manager==0){
						util.notification.simple("项目经理空缺中!");
					}
					else{
						util.notification.simple(response.data.wfmsg);
					}
					$(".submit-cover").hide();
				}
				$(".submit-cover").hide();
			},function(response){
				$(".submit-cover").hide();
				util.tokenFailure(response,util);
			});
		},
//		上传附件类
		/*unloadFile:function(listId,projectId,historyId,checkId,Files,status){
			this.$http.post('http://172.16.55.132:8089/api/FileUploadApi/UploadFile',{"BillID":listId,"TableName":"pm_quality_check_list","Expand":"0","Files":Files}).then(function(response){
				if(response.data.Flag){
					console.info("success");
					if(status==1||status=="1"){
						this.connectRes(checkId,projectId,historyId,0,listId,0);
					}
				}
			},function(response){
				
			})
		},*/
		unloadFile:function(listId,projectId,historyId,checkId,Files,status){
			this.$http.post(util.baseUrl + 'FileUploadApi/PostAttachments',{"BillID":listId,"Table_Name":"pm_quality_check_list","Expand":"0","Attachments":Files}).then(function(response){
				console.info(listId,projectId,historyId,checkId,Files,status);
				if(response.data.Flag){
					if(status==1||status=="1"){
						this.connectRes(checkId,projectId,historyId,0,listId,0);
					}else{
						$(".submit-cover").hide();
						util.notification.simple("保存成功");
						setTimeout(function(){
							if(util._param.status){
								history.back();
							}else{
								window.location="list.html?status=0&isall=0&pjId="+projectId;
							}
						},2000);
					}
				}else{
					$(".submit-cover").hide();
					util.notification.simple("接口异常类型2");
				}
			},function(response){
				$(".submit-cover").hide();
				util.tokenFailure(response,util);
				util.notification.simple("网络连接异常2");
			});
		},
//			关联关系
		connectRes:function(checkId,projectId,History_Id,Status,List_Id,Rectify_Id){
			this.$http.get(util.baseUrl + 'PMQualityCheckApi/PostAttachments',{params:{"History_Id":History_Id,"Status":"1","List_Id":List_Id,"Rectify_Id":Rectify_Id}}).then(function(response){
					console.info(response.data.Flag);
					if(response.data.Flag){
						this.workflow(checkId,projectId);
					}else{
						$(".submit-cover").hide();
						util.notification.simple("接口异常类型3");
					}
				},function(response){
					$(".submit-cover").hide();
					util.tokenFailure(response,util);
					util.notification.simple("网络连接异常3");
				});
			}
        },
//      删除图片
        deletePicture:function(listId,callback){
        	alert("5");
	       	this.$http.post(util.baseUrl + 'FileUploadApi/DeleteFile',{"List_Id":LlistId,"Rectify_Id":"0"}).then(function(response){
	       		alert("3");
	       		if(response.data.Flag){
	       			alert("4");
	       			callback();
	       		}
	       	},function(response){
	       		util.tokenFailure(response,util);
	       	});
        }
});

function getClientImgUrls(params){
//	alert(JSON.stringify(params));
	if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
		para=params;
	}else{
		para=JSON.parse(params);
	}
	
	if(para.Flag){
		var content=para.Content;
		var imgs=[],Imgs=[];
		for(var i=0;i < content.length;i++){
//          初步处理
			Imgs.push({"Doc_Name":content[i].Doc_Name,"Doc_Path":content[i].Doc_Path,"Doc_Size":content[i].Doc_Size});
//			二次处理
			var newimgsrc=content[i].Doc_Path.replace(/\\/g,"/");
			imgs.push({"Doc_Path":"http://222.92.194.195:9087/DownLoad/"+newimgsrc});
		}
		QMApp.ImgUrls=QMApp.ImgUrls.concat(Imgs);
		QMApp.Imgs=QMApp.Imgs.concat(imgs);
	}
}
