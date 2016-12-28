$(function () {
	$.ajaxSetup ({
		// Disable caching of AJAX responses
		cache: false
	});
	$.ajaxPrefilter(function( options, original_Options, jqXHR ) {
		options.async = true;
	});
});
(function( $, undefined ){
	$.extend({
		rogerGetPath:function() {
			var link = $._rogerGetLocation();
			return link.substring(0, link.indexOf("?"));
		},
		rogerWindowPath:function() {
			var link = window.location;
			return link.substring(0, link.indexOf("?"));
		},
		rogerGetURLJsonParams:function() {
			var link = $._rogerGetLocation();
			if(link.indexOf("?") < 0) {
				return null;
			}
			var url = link.substring(link.indexOf("?")+1);
			var hash;
			var json = {};
			var hashes = url.split('&');
			for (var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				json[hash[0]] = hash[1];
			}
			return json;
		},
		rogerWindowURLParamsString:function() {
			var link = window.location.search;
			return link;
		},
		rogerGetUrlParam:function(key) {
			var params = $.rogerGetURLJsonParams()
			if(params) {
				return params[key];
			}
		},
		_RogerLoadView:function(srcView, destContainer, srcViewReqURL, srcViewReqJSON, callback){
			if(srcView && destContainer && srcViewReqURL) {
				var $view = $("<div/>");
				$($view).load(srcView, function () {
					$.ajax({
						url: srcViewReqURL, type: 'post', dataType: 'json', async: false, data: srcViewReqJSON,
						success: function(respJSON) {
							destContainer.empty();
							destContainer.hide();
							var realView = $view.tmpl(respJSON);
							destContainer.html("").append(realView);
							destContainer.show();
							if(callback) {
								callback(respJSON, realView);
							}
						}
					});
				});
			}
		},
		_RogerLoadViewByJSON:function(srcView, destContainer, reqJSON, callback){
			if(srcView && destContainer  ) {
				var $view = $("<div/>");
				$($view).load(srcView, function () {
					destContainer.empty();
					destContainer.hide();
					var realView = $view.tmpl(reqJSON);
					destContainer.html("").append(realView);
					destContainer.show();
					if(callback) {
						callback(reqJSON, realView);
					}
				});
			}
		},
		rogerPost: function (reqURL, reqJSON, callback) {
			$.ajax({
				url: reqURL, type: 'post', dataType: 'json', data: reqJSON,
				success: function(respJSON) {
					if(callback) {
						callback(respJSON);
					}
				}
			});
		},
		rogerRouter: function(router) {
			window._rogerRouter = router;
		},
		_rogerSetLocation: function(loc) {
			//window._rogerCurrLink = loc;
			window.name = loc;
		},
		_rogerGetLocation: function() {
			if(!window.name) {
				return '#/'+$.rogerWindowURLParamsString();
			}
			return window.name;//window._rogerCurrLink;
		},
		rogerGetAppContainer:function() {
			return window._rogerAppContainer;
		},
		rogerSetAppContainer:function(app) {
			window._rogerAppContainer = app;
		},
		rogerGetRouter: function(path) {
			return window._rogerRouter[path];
		},
		rogerLocation: function(url, reqJSON, onFinsh) {
			if(url.substring(0,2)=='#/'){
				var path = url.indexOf("?") > 0 ? url.substring(0, url.indexOf("?")): url;
				var router = $.rogerGetRouter(path);
				if (router) {
					if(router.view) {
						$._rogerSetLocation(url);
						$._RogerLoadView(
							router.view,
							$.rogerGetAppContainer(),
							router.rootrest,
							$.rogerGetURLJsonParams(),
							function(respJSON, realView) {
								realView._RogerReloadRouters();
								router.ctrl(respJSON, realView);
								if(onFinsh){
									onFinsh();
								}
							}
						);
					}else if(router.fragment) {
                        $._rogerSetLocation(url);
						var req = reqJSON ? reqJSON : router.init();
						$._RogerLoadViewByJSON(
							router.fragment,
							$.rogerGetAppContainer(),
							req,
							function(respJSON, realView) {
								realView._RogerReloadRouters();
                                realView.rogerBindPointer(respJSON);
								router.ctrl(respJSON, realView);
                                if(onFinsh){
                                    onFinsh();
                                }
							}
						)
					}
				}
			}
		},
        rogerTrigger: function(container, url, viewReqJSON ) {
            if(url.substring(0,2)=='#/') {
                var router = $.rogerGetRouter(url);
                if (router) {
					if(router.view) {
						$._rogerSetLocation(url);
						$._RogerLoadView(
							router.view,
							$(container),
							router.rootrest,
							viewReqJSON,
							function(respJSON, realView) {
								realView._RogerReloadRouters();
								router.ctrl(respJSON, realView);
							}
						);
					}else if(router.fragment){
                        $._rogerSetLocation(url);
						$._RogerLoadViewByJSON(
							router.fragment,
							$(container),
							router.init(),
							function(respJSON, realView) {
								realView._RogerReloadRouters();
								realView.rogerBindPointer(respJSON);
								router.ctrl(respJSON, realView);
							}
						)
					}
                }
            }
        },
		rogerScale: function(src_w, src_h, dst_w, dst_h) {
			var sw = parseFloat(src_w);
			var sh = parseFloat(src_h);
			var dw = parseFloat(dst_w);
			var dh = parseFloat(dst_h);
			var k = dst_h > dst_w ? src_h / dst_h : src_w / dst_w ;
			return  dst_h > dst_w ? (dst_h < src_h ? {w:dst_w, h:dst_h}:{w:dst_w * k, h:dst_h * k}) : (dst_w < src_w ? {w:dst_w, h:dst_h}:{w:dst_w * k, h:dst_h * k});
		},
		rogerGetLoginUser: function(){
			if(!$.cookie("roger")) {
				return null;
			}
			return JSON.parse($.cookie("roger"));
		},
        rogerIsLogined: function(){
            return $.rogerGetLoginUser() && $.rogerGetLoginUser().UserID >0;
        },
		rogerShowLogin: function(){
			$(window._rogerLoginForm).modal('show');
		},
        rogerHideLogin: function(){
            $(window._rogerLoginForm).modal('hide');
            //$(loginFormID).modal({ show: false});
        },
        rogerLogout: function(){
            $.removeCookie("roger");
        },
		rogerLogin: function(loginFormID, reqURL) {
        	var user = $.rogerGetLoginUser();
        	if( !user || !user.UserID ) {
                $(loginFormID).rogerSubmit(reqURL, function (respJSON) {
                    if (respJSON[0] && respJSON[0].UserID > 0) {
                        //window.open(redirectURL,'_blank');
                        //window.location = '/dashboard.html?UserID='+respJSON[0].UserID;
                        $.removeCookie("roger");
                        $.cookie("roger", JSON.stringify(respJSON[0]), {expires: 10});
                        $.rogerRefresh();
                    }
                });
            }
			window._rogerLoginForm = loginFormID;
		},
		rogerRefresh: function(reqJSON, onFinish) {
			$.rogerLocation($._rogerGetLocation(),reqJSON, onFinish);
		},
		_rogerGetTarget: function(data, str){
			var a = str.split(',');
			var o = data[a[0]];
			var i = 1;
			while(o && i<a.length) {
				o = data[a[i++]];
			}
			if(i == a.length) {
				return o;
			}
			return null;
		},
        roger_pointer_unescape : function  (str) {
            return str.replace(/~1/g, '/').replace(/~0/g, '~');
        },
        roger_pointer_parse: function(pointer) {
            if (pointer === '') { return []; }
            if (pointer.charAt(0) !== '/') { throw new Error('Invalid JSON pointer: ' + pointer); }
            return pointer.substring(1).split(/\//).map($.roger_pointer_unescape);
        },
        roger_pointer_get: function(obj, pointer) {
			var refTokens = Array.isArray(pointer) ? pointer : $.roger_pointer_parse(pointer);

			for (var i = 0; i < refTokens.length; ++i) {
				var tok = refTokens[i];
				if (!(typeof obj == 'object' && tok in obj)) {
					throw new Error('Invalid reference token: ' + tok);
				}
				obj = obj[tok];
			}
			return obj;
		},
        roger_pointer_set: function (obj, pointer, value) {
			var refTokens = Array.isArray(pointer) ? pointer : $.roger_pointer_parse(pointer),
				nextTok = refTokens[0];

			if (refTokens.length === 0) {
				throw Error('Can not set the root object');
			}

			for (var i = 0; i < refTokens.length - 1; ++i) {
				var tok = refTokens[i];
				if (tok === '-' && Array.isArray(obj)) {
					tok = obj.length;
				}
				nextTok = refTokens[i + 1];

				if (!(tok in obj)) {
					if (nextTok.match(/^(\d+|-)$/)) {
						obj[tok] = [];
					} else {
						obj[tok] = {};
					}
				}
				obj = obj[tok];
			}
			if (nextTok === '-' && Array.isArray(obj)) {
				nextTok = obj.length;
			}
			obj[nextTok] = value;
			return this;
		},
        roger_pointer_remove: function (obj, pointer) {
            var refTokens = Array.isArray(pointer) ? pointer : $.roger_pointer_parse(pointer);
            var finalToken = refTokens[refTokens.length -1];
            if (finalToken === undefined) {
                throw new Error('Invalid JSON pointer for remove: "' + pointer + '"');
            }

            var parent = $.roger_pointer_get(obj, refTokens.slice(0, -1));
            if (Array.isArray(parent)) {
                var index = +finalToken;
                if (finalToken === '' && isNaN(index)) {
                    throw new Error('Invalid array index: "' + finalToken + '"');
                }

                Array.prototype.splice.call(parent, index, 1);
            } else {
                delete parent[finalToken];
            }
        },

	});
	$.fn.extend({
		_RogerReloadRouters: function () {
			var elems = $(this).find('a[href]');
			if(elems && elems.length > 0) {
				elems.each(function(){
					var url = $(this).attr('href');
					if(url.substring(0,2)=='#/'){
						$(this).click(function (e) {
							e.preventDefault();
							$.rogerLocation(url);
						});
					}
				});
			}
		},
		rogerGo: function () {
			$.rogerSetAppContainer( $(this) );
			$('html')._RogerReloadRouters();
			$.rogerRefresh();//$.rogerLocation($._rogerGetLocation());//'#/'+$.rogerWindowURLParamsString());
		},
		rogerOnceClick: function (callback) {
			var ev = $._data($(this), 'events');
			if(!ev || !ev.click) {
				$(this).click(function (e) {
					e.preventDefault();
					callback(e);
				});
			}
		},
		rogerOnClickRouter: function(container, viewReqURL, viewReqJSON, callback ) {
			$(this).click(function (e) {
				e.preventDefault();
				$._rogerSetLocation($(this).data("href"));
				$._RogerLoadView($(this).data("href"), container, viewReqURL, viewReqJSON, callback );
			});
		},
		rogerOnClickTrigger: function(container, viewReqURL, viewReqJSON, callback ) {
			$(this).click(function (e) {
				e.preventDefault();
				$._RogerLoadView($(this).data("href"), container, viewReqURL, viewReqJSON, callback );
			});
		},
		rogerLoadView: function(href, jsondata, callback ) {
			$._RogerLoadViewByJSON(srcView, $(this), jsondata, callback);
		},
		rogerReloadFile: function (file, callback) {
			var $div = $("<div/>");
			var _this = $(this);
			$($div).load(file, function () {
				_this.empty();
				_this.hide();
				_this.html("").append($div);
				_this.show();
				if(callback) {
					callback($div);
				}
			});
		},
		rogerSubmit: function (reqURL, callback) {
			$(this).on('submit', function(e) {
				e.preventDefault();
				$.ajax({
					url: reqURL, type: 'post', dataType: 'json', data: $(this).serialize(),
					success: function(respJSON) {
						if(callback) {
							callback(respJSON);
						}
					}
				});
			});
		},
		rogerCropImages: function () {
			var elems = $(this).find('img[data-src]');
			if(elems && elems.length > 0) {
				elems.each(function(){
					var parent = $(this).parent();
					var width = Math.ceil(parent.width());
					var height = Math.ceil(parent.height());
					var src = $(this).data('src');
					var index = src.lastIndexOf(".");
					var newSrc = src.substring(0, index)+"_"+width+"x"+height+src.substring(index);
					$(this).attr('src', newSrc);
				});
			}
		},
        rogerBindPointer: function(data){
			var fragment = $(this);
            var elems = fragment.find('[data-value]');
            elems.each(function(){
                var ev = $._data($(this), 'events');
                if(!ev || !ev.change) {
                    $(this).on("change paste keyup", function () {
                        var _this = $(this);
                        var ptr = _this.data('value');
                        var val = _this.val();
                        $.roger_pointer_set(data, ptr, val);
                        $.rogerRefresh(data, function () {
                            _this.focus();
                        });
                    });
                }
            });
            var op2 = fragment.find('[data-op="remove"]');
            op2.each(function(){
                var ev = $._data($(this), 'events');
                if(!ev || !ev.click) {
                    $(this).on("click", function () {
                        var pointer = $(this).data('pointer');
                        $.roger_pointer_remove(data, pointer);
                        $.rogerRefresh(data);
                    });
                }
            });
            var op2 = fragment.find('[data-op="change"]');
            op2.each(function(){
                var ev = $._data($(this), 'events');
                if(!ev || !ev.click) {
                    $(this).on("click", function () {
                        var pointer = $(this).data('pointer');
                        var action = $(this).data('action');
                        var func = data[action];
                        if(func && typeof func === "function") {
                            func(data, pointer, function (d) {
								$.rogerRefresh(d);
                            });
                        }
                    });
                }
            });
        },
		rogerUploadImage: function ( width, height, callback) {
			if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
			  return;
			}  
			$(this).hide();
			$(this).append('<div><canvas id="photo" style="position:relative;width:100%;height:100%" /><input type="file" style="position:absolute;opacity:0;top:0;bottom:0;left:0;right:0;width:100%" multiple="multiple"/></div>');
			$('input[type="file"]').change(function(e){
				var files = this.files;
				if (!files[0] || !files[0].type) return;
				for(var i in files) {
				  if (files[i] && files[i].type && files[i].type.indexOf('image') > -1) {
					var reader = new FileReader();
					reader.onloadend = function (evt) {
						var img = new Image();
						img.src = evt.target.result;
						var avatar = document.getElementById("photo");
						var w = width ? width : 300;
						var h = height ? height : 150;
						var ctx = avatar.getContext("2d");
						ctx.fillStyle="#ffffff";
						ctx.fillRect(0, 0, avatar.width, avatar.height);
						img.onload = function() {
							var k = $.rogerScale(w, h, img.width, img.height);
							avatar.width = k.w;
							avatar.height = k.h;
							ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, avatar.width, avatar.height);
							callback({raw:avatar.toDataURL("image/jpeg")});
							ctx.clearRect(0, 0, avatar.width, avatar.height);
						}
					}
					reader.readAsDataURL(files[i]);
				  }
				}
			});
			$(this).show();
			
		}
	});
})( jQuery );