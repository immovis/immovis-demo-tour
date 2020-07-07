/*
 *  Name : Thumbnails Stack
 *  Description : Display a thumbnails stuck on the bottom
 *  Author : John Barounis
 *  Version : 0.0.2
*/

THEASYS.theme.autoLoadFunction('thumbnails','init');

THEASYS.theme.modules.thumbnails.initialized = false;

THEASYS.theme.modules.thumbnails.thumbnails_loaded = false;

THEASYS.theme.modules.thumbnails.init = function(){

    var html = `

    <div id="thumbnails-wrapper">
        <div id="thumbnails-toggle-wrapper">
            <div id="thumbnails-toggle">
                <span class="icon_images">
                    <img src="${vars.paths.static}/themes/${vars.theme}/assets/modules/thumbnails/img/images.png" width="21" height="21" alt="thumbnails">
                </span>
            </div>
        </div>
        <div id="thumbnails-tooltip" class="arrow_box"></div>
        <div id="thumbnails" class="owl-carousel"></div>
    </div>

    `;

    THEASYS.theme.prependHtml(html,document.getElementById('viewer_wrapper'));

    THEASYS.api.engine.execute('get','thumbnails',null,function(data){

        //Lets see if we are in editing mode
        var editing = THEASYS.renderer.vars.get('editing');

        //Get the embed options
        var options = THEASYS.renderer.vars.get('options');

        //If we are not in editing and thumbnails_enabled is 0 then do not proceed

        if( !editing && ( 'thumbnails_enabled' in options) && !parseInt( options.thumbnails_enabled, 10 ) ){

            return false;

        }

        var thumbnails_wrapper = $('#thumbnails-wrapper');

        if( 'thumbnails' in data && data.thumbnails.length ){

            //Create the thumbnails html

            var html = '';

            var thumbnails_sticky_panorama_title = 0;

            if( 'thumbnails_sticky_panorama_title' in options ){

                thumbnails_sticky_panorama_title = ~~options.thumbnails_sticky_panorama_title;

            }

            var sticky_display = 0;

            for( var i = 0, n = data.thumbnails.length; i < n; i++ ){

                if( thumbnails_sticky_panorama_title ){

                    if( data.thumbnails[i].title === '' ){

                        sticky_display = 0;

                    } else {

                        sticky_display = 1;

                    }

                } else {

                    sticky_display = 0;

                }

                html +='<div class="item" data-rnd="'+data.thumbnails[i].rnd+'"><div class="sticky'+(sticky_display?'':' hidden')+'">'+data.thumbnails[i].title+'</div><img alt="'+data.thumbnails[i].title+'" data-title="'+data.thumbnails[i].title+'" src="'+data.thumbnails[i].image+'"></div>';

            }

            var thumbnails = $('#thumbnails');

            //Add the thumbnails html to the dom element

            thumbnails.html(html);

            //lets use owlCarousel
            //make sure we include the library in the info.json file

            thumbnails.owlCarousel({
                loop:false,
                pagination:false,
                lazyLoad:true,
                autoWidth:true,
                dots : false,
                margin:10,
            });

            thumbnails_wrapper.fadeIn();

            if( ( 'thumbnails_enabled' in options ) ){

                if( !~~options.thumbnails_enabled ){

                    thumbnails_wrapper.addClass('hidden');

                } else {

                    if( ( 'thumbnails_visible_by_default' in options ) && parseInt( options.thumbnails_visible_by_default, 10 ) ){

                        thumbnails_wrapper.addClass('thumbnails-active');

                        $('#copyright').addClass('hidden');

                    }

                }

            }

            //Add click event on thumbnails toggle icon

            $('#thumbnails-toggle').on('click',function(){

                //The toggleThumbnailsStack function is attached to the theme.fn obj and it is created  later

                THEASYS.theme.modules.thumbnails.toggleThumbnailsStack();

            });

            //Add click event on thumbnail icon

            thumbnails.on('click','.item',function(e){

                e.preventDefault();

                var jthis = $(this);

                //Get panorama rnd

                var rnd =  jthis.data('rnd') || '';

                if( rnd !== '' ){

                    //Load new panorama on renderer

                    THEASYS.renderer.fetchPanorama({

                        l : rnd

                    });

                    //Fade out tooltip and then hide thumbnails stack if thumbnails_close_on_action options is 1

                    $('#thumbnails-tooltip').stop().fadeOut();

                    if( ~~options.thumbnails_close_on_action ){

                        thumbnails_wrapper.removeClass('thumbnails-active');

                    }

                    //Animate objects so to normalize with current view
                    // 100 is timeout interval. It means that process will run after 100 msecs.
                    //Set 0 for immediate run.

                    THEASYS.renderer.animateProcessObjects(100);

                }

                return false;

            });

            //Lets see if we havehover actions

            var thumbnailsHoverActions = 0;

            if( editing ){

                thumbnailsHoverActions = 1;

            } else {

                if( ( 'thumbnails_show_panorama_title_on_hover' in options ) && parseInt( options.thumbnails_show_panorama_title_on_hover, 10 ) ){

                    thumbnailsHoverActions = 1;

                }

            }

            //If we have hover actions then on mouseover display the tolltip if any, on mouseleave hide tooltip

            if( thumbnailsHoverActions ){

                var thumbnails_tooltip = $('#thumbnails-tooltip');

                thumbnails.on('mouseover','img',function(){

                    if( ( 'thumbnails_show_panorama_title_on_hover' in options ) && parseInt( options.thumbnails_show_panorama_title_on_hover, 10 ) ){

                        var jthis = $(this), tooltip_text = jthis.data('title');
                        if( tooltip_text === '') return false;

                        var thumbnails_wrapper_height = $('#thumbnails-wrapper').outerHeight();

                        thumbnails_tooltip.html( tooltip_text ).css({

                            bottom : thumbnails_wrapper_height + 13,
                            left : jthis.offset().left,
                            width : jthis.width(),

                        }).stop().fadeIn(200);

                    }

                }).on('mouseleave','img',function(){

                    thumbnails_tooltip.stop().fadeOut(200);

                });

            }

            //Add a bool variable to theme.vars for later use

            THEASYS.theme.modules.thumbnails.thumbnails_loaded = true;

            //Function so to autoselect thumbnail

            THEASYS.theme.modules.thumbnails.selectThumbnail();

        } else {

            thumbnails_wrapper.addClass('hidden');

        }

        $('#thumbnails-toggle-wrapper').animate({opacity:1},1000);

        THEASYS.renderer.event.on('loadedPanorama',function(){

            if( THEASYS.theme.modules.thumbnails.initialized ){

                THEASYS.theme.modules.thumbnails.selectThumbnail();

            }

        });

        THEASYS.renderer.event.on('resize',function(){

            var vr = THEASYS.renderer.vars.get('vr');
            var device = THEASYS.renderer.vars.get('device');

            if( device.isMobile ){

                var thumbnails_wrapper = $('#thumbnails-wrapper');

                if( thumbnails_wrapper.length ){

                    if( thumbnails_wrapper.hasClass('thumbnails-active') ){

                        var copyright_cloned = $('#copyright_cloned');

                        copyright_cloned.removeClass('hidden');

                    }

                }

            }

        });

        THEASYS.renderer.event.on('userAction',function(){

            THEASYS.theme.exec('menu','closeOnActions');

        });

        THEASYS.theme.modules.thumbnails.initialized = true;

    });

    THEASYS.renderer.event.on('toggleVr',function(vr){

        var isMobile = THEASYS.renderer.vars.get('device.isMobile');

        if( vr ){

            if( isMobile ){

                $('#thumbnails-wrapper').addClass('hidden');

            }

        } else {

            if( isMobile ){

                var thumbnails_wrapper = $('#thumbnails-wrapper');

                thumbnails_wrapper.removeClass('hidden');

                if( thumbnails_wrapper.length ){

                    if( thumbnails_wrapper.hasClass('thumbnails-active') ){

                        THEASYS.theme.exec('copyright','hide');

                    }

                }

            }

        }

    });

};

