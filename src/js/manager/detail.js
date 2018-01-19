/**
 * Created by 00022879 on 2017/6/21.
 */
/*define(function(require, exports, module){
    var util = require("util");
    require("vue_res");
    require("vue");
    require("jquery");
    require("nicescroll");
*/
    var QMApp = new Vue({
        el: "#QMApp",
        data: {
        	checkCode:'',
        	ImgUrls:[],
        	/*ImgUrls:[
	        	{"Doc_Name":"image00.jpg","Doc_Path":"2017\\\\12\\\\9\\\\image003444.jpg","Doc_Size":30201}
	    	],*/
        	Imgs:[],
        	/*Imgs:[
	        	{"Doc_Path":"http://222.92.194.195:9087/DownLoad/2017/12/9/image003444.jpg"}
	    	],*/
        	viewImg:[],
        	imgBase64:[],
        	displacement:'',
			contractMsg:"",
			teamMsg:"",
			viewdata:[],
            rectificationOnce1:
            {
                Attachments:[{
                    filePath:''
                }]
            },
            rectificationOnce2:
            {
                Attachments:[{
                    filePath:''
                }]
            },
            rectificationRepeated:[
                {
                    Attachments:[{
                        filePath:''
                    }]
                }
            ],
            reviewLast: {
                Attachments:[{
                    filePath:''
                }]
            },
			role:'',
			qualityRole:'',
			origin:null

        },
        created: function(){

        },
        mounted: function(){
            this.init();
        },
        beforeMount:function(){
        	inuse=true;
        },
        watch: {

        },
        methods: {
            init: function(){
				this.role=localStorage.getItem("role");
				this.qualityRole=util._param.qualityRole;//获取角色：质量员1，施工员2
				this.origin=util._param.origin;
            	if(util._param.origin){
            		localStorage.setItem("role",2);
            		this.role = 2;
	                if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
	                    // Object.getToken();
	                    localStorage.setItem("token", util._param.token);
                        setVueHttp(util._param.token);
                        this.initInfo();
	                }else{
	                    gm_getToken(window.GMQuality.getToken());
	                    /*初始化数据*/
						this.initInfo();
	                }
	            }
				else{
					/*初始化数据*/
					this.initInfo();
				}
				var $this = this;
				setTimeout(function() {
					$this.things();
				},300);
	        	// this.things();
            },
			imgChange:function(event){
				this.viewdata=[];
				for (var i=0;i<$(event.currentTarget).parent().find("img").length;i++){
					var $imgurl=$($(event.currentTarget).parent().find("img")[i]).attr("src");
					this.viewdata.push({"path":$imgurl});
				}
				console.info(this.viewdata);
				var basewidth = parseInt($(".view").width());
				var index = $(event.currentTarget).index();
				var displacement = (-1*index*100);
				QMApp.displacement = displacement;
				$(".view").show(100);
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
								console.info(index);
							} else if (diffX > 45&&index>0) {
								QMApp.displacement=QMApp.displacement+100;
								index=index-1;
							}
						});
					}
				},100);
				return false;
			},
			hideImg:function(){
				$(".view").hide();
			},
			workflow:function(checkId,projectId){
				/*初始化工作流*/
                var params2={
                    Check_Id:checkId,
                    Project_Id:projectId
                };
                QMApp.$http.get(util.baseUrl + "PMQualityCheckApi/InitWorkFlow",{params:params2}).then(function(response){
                    var result1=response.data.WorkFlow;
//                  console.info(response.data.WorkFlow);
					if(response.data.Flag){
					    /*提交表单到工作流*/
					    var params3={
					        Comand:2,
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
                            var result3=response.data;
                            console.info(response.data);
                            $(".submit-cover").hide();
                            util.notification.simple(response.data.message);
                            setTimeout(function(){
                            	history.back();
                        		// window.location="list.html?status="+util._param.status+"&id="+util._param.id;
                        	},2000);
                        }, function(response){
                        	$(".submit-cover").hide();
                            errorFun(response,util);
                        });
                    }else{
                    	$(".submit-cover").hide();
                        util.notification.simple(result.Msg);
                    }
                }, function(response){
                	$(".submit-cover").hide();
                    errorFun(response,util);
                });
			},
            things:function(){
            	//上传图片
	        	$(".changePhotos").on("click",".choose-photo",function(){
	        		var num = $(".uploadPhotos img").length;
//      			调用移动端方法
					if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
						openGallery(num+3);
					}else{
						window.GMQuality.openGallery(num+3);
					}
	        	});
            	$(".detail").on("click",".seephoto li",function(){
            		QMApp.viewdata=[];
					for (var i=0;i<$(this).parent().find("img").length;i++){
						var $imgurl=$($(this).parent().find("img")[i]).attr("src");
						QMApp.viewdata.push({"path":$imgurl});
					}
					console.info(QMApp.viewdata);
					var basewidth = parseInt($(".view").width());
					var index = $(this).index();
					var displacement = (-1*index*100);
					QMApp.displacement = displacement;
					$(".view").show(100);
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
									console.info(index);
								} else if (diffX > 45&&index>0) {
									QMApp.displacement=QMApp.displacement+100;
									index=index-1;
								}
							});
						}
					},50);
            	});
