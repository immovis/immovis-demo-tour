/*
 *  Name : info_panel
 *  Description : Displays info panel
 *  Author : John Barounis
 *  Version : 0.0.1
*/

THEASYS.theme.modules.info_panel = {

    initialized : false,

    opened : false,

    init : function(content) {

        var that = this;

        var html = `

            <div id="info_panel">
                <div id="info_panel_content">
                    <div id="info_panel_close" class="hidden0">
                        <img src="${vars.paths.static}/themes/${vars.theme}/assets/modules/info_panel/img/close.png" alt="close">
                    </div>
                    <div id="info_panel_content_html"></div>
                </div>
            </div>
            <div id="info_panel_overlay"></div>

        `;

        THEASYS.theme.appendHtml(html);

        $('#info_panel_close').on('click touchmove',function(){

            that.close();

        });

        $('#info_panel_overlay').on('click touchmove',function(){

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

        $('#info_panel').fadeOut(function(){

            $('#info_panel_content_html').html('').css({height:'unset'});

        });

        $('#info_panel_overlay').fadeOut();

        THEASYS.renderer.vars.set('autoRotationTemporarilyDisabled',false);

        this.opened = false;

    },

    load : function(html,callback) {

        if( !this.initialized ){

            this.init();

        }

        var ww = $(window);

        $('#info_panel_overlay').css({width:ww.width(),height:ww.height()}).fadeIn();

        $('#panorama-loader').fadeIn();

        var info_panel_content_html = $('#info_panel_content_html');

        info_panel_content_html.html(html);

        var info_panel_imgs = info_panel_content_html.find('img');

        var info_panel_imgs_length = info_panel_imgs.length;

        if( info_panel_imgs_length ){

            var that = this;

            var waitImgDone = function() {

                info_panel_imgs_length--;

                if (!info_panel_imgs_length){

                    var info_panel = $('#info_panel');
                    info_panel.fadeIn();

                    var height = info_panel.outerHeight();

                    info_panel_content_html.css({height:height});

                    $('#panorama-loader').hide();

                    that.opened = true;

                    if( typeof callback === 'function' ){

                        callback();

                    }

                }

            };

            if( info_panel_imgs ){

                info_panel_imgs.each(function(){

                    $(this).on('load',waitImgDone).on('error',waitImgDone);

                });

            }

        } else {

            var info_panel = $('#info_panel');
            info_panel.fadeIn();

            var height = info_panel.outerHeight();

            info_panel_content_html.css({height:height});

            $('#panorama-loader').hide();

            this.opened = true;

            if( typeof callback === 'function' ){

                callback();

            }

        }

    },

    adjust : function(){

        if( !this.initialized ){

            return false;

        }

        if( !this.opened ){

            return false;

        }

        var ww = $(window);

        $('#info_panel_overlay').css({width:ww.width(),height:ww.height()});

        var info_panel = $('#info_panel');

        if( info_panel.is(':visible') ){

            var height = info_panel.outerHeight();

            var cheight = $('#info_panel_content_html').height();

            //if( cheight > height ){

            $('#info_panel_content_html').css({height:height});

            //}

        }

    },

};
