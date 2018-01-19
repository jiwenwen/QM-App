var QMApp = new Vue({
    el: "#QMApp",
    data: {
        PageIndex:0,
        problemLst:[{
            Attachments:[{
                filePath:''
            }]
        }],
        pjName:'',
        scroll:true,
        problemLst1:[],
        status:util._param.status,

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
                this.getProblem();



            setTimeout(function(){
                /*已完成的整改详情没有时间*/
                if (util._param.status==0){
                    $(".add-problem").show();
                    /*滑动删除按钮*/
                    // 设定每一行的宽度=屏幕宽度+按钮宽度
                    //$(".line-scroll-wrapper").width($(".line-wrapper").width() + $(".line-btn-delete").width());
                    // 设定常规信息区域宽度=屏幕宽度
                    //$(".line-normal-wrapper").width($(".line-wrapper").width());
                    // 设定文字部分宽度（为了实现文字过长时在末尾显示...）
                    //$(".line-normal-msg").width($(".line-normal-wrapper").width() - 280);
                    // 获取所有行，对每一行设置监听
                    var lines = $(".line-normal-wrapper");
                    var len = lines.length;
                    var lastX, lastXForMobile;
                    // 用于记录被按下的对象
                    var pressedObj;  // 当前左滑的对象
                    var lastLeftObj; // 上一个左滑的对象
                    // 用于记录按下的点
                    var start;
                    // 网页在移动端运行时的监听
                    for (var i = 0; i < len; ++i) {
                        lines[i].addEventListener('touchstart', function(e){
                            lastXForMobile = e.changedTouches[0].pageX;
                            pressedObj = this; // 记录被按下的对象
                            // 记录开始按下时的点
                            var touches = event.touches[0];
                            start = {
                                x: touches.pageX, // 横坐标
                                y: touches.pageY  // 纵坐标
                            };
                        });
                        lines[i].addEventListener('touchmove',function(e){
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
                        lines[i].addEventListener('touchend', function(e){
                            if (lastLeftObj && pressedObj != lastLeftObj) { // 点击除当前左滑对象之外的任意其他位置
                                $(lastLeftObj).next().animate({right:"-8rem"}, 500); // 右滑
                                lastLeftObj = null; // 清空上一个左滑的对象
                            }
                            var diffX = e.changedTouches[0].pageX - lastXForMobile;
                            if (diffX < -15) {
                                $(pressedObj).next().animate({right:"0rem"}, 500); // 左滑
                                $(pressedObj).attr("typeid","1");
                                lastLeftObj && lastLeftObj != pressedObj &&
                                $(lastLeftObj).animate({right:"-8rem"}, 500); // 已经左滑状态的按钮右滑
                                lastLeftObj = pressedObj; // 记录上一个左滑的对象
                            } else if (diffX > 15) {
                                if (pressedObj == lastLeftObj) {
                                    $(pressedObj).next().animate({right:"-8rem"}, 500); // 右滑
                                    lastLeftObj = null; // 清空上一个左滑的对象
                                }
                            }
                        });
                    }
                    // 网页在PC浏览器中运行时的监听
                    for (var i = 0; i < len; ++i) {
                        $(lines[i]).bind('mousedown', function(e){
                            lastX = e.clientX;
                            pressedObj = this; // 记录被按下的对象
                        });
                        $(lines[i]).bind('mouseup', function(e){
                            if (lastLeftObj && pressedObj != lastLeftObj) { // 点击除当前左滑对象之外的任意其他位置
                                $(lastLeftObj).next().animate({right:"-8rem"}, 500); // 右滑
                                lastLeftObj = null; // 清空上一个左滑的对象
                            }
                            var diffX = e.clientX - lastX;
                            if (diffX < -15) {
                                $(pressedObj).next().animate({right:"0"}, 500); // 左滑
                                lastLeftObj && lastLeftObj != pressedObj &&
                                $(lastLeftObj).next().animate({right:"-8rem"}, 500); // 已经左滑状态的按钮右滑
                                lastLeftObj = pressedObj; // 记录上一个左滑的对象
                            } else if (diffX > 15) {
                                if (pressedObj == lastLeftObj) {
                                    $(pressedObj).next().animate({right:"-8rem"}, 500); // 右滑
                                    lastLeftObj = null; // 清空上一个左滑的对象
                                }
                            }
                        });
                    }
                 }

            },300);
        },
        /*获取问题列表*/
        getProblem:function(){
            $(".submit-cover").show();
            if (util._param.status==0){
                $(".header-middle").find("span").html("草稿")
            }
            var params={
                "PageIndex":this.PageIndex,
                "PageSize":10,
                "ProjectId":util._param.pjId,
                "Status":util._param.status,
                "List_Id":0,
                "isAll":util._param.isall
            };
            this.$http.get( util.baseUrl + "PMQualityCheckApi/GetQualityDetailList",{params:params}).then(function(response){
                var result=response.data;
                $(".loading").hide();
                if(result.Flag){
                    if (this.PageIndex==0){
                        this.problemLst1=response.data.Content;
                        this.problemLst=response.data.Content;
                        this.pjName=response.data.Project_Name;
                        this.PageIndex ++;
                        initScroll(function(myScroll){
                            myScroll.on('scrollEnd', function() {
                                if (this.scrollerHeight + this.y - 20 < $('#wrapper').height()&&QMApp.problemLst1.length != 0) {
                                    QMApp.getProblem();
                                }
                            });
                        });
                    }
                    else{
                        this.problemLst1=response.data.Content;
                        this.problemLst=this.problemLst.concat(this.problemLst1);
                        this.PageIndex ++;
                        refreshScroll();
                    }
                }else{
                    util.notification.simple(result.Msg);
                }
                $(".loading").hide();
                $(".submit-cover").hide();
            }, function(response){
                $(".loading").hide();
                $(".submit-cover").hide();
                errorFun(response,util);
            });
        },
        /*点击列表进入详情*/
        reviewDetail:function(event){
            if ($(event.currentTarget).attr("typeid")==0){
                if (util._param.status==0){
                    if (util._param.search){
                        window.location.href="submitQ.html?projectId="+util._param.pjId+"&listId="+$(event.currentTarget).attr("listId")+"&checkId="+$(event.currentTarget).attr("checkId")+"&status="+util._param.status+"&search="+util._param.search;
                    }
                    else {
                        window.location.href="submitQ.html?projectId="+util._param.pjId+"&listId="+$(event.currentTarget).attr("listId")+"&checkId="+$(event.currentTarget).attr("checkId")+"&status="+util._param.status;
                    }

                }
                else{
                    if (util._param.search){
                        window.location.href="detail.html?checkCount="+$(event.currentTarget).attr("checkCount")+"&listId="+$(event.currentTarget).attr("listId")+"&status="+util._param.status+"&pjId="+util._param.pjId+"&checkId="+$(event.currentTarget).attr("checkId")+"&isall="+util._param.isall+"&search="+util._param.search;
                    }
                    else
                    {
                        window.location.href="detail.html?checkCount="+$(event.currentTarget).attr("checkCount")+"&listId="+$(event.currentTarget).attr("listId")+"&status="+util._param.status+"&pjId="+util._param.pjId+"&checkId="+$(event.currentTarget).attr("checkId")+"&isall="+util._param.isall;
                    }

                }
            }
            else{
                $(event.currentTarget).animate({marginLeft:"0"}, 500);
                $(event.currentTarget).attr("typeid","0")
            }
        },
        enterSubmitQ:function(){
            if(util._param.search){
                window.location.href="submitQ.html?projectId="+util._param.pjId+"&status="+util._param.status+"&search="+util._param.search;
            }
            else{
                window.location.href="submitQ.html?projectId="+util._param.pjId+"&status="+util._param.status;
            }

        },
        /*删除一条记录*/
        deleteItem:function(event){
            $(event.currentTarget).animate({right:"-8rem"}, 500);
            var params={
                "List_Id":$(event.currentTarget).attr("listId")
            };
            this.$http.get( util.baseUrl + "PMQualityCheckApi/DeleteDraft",{params:params}).then(function(response){
                var result=response.data;
                if(result.Flag){
                    window.location.href="list.html?pjId="+util._param.pjId+"&status="+util._param.status;
                }else{
                    util.notification.simple(result.Msg);
                }

            }, function(response){
                errorFun(response,util);
            });
        }
    }
});