//      		删除图片
	        	$(".changePhotos").on("click","i",function(){
	        		var route = $(this).next().attr("src");
	        		var index;
					for(var i= 0;i<QMApp.Imgs.length;i++){
	    				if(route==QMApp.Imgs[i].Doc_Path){
	    					index = i;
	    				}
	    			}
					console.info(index);
					QMApp.Imgs.splice(index,1);
					QMApp.ImgUrls.splice(index,1);
					return false;
	        	});
//          	进入选择合同弹窗
            	$(".contractName").on("click","input",function(){
            		QMApp.getcontractMsg(0,"",function(result){
            			if(result=="-1"||result==-1){
            				$(".contractWindow .pbuttom").attr("cango","false");
            			}else{
            				$(".contractWindow .pbuttom").attr("cango","true");
            			}
            		});
            		$(".submit-cover").show();
            		$(".contractWindow").show(function(){
            			$(".contractWindow").addClass("publicwindowShow");
            			setTimeout(function(){
            				$(".contractWindow .pheader").show();
            			},250);
            		});
            	});
//          	进入选择班组弹窗
				$(".teamName").on("click","input",function(){
            		QMApp.getteamMsg(0,"",function(result){
            			if(result=="-1"||result==-1){
            				$(".teamWindow .pbuttom").attr("cango","false");
            			}else{
            				$(".teamWindow .pbuttom").attr("cango","true");
            			}
            		});
            		$(".submit-cover").show();
            		$(".teamWindow").show(function(){
            			$(".teamWindow").addClass("publicwindowShow");
            			setTimeout(function(){
            				$(".teamWindow .pheader").show();
            			},250);
            		});
            	});
//				选择取消
				$(".publicwindow").on("click",".pcancel",function(){
					QMApp.contractMsg="";
					QMApp.teamMsg="";
					$(".publicwindowShow .pbuttom").attr("index","0");
					$(".publicwindowShow .pbuttom").attr("cango","true");
					$(".publicwindowShow .psearchinput").val("");
					setTimeout(function(){
        				$(".publicwindowShow .pheader").hide();
        				$(".publicwindowShow").hide();
        				$(".publicwindowShow").removeClass("publicwindowShow");
        			},180);
            	});
//				选择
				$(".publicwindow").on("click","li",function(){
					if($(".publicwindowShow").hasClass("teamWindow")){
						$(".teamName input").val($(this).children("span").text());
						$(".teamName input").attr("teamId",$(this).children("span").attr("value"));
					}else{
						$(".contractName input").val($(this).children("span").text());
						$(".contractName input").attr("contractId",$(this).children("span").attr("value"));
					}
					$(".publicwindow .pcancel").trigger("click");
				});
//				搜索功能
//				触发条件1
				$(".publicwindow").on("click",".psearchbtn",function(){
					var value = $(".publicwindowShow input").val();
					$(".publicwindowShow .pbuttom").attr("index","0");
					if($(".publicwindowShow").hasClass("teamWindow")){
						QMApp.getteamMsg("0",value,function(result){
							if(result=="-1"||result==-1){
								$(".teamWindow .pbuttom").attr("cango","false");
							}else{
								$(".teamWindow .pbuttom").attr("cango","true");
							}
						});
					}else{
						QMApp.getcontractMsg("0",value,function(result){
							if(result=="-1"||result==-1){
								$(".contractWindow .pbuttom").attr("cango","false");
							}else{
								$(".contractWindow .pbuttom").attr("cango","true");
							}
						});
					}
					$(".submit-cover").show();
				});
