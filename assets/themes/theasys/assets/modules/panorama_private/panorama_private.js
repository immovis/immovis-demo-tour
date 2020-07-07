/*
 *  Name : panorama_private
 *  Description : Displays a screen where user is prompted to enter password in order to display the panorama
 *  Author : John Barounis
 *  Version : 0.0.1
*/

//THEASYS.theme.autoLoadFunction('panorama_private','init');

THEASYS.theme.modules.panorama_private.initialized = false;

THEASYS.theme.modules.panorama_private.init = function( ){

    var logo = vars.paths.static+'/themes/'+vars.theme+'/assets/img/logo.png';

    var lock = vars.paths.static+'/themes/'+vars.theme+'/assets/modules/panorama_private/img/lock.png';

    var html = `
        <div id="panorama-private">
            <div class="txt">
                <a target="_blank" rel="noopener" href="${vars.url}">
                    <img src="${logo}" alt="theasys.io logo" class="panorama-private-logo">
                </a>
                <p>This Virtual Tour is private. Please enter a password.</p>
                <div class="input-wrapper">
                    <img src="${lock}" alt="theasys lock" class="panorama-private-lock">
                    <input type="password" id="panorama-private-input">
                    <button id="panorama-private-button">Unlock</button>
                </div>
                <p id="panorama-private-error-empty" class="hidden">Empty password. Please enter a password.</p>
                <p id="panorama-private-error-wrong" class="hidden">Wrong password. Please try again.</p>
            </div>
        </div>
    `;

    THEASYS.theme.appendHtml(html);

    this.initialized = true;

    THEASYS.renderer.event.on('loadPrivateScreen',function(){

        THEASYS.theme.modules.panorama_private.load();

    });

};

THEASYS.theme.modules.panorama_private.load = function( ){

    $('body').addClass('panorama-pp-bg');

    var bg = THEASYS.vars.paths.static+'/themes/'+THEASYS.vars.theme+'/assets/modules/panorama_private/img/bg.jpg';

    $('.panorama-pp-bg').css({

        'background' : 'url('+bg+') no-repeat center center fixed',
        'filter' : "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+bg+"', sizingMethod='scale')",
        '-ms-filter' : "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+bg+"', sizingMethod='scale')",
        'background-size' : 'cover',

    });

    $('#viewer').addClass('hidden');
    $('#viewer_menu').addClass('hidden');

    THEASYS.theme.exec('loader','hide');

    $('#panorama-private').show();

    $('#panorama-private-input').on('keypress',function(e){

        if( e.which === 13 ){

            e.preventDefault();

            $('#panorama-private-button').trigger('click');

            return false;

        }

    });

    $('#panorama-private-button').on('click',function(e){

        e.preventDefault();

        $('#panorama-private-error-empty').addClass('hidden');
        $('#panorama-private-error-wrong').addClass('hidden');

        var panorama_private_input_elem = $('#panorama-private-input');
        var password = panorama_private_input_elem.val();

        if( password === '' ){

            $('#panorama-private-error-empty').removeClass('hidden');

            panorama_private_input_elem.focus();

            return false;

        } else {

            THEASYS.theme.exec('loader','show');

            var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');

            if( vars.exported ){

                if( password === vars.db.tour.private_password ){

                    $('#panorama-private').fadeOut(function(){

                        $('body').removeClass('panorama-pp-bg');
                        $('body').css('background','');

                        $('#viewer').removeClass('hidden');
                        $('#viewer_menu').removeClass('hidden');

                        THEASYS.renderer.vars.set('tour_password',password);

                        THEASYS.renderer.process();

                    });

                } else {

                    $('#panorama-private-error-wrong').removeClass('hidden');
                    panorama_private_input_elem.focus();

                }

                THEASYS.theme.exec('loader','hide');

            } else {

                THEASYS.fn.ajax.call({
                    url : THEASYS.fn.u('api','viewer'),
                    data : {
                        action : 'tourPasswordCheck',
                        params : {
                            p : password,
                            q : tour_rnd,
                        },
                    },
                    sessionCheck : false,

                }).then(function(msg){

                    if(msg){

                        $('#panorama-private').fadeOut(function(){

                            $('body').removeClass('panorama-pp-bg');
                            $('body').css('background','');

                            $('#viewer').removeClass('hidden');
                            $('#viewer_menu').removeClass('hidden');

                            THEASYS.renderer.vars.set('tour_password',password);

                            THEASYS.renderer.process();

                        });

                    } else {

                        $('#panorama-private-error-wrong').removeClass('hidden');
                        panorama_private_input_elem.focus();

                    }

                    THEASYS.theme.exec('loader','hide');

                },function(error) {

                    $('#panorama-private-error-wrong').removeClass('hidden');
                    panorama_private_input_elem.focus();

                    THEASYS.theme.exec('loader','hide');

                });

            }

            return false;

        }

        return false;

    });

};
