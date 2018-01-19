var QMApp = new Vue({
    el: "#QMApp",
    data: {
        PageIndex:0,
        projectLst:[],
        projectLst1:[],
		searchT:'',
		searchL:'',
        isSearch:''
    },
    created: function(){

    },
    mounted: function(){
        this.init();
    },
    beforeMount:function(){
    	conver = {"等级":null,"等级A":"A","等级B":"B","等级C":"C"};
    },
    watch: {

    },
    methods: {
        init: function(){
        	setTimeout(function(){
    			var search = JSON.parse(localStorage.getItem("search"));
    			QMApp.searchT = search[0].problemTypeCode;
    			QMApp.searchL = conver[search[1].problemLevelName];
    			QMApp.getProject();
    		},100);
            
            /*给搜索框value值*/
            if (util._param.search){
                $(".search-input").find("input").val(decodeURIComponent(util._param.search));
            }
            /*判断搜索框是否出现*/
            /*this.isSearch=localStorage.getItem("isSearch");
            if (this.isSearch==1){
                $(".detail").css("top","3.2rem");
                $(".header").css("top","0rem");
            }
            else{
                $(".detail").css("top","0rem");
                $(".header").css("top","-3.2rem");
            }*/

            /*监控手机enter*/
            $(".header-search").on("keydown","input",function(event){
                if (event.keyCode == 13){
                    if ($(".search-input").find("input").val()!=''){
                        var $input=encodeURIComponent($(".search-input").find("input").val());
                        window.location.href="projectList.html?search="+$input;
                    }
                    else {
                        window.location.href="projectList.html";
                    }
                }
            });

            /*返回*/


            /*判断设备*/
           /* var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            if(isiOS){
                $("html").css("padding-top","20px");
                $("html").css("box-sizing","border-box");
            }*/



            /*分页加载*/
            $(".detail").scroll(function(){
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(document).height()-137;
                var windowHeight = $(this).height();
                if(scrollTop + windowHeight==scrollHeight&&QMApp.draftLst1.length!=0){
                    QMApp.getProject();/*数据接口方法*/
                }
            });
        },
        /*获取数据*/
        getProject:function(){
            var params;
            if(QMApp.searchL){
            	params= {
                    "PageIndex": this.PageIndex,
                    "PageSize": 10,
                    "CompanyID": util._param.departmentId,
                    "Question_Level":QMApp.searchL,
                    "Question_Type":QMApp.searchT
                };
            }else{
            	params= {
                    "PageIndex": this.PageIndex,
                    "PageSize": 10,
                    "CompanyID": util._param.departmentId,
                    "Question_Type":QMApp.searchT
                };
            }
            this.$http.get( util.baseUrl + "PMQualityCheckApi/GetQualityProjectByCompanyManager",{params:params}).then(function(response){
                var result=response.data;
                if(result.Flag){
                    if (this.PageIndex==0){
                        this.projectLst1=response.data.Content.Index_Quality;
                        this.projectLst=response.data.Content.Index_Quality;
                        this.PageIndex ++;
                        initScroll(function(myScroll){
                            myScroll.on('scrollEnd', function() {
                                if (this.scrollerHeight + this.y - 50 < $('#wrapper').height() && (this.directionY === 1) &&QMApp.completeLst1.length != 0) {
                                    QMApp.getComplete();
                                }
                            });
                           /* myScroll.on('scrollStart',function() {
                                if(this.distY>10&&QMApp.isSearch==0){
                                    QMApp.isSearch = 1;
                                    localStorage.setItem("isSearch",1);
                                    $(".detail").css("top","3.2rem");
                                    $(".header").css("top","0rem");
                                    refreshScroll();
                                }
                            });*/
                        });
                    }
                    else{
                        this.projectLst1=response.data.Content.Index_Quality;
                        this.projectLst=this.reviewLst.concat(this.reviewLst1);
                        /*this.count=response.data.Content.Count;*/
                        this.PageIndex ++;
                        refreshScroll();
                    }
                    $(".loading").hide()
                }else{
                    util.notification.simple(result.Msg);
                }
            }, function(response){
                errorFun(response,util);
            });
        },
        /*进入问题列表页面*/
        problemLst:function(event){
            if(util._param.search){
                window.location.href="problemList.html?pjId="+$(event.currentTarget).attr("pjId")+"&departmentId="+util._param.departmentId+"&companyId="+util._param.companyId;
            }
            else{
                window.location.href="problemList.html?pjId="+$(event.currentTarget).attr("pjId")+"&departmentId="+util._param.departmentId+"&companyId="+util._param.companyId;
            }
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
        /*搜索*/
        searchPj:function(){
            if ($(".search-input").find("input").val()!=''){
                var $input=encodeURIComponent($(".search-input").find("input").val());
                window.location.href="projectList.html";
            }
            else {
                window.location.href="projectList.html";
            }
        },
        /*删除搜索条件*/
        searchDelete:function(){
            $(".search-input").find("input").val("");
            window.location.href="projectList.html";
        },
        /*返回*/
        returnBack:function(){
            window.location.href="reportDetail.html?companyId="+util._param.companyId;
        }
    }
});