THEASYS.theme.modules.thumbnails.api = function( action, key, value ){

    if( key === 'thumbnails' ){

        switch( action ){

            case'set':

                var val = -1;

                if( value !== undefined && value !== null && !isNaN(value) ){

                    val = parseInt(value,10);

                }

                this.toggleThumbnailsStack(val);

            break;

        }

    }

};

THEASYS.theme.modules.thumbnails.listenToEdits = function( obj ){

    for( var k in obj ){

        switch( k ){

            case'thumbnails_enabled':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.thumbnails_enabled',value);

                if( value ){

                    $('#thumbnails-wrapper').removeClass('hidden');

                } else {

                    $('#thumbnails-wrapper').addClass('hidden');

                }

            break;

            case'thumbnails_show_panorama_title_on_hover':

                THEASYS.renderer.vars.set('options.thumbnails_show_panorama_title_on_hover',+obj[k]);

            break;

            case'thumbnails_sticky_panorama_title':

                THEASYS.renderer.vars.set('options.thumbnails_sticky_panorama_title',+obj[k]);

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.thumbnails_sticky_panorama_title',value);

                $('#thumbnails-wrapper').find('.item img').each(function(){

                    var jthis = $(this);

                    var title = jthis.data('title');

                    if( title === '' ){

                        jthis.parent().find('.sticky').addClass('hidden');

                    } else {

                        if( value ){

                            jthis.parent().find('.sticky').removeClass('hidden');

                        } else {

                            jthis.parent().find('.sticky').addClass('hidden');

                        }

                    }

                });

            break;

            case'thumbnails_visible_by_default':

                THEASYS.renderer.vars.set('options.thumbnails_visible_by_default',+obj[k]);

            break;

            case'thumbnails_close_on_action':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.thumbnails_close_on_action',value);

            break;

        }

    }

};

