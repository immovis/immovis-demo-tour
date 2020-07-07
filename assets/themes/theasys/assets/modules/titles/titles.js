/*
 *  Name : Titles
 *  Description : Displays tour/ panorama titles and descriptions
 *  Author : John Barounis
 *  Version : 0.0.1
*/

THEASYS.theme.autoLoadFunction('titles','init');

THEASYS.theme.modules.titles.initialized = false;

THEASYS.theme.modules.titles.init = function( ){

    var viewer_title = document.head.querySelector("[name~=viewer_title][content]").content;

    var viewer_description = document.head.querySelector("[name~=viewer_description][content]").content;

    var html = `
        <div id="panorama-info">
            <span class="panorama-info-close">
                <img src="${vars.paths.static}/themes/${vars.theme}/assets/modules/titles/img/close.png" alt="close">
            </span>
            <div id="panorama-info-content">
                <div id="viewer_titles-tour_title" class="hidden">
                    ${viewer_title}
                </div>
                <div id="viewer_titles-tour_description" class="hidden">
                    <span id="viewer_titles-tour_description_content">${viewer_description}</span>
                </div>
                <div class="clearfix"></div>
                <div id="viewer_titles-panorama_title" class="hidden"></div>
                <div id="viewer_titles-panorama_description" class="hidden"></div>
                <p id="panorama-info-content-text"></p>
            </div>
        </div>
        <div id="panorama-info-overlay"></div>
    `;

    THEASYS.theme.appendHtml(html);

    THEASYS.theme.modules.titles.create();

    THEASYS.theme.modules.titles.initialized = true;

    THEASYS.renderer.event.on('init',function(){

        var loadedOnce = THEASYS.renderer.vars.get('loadedOnce');

        if( loadedOnce ){

            THEASYS.theme.modules.titles.create();

        }

    });

    THEASYS.renderer.event.on('resize',function(){

        THEASYS.theme.modules.titles.adjustContentHeight();

    });

};

THEASYS.theme.modules.titles.listenToEdits = function( obj ){

    for( var k in obj ){

        switch( k ){

            case'titles_tour':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.titles_tour',value);

                this.create();

                THEASYS.theme.exec('shadow','display');

            break;

            case'titles_tour_description':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.titles_tour_description',value);

                this.create();

                THEASYS.theme.exec('shadow','display');

            break;

            case'titles_panorama':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.titles_panorama',value);

                this.create();

                THEASYS.theme.exec('shadow','display');

            break;

            case'titles_panorama_description':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.titles_panorama_description',value);

                this.create();

                THEASYS.theme.exec('shadow','display');

            break;

            case'titles_open_by_default':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.titles_open_by_default',value);

                this.create();

                THEASYS.theme.exec('shadow','display');

            break;

        }

    }

};

