(function () {
	function frameCtrl() {
        if( !$.trim( $('#footer').html() ) ) {
            $('#footer').rogerReloadFile('./footer.html');
        }
        if( !$.trim( $('#modal').html() ) ) {
            $('#modal').rogerReloadFile('./fragment/dialog-login.html');
        }
        if($.rogerIsLogined()) {
            $('#userlogin').html('').append('<span class="btn btn-link btn-xs register" id="usrlogout">注销</span>');
            $('#usrlogout').click(function () {
                $.rogerLogout();
                $.rogerRefresh();
            });
            $.rogerHideLogin();
        }else {
            $('#userlogin').html('').append('<span class="btn btn-link btn-xs register" id="usrlogin" data-toggle="modal" data-target="#homeLogin">登录</span>');
            $('#usrlogin').click(function () {
                $.rogerLogin('#homeLogin', '/login'/*, '/dashboard.html'*/);
                //$.rogerShowLogin();
            })
        }
        $(".navBar a").on("click", function(){
            $(".navBar").find(".active").removeClass("active");
            $(this).parent().addClass("active");
        });
        $('#usercenter').rogerOnceClick2(null, function () {
            var user = $.rogerGetLoginUser();
            if(!user) {
                $.rogerLogin('#homeLogin', '/login');
                $.rogerShowLogin();
                return;
            }
            $.rogerLocation('#/orderlist?userID='+user.UserID+'&usertype=1&status=0&page=1');
        });
    }

    var initHomeList = function (param) {
        param[0].IMGHOST = "http://123.59.144.47/";
        return param;
    };
    var ctrlHomeList = function(response, realView) {
        realView.rogerCropImages();
    };
	
	var ctrlHome = function(response, realView) {
        var usr = $.rogerGetLoginUser();
        if(usr){
            $('#kefu').attr('href','talk?uid='+usr.UserID+'&uname='+usr.UserName+'&picurl='+$.rogerImgHost()+usr.AvatarPicURL+'&tid=10000005');
        }else {
            $('#kefu').attr('href','javascript:void(0)');
        }

		$('#carousel-generic').carousel();
        $('#homeSearch').rogerOnceClick(null, function () {
            var k = $('#homeSearchKey').val();
            $.rogerLocation('#/search?key=%'+k+'%&begin=0&end=1000&label=%');
        });

        var item = $.tmplItem($('.textCon'));
    
        $('.nav-buttons .theme,.nav-buttons .country,.continent-tips').on('click','li',function(){
          var changeData,desE;
          var text = $(this).text();
          
          if($(this).parent().hasClass('theme')){
            $(this).parent().parent().next().find('.label-self').text(text);
            changeData = item.data.PlansByLabel[text].__values;
            desE = $(this).parent().parent().parent().next().attr('id');
          }else if($(this).parent().hasClass('country')){
            $(this).parent().prev().text(text);
            changeData = item.data.PlansByCountry[text].__values;
            desE = $(this).parent().parent().parent().next().attr('id');
          }else if($(this).parent().hasClass('continent-tips')){
            changeData = item.data.PlansByCountry[text].__values;
            desE = $(this).parent().next().attr('id');
          }
          desE = '#' + desE;
          $.rogerTrigger(desE, '#/homelist', changeData);
        });
        
        //推荐区跑马灯效果
        var marqueeE = document.getElementById("solution"); 
        var marqueeE1 = document.getElementById("RunTopic");
        var speed=200;    //数值越大滚动速度越慢 
        function Marquee(){ 
            if(marqueeE1.offsetWidth<=marqueeE.scrollLeft+1200){               
                marqueeE.scrollLeft=0
            }
            else{ 
                marqueeE.scrollLeft+=2;    
            } 
        }  
        var MyMar = setInterval(Marquee,speed); 
        marqueeE.onmouseover = function(){clearInterval(MyMar)} 
        marqueeE.onmouseout = function(){MyMar = setInterval(Marquee,speed)}

        //跑马灯效果结束
        //左边栏工具条
        var $btn=$(".fixedPos");
        checkScrollT($(window).height());
        $("#backTop").bind('click',moveTop);
        $(window).on('scroll',function(){
            checkScrollT($(window).height());
        });
        function moveTop(){
            $("body,html").animate({scrollTop:0},200);
        }
        function checkScrollT (pos) {
            if($(window).scrollTop()>pos){
                $btn.fadeIn();
            }else{
                $btn.fadeOut();
            }
        } 
        // 左边栏工具条结束
		realView.rogerCropImages();
        frameCtrl();
    };
    var ctrlHomeSearchList = function(response, realView) {
        realView.rogerCropImages();
        frameCtrl();
    }
    var ctrlHomeSearch = function(response, realView) {

        $('#homeSearch').rogerOnceClick(null, function () {
            var k = $('#keySearch').val();
            $.rogerTrigger('#homesearchlist', '#/homesearchlist', {key:'%'+k+'%',begin:0,end:1000,label:'%'});
        });

        function filterUnlimit(elem){
            if(elem.html()=='不限'){
                return '%';
            }
            return '%'+elem.html()+'%';
        }

        $("#label div").on("click", function(){
            var label = $("#label").find(".btn.btn-warning");
            var country = $("#country").find(".btn.btn-warning");
            var days = $("#days").find(".btn.btn-warning");
            var a = filterUnlimit($(this));
            var b = filterUnlimit(country);
            var c = filterUnlimit(days);
            var c =c.match(/\d/g);
            c = !c ? [0,1000] : c;
            $(this).addClass("btn btn-warning");
            $.rogerTrigger('#homesearchlist', '#/homesearchlist', {key:b,begin:c[0],end:c[1],label:a});
            label.removeClass("btn btn-warning");
        });
        $("#country div").on("click", function(){
            var label = $("#label").find(".btn.btn-warning");
            var country = $("#country").find(".btn.btn-warning");
            var days = $("#days").find(".btn.btn-warning");
            var a = filterUnlimit(label);
            var b = filterUnlimit($(this));
            var c = filterUnlimit(days);
            var c =c.match(/\d/g);
            c = !c ? [0,1000] : c;
            $(this).addClass("btn btn-warning");
            $.rogerTrigger('#homesearchlist', '#/homesearchlist', {key:b,begin:c[0],end:c[1],label:a});
            country.removeClass("btn btn-warning");
        });
        $("#days div").on("click", function(){
            var label = $("#label").find(".btn.btn-warning");
            var country = $("#country").find(".btn.btn-warning");
            var days = $("#days").find(".btn.btn-warning");
            var a = filterUnlimit(label);
            var b = filterUnlimit(country);
            var c = filterUnlimit($(this));
            var c =c.match(/\d/g);
            c = !c ? [0,1000] : c;
            $(this).addClass("btn btn-warning");
            $.rogerTrigger('#homesearchlist', '#/homesearchlist', {key:b,begin:c[0],end:c[1],label:a});
            days.removeClass("btn btn-warning");
        });
        $('#buyNow').on('click',function () {
            var usr = $.rogerGetLoginUser();
            if(!usr) {
                $.rogerLogin('#homeLogin', '/login');
                $.rogerShowLogin();
                return;
            }
            $.rogerLocation($(this).attr('data-href'));
        });

        realView.rogerCropImages();
        frameCtrl();
    };

	var initComment = function(params) {
		return {
			Comment:{
				PlanID: params.PlanID,
				Comment: '',
				Picture:{Pics:[]}
			}
		};
	};
	var ctrlComment = function(Comment, realView) {
        frameCtrl();
		$('.commit').rogerOnceClick(Comment, function(e){
			var user = $.rogerGetLoginUser()
			if(!user) {
                $.rogerLogin('#homeLogin', '/login');
				$.rogerShowLogin();
				return;
			}
			var usr =$.rogerGetLoginUser();;
			var data = e.data;
            data.Comment.UserID = usr.UserID;
			//console.log(usr);
			$.rogerPost('/comment/plan', data, function(respJSON){
				$.rogerRefresh();
			});
		});
	};
    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };
	var ctrlPlandetail = function(response, realView) {
        $('#carousel-generic').carousel();

        var disday = [];
        if(response.PlanCalender.length > 0 && response.PlanCalender[0].Calender) {
            var arr = response.PlanCalender[0].Calender.split(',');
            arr = arr.filter( function( item, index, inputArray ) {
                return inputArray.indexOf(item) == index;
            });
            for(var i in arr) {
                var a = arr[i].split(';');
                if(a.length == 2) {
                    disday.push({from: a[0], to: a[1]})
                }
            }
        }
        var pickr = $("#calendar").flatpickr({
            inline: true,
            "mode": "multiple",
            disable: disday
		});

		realView.rogerCropImages();
        // frameCtrl();

        if( response.PlanInfo[0].Policy ){
            $('#policy').html(response.PlanInfo[0].Policy.replace(/\r\n/g, '<br>'));
        }
		$.rogerTrigger('#plan-comment','#/comment',{PlanID:response.PlanInfo[0].PlanID});

        //$('#TALK').rogerOnceClick(null,function () {
            //$('#TALK').each(function () {
            $('#TALK').rogerOnceClick(response.PlanInfo[0].PlanID, function (e) {
                var data = e.data;
                var usr = $.rogerGetLoginUser();
                if(!usr) {
                    $.rogerLogin('#homeLogin', '/login');
                    $.rogerShowLogin();
                    return;
                }
                var newWin = window.open('about:blank');
                newWin.location.href = 'http://'+window.location.host
                    +'/talk?uid='+usr.UserID+'&uname='+usr.UserName+'&picurl='+$.rogerImgHost()+usr.AvatarPicURL+'&tid='+response.PlanInfo[0].UserID+'&msg=D'+data;
            });
        //});
		
		/*$('#BUY').rogerOnceClick(response.PlanInfo[0].PlanID, function (e) {
			$.rogerPost('/pay',{PlanID:e.data}, function (respJSON) {
				console.log(respJSON);
                window.open(respJSON.url, '_blank');
            })
        })*/
        $('#customize').on('click',function () {
            var usr = $.rogerGetLoginUser();
            if(!usr) {
                $.rogerLogin('#homeLogin', '/login');
                $.rogerShowLogin();
                return;
            }
            $.rogerLocation($(this).attr('data-href'));
        });

        $('#buyNow').on('click',function () {
            var usr = $.rogerGetLoginUser();
            if(!usr) {
                $.rogerLogin('#homeLogin', '/login');
                $.rogerShowLogin();
                return;
            }
            $.rogerLocation($(this).attr('data-href'));
        });

	};
    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };
    function checkDayInDisable(day, len, disable) {
        var begin = new Date(day);
        var end = addDays(day, len-1);
        for(var i in disable) {
            var start = new Date(disable[i].from);
            var close = new Date(disable[i].to);
            if((begin >= start && end <= close) || (begin >= start && begin <= close) || (end >= start && end <= close)){
                return true;
            }
        }
        return false;
    };
    var ctrlPlanpay1 = function(response, realView) {
    	var days = parseInt(response.PlanInfo[0].PlanDays);
        var dates = [];
        var disday = [];
        if(response.PlanCalender.length > 0 && response.PlanCalender[0].Calender) {
            var arr = response.PlanCalender[0].Calender.split(',');
            arr = arr.filter( function( item, index, inputArray ) {
                return inputArray.indexOf(item) == index;
            });
            for(var i in arr) {
                var a = arr[i].split(';');
                if(a.length == 2) {
                    disday.push({from: a[0], to: a[1]});
                }
            }
        }
        var pickr = $("#calendar").flatpickr({
            inline: true,
            disable: disday,
            onChange:function (dateObj, dateStr) {
                if(checkDayInDisable(dateStr, days, disday)) {
                    pickr.selectedDates.splice(0,pickr.selectedDates.length);
                    pickr.redraw();
                    return;
                }
            	for(var i = 1 ; i < days ; i++) {
                    pickr.selectedDates.push(addDays(dateStr, i));
				}
                pickr.redraw();
            	for(var i  in pickr.selectedDates) {
            	    var d = pickr.selectedDates[i]
            	    dates[i] =  d.getUTCFullYear() +'-'+(d.getUTCMonth() + 1)+'-'+ d.getUTCDate();
                }
            }
        });
        //pickr.selectedDates.push('');
        realView.rogerCropImages();
        frameCtrl();

        var adult = parseInt($('#adult option:selected').val());
        var kid = parseInt($('#kid option:selected').val());
        var adultprice = parseFloat(response.PlanInfo[0].AdultPrice);
        var kidprice = parseFloat(response.PlanInfo[0].KidPrice);
        var cash = adult*adultprice+kid*kidprice;
        $('.price').each(function () {
			$(this).html(''+cash);
        })

        var ev = $._data($('#adult'), 'events');
        if(!ev || !ev.change) {
            $('#adult').on("change", function () {
                adult = parseInt($('#adult option:selected').val());
                $('.price').each(function () {
                    cash = adult*adultprice+kid*kidprice
                    $(this).html(''+cash);
                })
            });
        }
        var ev = $._data($('#kid'), 'events');
        if(!ev || !ev.change) {
            $('#kid').on("change", function () {
                kid = parseInt($('#kid option:selected').val());
                $('.price').each(function () {
                    cash = adult*adultprice+kid*kidprice
                    $(this).html(''+cash);
                })
            });
        }
        if( response.PlanInfo[0].Policy ){
            $('#policy').html(response.PlanInfo[0].Policy.replace(/\r\n/g, '<br>'));
        }

        $('#BUY').rogerOnceClick(null,function (e) {
            var usr = $.rogerGetLoginUser();
            if(!usr) {
                $.rogerLogin('#homeLogin', '/login');
            	$.rogerShowLogin();
            	return;
			}
        	var buy = {visitid:usr.UserID,
                servicetripid:response.PlanInfo[0].PlanID,
				servicetripname:response.PlanInfo[0].PlanName,
                servicetriptypeid:response.PlanInfo[0].PlanType,
                username:usr.UserName,
                guideid:response.PlanInfo[0].UserID,
                costmoney: cash,
                realcostmoney: cash,
                traveldays: response.PlanInfo[0].PlanDays,
                remarks: $('#note').val(),
                countryid:response.PlanInfo[0].CountryID,
                cityid:response.PlanInfo[0].StartCityID,
                ordertype:2,
                orderdetails: [{
                    schedules: dates,
                    personnum: adult,
                    adultNum: adult,
                    kidNum: kid,
                    fullname: $('#username').val(),
                    mobilephone: $('#phone').val(),
                    email: $('#mail').val()
                }]
			};
            
            $('#app').rogerReloadFile('./plandetail-pay-2.html', function (realView) {
                var price = realView.find('#totalprice');
                price.html(''+cash);

                var ok = realView.find('#OK');
                ok.rogerOnceClick(null,function () {
                     var newWin = window.open('about:blank');
                    $.rogerPost('/pay',buy, function (respJSON) {

                        if( respJSON.ERR) {
                            $.rogerNotice({Message:'生成订单有错,错误码:'+respJSON.ERR});
                            newWin.close();
                        }else {
                            newWin.location.href = respJSON.url;
                            //window.open(respJSON.url, '_blank');
                            /*var parms = $.rogerGetJsonUrlParams(respJSON.url);
                            for(var i in parms) {
                                $('<input>').attr({
                                    type: 'hidden',
                                    name: i,
                                    value: parms[i]
                                }).appendTo('#Alipay');
                            }
                            $('#Alipay').attr('action', parms.link);
                            $('#Alipay').submit();*/
                        }
                    })
                })
            });
        })
    };

    var ctrlOrderlist = function (response, realView) {
        var usr = $.rogerGetLoginUser();
        var Avatar = $.rogerImgHost() + usr.AvatarPicURL;
        $('.avatar img').attr('src', Avatar);

        $('#personInfo').rogerOnceClick( null, function () {
            $.rogerLocation('#/userinfo?UserID='+usr.UserID);
        });
        $('#orderList').rogerOnceClick( null, function () {
            $.rogerLocation('#/orderlist?userID='+usr.UserID+'&usertype=1&status=0&page=1');
        });

        $('#confirm').rogerOnceClick(null, function () {
            var orderid = $('#confirm').data('id');
            var status = $('#confirm').data('status');
            var user = $.rogerGetLoginUser();
            if ('1' == status) {
                var newWin = window.open('about:blank');
                $.rogerPost('/pay', buy, function (respJSON) {
                    if (respJSON.ERR) {
                        $.rogerNotice({Message: '生成订单有错,错误码:' + respJSON.ERR});
                        newWin.close();
                    } else {
                        newWin.location.href = respJSON.url;
                    }
                })
            }
            if ('4' == status) {

                $.rogerPost('http://123.59.144.44/travel/order/confirmFinish', {
                    orderID: orderid,
                }, function () {
                    $.rogerRefresh();
                });
            }
        });
        frameCtrl();
        realView.rogerCropImages();
    };

    var ctrlOrderdetail = function(response, realView) {

        // console.log(JSON.stringify(response));
        realView.rogerCropImages();
        frameCtrl();

        $('#complain-commit').rogerOnceClick(null, function () {
            var Reason = $('#Reason').val();
            var ApplyRefund = $('#ApplyRefund').val();
            var RefundDec = $('#RefundDec').val();
            var OrderID = response.OrderDetail[0].OrderID

            var user = $.rogerGetLoginUser();
            complaintdetail = {"Reason":Reason,"ApplyRefund":ApplyRefund,"UserID":user.UserID,"OrderID":OrderID};
            $.rogerPost('/new/ordercomplaint', complaintdetail, function (respJSON) {
                if (respJSON.ERR) {
                    $.rogerNotice({Message: '投诉提交失败:' + respJSON.ERR});
                } else {
                    window.location.reload();
                }
            });

        });
    };

    var ctrlPlanSearch = function(response, realView) {
        realView.rogerCropImages();
        frameCtrl();
    };

    var initCityChooser2 = function (PS) {
        return {
            User:PS.User
        };
    };
    var initUserInfo = function (param) {
        var usr = $.rogerGetLoginUser();
        return {
            User: [{
                CityName:'',
                CountryName:'',
                CityID:usr.CityID,
                CountryID:usr.CountryID,
                Labels:usr.Labels.split(','),
                Sex:usr.Sex,
                TrueName:usr.TrueName,
                UserID:usr.UserID,
                UserName:usr.UserName,
                ComLogo:usr.ComLogo,
                ComAdv:usr.ComAdv,
                AvatarPicURL:usr.AvatarPicURL
            }],
            IMGHOST:$.rogerImgHost()
        };
    };
    var ctrlCityChooser2 = function (PS, realView) {
        $('#cityChooser').modal('show');
        $('#cityChooserOK').rogerOnceClick(PS,function (e) {
            var data = e.data.User;
            var country = $('#country option:selected').val().split(':');
            var city = $('#city option:selected').val().split(':');
            data.User[0].CityID = city[0];
            data.User[0].CityName = city[1];
            data.User[0].CountryID = country[0];
            data.User[0].CountryName = country[1];
            $('#cityChooser').modal('hide');
            $.rogerRefresh(data);
        });
    };
    var ctrlUserInfo = function(response, realView) {
        var usr = $.rogerGetLoginUser();
        console.log(usr,usr.Labels.split(','));
        result = {
            User: [{
                CityName:'',
                CountryName:'',
                CityID:usr.CityID,
                CountryID:usr.CountryID,
                Labels:usr.Labels.split(','),
                Sex:usr.Sex,
                TrueName:usr.TrueName,
                UserID:usr.UserID,
                UserName:usr.UserName,
                ComLogo:usr.ComLogo,
                ComAdv:usr.ComAdv,
                AvatarPicURL:usr.AvatarPicURL
            }],
            IMGHOST:$.rogerImgHost()
        };

        response.createCity = function (result, Spot) {
            $.rogerTrigger('#modal', '#/citychooser2', {User:result});
        };

        $('#userUpdate').rogerOnceClick(response, function (e) {
            var data = e.data.User;
            console.log(e.data.User);
            //data.Labels = data.Labels.join();
            $.rogerPost('/user/update', data, function (respJSON) {
                $.rogerNotice({Message: '个人信息修改成功'});
            });
        });

        response.createLabel = function (User) {
            User.User[0].Labels.push('');
            $.rogerRefresh(User);
        };

        realView.rogerCropImages();
        frameCtrl();
    };

    //-------------------------------plan customize begin---------------------------------
    var initCityChooser = function (PS) {
        return {
            UserData:0,
            Spot:PS.Spot,
            Plan:PS.Plan
        };
    };
    var initSpotChooser = function (PS) {
        return {
            Type:PS.Type,
            Spot:PS.Spot,
            Plan:PS.Plan,
            TypeCn:PS.TypeCn,
            SpotItem:PS.SpotItem,
            Replace:PS.Replace
        };
    };
    var initAirportChooser = function (PS) {
        return {
            Spot:PS.Spot,
            Plan:PS.Plan,
            SpotItem:PS.SpotItem,
            Replace:PS.Replace
        };
    };
    function getItemWithStartCityID(Spot) {
        for(var i in Spot) {
            if(Spot[i].CityID > 0 && Spot[i].ScheduleType == 0){
                return Spot[i];
            }
        }
        return null;
    };
    function getSpotBySpotItem(PlanSchedule, SpotItem) {
        for(var i = 0 ; i < PlanSchedule.length ; i ++ ){
            var ps = PlanSchedule[i];
            for ( var j = 0; j < ps.Spot.length ; j ++ ) {
                if(ps.Spot[j] === SpotItem) {
                    return ps.Spot;
                }
            }
        }
        return null;
    };

    var ctrlCityChooser = function (PS, realView) {
        $('#cityChooser').modal('show');
        $('#cityChooserOK').rogerOnceClick(PS,function (e) {
            var data = e.data;
            var country = $('#country option:selected').val().split(':');
            var city = $('#city option:selected').val().split(':');
            data.Spot.push({CountryID:country[0],CountryNameCn:country[1],CountryNameEn:country[2],CityID:city[0],CityNameCn:city[1],CityNameEn:city[2],AirportCode:'',AirportNameCn:'',AirportNameEn:'',
                SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:0,SpotPicUrl:''});
            $('#cityChooser').modal('hide');
            $.rogerRefresh(data.Plan);
        });
    };
    var ctrlSpotChooser = function (PS, realView) {
        $('#spotChooser').modal('show');
        $('#spotlist').html('').append('<li class="list-group-item">'+PS.TypeCn+'</li>');
        $('#city').change(PS, function (e) {
            var data = e.data;
            var city = $('#city option:selected').val().split(':');
            if(city && city[0]) {
                $('#spotlist').rogerDialogTrigger('fragment/dialog-spotlist.html', '/dialog/'+PS.Type, {CityID:city[0]}, function (data, realView) {
                    //console.log('spot');
                    $("#spotlist .list-group-item").click(function(e) {
                        $("#spotlist .list-group-item").removeClass("active");
                        $(this).addClass("active");
                    });
                });
            }
        });
        var item = getItemWithStartCityID(getSpotBySpotItem(PS.Plan.PlanInfo.PlanSchedule, PS.SpotItem));
        if(item && item.CityID > 0) {
            setCountryCity(item.CountryNameCn, item.CityID);
            $('#spotlist').rogerDialogTrigger('fragment/dialog-spotlist.html', '/dialog/'+PS.Type, {CityID:item.CityID}, function (data, realView) {
                //console.log('spot');
                realView.rogerCropImages();
                $("#spotlist .list-group-item").click(function(e) {
                    $("#spotlist .list-group-item").removeClass("active");
                    $(this).addClass("active");
                });
            });
        }
        $('#spotChooserOK').rogerOnceClick(PS,function (e) {
            var data = e.data;
            var country = $('#country option:selected').val().split(':');
            var city = $('#city option:selected').val().split(':');
            var spot = $('#spotlist  .list-group-item.active').data('info').split(':');
            //${SpotsID}:${NameCh}:${NameEn}:${PicURL}:${Rank}:${TravelTime}:${SpotsTypeID}
            if(data.Replace) {
                ok:
                    for(var i = 0 ; i < data.Plan.PlanInfo.PlanSchedule.length ; i ++ ){
                        var ps = data.Plan.PlanInfo.PlanSchedule[i];
                        for ( var j = 0; j < ps.Spot.length ; j ++ ) {
                            if(ps.Spot[j] === data.SpotItem) {
                                ps.Spot[j]= {CountryID:country[0],CountryNameCn:country[1],CountryNameEn:country[2],CityID:city[0],CityNameCn:city[1],CityNameEn:city[2],AirportCode:'',AirportNameCn:'',AirportNameEn:'',
                                    SpotID:spot[0],SpotName:spot[1],SpotLocalName:spot[2],SpotTravelTime:spot[5],HotelStarLevel:spot[4],ScheduleType:parseInt(spot[6])+1,SpotPicUrl:spot[3]};
                                break ok;
                            }
                        }
                    }
            }else {
                data.Spot.push({CountryID:country[0],CountryNameCn:country[1],CountryNameEn:country[2],CityID:city[0],CityNameCn:city[1],CityNameEn:city[2],AirportCode:'',AirportNameCn:'',AirportNameEn:'',
                    SpotID:spot[0],SpotName:spot[1],SpotLocalName:spot[2],SpotTravelTime:spot[5],HotelStarLevel:spot[4],ScheduleType:parseInt(spot[6])+1,SpotPicUrl:spot[3]});
            }
            $('#cityChooser').modal('hide');
            $.rogerRefresh(data.Plan);
        });
    };
    var ctrlAirportChooser = function (PS, realView) {
        $('#airportChooser').modal('show');
        $('#airportlist').html('').append('<li class="list-group-item">机场</li>');
        $('#airportlist').rogerDialogTrigger('fragment/dialog-airportlist.html', '/dialog/airport', {}, function (data, realView) {
            $('#searchlist').btsListFilter('#searchinput', {itemChild: '.list-group-item-text',initial:false});
            $("#airportlist .list-group-item").click(function(e) {
                $("#airportlist .list-group-item").removeClass("active");
                $(this).addClass("active");
            });
        });
        $('#airportChooserOK').rogerOnceClick(PS,function (e) {
            var data = e.data;
            var airport = $('#airportlist  .list-group-item.active').data('info').split(':');
            //${AirPortCode}:${NameCh}:${NameEn}
            if(data.Replace) {
                ok:
                    for(var i = 0 ; i < data.Plan.PlanInfo.PlanSchedule.length ; i ++ ){
                        var ps = data.Plan.PlanInfo.PlanSchedule[i];
                        for ( var j = 0; j < ps.Spot.length ; j ++ ) {
                            if(ps.Spot[j] === data.SpotItem) {
                                ps.Spot[j]= {CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:airport[0],AirportNameCn:airport[1],AirportNameEn:airport[2],
                                    SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:1,SpotPicUrl:''}
                                break ok;
                            }
                        }
                    }
            }else {
                if(data.Plan.Airports){
                    data.Plan.Airports.AirportCode = airport[0];
                    data.Plan.Airports.NameCh = airport[1];
                    data.Plan.Airports.NameEn = airport[2];
                }else{
                    data.Spot.push({CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:airport[0],AirportNameCn:airport[1],AirportNameEn:airport[2],
                        SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:1,SpotPicUrl:''});
                }
            }
            $('#cityChooser').modal('hide');
            $.rogerRefresh(data.Plan);
        });
    };
    var ctrlTemplateplanNew = function(Plan, realView) {
        $('img[name="needPrefix"]').each(function () {
            var src = $(this).attr('src');
            if(src.indexOf('group1') > -1) {
                $(this).attr('src',Plan.IMGHOST+src);
            }
        })
        var usr = $.rogerGetLoginUser();
        if(Plan.PlanInfo.PlanName.indexOf("的私人定制方案")<0) {
            Plan.PlanInfo.PlanName = usr.UserName+"的私人定制方案"+Plan.PlanInfo.PlanName;
        }
        $('#PlanTitle').attr('value', Plan.PlanInfo.PlanName);
        Plan.createDay = function(Plan, PlanSchedule){  //  PlanSchedule ==> data-pointer="/PlanInfo/PlanSchedule/-"
            PlanSchedule.push({
                Spot:[{CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:1,SpotPicUrl:''},
                    {CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:1,SpotPicUrl:''},
                    {CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:2,SpotPicUrl:''},
                    {CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:3,SpotPicUrl:''},
                    {CountryID:'',CountryNameCn:'',CountryNameEn:'',CityID:'',CityNameCn:'',CityNameEn:'',AirportCode:'',AirportNameCn:'',AirportNameEn:'',SpotID:'',SpotName:'',SpotLocalName:'',SpotTravelTime:'',HotelStarLevel:'',ScheduleType:4,SpotPicUrl:''},
                ],
                TravelInstruction:'',
                DayName:''
            });
            Plan.PlanInfo.PlanDays ++;
            $.rogerRefresh(Plan);
        };

        Plan.createCity = function (Plan, Spot) {
            $.rogerTrigger('#modal', '#/citychooser', {Plan:Plan, Spot:Spot});
        };
        Plan.createAttraction = function (Plan, Spot) {
            $.rogerTrigger('#modal', '#/spotchooser', {Plan:Plan, Spot:Spot, Type:'attraction', TypeCn:'景点'});
        };
        Plan.createDelicacy = function (Plan, Spot) {
            $.rogerTrigger('#modal', '#/spotchooser', {Plan:Plan, Spot:Spot, Type:'delicacy', TypeCn:'美食'});
        };
        Plan.createAccommodation = function (Plan, Spot) {
            $.rogerTrigger('#modal', '#/spotchooser', {Plan:Plan, Spot:Spot, Type:'accommodation',TypeCn:'酒店'});
        };
        Plan.changeAttraction = function (Plan, SpotItem) {
            $.rogerTrigger('#modal', '#/spotchooser', {Plan:Plan,   Type:'attraction', TypeCn:'景点', SpotItem:SpotItem,Replace:true});
        };
        Plan.changeDelicacy = function (Plan, SpotItem) {
            $.rogerTrigger('#modal', '#/spotchooser', {Plan:Plan,   Type:'delicacy', TypeCn:'美食', SpotItem:SpotItem,Replace:true});
        };
        Plan.changeAccommodation = function (Plan, SpotItem) {
            $.rogerTrigger('#modal', '#/spotchooser', {Plan:Plan,   Type:'accommodation', TypeCn:'酒店',SpotItem:SpotItem,Replace:true});
        };
        Plan.createAirport = function (Plan, Spot) {
            $.rogerTrigger('#modal', '#/airportchooser', {Plan:Plan, Spot:Spot});
        };
        Plan.changeAirport = function (Plan, SpotItem) {
            $.rogerTrigger('#modal', '#/airportchooser', {Plan:Plan, SpotItem:SpotItem, Replace: true});
        };

        $('#save').rogerOnceClick(Plan, function(e){
            var data = e.data;
            var item = getItemWithStartCityID(data.PlanInfo.PlanSchedule[0].Spot);
            if(item && item.CityID > 0) {
                var data = {PlanInfo: e.data.PlanInfo};
                data.PlanInfo.StartCityID = item.CityID;
                data.PlanInfo.Summary._PlanLabels = data.PlanInfo.Summary.PlanLabels.join();
                var usr = $.rogerGetLoginUser();
                if(data.PlanInfo.CreateUserID == usr.UserID) {
                    $.rogerPost('/delete/plan', {PlanID: data.PlanInfo.PlanID}, function (respJSON) {
                        data.PlanInfo.CreateUserID = usr.UserID;
                        $.rogerPost('/new/tmpplan/visitor', data, function (respJSON) {
                            if(respJSON.PlanInfo.insertId > 0 ) {
                                data.PlanInfo.PlanID = respJSON.PlanInfo.insertId;
                                $.rogerNotice({Message: '定制方案保存成功'});
                                $('#show').removeClass("btn btn-warning invisible");
                                $('#show').addClass("btn btn-warning");
                                $('#show').attr('href','#/templateplandetail?version=2&PlanID='+respJSON.PlanInfo.insertId );
                            }
                        });
                    });
                }else {
                    data.PlanInfo.CreateUserID = usr.UserID;
                    $.rogerPost('/new/tmpplan/visitor', data, function (respJSON) {
                        if(respJSON.PlanInfo.insertId > 0 ) {
                            data.PlanInfo.PlanID = respJSON.PlanInfo.insertId;
                            $.rogerNotice({Message: '定制方案保存成功'});
                            $('#show').removeClass("btn btn-warning invisible");
                            $('#show').addClass("btn btn-warning");
                            $('#show').attr('href','#/templateplandetail?version=2&PlanID='+respJSON.PlanInfo.insertId );
                        }
                    });
                }
            }else {
                $.rogerNotice({Message: '请选择起始城市'});
            }
        });

        frameCtrl();
        realView.rogerCropImages();
    };
    var initGuideChooser = function (PS) {
        return {
            Plan:PS.Plan,
        };
    };
    var ctrlGuideChooser = function (PS, realView) {
        $('#guideChooser').modal('show');
        $('#guidelist').html('').append('<li class="list-group-item">导游</li>');
        $('#guidelist').rogerDialogTrigger('fragment/dialog-guidelist.html', '/dialog/guide', {}, function (data, realView) {
            realView.rogerCropImages();
            $("#guidelist .list-group-item").click(function(e) {
                $("#guidelist .list-group-item").removeClass("active");
                $(this).addClass("active");
            });
        });
        $('#guideChooserOK').rogerOnceClick(PS,function (e) {
            var PS = e.data;
            var guide = $('#searchlist  .list-group-item.active').data('info').split(':');
            if(guide[0] > 0) {
                PS.Plan.PlanInfo.PlanID = 0;
                var data = {PlanInfo: PS.Plan.PlanInfo};
                var usr = $.rogerGetLoginUser();
                PS.Plan.PlanInfo.CreateUserID = guide[0];
                $.rogerPost('/new/tmpplan/visitor', data, function (respJSON) {
                    var usr = $.rogerGetLoginUser();
                    var newWin = window.open('about:blank');
                    newWin.location.href = 'http://'+window.location.host
                        +'/talk?uid='+usr.UserID+'&uname='+usr.UserName+'&picurl='+$.rogerImgHost()+usr.AvatarPicURL+'&tid='+guide[0]
                        +'&msg='+respJSON.PlanInfo.insertId;
                    $('#guideChooser').modal('hide');
                });
            }
        });
    };
    var ctrlTemplateplanDetail = function(Plan, realView) {

        $('#send').rogerOnceClick(Plan, function(e){
            var data = e.data;
            $.rogerTrigger('#modal', '#/guidechooser', {Plan:data});

        });
        realView.rogerCropImages();
    };
    //-------------------------------plan customize end---------------------------------

	$.rogerRouter({
		'#/':							{view:'home.html',										rootrest:'/home', 						ctrl: ctrlHome},
        '#/search':					{view:'home-search.html',								rootrest:'/home/search',					ctrl: ctrlHomeSearch},
		'#/plandetail': 				{view:'plandetail.html',									rootrest:'/plan/detail', 			    ctrl: ctrlPlandetail},
        '#/plandetailshort':			{view:'plandetail-short.html',							rootrest:'/plan/detail2', 			    ctrl: ctrlPlandetail},
        '#/homelist':                 {fragment: 'fragment/home-list.html',                 init: initHomeList,                          ctrl: ctrlHomeList},
        '#/homesearchlist':          {fragment: 'fragment/home-search-list.html',         rootrest:'/home/search',                 ctrl: ctrlHomeSearchList},

        '#/templateplanedit':        {fragment: 'fragment/visitor-tempplan-edit.html',   rootrest:'/plan/detail/tmpl',           ctrl: ctrlTemplateplanNew},
        '#/templateplandetail':      {view: 'visitor-tempplan-detail.html',                rootrest: '/plan/detail/tmpl2',        ctrl: ctrlTemplateplanDetail},

        '#/citychooser':              {fragment: 'fragment/dialog-city-chooser.html',     init: initCityChooser,                       ctrl: ctrlCityChooser},
        '#/spotchooser':              {fragment: 'fragment/dialog-spot-chooser.html',     init: initSpotChooser,                       ctrl: ctrlSpotChooser},
        '#/airportchooser':           {fragment: 'fragment/dialog-airport-chooser.html', init: initAirportChooser,                    ctrl: ctrlAirportChooser},
        '#/guidechooser':             {fragment: 'fragment/dialog-guide-chooser.html',   init: initGuideChooser,                       ctrl: ctrlGuideChooser},

        '#/planpay1': 				{view:'plandetail-pay-1.html',							rootrest:'/plan/pay1',    				ctrl: ctrlPlanpay1},
        '#/orderlist': 				{view: 'orderlist-vistor.html',            			    rootrest: '/order/list', 				ctrl: ctrlOrderlist},
		'#/comment':             		{fragment: 'fragment/comment.html',					init: initComment,						    ctrl: ctrlComment},
        '#/orderdetail':              {view:'payCompletion.html',	                            rootrest:'/order/detail',               ctrl: ctrlOrderdetail},
	    '#/plansearch':               {view:'planSearch.html',                                rootrest:'/plan/plansearch',            ctrl: ctrlPlanSearch},
        '#/userinfo':                 {fragment:'fragment/userInfo.html',                      rootrest: '/user/info',                    ctrl: ctrlUserInfo},
        '#/citychooser2':             {fragment: 'fragment/dialog-city-chooser.html',    init: initCityChooser2,                     ctrl: ctrlCityChooser2}
    });
	
})();

// init: initUserInfo,
