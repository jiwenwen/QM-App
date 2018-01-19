var QMApp = new Vue({
    el: "#QMApp",
    data: {
    	ImgUrls:[],
    	Imgs:[],
    	displacement:'',
		viewdata:[],
        rectificationOnce1:{
            Attachments:[{
                filePath:''
            }]
        },
        rectificationOnce2:{
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
        isUnit:'',
        unitName:''
    },
    mounted: function(){
        this.init();
    },
    methods: {
        init: function(){
			this.things();
			this.initInfo();
			this.initUnloadFile();
            /*只有在待整改的问题才有整改反馈表单*/
            if (util._param.status==1){
                $($(".detail-content").find(".detail-item")[3]).show();
				$(".header-right").show();
            }
            else{
                $($(".detail-content").find(".detail-item")[3]).hide();
				$(".header-right").hide();
            }
        },
        initUnloadFile:function(){
			var uploader = WebUploader.create({
			    // 选完文件后，是否自动上传。
			    auto: true,
			    // swf文件路径
			    swf: './../../lib/webuploader/Uploader.swf',
			    // 文件接收服务端。
			    server: util.baseUrl + 'FileUploadApi/UploadOnlyFile',
			    // 选择文件的按钮。可选。
			    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
			    pick: {
			    	id: '#filePicker',
			    	multiple: false
			    },
			    duplicate: true,
			    // 只允许选择图片文件。
			    accept: {
			        title: 'Images',
			        extensions: 'gif,jpg,jpeg,bmp,png',
			        mimeTypes: 'image/*',
			    }
			});
			uploader.on( 'uploadProgress', function( file, percentage ) {
			    $(".submit-cover").show();
			});
			// 文件上传成功，给item添加成功class, 用样式标记上传成功。
			uploader.on('uploadSuccess', function(file,response) {
				if(response.Flag){
					if(response.Content && response.Content.length > 0){
						QMApp.Imgs.push(response.Content[0]);
						QMApp.ImgUrls.push({"Doc_Name":response.Content[0].Doc_Name,"Doc_Path":response.Content[0].Doc_Path,"Doc_Size":response.Content[0].Doc_Size});
						if(QMApp.Imgs.length>=6){
							$('#filePicker').hide();
						}
					}
				}else{
					util.notification.simple("上传失败");
				}
				$(".submit-cover").hide();
			});
			// 文件上传失败，显示上传出错。
			uploader.on( 'uploadError', function( file ) {
				$(".submit-cover").hide();
			    util.notification.simple("上传失败");
			});
		},
		/*初始化数据*/
		initInfo:function(){
			var params={
				"List_Id":util._param.listId
			};
			this.$http.get(util.baseUrl + "PMQualityCheckApi/GetCheckAndRectifyDetails",{params:params}).then(function(response){
				var result=response.data;
				$(".loading").hide();
				if(result.Flag){
					if(result.Rectify_Status!=1){
						$("body").html("已提交，请关闭页面!");
						$("body").css({
							"font-size":"24px",
							"text-align":"center",
							"line-height":"350px",
							"color":"black"
						});
						return false;
					}
					this.authority=result.Has_Authority;
					this.isUnit=result.Is_Unit;
					this.unitName=result.Unit_Name;
					if (util._param.status==2&&this.authority==1){
						$(".bottom").show();
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
							$($(".detail-content").find(".detail-item")[2]).show();
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
					util.notification.simple("接口异常");
				}
			}, function(response){
				errorFun(response,util);
			});
		},
        /*提交按钮*/
        submitFeedback:function(){
			//indow.location.href="list.html?status="+util._param.status+"&id="+util._param.id;
			var listId=util._param.listId;
			var isornot=$(".yesornot").attr("value");/*是否*/
			var desc=$(".solution textarea").val();/*解决措施*/
			var Files=QMApp.ImgUrls;/*图片*/
			if ($(".yesornot").val()==1&&!desc){
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
			else if(desc){
				this.feedBack(listId,isornot,desc,Files);
				$(".submit-cover").show();
			}
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
        feedBack:function(listId,isornot,desc,Files){
        	var checkId = util._param.checkId;
        	this.$http.post(util.baseUrl + 'PMQualityCheckApi/PostRectifyQuality',{"List_Id":listId,"Is_Rectified":isornot,
        		"Result_Desc":desc,"Check_Id":checkId,"Attachments":Files}).then(function(response){
				//console.info(response.data);
        		if(response.data.Flag){
        			util.notification.simple("提交成功!");
        			setTimeout(function(){
        				$("body").html("已提交，请关闭页面!");
						$("body").css({
							"font-size":"24px",
							"text-align":"center",
							"line-height":"350px",
							"color":"black"
						});
        			},2000);
        			setTimeout(function(){
        				$(".submit-cover").hide();
        			},300);
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
        imgChange:function(event){
			for (var i=0;i<$(event.currentTarget).parent().find("img").length;i++){
				var $imgurl=$($(event.currentTarget).parent().find("img")[i]).attr("src");
				this.viewdata.push({"path":$imgurl});
			}
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
						var touches = e.touches[0];
						start = {
							x: touches.pageX, // 横坐标
							y: touches.pageY  // 纵坐标
						};
					});
					$(".touch")[i].addEventListener("touchmove",function(e){
						// 计算划动过程中x和y的变化量
						var touches = e.touches[0];
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
			this.viewdata=[];
			$(".view").hide();
		},
		deleteImg:function(event){
			var index = $(event.currentTarget).parent().index();
			QMApp.Imgs.splice(index,1);
			QMApp.ImgUrls.splice(index,1);
			$('#filePicker').show();
		},
        things:function(){
			//删除图片
        	/*$(".changePhotos").on("click","i",function(){
        		var index = $(this).parent().index();
				QMApp.Imgs.splice(index,1);
				QMApp.ImgUrls.splice(index,1);
				$('#filePicker').show();
				return false;
        	});*/
			//是否整改
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
        }
	}
});
