var QMApp = new Vue({
    el: "#QMApp",
    data: {
        PageIndex:0,
        problemLst:[{
            Attachments:[{
                filePath:''
            }]
        }],
        scroll:true,
        problemLst1:[],
        project_name:'',
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
            setTimeout(function(){
                QMApp.getProblem();
            },300);
            /*分页加载*/
            /*$(".detail").scroll(function(){
                var scrollTop = $(this).scrollTop();/!*滚动条距离detail顶部的距离*!/
                var scrollHeight = $(".detail-content").height()-20;
                var windowHeight = $(this).height();/!*detail的高度*!/
                if(scrollTop + windowHeight>=scrollHeight&&QMApp.problemLst1.length!=0&&QMApp.scroll==true){
                    QMApp.scroll=false;
                    QMApp.getProblem();
                    }
            });*/
        },
        /*获取问题列表*/
        getProblem:function(){
            $(".submit-cover").show();
            var params={
                "PageIndex":this.PageIndex,
                "PageSize":10,
                "ProjectId":util._param.pjId,
                "Status":util._param.status,
                "List_Id":0
            };
            this.$http.get(util.baseUrl + "PMQualityCheckApi/GetQualityDetailList",{params:params}).then(function(response){
                var result=response.data;
                this.project_name=result.Project_Name;
                if(result.Flag){
                    if (this.PageIndex==0){
                        this.problemLst1=response.data.Content;
                        this.problemLst=response.data.Content;
                        this.PageIndex ++;
                        initScroll(function(myScroll){
                            myScroll.on('scrollEnd', function() {
                                if (this.scrollerHeight + this.y - 50 < $('#wrapper').height() && (this.directionY === 0) &&QMApp.problemLst1.length != 0) {
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
        /*返回*/
        returnPreview:function(){
         /*  history.back();*/
            var $status = util._param.status ? util._param.status:2;
            if (util._param.search){
                window.location.href="proList.html?search="+util._param.search+"&status="+$status;
            }
            else
            {
                window.location.href="proList.html?status="+$status;
            }
        },
        /*进入问题详情页*/
        reviewDetail:function(){
            if (util._param.search){
                window.location.href="detail.html?listId="+$(event.currentTarget).attr("listId")+"&status="+util._param.status+"&pjId="+util._param.pjId+"&checkId="+$(event.currentTarget).attr("checkId")+"&qualityRole="+$(event.currentTarget).attr("qualityRole")+"&search="+util._param.search;
            }
            else {
                window.location.href="detail.html?listId="+$(event.currentTarget).attr("listId")+"&status="+util._param.status+"&pjId="+util._param.pjId+"&checkId="+$(event.currentTarget).attr("checkId")+"&qualityRole="+$(event.currentTarget).attr("qualityRole");
            }

        }
    }
});