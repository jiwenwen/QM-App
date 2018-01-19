var QMApp = new Vue({
    el: "#QMApp",
    data: {
        PageIndex:0,
        typeid:'',
        draftLst:[],
        draftLst1:[],
        rectificationLst1:[],
        rectificationLst:[],
        reviewLst1:[],
        reviewLst:[],
        completeLst:[],
        completeLst1:[],
        count:[],
        isScroll:'',
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
            /*给搜索框value值*/
            if (util._param.search){
                $(".search-input").find("input").val(decodeURIComponent(util._param.search));
            }
            /*监控手机enter*/
            $(".header-search").on("keydown","input",function(event){
                if (event.keyCode == 13){
                    var $status = util._param.status ? util._param.status:1;
                    if ($(".search-input").find("input").val()!=''){
                        var $input=encodeURIComponent($(".search-input").find("input").val());
                        window.location.href="proList.html?search="+$input+"&status="+$status;
                    }
                    else {
                        window.location.href="proList.html?status="+$status;
                    }
                }
            });
            /*返回*/
            var $status = util._param.status ? util._param.status:1;
            if ($status==1){
                this.PageIndex=0;
                $(".rectification").show();
                $(".review").hide();
                $(".complete").hide();
                $(".tab-content").find("span").removeClass("active");
                $($(".tab-first").find("span")[0]).addClass("active");
                this.getCount();
                this.getRectification();
            }
            else if ($status==2){
                this.PageIndex=0;
                $(".rectification").hide();
                $(".review").show();
                $(".complete").hide();
                $(".tab-content").find("span").removeClass("active");
                $($(".tab-second").find("span")[0]).addClass("active");
                this.getCount();
                this.getReview();
            }
            else if ($status==3){
                this.PageIndex=0;
                $(".rectification").hide();
                $(".review").hide();
                $(".complete").show();
                $(".tab-content").find("span").removeClass("active");
                $($(".tab-third").find("span")[0]).addClass("active");
                this.getCount();
                this.getComplete();
            }
        },
        /*tab切换*/
        tabChange:function(event){
            $(".tab-content").find("span").removeClass("active");
            $($(event.currentTarget).find("span")[0]).addClass("active");
            this.typeid= $(event.currentTarget).attr("typeid");
            if ( $(event.currentTarget).attr("typeid")==1){
                $(".loading").show();
                var $input=decodeURIComponent(util._param.search);
                if(util._param.search){
                    window.location.href="proList.html?status=1"+"&search="+encodeURIComponent($input);
                }
                else{
                    window.location.href="proList.html?status=1";
                }
            }
            if ( $(event.currentTarget).attr("typeid")==2){
                $(".loading").show();
                var $input=decodeURIComponent(util._param.search);
                if(util._param.search){
                    window.location.href="proList.html?status=2"+"&search="+encodeURIComponent($input);
                }
                else{
                    window.location.href="proList.html?status=2";
                }
            }
            if ( $(event.currentTarget).attr("typeid")==3){
                $(".loading").show();
                var $input=decodeURIComponent(util._param.search);
                if(util._param.search){
                    window.location.href="proList.html?status=3"+"&search="+encodeURIComponent($input);
                }
                else{
                    window.location.href="proList.html?status=3";
                }
            }
        },
        /*获取count*/
        getCount:function(){
            this.typeid=1;
            if (util._param.search){
                var params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10,
                    "searchcriteria":decodeURIComponent(util._param.search)
                };
            }
            else{
                var params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10
                };
            }
            this.$http.get(util.baseUrl + "PMQualityCheckApi/GetWaitRectifyList",{params:params}).then(function(response){
                var result=response.data;
                if(result.Flag){
                    this.count=response.data.Content.Count;
                    $(".loading").hide();
                }else{
                    util.notification.simple(result.Msg);
                }
            }, function(response){
                errorFun(response,util);
            });
        },
        /*获取待整改列表*/
        getRectification:function(){
            $(".submit-cover").show();
            this.typeid=1;
            if (util._param.search){
                var params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10,
                    "searchcriteria":decodeURIComponent(util._param.search)
                };
            }
            else{
                var params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10
                };
            }
            this.$http.get(util.baseUrl + "PMQualityCheckApi/GetWaitRectifyList",{params:params}).then(function(response){
                var result=response.data;
                if(result.Flag){
                    this.isScroll=response.data.Flag;
                    if (this.PageIndex==0){
                        this.rectificationLst1=response.data.Content.Index_Quality;
                        this.rectificationLst=response.data.Content.Index_Quality;
                        this.PageIndex ++;
                        initScroll(function(myScroll){
                            myScroll.on('scrollEnd', function() {
                                if (this.scrollerHeight + this.y - 50 < $('#wrapper').height() && (this.directionY === 0) && QMApp.rectificationLst1.length != 0) {
                                    QMApp.getRectification();
                                }
                            });
                            myScroll.on('scrollStart',function() {
                                if(this.distY>10){
                                    $(".detail").css("top","6.3rem");
                                    $(".header").css("top","3.2rem");
                                    refreshScroll();
                                }
                                if(this.distY<-10){
                                    $(".header").css("top","-10px");
                                    $(".detail").css("top","3.2rem");
                                    refreshScroll();
                                }
                            });
                        });
                    }
                    else{
                        this.rectificationLst1=response.data.Content.Index_Quality;
                        this.rectificationLst=this.rectificationLst.concat(this.rectificationLst1);
                        this.PageIndex ++;
                        refreshScroll();
                    }
                    $(".loading").hide();
                    $(".submit-cover").hide();
                }else{
                    util.notification.simple(result.Msg);
                    $(".loading").hide();
                    $(".submit-cover").hide();
                }
            }, function(response){
                errorFun(response,util);
                $(".loading").hide();
                $(".submit-cover").hide();
            });
        },
        /*获取复核中按钮*/
        getReview:function(){
            $(".submit-cover").show();
            this.typeid=2;
            if (util._param.search){
                var params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10,
                    "searchcriteria":decodeURIComponent(util._param.search)
                };
            }
            else{
                var params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10,
                };
            }
            this.$http.get(util.baseUrl + "PMQualityCheckApi/GetWaitCheckList",{params:params}).then(function(response){
                var result=response.data;
                if(result.Flag){
                    this.isScroll=response.data.Flag;
                    if (this.PageIndex==0){
                        this.reviewLst1=response.data.Content.Index_Quality;
                        this.reviewLst=response.data.Content.Index_Quality;
                        this.PageIndex ++;
                        initScroll(function(myScroll){
                            myScroll.on('scrollEnd', function() {
                                if (this.scrollerHeight + this.y - 50 < $('#wrapper').height() && (this.directionY === 0) && QMApp.reviewLst1.length != 0) {
                                    QMApp.getReview();
                                }
                            });
                            myScroll.on('scrollStart',function() {
                                if(this.distY>10){
                                    $(".detail").css("top","6.3rem");
                                    $(".header").css("top","3.2rem");
                                    refreshScroll();
                                }
                                if(this.distY<-10){
                                    $(".header").css("top","-10px");
                                    $(".detail").css("top","3.2rem");
                                    refreshScroll();
                                }
                            });
                        });
                    }
                    else{
                        this.reviewLst1=response.data.Content.Index_Quality;
                        this.reviewLst=this.reviewLst.concat(this.reviewLst1);
                        this.PageIndex ++;
                        refreshScroll();
                    }
                    $(".loading").hide();
                    $(".submit-cover").hide();
                }else{
                    util.notification.simple(result.Msg);
                    $(".loading").hide();
                    $(".submit-cover").hide();
                }
            }, function(response){
                $(".loading").hide();
                $(".submit-cover").hide();
                errorFun(response,util);
            });

        },
        /*获取已完成列表*/
        getComplete:function(){
            $(".submit-cover").show();
            this.typeid=3;
            if (util._param.search){
                var params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10,
                    "searchcriteria":decodeURIComponent(util._param.search)
                };
            }
            else{
                var params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10
                };
            }
            this.$http.get(util.baseUrl + "PMQualityCheckApi/GetCompleteList",{params:params}).then(function(response){
                var result=response.data;
                if(result.Flag){
                    this.isScroll=response.data.Flag;
                    if (this.PageIndex==0){
                        this.completeLst1=response.data.Content.Index_Quality;
                        this.completeLst=response.data.Content.Index_Quality;
                        this.PageIndex ++;
                        initScroll(function(myScroll){
                            myScroll.on('scrollEnd', function() {
                                if (this.scrollerHeight + this.y - 50 < $('#wrapper').height() && (this.directionY === 0) &&QMApp.completeLst1.length != 0) {
                                    QMApp.getComplete();
                                }
                            });
                            myScroll.on('scrollStart',function() {
                                if(this.distY>10){
                                    $(".detail").css("top","6.3rem");
                                    $(".header").css("top","3.2rem");
                                    refreshScroll();
                                }
                                if(this.distY<-10){
                                    $(".header").css("top","-10px");
                                    $(".detail").css("top","3.2rem");
                                    refreshScroll();
                                }
                            });
                        });
                    }
                    else{
                        this.completeLst1=response.data.Content.Index_Quality;
                        this.completeLst=this.completeLst.concat(this.completeLst1);
                        this.PageIndex ++;
                        refreshScroll();
                    }
                    $(".loading").hide();
                    $(".submit-cover").hide();
                }else{
                    util.notification.simple(result.Msg);
                    $(".loading").hide();
                    $(".submit-cover").hide();
                }
            }, function(response){
                $(".loading").hide();
                $(".submit-cover").hide();
                errorFun(response,util);
            });
        },
        /*进入问题列表页*/
        problemLst:function(){
            var $status = util._param.status ? util._param.status:1;
            if(util._param.search){
                window.location.href="list.html?status="+$status+"&pjId="+$(event.currentTarget).attr("pjId")+"&search="+util._param.search;
            }
            else{
                window.location.href="list.html?status="+$status+"&pjId="+$(event.currentTarget).attr("pjId");
            }
        },
        /*搜索项目*/
        searchProject:function(){
            $(".header-middle").hide();
            $(".header-right").hide();
            $(".header-search").show();
        },
        /*取消搜索项目*/
        cancelSearch:function(){
            $(".header-middle").show();
            $(".header-right").show();
            $(".header-search").hide();
        },
        /*搜索*/
        searchPj:function(){
            var $status = util._param.status ? util._param.status:1;
            if ($(".search-input").find("input").val()!=''){
                var $input=encodeURIComponent($(".search-input").find("input").val());
                window.location.href="proList.html?search="+$input+"&status="+$status;
            }
            else {
                window.location.href="proList.html?status="+$status;
            }
        },
        /*删除搜索条件*/
        searchDelete:function(){
            var $status = util._param.status ? util._param.status:1;
            $(".search-input").find("input").val("");
            window.location.href="proList.html?status="+$status;
        }
    }
});