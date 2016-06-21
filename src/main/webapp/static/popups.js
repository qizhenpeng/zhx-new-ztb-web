//Start BasisUI
var BasisUI = {};
BasisUI.extend = function (destination, source) {
    for (var property in source) {
        if (destination[property]) {
            continue;
        }
        destination[property] = source[property];
    }
    return destination;
};
BasisUI.clone = function (matrix) {
    if (typeof (matrix) == "function") {
        return new matrix();
    }
    else if (typeof (matrix) == "object") {
        var cloning = new Object();
        for (var member in matrix) {
            switch (typeof (matrix[member])) {
                case "object" :
                    cloning[member] = clone(matrix[member]);
                    break;
                default:
                    cloning[member] = matrix[member];
            }
        }
        return cloning;
    }
    else {
        var cloning = matrix;
        return cloning;
    }
}
BasisUI.getWindowWidth = function (objWindow) {
    if (objWindow.innerWidth) {
        return Math.min(objWindow.innerWidth, objWindow.document.documentElement.clientWidth);
    }
    else {
        return objWindow.document.documentElement.clientWidth;
    }
}
BasisUI.getWindowHeight = function (objWindow) {
    if (objWindow.innerHeight) {
        return Math.min(objWindow.innerHeight, objWindow.document.documentElement.clientHeight);
    }
    else {
        return objWindow.document.documentElement.clientHeight;
    }
}
BasisUI.getDocumentScrollTop = function (objDocument) {
    return Math.max(objDocument.documentElement.scrollTop, objDocument.body.scrollTop);
}
BasisUI.getDocumentScrollLeft = function (objDocument) {
    return Math.max(objDocument.documentElement.scrollLeft, objDocument.body.scrollLeft);
}
BasisUI.getDocumentWidth = function (objDocument) {
    return objDocument.documentElement.scrollWidth;
}
BasisUI.getDocumentHeight = function (objDocument) {
    return objDocument.documentElement.scrollHeight;
}
BasisUI.maxZIndex = function (objDocument) {
    var zIndex = 0;
    var elments = objDocument.getElementsByTagName("*");
    for (var i = 0; i < elments.length; i++) {
        if (elments[i].currentStyle) {
            elementZIndex = elments[i].currentStyle.zIndex; //get z-index on IE
        } else if (window.getComputedStyle) {
            elementZIndex = window.getComputedStyle(elments[i], null).zIndex; //get z-index on Firfox, Safari and Chrome
        }
        if (elementZIndex) {
            if (zIndex < parseInt(elementZIndex)) {
                zIndex = elementZIndex;
            }
        }
    }
    return parseInt(zIndex);
}
BasisUI.BindEvent = function (element, type, listener) {
    if (window.addEventListener) {
        element.addEventListener(type, listener, false);
    }
    else if (window.attachEvent) {
        element.attachEvent( 'on' + type, listener);
    }
}
BasisUI.userAgent = navigator.userAgent.toLowerCase();
BasisUI.browser = {
    version: (BasisUI.userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
    safari: /webkit/.test(BasisUI.userAgent),
    opera: /opera/.test(BasisUI.userAgent),
    msie: /msie/.test(BasisUI.userAgent) && !/opera/.test(BasisUI.userAgent),
    mozilla: /mozilla/.test(BasisUI.userAgent) && !/(compatible|webkit)/.test(BasisUI.userAgent)
};
//End BasisUI
//Start BasisUIList
function BasisUIList() {
    this.data = new Array();
}
BasisUIList.prototype.count = function () {
    return this .data.length;
}
BasisUIList.prototype.indexOf = function (item) {
    var index = -1;
    for (var i = this.count(); i >= 0; ) {
        if (this .data[--i] == item) {
            index = i;
            break;
        }
    }
    return index;
}
BasisUIList.prototype.contain = function (item) {
    return this .indexOf(item) == -1 ? false : true;
}
BasisUIList.prototype.add = function (item) {
    if (this .contain(item)) {
        return;
    }
    this.data.push(item);
}
BasisUIList.prototype.removeAt = function (index) {
    for (var i = index; i < this.count() - 1; i++) {
        this[i] = this [i + 1];
    }
    return this .data.pop();
}
BasisUIList.prototype.item = function (index) {
    if (index >= 0 && index <= this.count() - 1) {
        return this .data[index]
    }
}
BasisUIList.prototype.remove = function (item) {
    var index = this .indexOf(item);
    if (index != -1) {
        return this .removeAt(index);
    }
    return null ;
}
//End BasisUIList
/*******************************
Basis Common Popup Prototypes
********************************/
var BasisPopupZIndex = 10000;
function BasisPopupMaxZindex(action) {
    if (action == "remove" )
        BasisPopupZIndex -= 1;
    else{
        BasisPopupZIndex += 1;
        return BasisPopupZIndex;
    }
}
//Start BasisMaskPopup
function BasisMaskPopup(param) {
    this.targetWindow = param["targetWindow" ] || window;
    this.elementKey = new Array();
    this.element = new Object();
    this.style = new Object();
    this.cssClass = new Object();

    this.elementKey.push("maskSpan" );
    this.elementKey.push("maskDiv" );
    this.element["maskSpan" ] = this.targetWindow.document.createElement( "span");
    this.element["maskDiv" ] = this.targetWindow.document.createElement( "div");
    this.element["maskDiv" ].setAttribute("class", "popups-mask");
    this.element["maskDiv" ].setAttribute("className", "popups-mask");
    this.style["maskDiv" ] = { zIndex: BasisPopupMaxZindex(), display: "block" };
}
BasisMaskPopup.prototype.setStyle = function () {
    this.element.maskDiv.style.zIndex = this .style["maskDiv"][ "zIndex"];
    this.element.maskDiv.style.display = this .style["maskDiv"][ "display"];
}

BasisMaskPopup.prototype.setSize = function () {
    this.element.maskDiv.style.width = "100%" ;
    this.element.maskDiv.style.height = Math.max(BasisUI.getWindowHeight(this.targetWindow), BasisUI.getDocumentHeight(this .targetWindow.document)) + "px";
}

BasisMaskPopup.prototype.setPosition = function () {
    this.element.maskDiv.style.left = "0px" ;
    this.element.maskDiv.style.top = "0px" ;
}
BasisMaskPopup.prototype.build = function () {
    this.element.maskSpan.appendChild(this .element.maskDiv);
    this.targetWindow.document.body.appendChild(this.element.maskSpan);
}
BasisMaskPopup.prototype.bindEvent = function () {
    var me = this ;
    BasisUI.BindEvent( this.targetWindow, "resize" , function () { me.setSize(); });
}
BasisMaskPopup.prototype.show = function () {
    this.setSize();
    this.setStyle();
    this.build();
    this.setPosition();
    this.bindEvent();
}
BasisMaskPopup.prototype.close = function () {
    if (this .element.maskSpan) {
        $( "*").find(this .element.maskSpan).remove();
    }
    BasisPopupMaxZindex( "remove");
}
//End MaskPopup
function BasisPopup(param){
     this.targetWindow=param["targetWindow" ]||window;  
     this.elementKey=new Array();
     this.config=new Object();
     this.element=new Object();
     this.callBack=new Object();
     this.cssClass=new Object();
     this.style=new Object();
     this.size=new Object();
     this.position=new Object();
     this.action=new Object();
     this.actionData = new Object();
     this.config["targetObj" ] = param.targetObj || "";
    if(param.showMask){
          this.config["showMask" ]=param.showMask;
          this.mask = new BasisMaskPopup({ targetWindow: this.targetWindow});
     }               
     this.config["title" ]=param.title;
    this.config["className" ] = param.className || "";
     this.config["content" ]=param.content;
     this.config["autoSize" ] = false;
     this.config["hasArrow" ] = param.hasArrow || false;
     this.callBack["closeCallBack" ] = param.closeCallBack;

     this.size["width" ]=param.width||300;
     this.size["height" ]=param.height||100;

     this.position["top" ]=param.top;
     this.position["left" ]=param.left;

     this.init();
}

BasisPopup.prototype.init= function(){
    this.action["hasShow" ]=false;
     this.elementKey.push("popupSpan" );
     this.elementKey.push("popupDiv" );
     this.elementKey.push("popupBorderTop" );
     this.elementKey.push("popupBorderBottom" );
     this.elementKey.push("popupContent" );

     this.elementKey.push("BasisCloseDiv" );
     this.elementKey.push("BasisReturnBtn" );
     this.elementKey.push("headerDiv" );

     this.elementKey.push("contentDiv" );
     this.element["popupSpan" ]=this.targetWindow.document.createElement( "div");
     this.element["popupDiv" ]=this.targetWindow.document.createElement( "div");
     this.element["popupDiv" ].setAttribute("class", "basis-popups" + this .config["className"]);
     this.element["popupDiv" ].setAttribute("className", "basis-popups" + this .config["className"]);

     this.element["popupBorderTop" ]=this.targetWindow.document.createElement( "div");
     this.element["popupBorderTop" ].setAttribute("class", "basis-popup-top clearfix" );
     this.element["popupBorderTop" ].setAttribute("className", "basis-popup-top clearfix" );
     this.element["popupBorderTop" ].innerHTML = "<div class=\"basis-popup-top-left\"> </div><div class=\"basis-popup-top-right\"> </div>";

     this.element["popupBorderBottom" ]=this.targetWindow.document.createElement( "div");
     this.element["popupBorderBottom" ].setAttribute("class", "basis-popup-btm clearfix" );
     this.element["popupBorderBottom" ].setAttribute("className", "basis-popup-btm clearfix" );
     this.element["popupBorderBottom" ].innerHTML = "<div class=\"basis-popup-btm-left\"> </div><div class=\"basis-popup-btm-right\"></div>";

     this.element["popupContent" ]=this.targetWindow.document.createElement( "div");
     this.element["popupContent" ].setAttribute("class", "basis-popup-content");
     this.element["popupContent" ].setAttribute("className", "basis-popup-content");

     this.element["headerDiv" ]=this.targetWindow.document.createElement( "div");
     this.element["headerDiv" ].setAttribute("class", "basis-popup-title");
     this.element["headerDiv" ].setAttribute("className", "basis-popup-title");

     this.element["BasisCloseDiv" ] = this.targetWindow.document.createElement( "div");
     this.element["BasisCloseDiv" ].setAttribute("class", "basis-close-btn");
     this.element["BasisCloseDiv" ].setAttribute("className", "basis-close-btn");
     this.element["BasisReturnBtn" ] = this.targetWindow.document.createElement( "div");
     this.element["BasisReturnBtn" ].setAttribute("class", "basis-return-btn");
     this.element["BasisReturnBtn" ].setAttribute("className", "basis-return-btn");

     this.element["contentDiv" ]=this.targetWindow.document.createElement( "div");
     this.element["contentDiv" ].setAttribute("class", "basis-iframe-content");
     this.element["contentDiv" ].setAttribute("className", "basis-iframe-content");

     this.style["popupDiv" ]={position:"absolute"};

     this.style["popupDiv" ]["zIndex"] = BasisPopupMaxZindex();

     if (this .config["hasArrow"]) {
          this.elementKey.push("popupArrow" );
          this.element["popupArrow" ] = this.targetWindow.document.createElement( "div");
          this.element["popupArrow" ].setAttribute("class", "BasisArrow");
          this.element["popupArrow" ].setAttribute("className", "BasisArrow");
     }
}

//initContent
BasisPopup.prototype.initContent= function(){}
//setStyle
BasisPopup.prototype.setStyle= function(){
     for(var i=this.elementKey.length-1;i>0;i--){
          var key=this .elementKey[i];
          if(!this .style[key]){
               continue;
          }
          for(var styleItem in this.style[key]){
               try     {
                    this.element[key].style[styleItem]=this .style[key][styleItem];
               }
               catch(e)
               {}
          }
     }
}
BasisPopup.prototype.setClass= function(){
     for(var i=this.elementKey.length-1;i>0;i--){
          var key=this .elementKey[i];
          if(!this .cssClass[key]){
               continue;
          }
          try{
               this.element[key].className=this .cssClass[key];
          }
          catch(e)
          {}
     }
}
//setSize
BasisPopup.prototype.setSize= function(){
     this.element.popupDiv.style["width" ]=(parseInt(this.size.width)) + "px";
     //this.element.popupDiv.style["height"]=this.size.height+"px";
}
//setSize with URL iframe
BasisPopup.prototype.setUrlSize= function(){
     //this.element.popupDiv.style["height"]=this.size.height+"px";
}
//reset the size of popup
BasisPopup.prototype.resetPopupSize = function (width, height) {
    if (width !="" ) {
        this.size.width = width;
        this.element["url" ].setAttribute("width", width + "px");
    }
    if (height != "" ) {
        this.size.height = height;
        this.element["url" ].setAttribute("height", height + "px");
    }
    this.setSize();
    this.setPosition();
}
//setPosition
BasisPopup.prototype.setPosition= function(){
     if(this .position.top){
          this.element.popupDiv.style["top" ]=this.position.top+ "px";
     }
     else{
          var availHeight=BasisUI.getWindowHeight(this.targetWindow);
          var scrollTop = BasisUI.getDocumentScrollTop(this.targetWindow.document);
          if (this .config["targetObj"] != "") {
               availHeight = $(this .config["targetObj"]).height();
               scrollTop = $(this.config["targetObj" ]).scrollTop();
          }
          var availTop=0;
          if(availHeight-this .size.height>0){
               availTop=(availHeight- this.size.height)/2 + scrollTop;
               this.element.popupDiv.style["top" ]=availTop+"px";
               if(this .config["showMask"]){
                    this.mask.setSize();
               }
          }else{
               availTop = 20 + scrollTop;
               this.element.popupDiv.style["top" ]=availTop+"px";
          }
     }
     if(this .position.left){
          this.element.popupDiv.style["left" ]=this.position.left+ "px";
     }
     else{
          var availWidth=BasisUI.getWindowWidth(this.targetWindow);
          var scrollLeft = BasisUI.getDocumentScrollLeft(this.targetWindow.document);
          if (this .config["targetObj"] != "") {
               availHeight = $(this .config["targetObj"]).height();
               scrollTop = $(this.config["targetObj" ]).scrollTop();
          }
          var availLeft=0;
          if(availWidth-this .size.width>0){
               availLeft=(availWidth- this.size.width)/2 + scrollLeft;
          }
          this.element.popupDiv.style["left" ]=availLeft+"px";
     }
}
//adjustPosition
BasisPopup.prototype.adjustPosition = function () {}
//build
BasisPopup.prototype.build = function () {
    this.element["popupDiv" ].appendChild(this.element[ "popupBorderTop"]);
    if (this .config["title"] != "") {
        this.element["headerDiv" ].innerHTML = this.config[ "title"];
        this.element["popupContent" ].appendChild(this.element[ "headerDiv"]);
    }
    this.element["popupContent" ].appendChild(this.element[ "contentDiv"]);
    this.element["popupContent" ].appendChild(this.element[ "BasisReturnBtn"]);
    this.element["popupContent" ].appendChild(this.element[ "BasisCloseDiv"]);
    this.element["popupDiv" ].appendChild(this.element[ "popupContent"]);

    this.element["popupSpan" ].appendChild(this.element[ "popupDiv"]);
    try {
        if (this .config["targetObj"] != "")
            $( this.config["targetObj" ]).append(this.element[ "popupSpan"]);
        else
            this.targetWindow.document.body.appendChild(this.element[ "popupSpan"]);
    }
    catch (ex) {
        //alert(this.targetWindow.document.body.innerHTML);
        //alert(ex.message);
    }
    this.element["popupDiv" ].appendChild(this.element[ "popupBorderBottom"]);

    if (this .config["hasArrow"]) {
        this.element["popupSpan" ].setAttribute("class", "BasisArrowPopup");
        this.element["popupSpan" ].setAttribute("className", "BasisArrowPopup");
        this.element["popupBorderTop" ].appendChild(this.element[ "popupArrow"]);
    }
}
//buildLoading
BasisPopup.prototype.buildLoading= function(){}
//buildContent
BasisPopup.prototype.buildContent = function () {}
//bindEvents
BasisPopup.prototype.bindEvents = function () {
    var me = this ;
    $(me.element[ "BasisReturnBtn"]).click(function () {
        me.element[ "BasisReturnBtn"].style.display = "none" ;
        me.element[ "BasisCloseDiv"].style.display = "" ;
        me.element[ "url"].setAttribute("src" , me.config["BasisReturnUrl"]);
        me.config[ "BasisReturnUrl"] = "" ;
    }) //chrome && safari click bug
    var QudsiPopupClose = function (){
        me.close();
        if (me.callBack.closeCallBack) {
            me.callBack.closeCallBack();
        }
    };
    BasisUI.BindEvent( this.element["BasisCloseDiv" ], "click", function () {
        QudsiPopupClose();
    });
}
//bindContentEvents
BasisPopup.prototype.bindContentEvents= function(){}
//show
BasisPopup.prototype.show= function(){
     this.setStyle();
     this.setClass();
     this.setSize();
     this.setPosition();
     this.bindEvents();
     this.bindContentEvents();
     this.build();
     this.buildLoading();
     this.buildContent();
     if(this .config.showMask){
          this.mask.show();
     }
     this.action["hasShow" ]=true;
}
BasisPopup.prototype.showModalDialog= function(){
    this.show();
    this.mask.show();
}
//close
BasisPopup.prototype.close = function () {
    if (BasisUI.browser.msie && this.config[ "onFocus"] == true ) {
        $( this.element.url).remove();
    }
    if (this .config["targetObj"] != "")
        $( this.config["targetObj" ]).find(this.element.popupSpan).remove();
    else if (this.element.popupSpan) {
        $( "*").find(this .element.popupSpan).remove();
    }

    BasisPopupMaxZindex( "remove");
    if (this .config["showMask"]) {
        this.mask.close();
    }
    this.action["hasShow" ] = false;
}
//hide
BasisPopup.prototype.hide = function () {
    var me = this ;
    me.config[ "content"].parents(".basis-popups" ).css("display", "none");
    me.config[ "content"].css("display" , "none");
    //for HtmlWrapPopup
    BasisPopupMaxZindex( "remove");
    if (this .config["showMask"]) {
        $( ".popups-mask").remove();
    }
    this.action["hasShow" ] = false;
}
//BasisPopup Return Url
BasisPopup.prototype.redirect = function (returnUrl, newUrl) {
    var me = this ;
    me.config[ "BasisReturnUrl"] = returnUrl;
    me.element[ "BasisReturnBtn"].style.display = "block" ;
    me.element[ "BasisCloseDiv"].style.display = "none" ;
    me.element[ "url"].setAttribute("src" , newUrl);
}
//addCallBack
BasisPopup.prototype.addCallBack= function(elementKey,listener){
     elementKey=elementKey.toLowerCase();
     if(this .element[elementKey]){
          this.callBack[elementKey].add(listener);
     }
}
//removeCallBack
BasisPopup.prototype.removeCallBack= function(elementKey,listener){
     elementKey=elementKey.toLowerCase();
     if(this .element[elementKey]){
          this.callBack[elementKey].remove(listener);
     }
}

//Start BasisUrlPopup
function BasisUrlPopup(param){
     this.base = new BasisPopup(param);
     BasisUI.extend( this,this .base);
     this.config["autoSize" ] = true;
     this.config["onFocus" ] = true;
     this.initContent();
}
BasisUrlPopup.prototype.initContent= function(){
     this.elementKey.push("loading" );
     this.element["loading" ]=this.targetWindow.document.createElement( "div");
     this.element["loading" ].setAttribute("class", "loading-popups");
     this.element["loading" ].setAttribute("className", "loading-popups");
     this.elementKey.push("url" );
     this.element["url" ]=this.targetWindow.document.createElement( "iframe");
     this.element["url" ].setAttribute("id", "basis-popup-iframe");
     this.element["url" ].setAttribute("border", "0");
     this.element["url" ].setAttribute("frameBorder", "0");
     this.element["url" ].setAttribute("scrolling", "no");
     this.element["url" ].setAttribute("src", this.config["content" ]);
     this.element["url" ].setAttribute("width",( this.size.width)+"px" );
     this.element["url" ].setAttribute("class", "basis-iframe-loading");
     this.element["url" ].setAttribute("className", "basis-iframe-loading");
}
BasisUrlPopup.prototype.bindContentEvents= function(){
    var me = this ;
    BasisUI.BindEvent(me.element[ "url"],"load" ,function(){
        me.element[ "loading"].style.display = "none" ;
        me.element[ "url"].setAttribute("class" ,"");
        me.element[ "url"].setAttribute("className" ,"");
    });
     if(this .config["autoSize"]){
          BasisUI.BindEvent(me.element[ "url"],"load" ,function(){
               try{
                    var obj=me.element["url" ];
                    if (obj.contentDocument && obj.contentDocument.body.offsetHeight){
                         obj.height = obj.contentDocument.body.scrollHeight;
                         obj.width = obj.contentDocument.body.scrollWidth;
                    }
                    else{
                         obj.height = obj.Document.body.scrollHeight;
                         obj.width = obj.Document.body.scrollWidth;
                    }
                    me.setUrlSize();
                    me.size.height=obj.height;
                    me.size.width=obj.width;
                    me.setPosition();
                    me.adjustPosition();                                                               
                    var contentWindow=obj.contentWindow;
                    contentWindow.closeParent= function () {
                         me.close();
                    };
                    contentWindow.customerFunction= function () {
                         for(var i=0;i<me.callBack["url"].count();i++){
                              me.callBack["url" ].item(i)();
                         }
                    };
               } catch(e){}
          });
     }
}
BasisUrlPopup.prototype.buildLoading= function(){
     this.element["loading" ].innerHTML="<span class='glyphicon glyphicon-repeat'></span><span>&nbsp;&nbsp;加载中...</span>";
     this.element["contentDiv" ].appendChild(this.element[ "loading"]);
     this.element["contentDiv" ].appendChild(this.element[ "url"]);
}
//End BasisUrlPopup
//Start BasisHtmlPopup
function BasisHtmlPopup(param){
     this.base = new BasisPopup(param);
     BasisUI.extend( this,this .base);
     this.initContent();
}
BasisHtmlPopup.prototype.initContent= function(){
     this.elementKey.push("contentDiv" );
     this.element["contentDiv" ]=this.targetWindow.document.createElement( "div");
     this.element["contentDiv" ].innerHTML=this.config[ "content"];
     this.element["contentDiv" ].setAttribute("class", "basis-html-content");
     this.element["contentDiv" ].setAttribute("className", "basis-html-content");
}
//End BasisHtmlPopup
//Start BasisHtmlWrapPopup
function BasisHtmlWrapPopup(param) {
    this.base = new BasisPopup(param);
    BasisUI.extend( this, this .base);
    this.initContent();
}
BasisHtmlWrapPopup.prototype.bindEvents = function () {
    var me = this ;
    this.element["BasisReturnBtn" ].style.display = "none";
    BasisUI.BindEvent( this.element["BasisCloseDiv" ], "click", function () {
        me.hide();
        if (me.callBack.closeCallBack) {
            me.callBack.closeCallBack();
        }
    });
}
BasisHtmlWrapPopup.prototype.initContent = function () {
    this.elementKey.push("contentDiv" );
    this.element["contentDiv" ] = this.targetWindow.document.createElement( "div");
    this.config["content" ].appendTo(this.element[ "contentDiv"]);
    this.config["content" ].css("display", "block");
    this.element["contentDiv" ].setAttribute("class", "basis-html-content");
    this.element["contentDiv" ].setAttribute("className", "basis-html-content");
    $(".basis-html-content").find(".displayNone").removeClass("displayNone");
}
//End BasisHtmlWrapPopup

/* Basis Common Popup Prototypes --------END
*********************************************/

/********************************************
Basis commonPopup sisters sites Objects
*********************************************/
//var BasisUrlNoMarginPopup;
//function BasisNoMarginPopupWindow(width, url, showMask, closeCallback, top, title, popupClass) {
//    var title = title || "" ,
//        popupClass = popupClass || null;
//    var urlPopupPara = { width: width, height: null, top: top, left: null, title: title, content: url, showMask: showMask, language: 'en-us' , closeCallBack: closeCallback, className: popupClass };
//    if (top == undefined) {
//        top = null;
//    }
//    BasisUrlNoMarginPopup = new BasisUrlPopup(urlPopupPara);
//    BasisUrlNoMarginPopup.size.width = width;
//    BasisUrlNoMarginPopup.show();
//}
//function resetBasisUrlNoMarginWidth(width) {
//    BasisUrlNoMarginPopup.size.width = width;
//    BasisUrlNoMarginPopup.element[ "url"].setAttribute("width" , width + "px");
//    BasisUrlNoMarginPopup.setSize();
//}
//function resetBasisUrlNoMarginHeight(height) {
//    BasisUrlNoMarginPopup.element[ "url"].setAttribute("height" , height + "px");
//    BasisUrlNoMarginPopup.size.height = height;
//    BasisUrlNoMarginPopup.setPosition();
//}
//function resetBasisUrlNoMarginAnimationHeight(currentHeight, newHeight) {
//    var t = 0, intervalsHeight = newHeight - currentHeight;
//    function changeHeight() {
//        BasisUrlNoMarginPopup.element[ "url"].setAttribute("height" , t * intervalsHeight / 30 + currentHeight + "px");
//        BasisUrlNoMarginPopup.size.height = t * intervalsHeight / 30 + currentHeight;
//        t++;
//        if (t <= 30)
//            setTimeout(changeHeight, 30);
//    }
//    changeHeight()
//}
var BasisFixedSizePopup;
function BasisFixedSizePopupWindow(width, height, url, showMask, closeCallback, top, title,className) {
    var title = title || "" ;
    var urlPopupPara = { width: width, height: height, top: top, left: null, title: title, content: url, showMask: showMask, language: 'en-us' , closeCallBack: closeCallback,className: className };
    if (top == undefined) {
        top = null;
    }
    BasisFixedSizePopup = new BasisUrlPopup(urlPopupPara);
    BasisFixedSizePopup.element[ "url"].setAttribute("height" , (BasisFixedSizePopup.size.height) + "px");
    BasisFixedSizePopup.size.width = width;
    BasisFixedSizePopup.config[ "autoSize"] = false ;
    BasisFixedSizePopup.show();
}

//var specialUrlPopupObj;
//function specialUrlPopupWindow(width,url, showMask, top, closeCallback, title, className) {
//    var title = title || "" ;
//    var top = top || null ;
//    var urlPopupPara = { width: width, height:null, top: top, title: title, content: url, showMask: showMask, closeCallBack: closeCallback, className: className };
//    specialUrlPopupObj = new BasisUrlPopup(urlPopupPara);
//    specialUrlPopupObj.size.width = width;
//    specialUrlPopupObj.show();
//}
//function resetSpecialUrlHeight(height) {
//    specialUrlPopupObj.element[ "url"].setAttribute("height" , height + "px");
//    specialUrlPopupObj.size.height = height;
//    specialUrlPopupObj.setPosition();
//}
//function specialUrlClose() {
//    specialUrlPopupObj.close();
//}

//var BasisHtmlPopupObj;
//function BasisHtmlPopupWindow(width,height, title, content, showMask, closeCallBack, top) {
//    var top = top || null ;
//    if(BasisHtmlPopupObj) {
//        if (BasisHtmlPopupObj.action["hasShow" ]) {
//            BasisHtmlPopupObj.close();
//        }
//        BasisHtmlPopupObj = null;
//    }
//    var htmlPopupPara = { width: width, height: height, top: top, left: null, title: title, content: content, showMask: showMask, language: 'en-us' , closeCallBack: closeCallBack };
//    BasisHtmlPopupObj = new BasisHtmlPopup(htmlPopupPara);
//    BasisHtmlPopupObj.size.width = width;
//    BasisHtmlPopupObj.show();
//}

//function BasisHtmlClose() {
//    BasisHtmlPopupObj.close();
//}

var specialHtmlPopupObj
function specialHtmlPopupWindow(width, height, title, content, showMask,className, closeCallBack, top) {
    var top = top || null ;
    if(specialHtmlPopupObj) {
        if (specialHtmlPopupObj.action["hasShow" ]) {
            specialHtmlPopupObj.close();
        }
        specialHtmlPopupObj = null;
    }
    var htmlPopupPara = { width: width, height: height, top: top, left: null, title: title, content: content, showMask: showMask, language: 'en-us' , closeCallBack: closeCallBack, className: className };
    specialHtmlPopupObj = new BasisHtmlPopup(htmlPopupPara);
    specialHtmlPopupObj.show();
}

function specialHtmlClose() {
    specialHtmlPopupObj.close();
}

var HtmlWrapPopupObj;
function HtmlWrapPopupWindow(width, height, title, content, showMask, closeCallBack, top,className) {
    var top = top || null ;
    if(HtmlWrapPopupObj) {
        if (HtmlWrapPopupObj.action["hasShow" ]) {
            HtmlWrapPopupObj.close();
        }
        HtmlWrapPopupObj = null;
    }
    var htmlWrapPopupPara = { width: width, height: height, top: top, left: null, title: title, content: content, showMask: showMask, language: 'en-us' , closeCallBack: closeCallBack,className:className };
    HtmlWrapPopupObj = new BasisHtmlWrapPopup(htmlWrapPopupPara);
    HtmlWrapPopupObj.size.width = width;
    HtmlWrapPopupObj.show();
}

function closeHtmlWrapPopup(closeCallback) {
    if (HtmlWrapPopupObj) {
        HtmlWrapPopupObj.hide();
    }

    if (closeCallback) {
        closeCallback();
    }
}

var BasisImagePopupObj;
function BasisImagePopupWindow(imageUrl, width, title,showMask) {
    var width = width || 300;
    var title = title || '' ;
    var imageHtml = "<img class='image-popup-content displayNone' src='" + imageUrl + "' />";
    var loadingHtml = "<div class='loading-popups' style='padding:50px 0;'><span class='glyphicon glyphicon-repeat'></span><span>&nbsp;&nbsp;加载中...</span></div>";
    var htmlPopupPara = {width: width, height: null, top: null, left: null , title: title, content: loadingHtml + imageHtml, showMask: showMask, language: 'en-us' , closeCallBack: null };
    BasisImagePopupObj = new BasisHtmlPopup(htmlPopupPara);
    BasisImagePopupObj.size.width = width;
    BasisImagePopupObj.show();
    $(".basis-popups").find("img.image-popup-content" ).load(function(){
        $(".basis-popups").find(".loading-popups").hide();
        $(this).show();
        var newWidth = this.width;
        var newHeight = this.height;
        var maxWidth = 1120;
        BasisImagePopupObj.size.width = newWidth + 60;
        if(newWidth>maxWidth){
            newWidth = maxWidth;
            BasisImagePopupObj.size.width = newWidth + 20;
        }
        BasisImagePopupObj.element[ "popupDiv"].setAttribute("width" , newWidth + "px");
        BasisImagePopupObj.size.height = newHeight;
        BasisImagePopupObj.element[ "popupDiv"].setAttribute("height" , newHeight + "px");
        BasisImagePopupObj.setSize();
        BasisImagePopupObj.setPosition();
    });
}
function BasisImagePopupClose(){
	BasisImagePopupObj.close();
}


//var BasisConfirmPopupObj;
//function BasisConfirmPopup(width, height, top, content, title, showMask, callbackFunction) {
//    var confirmPopupPara = {width: width, height: height, top: top, title: title, content: content, showMask: showMask };
//    BasisConfirmPopupObj = new BasisConfirmPopup(confirmPopupPara);
//    BasisConfirmPopupObj.addCallBack( "ok", callbackFunction);
//    BasisConfirmPopupObj.show();
//}

/*  Basis commonPopup sisters sites Objects -------END
*********************************************/

function closePopupLoading(obj) {
    $(obj).css( "top", "0" );
    $(obj).parent().find( "#loading-popups").css("display" , "none");
    $( "#popupWindowContent").css("height" , "auto");
}
function closePopupIframeLoading(obj) {
    if ($(obj).attr("src" ) != "" && $(obj).parent().find( "#loading-popups").css("display" ) == "block") {
        closePopupLoading(obj);
    }
}

function alertErrorMsgPopups(message,delay,width){
    var delay = delay || 1500;
    var width = width || 350;
    if(!$(".alert-message-popups").is(":visible")){
        var alertMessage = "<div class=\"popups-message-bg\"><p><span class='glyphicon glyphicon-exclamation-sign'></span>" + message + "</p></div>"
        specialHtmlPopupWindow(width,100,"",alertMessage,false,' alert-message-popups message-popups-error','','');
        closeErrorPop = setTimeout(specialHtmlClose, delay);
    }else{
        clearTimeout(closeErrorPop);
        specialHtmlClose();
    }
}
function alertSuccessMsgPopups(message,delay,width){
    var delay = delay || 1000 ;
    var width = width || 200;
    if(!$(".alert-message-popups").is(":visible")){
        var alertMessage = "<div class=\"popups-message-bg\"><p><span class='glyphicon glyphicon-ok-sign'></span>" + message + "</p></div>"
        specialHtmlPopupWindow(width,100,"",alertMessage,false,' alert-message-popups message-popups-success','','');
        closeSuccessPop = setTimeout(specialHtmlClose, delay);
    }else{
        clearTimeout(closeSuccessPop);
        specialHtmlClose();
    }
}


