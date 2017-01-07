Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
  waitOn: function(){return Meteor.subscribe('services')}
});

Router.route('/', {name: 'indexPage'});
Router.route('/servicesList', {name: 'servicesList'});
Router.route('/submit', {name: 'serviceSubmit'});

Router.route('/services/:_id', {
  name: 'displayService',
  data: function(){return Services.findOne(this.params._id);}
});

Router.route('/services/:_id/edit', {
  name: 'serviceEdit',
  data: function(){return Services.findOne(this.params._id);}
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction(requireLogin, {only: ['serviceSubmit', 'servicesList', 'serviceEdit', 'displayService']});