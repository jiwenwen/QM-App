$(function(){
	/*wdata=[];
	wdata1=[];
	wdata2=[];
	wdata3=[];
	wdata4=[];
	wdata5="";*/
    var QMApp = new Vue({
        el: "#QMApp",
        data: {
        	datas:'',
        	histogram:[],
        	piechart:''
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
            	function fun_date(b){
				    var date1 = new Date(),
				        time1=date1.getFullYear()+"-"+((date1.getMonth()+1)<=9?"0"+(date1.getMonth()+1):(date1.getMonth()+1))+"-"+(date1.getDate()<=9?"0"+date1.getDate():date1.getDate());//time1表示当前时间
				    var date2 = new Date();
				    var year = date2.getFullYear();
				    var month = date2.getMonth() + 1+b;
				    var strDate = date2.getDate();
				    var littleMonth=[4,6,9,11];
				    function run(n){
				    	if(n%4==0&&n%100!=0){
				    		return true;
				    	}else if(n%400==0){
				    		return true;
				    	}else{
				    		return false;
				    	}
				    }
				    if(month<=0){
				    	year = year-1;
				    	month = 12+month;
				    }
				    if(month==2){
				    	if(run(year)){
				    		if(strDate>29){
				    			strDate = 29;
				    		}
				    	}else{
				    		if(strDate>28){
				    			strDate = 28;
				    		}
				    	}
			    	}else if(littleMonth.indexOf(month)>=0){
			    		if(strDate>30){
			    			strDate = 30;
			    		}
			    	}
				    if (month >= 1 && month <= 9) {
				        month = "0" + month;
				    }
				    if (strDate >= 0 && strDate <= 9) {
				        strDate = "0" + strDate;
				    }
				    var time2 = year+"-"+ month+"-"+strDate;
				    return [time2,time1];
				}
	        	var tma = fun_date(-3);
	        	$(".earlyTime input").val(tma[0]);
	        	$(".lateTime input").val(tma[1]);
            	this.getDatalevel1(tma[0],tma[1]);
            	this.initDate();
            	this.things();
				/*判断设备*/
				/*var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
				if(isiOS){
					$("html").css("padding-top","20px");
					$("html").css("box-sizing","border-box");
				}*/
            },
            things:function(){
            	$(".timeInterval").on("change","#startDate",function(){
            		var startTime = Date.parse($("#startDate").val());
            		if($("#endDate").val()!=""){
            			var endTime = Date.parse($("#endDate").val());
            			if(startTime>endTime){
            				util.notification.simple("开始日期不得晚于结束日期");
            				$("#startDate").val("");
            				return false;
            			}else{
            				QMApp.getDatalevel1($("#startDate").val(),$("#endDate").val());
            			}
            		}
            	});
            	$(".timeInterval").on("change","#endDate",function(){
					var endTime = Date.parse($("#endDate").val());
            		if($("#startDate").val()!=""){
            			var startTime = Date.parse($("#startDate").val());
            			if(startTime>endTime){
            				util.notification.simple("结束日期不得早于开始日期");
            				$("#endDate").val("");
            				return false;
            			}else{
            				QMApp.getDatalevel1($("#startDate").val(),$("#endDate").val());
            			}
            		}
            	});
            },
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
					startYear: currYear - 50, //开始年份
					startMonth:0,
                	startDay:1,
					endYear: currYear //结束年份
				};
	        	$("#startDate").mobiscroll($.extend(opt['date'], opt['default']));
	        	$("#endDate").mobiscroll($.extend(opt['date'],opt['default']));
			},
            solve:function(){
            	var wdata=[],
	            	wdata1=[],
	            	wdata2=[],
	            	wdata3=[],
	            	wdata4=[],
	            	wdata5="";
            	if(this.histogram){
            		for(var i=0;i<this.histogram.length;i++){
            			wdata[this.histogram.length-1-i]=this.histogram[i].Question_Level.toUpperCase()+"级      ";
            			var a = this.histogram[i].UnChecked,
            				b = this.histogram[i].Checked;
        				if(a!=0){
        					wdata1[this.histogram.length-1-i]=a;
        				}else{
        					wdata1[this.histogram.length-1-i]='';
        				}
        				if(b!=0){
        					wdata2[this.histogram.length-1-i]=b;
        				}else{
        					wdata2[this.histogram.length-1-i]='';
        				}
            			wdata3[this.histogram.length-1-i]="    "+(this.histogram[i].Checked+this.histogram[i].UnChecked);
//          			wdata3[this.histogram.length-1-i]=Math.floor((wdata1[this.histogram.length-1-i]/wdata2[this.histogram.length-1-i])*100)+"%";
            		}
            	}
            	wdata4[0]=this.piechart.UnChecked;
            	wdata4[1]=this.piechart.Checked;
            	wdata5=(Math.floor((wdata4[1]/(wdata4[0]+wdata4[1]))*10000))/100+"%";
            	this.echarts(wdata,wdata1,wdata2,wdata3,wdata4,wdata5);
            },
            getDatalevel1:function(start,end){
            	this.$http.get(util.baseUrl + 'PMQualityCheckApi/GetQualityReport',{params:{"StartDate":start,"EndDate":end}}).then(function(response){
            		if(response.data.Flag){
            			this.datas=response.data.Content;
            			this.histogram=response.data.Content.LevelReport;
            			this.piechart=response.data.Content.QualityReport;
            			this.solve();
            		}
            	},function(response){
            		util.tokenFailure(response,util);
            	});
            },
            echarts:function(data,data1,data2,data3,data4,data5){
            	/*var data=wdata,
            		data1=wdata1,
            		data2=wdata2,
            		data3=wdata3,
            		data4=wdata4,
            		data5=wdata5;*/
            	var bottomChart = echarts.init(document.getElementById('columnData'));
            	var topChart = echarts.init(document.getElementById('cycleData'));
				bottomChart.on('click',function(params){
//					console.info(params);
					 if(params.componentSubType === 'bar'){
					 	console.info(params.name);
					 	return false;
					 	window.location.href='reportDetail.html';
					 }
				});
				/*topChart.on('click',function(params){
					console.info(params);
				})*/
				$(".reportPage").on("click",".ringDiagram",function(){
					localStorage.setItem("search",JSON.stringify([{"problemTypeName":"所有","problemTypeCode":"0"},{"problemLevelName":"等级"}]));
					window.location.href='../../quality/sr/reportDetail.html';
				});
				// 指定图表的配置项和数据
				var option2={
					title: {
				        text: '整改率',
				        subtext: data5,
				        x: 'center',
				        top:'40%',
				        subtextStyle:{
			        		color:'#268956',
			        		fontWeight:'bloder'
				        }
				   },
				    legend: {
				        orient: 'vertical',
				        x: 'right',
				        top:'0px',
				        align:'left',
				        orient:'horizontal',
				        data:['未整改','已整改']
				    },
				    series: [
				        {
				            type:'pie',
				            radius: ['50%', '70%'],
				            avoidLabelOverlap: false,
				            labelLine: {
				                normal: {
				                    show: true
				                }
				            },
				            data:[
				                {value:data4[1], name:'已整改'+"-"+data4[1],itemStyle:{normal:{color:'#268956'}}},
				                {value:data4[0], name:'未整改'+"-"+data4[0],itemStyle:{normal:{color:'#C8C8C8'}}}
				            ]
				        }
				    ]
				};
				var option1 = {
					title:{
						text:'等级分布',
						top:'top',
						left:'center'
					},
				    tooltip: {},
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
				        right: '5%',
				        top: '10%',
				        bottom:'2%',
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
//			                    position: 'insideRight',
			                    position: 'left',
			                    textStyle:{
//			                    	color:'#FFFFFF'
			                    	color:'#268956'
			                    }
			                }
			            },
				    	itemStyle:{
				    		normal:{
				    			color:'#268956'
				    		}
				    	},
				    	barGap:'-100%',
				    	barWidth: 30,
				        name: '已整改',
				        type: 'bar',
				        data: data2,
				        stack:1
				    },
				    {
				    	label: {
			                normal: {
			                    show: true,
//			                    position: 'insideRight',
			                    position: 'right',
			                    textStyle:{
//			                    	color:'#FFFFFF'
			                    	color:'#C8C8C8'
			                    }
			                }
			            },
				    	itemStyle:{
				    		normal:{
				    			color:'#C8C8C8'
				    		}
				    	},
				    	barWidth: 30,
				        name: '问题',
				        type: 'bar',
				        data: data1,
				        stack:1
				    }
				    ]
				};
				
				// 使用刚指定的配置项和数据显示图表。
				topChart.setOption(option2);
				bottomChart.setOption(option1);
            }
        }
    });
});