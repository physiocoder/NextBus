Template.TripDetail.rendered = function(){
	var map = L.map('map').setView([51.505, -0.09], 13),
	    group = L.featureGroup().addTo(map);
	L.tileLayer('http://{s}.tile.cloudmade.com/5F50E85FEEB2426A81CDEA5Ef93CABBA/997/256/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
		maxZoom: 18
	}).addTo(map);

	if ( this.data.trip ){
		_.each( this.data.trip.stops, function(stop){
			L.marker([stop.stopLat, stop.stopLon])
			 .setIcon( L.icon({
						iconUrl: '../marker-icon.png',
						shadowUrl: '../marker-shadow.png',
    					iconAnchor:   [15, 40], // point of the icon which will correspond to marker's location
    					popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
					}))
			 .addTo(group);
		});	
		map.panInsideBounds( group.getBounds() );
	}



};