THEASYS.theme.modules.thumbnails.selectThumbnail = function(){

    //Check to see thumbnails loaded

    if( !THEASYS.theme.modules.thumbnails.thumbnails_loaded ){

        return false;

    }

    //Get cussrent loaded obj from renderer

    var obj = THEASYS.renderer.vars.get('obj');

    if( obj && ('rnd' in obj) && obj.rnd !== '' ){

        var thumbnails = $('#thumbnails');

        thumbnails.find('.item').removeClass('active');
        thumbnails.find('.item[data-rnd="'+obj.rnd+'"]').addClass('active');

    }

};

THEASYS.theme.modules.thumbnails.toggleThumbnailsStack = function(state){

    var thumbnails_wrapper = $('#thumbnails-wrapper');

    if( state !== undefined ){

        if( isNaN(state) ){

            return false;

        }

        var state = parseInt(state,10);

        if( state === 1 ){

            thumbnails_wrapper.addClass('thumbnails-active');

        } else if( state === 0 ) {

            thumbnails_wrapper.removeClass('thumbnails-active');

        } else {

            thumbnails_wrapper.toggleClass('thumbnails-active');

        }

    } else {

        thumbnails_wrapper.toggleClass('thumbnails-active');

    }

    var copyright_viewer = THEASYS.renderer.vars.get('options.copyright_viewer');

    if( ~~copyright_viewer ){

        if( !thumbnails_wrapper.hasClass('thumbnails-active') ){

            window.requestTimeout(function() {

                THEASYS.theme.exec('copyright','toogleHidden');

            }, 800);

        } else {

            THEASYS.theme.exec('copyright','toogleHidden');

        }

    }

};
