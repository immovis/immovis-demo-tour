/*
 *  Name : Menu
 *  Description : Displays a menu
 *  Author : John Barounis
 *  Version : 0.0.1
*/

THEASYS.theme.autoLoadFunction('menu','init');

THEASYS.theme.modules.menu.initialized = false;

THEASYS.theme.modules.menu.init = function( callback ){

    var options = THEASYS.renderer.vars.get('options');

    var option_menu_visible = ~~options.menu_visible;

    var editing = THEASYS.renderer.vars.get('editing');

    var device = THEASYS.renderer.vars.get('device');

    THEASYS.theme.appendHtml('<div id="viewer_menu"></div>',document.getElementById('viewer_wrapper'));

    if( !option_menu_visible && !editing ){

        return false;

    }

    if( THEASYS.theme.modules.menu.created ){

        return false;

    }

    var html = '';

    html = '<div class="viewer_menu_wrapper">';
    html += '   <div class="viewer_menu-bars">';

    //lets load the menu icons

    var innerHtml = '';

    //GYROSCOPE

    var menu_visible_gyroscope_exists = 0;

    if( device.isMobile ){

        if( editing ){

            menu_visible_gyroscope_exists = 1;

        } else {

            if( ~~options.gyroscope ){

                menu_visible_gyroscope_exists = 1;

            }

        }

        if( menu_visible_gyroscope_exists ){

            html += '<span class="menubars toggle_gyroscope'+(~~options.gyroscope === 0 ? ' hidden':'')+'"><img src="'+THEASYS.vars.paths.static+'/themes/'+THEASYS.vars.theme+'/assets/modules/menu/img/gyroscope.png" alt="Gyroscope"></span>';

        }

    }

    //VR

    var menu_visible_vr_mode_exists = 0;

    if( editing ){

        menu_visible_vr_mode_exists = 1;

    } else {

        if( ~~options.vr_mode ){

            menu_visible_vr_mode_exists = 1;

        }

    }

    if( menu_visible_vr_mode_exists ){

        html += '<span class="menubars toggle-vr'+(~~options.vr_mode === 0 ? ' hidden':'')+'"><img src="'+THEASYS.vars.paths.static+'/themes/'+THEASYS.vars.theme+'/assets/modules/menu/img/vr.png" alt="vr"></span>';

    }


    //QUALITY

    var menu_visible_quality_exists = 0;

    if( device.isMobile ){

        if( editing ){

            menu_visible_quality_exists = 1;

        } else {

            if( ~~options.quality ){

                menu_visible_quality_exists = 1;

            }

        }

        if( menu_visible_quality_exists ){

            html += '<span class="menubars toggle_quality'+(~~options.quality === 0 ? ' hidden':'')+'"><img src="'+THEASYS.vars.paths.static+'/themes/'+THEASYS.vars.theme+'/assets/modules/menu/img/hd.png" alt="HD Quality"></span>';

        }

    }

    //INFO

    html += '<span class="menubars toggle-info hidden"><img src="'+THEASYS.vars.paths.static+'/themes/'+THEASYS.vars.theme+'/assets/modules/menu/img/info.png" alt="Info"></span>';

    //MENU DOTS

    html += '<span class="menubars menu_dots"><img src="'+THEASYS.vars.paths.static+'/themes/'+THEASYS.vars.theme+'/assets/modules/menu/img/dots.svg" alt="Menu"></span></div>';

    //SUB MENU
    html += '       <div class="viewer_menu-submenu"></div>';

    html +='    </div>';
    html +='</div>';

    var viewer_menu = $('#viewer_menu');

    viewer_menu.append(html);

    this.createEvents();

    this.createSubmenu(function(){

        if( option_menu_visible ){

            viewer_menu.animate({opacity:1},500);

        }

        if( parseInt( options.menu_opened_by_default, 10 ) ){

            if( parseInt( options.menu_visible, 10) ){

                viewer_menu.find('.viewer_menu-bars .menu_dots').trigger('click');

            }

        }

        callback();

    });

    this.initialized = true;

    if( option_menu_visible ){

        viewer_menu.animate({opacity:1},500);

    }

    this.closeOnActions();

    this.autoRotationMenu();

    viewer_menu.on('click',function(){

        //THEASYS.theme.modules.menu.closeOnActions();

    });

    THEASYS.renderer.event.on('userAction',function(){

        THEASYS.theme.modules.menu.closeOnActions();

    });

    THEASYS.renderer.event.on('gyroscope',function(){

        THEASYS.theme.modules.menu.gyroscopeMenu();

    });

    THEASYS.renderer.event.on('autoRotation',function(){

        THEASYS.theme.modules.menu.autoRotationMenu();

    });

    THEASYS.renderer.event.on('hotspotsToggle',function(hotspotsDisplay){

        if( hotspotsDisplay ){

            $('#viewer_menu').find('.toggle-hotspots').addClass('selected');

        } else {

            $('#viewer_menu').find('.toggle-hotspots').removeClass('selected');

        }

    });

    THEASYS.renderer.event.on('toggleVr',function( vr ){

        var isMobile = THEASYS.renderer.vars.get('device.isMobile');

        if( vr ){

            $('#viewer_menu .toggle-vr').addClass('active');

            if( isMobile ){

                $('#viewer_menu').addClass('hidden');

            }

        } else {

            $('#viewer_menu .toggle-vr').removeClass('active');

            if( isMobile ){

                $('#viewer_menu').removeClass('hidden');

            }

        }

    });

};