//				触发条件2
				$(".publicwindow").on("keydown","input",function(event){
					if (event.keyCode == 13){
						var value = $(".publicwindowShow input").val();
						$(".publicwindowShow .pbuttom").attr("index","0");
	        			if($(".publicwindowShow").hasClass("teamWindow")){
							QMApp.getteamMsg("0",value,function(result){
								if(result=="-1"||result==-1){
									$(".teamWindow .pbuttom").attr("cango","false");
								}else{
									$(".teamWindow .pbuttom").attr("cango","true");
								}
							});
						}else{
							QMApp.getcontractMsg("0",value,function(result){
								if(result=="-1"||result==-1){
									$(".contractWindow .pbuttom").attr("cango","false");
								}else{
									$(".contractWindow .pbuttom").attr("cango","true");
								}
							});
						}
	        			$(".submit-cover").show();
					}
				});
//				清空搜索条件
				$(".publicwindow").on("click",".psearchclear",function(){
					$(".publicwindowShow input").val("");
					$(".publicwindowShow .pbuttom").attr("index","0");
					if($(".publicwindowShow").hasClass("teamWindow")){
						QMApp.getteamMsg("0","",function(result){
							if(result=="-1"){
								$(".teamWindow .pbuttom").attr("cango","false");
							}else{
								$(".teamWindow .pbuttom").attr("cango","true");
							}
						});
					}else{
						QMApp.getcontractMsg("0","",function(result){
							if(result=="-1"){
								$(".contractWindow .pbuttom").attr("cango","false");
							}else{
								$(".contractWindow .pbuttom").attr("cango","true");
							}
						});
					}
					$(".submit-cover").show();
				});
