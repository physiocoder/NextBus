var intervalId;

Session.setDefault('clock', 0);

Template.StopList.events({
	'click a[data-stop-id]': function(event){
		var target = $(event.currentTarget),
			stopId = target.data('stop-id');
		Router.go('/stops/' + stopId);
	}
});

intervalId = setInterval( function(){
		Session.set('clock', Session.get('clock') + 1 );
}, 60000 /* one minute */)

Template.Times.helpers({
	clock: function() {
		return Session.get('clock');
	},
	isNext: function( arrivalTime ){
		var t = moment( arrivalTime, 'HH:mm:ss'),
			now = moment( );

		t.date( now.date() );
		t.month( now.month() );
		t.year( now.year() )

		if ( t.isBefore(now) ){
			t.add(1, 'day');
		}

		if ( t.diff( now, 'minute' ) >= 0 && t.diff( now, 'minute' ) <= 30 ){
			return true;
		}

		return false;
	},
	prettyDate: function( time ){
		var t = moment( time, 'HH:mm:ss'),
			now = moment( );

		t.date( now.date() );
		t.month( now.month() );
		t.year( now.year() );	

		if ( t.isBefore(now) ){
			t.add(1, 'day');
		}

		return moment.duration( t.diff(now, 'minute'), "minutes").humanize(true);
	}
});

Template.Times.rendered = function(){
	$( "#target" ).focus();
};