THEASYS.theme.modules.menu.api = function( action, key, value ){

    if( key === 'menu' ){

        switch( action ){

            case'set':

                var val = -1;

                if( value !== undefined && value !== null && !isNaN(value) ){

                    val = parseInt(value,10);

                }

                this.toggle(val);

            break;

        }

    }

};

THEASYS.theme.modules.menu.listenToEdits = function( obj ){

    for( var k in obj ){

        switch( k ){

            case'menu_visible':

                var value = +obj[k];

                if( value ){

                    $('#viewer_menu').find('.menu_dots').removeClass('hidden');

                } else {

                    $('#viewer_menu').find('.menu_dots').addClass('hidden');

                }

                THEASYS.renderer.vars.set('options.menu_visible',value);

                THEASYS.theme.exec('shadow','display');

            break;

            case'auto_rotation':

                if( !obj[k] ){

                    $('#viewer_menu').find('.toggle_auto_rotate').addClass('hidden');

                } else {

                    $('#viewer_menu').find('.toggle_auto_rotate').removeClass('hidden');

                }

                THEASYS.renderer.vars.set('options.auto_rotation',+obj[k]);

            break;

            case'fullscreen':

                if( !obj[k] ){

                    $('#viewer_menu').find('.toggle_full_screen').addClass('hidden');

                } else {

                    $('#viewer_menu').find('.toggle_full_screen').removeClass('hidden');

                }

                THEASYS.renderer.vars.set('options.fullscreen',+obj[k]);

            break;

            case'vr_mode':

                var value = +obj[k];

                if( !value ){

                    $('#viewer_menu').find('.toggle-vr').addClass('hidden');

                } else {

                    $('#viewer_menu').find('.toggle-vr').removeClass('hidden');

                }

                THEASYS.renderer.vars.set('options.vr_mode',value);

                THEASYS.theme.exec('shadow','display');

            break;

            case'gyroscope':

                var value = +obj[k];

                if( !value ){

                    $('#viewer_menu').find('.toggle_gyroscope').addClass('hidden');

                } else {

                    $('#viewer_menu').find('.toggle_gyroscope').removeClass('hidden');

                }

                THEASYS.renderer.vars.set('options.gyroscope',value);

                THEASYS.theme.exec('shadow','display');

            break;

            case'quality':

                var value = +obj[k];

                if( !value ){

                    $('#viewer_menu').find('.toggle_quality').addClass('hidden');

                } else {

                    $('#viewer_menu').find('.toggle_quality').removeClass('hidden');

                }

                THEASYS.renderer.vars.set('options.quality',value);

                THEASYS.theme.exec('shadow','display');

            break;

            case'background_sound':

                if( !obj[k] ){

                    $('#viewer_menu').find('.toggle-sounds').addClass('hidden');

                } else {

                    $('#viewer_menu').find('.toggle-sounds').removeClass('hidden');

                }

                THEASYS.renderer.vars.set('options.background_sound',+obj[k]);

            break;

            case'menu_close_on_actions':

                THEASYS.renderer.vars.set('options.menu_close_on_actions',+obj[k]);

            break;

            case'share_menu':

                if( !obj[k] ){

                    $('#viewer_menu').find('.menu_share').addClass('hidden');

                } else {

                    $('#viewer_menu').find('.menu_share').removeClass('hidden');

                }

                THEASYS.renderer.vars.set('options.share_menu',+obj[k]);

            break;

            case'hotspots_display':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.hotspots_display',value);

                var thh = $('#viewer_menu').find('.toggle-hotspots').hasClass('thh');

                if( !thh ){

                    if( !value ){

                        $('#viewer_menu').find('.toggle-hotspots').addClass('hidden');

                    } else {

                        $('#viewer_menu').find('.toggle-hotspots').removeClass('hidden');

                    }

                }

            break;

        }

    }

};