//				上一页下一页
				$(".publicwindow").on("click",".pbuttom span",function(){
					var value=$(".publicwindowShow .psearchinput").val();
					var currentIndex = parseInt($(this).parent().attr("index"));
					var num = parseInt($(this).attr("value"));
					var cango = $(this).parent().attr("cango");
					var index;
					if(num<0){
						$(".publicwindowShow .pleft").css("background-position-y","-6.4rem");
						$(".publicwindowShow .pright").css("background-position-y","-6.3rem");
					}else{
						$(".publicwindowShow .pright").css("background-position-y","-1.2rem");
						$(".publicwindowShow .pleft").css("background-position-y","-1.2rem");
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
					if(inuse&&index>=0){
						inuse=false;
//						alert(index);
						if($(".publicwindowShow").hasClass("teamWindow")){
							QMApp.getteamMsg(index,value,function(result){
								if(result=="-1"||result==-1){
									util.notification.simple("已经到最后一页");
		            				$(".teamWindow .pbuttom").attr("cango","false");
		            			}else{
		            				$(".teamWindow .pbuttom").attr("cango","true");
		            			}
								$(".teamWindow .pbuttom").attr("index",index);
								$(".teamWindow .pcontent").scrollTop(0);
							});
							$(".submit-cover").show();
						}else{
							QMApp.getcontractMsg(index,value,function(result){
								if(result=="-1"||result==-1){
									util.notification.sinmple("已经到最后一页");
		            				$(".contractWindow .pbuttom").attr("cango","false");
		            			}else{
		            				$(".contractWindow .pbuttom").attr("cango","true");
		            			}
								$(".contractWindow .pbuttom").attr("index",index);
								$(".contractWindow .pcontent").scrollTop(0);
							});
							$(".submit-cover").show();
						}
					}
				});
//				是否整改
				$(".whetherChange").on("click","li",function(){
					var value = $(this).attr("value");
					if($(this).hasClass("yesornot")){

					}else{
						$(".yesornot").removeClass("yesornot");
						$(this).addClass("yesornot");
						if(value=="1"){
							$(".changePhotos").show();
							$(".solution").find("span").html("解决措施");
						}else{
							$(".changePhotos").hide();
							$(".solution").find("span").html("未解决原因");
						}
					}
				});
//				图片预览
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
			/*初始化数据*/
			initInfo:function(){
				var params={
					"List_Id":util._param.listId
				};
				this.$http.get(util.baseUrl + "PMQualityCheckApi/GetCheckAndRectifyDetails",{params:params}).then(function(response){
					var result=response.data;
					this.checkCode = result.CheckCode;
					$(".loading").hide();
					if(result.Flag){
						this.authority=result.Has_Authority;
						if (util._param.status==1&&this.role!=3){
							$(".submit-btn").show();
							$($(".detail-content").find(".detail-item")[3]).show();
							/* $(".detail").css("position","absolute");*/
							$(".detail").css("bottom","4.17rem");
						}
						for (var i=0;i<result.Content.length;i++){
							result.Content[i].Create_Date=result.Content[i].Create_Date.substr(5,5);
						}
						/*一个来回*/
						if(result.Content.length<=2){
							$($(".detail-content").find(".detail-item")[0]).show();
							$($(".detail-content").find(".detail-item")[1]).hide();
							$($(".detail-content").find(".detail-item")[2]).hide();
							$(".expand-detail").hide();
							$(".expand-button").hide();
							this.rectificationOnce1=result.Content[0];
							if(result.Content[1]){
								$($(".detail-content").find(".detail-item")[1]).show();
								this.rectificationOnce2=result.Content[1];
							}
						}
						/*多个来回*/
						else if(result.Content.length>2){
							$($(".detail-content").find(".detail-item")[0]).hide();
							$($(".detail-content").find(".detail-item")[1]).hide();
							$($(".detail-content").find(".detail-item")[2]).show();
							$(".expand-button").show();
							this.rectificationRepeated =result.Content;
							for (var i=result.Content.length-1;i>0;i--){
								if(result.Content[i].Flag==2||result.Content[i].Flag==3){
									this.reviewLast=result.Content[i];
									break;
								}
							}
						}
					}else{
						util.notification.simple(result.Msg);
					}
				}, function(response){
					errorFun(response,util);
				});

			},
            /*返回*/
            returnPreview:function(){
				var $status = util._param.status ? util._param.status:1;
				if (util._param.search){
					window.location.href="list.html?search="+util._param.search+"&status="+$status+"&id="+util._param.id;
				}
				else
				{
					window.location.href="list.html?status="+$status+"&id="+util._param.id;
				}
            },
            /*提交按钮*/
            submitFeedback:function(){
//              window.location.href="list.html?status="+util._param.status+"&id="+util._param.id;
				var listId=util._param.listId;
				var contractId;/*合同名称*/
				if($(".contractName input").val()==""){
					contractId = "0";
				}else{
					contractId=$(".contractName input").attr("contractId");
				}
				var teamId=$(".teamName input").attr("teamId");/*班组*/
				var isornot=$(".yesornot").attr("value");/*是否*/
				var desc=$(".solution textarea").val();/*解决措施*/
				var Files=QMApp.ImgUrls;/*图片*/
//				debugger;
				if (!teamId){
					util.notification.simple("班组未选择！");
					return false;
				}
				else if ($(".yesornot").val()==1&&!desc){
					util.notification.simple("措施未填写！");
					return false;
				}
				else if($(".yesornot").attr("value")==1&&$(".changePhotos").find("img").length==0){
					util.notification.simple("整改图片未上传！");
					return false;
				}
				else if ($(".yesornot").val()==0&&!desc){
					util.notification.simple("原因未填写！");
					return false;
				}
				/*else if (Files.length==0){
					util.notification.simple("整改图片未上传！");
					return false;
				}*/
				else if(teamId&&desc){
					this.feedBack(listId,contractId,teamId,isornot,desc,Files);
					$(".submit-cover").show();
				}
			},
            /*获取合同*/
            getcontractMsg:function(index,condition,callback){
            	var projectId = util._param.pjId;
            	var params;
            	if(condition==""){
            		params={
            			"projectId":projectId,
            			"PageIndex":index,
            			"PageSize":"30"
        			};
            	}else{
            		params={
            			"projectId":projectId,
            			"PageIndex":index,
            			"PageSize":"30",
            			"searchcriteria":condition
        			};
            	}
            	util.timeOut();
            	this.$http.get(util.baseUrl + 'PMQualityCheckApi/GetContractList',{params:params}).then(function(response){
            		if(response.data.Flag){
            			$(".submit-cover").hide();
            			this.contractMsg=response.data.Content;
            			util.timeOut(1);
            			inuse=true;
            			if(response.data.Content.length==0&&index==0){
	       					util.notification.simple("查询结果为空");
	       				}
            			if(response.data.Content.length<30){
	       					callback(-1);
	       				}else{
	       					callback(1);
	       				}
            		}else{
            			util.timeOut(1);
            			$(".submit-cover").hide();
            			inuse=true;
            		}
            	},function(response){
            		inuse=true;
            		$(".submit-cover").hide();
            		errorFun(response,util);
            	});
            },
            /*获取班组*/
            getteamMsg:function(index,condition,callback){
            	var contractId = $(".contractName input").attr("contractId");
            	if(contractId==""){
            		contractId = 0;
            	}
            	var projectId = 0;
            	var params;
            	if(condition==""){
            		params={
            			"contractId":contractId,
            			"projectId":projectId,
            			"PageIndex":index,
            			"PageSize":"30"
        			};
            	}else{
            		params={
            			"contractId":contractId,
            			"projectId":projectId,
            			"PageIndex":index,
            			"PageSize":"30",
            			"searchcriteria":condition
        			};
            	}
            	util.timeOut();
            	this.$http.get(util.baseUrl + 'PMQualityCheckApi/GetWorkGroupList',{params:params}).then(function(response){
            		if(response.data.Flag){
            			this.teamMsg=response.data.Content;
            			util.timeOut(1);
            			$(".submit-cover").hide();
            			inuse=true;
            			if(response.data.Content.length==0&&index==0){
	       					util.notification.simple("查询结果为空");
	       				}
            			if(response.data.Content.length<30){
	       					callback(-1);
	       				}else{
	       					callback(1);
	       				}
            		}else{
            			inuse=true;
            			util.timeOut(1);
            			$(".submit-cover").hide();
            		}
            	},function(response){
            		inuse=true;
            		$(".submit-cover").hide();
            		errorFun(response,util);
            	});
            },
			/*收起展开审核记录*/
            retract:function(event){
                if ($(event.currentTarget).attr("typeid")==0){
                    $(".expand-detail").show();
                    $(event.currentTarget).attr("typeid","1");
                    $(event.currentTarget).find("span").html("收起审核记录");
					$(event.currentTarget).css("border-top","none");
                    $(event.currentTarget).find("img").attr("src","../../images/staff/detail/retract.png");
                }
                else{
                    $(".expand-detail").hide();
                    $(event.currentTarget).attr("typeid","0");
                    $(event.currentTarget).find("span").html("展开审核记录");
					$(event.currentTarget).css("border-top","1px solid rgba(209,192,138,0.25)");
                    $(event.currentTarget).find("img").attr("src","../../images/staff/detail/expand.png");
                }

            },
            feedBack:function(listId,contractId,teamId,isornot,desc,Files){
            	var checkId = util._param.checkId;
            	var projectId = util._param.pjId;
            	var params = {
            		"List_Id":listId,
            		"Contract_Id":contractId,
            		"Contact_Unit_Id":teamId,
            		"Is_Rectified":isornot,
            		"Result_Desc":desc,
            		"Check_Id":checkId,
            		"Attachments":Files
            	};
            	this.$http.post(util.baseUrl + 'PMQualityCheckApi/PostRectifyQuality', params).then(function(response){
//          		console.info(response.data);
            		if(response.data.Flag){
            			var rectifyId = response.data.Rectify_Id;
            			if(rectifyId==0){
            				util.notification.simple("反馈出现异常，请联系管理员处理");
            				return false;
            			}
            			$(".submit-cover").hide();
                        util.notification.simple(response.data.wfmsg);
                        setTimeout(function(){
                        	history.back();
                    	},2000);
            			// this.workflow(checkId,projectId);
            			/*var status = "1";
            			if(isornot=="1"){
            				this.unloadFile(listId,Files,historyId,status,rectifyId);
            			}else{
            				this.connectRes(historyId,status,listId,rectifyId);
            			}*/

            		}else{
            			if(response.data.Manager==0){
							util.notification.simple("您不是指定处理人,仅能查看");
						}
						else{
							util.notification.simple(response.data.wfmsg);
						}
						$(".submit-cover").hide();
	            	}
            	},function(response){
            		$(".submit-cover").hide();
            		errorFun(response,util);
            	});
            },
			unloadFile:function(listId,Files,historyId,status,rectifyId){
				this.$http.post(util.baseUrl + 'FileUploadApi/PostAttachments',{"BillID":rectifyId,"Table_Name":"pm_quality_rectify","Expand":"0","Attachments":Files}).then(function(response){
					console.info("附件上传"+response.data.Flag);
					if(response.data.Flag){
						console.info("success");
						if(status==1||status=="1"){
							this.connectRes(historyId,status,listId,rectifyId);
						}
					}
					else{
						$(".submit-cover").hide();
					}
				},function(response){
					$(".submit-cover").hide();
					errorFun(response,util);
				});
			},
			/*关联关系*/
			connectRes:function(historyId,status,listId,rectifyId){
				this.$http.get(util.baseUrl + 'PMQualityCheckApi/PostAttachments',{params:{"History_Id":historyId,"Status":"1","List_Id":listId,"Rectify_Id":rectifyId}}).then(function(response){
					if(response.data.Flag){
						var projectId = util._param.pjId;
						var checkId = util._param.checkId;
						this.workflow(checkId,projectId);
					}else{
						$(".submit-cover").hide();
					}
				},function(response){
					$(".submit-cover").hide();
					errorFun(response,util);
				});
			}
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
