/*
 *  Name : panorama_static
 *  Description : Displays screen when user has choosen the option "Autoplay Enabled" to false
 *  Author : John Barounis
 *  Version : 0.0.1
*/

//THEASYS.theme.autoLoadFunction('panorama_private','init');

THEASYS.theme.modules.panorama_static.initialized = false;

THEASYS.theme.modules.panorama_static.init = function( ){

    var logo = vars.paths.static+'/themes/'+vars.theme+'/assets/img/logo.png';

    var play = vars.paths.static+'/themes/'+vars.theme+'/assets/modules/panorama_static/img/play.png';

    var viewer_title = document.head.querySelector("[name~=viewer_title][content]").content;

    var viewer_description = document.head.querySelector("[name~=viewer_description][content]").content;

    var html = `
        <div id="panorama-static" class="hidden">
            <div id="copyright_start_screen" class="hidden">
                <a target="_blank" rel="noopener" href="${vars.url}">
                    <img src="${logo}" alt="theasys.io" width="150">
                </a>
            </div>
            <div class="logo"></div>
            <div class="play">
                <img src="${play}" alt="theasys.io play" width="100">
            </div>
            <div class="txt"><h1 id="panorama-static-title">${viewer_title}</h1></div>
            <div class="description" id="panorama-static-description">${viewer_description}</div>
            <div class="sslinks">
                <span class="sslinks-web"></span>
                <span class="sslinks-map"></span>
                <span class="sslinks-tel"></span>
            </div>
        </div>
        <div id="panorama-static-overlay"></div>
    `;

    THEASYS.theme.appendHtml(html);

    this.initialized = true;

    THEASYS.renderer.event.on('loadStaticScreen',function( cv, obj, action ){

        THEASYS.theme.modules.panorama_static.load( cv, obj, action );

    });

    THEASYS.renderer.event.on('resize',function( w, h ){

        if( THEASYS.renderer.vars.get('loaded_static_image') ){

            //$('body').css({'height':h+'px'});

            $('#psi').css({

                width : w+'px',
                height : h+'px',

            });

            $('body').addClass('panorama-static-image').css({

                height : h+'px'

            });

            THEASYS.theme.modules.panorama_static.image_adjust();

        }

    });

};

THEASYS.theme.modules.panorama_static.listenToEdits = function( obj ){

    for( var k in obj ){

        switch( k ){

            case'start_screen_website':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.start_screen_website',value);

                THEASYS.theme.modules.panorama_static.load_start_screen_link('website');

            break;

            case'start_screen_website_url':

                var value = obj[k];

                THEASYS.renderer.vars.set('options.start_screen_website_url',value);

                THEASYS.theme.modules.panorama_static.load_start_screen_link('website');

            break;

            case'start_screen_map':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.start_screen_map',value);

                THEASYS.theme.modules.panorama_static.load_start_screen_link('map');

            break;

            case'start_screen_map_url':

                var value = obj[k];

                THEASYS.renderer.vars.set('options.start_screen_map_url',value);

                THEASYS.theme.modules.panorama_static.load_start_screen_link('map');

            break;

            case'start_screen_tel':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.start_screen_tel',value);

                THEASYS.theme.modules.panorama_static.load_start_screen_link('tel');

            break;

            case'start_screen_tel_url':

                var value = obj[k];

                THEASYS.renderer.vars.set('options.start_screen_tel_url',value);

                THEASYS.theme.modules.panorama_static.load_start_screen_link('tel');

            break;

            case'copyright_start_screen':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.copyright_start_screen',value);

                THEASYS.theme.exec('copyright','startScreenAddRemoveClassHidden',value);

            break;

            case'start_screen_custom_logo_display':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.start_screen_custom_logo_display',value);

                if( value ){

                    $('#panorama-static').find('.logo').show();

                } else {

                    $('#panorama-static').find('.logo').hide();

                }

            break;

            case'start_screen_overlay':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.start_screen_overlay',value);

                if( value ){

                    $('#panorama-static-overlay').fadeIn();

                } else {

                    $('#panorama-static-overlay').fadeOut();

                }

            break;

            case'start_screen_logo_insert':

                $('#panorama-static').find('.logo img').attr('src',obj[k]);

                THEASYS.renderer.vars.set('options.start_screen_logo_insert',obj[k]);

            break;

            case'start_screen_logo_delete':

                var src = THEASYS.renderer.vars.get('empty_img');

                $('#panorama-static').find('.logo img').attr('src',src);

                THEASYS.renderer.vars.set('options.start_screen_logo_delete',src);

                //_vars.options.logo_path = '';
                //app.logo = _vars.empty_img;

                //$('#viewer_logo').find('img').attr('src',app.logo);

            break;

            case'start_screen_custom_logo_url':

                THEASYS.renderer.vars.set('options.start_screen_custom_logo_url',obj[k]);

                if( obj[k] !== '' ){

                    var start_screen_custom_logo_a = $('#panorama-static .logo').find('a');

                    if( start_screen_custom_logo_a.length ){

                        start_screen_custom_logo_a.attr('rel','noopener').attr('href',THEASYS.fn.parse_url(obj[k]));

                    } else {

                        $('#panorama-static .logo').find('img').wrap('<a target="_blank" rel="noopener" href="'+THEASYS.fn.parse_url(obj[k])+'"></a>');

                    }

                } else {

                    var start_screen_custom_logo_a = $('#panorama-static .logo').find('a');

                    if( start_screen_custom_logo_a.length ){

                        $('#panorama-static .logo').find('img').unwrap('a');

                    } else {

                        //$('#viewer_logo').find('img').wrap('<a target="_blank" rel="noopener" href="'+_vars.options.logo_url+'"></a>');

                    }

                }

            break;

            case'start_screen_tour_title':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.start_screen_tour_title',value);

                if( value ){

                    $('#panorama-static').find('.txt').show();

                } else {

                    $('#panorama-static').find('.txt').hide();

                }

            break;

            case'start_screen_tour_description':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.start_screen_tour_description',value);

                if( value ){

                    $('#panorama-static').find('.description').show();

                } else {

                    $('#panorama-static').find('.description').hide();

                }

            break;

        }

    }

};