THEASYS.theme.modules.menu.created = 0;
THEASYS.theme.modules.menu.created_submenu = 0;

THEASYS.theme.modules.menu.createEvents = function(data){

    //if( !THEASYS.theme.modules.menu.created ){

    //    return false;

    //}

    var options = THEASYS.renderer.vars.get('options');
    var device = THEASYS.renderer.vars.get('device');
    var editing = THEASYS.renderer.vars.get('editing');
    var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');

    var viewer_menu = $('#viewer_menu');

    var option_menu_visible = ~~options.menu_visible;

    var menu_visible_event_click = 0;

    if( editing ){

        menu_visible_event_click = 1;

    } else {

        if( option_menu_visible ){

            menu_visible_event_click = 1;

        }

    }

    if( menu_visible_event_click ){

        viewer_menu.on('click','.viewer_menu-bars .menu_dots',function(){

            THEASYS.theme.modules.menu.toggle();

        });

    }

    if( editing ){

        if( !option_menu_visible ){

            viewer_menu.find('.menu_dots').addClass('hidden');

        }

    } else {

        if( !option_menu_visible ){

            viewer_menu.find('.menu_dots').addClass('hidden');

        }

    }

    //QUALITY

    var menu_visible_quality_exists = 0;

    if( device.isMobile ){

        if( editing ){

            menu_visible_quality_exists = 1;

        } else {

            if( ~~options.quality ){

                menu_visible_quality_exists = 1;

            }

        }

    }

    if( menu_visible_quality_exists ){

        if( 'quality_active_on_load' in options && options.quality_active_on_load ){

            viewer_menu.find('.toggle_quality').addClass('active');

        }

        viewer_menu.on('click','.toggle_quality',function(){

            THEASYS.renderer.toggleQuality();

            THEASYS.theme.modules.menu.autoHide();

        });

    }

    //GYROSCOPE

    var menu_visible_gyroscope_exists = 0;

    if( device.isMobile ){

        if( editing ){

            menu_visible_gyroscope_exists = 1;

        } else {

            if( ~~options.gyroscope ){

                menu_visible_gyroscope_exists = 1;

            }

        }

    }

    if( menu_visible_gyroscope_exists ){

        viewer_menu.on('click','.toggle_gyroscope',function(event){

            var iDevices = [
                'iPad Simulator',
                'iPhone Simulator',
                'iPod Simulator',
                'iPad',
                'iPhone',
                'iPod'
            ];

            var isIos = false;

            if (!!navigator.platform) {

                while (iDevices.length) {

                    if (navigator.platform === iDevices.pop()){

                        isIos = true;

                        break;

                    }

                }

            }

            if( isIos ){

                if( THEASYS.fn.isInIframe() ){

                    if ( window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === 'function' ) {

                        window.parent.postMessage({'action':'gyroscope'},'*');

                    } else {

                        THEASYS.renderer.toggleGyroscope();

                    }

                } else {

                    THEASYS.renderer.toggleGyroscope();

                }

            } else {

                THEASYS.renderer.toggleGyroscope();

            }

            THEASYS.theme.modules.menu.autoHide();

        });

    }

    //VR
    var menu_visible_vr_mode_exists = 0;

    if( editing ){

        menu_visible_vr_mode_exists = 1;

    } else {

        if( ~~options.vr_mode ){

            menu_visible_vr_mode_exists = 1;

        }

    }

    if( menu_visible_vr_mode_exists ){

        viewer_menu.on('click','.toggle-vr',function(){

            if(  device.isMobile && document.webkitFullscreenElement === undefined ){

                if( THEASYS.fn.isInIframe() ){

                    window.location.hash = 'vr';
                    //load in new window
                    window.open(window.location.href);

                } else {

                    THEASYS.renderer.toggleVr();

                }

            } else {

                THEASYS.renderer.toggleVr();

            }

            THEASYS.theme.modules.menu.autoHide();

        });

        $(document).on("keyup", function(e) {

            var vr = THEASYS.renderer.vars.get('vr');

            if(vr){

                if(e.which === 27){

                    THEASYS.renderer.toggleVr();

                }

            }

        });

    }


    //AUTO HIDE MENU ON VIEWER CLICK

    var createHideMenuEventsOnClose = 0;

    if( editing ){

        createHideMenuEventsOnClose = 1;

    } else {

        if( ~~options.menu_close_on_actions ){

            createHideMenuEventsOnClose = 1;

        }

    }

    if( createHideMenuEventsOnClose ){

        $('#viewer').on('click',function(){

            THEASYS.theme.modules.menu.autoHide();

        });

    }

};

