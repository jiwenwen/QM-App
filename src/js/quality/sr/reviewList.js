/**
 * Created by 00022879 on 2017/7/10.
 */
$(function(){
    var QMApp = new Vue({
        el: "#QMApp",
        data: {
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
            displacement:''
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
                /*判断设备*/
               /* var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                if(isiOS){
                    $("html").css("padding-top","20px");
                    $("html").css("box-sizing","border-box");
                }*/
                /*一次整改和多次整改请求数据*/
                var type=util._param.type;
                if(type<=1){
                    $($(".detail-content").find(".detail-item")[0]).show();
                    $($(".detail-content").find(".detail-item")[1]).show();
                    $($(".detail-content").find(".detail-item")[2]).hide();
                    $(".expand-detail").hide();
                    $(".expand-button").hide();
                    var $isall = util._param.isall ? util._param.isall:1;
                    var params1={
                        "PageIndex":0,
                        "PageSize":10,
                        "ProjectId":util._param.pjId,
                        "Status":util._param.status,
                        "List_Id":util._param.listId,
                        "isAll":$isall
                    };
                    this.$http.get(util.baseUrl + "PMQualityCheckApi/GetQualityDetailList",{params:params1}).then(function(response){
                        var result=response.data;
                        $(".loading").hide();
                        if(result.Flag){
                            result.Content[0].Create_Date=result.Content[0].Create_Date.substr(5,5);
                            this.rectificationOnce1=result.Content[0];
                        }else{
                            util.notification.simple(result.Msg);
                        }
                    }, function(response){
                        errorFun(response,util);
                    });
                    if(type==0){
                        $($(".detail-content").find(".detail-item")[0]).show();
                        $($(".detail-content").find(".detail-item")[1]).hide();
                        $($(".detail-content").find(".detail-item")[2]).hide();
                        $(".expand-detail").hide();
                        $(".expand-button").hide();
                    }
                    else{
                        var params2={
                            "List_Id":util._param.listId
                        };
                        this.$http.get(util.baseUrl + "PMQualityCheckApi/GetFeedBackDetails",{params:params2}).then(function(response){
                            var result=response.data;
                            $(".loading").hide();
                            if(result.Flag){
                                result.Content.Create_Date=result.Content.Create_Date.substr(5,5);
                                QMApp.rectificationOnce2=result.Content;

                            }else{
                                util.notification.simple(result.Msg);
                            }
                        }, function(response){
                            errorFun(response,util);
                        });
                    }
                }
                else if (type>1) {
                    $($(".detail-content").find(".detail-item")[0]).hide();
                    $($(".detail-content").find(".detail-item")[1]).hide();
                    $($(".detail-content").find(".detail-item")[2]).show();
                    $(".expand-button").show();
                    var params={
                        "List_Id":util._param.listId
                    };
                    this.$http.get(util.baseUrl + "PMQualityCheckApi/GetCheckAndRectifyDetails",{params:params}).then(function(response){
                        var result=response.data;
                        $(".loading").hide();
                        if(result.Flag){
                            for (var i=0;i<result.Content.length;i++){
                                result.Content[i].Create_Date=result.Content[i].Create_Date.substr(5,5);
                            }
                            QMApp.rectificationRepeated =result.Content;
                            var list1=[];
                            for(var i=0;i<response.data.Content.length;i++){
                                if(response.data.Content[i].Flag==1){
                                    list1.push(response.data.Content[i])
                                }
                            }
                            QMApp.rectificationLast=list1[list1.length-1];
                        }else{
                            util.notification.simple(result.Msg);
                        }
                    }, function(response){
                        errorFun(response,util);
                    });
                }
                /*只有在待审核的问题才有达标和不达标按钮*/
                if (util._param.status==2){
                    $(".bottom").show();
                    $(".detail").css("position","absolute")
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
            /*返回按钮*/
            returnPreview:function(){
                /*   history.back();*/
                if (util._param.search){
                    window.location.href="problemList.html?search="+util._param.search+"&pjId="+util._param.pjId+"&companyId="+util._param.companyId+"&departmentId="+util._param.departmentId;
                }
                else
                {
                    window.location.href="problemList.html?pjId="+util._param.pjId+"&companyId="+util._param.companyId+"&departmentId="+util._param.departmentId;
                }
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
                    List_Id:util._param.listId
                };
                this.$http.post(util.baseUrl + "PMQualityCheckApi/PostRectify",params1).then(function(response){
                    var result=response.data;
                    if(result.Flag){

                    }else{

                        /* util.notification.simple(result.Msg);*/
                    }
                    $(".submit-cover").hide();
                }, function(response){
                    $(".submit-cover").hide();
                    errorFun(response,util);
                });
            },
            /*点击不达标按钮后点击确认提交按钮*/
            submit:function(){
                $(".submit-cover").show();
                if( $("#time-select").val()&&$(".advice").val()){
                    var params={
                        "Status":0,
                        List_Id:util._param.listId,
                        Request_Close_Time: $("#time-select").val(),
                        CheckOption:$(".advice").val()
                    };
                    this.$http.post(util.baseUrl + "PMQualityCheckApi/PostRectify",params).then(function(response){
                        var result=response.data;
                        if(result.Flag){

                        }else{

                            /* util.notification.simple(result.Msg);*/
                        }
                        $(".submit-cover").hide();
                    }, function(response){
                        $(".submit-cover").hide();
                        errorFun(response,util);
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
            }
        }
    })
});