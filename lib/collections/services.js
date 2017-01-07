Services = new Mongo.Collection('services');

Services.allow({
  update: function(userId, service) { return ownsDocument(userId, service); },
  remove: function(userId, service) { return ownsDocument(userId, service); }
});

Services.deny({
  update: function(userId, service, fieldNames) {
    return (_.without(fieldNames, 'chartTemplateId', 'restLinkId', 'sourceId').length > 0);
  }
});

validateService = function (service) {
  var errors = {};
  if (!service.dataUrl)
    errors.dataUrl = "Please enter the URL of the data source.";
  if (!service.chartTemplateId)
    errors.chartTemplateId =  "Please select a chart type.";
  if (!service.nickName)
    errors.nickName = "Please have a nick name for the service.";
  if (!service.description)
    errors.description = "Please have a description for the service.";
  return errors;
}

Meteor.methods({
  serviceInsert: function(serviceAttributes) {
	check(Meteor.userId(), String);
    check(serviceAttributes, {
      chartTemplateId: String,
      dataUrl: String,
      nickName: String,
      description: String
    });

    var errors = validateService(serviceAttributes);
    //TODO Error messgage need to be updated after front end form change.
    if (errors.chartTemplateId || errors.dataUrl || errors.nickName || errors.description)
      throw new Meteor.Error('invalid-service', "You must select in a chart type, and fill in the data url, name and provide a brief description");

  	var user = Meteor.user();
    var service = Services.findOne({}, {sort: {rank: -1}});
    var rank;
    if(service == undefined){
      rank = 1;
    }else{
      rank = service.rank + 1;
    }

    var service = _.extend(serviceAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      rank: rank
    });
    var serviceId = Services.insert(service);
    return {
      _id: serviceId
    };
  },

  serviceUpdateRank: function(id, serviceRank){
    check(Meteor.userId(), String);
    check(id, String);
    check(serviceRank, Number);

    var serviceId = Services.update({_id: id}, {$set: {rank: serviceRank}});
    return {
      _id: serviceId
    };
  },

  serviceUpdate: function(id, serviceAttributes){
    Services.update(id, {$set: serviceAttributes});
  }
});