THEASYS.theme.modules.panorama_static.load = function( cv, obj, action ){

    var static_image = THEASYS.renderer.vars.get('static_image');

    $('body').addClass('panorama-static-image').css({

        'background-image' : 'url('+static_image+')',
        filter : "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+static_image+"', sizingMethod='scale')",
        '-ms-filter' : "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+static_image+"', sizingMethod='scale')",
        'height' : $(window).height()+'px'

    });

    var options = THEASYS.renderer.vars.get('options');

    if( options.load_transition == 0 ){


    } else {

        $('body').append('<canvas id="psi" style="display:none;"></canvas>').addClass('panorama-static-image').css({

            //'background-image' : 'url('+image+')',
            //filter : "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+image+"', sizingMethod='scale')",
            //'-ms-filter' : "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+image+"', sizingMethod='scale')",
            'height' : $(window).height()+'px'

        });

        var img = new Image();

        img.crossOrigin = "anonymous";

        img.onload = function(){

            //_vars.loaded_static_image = img;

            THEASYS.renderer.vars.set('loaded_static_image', img);

            THEASYS.theme.modules.panorama_static.image_adjust();

        };

        img.src = static_image;

    }

    var panorama_static = $('#panorama-static');

    panorama_static.removeClass('hidden');

    $('#viewer').addClass('hidden').hide();

    $('#viewer_menu').addClass('hidden');

    var empty_img = THEASYS.renderer.vars.get('empty_img');

    var uid = THEASYS.renderer.vars.get('uid');

    var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');

    panorama_static.find('.logo').html('<img src="'+empty_img+'" alt="logo">');

    var editing = THEASYS.renderer.vars.get('editing');

    if( !editing ){

        if( ~~options.start_screen_custom_logo_display ){

            if( options.start_screen_custom_logo_display_image !== '' ){

                var static_logo_image = vars.paths.options+'/'+uid+'/'+tour_rnd+'/'+options.start_screen_custom_logo_display_image_path;

                panorama_static.find('.logo').html('<img src="'+static_logo_image+'" alt="logo">');

            }

            panorama_static.find('.logo').show();

        } else {

            panorama_static.find('.logo').hide();

        }

    } else {

        if( ~~options.start_screen_logo_display ){

        }

        if( options.start_screen_custom_logo_display_image !== '' ){

            var static_logo_image = vars.paths.options+'/'+uid+'/'+tour_rnd+'/'+options.start_screen_custom_logo_display_image_path;

            panorama_static.find('.logo').html('<img src="'+static_logo_image+'" alt="logo">');

            if( ~~options.start_screen_custom_logo_display ){

                panorama_static.find('.logo').show();

            } else {

                panorama_static.find('.logo').hide();

            }

        } else {

            panorama_static.find('.logo').show();

        }

    }

    if( 'start_screen_custom_logo_url' in options && options.start_screen_custom_logo_url !== '' ){

        panorama_static.find('.logo img').wrap('<a target="_blank" rel="noopener" href="'+THEASYS.fn.parse_url(options.start_screen_custom_logo_url)+'"></a>');

    }

    if( ~~options.start_screen_tour_title ){

        panorama_static.find('.txt').show();

    } else {

        panorama_static.find('.txt').hide();

    }

    if( ~~options.start_screen_tour_description ){

        var wh = $(window).height();

        var psh = $('#panorama-static').outerHeight();

        if( psh > wh ){

            panorama_static.find('.description').show();

        }

    } else {

        panorama_static.find('.description').hide();

    }

    $('.toggle-vr-wrapper').addClass('hidden');

    if( ~~options.start_screen_overlay ){

        $('#panorama-static-overlay').show();

    } else {

        $('#panorama-static-overlay').hide();

    }

    this.load_start_screen_link('website');

    this.load_start_screen_link('map');

    this.load_start_screen_link('tel');

    $('#viewer_wrapper').removeClass('hidden');

    THEASYS.theme.exec('loader','hide');

    panorama_static.find('.play').on('click',function(e){

        e.preventDefault();

        //THEASYS.theme.exec('loader','show');

        THEASYS.renderer.init( obj, cv, function(){

            THEASYS.renderer.resize();

            panorama_static.hide();

            $('#panorama-static-overlay').hide();

            $('#viewer_menu').removeClass('hidden');

            $('.toggle-vr-wrapper').removeClass('hidden');

            THEASYS.renderer.processAutoRotation();

            //panorama_static.fadeOut(function(){

            $('body').removeClass('panorama-static-image').css({

                'background-image' : 'none',
                'height' : 'auto',

            });

            var toggle_info_elem = $('#viewer_menu').find('.toggle-info');

            if( !toggle_info_elem.hasClass('hidden') ){

                if( ~~options.titles_open_by_default ){

                    toggle_info_elem.trigger('click');

                }

            }

            //});

            $('#panorama-static-overlay').fadeOut();

            THEASYS.theme.exec('loader','hide');

        }, function(){

            $('#viewer').removeClass('hidden').show();

            panorama_static.hide();

            $('#panorama-static-overlay').hide();

        });

    }).on('mouseover',function(e){

        $('#panorama-static-overlay').addClass('overlay-opac');

    }).on('mouseout',function(e){

        $('#panorama-static-overlay').removeClass('overlay-opac');

    });

    $('#panorama-static').on('touchmove',function(e) {

        if( !THEASYS.fn.isInIframe() ){

            e.preventDefault();

        }

    });

    $('#panorama-static-overlay').on('touchmove',function(e) {

        if( !THEASYS.fn.isInIframe() ){

            e.preventDefault();

        }

    });

};