THEASYS.theme.modules.menu.createSubmenu = function(callback){

    THEASYS.api.engine.execute('get','menu',null,function(data){

        if( 'menu' in data ){

            if( !data.menu.status ){

                //return false;

            }

            var html = '';

            if( data.menu.status ){

                if( 'auto_rotation' in data.menu.items && data.menu.items.auto_rotation.exists ){

                    html += '  <div data-tooltip="Auto Rotation" class="toggle_auto_rotate'+(data.menu.items.auto_rotation.status === 0 ? ' hidden':'')+'"><span class="viewer_menu_item_img"></span><span class="viewer_menu_item_txt">Auto Rotation</span></div>';

                }

                if( 'fullscreen' in data.menu.items && data.menu.items.fullscreen.exists ){

                    html += '  <div data-tooltip="Toggle FullScreen" class="toggle_full_screen'+(data.menu.items.fullscreen.status === 0 ? ' hidden':'')+'"><span class="viewer_menu_item_img"></span><span class="viewer_menu_item_txt">FullScreen</span></div>';

                }

                if( 'hotspots' in data.menu.items && data.menu.items.hotspots.exists ){

                    html += '  <div data-tooltip="Hotspots" class="toggle-hotspots'+(data.menu.items.hotspots.status === 0 ? ' hidden':'')+'"><span class="viewer_menu_item_img"></span><span class="viewer_menu_item_txt">Hotspots</span></div>';

                }

                if( 'audio' in data.menu.items && data.menu.items.audio.exists ){

                    html += '  <div data-tooltip="Sounds" class="toggle-sounds hidden"><span class="viewer_menu_item_img"></span><span class="viewer_menu_item_txt">Sounds</span></div>';

                }

                if( 'share' in data.menu.items && data.menu.items.share.exists ){

                    html += '  <div data-tooltip="Share" class="menu_share'+(!data.menu.items.share.status ? ' hidden':'')+'"><span class="viewer_menu_item_img"></span><span class="viewer_menu_item_txt">Share</span></div>';

                }

            }

            var viewer_menu = $('#viewer_menu');

            viewer_menu.find('.viewer_menu-submenu').append(html);

            THEASYS.theme.modules.menu.createSubMenuEvents(data);

            THEASYS.renderer.event.trigger('autoRotation');

        }

        if( typeof callback === 'function' ){

            callback();

        }

    });

};


