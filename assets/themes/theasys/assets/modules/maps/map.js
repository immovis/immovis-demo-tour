THEASYS.theme.modules.maps.map = {

    hasMap : 0,

    current_size : {

        width : 320,
        height : 200,

    },

    default_size : {

        minWidth:320,
        minHeight:200,

    },

    ui_loaded : false,
    loaded : false,
    map : null,
    markers : {},
    infoBoxes : {},
    elemId : '',
    infoBox : null,
    markerClusterer : null,
    radar_markers : {},
    mousemove:{
        x:0,
        y:0,
        lat:0,
        lng:0
    },

    isDragging:false,

    map_resized : false,
    map_dragged : false,

    init : function(elemId,center,zoom,onLoaded){

        if( this.loaded ){

          return false;

        }

        var mapStyles = [
           {
             featureType: "administrative",
             elementType: "labels",
             stylers: [
               { visibility: "off" }
             ]
           },{
             featureType: "poi",
             elementType: "labels",
             stylers: [
               { visibility: "off" }
             ]
           },{
             featureType: "water",
             elementType: "labels",
             stylers: [
               { visibility: "on" }
             ]
           },{
             featureType: "road",
             elementType: "labels",
             stylers: [
               { visibility: "on" }
             ]
           }
         ];

        this.elemId = elemId;

        this.map = new google.maps.Map(document.getElementById(elemId), {
          center: center,
          zoom: zoom,
          streetViewControl: false,
          rotateControl : false,
          clickableIcons : false,
          mapTypeId: google.maps.MapTypeId.HYBRID,
          gestureHandling: 'greedy',
          labels: true
        });

        //this.map.set('styles', mapStyles);

        var that = this;

        google.maps.event.addDomListener(window, 'resize', function() {
          var center = that.map.getCenter();
          google.maps.event.trigger(that.map, "resize");
          that.map.setCenter(center);
        });

        google.maps.event.addListenerOnce(this.map, 'idle', function(){

            that.loaded = true;

            if( typeof onLoaded === 'function' ){

                onLoaded();

            }

            that.getMapMarkers();

        });

        google.maps.event.addListener(this.map, 'idle', function(){

            if( that.map_resized || that.map_dragged ){

                that.map_resized = false;

            }

        });

        this.map.controls[google.maps.ControlPosition.TOP_LEFT];

        google.maps.event.clearListeners(this.map,'mousemove');
        google.maps.event.clearListeners(this.map,'mouseup');
        google.maps.event.clearListeners(this.map,'drag');
        google.maps.event.clearListeners(this.map,'dragstart');
        google.maps.event.clearListeners(this.map,'dragend');

        google.maps.event.addListener(this.map,'mousemove',function(e) {

            that.mousemove.lat=e.latLng.lat();
            that.mousemove.lng=e.latLng.lng();
            that.mousemove.x=e.pixel.x;
            that.mousemove.y=e.pixel.y;

        });

        google.maps.event.addListener(this.map,'mouseup',function(e) {

            that.map.setOptions({draggable: true});

        });

        google.maps.event.addListener(this.map,'drag',function(e) {

            that.isDragging = true;

        });

        google.maps.event.addListener(this.map,'dragstart',function(e) {

            that.map_dragged = true;

        });

        google.maps.event.addListener(this.map,'dragend',function(e) {

            that.isDragging = false;

        });

        this.createCluster();

        return this.loaded;

    },

    auto_shrink : function(){
        /*
        return false;

        if(!this.hasMap) return false;

        var w = this.default_size.minWidth;
        var h = this.default_size.minHeight;

        if(_vars.device.isMobile){


        }else{

          $('#map-wrapper').animate({
            width:w,
            height:h,
            left:$(window).width() - w ,
            top:0,
          });

          $('#map').animate({
            width:w,
            height:h,
          },function(){

            if(app.map.map){

              app.map.resize(true);

            }

          });

        }
        */
    },

    removeAllMarkers : function(){

        this.markers = {};

        if( this.markerClusterer ){

            this.markerClusterer.clearMarkers();

        }

    },

    autoHideMarkers : function(){

        var bounds = this.map.getBounds();

        for(var i in this.markers){

          if( !bounds.contains(this.markers[i].getPosition()) ){

          }else{

          }

        }

    },

    removeMarkers : function(obj){

        for(var i in obj){

            if(this.markers[obj[i].id]){

                this.markers[obj[i].id].setMap(null);

                delete this.markers[obj[i].id];

            }

        }

    },

    reCreateMarker : function(i){

        this.markers[i] = new google.maps.Marker({
            map:this.map,
            position: {lat:parseFloat(this.markers[i].latitude,10),lng:parseFloat(this.markers[i].longitude,10)},
            draggable:true,
            icon: {
              url: vars.paths.static+'/themes/'+vars.theme+'/assets/modules/maps/img/markers/theasys_marker.png'
            },
            data: this.markers[i],
            id:this.markers[i].id
        });

    },

    toggleMarkerTitles : function(b){

        if( b ){

            for(var i in this.markers){

                this.markers[i].title = this.markers[i].dataTitle;

            }

        } else {

            for(var i in this.markers){

                this.markers[i].title = '';

            }

        }

    },

    createTourMarker : function(lat, lng){

        var title = '';

        var options = THEASYS.renderer.vars.get('options');

        if( ~~options.maps_geo_markers_show_panorama_title_on_hover ) {

            var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');

            if( 'tour' in THEASYS.cache.obj.tours[tour_rnd]  ){

                title = THEASYS.cache.obj.tours[tour_rnd].tour.title;

            }

        }

        var tour_marker = new google.maps.Marker({
            map:this.map,
            title: title,
            dataTitle: title,
            position: {lat:lat,lng:lng},
            draggable: false,
            icon: {
                url: vars.paths.static+'/themes/'+vars.theme+'/assets/modules/maps/img/markers/theasys_marker.png'
            },
        });

    },

    createMarkers : function(obj){

        var options = THEASYS.renderer.vars.get('options');
        var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');

        var panoramas_obj = {};

        if( ~~options.maps_geo_markers_show_panorama_title_on_hover ) {

            if( 'tour' in THEASYS.cache.obj.tours[tour_rnd] && 'panoramas' in THEASYS.cache.obj.tours[tour_rnd].tour && THEASYS.cache.obj.tours[tour_rnd].tour.panoramas.length  ){

                var panoramas = THEASYS.cache.obj.tours[tour_rnd].tour.panoramas;

                for(var i = 0, n = panoramas.length; i < n; i++){

                    panoramas_obj[panoramas[i].prnd] = panoramas[i].title;

                }

            }

        }

        var title = '';

        if( 'markers' in obj ){

            for(var i in obj.markers){

                var id = parseInt(obj.markers[i].id,10);

                var lat = parseFloat(obj.markers[i].latitude,10);
                var lng = parseFloat(obj.markers[i].longitude,10);

                if(lat === 0 || lng === 0){

                    continue;

                }

                if( id in this.markers){

                    continue;

                }

                title =  obj.markers[i].rnd in panoramas_obj  ? panoramas_obj[obj.markers[i].rnd] : '';

                this.markers[id] = new google.maps.Marker({
                    map:this.map,
                    title: title,
                    dataTitle: title,
                    position: {lat:lat,lng:lng},
                    draggable:false,
                    icon: {
                    url: vars.paths.static+'/themes/'+vars.theme+'/assets/modules/maps/img/markers/theasys_marker.png'
                    },
                    data: obj.markers[i],
                    id:id
                });

                this.markers[id].addListener('click', function() {

                    THEASYS.renderer.fetchPanorama({
                        q : tour_rnd,
                        l : this.data.rnd,
                    });

                });

            }

        }

        var markers_array = [];

        for(var i in this.markers){

            markers_array.push(this.markers[i]);

        }

        if( this.markerClusterer ){

            this.markerClusterer.clearMarkers();

        }

        this.markerClusterer.addMarkers(markers_array);

    },

    createCluster : function(){

        var markers_array = [];

        for(var i in this.markers){

            markers_array.push(this.markers[i]);

        }

        if( this.markerClusterer ){

            this.markerClusterer.setMap(null);

        }

        this.markerClusterer = new MarkerClusterer(this.map, markers_array, {
            maxZoom: 16,
            styles: [{
                url: vars.paths.static+'/themes/'+vars.theme+'/assets/modules/maps/img/markers/map-cluster.png',
                height: 60,
                width: 60,
                opt_anchor: [0, 0],
                opt_textSize: 20
            }]
        });

    },

    getMapMarkers : function(callback){

        /*
        var bounds = this.map.getBounds();

        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
        var bs = {

          ne : {
            lat : ne.lat(),
            lng : ne.lng()
          },

          sw : {
            lat : sw.lat(),
            lng : sw.lng()
          }

        };
        */

        var tour_rnd = THEASYS.renderer.vars.get('tour_rnd');

        var panoramas = THEASYS.cache.obj.tours[tour_rnd].tour.panoramas;

        //var panoramas_already_loaded = [];
        var panoramas_gps = {

            markers : {}

        };

        //for(var i in panoramas){
        for( var i = 0, l = panoramas.length; i < l; i++ ){

            panoramas_gps['markers'][panoramas[i].id] = {

                id : panoramas[i].id,
                latitude : panoramas[i].lat,
                longitude : panoramas[i].lng,
                rnd : panoramas[i].prnd,

            };

            //panoramas_already_loaded.push(panoramas[i].id);

        }

        this.createMarkers(panoramas_gps);

        /*
        if( _vars.hasGPSAtLeastOnePanorama && _vars.hasGPSAtLeastOnePanorama > Object.keys(app.map.markers).length ){

          self.fn.ajax.call({
            url : self.fn.u('api','/viewer'),
            data:{
              action : 'loadMarkers',
              params : {
                bounds : bs,
                panoramas : panoramas_already_loaded,
                tour_random_id : _vars.tour_rnd
              },
            },
            sessionCheck : false,
          }).then(function(msg){

            if(msg.markers){

              //self.cache.set('markers',msg.success).save();

              if( Object.keys(msg.markers).length ){

                app.map.createMarkers(msg);

              }

              if(typeof(ajaxCallback) == 'function'){

                ajaxCallback(msg.success);

              }

            }

          },function(error) {


          });

        }
        */

    },

    createInfoBox : function(marker){

        var infoBox = new InfoBox({
            content: '',
            disableAutoPan: false,
            zIndex: null,
            boxStyle: {
                background: "transparent",
                opacity: 1,
            },
            closeBoxURL: "",
            infoBoxClearance: new google.maps.Size(1, 1),
            enableEventPropagation: false,
            pane: "floatPane"
        });

        app.map.infoBox = infoBox;

    },

    createRadarMarker : function(obj,action){

        var lat = parseFloat(obj.latitude,10);
        var lng = parseFloat(obj.longitude,10);

        var visible = true;

        if(lat == 0 || lng == 0 ){

            visible = false;

        }

        THEASYS.fn.map.markers.removeAll(this.radar_markers);

        this.radar_markers['radar'] = new google.maps.Marker({

            position: {lat:parseFloat(obj.latitude,10),lng:parseFloat(obj.longitude,10)},
            map: this.map,
            title: 'Radar',
            draggable: false,
            icon : {
                path: 'M0,0 v-50 a-50,50 0 0,1 50,50 z',
                fillColor: '#00ff00',
                fillOpacity: 0.7,
                scale: 1,
                strokeColor: '#00ff00',
                rotation: 0,
                strokeWeight: 2,
            },
            zIndex: -1,
            orientation:parseFloat(obj.orientation,10),
            degrees:0,
            visible : visible

        });

        var rotation = parseInt(obj.orientation,10);

        if( action  && ( 'lon' in action ) && ( 'lat' in action ) ){

            var xyz = THEASYS.fn.latLonToXYZ(parseFloat(action.lat,10),parseFloat(action.lon,10));

        } else {

            //var lat = THEASYS.renderer.vars.get('lat');
            var lat = parseFloat(obj.default_view.lat,10);
            //var lon = THEASYS.renderer.vars.get('lon');
            var lon = parseFloat(obj.default_view.lon,10);

            var xyz = THEASYS.fn.latLonToXYZ(parseFloat(lat,10),parseFloat(lon,10));

        }

        var deg = THEASYS.fn.xyzToDeg(xyz.x,xyz.y,xyz.z);

        var angle = parseInt(deg+rotation,10);

        THEASYS.renderer.vars.set('current_orientation',angle);

        this.setRadarOrientation(angle);
        this.setRadarMarkerWidth();

        if(this.map){

            this.map.setCenter({lat:parseFloat(obj.latitude,10),lng:parseFloat(obj.longitude,10)});

        }

    },

    linking_mouse_move_event : function(e){

        if(e.which==1 && !this.isDragging){

            var mpos=this.radar_markers['radar'].getPosition();

            var alpha=self.fn.map.marker.fromLatLngToPixel(mpos,this.map);
            var beta={x:this.mousemove.x,y:this.mousemove.y}
            var deg=0;
            var lr= beta.x<alpha.x ? 0 : 1;
            var tb= beta.y>alpha.y ? 1 : 0;

            if( lr==1 && tb==0 ){

                deg=0;
                var gamma={x:alpha.x,y:this.mousemove.y};
                var p1=alpha.y-gamma.y;
                var p2=beta.x-gamma.x;

            }

            if( lr==1 && tb==1 ){

                deg=90;
                var gamma={x:this.mousemove.x,y:alpha.y};
                var p1=gamma.x-alpha.x;
                var p2=beta.y-gamma.y;

            }

            if( lr==0 && tb==1 ){

                deg=180;
                var gamma={x:alpha.x,y:this.mousemove.y};
                var p1=gamma.y-alpha.y;
                var p2=gamma.x-beta.x;

            }

            if( lr==0 && tb==0 ){

                deg=270;
                var gamma={x:this.mousemove.x,y:alpha.y};
                var p1=alpha.x-gamma.x;
                var p2=gamma.y-beta.y;

            }

            var degrees = (Math.atan(p2/p1) * (180/Math.PI))+deg;

            this.radar_markers['radar'].degrees=degrees;

            this.setRadarOrientation(degrees);

            var no=degrees-this.radar_markers['radar'].orientation;

            _vars.lon=no;

              _vars.phi = THREE.Math.degToRad( 90 - parseFloat(_vars.current_position.lat) );
              _vars.theta = THREE.Math.degToRad( no );
              _vars.current_position.z = 1000 * Math.sin( _vars.phi ) * Math.sin( _vars.theta );
              _vars.current_position.x =  1000 * Math.sin( _vars.phi ) * Math.cos( _vars.theta );

              _autoRotationOnAction();

        }

    },

    setRadarOrientation : function(angle){

        if(this.radar_markers['radar']){

            var rot = this.radar_markers['radar'].get('icon');

            if(rot){

                rot.rotation = Math.round( Number(angle) );

                this.radar_markers['radar'].set('icon', rot);

                THEASYS.renderer.vars.set('current_orientation',rot.rotation);

            }

        }

    },

    setRadarMarkerWidth : function(width){

        var id = THEASYS.renderer.vars.get('id');
        var camera = THEASYS.renderer.vars.get('camera');

        if( id && this.radar_markers['radar'] && this.radar_markers['radar'].icon ){

            width = width || 150 - parseInt((parseInt(camera.fov,10) * 50 /100) + 30,10);

            width = parseInt(width / 2,10);

            this.radar_markers['radar'].icon.path='M0,0 v-'+width+' a-'+width+','+width+' 0 0,1 '+width+','+width+' z';

        }

    },

    resize : function(center){

        if( this.map ){

            if( center ){

                var center = this.map.getCenter();

            }

            google.maps.event.trigger(this.map, "resize");

            if( center ){

                this.map.setCenter(center);

            }

            this.map_resized = true;

        }

    },

};
