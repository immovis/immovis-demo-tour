/*
 *  Name : Share
 *  Description : Ability for users to share tour or share specific panorama view
 *  Author : John Barounis
 *  Version : 0.0.3
*/

THEASYS.theme.autoLoadFunction('share','init');

THEASYS.theme.modules.share.initialized = false;

THEASYS.theme.modules.share.created = 0;

THEASYS.theme.modules.share.eventsCreated = 0;

THEASYS.theme.modules.share.init = function(){

    if( THEASYS.theme.vars.share.created ){

        return false;

    }

    //check to see if share exists

    var options = THEASYS.renderer.vars.get('options');
    var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');

    var share_exists = 0;

    var share_menu = parseInt(options.share_menu,10);

    if( THEASYS.cache.obj.tours[tour_rnd].tour.domain_specific === 0 ){

        if( editing ){

            share_exists = 1;

        } else {

            if( share_menu ){

                share_exists = 1;

            }

        }

    }

    if( !share_exists ){

        //check to see if we have it in the context menu

        if( parseInt(options.share_context_menu,10) ){

            share_exists = 1;

        }

    }

    if( !share_exists ){

        return false;

    }

    var title = document.title;
    var title_euc = encodeURIComponent(title);

    var image = document.head.querySelector("[name~=image][content]").content;
    var image_euc = encodeURIComponent(image);

    if( vars.exported ){

        image_euc = vars.path+image_euc;

    }

    var url = document.head.querySelector("[name~=url][content]").content;
    var url_euc = encodeURIComponent(url);

    if( vars.exported ){

        url_euc = vars.path+url_euc;

    }

    var description = document.head.querySelector("[name~=description][content]").content;
    var description_euc = encodeURIComponent(description);

    //add share html

    var html = `
        <div id="panorama-share">
           <span class="panorama-share-close">
                <img src="${vars.paths.static}/themes/${vars.theme}/assets/modules/share/img/close.png" alt="close popup">
            </span>
            <div id="panorama-share-content">
                <ul class="tab-menu">
                    <li data-rel="share_tour" class="active">Share Tour</li>
                    <li data-rel="share_this_view">Share This View</li>
                </ul>
                <div class="tab-panes">
                    <div data-rel="share_tour" class="tab-pane active">
                        <input type="text" id="panorama-share-input">
                        <p>Copy &amp; paste the url above to share or</p>
                        <div class="social-share">
                            <span>
                                <a onclick="javascript:window.open(this.href,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;" data-href="https://www.facebook.com/dialog/share?app_id=231254307638115&display=popup&picture=${image_euc}&title=${title_euc}&description=${description_euc}&href=" href="#">
                                    <img src="${vars.paths.static}/themes/${vars.theme}/assets/modules/share/img/social/logo-facebook.svg" alt="facebook">
                                </a>
                            </span>
                            <span>
                                <a onclick="javascript:window.open(this.href,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;" data-href="https://www.facebook.com/dialog/send?app_id=231254307638115&redirect_uri=${url_euc}&link=" href="#">
                                    <img src="${vars.paths.static}/themes/${vars.theme}/assets/modules/share/img/social/logo-facebook-messenger.svg" alt="facebook messenger">
                                </a>
                            </span>
                            <span>
                                <a onclick="javascript:window.open(this.href,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');return false;" data-href="https://twitter.com/intent/tweet?text=${title_euc}&url=" href="#">
                                    <img src="${vars.paths.static}/themes/${vars.theme}/assets/modules/share/img/social/logo-twitter.svg" alt="twitter">
                                </a>
                            </span>
                            <span>
                                <a onclick="javascript:window.open(this.href,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;" data-href="https://www.reddit.com/submit?title=${title_euc}&url=" href="#">
                                    <img src="${vars.paths.static}/themes/${vars.theme}/assets/modules/share/img/social/logo-reddit.svg" alt="reddit">
                                </a>
                            </span>
                        </div>
                    </div>
                    <div data-rel="share_this_view" class="tab-pane">
                        <div id="share_this_view_loader" class="hidden loading"></div>
                        <div data-loaded="0" id="share_this_view_content">
                            <input type="text" id="panorama-share-this-view-input">
                            <p>Copy &amp; paste the url above to share or</p>
                            <div class="social-share">
                                <span>
                                    <a onclick="javascript:window.open(this.href,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;" data-href="https://www.facebook.com/dialog/share?app_id=231254307638115&display=popup&picture=${image_euc}&title=${title_euc}&description=${description_euc}&href=" href="#">
                                        <img src="${vars.paths.static}/themes/${vars.theme}/assets/modules/share/img/social/logo-facebook.svg" alt="facebook">
                                    </a>
                                </span>
                                <span>
                                    <a onclick="javascript:window.open(this.href,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;"    data-href="https://www.facebook.com/dialog/send?app_id=231254307638115&redirect_uri=${url_euc}&link=" href="#">
                                        <img src="${vars.paths.static}/themes/${vars.theme}/assets/modules/share/img/social/logo-facebook-messenger.svg" alt="facebook messenger">
                                    </a>
                                </span>
                                <span>
                                    <a onclick="javascript:window.open(this.href,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');return false;" data-href="https://twitter.com/intent/tweet?text=${title_euc}&url=" href="#">
                                        <img src="${vars.paths.static}/themes/${vars.theme}/assets/modules/share/img/social/logo-twitter.svg" alt="twitter">
                                    </a>
                                </span>
                                <span>
                                    <a onclick="javascript:window.open(this.href,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;" data-href="https://www.reddit.com/submit?title=${title_euc}&url=" href="#">
                                        <img src="${vars.paths.static}/themes/${vars.theme}/assets/modules/share/img/social/logo-reddit.svg" alt="reddit">
                                    </a>
                                </span>
                            </div>
                        </div>
                        <div id="share_this_view_error" class="hidden">
                            <p>Something went wrong. Please try again.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="panorama-share-overlay"></div>
    `;

    THEASYS.theme.appendHtml(html);

    THEASYS.theme.modules.share.createEvents(1);

    THEASYS.theme.modules.share.initialized = true;

};

