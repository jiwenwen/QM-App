$(function(){
	var QMApp = new Vue({
        el: "#QMApp",
        data: {
        	datas:"",
        	search:[{"problemTypeName":"所有","problemTypeCode":"0"},{"problemLevelName":"等级"}],
        	problemType:'',
        	companyId:''
        },
        created: function(){

        },
        mounted: function(){
            this.init();
        },
        beforeMount:function(){
        	conver = {"等级":null,"等级A":"A","等级B":"B","等级C":"C"};
        	// z_level="1";
        },
        watch: {

        },
        methods: {
            init: function(){
            	if(util._param.companyId){
            		// $(".pagetitle").text("管理分区分布");
            		companyId = util._param.companyId;
            		setTimeout(function(){
						QMApp.search = JSON.parse(localStorage.getItem("search"));
						console.info(QMApp.search);
						QMApp.getDatalevel3(companyId,conver[QMApp.search[1].problemLevelName],QMApp.search[0].problemTypeCode);
					},100);
            		// z_level = "2";
            	}else{
            		setTimeout(function(){
						QMApp.search = JSON.parse(localStorage.getItem("search"));
						console.info(QMApp.search);
						QMApp.getDatalevel2(conver[QMApp.search[1].problemLevelName],QMApp.search[0].problemTypeCode);
					},100);
            	}
            	this.getproblemType();
            	this.things();
			},
            solve:function(){
            	var wdata=[],
					wdata1=[],
					wdata2=[],
					wdata3=[];
            	if(this.datas){
            		for(var i=0;i<this.datas.length;i++){
            			wdata[this.datas.length-1-i]=this.datas[i].CompanyName+"      ";
            			var a = this.datas[i].UnChecked,
            				b = this.datas[i].Checked;
        				if(a!=0){
        					wdata1[this.datas.length-1-i]={companyId:this.datas[i].CompanyID,value:a};
        				}else{
        					wdata1[this.datas.length-1-i]={companyId:this.datas[i].CompanyID,value:''};
        				}
            			if(b!=0){
            				wdata2[this.datas.length-1-i]={companyId:this.datas[i].CompanyID,value:b};
            			}else{
            				wdata2[this.datas.length-1-i]={companyId:this.datas[i].CompanyID,value:''};
            			}
            			wdata3[this.datas.length-1-i]={companyId:this.datas[i].CompanyID,value:"      "+(this.datas[i].Checked+this.datas[i].UnChecked)};
            		}
            	}
            	this.echarts(wdata,wdata1,wdata2,wdata3);
            },
            things:function(){
//          	问题等级修改
            	$(".searchBox").on("click",".problemLevel",function(){
            		var state = $(this).children(".levelList").css("display");
            		if(state == "block"){
            			$(".searchBox .levelList").hide();
            			$(".black").hide();
            		}else{
            			$(".searchBox .problemTypeList").hide();
            			$(".searchBox .levelList").show();
            			$(".black").show();
            		}
            	});
            	$(".searchBox").on("click",".levelList>li",function(){
            		if($(this).text()=="所有"){
            			if(!util._param.companyId){
            				QMApp.getDatalevel2(conver["等级"],QMApp.search[0].problemTypeCode);
            			}else{
            				QMApp.getDatalevel3(companyId,conver["等级"],QMApp.search[0].problemTypeCode);
            			}
            			QMApp.search[1].problemLevelName="等级";
            		}else{
            			var level = $(this).text().split("",1);
	            		if(!util._param.companyId){
	        				QMApp.getDatalevel2(level,QMApp.search[0].problemTypeCode);
	        			}else{
	        				QMApp.getDatalevel3(companyId,level,QMApp.search[0].problemTypeCode);
	        			}
	        			QMApp.search[1].problemLevelName="等级"+level;
            		}
            		$(".searchBox .levelList").hide();
            		$(".black").hide();
            		return false;
            	});
//          	问题类别修改
            	$(".searchBox").on("click",".problemType",function(){
            		var state = $(this).children(".problemTypeList").css("display");
            		if(state == "block"){
            			$(".searchBox .problemTypeList").hide();
            			$(".black").hide();
            		}else{
            			$(".searchBox .levelList").hide();
            			$(".searchBox .problemTypeList").show();
            			$(".black").show();
            		}
            	});
            	$(".searchBox").on("click",".problemTypeList>li",function(){
					var code = $(this).attr("problemTypeCode");
					if(!util._param.companyId){
        				QMApp.getDatalevel2(conver[QMApp.search[1].problemLevelName],code);
        			}else{
        				QMApp.getDatalevel3(companyId,conver[QMApp.search[1].problemLevelName],code);
        			}
					QMApp.search[0].problemTypeCode=code;
            		QMApp.search[0].problemTypeName=$(this).text();
            		$(".searchBox .problemTypeList").hide();
            		$(".black").hide();
            		return false;
            	});
            	$(".black").on("click",function(){
            		$(".searchBox .levelList").hide();
            		$(".searchBox .problemTypeList").hide();
            		$(".black").hide();
            	});
            },
            getDatalevel2:function(level,type){
            	var params;
            	if(level){
            		params = {"Question_Level":level,"Question_Type":type};
            	}else{
            		params = {"Question_Type":type};
            	}
            	console.info(level);
            	this.$http.get(util.baseUrl + 'PMQualityCheckApi/GetCompanyQualityReport',{params:params}).then(function(response){
            		if(response.data.Flag){
            			this.datas=response.data.Content;
            			var echartDom = document.getElementById('detailData');
            			$("#detailData").css("height",(5+response.data.Content.length*7) + "rem");
            			echartDom.removeAttribute("_echarts_instance_");
        				this.solve();
            		}
            	},function(response){
            		errorFun(response,util);
            	});
            },
            getDatalevel3:function(companyId,level,type){
            	var params;
            	if(level){
            		params = {"CompanyID":companyId,"Question_Level":level,"Question_Type":type};
            	}else{
            		params = {"CompanyID":companyId,"Question_Type":type};
            	}
            	this.$http.get(util.baseUrl + 'PMQualityCheckApi/GetCompanyManagerQualityReport',{params:params}).then(function(response){
            		if(response.data.Flag){
            			this.datas=response.data.Content;
            			var echartDom = document.getElementById('detailData');
            			$("#detailData").css("height",(5+response.data.Content.length*7) + "rem");
            			echartDom.removeAttribute("_echarts_instance_");
        				this.solve();
            		}
            	},function(response){
            		errorFun(response,util);
            	});
            },
            getproblemType:function(){
            	$(".submit-cover").show();
	        	util.timeOut();
	       		this.$http.get(util.baseUrl + 'PMQualityCheckApi/GetQualityTypeList').then(function(response){
	       			if(response.data.Flag){
	       				util.timeOut(1);
	       				$(".submit-cover").hide();
	       				this.problemType=response.data.Content;
	       			}else{
	       				util.timeOut(1);
	       				$(".submit-cover").hide();
	       				util.notification.simple("接口异常");
	       			}
	       		},function(response){
	       			$(".submit-cover").hide();
	       			errorFun(response,util);
	       		});
	        },
            echarts:function(data,data1,data2,data3){
            	var myChart = echarts.init(document.getElementById('detailData'));
//          	点击事件
				myChart.on('click',function(params){
					if(params.componentSubType === 'bar'&&!util._param.companyId){
//					 	console.info(params);
						// $(".pagetitle").text("管理分区分布");
                        localStorage.setItem("search",JSON.stringify(QMApp.search));
					 	companyId = params.data.companyId;
                        window.location.href = "reportDetail2.html?companyId="+companyId;
					 	// QMApp.getDatalevel3(companyId,conver[QMApp.search[1].problemLevelName],QMApp.search[0].problemTypeCode);
					}else{
//						console.info(params);
                        localStorage.setItem("search",JSON.stringify(QMApp.search));
						var departmentId = params.data.companyId;
						window.location="projectList.html?departmentId="+departmentId+"&companyId="+companyId;
						localStorage.setItem("search",JSON.stringify(QMApp.search));
					}
				});
// 				指定图表的配置项和数据
				var option = {
				    tooltip: {},
				    yAxis: [
				    	{
				        data: data,
				        axisLine:{
				    		show:false,
				    		lineStyle:{
				    			color:'#000000'
				    		}
				    	},
				        axisTick:{
				    		show:false
				    	}
				    },
				    {
				        data: data3,
				        axisLine:{
				    		show:false,
				    		lineStyle:{
				    			color:'#000000'
				    		}
				    	},
				        axisTick:{
				    		show:false
				    	}
				    }
				    ],
				    grid: {
				        left: '4%',
				        right: '3%',
				        top: '10',
				        paddingRight:'2%',
				        containLabel: true
				    },
				    xAxis: {
				    	axisLine:{
				    		show:false
				    	},
				    	axisTick:{
				    		show:false
				    	}
				    },
				    series: [
				    {
				    	label: {
			                normal: {
			                    show: true,
			                    position: 'left',
			                    textStyle:{
			                    	color:'#268956'
			                    }
			                }
			            },
				    	itemStyle:{
				    		normal:{
				    			color:'#268956'
				    		}
				    	},
				    	barWidth:'30px',
				        name: '已整改',
				        type: 'bar',
				        data: data2,
				        stack:1
				    },{
				    	label: {
			                normal: {
			                    show: true,
			                    position: 'right',
			                    textStyle:{
			                    	color:'#C8C8C8'
			                    }
			                }
			            },
				    	itemStyle:{
				    		normal:{
				    			color:'#C8C8C8'
				    		}
				    	},
				    	barGap:'-100%',
				    	barWidth:'30px',
				        name: '问题',
				        type: 'bar',
				        data: data1,
				        stack:1
				    }
				    ]
				};
				
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
            }
        }
    });
});