THEASYS.theme.modules.menu.createSubMenuEvents = function(data){

    if( !THEASYS.theme.modules.menu.created ){

        //return false;

    }

    var options = THEASYS.renderer.vars.get('options');
    var device = THEASYS.renderer.vars.get('device');
    var editing = THEASYS.renderer.vars.get('editing');
    var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');

    var viewer_menu = $('#viewer_menu');

    var option_menu_visible = ~~options.menu_visible;

    //AUDIO

    if( 'audio' in data.menu.items && data.menu.items.audio.exists ){

        viewer_menu.on('click','.toggle-sounds',function(e){

            THEASYS.theme.exec('audio','toggleBackgroundSound');

            THEASYS.theme.modules.menu.autoHide();

        });

        if( ( 'audio' in THEASYS.cache.obj.tours[tour_rnd].tour ) && THEASYS.cache.obj.tours[tour_rnd].tour.audio ){

            if( parseInt(options.background_sound,10) ){

                viewer_menu.find('.toggle-sounds').removeClass('hidden');

            }

        }

    }

    //REVISIT HOTSPOTS AS CORE FUNCTIONS MUST BE IN RENDERER

    if( 'hotspots' in data.menu.items && data.menu.items.hotspots.exists ){

        if( parseInt(options.hotspots_display,10) ){

            viewer_menu.find('.toggle-hotspots').addClass('selected');

        } else {

            viewer_menu.find('.toggle-hotspots').removeClass('selected');

        }

        viewer_menu.on('click','.toggle-hotspots',function(){

            //THEASYS.theme.modules.menu.toggleHotspots();

            THEASYS.renderer.toggleHotspots();

            THEASYS.theme.modules.menu.autoHide();

        });

    }

    //FULLSCREEN

    if( 'fullscreen' in data.menu.items && data.menu.items.fullscreen.exists ){

        viewer_menu.on('click','.toggle_full_screen',function(){

            $(this).toggleClass('selected');

            THEASYS.renderer.toggleFullScreen();

        });

        $(document).on("fullscreenchange", function(e) {

            var fs = (($(document).fullScreen()?true:false));

            THEASYS.renderer.vars.set('fullScreenEnabled',fs);

            if(!fs){

                THEASYS.theme.exec('maps','mapAutoShrink');

            }

            THEASYS.renderer.resize();

            if(!fs){

                viewer_menu.find('.toggle_full_screen').removeClass('selected');

                THEASYS.renderer.vars.set('isFullScreen',0);

            } else {

                viewer_menu.find('.toggle_full_screen').addClass('selected');

                THEASYS.renderer.vars.set('isFullScreen',1);

            }

        });

    }

    //AUTO ROTATION

    if( 'auto_rotation' in data.menu.items && data.menu.items.auto_rotation.exists ){

        viewer_menu.on('click','.toggle_auto_rotate',function(){

            THEASYS.renderer.toggleAutoRotate();

            THEASYS.theme.modules.menu.autoHide();

        });

    }

    //SHARE

    if( 'share' in data.menu.items && data.menu.items.share.exists ){

        viewer_menu.on('click','.menu_share',function(){

            THEASYS.theme.exec('share','load');

        });

    }

};

