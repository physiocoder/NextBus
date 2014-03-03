Template.layout.events({
	'click #home': function(){
		Router.go('/');
	},
	'click #about': function(){
		Router.go('/about');
	},
	'click #contact': function(){
		Router.go('/contact');
	}
});