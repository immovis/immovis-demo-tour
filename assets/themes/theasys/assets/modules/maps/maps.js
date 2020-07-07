/*
 *  Name : Maps
 *  Description : Displays google maps and / or custom maps
 *  Author : John Barounis
 *  Version : 0.0.1
*/

THEASYS.theme.autoLoadFunction('maps','init');

THEASYS.theme.modules.maps.initialized = 0;

THEASYS.theme.modules.maps.guiCreated = 0;

THEASYS.theme.modules.maps.map_gui_mode = 0;

THEASYS.theme.modules.maps.customMapPosition = {0:{x:0,y:0,scale:1}};

THEASYS.theme.modules.maps.init = function( ){

    var html = `
        <div id="map-wrapper" class="noselect">
            <div id="map">
                <div class="flex-container">
                    <div id="map_geo-wrapper" class="flex-item"></div>
                    <div id="map_resizer-wrapper" class="flex-item"></div>
                    <div id="map_custom-wrapper" class="flex-item">
                        <div id="floorplan-img-pins"></div>
                        <div id="floorplan-radar"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    THEASYS.theme.prependHtml(html);

    if( this.guiCreated ){

        return false;

    }

    var map_status = this.check_to_see_if_we_have_map();

    THEASYS.renderer.vars.set('hasMap',map_status);

    var custom_map_status = 0;

    var options = THEASYS.renderer.vars.get('options');

    if( 'maps_custom_position' in options && options.maps_custom_position ){

        this.customMapPosition = JSON.parse(options.maps_custom_position);

    }

    var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');

    if( 'tour' in THEASYS.cache.obj.tours[tour_rnd] && !THEASYS.fn.is_empty(THEASYS.cache.obj.tours[tour_rnd].tour) ){

        if( ( 'floorplan' in THEASYS.cache.obj.tours[tour_rnd].tour ) && THEASYS.cache.obj.tours[tour_rnd].tour.floorplan ){

            custom_map_status = 1;

        }

        if( !parseInt( options.maps_custom_show, 10 ) ){

            custom_map_status = 0;

        }

    }

    if( map_status === 1 && custom_map_status === 0 ){

        this.map_gui_mode = 1;

    } else if( map_status === 0 && custom_map_status === 1 ){

        this.map_gui_mode = 2;

    } else if( map_status === 1 && custom_map_status === 1 ){

        this.map_gui_mode = 3;

    }

    if( this.map_gui_mode ){

        var viewer_wrapper = $('#viewer_wrapper');
        var viewer = $('#viewer');

        var html = '<div id="map_button_wrapper"><span data-tooltip="Toggle Map" class="map"><span class="icon_map"><img src="'+THEASYS.vars.paths.static+'/themes/'+THEASYS.vars.theme+'/assets/modules/maps/img/globe.png" alt="Globe"></span></span></div>';

        viewer_wrapper.append(html);

        if( this.map_gui_mode === 3 ){

            var html = '  <div class="flex-container">';
            html += '   <div id="map_geo-wrapper" class="flex-item"></div>';
            html += '   <div id="map_resizer-wrapper" class="flex-item"></div>';
            html += '   <div id="map_custom-wrapper" class="flex-item">';
            html += '     <div id="map_custom-img-wrapper" style="height:100%">';

            html += '     <img src="" id="floorplan-img" alt="Map Custom Image" />';
            html += '     </div>';
            html += '     <div id="floorplan-img-pins"></div>';
            html += '     <div id="floorplan-radar" data-panorama="0"></div>';

            html += '   </div>';
            html += '  </div>';

            $('#map').html(html);

            var h = ( $(window).height() / 2 ) - ( $('#map_resizer-wrapper').height() / 2 );

            $('#map_geo-wrapper').css({height: h });
            $('#map_custom-wrapper').css({height: h });

            this.loadGeoMap();

            $('#map_resizer-wrapper').draggable({

                axis: "y",
                containment: "#map",
                drag: function( event, ui ) {

                    $('#map_geo-wrapper').css({ height: ui.offset.top });

                    //var map_height = $('#map').height();
                    var map_height = $(window).height();

                    var resizer_height = $('#map_resizer-wrapper').height();

                    $('#map_custom-wrapper').css({ height: ( map_height - ui.offset.top ) - resizer_height });

                    if( THEASYS.theme.modules.maps.map.loaded ){

                        var center = THEASYS.theme.modules.maps.map.map.getCenter();
                        google.maps.event.trigger(THEASYS.theme.modules.maps.map.map, "resize");
                        THEASYS.theme.modules.maps.map.map.setCenter(center);

                        THEASYS.theme.modules.maps.map.resize();

                    }

                    THEASYS.theme.modules.maps.customMap.adjustImage();
                    THEASYS.theme.modules.maps.customMap.adjustCustomMapPins();

                },

            });

        } else if( this.map_gui_mode === 1 ){

            var html = '  <div class="flex-container">';
               html += '   <div id="map_geo-wrapper" class="flex-item"></div>';
               html += '  </div>';

            $('#map').html(html);

            var h = $(window).height();

            $('#map_geo-wrapper').css({height: h });

            this.loadGeoMap();

        } else if( this.map_gui_mode === 2 ){

            var html = '  <div class="flex-container">';
            html += '   <div id="map_custom-wrapper" class="flex-item">';
            html += '     <div id="map_custom-img-wrapper" style="height:100%">';
            html += '       <img src="" id="floorplan-img" alt="Map Custom Image" />';
            html += '     </div>';
            html += '     <div id="floorplan-img-pins" class=""></div>';
            html += '     <div id="floorplan-radar" data-panorama="0"></div>';
            html += '   </div>';
            html += '  </div>';

            $('#map').html(html);

            var h = $(window).height();

            $('#map_geo-wrapper').css({height: h });

        }

        this.guiCreated = 1;

        if( this.map_gui_mode > 0 ){

            this.loadMapButton(map_status);

        }

    }

    THEASYS.renderer.event.on('fovChange',function(){

        THEASYS.theme.modules.maps.onFovChange();

    });

    THEASYS.renderer.event.on('processPanoramaAfter',function(action){

        var loadedOnce = THEASYS.renderer.vars.get('loadedOnce');

        if( loadedOnce ){

            //THEASYS.theme.modules.maps.init();
            THEASYS.theme.modules.maps.createMapRadar(action);

        }

    });

    THEASYS.renderer.event.on('panoramaToScene',function(action){

        var loadedOnce = THEASYS.renderer.vars.get('loadedOnce');

        if( loadedOnce ){

            THEASYS.theme.modules.maps.customMap.setCustomMapRadar(action);

        }

    });

    THEASYS.renderer.event.on('toggleVr',function( vr ){

        var isMobile = THEASYS.renderer.vars.get('device.isMobile');

        if( vr ){

            if( isMobile ){

                $('#map_button_wrapper').addClass('hidden');

                THEASYS.theme.modules.maps.toogle(1);

            }

        } else {

            if( isMobile ){

                $('#map_button_wrapper').removeClass('hidden');

            }

        }

    });

    THEASYS.renderer.event.sendOn('resize',function(){

        //return [ 'maps' , $('#map-wrapper').outerWidth() || 0 ];
        return $('#map-wrapper').outerWidth();
        //return { maps : $('#map-wrapper').outerWidth() || 0 };

    });

    THEASYS.renderer.event.on('resize',function(){

        if( THEASYS.theme.modules.maps.map_gui_mode === 1 ){

            var window_height = $(window).height();

            $('#map_geo-wrapper').css({height: window_height });

        }

        if( THEASYS.theme.modules.maps.map_gui_mode === 2 ){

            var window_height = $(window).height();

            $('#map_custom-wrapper').css({height: window_height });

        }

        if( THEASYS.theme.modules.maps.map_gui_mode === 3 ){

            $('#map_custom-img-wrapper').height($('#map').height());

            var window_height = $(window).height();
            var map_height = $('#map_geo-wrapper').height();
            var resizer_height = $('#map_resizer-wrapper').height();

            $('#map_custom-wrapper').css({height: window_height - ( map_height + resizer_height )  });

        }

        if( THEASYS.theme.modules.maps.map_gui_mode ){

            var map_button_wrapper = $('#map_button_wrapper');

            map_button_wrapper.css({

              top: ( $(window).height() - map_button_wrapper.outerHeight() ) / 2 ,

            });

        }

    });

    THEASYS.renderer.event.on('gyroscope',function( state ){

        if( !state ){

            THEASYS.theme.modules.maps.rotateCustomMapRadar();

            THEASYS.theme.modules.maps.setMapRadarOrientation();

        }

    });

    THEASYS.renderer.event.on('userMovePanorama',function( w ){

        if( w === 'in' || w === 'out' ){

            THEASYS.theme.modules.maps.setRadarMarkerWidth();

        }

    });

    THEASYS.renderer.event.on('goTo',function( ){

        THEASYS.theme.modules.maps.rotateCustomMapRadar();

    });

    THEASYS.renderer.event.on('render',function( ){

        var device = THEASYS.renderer.vars.get('device');
        var controls = THEASYS.renderer.vars.get('controls');

        if( device.isMobile && !THEASYS.fn.is_empty(controls) ){

            var dlon = 180 + controls.update();

            THEASYS.theme.modules.maps.rotateCustomMapRadar(dlon);

            THEASYS.theme.modules.maps.setRadarOrientation(dlon);

        }

    });

    this.initialized = true;

    if( map_status === 1 || custom_map_status === 1 ){

        if( ~~options.maps_opended ){

            //map_button_wrapper.find('.map').trigger('click');

            THEASYS.theme.modules.maps.toogle(false);
            THEASYS.theme.modules.maps.map.resize();

        }

    }


};

THEASYS.theme.modules.maps.listenToEdits = function( obj ){

    for( var k in obj ){

        switch( k ){

            case'maps_close_on_actions':

                THEASYS.renderer.vars.set('options.maps_close_on_actions',+obj[k]);

            break;

            case'maps_geo_markers_show_panorama_title_on_hover':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.maps_geo_markers_show_panorama_title_on_hover',value);

                if( value ){

                    this.map.toggleMarkerTitles(1);

                } else {

                    this.map.toggleMarkerTitles(0);

                }

            break;

            case'maps_custom_markers_show_panorama_title_on_hover':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.maps_custom_markers_show_panorama_title_on_hover',value);

                if( value ){

                    this.customMap.customMapPinsTitles(1);

                } else {

                    this.customMap.customMapPinsTitles(0);

                }

            break;

            case'maps_custom_radar':

                var value = +obj[k];

                THEASYS.renderer.vars.set('options.maps_custom_radar',value);

                this.customMap.adjustCustomMapPins();

                this.customMap.rotateCustomMapRadar();

            break;

        }

    }

};

THEASYS.theme.modules.maps.toogle = function( state ){

    var map_button_wrapper = $('#map_button_wrapper');

    var map = $('#map');

    var map_wrapper = $('#map-wrapper');

    var jthis = map_button_wrapper.find('.map');

    if( state !== undefined  ){

    } else {

        state = jthis.hasClass('selected');

    }

    var device = THEASYS.renderer.vars.get('device');

    if( device.isMobile ){

        this.map.current_size.width = 150;

    }

    map.css({

        width : this.map.current_size.width,

    });

    if( state ) {

        jthis.removeClass('selected');

        jthis.parent().removeClass('selected');

        map_wrapper.css('width','0px');

        this.adjustViewer();

        var draggableInstance = map_button_wrapper.draggable( "instance" );

        if( draggableInstance ){

            map_button_wrapper.draggable( "option", "disabled", true );

        }

    } else {

        jthis.addClass('selected');

        jthis.parent().addClass('selected');

        var draggableInstance = map_button_wrapper.draggable( "instance" );

        if(draggableInstance){

            map_button_wrapper.draggable( "option", "disabled", false );

        }

        $('#map_custom-wrapper').css({width:'100%'});

        map.css('width',this.map.current_size.width+'px');

        map_wrapper.css('width',this.map.current_size.width+'px');

        this.adjustViewer();

        this.customMap.loadCustomMap(this.customMapPosition);
        this.customMap.adjustCustomMapPins();

    }

}

THEASYS.theme.modules.maps.adjustViewer = function(w){

    var width = 0;

    var map_button_wrapper = $('#map_button_wrapper');

    if( w ){

        width = w;

    } else {

        if( map_button_wrapper.find('.map').hasClass('selected') ){

            map_button_wrapper.css({left:$(window).width() - this.map.current_size.width - map_button_wrapper.outerWidth()});

        } else {


            map_button_wrapper.css({left:$(window).width() - map_button_wrapper.outerWidth()});

        }

    }

    THEASYS.renderer.resize();

    this.customMap.adjustCustomMapPins();

    this.customMap.adjustImage();

};

THEASYS.theme.modules.maps.setRadarMarkerWidth = function(){

    this.map.setRadarMarkerWidth();

};

THEASYS.theme.modules.maps.mapAutoShrink = function(){

    this.map.auto_shrink();

};

THEASYS.theme.modules.maps.rotateCustomMapRadar = function(dlon){

    if( dlon ){

        this.customMap.rotateCustomMapRadar(dlon);

    } else {

        this.customMap.rotateCustomMapRadar();

    }

};

THEASYS.theme.modules.maps.setRadarOrientation = function(dlon){

    if( this.map && this.map.radar_markers['radar']){

        var angle = parseInt( dlon + this.map.radar_markers['radar'].orientation, 10 );

        this.map.setRadarOrientation(angle);

    }

};

THEASYS.theme.modules.maps.setMapRadarOrientation = function(){

    if( this.map && this.map.radar_markers['radar'] ){

        var lat = THEASYS.renderer.vars.get('lat');
        var lon = THEASYS.renderer.vars.get('lon');

        var xyz = THEASYS.fn.latLonToXYZ(parseFloat(lat,10),parseFloat(lon,10));

        var deg = THEASYS.fn.xyzToDeg(xyz.x,xyz.y,xyz.z);

        var angle = parseInt(deg+this.map.radar_markers['radar'].orientation,10);

        THEASYS.renderer.vars.set('current_orientation',angle);

        this.map.setRadarOrientation(angle);

    }

};

THEASYS.theme.modules.maps.onFovChange = function(){

    if( this.map && this.map.radar_markers['radar'] ){

        var lat = THEASYS.renderer.vars.get('lat');
        var lon = THEASYS.renderer.vars.get('lon');

        this.setRadarMarkerWidth();

        var latLon = THEASYS.fn.latLonToXYZ(parseFloat(lat,10),parseFloat(lon,10));

        var deg = THEASYS.fn.xyzToDeg(parseFloat(latLon.x,10),parseFloat(latLon.y,10),parseFloat(latLon.z,10));

        var angle = parseInt(deg+this.map.radar_markers['radar'].orientation,10);

        THEASYS.renderer.vars.set('current_orientation',angle);

        this.setRadarOrientation(angle);

    }

};


THEASYS.theme.modules.maps.createMapRadar = function(action){

    var hasMap = THEASYS.renderer.vars.get('hasMap');

    if( hasMap ) {

        var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');
        var id = THEASYS.renderer.vars.get('id');

        var lat = parseFloat( THEASYS.cache.obj.tours[tour_rnd].panoramas[id].latitude, 10 );
        var lng = parseFloat( THEASYS.cache.obj.tours[tour_rnd].panoramas[id].longitude, 10 );

        if( lat != 0 && lng != 0 ){

            var options_maps_geo_radar = THEASYS.renderer.vars.get('options.maps_geo_radar');

            if( ~~options_maps_geo_radar ){

                this.map.createRadarMarker( THEASYS.cache.obj.tours[tour_rnd].panoramas[id], action );

                THEASYS.renderer.event.on('updatePanoramaPosition',function(){

                    var current_position = THEASYS.renderer.vars.get('current_position');

                    var deg = THEASYS.fn.xyzToDeg(current_position.x,current_position.y,current_position.z);

                    var angle = parseInt(deg + THEASYS.theme.modules.maps.map.radar_markers['radar'].orientation,10);

                    THEASYS.renderer.vars.set('current_orientation', angle);

                    THEASYS.theme.modules.maps.map.setRadarOrientation(angle);

                });

            } else {

            }

        } else {

            THEASYS.fn.map.markers.removeAll( this.map.radar_markers );

        }

    }

};

THEASYS.theme.modules.maps.loadGeoMap = function(){

    var options = THEASYS.renderer.vars.get('options');
    var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');

    var atLeastOnePanoramaLat = 0;
    var atLeastOnePanoramaLng = 0;

    if(

    'tours' in THEASYS.cache.obj
    && THEASYS.cache.obj.tours
    && tour_rnd in THEASYS.cache.obj.tours
    && THEASYS.cache.obj.tours[tour_rnd]
    && 'tour' in THEASYS.cache.obj.tours[tour_rnd]
    && THEASYS.cache.obj.tours[tour_rnd].tour
    && 'panoramas' in THEASYS.cache.obj.tours[tour_rnd].tour

    ){

        for( var i in THEASYS.cache.obj.tours[tour_rnd].tour['panoramas'] ){

            var lat = parseFloat(THEASYS.cache.obj.tours[tour_rnd].tour['panoramas'][i].lat,10);
            var lng = parseFloat(THEASYS.cache.obj.tours[tour_rnd].tour['panoramas'][i].lng,10);

            if( lat != 0 && lng != 0 ){

                var hasGPSAtLeastOnePanorama = THEASYS.renderer.vars.get('hasGPSAtLeastOnePanorama');

                THEASYS.renderer.vars.set('hasGPSAtLeastOnePanorama',hasGPSAtLeastOnePanorama++);

                //_vars.hasGPSAtLeastOnePanorama++;

                atLeastOnePanoramaLat = lat;
                atLeastOnePanoramaLng = lng;

            }

        }

    }

    var obj = THEASYS.renderer.vars.get('obj');


    if( !this.map.loaded && obj ){

        var lat = parseFloat(obj.latitude,10);
        var lng = parseFloat(obj.longitude,10);
        var zoom = 10;

        if( lat == 0 || lng == 0 ){

            var lat = parseFloat(obj.tour_map_latitude,10);
            var lng = parseFloat(obj.tour_map_longitude,10);

            var zoom = parseInt(obj.tour_map_zoom,10);

            if( lat == 0 || lng == 0 ){

                lat = atLeastOnePanoramaLat;
                lng = atLeastOnePanoramaLng;

            }

            if( lat == 0 || lng == 0 ){

                return false;

            }

        }

        var nLatlng = new google.maps.LatLng(lat, lng);

        this.map.init('map_geo-wrapper',nLatlng,zoom,function(){

            var hasGPSAtLeastOnePanorama = THEASYS.renderer.vars.get('hasGPSAtLeastOnePanorama');

            if( !hasGPSAtLeastOnePanorama ){

                THEASYS.theme.modules.maps.map.createTourMarker(lat, lng);

            }

            var action_view = THEASYS.renderer.vars.get('action_view');

            THEASYS.theme.modules.maps.createMapRadar(action_view);

            THEASYS.theme.modules.maps.map.loaded = true;

        });

    }

  };

THEASYS.theme.modules.maps.loadMapButton = function(map_status){

    var map_button_wrapper = $('#map_button_wrapper');
    var map = $('#map');
    var map_wrapper = $('#map-wrapper');

    var map_button_wrapper_is_dragging = false;

    map_button_wrapper.css({

        top: ( $(window).height() - map_button_wrapper.outerHeight() ) / 2 ,
        right: 0,
        display : 'block'

    });

    map_button_wrapper.on('click','.map',function(){

        if( map_button_wrapper_is_dragging ){

            map_button_wrapper_is_dragging = false;
            return false;

        }

        THEASYS.theme.modules.maps.toogle();

        if(map_status){

            THEASYS.theme.modules.maps.map.resize();

        }

    });

    var options = THEASYS.renderer.vars.get('options');

    var editing = THEASYS.renderer.vars.get('editing');

    var viewer = $('#viewer');

    if( editing ){

        viewer.on('click',function(){

            if( ~~options.maps_close_on_actions && map_button_wrapper.hasClass('selected') ){

                map_button_wrapper.find('.map').trigger('click');

            }

        });

    } else {

      if( ~~options.maps_close_on_actions ){

            viewer.on('click',function(){

                if( map_button_wrapper.hasClass('selected') ){

                    map_button_wrapper.find('.map').trigger('click');

                }

            });

        }

    }

    map_button_wrapper.draggable({

        axis: "x",
        containment: "body",

        start: function( event, ui ) {

            if( !THEASYS.theme.modules.maps.customMap.floorPlanLoaded ){

                THEASYS.theme.modules.maps.customMap.loadCustomMap(THEASYS.theme.modules.maps.customMapPosition);

            }

        },

        drag: function( event, ui ) {

            var width = $(window).width() - ui.position.left - $(this).outerWidth();

            map_button_wrapper_is_dragging = true;

            map.css({'width':width});
            map_wrapper.css({'width':width});

            if( THEASYS.theme.modules.maps.map.loaded ){

              var center = THEASYS.theme.modules.maps.map.map.getCenter();
              google.maps.event.trigger(THEASYS.theme.modules.maps.map.map, "resize");
              THEASYS.theme.modules.maps.map.map.setCenter(center);

              THEASYS.theme.modules.maps.map.resize();

            }

            THEASYS.theme.modules.maps.map.current_size.width = width;

            THEASYS.theme.modules.maps.customMap.adjustCustomMapPins();

            THEASYS.theme.modules.maps.adjustViewer();

        },

        stop: function( event, ui ) {

            window.setTimeout(function(){

                map_button_wrapper_is_dragging = false;

            },100);

        },

    });

};

THEASYS.theme.modules.maps.check_to_see_if_we_have_map = function(){

    var map_status = 0;

    var options = THEASYS.renderer.vars.get('options');
    var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');

    if( 'tour' in THEASYS.cache.obj.tours[tour_rnd] && !THEASYS.fn.is_empty(THEASYS.cache.obj.tours[tour_rnd].tour) ){

        if( ( 'map_latitude' in THEASYS.cache.obj.tours[tour_rnd].tour && THEASYS.cache.obj.tours[tour_rnd].tour.map_latitude != 0 ) && ( 'map_longitude' in THEASYS.cache.obj.tours[tour_rnd].tour && THEASYS.cache.obj.tours[tour_rnd].tour.map_longitude != 0 ) ){

            map_status = 1;

        }

    }

    if( !map_status ){

        if( 'tour' in THEASYS.cache.obj.tours[tour_rnd] && !THEASYS.fn.is_empty(THEASYS.cache.obj.tours[tour_rnd].tour) ){

            if( 'panoramas' in THEASYS.cache.obj.tours[tour_rnd].tour && THEASYS.cache.obj.tours[tour_rnd].tour.panoramas.length > 0 ){

                for( var i = 0, l = THEASYS.cache.obj.tours[tour_rnd].tour.panoramas.length; i< l; i++ ){

                    if( THEASYS.cache.obj.tours[tour_rnd].tour.panoramas[i].lat != 0 && THEASYS.cache.obj.tours[tour_rnd].tour.panoramas[i].lng != 0 ){

                        map_status = 1;

                        break;

                    }

                }

            }

        }

    }

    if( map_status ){

        if( !parseInt( options.maps_geo_show, 10 ) ){

            map_status = 0;

        }

    }

    return map_status;

};
