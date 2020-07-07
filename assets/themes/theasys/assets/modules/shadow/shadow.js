/*
 *  Name : Shadow
 *  Description : Displays a shadow on the top of the screen so elements such as menu be visible
 *  Author : John Barounis
 *  Version : 0.0.1
*/

THEASYS.theme.autoLoadFunction('shadow','init');

THEASYS.theme.modules.shadow.initialized = false;

THEASYS.theme.modules.shadow.init = function( ){

    var html = `<div id="viewer_shadow"></div>`;

    THEASYS.theme.prependHtml(html,document.getElementById('viewer_wrapper'));

    var bg = THEASYS.vars.paths.static+'/themes/'+THEASYS.vars.theme+'/assets/modules/shadow/img/top-gradient.png';

    $('#viewer_shadow').css({

        'background': "url('"+bg+"') repeat-x bottom"

    });

    this.display();

    this.initialized = true;

    THEASYS.renderer.event.on('panoramaToScene',function(){

        THEASYS.theme.modules.shadow.display();

    });

    $('#viewer_shadow').on('click',function(){

        THEASYS.theme.exec('menu','closeOnActions');

    });

};

THEASYS.theme.modules.shadow.display = function( ){

    var options = THEASYS.renderer.vars.get('options');
    var device = THEASYS.renderer.vars.get('device');
    var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');
    var id = THEASYS.renderer.vars.get('id');

    var displayTopShadow = false;

    if( ~~options.menu_visible ){

        displayTopShadow = true;

    }

    if( displayTopShadow ){

        this.show();

        return false;

    }

    if( options.logo_image !== '' && ~~options.logo_display ){

        if( 'logo_path' in options ){

            displayTopShadow = true;

        }

    }

    if( displayTopShadow ){

        this.show();

        return false;

    }

    if( ~~options.vr_mode ){

        displayTopShadow = true;

    }

    if( displayTopShadow ){

        this.show();

        return false;

    }

    if( device.isMobile ){

        if( ~~options.gyroscope ){

            displayTopShadow = true;

        }

        if( displayTopShadow ){

            this.show();

            return false;

        }

    }

    var display_info_button_titles_tour = 0;

    var display_info_button_titles_description = 0;

    var display_info_button_titles_panorama = 0;

    var display_info_button_titles_panorama_description = 0;

    if( ~~options.titles_tour ){

        display_info_button_titles_tour = 1;

    }

    var tourDescription = $('#viewer_description').val();

    tourDescription = tourDescription.trim();

    if( tourDescription !== '' ){

        if( ~~options.titles_tour_description ){

            display_info_button_titles_description = 1;

        }

    }

    var panoramaTitle = THEASYS.cache.obj.tours[tour_rnd].panoramas[id].title;

    panoramaTitle = panoramaTitle.trim();

    if( panoramaTitle !== '' ){

        if( ~~options.titles_panorama ){

            display_info_button_titles_panorama = 1;

        }

    }

    var panoramaDescription = THEASYS.cache.obj.tours[tour_rnd].panoramas[id].description;

    panoramaDescription = panoramaDescription.trim();

    if( panoramaDescription !== '' ){

        if( ~~options.titles_panorama_description ){

            display_info_button_titles_panorama_description = 1;

        }

    }

    if( display_info_button_titles_tour || display_info_button_titles_description || display_info_button_titles_panorama || display_info_button_titles_panorama_description  ){

        displayTopShadow = true;

    }

    if( displayTopShadow ){

        this.show();

    } else {

        this.hide();

    }

};

THEASYS.theme.modules.shadow.show = function( ){

    //$('#viewer_shadow').stop().fadeIn(1000);
    $('#viewer_shadow').animate({opacity:1},500);

};

THEASYS.theme.modules.shadow.hide = function( ){

    //$('#viewer_shadow').hide();
    $('#viewer_shadow').animate({opacity:0},500);

};
