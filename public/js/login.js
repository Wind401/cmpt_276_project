define(function (require) {

    var $ = require('jquery'),
        validate = require('app/validate'),
        cookie = require('cookie');


    validate.valiObj.init();

    var Login = function () {}

    Login.prototype = {

        init: function () {
            this.$input = $('input[data-rule]');
            this.$form = $('#J_loginForm');
            this.$submit = $('#J_submit');
            this.innerHTML = this.$submit.val();

            this.$username = $('#J_username');
            this.$pwd = $('#J_pwd');
            this.$input.eq(0).focus();

            $('input[data-rule]:visible').placeholder({
                isUseSpan: true
            });

            if (showVerifyImg && showVerifyImg == 'true') {
                // 
                //                validate.authcode.show();
                //                $('input[data-rule]:visible').placeholder({
                //                    isUseSpan: true
                //                });
                //                this.$valiCode = $('.authcode');
            }

            /**
             * 
             */
            var rid = '';
            var self = this;
            var $this = $(this);
        },

        // loginSubmit: function (geevalidate, captchaObj) {
        loginSubmit: function (rid) {
            var self = this;

            var $this = self.$submit;

            $('input[data-rule]').blur();

            if (self.$form.find('li.error').length == 0) {
                var username = $('#J_username').val();
                var pwd = $('#J_pwd').val();
                var _data = {
                    username: self.$form.find('#J_username').val(),
                    password: MD5(self.$form.find('#J_pwd').val()),
                    verifyCode: self.$form.find('#J_authcode').val(),
                    // geetest_challenge: geevalidate.geetest_challenge,
                    // geetest_validate: geevalidate.geetest_validate,
                    rid: rid
                };
                $.ajax({
                    url: '/pc/login/member.action',
                    type: 'POST',
                    dataType: 'json',
                    data: _data,
                    beforeSend: function () {
                        self.$submit.addClass("btn-disable").attr("disabled", "disabled");
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        var data = $.parseJSON(XMLHttpRequest.responseText),
                            status = XMLHttpRequest.status;
                        var refresh = true;
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

                                    popWrap("浜茬埍鐨凧Rs锛屾垜浠娴嬪埌浣犵殑甯愬彿瀛樺湪椋庨櫓锛屼负浜嗕繚璇佷綘鐨勫笎鍙峰畨鍏紝璇峰畬鎴愪互涓嬮獙璇佸苟鍙婃椂淇敼瀵嗙爜銆�", "<form action='/pc/verifyUcMember.view' method='post'><input type='hidden' name='vid' value='" + data.msg.vid + "' /><input type='submit'  value='楠岃瘉'/></form>");

                                } else {
                                    refresh = false;
                                    cookie.logincookieHideImg(data.msg.uid, data.msg.tag)
                                }


                            } else if (data.code == 1030) {
                                validate.valiObj.showErr(self.$valiCode, data.msg);
                                refresh = false;
                            } else if (data.code == 661) {
                                // 
                                //                                        validate.authcode.show('true');
                                //                                        $('input[data-rule]:visible').placeholder({
                                //                                            isUseSpan: true
                                //                                        });
                                self.$submit.removeClass("btn-disable").removeAttr("disabled");
                                //                                        self.$valiCode = $('.authcode');
                                refresh = false;
                            } else if (data.code == 1039) {
                                $this.popError(data.msg);
                            } else {
                                $this.popError(data.msg);
                            }
                        }

                        // 
                        if (refresh) {
                            self.$submit.removeClass("btn-disable").removeAttr("disabled");
                            self.ic.reset();
                        }
                    }
                })
            }
            //                })
        }
    }
})