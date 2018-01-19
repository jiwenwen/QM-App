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
        role:'',
        isSearch:''
    	
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
            // alert(localStorage.getItem("token"));
            /*判断权限*/
            var $isall = $.cookie("isall") ? $.cookie("isall"):0;
            if($isall==0){
                $(".role-select").find("span").html("我的");
            }
            else if ($isall==1){
                $(".role-select").find("span").html("全部");
            }
            else if ($isall==2){
                $(".role-select").find("span").html("自检");
            }
            /*角色权限*/
            this.role=localStorage.getItem("role");
            /*判断搜索框是否出现*/
           /* this.isSearch=localStorage.getItem("isSearch");
            if (this.isSearch==1){
                $(".detail").css("top","6.3rem");
                $(".header").css("top","3.2rem");
            }
            else{
                $(".detail").css("top","3.2rem");
                $(".header").css("top","-10px");
            }*/
            /*给搜索框value值*/
            if ($.cookie("search") && $.cookie("search").trim() != ""){
                $(".search-input").find("input").val($.cookie("search"));
            }

            /*监控手机enter*/
            $(".header-search").on("keydown","input",function(event){
                if (event.keyCode == 13){
                    if ($(".search-input").find("input").val()!=''){
                        $.cookie("search", $(".search-input").find("input").val(), {path: "/"});
                        window.location.reload();
                    }
                }
            });

            /*tab切换*/
            var $status = $.cookie("status") ? $.cookie("status"):2;
            if($status==0){
                this.PageIndex=0;
                $(".tab-content").find("span").removeClass("active");
                $($(".tab-first").find("span")[0]).addClass("active");
                $(".draft").show();
                $(".rectification").hide();
                $(".review").hide();
                $(".complete").hide();
                this.getCount();
                this.getDraft();
            }
            else if ($status==1){
                this.PageIndex=0;
                $(".tab-content").find("span").removeClass("active");
                $($(".tab-second").find("span")[0]).addClass("active");
                $(".draft").hide();
                $(".rectification").show();
                $(".review").hide();
                $(".complete").hide();
                this.getCount();
                this.getRectification();
            }
            else if ($status==2){
                this.PageIndex=0;
                $(".tab-content").find("span").removeClass("active");
                $($(".tab-third").find("span")[0]).addClass("active");
                $(".draft").hide();
                $(".rectification").hide();
                $(".review").show();
                $(".complete").hide();
                this.getCount();
                this.getReview();
            }
            else if ($status==3){
                this.PageIndex=0;
                $(".tab-content").find("span").removeClass("active");
                $($(".tab-forth").find("span")[0]).addClass("active");
                $(".draft").hide();
                $(".rectification").hide();
                $(".review").hide();
                $(".complete").show();
                this.getCount();
                this.getComplete();
            }
        },
        /*tab切换*/
        tabChange:function(event){
            $(".tab-content").find("span").removeClass("active");
            $($(event.currentTarget).find("span")[0]).addClass("active");
            this.typeid= $(event.currentTarget).attr("typeid");
            if(this.typeid){
            	$.cookie("status", this.typeid, {path: "/"});
            	window.location.reload();
            }
        },
        /*获取待审核数量*/
        getCount:function(){
            this.typeid=2;
            var $isall = $.cookie("isall") ? $.cookie("isall"):0;
            if ($.cookie("search") && $.cookie("search") != ""){
                var params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10,
                    "isALL":$isall,
                    "searchcriteria":$.cookie("search")
                };
            }
            else{
                var params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10,
                    "isALL":$isall,
                };
            }
            this.$http.get( util.baseUrl + "PMQualityCheckApi/GetWaitCheckList",{params:params}).then(function(response){
                var result=response.data;
                if(result.Flag){
                    this.count=response.data.Content.Count;
                    $(".loading").hide()
                }else{
                    util.notification.simple(result.Msg);
                }
            }, function(response){
                errorFun(response,util);
            });
        },
        /*获取草稿列表*/
        getDraft:function(){
            $(".submit-cover").show();
            this.typeid=0;
            var $isall = $.cookie("isall") ? $.cookie("isall"):0;
            if ($.cookie("search") && $.cookie("search") != ""){
                var params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10,
                    "isALL":$isall,
                    "searchcriteria":$.cookie("search")
                };
            }
            else{
                var params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10,
                    "isALL":$isall,
                };
            }
            this.$http.get( util.baseUrl + "PMQualityCheckApi/GetDraftList",{params:params}).then(function(response){
                var result=response.data;
                if(result.Flag){
                    this.isScroll=response.data.Flag;
                    if (this.PageIndex==0){
                        this.draftLst1=response.data.Content.Index_Quality;
                        this.draftLst=response.data.Content.Index_Quality;
                        this.PageIndex ++;
                        initScroll(function(myScroll){
                            myScroll.on('scrollEnd', function() {
                                if (this.scrollerHeight + this.y - 50 < $('#wrapper').height() && (this.directionY === 0) &&QMApp.draftLst1.length != 0) {
                                    QMApp.getDraft();
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
                        this.draftLst1=response.data.Content.Index_Quality;
                        this.draftLst=this.draftLst.concat(this.draftLst1);
                        this.PageIndex ++;
                        refreshScroll();
                    }
                    $(".submit-cover").hide();
                    $(".loading").hide();
                }else{
                    util.notification.simple(result.Msg);
                    $(".submit-cover").hide();
                    $(".loading").hide();
                }
            }, function(response){
                $(".submit-cover").hide();
                $(".loading").hide();
                errorFun(response,util);
            });
        },
        /*获取整改中列表*/
        getRectification:function(){
            $(".submit-cover").show();
            this.typeid=1;
            var $isall = $.cookie("isall") ? $.cookie("isall"):0;
            if ($.cookie("search") && $.cookie("search") != ""){
                var params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10,
                    "isALL":$isall,
                    "searchcriteria":$.cookie("search")
                };
            }
            else{
                var params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10,
                    "isALL":$isall,
                };
            }
            this.$http.get( util.baseUrl + "PMQualityCheckApi/GetWaitRectifyList",{params:params}).then(function(response){
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
                    $(".submit-cover").hide();
                    $(".loading").hide();
                }else{
                    util.notification.simple(result.Msg);
                    $(".submit-cover").hide();
                    $(".loading").hide();
                }
            }, function(response){
                $(".submit-cover").hide();
                $(".loading").hide();
                errorFun(response,util);
            });
        },
        /*获取待复核列表*/
        getReview:function(){
            $(".submit-cover").show();
            this.typeid=2;
            var $isall = $.cookie("isall") ? $.cookie("isall"):0;
            if ($.cookie("search") && $.cookie("search") != ""){
                var params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10,
                    "isALL":$isall,
                    "searchcriteria":$.cookie("search")
                };
            }
            else{
                var params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10,
                    "isALL":$isall,
                };
            }
            this.$http.get( util.baseUrl + "PMQualityCheckApi/GetWaitCheckList",{params:params}).then(function(response){
                var result=response.data;
                if(result.Flag){
                    this.isScroll=response.data.Flag;
                    if (this.PageIndex==0){
                        this.reviewLst1=response.data.Content.Index_Quality;
                        this.reviewLst=response.data.Content.Index_Quality;
                        /*this.count=response.data.Content.Count;*/
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
                        /*this.count=response.data.Content.Count;*/
                        this.PageIndex ++;
                        refreshScroll();
                    }
                    $(".submit-cover").hide();
                    $(".loading").hide();
                }else{
                    util.notification.simple(result.Msg);
                    $(".submit-cover").hide();
                    $(".loading").hide();
                }
            }, function(response){
                $(".submit-cover").hide();
                $(".loading").hide();
                errorFun(response,util);
            });
        },
        /*获取已完成列表*/
        getComplete:function(){
            $(".submit-cover").show();
            this.typeid=3;
            var $isall = $.cookie("isall") ? $.cookie("isall"):0;
            if ($.cookie("search") && $.cookie("search") != ""){
                var params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10,
                    "isALL":$isall,
                    "searchcriteria":$.cookie("search")
                };
            }
            else{
                var params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10,
                    "isALL":$isall,
                };
            }
            this.$http.get( util.baseUrl + "PMQualityCheckApi/GetCompleteList",{params:params}).then(function(response){
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
                $(".submit-cover").hide();
                $(".loading").hide();
                errorFun(response,util);
            });
        },
        /*进入问题列表页面*/
        problemLst:function(event){
            var $status = $.cookie("status") ? $.cookie("status"):2;
            var $isall = $.cookie("isall") ? $.cookie("isall"):0;
            if(util._param.search){
                window.location.href="list.html?status="+$status+"&pjId="+$(event.currentTarget).attr("pjId")+"&isall="+$isall+"&search="+util._param.search;
            }
            else{
                window.location.href="list.html?status="+$status+"&pjId="+$(event.currentTarget).attr("pjId")+"&isall="+$isall;
            }
        },
        /*点击+按钮*/
        submitProblem:function(){
            window.location.href="submitQ.html";
        },
        /*搜索项目*/
        searchProject:function(){
            $(".header-left").hide();
            $(".header-middle").hide();
            $(".header-right").hide();
            $(".header-search").show();
        },
        /*点击取消搜索按钮*/
        cancelSearch:function(){
            $(".header-left").show();
            $(".header-middle").show();
            $(".header-right").show();
            $(".header-search").hide();
        },
        /*我的全部下拉收起*/
        roleChange:function(event){
            $(".role-list").find("span").css("color","#666");
            if ($(event.currentTarget).attr("typeid")==0){
                $(".role-list").slideDown();
                $(event.currentTarget).attr("typeid","1");
            }
            else{
                $(".role-list").slideUp();
                $(event.currentTarget).attr("typeid","0")
            }
            for (var i=0;i<$(".role-list").find("span").length;i++){
                if($(event.currentTarget).find("span").html()==$($(".role-list").find("span")[i]).html()){
                    $($(".role-list").find("span")[i]).css("color","#999");
                }
            }
        },
        /*选择角色*/
        selectRole:function(){
            $(event.currentTarget).parent().slideUp();
            $(event.currentTarget).parent().prev().attr("typeid","0");
            if ($(event.currentTarget).html()=="我的"){
            	$.cookie("isall", 0, {path: "/"});
            }
            else if($(event.currentTarget).html()=="全部"){
            	$.cookie("isall", 1, {path: "/"});
            }
            else if($(event.currentTarget).html()=="自检"){
                $.cookie("isall",2, {path: "/"});
            }
            window.location.reload();
        },
        /*搜索*/
        searchPj:function(){
            $.cookie("search", $(".search-input").find("input").val(), {path: "/"});
            window.location.reload();
        },
        /*删除搜索条件*/
        searchDelete:function(){
            $(".search-input").find("input").val("");
            $.cookie("search", "", {path: "/"});
            window.location.reload();
        },
        /**/
        rectificationPage:function(){
            window.location.reload();
        },
        submitPage:function(){
            var $isall = $.cookie("isall") ? $.cookie("isall"):0;
            var $status = $.cookie("status") ? $.cookie("status"):2;
            window.location.href="submitQ.html?status="+$status+"&isall="+$isall;
        },
        reportPage:function(){
            var $isall = $.cookie("isall") ? $.cookie("isall"):0;
            var $status = $.cookie("status") ? $.cookie("status"):2;
            window.location.href="sr/report.html?status="+$status+"&isall="+$isall;
        }
    }
});
