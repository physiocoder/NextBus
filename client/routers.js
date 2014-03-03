Router.map(function() {

	this.route('About', {path: '/about',
		layoutTemplate: 'layout',
		data: function(){
			return {
				isAbout:true
			}
		} });

	this.route('Contact', {path: '/contact',
		layoutTemplate: 'layout',
		data: function(){
			return {
				isContact:true
			}
		} });

	this.route('StopList', {path: '/',
		layoutTemplate: 'layout',
		before: function(){
			this.subscribe("stops").wait();
		},
		data:function(){
			if ( this.ready() ) {
				return {
					stops: Stops.find(),
					isHome:true
				}
			}	
		}});

	this.route('StopDetail', {path: '/stops/:stopId',
		layoutTemplate: 'layout',
		before: function(){
			this.subscribe("stops").wait();
			this.subscribe("timetable", this.params.stopId).wait();
		},
		data:function(){
			if ( this.ready() ) {
				return {
					stop: Stops.findOne({ stopId:this.params.stopId}),
					nextArrivals: TimeTables.find()
				}
			}	
		}});

});