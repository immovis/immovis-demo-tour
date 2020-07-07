/*
 *  Name : ContextMenu
 *  Description : Displays a context menu on right click
 *  Author : John Barounis
 *  Version : 0.0.1
*/

THEASYS.theme.autoLoadFunction('contextMenu','init');

THEASYS.theme.modules.contextMenu.initialized = false;

THEASYS.theme.modules.contextMenu.init = function(){

    var options = THEASYS.renderer.vars.get('options');
    var device = THEASYS.renderer.vars.get('device');
    var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');

    if( device.isMobile ){

        return false;

    }

    var hasContextMenu = false;

    if( ( THEASYS.cache.obj.tours[tour_rnd].tour.domain_specific === 0 && ~~options.share_context_menu ) || ~~options.copyright_context_menu ){

        hasContextMenu = true;

    }

    if( !hasContextMenu ){

        $.contextMenu( 'destroy' );

        document.addEventListener("contextmenu", function (e) {

            e.preventDefault();

        }, false);

    } else {

        $(document.body).on("contextmenu:hide",function(e){

            THEASYS.renderer.vars.set('isUserInteracting',false);
            THEASYS.renderer.vars.set('autoRotationTemporarilyDisabled',false);
            THEASYS.renderer.vars.set('isObjectInteracting',true);

            var renderer = THEASYS.renderer.vars.get('renderer');

            if( renderer ){

                $(renderer.domElement).trigger('mouseup');

            }

        });

        $(document.body).on("contextmenu:hidden", function(e){

            THEASYS.renderer.vars.set('isUserInteracting',false);
            THEASYS.renderer.vars.set('isObjectInteracting',true);

        });

        $.contextMenu({

            selector: '#viewer',
            animation: {duration: 0, show: 'show', hide: 'hide'},

            build: function($trigger, e) {

                var default_items = {};

                if( THEASYS.cache.obj.tours[tour_rnd].tour.domain_specific === 0 && ~~options.share_context_menu ){

                    default_items['share'] = {

                        name: "Share",
                        callback: function(key, options) {

                            THEASYS.theme.exec('share','load');

                        }

                    };

                    if( ~~options.copyright_context_menu ){

                        default_items['share_sep'] = "---------";

                    }

                }

                if( ~~options.copyright_context_menu ){

                    var title = options.copyright_context_menu_title === '' ? 'About Theasys' : options.copyright_context_menu_title;

                    var url = options.copyright_context_menu_url === '' ? THEASYS.fn.u('') : THEASYS.fn.parse_url(options.copyright_context_menu_url);

                    default_items['copyright'] = {

                        name: title,
                        className: 'contextmenu_copyright',
                        callback: function(key, options) {

                            var link = document.createElement('a');
                            link.href = url;
                            link.target = '_blank';
                            link.rel = 'noopener';
                            document.body.appendChild(link);
                            link.click();

                        }

                    };

                }

                THEASYS.renderer.vars.set('autoRotationTemporarilyDisabled',true);
                THEASYS.renderer.vars.set('isUserInteracting',false);
                THEASYS.renderer.vars.set('isObjectInteracting',true);

                $('#viewer').trigger('mouseup');

                var ret = { items : {} };

                var extra_items={};
                var items = $.extend({}, extra_items, default_items);
                ret.items=items;

                return ret;

            }

        });

        if( THEASYS.renderer.vars.get('editing') ){//editing

            var title = options.copyright_context_menu_title === '' ? 'About Theasys' : options.copyright_context_menu_title;

            $('.context-menu-item.contextmenu_copyright').find('span').text(title);

        }

    }

    THEASYS.theme.modules.contextMenu.initialized = true;

};

THEASYS.theme.modules.contextMenu.listenToEdits = function( obj ){

    for( var k in obj ){

        switch( k ){

            case'share_context_menu':

                THEASYS.renderer.vars.set('options.share_context_menu',+obj[k]);

                this.init();

            break;

        }

    }

};
