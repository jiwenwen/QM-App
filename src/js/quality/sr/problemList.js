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
		searchT:'',
		searchL:''
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
    			QMApp.getProblem();
    		},100);
                

            /*分页加载*/
            $(".detail").scroll(function(){
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(".detail-content").height()-20;
                var windowHeight = $(this).height();
                if(scrollTop + windowHeight>=scrollHeight&&QMApp.problemLst1.length!=0&&QMApp.scroll==true){
                    QMApp.scroll=false;
                    QMApp.getProblem();
                }
            });
            /*判断设备*/
            /*var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            if(isiOS){
                $("html").css("padding-top","20px");
                $("html").css("box-sizing","border-box");
            }*/


        },
        /*获取问题列表*/
        getProblem:function(){
            /*if (util._param.status==0){
                $(".header-middle").find("span").html("草稿")
            }*/
            var params;
            if(QMApp.searchL){
            	params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10,
                    "ProjectId":util._param.pjId,
                    "Question_Level":QMApp.searchL,
                    "Question_Type":QMApp.searchT
                };
            }else{
            	params={
                    "PageIndex":this.PageIndex,
                    "PageSize":10,
                    "ProjectId":util._param.pjId,
                    "Question_Type":QMApp.searchT
                };
            }
            this.$http.get( util.baseUrl + "PMQualityCheckApi/GetQualityDetailReportList",{params:params}).then(function(response){
                var result=response.data;
                $(".loading").hide();
                if(result.Flag){
                    if (this.PageIndex==0){
                        this.problemLst1=response.data.Content;
                        this.problemLst=response.data.Content;
                        this.pjName=response.data.Project_Name;
                        this.PageIndex ++;
                    }
                    else{
                        this.problemLst1=response.data.Content;
                        this.problemLst=this.problemLst.concat(this.problemLst1);
                        this.PageIndex ++;
                    }
                    $(".loading").hide();
                    this.scroll=true;
                }else{
                    util.notification.simple(result.Msg);
                }

            }, function(response){
            	errorFun(response,util);
            });
        },
        /*返回按钮*/
        returnPreview:function(){
            if (util._param.search){
                window.location.href="projectList.html?search="+util._param.search+"&departmentId="+util._param.departmentId+"&pjId="+util._param.pjId+"&companyId="+util._param.companyId;
            }
            else
            {
                window.location.href="projectList.html?departmentId="+util._param.departmentId+"&pjId="+util._param.pjId+"&companyId="+util._param.companyId;
            }
        },
        /*点击列表进入详情*/
        reviewDetail:function(event){
            if (util._param.search){
                window.location.href="reviewList.html?type="+$(event.currentTarget).attr("type")+"&listId="+$(event.currentTarget).attr("listId")+"&pjId="+util._param.pjId+"&checkId="+$(event.currentTarget).attr("checkId")+"&search="+util._param.search+"&state="+$(event.currentTarget).attr("state")+"&companyId="+util._param.companyId+"&departmentId="+util._param.departmentId;
            }
            else {
                window.location.href="reviewList.html?type="+$(event.currentTarget).attr("type")+"&listId="+$(event.currentTarget).attr("listId")+"&pjId="+util._param.pjId+"&checkId="+$(event.currentTarget).attr("checkId")+"&status="+$(event.currentTarget).attr("state")+"&companyId="+util._param.companyId+"&departmentId="+util._param.departmentId;
            }
        }
    }
});

