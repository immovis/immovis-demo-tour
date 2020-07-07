/*
 *  Name : Popup
 *  Description : Displays popup
 *  Author : John Barounis
 *  Version : 0.0.1
*/

THEASYS.theme.modules.popup = {

    initialized : false,

    opened : false,

    init : function(content) {

        var html = `
            <div id="popup">
                <div id="popup-close" class="hidden0">
                    <img src="${vars.paths.static}/themes/${vars.theme}/assets/modules/popup/img/close.png" alt="close popup">
                </div>
                <div id="popup-content"></div>
            </div>
            <div id="popup_overlay"></div>
        `;

        THEASYS.theme.appendHtml(html);

        var that = this;

        $('#popup-close').on('click',function(){

            that.close();

        });

        $('#popup_overlay').on('click',function(){

            that.close();

        });

        $(document).on('keyup',function( e ){

            if( e.which === 27 ){

                that.close();

                return false;

            }

        });

        $(window).on('resize',function(){

            that.adjust();

        });

        this.initialized = true;

    },

    close : function(){

        $('#popup').fadeOut(function(){

            $('#popup-content').html('');

        });

        $('#popup_overlay').fadeOut();

        THEASYS.renderer.vars.set('autoRotationTemporarilyDisabled',false);

        this.opened = false;

    },

    load : function(params,type) {

        if( !this.initialized ){

            this.init();

        }

        var obj = {

            title : '',
            src : '',
            url : '',
            action : null,
            onClose : null,

        };

        Object.assign(obj,params);

        var ww = $(window);

        $('#popup_overlay').css({width:ww.width(),height:ww.height()}).fadeIn();

        $('#panorama-loader').fadeIn();

        $('#popup').data('type',type);
        $('#popup').data('obj',obj);

        var that = this;

        switch( type ){

            case 'video':

                var dimensions = that.calculate();

                var hasTitle = obj.action.title !== '';

                var html = '';

                if( hasTitle ){

                    html += '<div class="popup-title">'+obj.action.title+'</div>';

                }

                html += '<iframe class="iframe_video" style="width:'+dimensions.width+'px;height:'+dimensions.height+'px;" src="'+obj.src+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>';

                $('#popup-content').html(html);

                $('#popup').css({

                    width : dimensions.width,

                    height : dimensions.width,

                    left : dimensions.left,

                    top : dimensions.top,

                }).fadeIn();

                that.opened = true;

                $('#panorama-loader').fadeOut();

            break;

            case 'image':

                var img = new Image();
                img.src = obj.src;
                img.onload = function() {

                    var dimensions = that.calculate();

                    var hasTitle = obj.action.title !== '';

                    var html = '';

                    if( hasTitle ){

                        html += '<div class="popup-title">'+obj.action.title+'</div>';

                    }

                    html += '<img src="'+img.src+'" alt="Image">';

                    $('#popup-content').html(html);

                    $('#popup').css({

                        width : dimensions.width,

                        height : dimensions.width,

                        left : dimensions.left,

                        top : dimensions.top,

                    }).fadeIn();

                    that.opened = true;

                    $('#panorama-loader').fadeOut();

                }

            break;

        }

    },

    calculate : function(){

        var data = $('#popup').data();

        var type = data.type;
        var obj = data.obj;

        var ww = $(window);

        var panorama_width = ww.width();
        var panorama_height = ww.height();

        var dimensions = {

            width : 0,
            height : 0,
            top : 0,
            left : 0,
            type : type,

        };

        switch( type ){

            case 'video':

                var hasTitle = obj.action.title !== '';

                var image_width = 1024;
                var image_height = 576;

                var title_offset = 0;
                var percentage_offset = 35;

                var topBottom_offset = 80;

                if( panorama_width <= 480  ){

                    percentage_offset = 25;

                }

                if( hasTitle ){

                    title_offset = 41;

                }

                var image_ratio = image_width / image_height;

                var max_image_width = panorama_width - ((percentage_offset/100) * panorama_width);

                if( max_image_width > image_width ){

                    max_image_width = image_width;

                }

                if( max_image_width < 320 ){

                    max_image_width = 320 - ((percentage_offset/100) * 320);

                }

                var popup_height = (max_image_width / image_ratio);

                var popup_width = max_image_width;

                if( popup_height + topBottom_offset + title_offset > panorama_height ){

                    var max_image_height = panorama_height - ((percentage_offset/100) * panorama_height);

                    popup_width = ( max_image_height *  popup_width ) / (popup_height );

                    popup_height = max_image_height;

                }

                popup_width = parseInt(popup_width,10);
                popup_height = parseInt(popup_height,10);

                dimensions.width = popup_width;
                dimensions.height = popup_height;
                dimensions.left = (panorama_width - popup_width) /2;
                dimensions.top = ((panorama_height - popup_height) /2) - (title_offset / 2);

                $('#popup').find('iframe.iframe_video').css({

                    width : dimensions.width,
                    height : dimensions.height,

                });

            break;

            case 'image':

                var hasTitle = obj.action.title !== '';

                var image_width = obj.action.image_size[0];
                var image_height = obj.action.image_size[1];

                var title_offset = 0;
                var percentage_offset = 35;

                var topBottom_offset = 80;

                if( panorama_width <= 480  ){

                    percentage_offset = 25;

                }

                if( hasTitle ){

                    title_offset = 41;

                }

                var image_ratio = image_width / image_height;

                var max_image_width = panorama_width - ((percentage_offset/100) * panorama_width);

                if( max_image_width > image_width ){

                    max_image_width = image_width;

                }

                if( max_image_width < 320 ){

                    max_image_width = 320 - ((percentage_offset/100) * 320);

                }

                var popup_height = (max_image_width / image_ratio);

                var popup_width = max_image_width;

                if( popup_height + topBottom_offset + title_offset > panorama_height ){

                    var max_image_height = panorama_height - ((percentage_offset/100) * panorama_height);

                    popup_width = ( max_image_height *  popup_width ) / (popup_height );

                    popup_height = max_image_height;// - title_offset;

                }

                dimensions.width = popup_width;
                dimensions.height = popup_height;
                dimensions.left = (panorama_width - popup_width) /2;
                dimensions.top = ((panorama_height - popup_height) /2) - (title_offset / 2);

            break;

        }

        return dimensions;

    },

    adjust : function(){

        if( !this.initialized ){

            return false;

        }

        if( !this.opened ){

            return false;

        }

        var ww = $(window);

        $('#popup_overlay').css({width:ww.width(),height:ww.height()});

        var dimensions = this.calculate();

        $('#popup').css({

            width : dimensions.width,
            height : dimensions.height,
            left : dimensions.left,
            top : dimensions.top,

        });

    },

};
