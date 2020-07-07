THEASYS.theme.modules.maps.customMap = {

    marker : vars.paths.static+'/themes/'+vars.theme+'/assets/modules/maps/img/markers/theasys_marker.png',
    marker_width : 25,
    marker_height : 36,

    active_marker_top : 0,
    active_marker_left : 0,

    floorplanRadarTopOffset : 50,
    floorplanRadarLeftOffset : 50,
    floorplaRadarElement : null,

    floorplanActivePin : -1,

    floorplaRadarShiftDeg : 0,
    floorplaRadarShiftDeg_old : 0,
    floorplaRadarShiftDeg_new : 0,

    hasFloorPlan : false,

    floorPlanLoaded : false,

    pinsCount : 0,

    panzoom : null,

    panzoom_elem : null,

    position : {0:{x:0,y:0,scale:1}},

    loadCustomMap : function( position ){

        if( this.floorPlanLoaded ){

            return false;

        }

        if( position ){

            this.position = position;

        }

        var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');
        var user_random_uid = THEASYS.renderer.vars.get('user_random_uid');
        var id = THEASYS.renderer.vars.get('id');

        if( 'floorplan' in THEASYS.cache.obj.tours[tour_rnd].tour ){

            var floorplan = undefined;

            try {

                floorplan = THEASYS.cache.obj.tours[tour_rnd].tour.floorplan;

            } catch(ex) {


            }

            if( !floorplan ){

                return false;

            }

            if( typeof floorplan === 'object' ){

                this.hasFloorPlan = true;

                var floorplan_width = floorplan.size[0] || 0;
                var floorplan_height = floorplan.size[1] || 0;

                //var floorplan_matrix = 'matrix' in floorplan && floorplan.matrix || [];

                var image_radar = vars.paths.static+'/themes/'+vars.theme+'/assets/modules/maps/img/radar.png';

                $('#floorplan-radar').css({

                    'background-image' : "url('"+image_radar+"')"

                });

                this.floorplaRadarElement = $('#floorplan-radar');

                this.floorplaRadarElement.data('panorama',id);

                var image = vars.paths.media+'/'+user_random_uid+'/'+tour_rnd+'/floorplan/'+floorplan.image;

                var that = this;

                $("#floorplan-img").one("load", function() {

                    var map_custom_img_wrapper = $('#map_custom-img-wrapper');

                    THEASYS.theme.modules.maps.customMap.panzoom_elem = map_custom_img_wrapper.find('img');

                    var posX = parseFloat(THEASYS.theme.modules.maps.customMap.position[0].x,10) || 0;

                    var posY = parseFloat(THEASYS.theme.modules.maps.customMap.position[0].y,10) || 0;

                    var scale = parseFloat(THEASYS.theme.modules.maps.customMap.position[0].scale,10) || 1;

                    THEASYS.theme.modules.maps.customMap.panzoom = panzoom( map_custom_img_wrapper.find('img')[0], {

                        minZoom: 0.1,
                        zoomSpeed: 0.5,
                        smoothScroll: false,

                    });

                    THEASYS.theme.modules.maps.customMap.panzoom.moveTo(posX,posY);

                    THEASYS.theme.modules.maps.customMap.panzoom.zoomTo(posX,posY,scale);

                    var floorplan_img = $(this);

                    var map_geo_wrapper = $('#map_geo-wrapper');
                    var map_resizer_wrapper = $('#map_resizer-wrapper');

                    if( map_geo_wrapper.length && map_resizer_wrapper.length ){

                        var height = floorplan_img.closest('#map').height() - (map_geo_wrapper.height() + map_resizer_wrapper.height());

                    } else {

                        var height = floorplan_img.closest('#map').height();
                    }

                    THEASYS.theme.modules.maps.customMap.adjustCustomMapPins();

                    if( !that.floorPlanLoaded ){

                        map_custom_img_wrapper.on('touchmove',function(e) {

                            e.preventDefault();

                        });

                    }

                    that.floorPlanLoaded = true;

                    THEASYS.theme.modules.maps.customMap.loadCustomMapPins(floorplan);
                    THEASYS.theme.modules.maps.customMap.setCustomMapRadar();

                    THEASYS.theme.modules.maps.customMap.adjustImage();

                    THEASYS.theme.modules.maps.customMap.adjustCustomMapPins();

                    var current_position = THEASYS.renderer.vars.get('current_position');

                    var deg = THEASYS.fn.xyzToDeg(current_position.x,current_position.y,current_position.z);

                    THEASYS.theme.modules.maps.customMap.rotateCustomMapRadar(deg);

                    /*THEASYS.theme.modules.maps.customMap.panzoom.on('mousewheel', function( e ) {
                        e.preventDefault();
                        var delta = e.delta || e.originalEvent.wheelDelta;
                        var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
                        THEASYS.theme.modules.maps.customMap.panzoom_elem.panzoom('zoom', zoomOut, {
                            animate: false,
                            focal: e
                        });
                    });*/

                    THEASYS.theme.modules.maps.customMap.panzoom.on("transform", function( e ) {

                        var editing = ~~THEASYS.renderer.vars.get('editing');

                        if( editing ){

                            var transform = THEASYS.theme.modules.maps.customMap.panzoom.getTransform();

                            THEASYS.theme.modules.maps.customMap.panzoom_elem.attr('data-pos',JSON.stringify(transform));

                        }

                        THEASYS.theme.modules.maps.customMap.adjustCustomMapPins();

                    });

                    THEASYS.renderer.event.on('updatePanoramaPosition',function(){

                        var current_position = THEASYS.renderer.vars.get('current_position');

                        var deg = THEASYS.fn.xyzToDeg(current_position.x,current_position.y,current_position.z);

                        THEASYS.theme.modules.maps.customMap.rotateCustomMapRadar(deg);

                    });

                    THEASYS.renderer.event.on('loadedPanorama',function(){

                        var current_position = THEASYS.renderer.vars.get('current_position');

                        var deg = THEASYS.fn.xyzToDeg(current_position.x,current_position.y,current_position.z);

                        THEASYS.theme.modules.maps.customMap.rotateCustomMapRadar(deg);

                    });

                }).attr("src", image);

            }

        }

    },

    loadCustomMapPins : function(floorplan){

        if( !this.floorPlanLoaded ){

            return false;

        }

        if( 'pins' in floorplan ){

            var dimensions = document.getElementById("floorplan-img").getBoundingClientRect();

            var img = $('#floorplan-img');

            var img_width = dimensions.width;
            var img_height = dimensions.height;

            var html = '';

            var panoramas_obj = {};

            var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');

            if( 'tour' in THEASYS.cache.obj.tours[tour_rnd] && 'panoramas' in THEASYS.cache.obj.tours[tour_rnd].tour && THEASYS.cache.obj.tours[tour_rnd].tour.panoramas.length  ){

                var panoramas = THEASYS.cache.obj.tours[tour_rnd].tour.panoramas;

                for(var i = 0, n = panoramas.length; i < n; i++){

                    panoramas_obj[panoramas[i].prnd] = panoramas[i].title;

                }

            }

            var extra_left = img.position().left;
            var extra_top = img.position().top;

            for( var i in floorplan.pins ){

                var xp = parseFloat(floorplan.pins[i].xp,10);
                var yp = parseFloat(floorplan.pins[i].yp,10);
                var panorama = parseFloat(floorplan.pins[i].panorama,10);
                var panoramarnd = floorplan.pins[i].panoramarnd;
                var offset = parseFloat(floorplan.pins[i].offset,10);

                var x = ( img_width * xp ) / 100;
                var y = ( img_height * yp ) / 100;

                var left = (x - (this.marker_width / 2));

                if( x < 0 ){

                    left = (x + (this.marker_width / 2));

                }

                var top = (y - (this.marker_height / 2));

                if( y < 0 ){

                    top = (y + (this.marker_height / 2));

                }

                var title = panoramarnd in panoramas_obj ? panoramas_obj[panoramarnd] : '';

                var style = 'top:'+top+'px;left:'+left+'px';

                html += '<span data-offset="'+offset+'" data-panoramarnd="'+panoramarnd+'" data-panorama="'+panorama+'" data-xp="'+xp+'" data-yp="'+yp+'" style="'+style+'"><img data-title="'+title+'" title="'+title+'" src="'+this.marker+'" alt="floorplan pin"></span>';

            }

            $('#floorplan-img-pins').append(html);

            var that = this;

            $('#floorplan-img-pins').on('click','span',function(){

                var prnd = $(this).data('panoramarnd');

                if( prnd !== '' ){

                    THEASYS.renderer.fetchPanorama({
                        l : prnd,
                    });

                }

            });

        }

    },

    customMapPinsTitles : function(b){

      if( b ){

        $('#floorplan-img-pins').each(function(){

          var img = $(this).find('img');

          var title = img.data('title')

          $(this).find('img').attr('title',title);

        });

      } else {

        $('#floorplan-img-pins').each(function(){

          $(this).find('img').attr('title','');

        });

      }


    },

    setCustomMapRadar : function(){

        if( !this.hasFloorPlan ){

            return false;

        }

        var options = THEASYS.renderer.vars.get('options');

        var id = THEASYS.renderer.vars.get('id');

        if( !~~options.maps_custom_radar ){

            return false;

        }

        var that = this;

        $('#floorplan-img-pins span').removeClass('active');

        that.floorplaRadarElement.css({

            display : 'none'

        });

        var panorama = id;

        $('#floorplan-img-pins span').each(function(){

            var jthis =  $(this);
            var this_panorama =  jthis.data('panorama');

            if( this_panorama == panorama ){

                var data_offset =  jthis.data('offset') || 0;

                that.active_marker_left = jthis.position().left;
                that.active_marker_top = jthis.position().top;
                that.floorplanActivePin = this_panorama;

                jthis.addClass('active');

                that.floorplaRadarElement.css({

                    top : jthis.position().top + that.marker_height - that.floorplanRadarTopOffset,
                    left : jthis.position().left  + (that.marker_width/2) - that.floorplanRadarLeftOffset,
                    display : 'block'

                }).data('panorama',panorama).data('offset',data_offset);

                return false;

            }

        });

    },

    adjustCustomMapPins : function(){

        if( !this.hasFloorPlan ){

            return false;

        }

        if( !this.floorPlanLoaded ){

            return false;

        }

        var marker_width = this.marker_width;
        var marker_height = this.marker_height;

        var dimensions = document.getElementById("floorplan-img").getBoundingClientRect();

        var img = $('#floorplan-img');

        var img_width = dimensions.width;
        var img_height = dimensions.height;

        if( img_width === 0 || img_height === 0 ){

            return false;

        }

        var extra_left = img.offset().left - $('#viewer_wrapper').width();

        var map_geo_wrapper = $('#map_geo-wrapper');
        var map_resizer_wrapper = $('#map_resizer-wrapper');

        if( map_geo_wrapper.length && map_resizer_wrapper.length ){

            var height = map_geo_wrapper.height() + map_resizer_wrapper.height();

        } else {

            var height = 0;

        }

        var extra_top = img.offset().top - height ;

        var floorplan_radar = $('#floorplan-radar');

        var floorplanRadarPanorama = floorplan_radar.data('panorama');

        var that = this;

        var id = THEASYS.renderer.vars.get('id');

        var options = THEASYS.renderer.vars.get('options');

        if( id === floorplanRadarPanorama ){

            var floorplan_radar_visible = ~~options.maps_custom_radar ? 'block' : 'none';

        } else {

            var floorplan_radar_visible = 'none';

        }

        $('#floorplan-img-pins span').each(function(index){

            var jthis = $(this);

            var x = ( img_width * parseFloat(jthis.data('xp'),10) ) / 100;
            var y = ( img_height * parseFloat(jthis.data('yp'),10) ) / 100;

            x += extra_left;
            y += extra_top;

            jthis.css({

                top : (y - (marker_height) )+'px',
                left : (x - (marker_width / 2) )+'px',

            });

            var panorama = jthis.data('panorama');

            if(panorama == floorplanRadarPanorama){

                that.active_marker_left = jthis.position().left + (marker_width / 2);
                that.active_marker_top = jthis.position().top;

                floorplan_radar.css({

                    top : jthis.position().top + that.marker_height - 50,
                    left : jthis.position().left  + (that.marker_width/2) - 50,
                    display : floorplan_radar_visible

                });

            }

        });

    },

    rotateCustomMapRadar : function(deg){

        if( !this.hasFloorPlan ){

            return false;

        }

        if( !this.floorPlanLoaded ){

            return false;

        }

        var current_position = THEASYS.renderer.vars.get('current_position');
        var options = THEASYS.renderer.vars.get('options');
        var id = THEASYS.renderer.vars.get('id');

        if( !deg ){

            deg = THEASYS.fn.xyzToDeg(
              current_position.x,
              current_position.y,
              current_position.z
            );

        }

        if( !parseInt(options.maps_custom_radar,10) ){

            return false;

        }

        if( id ){

            var fap = $('#floorplan-img-pins').find('span[data-panorama="'+this.floorplanActivePin+'"]');
            var offset = fap.data('offset') || 0;
            deg = parseFloat(deg,10) + offset;

            this.floorplaRadarElement.css({

                '-webkit-transform': 'rotate('+deg+'deg)',
                'transform': 'rotate('+deg+'deg)'

            });

        }

    },

    adjustImage : function(){

        if( !this.hasFloorPlan ){

            return false;

        }

        var floorplan_img = $('#floorplan-img');

        var map_geo_wrapper = $('#map_geo-wrapper');
        var map_resizer_wrapper = $('#map_resizer-wrapper');

        if( map_geo_wrapper.length && map_resizer_wrapper.length ){

            var height = floorplan_img.closest('#map').height() - (map_geo_wrapper.height() + map_resizer_wrapper.height());

        } else {

            var height = floorplan_img.closest('#map').height();

        }

        var left = ( floorplan_img.closest('#map').width() - floorplan_img.width() ) / 2;
        var top = ( height - floorplan_img.height() ) / 2;

        $('#map_custom-wrapper').css({height:height});

    },

}
