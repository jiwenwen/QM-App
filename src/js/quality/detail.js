/**
 * Created by 00022879 on 2017/6/20.
 */
$(function(){
 var QMApp = new Vue({
        el: "#QMApp",
        data: {
            checkCode:'',
            rectificationOnce1:
                {
                    Attachments:[{
                        filePath:''
                    }]
                }
            ,
            rectificationOnce2:
                {
                    Attachments:[{
                        filePath:''
                    }]
                }
            ,
            rectificationRepeated:[
                {
                    Attachments:[{
                        filePath:''
                    }]
                }
            ],
            rectificationLast: {
                Attachments:[{
                    filePath:''
                }]
            },
            viewdata:[],
            displacement:'',
            authority:'',
            unitName:'',
            isUnit:'',
            status:util._param.status
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
                /*页面初始化数据*/
                this.initInfo();

                /*只有在待审核的问题才有达标和不达标按钮*/
                if (util._param.status==2){
                    $(".bottom").show();
                   /* $(".detail").css("position","absolute");*/
                    $(".detail").css("bottom","4.17rem");
                }

                /*时间控件*/
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
                    endYear: currYear+1 //结束年份
                };
                $("#time-select").mobiscroll($.extend(opt['date'], opt['default']));
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
                    $("#time-select").val(time2);
                }
                fun_date(7);
            },
            /*不达标按钮*/
            unsuccess:function(){
                $(".pub-confirmSub").css("top","0px");
                $(".pub-confirmSub").css("opacity","1");
                $(".pub-confirmSub").show();
            },
            /*达标按钮*/
            success: function () {
                $(".submit-cover").show();
                var params1={
                    "Status":1,
                    "List_Id":util._param.listId
                };
                this.$http.post(util.baseUrl + "PMQualityCheckApi/PostRectify",params1).then(function(response){
                    var result=response.data;
                    if(result.Flag){
                        setTimeout(function(){
                           history.back();
                        },1000);
                        util.notification.simple("审批完成！");
                    }else{
                        util.notification.simple(result.Msg);
                    }
                    $(".submit-cover").hide();
                }, function(response){
                    $(".submit-cover").hide();
                    errorFun(response,util);
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
                    console.log(JSON.stringify(result));
                    $(".loading").hide();
                    if(result.Flag){
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
                                console.log(this.rectificationOnce2);
                            }
                        }
                        else if(result.Content.length>2){
                            $($(".detail-content").find(".detail-item")[0]).hide();
                            $($(".detail-content").find(".detail-item")[1]).hide();
                            $($(".detail-content").find(".detail-item")[2]).show();
                            $(".expand-button").show();
                            this.rectificationRepeated =result.Content;
                            for (var i=result.Content.length-1;i>0;i--){
                                if(result.Content[i].Flag==1){
                                    this.rectificationLast=result.Content[i];
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
            /*点击不达标按钮后点击确认提交按钮*/
            submit:function(){
                $(".submit-cover").show();
                if( $("#time-select").val()&&$(".advice").val()){
                    var params={
                        "Status":0,
                        "List_Id":util._param.listId,
                        "Request_Close_Time": $("#time-select").val(),
                        "CheckOption":$(".advice").val()
                    };
                    this.$http.post(util.baseUrl + "PMQualityCheckApi/PostRectify",params).then(function(response){
                        var result=response.data;
                        if(result.Flag){
                            setTimeout(function(){
                               history.back();
                            },2000);
                            if (this.isUnit==1){
                                util.notification.simple("问题已提交至班组："+this.unitName+"！");
                            }
                            else if (this.isUnit==2){
                                util.notification.simple("问题已提交至供应商："+this.unitName+"！");
                            }
                        }else{
                            if(result.Manager==0){
                                util.notification.simple("您没有审批权限！");
                            }
                            /* util.notification.simple(result.Msg);*/
                        }
                        $(".submit-cover").hide();
                    }, function(response){
                        $(".submit-cover").hide();
                        errorFun(response,util);
                        util.notification.simple("网络连接异常4");
                    });
                }
                else if ( !$("#time-select").val()){
                    $(".submit-cover").hide();
                    util.notification.simple("时间未选择！");
                }
                else if ( !$(".advice").val()){
                    $(".submit-cover").hide();
                    util.notification.simple("复核意见未填写！");
                }
            },
            /*点击不达标按钮后点击取消按钮*/
            cancel:function(){
                $(".pub-confirmSub").css({"top":"100%","opacity":"0"},function(){
                    $(".pub-confirmSub").hide();
                });
            },
            /*收起展开审核记录*/
            retract:function(event){
                if ($(event.currentTarget).attr("typeid")==0){
                    $(".expand-detail").show();
                    $(event.currentTarget).css("border-top","none");
                    $(event.currentTarget).attr("typeid","1");
                    $(event.currentTarget).find("span").html("收起审核记录");
                    $(event.currentTarget).find("img").attr("src","../../images/staff/detail/retract.png");
                }
                else{
                    $(".expand-detail").hide();
                    $(event.currentTarget).attr("typeid","0");
                    $(event.currentTarget).css("border-top","1px solid rgba(209,192,138,0.25)");
                    $(event.currentTarget).find("span").html("展开审核记录");
                    $(event.currentTarget).find("img").attr("src","../../images/staff/detail/expand.png");
                }
            },
            /*图片预览滑动*/
            imgChange:function(){
                this.viewdata=[];
                /*var index=$(event.currentTarget).parentsUntil(".expand-detail-item").parent().index();*/
                for (var i=0;i<$(event.currentTarget).parent().find("img").length;i++){
                    var $imgurl=$($(event.currentTarget).parent().find("img")[i]).attr("src");
                    this.viewdata.push({"path":$imgurl});
                }

                /*this.viewdata=this.rectificationRepeated[index].Attachments;*/
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
                        })
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
                        })
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
                },100)
            },
            hideImg:function(){
                $(".view").hide();
                this.viewdata=[];
            },
            resendMessage: function(){
                util.timeOut();
                var params = {
                    List_Id:util._param.listId
                };
                this.$http.get(util.baseUrl + "PMQualityCheckApi/SendMessage",{params:params}).then(function(response){
                    if(response.data.Flag){
                        util.notification.simple("发送成功！");
                        setTimeout(function(){
                            history.back();
                        },2000);
                    }else{
                        util.notification.simple("发送失败！请稍后重试");
                    }
                    util.timeOut(1);
                },function(response){
                    errorFun(response,util);
                });
            }
        }
    });
});