THEASYS.theme.modules.titles.create = function( ){

    var options = THEASYS.renderer.vars.get('options');
    var id = THEASYS.renderer.vars.get('id');
    var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');

    var display_info_button_titles_tour = 0;
    var display_info_button_titles_description = 0;
    var display_info_button_titles_panorama = 0;
    var display_info_button_titles_panorama_description = 0;

    if( ~~options.titles_tour ){

        $('#viewer_titles-tour_title').removeClass('hidden');

        display_info_button_titles_tour = 1;

    } else {

        $('#viewer_titles-tour_title').addClass('hidden');

    }

    var tourDescription = $('#viewer_titles-tour_description_content').html();

    if( tourDescription && tourDescription !== '' ){

        tourDescription = tourDescription.trim();

        if( ~~options.titles_tour_description ){

            $('#viewer_titles-tour_description').removeClass('hidden');

            display_info_button_titles_description = 1;

        } else {

            $('#viewer_titles-tour_description').addClass('hidden');

        }

    } else {

        $('#viewer_titles-tour_description').addClass('hidden');

    }

    var panoramaTitle = '';

    if( id ){

        if( 'title' in THEASYS.cache.obj.tours[tour_rnd].panoramas[id] ){

            panoramaTitle = THEASYS.cache.obj.tours[tour_rnd].panoramas[id].title;

        }

    }

    if( panoramaTitle !== '' ){

        panoramaTitle = panoramaTitle.trim();

        $('#viewer_titles-panorama_title').html(panoramaTitle);

        if( ~~options.titles_panorama ){

            $('#viewer_titles-panorama_title').removeClass('hidden');

            display_info_button_titles_panorama = 1;

        } else {

            $('#viewer_titles-panorama_title').addClass('hidden');

        }

    } else {

        $('#viewer_titles-panorama_title').addClass('hidden');

    }

    var panoramaDescription = THEASYS.cache.obj.tours[tour_rnd].panoramas[id].description;

    if( panoramaDescription !== '' ){

        panoramaDescription = panoramaDescription.trim();

        $('#viewer_titles-panorama_description').html(panoramaDescription);

        if( ~~options.titles_panorama_description ){

            $('#viewer_titles-panorama_description').removeClass('hidden');

            display_info_button_titles_panorama_description = 1;

        } else {

            $('#viewer_titles-panorama_description').addClass('hidden');

        }

    } else {

        $('#viewer_titles-panorama_description').addClass('hidden');

    }

    THEASYS.theme.modules.titles.createEvents();

    if( display_info_button_titles_tour || display_info_button_titles_description || display_info_button_titles_panorama || display_info_button_titles_panorama_description  ){

        $('#viewer_menu').find('.toggle-info').removeClass('hidden');

        var loadedOnce = THEASYS.renderer.vars.get('loadedOnce');

        if( !loadedOnce ){

            if( ~~options.titles_open_by_default && ~~options.autoplay ){

                $('#viewer_menu').find('.toggle-info').trigger('click');

            }

        }

    } else {

        $('#panorama-info').fadeOut();
        $('#panorama-info-overlay').fadeOut();

        THEASYS.renderer.vars.set('autoRotationTemporarilyDisabled',false);

        $('#viewer_menu').find('.toggle-info').addClass('hidden');

    }

};

THEASYS.theme.modules.titles.adjustContentHeight = function( ){

    var contentHeight = $('#viewer_titles-tour_description').outerHeight() + $('#viewer_titles-panorama_title').outerHeight() + $('#viewer_titles-panorama_description').outerHeight() + $('#panorama-info-content-text').outerHeight();

    var padding = parseInt($('#panorama-info').css('padding'),10);

    var nh = $(window).height() - 100 - ( padding * 2 );

    if( isNaN(contentHeight) || contentHeight <= 0 || contentHeight < nh ){

        $('#panorama-info-content').css({height:'auto'});

    } else {

        $('#panorama-info-content').css({height:nh+'px'});

    }

}

THEASYS.theme.modules.titles.eventsCreated = 0;

THEASYS.theme.modules.titles.createEvents = function( ){

    if( THEASYS.theme.modules.titles.eventsCreated ){

        return false;

    }

    $('#viewer_menu').on('click','.toggle-info',function(){

        THEASYS.theme.modules.titles.adjustContentHeight();

        $('#panorama-info').css({visibility:'visible'});

        $('#panorama-info-overlay').fadeIn();

        THEASYS.renderer.vars.set('autoRotationTemporarilyDisabled',true);

    });

    $('.panorama-info-close').on('click touchmove',function(e){

        e.preventDefault();

        THEASYS.theme.modules.titles.closeInfo();

        return false;

    });

    $('#panorama-info-overlay').on('click touchmove',function(e){

        e.preventDefault();

        THEASYS.theme.modules.titles.closeInfo();

        return false;

    });

    $(document).on('keyup',function( e ){

        if( e.which === 27 ){

            e.preventDefault();

            THEASYS.theme.modules.titles.closeInfo();

            return false;

        }

    });

    THEASYS.theme.modules.titles.eventsCreated = 1;

};

THEASYS.theme.modules.titles.closeInfo = function( ){

    $('#panorama-info').css({visibility:'hidden'});

    $('#panorama-info-overlay').fadeOut(function(){

        THEASYS.theme.exec('audio','loadWhatAudio');

    });

    THEASYS.renderer.vars.set('autoRotationTemporarilyDisabled',false);
};
