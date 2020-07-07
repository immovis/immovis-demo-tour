/*
 *  Name : Logo
 *  Description : Displays user uploaded logo on the top left corner
 *  Author : John Barounis
 *  Version : 0.0.1
*/

THEASYS.theme.autoLoadFunction('logo','init');

THEASYS.theme.modules.logo.initialized = false;

THEASYS.theme.modules.logo.init = function( ){

    var options = THEASYS.renderer.vars.get('options');

    var uid = THEASYS.renderer.vars.get('uid');

    var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');

    var html = `<div id="viewer_logo" class="viewer_logo"></div>`;

    THEASYS.theme.prependHtml(html,document.getElementById('viewer_wrapper'));

    var viewer_logo = $('#viewer_logo');

    if( options.logo_image !== '' ){

        if( 'logo_path' in options ){

            THEASYS.renderer.logo = vars.paths.options+'/'+uid+'/'+tour_rnd+'/'+options.logo_path;

        }

    }

    viewer_logo.html('<img src="'+THEASYS.renderer.logo+'" alt="logo">');

    if( 'logo_url' in options && options.logo_url !== '' ){

        viewer_logo.find('img').wrap('<a target="_blank" rel="noopener" href="'+THEASYS.fn.parse_url(options.logo_url)+'"></a>');

    }

    this.display();

    this.initialized = true;

    viewer_logo.on('click',function(){

        THEASYS.theme.exec('menu','closeOnActions');

    });

    THEASYS.renderer.event.on('resize',function(){

        if( THEASYS.theme.modules.logo.initialized ){

            var vr = THEASYS.renderer.vars.get('vr');

            var device = THEASYS.renderer.vars.get('device');

            if( vr && device.isMobile ){

                var w = $(window).width();

                $('#viewer_logo').addClass('half');

                var viewer_logo_cloned = $('#viewer_logo_cloned');

                if( !viewer_logo_cloned.length ){

                    var viewer_logo_cloned =  $('#viewer_logo').clone();

                    viewer_logo_cloned.attr("id", "viewer_logo_cloned");

                    viewer_logo_cloned.css({left : (w/2) + 10});

                    $('#viewer_wrapper').append(viewer_logo_cloned);

                } else {

                    viewer_logo_cloned.css({left : (w/2) + 10,opacity:1});

                }

                var logo_display = THEASYS.renderer.vars.get('options.logo_display');

                if( ~~logo_display ){

                    viewer_logo_cloned.show();

                } else {

                    viewer_logo_cloned.hide();

                }

            }

        }

    });

    THEASYS.renderer.event.on('toggleVr',function(vr){

        var isMobile = THEASYS.renderer.vars.get('device.isMobile');

        if( vr ){

            if( isMobile ){


            }

        } else {

            if( isMobile ){

                $('#viewer_logo_cloned').hide();

                $('#viewer_logo').removeClass('half');

            }

        }

    });

};

THEASYS.theme.modules.logo.listenToEdits = function( obj ){

    for( var k in obj ){

        switch( k ){

            case'logo_display':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.logo_display',value);

                this.display();

                THEASYS.theme.exec('shadow','display');

            break;

            case'logo_url':

                THEASYS.renderer.vars.set('options.logo_url',obj[k]);

                if( obj[k] !== '' ){

                    var viewer_logo_a = $('#viewer_logo').find('a');

                    if( viewer_logo_a.length ){

                        viewer_logo_a.attr('rel','noopener').attr('href',THEASYS.fn.parse_url(obj[k]));

                    } else {

                        $('#viewer_logo').find('img').wrap('<a target="_blank" rel="noopener" href="'+THEASYS.fn.parse_url(obj[k])+'"></a>');

                    }

                } else {

                    var viewer_logo_a = $('#viewer_logo').find('a');

                    if( viewer_logo_a.length ){

                        $('#viewer_logo').find('img').unwrap('a');

                    } else {

                        //$('#viewer_logo').find('img').wrap('<a target="_blank" rel="noopener" href="'+_vars.options.logo_url+'"></a>');

                    }

                }

            break;

            case'logo_delete':

                THEASYS.renderer.vars.set('options.logo_image','');
                THEASYS.renderer.vars.set('options.logo_path','');

                THEASYS.renderer.logo = THEASYS.renderer.vars.get('empty_img');

                $('#viewer_logo').find('img').attr('src',THEASYS.renderer.logo);

                THEASYS.theme.exec('shadow','display');

            break;

            case'logo_insert':

                THEASYS.renderer.vars.set('options.logo_image',obj[k].logo);
                THEASYS.renderer.vars.set('options.logo_path',obj[k].logo_abs);

                THEASYS.renderer.logo = obj[k].logo_abs;

                $('#viewer_logo').find('img').attr('src',THEASYS.renderer.logo);

                THEASYS.theme.exec('shadow','display');

            break;

            case'logo_image':

                var value = obj[k];

                THEASYS.renderer.vars.set('options.logo_image',value);

                if( value !== '' ){

                    THEASYS.renderer.vars.set('options.logo_path','logo/'+value);

                    THEASYS.renderer.logo = vars.paths.options+'/'+THEASYS.renderer.vars.get('uid')+'/'+THEASYS.renderer.vars.get('tour_rnd')+'/'+THEASYS.renderer.vars.get('options.logo_path');

                } else {

                    THEASYS.renderer.vars.set('options.logo_path','');

                    THEASYS.renderer.logo = THEASYS.renderer.vars.get('empty_img');

                }

                $('#viewer_logo').find('img').attr('src',THEASYS.renderer.logo);

                THEASYS.theme.exec('shadow','display');

            break;

        }

    }

};

THEASYS.theme.modules.logo.display = function( ){

    var logo_display = THEASYS.renderer.vars.get('options.logo_display');

    if( ~~logo_display ){

        $('#viewer_logo').show();

        $('#viewer_logo').animate({opacity:1},500);

    } else {

        $('#viewer_logo').animate({opacity:0},500,function(){

            $('#viewer_logo').hide();

        });

    }

};