THEASYS.theme.modules.share.createEvents = function( visible ){

    if( this.eventsCreated ){

        return false;

    }

    var editing = THEASYS.renderer.vars.get('editing');

    var events_create = 0;

    if( editing ){

        events_create = 1;

    } else {

        if( visible ){

            events_create = 1;

        }

    }

    if( events_create ){

        $('#panorama-share-overlay').on('click touchmove',function(e){

            e.preventDefault();

            $('#panorama-share').fadeOut();

            $('#panorama-share-overlay').fadeOut();

            $('#share_this_view_content').data('loaded',0);

            THEASYS.theme.modules.share.resetGui();

            THEASYS.renderer.vars.set('autoRotationTemporarilyDisabled',false);

            return false;

      });

      $('.panorama-share-close').on('click touchmove',function(e){

            e.preventDefault();

            $('#panorama-share').fadeOut();

            $('#panorama-share-overlay').fadeOut();

            $('#share_this_view_content').data('loaded',0);

            THEASYS.theme.modules.share.resetGui();

            THEASYS.renderer.vars.set('autoRotationTemporarilyDisabled',false);

            return false;

      });

      $('#panorama-share-content .tab-menu li').on('click',function(){

            var jthis = $(this);
            var rel = jthis.data('rel');

            $('#panorama-share-content').find('.tab-pane[data-rel="'+rel+'"]').show().siblings().hide();

            jthis.addClass('active').siblings().removeClass('active');

            if( rel === 'share_this_view' ){

                var loaded = parseInt($('#share_this_view_content').data('loaded'),10);

                if( !loaded ){

                    $('#share_this_view_content').addClass('hidden');
                    $('#share_this_view_error').addClass('hidden');
                    $('#share_this_view_loader').removeClass('hidden');

                    var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');
                    var tour_embed_rnd = THEASYS.renderer.vars.get('tour_embed_rnd');
                    var id = THEASYS.renderer.vars.get('id');
                    var rnd = THEASYS.renderer.vars.get('rnd');
                    var current_position = THEASYS.renderer.vars.get('current_position');

                    if( vars.exported ){

                        var msg = THEASYS.check.newTourEmbedViewShare(
                                tour_rnd,
                                tour_embed_rnd,
                                id,
                                rnd,
                                current_position.x,
                                current_position.y,
                                current_position.z,
                                current_position.fov,
                                current_position.lat,
                                current_position.lon
                            );

                        if( 'status' in msg ){

                            if( msg.status ){

                                var url = vars.path+vars.file+'?s='+msg.data.f+','+msg.data.lt+','+msg.data.ln+','+msg.data.p+','+msg.data.r;

                                $('#panorama-share-this-view-input').val(url);

                                THEASYS.theme.modules.share.addUrlToShareLinks(url,'share_this_view');

                                $('#share_this_view_content').removeClass('hidden');
                                $('#share_this_view_error').addClass('hidden');
                                $('#share_this_view_loader').addClass('hidden');
                                $('#share_this_view_content').data('loaded',1);

                            } else {

                                $('#share_this_view_loader').addClass('hidden');
                                $('#share_this_view_error').removeClass('hidden');

                            }

                        } else {

                            $('#share_this_view_loader').addClass('hidden');
                            $('#share_this_view_error').removeClass('hidden');

                        }

                    } else {

                        THEASYS.fn.ajax.call({
                            url : THEASYS.fn.u('api','viewer'),
                            data:{
                                action : 'newTourEmbedViewShare',
                                params : {
                                    t : tour_rnd,
                                    h : tour_embed_rnd,
                                    e : id,
                                    a : rnd,
                                    s : current_position.x,
                                    y : current_position.y,
                                    s_ : current_position.z,
                                    _ : current_position.fov,
                                    __ : current_position.lat,
                                    ___ : current_position.lon,
                                },
                            },
                            sessionCheck : false,
                        }).then(function(msg){

                            if( 'status' in msg ){

                                if( msg.status ){

                                    var url = THEASYS.vars.short_url+'/'+msg.rnd;

                                    $('#panorama-share-this-view-input').val(url);

                                    THEASYS.theme.modules.share.addUrlToShareLinks(url,'share_this_view');

                                    $('#share_this_view_content').removeClass('hidden');
                                    $('#share_this_view_error').addClass('hidden');
                                    $('#share_this_view_loader').addClass('hidden');
                                    $('#share_this_view_content').data('loaded',1);

                                } else {

                                    $('#share_this_view_loader').addClass('hidden');
                                    $('#share_this_view_error').removeClass('hidden');

                                }

                            } else {

                                $('#share_this_view_loader').addClass('hidden');
                                $('#share_this_view_error').removeClass('hidden');

                            }

                        },function(){

                            $('#share_this_view_loader').addClass('hidden');
                            $('#share_this_view_error').removeClass('hidden');

                        });

                    }

                }

            }

        });

        $('#panorama-share-input').on('click',function(){

            $(this).select();

        });

        $('#panorama-share-this-view-input').on('click',function(){

            $(this).select();

        });

    }

    this.eventsCreated = 1;

};

