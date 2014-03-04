Future = Npm.require('fibers/future');

var collections = {};

var BASE_DIR = "trento/"
var gtfs = [
	{
		name:'agency.txt',
		fields: [ 'agency_id','agency_name','agency_url','agency_timezone','agency_phone','agency_lang']
	},
	{
		name:'calendar.txt',
		fields:[ 'service_id', 'monday','tuesday','wednesday','thursday','friday','saturday','sunday','start_date','end_date' ]
	},
	{
		name:'calendar_dates.txt',
		fields:['service_id','date','exception_type']
	},
	{
		name:'routes.txt',
		fields:['route_id','agency_id','route_short_name','route_long_name','route_type','route_color','route_text_color']
	},
	{
		name:'stop_times.txt',
		fields:['trip_id','arrival_time','departure_time','stop_id','stop_sequence']
	},
	{
		name:'stops.txt',
		fields:['stop_id','stop_name','stop_desc','stop_lat','stop_lon']
	},
	{
		name:'trips.txt',
		fields:['route_id','service_id','trip_id','trip_headsign','direction_id']
	}
	
];

function removeExtension( name ){
	return name.replace(/\.[^/.]+$/, "");
}

function toCamel( name ){
	return name.replace(/_([a-z])/g, function (m, w) {
		return w.toUpperCase();
	});
}

Meteor.startup( function() {

	_.each( gtfs, function( file ){
		var content = Assets.getText( BASE_DIR + file.name ),
		collection = new Meteor.Collection( removeExtension(file.name) ),
		fields = _.map( file.fields, 
			function(field){ 
				return toCamel(field); }),
		future = new Future();
		collections[ removeExtension(file.name)  ] = collection;
		if ( collection.find().count() == 0 ){
			CSV()
			.from.string(
				content,
				{comment: '#'} )
			.to.array( function(data){
				var newRecords = _.map( data, function(record){
					return _.object( fields, record );
				});
				future['return'](newRecords);		} );

			

			var results = future.wait();
			_.each( results, function( result ){
				collection.insert( result );
			});		    	
		}

	});
	
	Meteor.publish("stops", function ( ) {
		return collections['stops'].find( );
	});

	Meteor.publish("trips", function ( ) {
		return collections['trips'].find( );
	});
 
 	Meteor.publish("routes", function ( ) {
		return collections['routes'].find( );
	});


	Meteor.publish("stop_times", function ( stopId ) {
		return collections['stop_times'].find( {
			stopId: stopId
		}, {sort:[ ["arrivalTime", "asc"] ]});
	});

	Meteor.publish(
		'timetable', function( stopId ){
			var times = collections['stop_times'].find({'stopId': stopId}, {sort:[ ["arrivalTime", "asc"] ]}).fetch(),
			    self = this;

			_.each( times, function(time){
				var arrivalTime = time.arrivalTime,
					trip = collections['trips'].findOne({'tripId':time.tripId}),
		    		route = collections['routes'].findOne({'routeId':trip.routeId});

		    	self.added("timetable", time.tripId, _.extend(route, {
		    			tripId: time.tripId,
	    				headsign:trip.tripHeadsign,
	    				arrivalTime: arrivalTime
	    			}));   


			});

			self.ready();
			
		}
	);

	Meteor.publish(
		'stops_by_trip', function( tripId ){
			var item = undefined,
			    trip = collections['trips'].findOne({'tripId':tripId}),
		    	route = collections['routes'].findOne({'routeId':trip.routeId}),
				stopTimes = collections['stop_times']
								.find({'tripId': tripId}, {sort:[ ["stop_sequence", "asc"] ]})
								.fetch();

			item = _.extend( trip, route);
			item.stops = [];

			_.each( stopTimes, function(stopTime){
				var stop = collections['stops'].findOne({'stopId': stopTime.stopId});

 				item.stops.push( _.extend( stopTime, stop ) );


			});

			this.added("stops_by_trip", item.tripId, item);

			this.ready();
			
		}
	);


});

