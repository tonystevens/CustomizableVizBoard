Template.servicesList.helpers({
  services: function() {
    return Services.find({}, {sort: {rank: 1}});
  }
});