/*
 *  Name : hotspots_tooltip
 *  Description : Displays tooltip on hotspots hover and on mobile touch event
 *  Author : John Barounis
 *  Version : 0.0.1
*/

//THEASYS.theme.autoLoadFunction('hotspots_tooltip','init');

THEASYS.theme.modules.hotspots_tooltip.initialized = false;

THEASYS.theme.modules.hotspots_tooltip.init = function( ){

    var html = `
        <div id="tooltips"></div>
    `;

    THEASYS.theme.appendHtml(html);

    if( THEASYS.renderer.vars.get('device.isMobile') ){

        $('#tooltips').addClass('mobile');

    }

    THEASYS.theme.modules.hotspots_tooltip.initialized = true;

    THEASYS.renderer.event.on('addHotspotTooltip',function(objId,text,type){

        THEASYS.theme.modules.hotspots_tooltip.createTooltip(objId,text);

    });

    THEASYS.renderer.event.on('panoramaPress',function(objId,top){

        THEASYS.theme.modules.hotspots_tooltip.show(objId,top);

    });

    THEASYS.renderer.event.on('panoramaMouseUp',function(event){

        THEASYS.theme.modules.hotspots_tooltip.hideAll();

    });

    THEASYS.renderer.event.on('hotspotIntersection',function(objId, event){

        var options_hotspots_display_tooltips = THEASYS.renderer.vars.get('options.hotspots_display_tooltips');

        var device_isMobile = THEASYS.renderer.vars.get('device.isMobile');

        var objects_tooltip = THEASYS.renderer.vars.get('objects_tooltip');

        if( parseInt( options_hotspots_display_tooltips, 10) ){

            if( !device_isMobile ){

                if( objId in objects_tooltip && objects_tooltip[objId] && event ){

                    THEASYS.theme.modules.hotspots_tooltip.display(objId,event);

                } else {

                }

            }

        }
    });

    THEASYS.renderer.event.on('noHotspotIntersection',function(){

        THEASYS.theme.modules.hotspots_tooltip.hideAll();

    });

};

THEASYS.theme.modules.hotspots_tooltip.display = function( objId, event ){

    $('#tp_'+objId).css({top:event.offsetY+10,left:event.offsetX+10}).show().siblings().hide();

};

THEASYS.theme.modules.hotspots_tooltip.show = function( objId, top ){

    $('#tp_'+objId).css({top:top}).show();

};

THEASYS.theme.modules.hotspots_tooltip.createTooltip = function( objId, text ){

    if( !document.getElementById('tp_'+objId) ){

        var tdiv = document.createElement('div');

        tdiv.id = 'tp_'+objId;

        var icon = THEASYS.vars.paths.static+'/themes/'+THEASYS.vars.theme+'/assets/modules/hotspots_tooltip/img/info.png';

        tdiv.innerHTML = '<img src="'+icon+'" alt="tooltip info" width="11"> '+text;

        var theDiv = document.getElementById("tooltips");

        theDiv.appendChild(tdiv);

        THEASYS.renderer.vars.set('objects_tooltip.'+objId,'<img src="'+icon+'" alt="tooltip info" width="11"> '+text);

    }

};

THEASYS.theme.modules.hotspots_tooltip.hideAll = function( ){

    $('#tooltips').children().hide();

};
