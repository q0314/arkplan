var noScroll = true;
module.exports =  (function() {

    util.extend(NonSwipeableViewPager, ui.Widget);

    function NonSwipeableViewPager() {
        ui.Widget.call(this);
        this.render = function() {
            return JavaAdapter(
                com.stardust.autojs.core.ui.widget.JsViewPager, {
                    NoScrollViewPager: function(context, AttributeSet_attrs) {
                        this.super$(context, attrs);
                    },
                    NoScrollViewPager: function(context) {
                        this.super$(context);
                    },
                    setNoScroll: function(noScroll_) {
                        noScroll = noScroll_;
                    },
                    getNoScroll: function() {
                        return noScroll
                    },

                    scrollTo: function(x, y) {
                        this.super$scrollTo(x, y);
                    },
                    onTouchEvent: function(arg0) {
                        if (noScroll) {
                            return this.super$onTouchEvent(arg0);
                        } else {
                            return false;
                        }

                    },
                    onInterceptTouchEvent: function(arg0) {
                        if (noScroll) {
                            return this.super$onInterceptTouchEvent(arg0);
                        } else {
                            return false;
                        }
                    },
                },
                context
            );
        };
    }
    ui.registerWidget("non-swipeable-view-pager", NonSwipeableViewPager);
    return NonSwipeableViewPager;
})();