THEASYS.theme.modules.share.load = function(){

    THEASYS.theme.exec('menu','autoHide');

    THEASYS.renderer.vars.set('autoRotationTemporarilyDisabled',true);

    setTimeout(function () {

        THEASYS.renderer.vars.set('autoRotationTemporarilyDisabled',true);

    },100);

    var url = THEASYS.vars.short_url+'/'+THEASYS.vars.short_url_embed_rnd;

    if( vars.exported ){

        url = vars.path+vars.file;

    }

    $('#panorama-share-input').val(url);

    this.addUrlToShareLinks(url,'share_tour');

    $('#panorama-share').fadeIn();

    $('#panorama-share-overlay').fadeIn();

};

THEASYS.theme.modules.share.addUrlToShareLinks = function(url,rel){

    var encoded_url = encodeURIComponent(url);

    if( rel ){

        var pane = $('#panorama-share').find('.tab-pane[data-rel="'+rel+'"]');

        if( pane && pane.length ){

            pane.find('a').each(function(){

                var jthis = $(this);
                var href = jthis.data('href');
                jthis.attr('href',href+encoded_url);

            });

        }

    }

};

THEASYS.theme.modules.share.resetGui = function(){

    $('#panorama-share-content .tab-menu li[data-rel="share_tour"]').addClass('active').siblings().removeClass('active');

    $('#panorama-share-content .tab-panes .tab-pane[data-rel="share_tour"]').addClass('active').siblings().removeClass('active');

};
