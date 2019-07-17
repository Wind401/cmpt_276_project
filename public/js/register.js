define(function (require) {

    var $ = require('jquery'),
        validate = require('app/validate'),
        cookie = require('cookie');

    validate.valiObj.init();



    var Reg = function () {}

    Reg.prototype = {

        init: function () {
            this.$input = $('input[data-rule]');
            this.$form = $('#J_regForm');
            this.$submit = $('#J_register');
            this.innerHTML = this.$submit.val();
            this.$countBtn = $('.get-vercode');
            this.$mobileIpt = $('.mobile');
            // this.$authcode = $('.authcode');
            this.$msgcode = $('.msgcode');
            this.flag = false;
            this.bind();
            // validate.authcode.init();
            $('input[data-rule]:visible').placeholder({
                isUseSpan: true
            });
            this.$input.eq(0).focus();

            // 寮瑰眰鏆傛椂鍏抽棴 娉ㄥ唽
            if (typeof isCanRegister != 'undefined' && isCanRegister != '') {
                $('.pop-wrap-info').show();
                $('#cboxOverlay').show();
                $('.pop-txt-info').html("<p>" + "缃戠珯缁存姢涓紝鏆備笉寮�鏀炬柊鐢ㄦ埛娉ㄥ唽" + "</p>");
            }

            /**
             * 闃块噷婊戝潡澶勭悊
             */
            var rid = '';
            var self = this;
            var $this = $(this);

           this.$countBtn.on('click', function (e) {
                e.preventDefault();
                if (rid != '') {
                    self.getVercode(rid)
                } else {
                    $this.popError("璇峰厛鐐瑰嚮鎸夐挳鏅鸿兘楠岃瘉");
                }
            });

            var ic = new smartCaptcha({
                renderTo: '#float-captcha',
                width: 380,
                height: 44,
                default_txt: '鐐瑰嚮鎸夐挳寮�濮嬫櫤鑳介獙璇�',
                success_txt: '楠岃瘉鎴愬姛',
                fail_txt: '楠岃瘉澶辫触锛岃鍦ㄦ鐐瑰嚮鎸夐挳鍒锋柊',
                scaning_txt: '鏅鸿兘妫�娴嬩腑',
                success: function(data) {
                      console.log(NVC_Opt.token);
                      console.log(data.sessionId);
                      console.log(data.sig);
                      rid = NVC_Opt.token + ',' + data.sessionId + ',' + data.sig + ',' + 'ic_message';
                      self.getVercode(rid);
                },
              });
              ic.init();
              this.ic = ic;

        },

        // 鍙戦�侀獙璇佺爜
        getVercode: function (rid) {
            var self = this;
            var $this = self.$countBtn;
            $this.data('reset');
            self.$mobileIpt.blur();

            if (self.$mobileIpt.parents('li').hasClass('error')) {
                return;
            }
            // self.$authcode.blur();
            // if (self.$authcode.parents('li').hasClass('error')) {
            //     return;
            // }

            $.ajax({
                url: curDomain + '/m/2/sendmobilecode.action',
                type: 'POST',
                dataType: 'json',
                data: {
                    mobile: self.$mobileIpt.val(),
                    // code: self.$authcode.val(),
                    rid: rid
                },
                beforeSend: function () {
                    $this.addClass("btn-disable").attr("disabled", "disabled");
                },
                complete: function (XMLHttpRequest, textStatus) {
                    var refresh = true;
                    var data = $.parseJSON(XMLHttpRequest.responseText),
                        status = XMLHttpRequest.status;

                    if (status !== 200) {
                        $this.popError(data.msg);
                    } else {
                        if (data.code == 1000) {
                            this.flag = true;
                            refresh = false;
                            validate.countDown.start(
                                function () {
                                    $this.ic.reset()
                                    $this.removeClass("btn-disable").removeAttr("disabled").html("閲嶅彂楠岃瘉鐮�");
                                }
                            );
                        } else if (data.code == 1001) {
                            $this.popError(data.msg);
                            validate.valiObj.showErr(self.$mobileIpt, data.msg);
                            $this.ic.reset()
                            $this.removeClass("btn-disable").removeAttr("disabled");
                        } else {
                            $this.popError(data.msg);
                            validate.valiObj.showErr(self.$mobileIpt, data.msg);
                            $this.removeClass("btn-disable").removeAttr("disabled");
                        }

                    }
                    if (refresh) {
                        $this.ic.reset()
                        // self.$form.find('#J_refresh').click();
                        // self.$authcode.val('');
                    }
                }
            })
        },
        bind: function () {
            var self = this;
            this.$submit
                .on('click', function (e) {
                    e.preventDefault();
                    var $this = $(this);
                    self.$input.blur();

                    if (self.$form.find('li.error').length == 0) {
                        $.ajax({
                            url: curDomain + '/pc/mobileregister.action',
                            type: 'POST',
                            dataType: 'json',
                            data: self.$form.serialize(),
                            beforeSend: function () {
                                self.$submit.addClass("btn-disable").attr("disabled", "disabled");
                            },
                            complete: function (XMLHttpRequest, textStatus) {
                                var refresh = true;
                                var data = $.parseJSON(XMLHttpRequest.responseText),
                                    status = XMLHttpRequest.status;

                                if (status !== 200) {
                                    $this.popError(data.msg);
                                } else {
                                    if (data.code == 1000) {
                                        if (data.msg.isPwRisk == 1) {
                                            popWrap = function (content, btnhtml) {
                                                $('.pop-wrap').show();
                                                $('#cboxOverlay').show();
                                                $('.pop-txt').html("<p>" + content + "</p>");
                                                $('.pop-btn2').html(btnhtml);

                                                $('.button-confirm').click(function () {
                                                    $('.pop-wrap').hide();
                                                    $('#cboxOverlay').hide();
                                                });
                                            }

                                            popWrap("浜茬埍鐨凧Rs锛屾垜浠娴嬪埌浣犵殑甯愬彿瀛樺湪椋庨櫓锛屼负浜嗕繚璇佷綘鐨勫笎鍙峰畨鍏紝璇峰畬鎴愪互涓嬮獙璇佸苟鍙婃椂淇敼瀵嗙爜銆�", "<form action='/pc/verifyUcMember.view' method='post'><input type='hidden' name='vid' value='" + data.msg.vid + "' /><input type='submit'  value='楠岃瘉'/>");

                                        } else {
                                            refresh = false;
                                            cookie.logincookieHideImg(data.msg.uid, data.msg.tag)
                                        }
                                    } else if (data.code == 1431) {
                                        validate.valiObj.showErr(self.$msgcode, data.msg);
                                    } else if (data.code == -10011) {
                                        $this.popError(data.msg);
                                    } else if (data.code == 1532) {
                                        var _html = "<div id='register_error_popup' class='getCount-register-wrap'><div class='getCount-register'><div class='getCount-left'><img src='" + staticDomain + "/pc/images/wrong.png' alt='customs service'></div><div class='getCount-right'><p class='getCount-text'>娉ㄥ唽寮傚父锛岃鑱旂郴瀹㈡湇</p><p  class='getCount-text'>瀹㈡湇QQ锛�<a href='http://b.qq.com/webc.htm?new=0&sid=800021359&o=hupu.tv&q=7' class='getAccount'>800021359</a>锛堢偣鍑荤洿鎺ユ墦寮�QQ锛�</p></div></div><a onclick='$(&#39;#register_error_popup&#39;).remove();' class='getCount-close-button'>鍙栨秷</a></div>";
                                        $(".login-wrap").append(_html);
                                    } else if (data.code == 1021) {
                                        $this.popError(data.msg);
                                    } else {
                                        validate.valiObj.showErr(self.$msgcode, data.msg);
                                    }
                                }

                                // if (refresh && typeof (self.$authcode) != 'undefined') {
                                //     self.$form.find('#J_refresh').click();
                                //     self.$authcode.val('');
                                // }
                            }
                        })
                    }
                })
        }


    }

    new Reg().init();

})