THEASYS.theme.modules.panorama_static.image_adjust = function( ){

    var canvas = document.getElementById('psi');

    if( canvas ){

        var loaded_static_image = THEASYS.renderer.vars.get('loaded_static_image');

        if( loaded_static_image ){

            canvas.width = $(window).width();
            canvas.height = $(window).height();

            var ctx = canvas.getContext("2d");

            var ratio = loaded_static_image.width / loaded_static_image.height;

            var newWidth = canvas.width;

            var newHeight = newWidth / ratio;

            if (newHeight < canvas.height) {

                newHeight = canvas.height;

                newWidth = newHeight * ratio;

            }

            var xOffset = newWidth > canvas.width ? (canvas.width - newWidth) / 2 : 0;

            var yOffset = newHeight > canvas.height ? (canvas.height - newHeight) / 2 : 0;

            ctx.drawImage(loaded_static_image, xOffset, yOffset, newWidth, newHeight);

        }

    }

};

THEASYS.theme.modules.panorama_static.load_start_screen_link = function(type){

    var options = THEASYS.renderer.vars.get('options');

    var panorama_static = $('#panorama-static');

    var theme_img_path = vars.paths.static+'/themes/'+vars.theme+'/assets/modules/panorama_static/img';

    switch( type ){

        case 'website':

            if( ~~options.start_screen_website ){

                var url = options.start_screen_website_url;

                url = url.trim();

                if( url !== '' ){

                    url =  THEASYS.fn.parse_url(url);

                    var img = theme_img_path+'/link.png';

                    var html = '<a target="_blank" rel="noopener" href="'+url+'"><img src="'+img+'" alt="web"></a>';

                    panorama_static.find('.sslinks-web').html(html);

                } else {

                    panorama_static.find('.sslinks-web').html('');

                }

            } else {

                panorama_static.find('.sslinks-web').html('');

            }

        break;

        case 'map':

            if( ~~options.start_screen_map ){

                var url = options.start_screen_map_url;

                url = url.trim();

                if( url !== '' ){

                    url = THEASYS.fn.parse_url(url);

                    var img = theme_img_path+'/pin.png';

                    var html = '<a target="_blank" rel="noopener" href="'+url+'"><img src="'+img+'" alt="map"></a>';

                    panorama_static.find('.sslinks-map').html(html);

                } else {

                    panorama_static.find('.sslinks-map').html('');

                }

            } else {

                panorama_static.find('.sslinks-map').html('');

            }

        break;

        case 'tel':

            if( ~~options.start_screen_tel ){

                var url = ''+options.start_screen_tel_url;

                url = url.trim();

                if( url !== '' ){

                    var img = theme_img_path+'/call.png';

                    var html = '<a href="tel:'+url+'"><img src="'+img+'" alt="phone"></a>';

                    panorama_static.find('.sslinks-tel').html(html);

                } else {

                    panorama_static.find('.sslinks-tel').html('');

                }

            } else {

                panorama_static.find('.sslinks-tel').html('');

            }

        break;

    }

};
