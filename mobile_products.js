(function() {
    var ready = function() {
        var Constants = {
            listClass: "#category-tab .list"
        };

        var $productContainer = $(".product-container"),
            $tabContent = $(".tab-content"),
            $categoryTab = $("#category-tab"),
            $listInMyTab = $(".nav-tabs li"),
            $buyInfo = $('.buy-info'),
            $walletTabPane = $('.tabpane0'),
            $fundTabPane = $('.tabpane1'),
            $peTabPane = $('.tabpane2');

        var startPoint = {
            x: 0,
            y: 0,
            scrollLeft: 0 // used to determine the next screen index
        };

        var endPoint = {
            x: 0,
            y: 0
        };

        var tempPoint = {
            x: 0,
            y: 0
        };

        var divWidth = $productContainer.width();

        var screenNumber = $tabContent.width() / divWidth;

        //-1 for valid, 0 for vertical, 1 for horizontal
        var touchDirection = -1;

        var getNextScreenIndex = function(direction) {
           var times = parseInt(startPoint.scrollLeft / divWidth);
           var slope = Math.abs((endPoint.y - startPoint.y) / (endPoint.x - startPoint.x));
           var distance = Math.abs(endPoint.x - startPoint.x);

            if(direction == 1) {
                if(times < screenNumber - 1) {
                    if (slope < 1.732 && distance > divWidth / 2)
                        return times + 1;
                    else
                        return times;
                }
                else { // Last screen
                    return times;
                }
            }
            else if (direction == -1) {
                if(times == 0) { // First screen
                    return times;
                }
                else {
                    if (slope < 1.732 && distance > divWidth / 2)
                        return times - 1;
                    else
                        return times;
                }
            }
        };

        var getCurrentTabPane = function() {
            return $('.tabpane' + parseInt(startPoint.scrollLeft / divWidth));
        };

        var touchMoveProcess = function(e) {
            var offsetX, offsetY;

            switch (touchDirection) {
                case -1:
                    endPoint.x = e.originalEvent.changedTouches[0].pageX;
                    endPoint.y = e.originalEvent.changedTouches[0].pageY;

                    offsetX = endPoint.x - tempPoint.x;
                    offsetY = endPoint.y - tempPoint.y;

                    tempPoint.x = endPoint.x;
                    tempPoint.y = endPoint.y;

                    if (offsetX != 0 && offsetY == 0){
                        $productContainer.scrollLeft($productContainer.scrollLeft() - offsetX);
                        touchDirection = 1;
                    }
                    else if (offsetX == 0 && offsetY != 0){
                        getCurrentTabPane().scrollTop(getCurrentTabPane().scrollTop() - offsetY);
                        touchDirection = 0;
                    }
                    else if (offsetX != 0 && offsetY != 0) {
                        if (Math.abs(offsetX / offsetY) > 1){
                            $productContainer.scrollLeft($productContainer.scrollLeft() - offsetX);
                            touchDirection = 1;
                        }
                        else {
                            getCurrentTabPane().scrollTop(getCurrentTabPane().scrollTop() - offsetY);
                            touchDirection = 0;
                        }
                    }
                    break;
                case 1:
                    endPoint.x = e.originalEvent.changedTouches[0].pageX;
                    offsetX = endPoint.x - tempPoint.x;

                    tempPoint.x = endPoint.x;
                    tempPoint.y = endPoint.y;

                    $productContainer.scrollLeft($productContainer.scrollLeft() - offsetX);
                    break;
                case 0:
                    endPoint.y = e.originalEvent.changedTouches[0].pageY;
                    offsetY = endPoint.y - tempPoint.y;

                    tempPoint.x = endPoint.x;
                    tempPoint.y = endPoint.y;

                    getCurrentTabPane().scrollTop(getCurrentTabPane().scrollTop() - offsetY);
                    break;
                default :
                    break;
            }
        };

        var handleProductContainTouch = function(e) {
            switch (e.type) {
                case "touchstart":
                    e.preventDefault();
                    startPoint.x = e.originalEvent.touches[0].pageX;
                    startPoint.y = e.originalEvent.touches[0].pageY;
                    startPoint.scrollLeft = $productContainer.scrollLeft();
                    tempPoint.x = startPoint.x;
                    tempPoint.y = startPoint.y;
                    break;
                case "touchmove":
                    e.preventDefault();

                    touchMoveProcess(e);
                    break;
                case "touchend":
                    endPoint.x = e.originalEvent.changedTouches[0].pageX;
                    endPoint.y = e.originalEvent.changedTouches[0].pageY;
                    touchDirection = -1;

                    var nextScreenIndex = startPoint.x - endPoint.x < 0 ? getNextScreenIndex(-1) : getNextScreenIndex(1);
                    $productContainer.animate({scrollLeft: divWidth * nextScreenIndex}, 200);

                    $listInMyTab.removeClass("active");
                    $(Constants.listClass + nextScreenIndex).addClass("active");
                    break;
            }
        };

        var handleTabListClick = function() {
            var screenIndex = parseInt($(this).attr("class").slice(-1));
            $productContainer.animate({scrollLeft: divWidth * screenIndex});
            $listInMyTab.removeClass("active");
            $(this).addClass("active");
        };

        var bindEvents = function() {
            $productContainer.on("touchstart", handleProductContainTouch);
            $productContainer.on("touchend", handleProductContainTouch);
            $productContainer.on("touchmove", handleProductContainTouch);
            $categoryTab.on("click", "li", handleTabListClick)
        };

        var init = function() {
            // set product container's height
            var tabHeight = $(window).height() - $categoryTab.innerHeight() - $buyInfo.innerHeight();

            $peTabPane.height(tabHeight);
            $walletTabPane.height(tabHeight);
            $fundTabPane.height(tabHeight);
        };

        bindEvents();
        init();
    };

    $(document).ready(ready);
}).call();
