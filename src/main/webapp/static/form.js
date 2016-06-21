$(document).ajaxComplete(function (event, xhr, settings) {
    doAfterForbiden(xhr);
});


function doAfterForbiden(xhr) {
    if (xhr.status == 401) {
        location.reload();
        xhr.abort();
    }
}

(function ($) {
    var Form = {
        serialize: function (form, serializers) {
            var $form = $(form);
            $form.find(":disabled").attr("data-disabled", "true").removeAttr("disabled");

            var checkbox = $form.find("input:checkbox");

            checkbox.each(function () {
                var $this = $(this);

                if ($this.is(":checked")) {
                    $this.attr("data-checked", "true");
                    if ($this.val() == null || $this.val() == 'on') {
                        $this.val("true");
                    }
                } else {
                    $this.attr("data-value", $this.val());
                    $this.val("false");
                    $this.attr("checked", "checked");
                }
            });

            var a = $form.serializeArray();

            $form.find("[data-disabled='true']").attr("disabled", "disabled");
            $form.find("[data-disabled='true']").removeAttr("data-disabled");

            checkbox.each(function () {
                var $this = $(this);

                if ($this.attr("data-checked")) {
                    $this.removeAttr("data-checked");
                } else {
                    $this.removeAttr("checked");
                    $this.attr("value", $this.attr("data-value"));
                    $this.removeAttr("data-value");
                }
            });

            var o = {};

            $.each(a, function () {
                if (serializers[this.name] != undefined) {
                    o[this.name] = serializers[this.name](this.value, o[this.name]);
                } else {
                    if (o[this.name] !== undefined) {
                        if (!o[this.name].push) {
                            o[this.name] = [o[this.name]];
                        }
                        o[this.name].push(this.value || '');
                    } else {

                        o[this.name] = this.value || '';
                    }
                }
            });

            return o;
        },

        dispatcher: function (form, options, data) {
            var $form = $(form);
            var dispatcher = {};

            if ($.isFunction(options.callback)) {
                dispatcher.callback = options.callback;
            } else {
                var callback = $form.data("callback");

                if (callback) {
                    if (callback.match("^redirect:")) {
                        var url = callback.substring("redirect:".length).trim();

                        if (url) {
                            dispatcher.callback = function () {
                                window.location.href = Form.renderURL(url, data);
                            }
                        } else {
                            dispatcher.callback = function () {
                            };
                        }
                    } else {
                        dispatcher.callback = eval(callback);
                    }
                } else {
                    dispatcher.callback = function () {
                    };
                }
            }

            if ($.isFunction(options.handler)) {
                dispatcher.handler = options.handler;
            } else {
                var handler = $form.data("handler");
                if (handler) {
                    dispatcher.handler = eval(handler);
                } else {
                    dispatcher.handler = function () {
                    }
                }
            }

            return dispatcher;
        },

        renderURL: function (url, data) {
            var fn = ( function () {
                var start = "{", end = "}", path = "[a-z0-9_$][\\.a-z0-9_]*", // e.g. config.person.name
                    pattern = new RegExp(start + "\\s*(" + path + ")\\s*" + end, "gi"), undef;

                return function (template, data) {
                    return template.replace(pattern, function (tag, token) {
                        var path = token.split("."), len = path.length, lookup = data, i = 0;

                        for (; i < len; i++) {
                            lookup = lookup[path[i]];

                            if (lookup === undef) {
                                throw "tim: '" + path[i] + "' not found in " + tag;
                            }

                            if (i === len - 1) {
                                return lookup;
                            }
                        }
                    });
                };
            }());

            return fn(url, data);
        }
    }
    $.fn.extend({
        formAjax: function (opt) {
            return this.each(function () {
                var form = this;
                var $form = $(form);

                var options = $.extend({
                    method: $form.attr("method"),
                    action: $form.attr("action"),
                    validate: true,
                    serializers: {}
                }, opt);

                if (options.validate) {
                    $form.validate();
                }

                $(this).submit(function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $form.submitAjax(options);
                });
            });
        },

        submitAjax: function (opt) {
            var form = this;
            var $form = $(form);

            var options = $.extend({
                method: $form.attr("method"),
                action: $form.attr("action"),
                validate: true,
                serializers: {}
            }, opt);


            var validator = $form.data("validator");
            if (validator) {
                validator.checkForm();
                if (!validator.valid()) {
                    validator.showErrors();
                    return;
                }
            }

            $.ajax({
                type: options.method,
                url: options.action,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(Form.serialize(form, options.serializers)),
                dataType: "json",
                context: form,
                complete: function (xhr) {

                    doAfterForbiden(xhr);

                    var data = JSON.parse(xhr.responseText);
                    var dispatcher = Form.dispatcher(this, options, data);

                    if (xhr.status == 301 || xhr.status == 200 || xhr.status == 201) {
                        dispatcher.callback.call(form, data, xhr.status);
                    } else if (xhr.status == 400 && validator) {
                        alertErrorMsgPopups("ajax调用出错.");
                    } else {
                        alertErrorMsgPopups("系统错误.");
                    }
                }
            });

        }
    });

})(jQuery);

(function ($) {
    var _load = jQuery.fn.load();

    $.fn.ajaxLoad = function (options, url, params, callback) {
        var opts = $.extend({
            contentType: "text/html;charset=UTF-8",
            JSONObj: false,
            includeJS: false
        }, options);

        if (typeof url !== "string" && _load) {
            return _load.apply(this, arguments);
        }

        var selector, response, type,
            jsonObj = opts.JSONObj,
            contentType = opts.contentType,
            self = this,
            off = url.indexOf(" ");

        if (off >= 0) {
            selector = url.slice(off, url.length);
            url = url.slice(0, off);
        }

        if (jQuery.isFunction(params)) {
            callback = params;
            params = undefined;
        } else if (params && typeof params === "object") {
            type = "POST";
        }

        if (jsonObj) {
            contentType = "application/json; charset=utf-8";
            params = JSON.stringify(params);
        }

        if (self.length > 0) {
            jQuery.ajax({
                url: url,
                type: type,
                dataType: "html",
                data: params,
                contentType: contentType
            }).done(function (responseText) {
                response = arguments;
                self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText, opts.includeJS)).find(selector) : responseText);
            }).complete(callback && function (jqXHR, status) {
                    self.each(callback, response || [ jqXHR.responseText, status, jqXHR ]);
                });
        }
        return this;
    }

    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    $.fn.clear = function() {
        $(':input', this)
            .not(':button, :submit, :reset, :hidden')
            .val('')
            .removeAttr('checked')
            .removeAttr('selected');
    }
})(jQuery);
