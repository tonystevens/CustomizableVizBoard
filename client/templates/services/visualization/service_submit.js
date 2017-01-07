Template.serviceSubmit.onCreated(function() {
  Session.set('serviceSubmitErrors', {});
});

Template.serviceSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('serviceSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('serviceSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.serviceSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var service = {
      chartTemplateId: $(e.target).find('[name=chartTemplateId]:checked').val(),
      dataUrl: $(e.target).find('[name=dataUrl]').val(),
      nickName: $(e.target).find('[name=nickName]').val(),
      description: $(e.target).find('[name=description]').val()
    };

    var errors = validateService(service);
    if (errors.dataUrl || errors.chartTemplateId || errors.nickName || errors.description)
      return Session.set('serviceSubmitErrors', errors);

    Meteor.call('serviceInsert', service, function(error, result) {
      if (error)
        return throwError(error.reason);
    });

    Router.go('servicesList');
  }
});