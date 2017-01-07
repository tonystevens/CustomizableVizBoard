if(Meteor.isClient){
  Template.displayService.helpers({
    getTemplate: function() {
	  return this.chartTemplateId;
	},
	getData: function() {
	  return {
	  	service: this
	  };
	}
  });
}