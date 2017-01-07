Template.serviceItem.helpers({
  ownService: function() {
    return this.userId === Meteor.userId();
  }
});

Template.serviceItem.rendered = function () {
    $('#services').sortable({
      start: function(e, ui) {
      },
    stop: function(e, ui) {
      el = ui.item.get(0);
      before = ui.item.prev().get(0);
      after = ui.item.next().get(0);

      if(!before) {
        newRank = Blaze.getData(after).rank - 1;
      } else if(!after) {
        newRank = Blaze.getData(before).rank + 1;
      } else {
        newRank = (Blaze.getData(after).rank + Blaze.getData(before).rank)/2;
      }

      Meteor.call('serviceUpdateRank', Blaze.getData(el)._id, newRank);
    }
  })
}