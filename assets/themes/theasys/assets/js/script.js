var viewer_title = document.head.querySelector("[name~=viewer_title][content]").content;

var viewer_description = document.head.querySelector("[name~=viewer_description][content]").content;

THEASYS.theme.html = `

    <div id="viewer_wrapper" class="noselect">

        <div id="viewer" tabindex="0"></div>

    </div>

    <div id="viewer_submenu" class="hidden"></div>

    <div id="tooltip"></div>

    <input type="hidden" id="editing" value="">
    <input type="hidden" id="viewer_title" value="${viewer_title}">
    <input type="hidden" id="viewer_description" value="${viewer_description}">

    `;

//event::processPanoramaAfterEarly
THEASYS.renderer.event.on('processPanoramaAfterEarly',function(){

    var loadedOnce = THEASYS.renderer.vars.get('loadedOnce');

    if( loadedOnce <= 0 ){

        THEASYS.theme.modules.cookiesconsent.init();

        THEASYS.theme.modules.navigation.init();

    }

});

THEASYS.renderer.event.on('loadedOnce',function(){

    THEASYS.theme.modules.shadow.init();

    THEASYS.theme.modules.maps.init();

    THEASYS.theme.modules.menu.init(function(){

        //load the audio after we have added to the submenu the Sounds item so user can toggle sounds
        THEASYS.theme.modules.audio.init();

    });

    THEASYS.theme.modules.titles.init();

    THEASYS.theme.modules.thumbnails.init();

    THEASYS.theme.modules.contextMenu.init();

    THEASYS.theme.modules.logo.init();

    THEASYS.theme.modules.copyright.init();

    THEASYS.theme.modules.share.init();

    //THEASYS.theme.autoLoadFunctions();

});

THEASYS.renderer.event.on('hotspotClick',function(action){

    if( 'type' in action ){

        switch(action.type){

            case'call':

                var url = 'tel:'+action.tel;

                var html = '<a style="position:absolute;top:0px;left:0px;" id="call_a_number" href="'+url+'" target="_blank" rel="noopener"></a>';

                $('body').append(html);

                $('#call_a_number').simulateClick('click');
                $('#call_a_number').remove();

            break;

            case'link_to_url':

                var url = THEASYS.fn.parse_url(action.url);

                var open_in_new_tab = 'open_in_new_tab' in action ? parseInt(action.open_in_new_tab,10) : 1;

                if( open_in_new_tab ){

                    var html = '<a style="position:absolute;top:0px;left:0px;" id="link_to_url" href="'+url+'" target="_blank" rel="noopener"></a>';

                } else {

                    var html = '<a style="position:absolute;top:0px;left:0px;" id="link_to_url" href="'+url+'" rel="noopener"></a>';

                }

                $('body').append(html);

                 //$("<a>").attr("href", url).attr("target", "_blank").attr("rel", "noopener")[0].click();

                 $('#link_to_url').simulateClick('click');
                 $('#link_to_url').remove();

            break;

            case'display_video':

                THEASYS.renderer.vars.set('autoRotationTemporarilyDisabled',true);

                var auto_play = ~~action.auto_play || 0;

                THEASYS.theme.modules.popup.load({

                    src: THEASYS.fn.video_embed_url(action.url,auto_play),
                    action : action,

                },'video');

            break;

            case'display_image':

                THEASYS.renderer.vars.set('autoRotationTemporarilyDisabled',true);

                var uid = THEASYS.renderer.vars.get('uid');

                var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');

                THEASYS.theme.modules.popup.load({

                    src: vars.paths.media+'/'+uid+'/'+tour_rnd+'/action_image/'+action.image,
                    action : action,

                },'image');

            break;

            case 'display_info_panel':

                THEASYS.renderer.vars.set('autoRotationTemporarilyDisabled',true);

                THEASYS.theme.modules.info_panel.load(action.html_content);

              break;

        }

    }

});

THEASYS.renderer.event.on('loadedPanorama',function(){

    //console.log('loaded panorama');

});

THEASYS.renderer.event.on('loadingPanorama',function(){

    //console.log('loading panorama');

});

THEASYS.renderer.event.on('beforeLoad',function(){

    //console.log('beforeLoad');

    THEASYS.theme.modules.loader.init();

    THEASYS.theme.modules.panorama_error.init();
    THEASYS.theme.modules.panorama_private.init();
    THEASYS.theme.modules.panorama_static.init();

    THEASYS.theme.modules.hotspots_tooltip.init();
    THEASYS.theme.modules.panorama_vr.init();

});

THEASYS.renderer.event.on('load',function(){

    //console.log('load');

});

THEASYS.renderer.event.on('resize',function(w,h){

    var w = $(window).width();

    var h = $(window).height();

    THEASYS.renderer.vars.set('rendererWidth',w);

    THEASYS.renderer.vars.set('rendererHeight',h);

    if( THEASYS.theme.modules.maps.initialized ){

        if( THEASYS.theme.modules.maps.map_gui_mode ){

            w  = parseFloat(w,10) - $('#map-wrapper').outerWidth();

        }

    }

    THEASYS.renderer.vars.set('rendererWidth',w);

    $('#viewer').css({'width':w+'px','height':h+'px'});

    $('#viewer_wrapper').css({'width':w+'px','height':h+'px','float':'left'});

    var container = THEASYS.renderer.vars.get('container');

    $('#'+container).css({'width':w+'px','height':h+'px'});

});

THEASYS.renderer.event.on('userAction',function(){

    var createHideMenuEventsOnClose = 0;

    if( THEASYS.renderer.vars.get('editing') ){

        createHideMenuEventsOnClose = 1;

    } else {

        if( ~~THEASYS.renderer.vars.get('options.menu_close_on_actions') ){

            createHideMenuEventsOnClose = 1;

        }

    }

    if( createHideMenuEventsOnClose ){

        $('#viewer').on('click',function(){

            THEASYS.theme.exec('menu','autoHide');

        });

    }

});