THEASYS.theme.modules.menu.toggle = function(state){

    var option_menu_visible = ~~THEASYS.renderer.vars.get('options.menu_visible');

    if( !option_menu_visible ){

        return false;

    }

    var viewer_menu = $('#viewer_menu');

    if( state !== undefined ){

        if( isNaN(state) ){

            return false;

        }

        var state = parseInt(state,10);

        if( state === 1 ){

            viewer_menu.find('.viewer_menu-submenu').addClass('fadeInUp');
            viewer_menu.find('.menu_dots').addClass('active');

        } else if( state === 0 ) {

            viewer_menu.find('.viewer_menu-submenu').removeClass('fadeInUp');
            viewer_menu.find('.menu_dots').removeClass('active');

        } else {

            viewer_menu.find('.viewer_menu-submenu').toggleClass('fadeInUp');
            viewer_menu.find('.menu_dots').toggleClass('active');

        }

    } else {

        viewer_menu.find('.viewer_menu-submenu').toggleClass('fadeInUp');
        viewer_menu.find('.menu_dots').toggleClass('active');

    }

};

THEASYS.theme.modules.menu.autoHide = function(){

    if( ~~THEASYS.renderer.vars.get('options.menu_close_on_actions') ){

        this.toggle(0);

    }

};

THEASYS.theme.modules.menu.closeOnActions = function(){

    var createHideMenuEventsOnClose = 0;

    if( THEASYS.renderer.vars.get('editing') ){

        createHideMenuEventsOnClose = 1;

    } else {

        if( ~~THEASYS.renderer.vars.get('options.menu_close_on_actions') ){

            createHideMenuEventsOnClose = 1;

        }

    }

    if( createHideMenuEventsOnClose ){

        this.autoHide();

    }

};

THEASYS.theme.modules.menu.autoRotationMenu = function(){

    //if( ~~THEASYS.renderer.vars.get('options.menu_close_on_actions') ){

        if( THEASYS.renderer.vars.get('options.auto_rotation') ){

            viewer_menu = $('#viewer_menu');

            viewer_menu.find('.toggle_auto_rotate').removeClass('hidden');

            var auto_rotation = THEASYS.renderer.vars.get('auto_rotation');
            var auto_rotation_enabled = THEASYS.renderer.vars.get('auto_rotation_enabled');

            //console.log( auto_rotation.status, auto_rotation_enabled );

            if( auto_rotation.status ){

                if( auto_rotation_enabled ) {

                    viewer_menu.find('.toggle_auto_rotate').addClass('selected');

                    //if( _vars.autoRotationDisabledBecauseOfInteraction ) {

                        //$('#viewer_menu').find('.toggle_auto_rotate').removeClass('selected');

                    //}

                } else {

                    viewer_menu.find('.toggle_auto_rotate').removeClass('selected');

                }

                viewer_menu.find('.toggle_auto_rotate').removeClass('disabled');

            } else {

                viewer_menu.find('.toggle_auto_rotate').removeClass('selected');
                viewer_menu.find('.toggle_auto_rotate').addClass('disabled');

            }

        } else {

            $('#viewer_menu').find('.toggle_auto_rotate').addClass('hidden');

        }

        if( ~~THEASYS.renderer.vars.get('options.auto_rotation_starting_panorama') ){

            //$('#viewer_menu').find('.toggle_auto_rotate').removeClass('hidden');
            //$('#viewer_menu').find('.toggle_auto_rotate').removeClass('disabled');
            //$('#viewer_menu').find('.toggle_auto_rotate').addClass('selected');

        } else {

            //$('#viewer_menu').find('.toggle_auto_rotate').removeClass('selected');

        }

    //}

};

THEASYS.theme.modules.menu.gyroscopeMenu = function(){

    var gyroscope = THEASYS.renderer.vars.get('gyroscope');

    if( gyroscope ){

        $('#viewer_menu .toggle_gyroscope').addClass('active');

    } else {

        $('#viewer_menu .toggle_gyroscope').removeClass('active');

    }

};
