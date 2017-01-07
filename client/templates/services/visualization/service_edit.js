Template.serviceEdit.onCreated(function() {
  Session.set('serviceEditErrors', {});
});

Template.serviceEdit.helpers({
  errorMessage: function(field) {
    return Session.get('serviceEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('serviceEditErrors')[field] ? 'has-error' : '';
  },
  isFirstElement: function(index){
    return index === 0;
  },
  isPicked: function(actual, expected, value){
    return expected === actual ? value : '';
  },
  isEmpty: function(array){
    return array === undefined || array === null || array.length === 0;
  }
});

Template.serviceEdit.rendered = function() {
  var $properties = $('input[name*="property["][name*="].propertyName"]');
  propertyId = $properties.size();
  propertyIdArray = [];
  $.each($properties, function(idx){
    if(idx !== 0){
      propertyIdArray.push(idx);
    }
  });
  propertyArray = [];

  var $propertieFilters = $('input[name*="propertyFilter["][name*="].propertyName"]');
  propertyFilterId = $propertieFilters.size();
  propertyFilterIdArray = [];
  $.each($propertieFilters, function(idx){
    if(idx !== 0){
      propertyFilterIdArray.push(idx);
    }
  });
  propertyFilterArray = [];

  var $colorFilters = $('input[name*="colorFilter["][name*="].propertyName"]');
  colorFilterId = $colorFilters.size();
  colorFilterIdArray = [];
  $.each($colorFilters, function(idx){
    if(idx !== 0){
      colorFilterIdArray.push(idx);
    }
  });
  colorFilterArray = [];

  childrenIdStr = '';

  $(document).on('mouseover', '.colorPicker', function(){
    $(this).colorpicker();
  });
}

Template.serviceEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var id = this._id;

    var serviceAttributes = {
      chartTemplateId: $(e.target).find('[name=chartTemplateId]:checked').val(),
      dataUrl: $(e.target).find('[name=dataUrl]').val(),
      nickName: $(e.target).find('[name=nickName]').val(),
      description: $(e.target).find('[name=description]').val()
    };

    if(childrenIdStr !== '') {
      serviceAttributes.childrenId = childrenIdStr;
    }

    if(propertyArray.length > 0){
      serviceAttributes.property = propertyArray;
    }

    if(propertyFilterArray.length > 0){
      serviceAttributes.propertyFilter = propertyFilterArray;
    }

    if(colorFilterArray.length > 0){
      serviceAttributes.colorFilter = colorFilterArray;
    }

    console.log(serviceAttributes);

    //TODO Update service with the new fields
    var errors = validateService(serviceAttributes);
    if (errors.dataUrl || errors.chartTemplateId || errors.nickName || errors.description)
      return Session.set('serviceEditErrors', errors);

    Meteor.call('serviceUpdate', id, serviceAttributes, function(error) {
      if (error) {
        console.log(error);
        throwError(error.reason);
      } else {
        Router.go('servicesList', {_id: id});
      }
    });
  },

  'click .delete': function(e) {
    if (confirm("Delete this service ?")) {
      var currentServiceId = this._id;
      Services.remove(currentServiceId);
      Router.go('servicesList');
    }
  },

  'click .addProperty': function(e) {
    var template = $('#propertyTemplate');
    var clone = template.clone().removeClass('hide').removeAttr('id').attr('data-property-index', propertyId).insertBefore(template);

    clone
        .find('[name="propertyName"]').attr('name', 'property['+propertyId+'].propertyName').end()
      .find('[name="label"]').attr('name', 'property['+propertyId+'].label').end();

    propertyIdArray.push(propertyId++);
  },

  'click .removeProperty': function(e) {
    var row = $(e.target).parents('.form-group');
    var index = row.attr('data-property-index');
    propertyIdArray = propertyIdArray.filter(function(e){
      return e != index;
    });
    row.remove();
  },

  'click .addPropertyFilter': function(e) {
    var template = $('#propertyFilterTemplate');
    var clone = template.clone().removeClass('hide').removeAttr('id').attr('data-propertyFilter-index', propertyFilterId).insertBefore(template);

    clone
      .find('[name="propertyName"]').attr('name','propertyFilter['+propertyFilterId+'].propertyName').end()
      .find('[name="filterOption"]').attr('name','propertyFilter['+propertyFilterId+'].filterOption').end()
      .find('[name="value"]').attr('name','propertyFilter['+propertyFilterId+'].value').end();

    propertyFilterIdArray.push(propertyFilterId++);
  },

  'click .removePropertyFilter': function(e) {
    var row = $(e.target).parents('.form-group');
    var index = row.attr('data-propertyFilter-index');
    propertyFilterIdArray = propertyFilterIdArray.filter(function(e){
      return e != index;
    });
    row.remove();
  },

  'click .addColorFilter': function(e) {
    var template = $('#colorFilterTemplate');
    var clone = template.clone().removeClass('hide').removeAttr('id').attr('data-colorFilter-index', colorFilterId).insertBefore(template);

    clone
      .find('[name="color"]').attr('name','colorFilter['+colorFilterId+'].color').end()
      .find('[name="propertyName"]').attr('name','colorFilter['+colorFilterId+'].propertyName').end()
      .find('[name="filterOption"]').attr('name','colorFilter['+colorFilterId+'].filterOption').end()
      .find('[name="value"]').attr('name','colorFilter['+colorFilterId+'].value').end();

    colorFilterIdArray.push(colorFilterId++);
  },

  'click .removeColorFilter': function(e) {
    var row = $(e.target).parents('.form-group');
    var index = row.attr('data-colorFilter-index');
    colorFilterIdArray = colorFilterIdArray.filter(function(e){
      return e != index;
    });
    row.remove();
  },

  'click #saveModalChange': function(e) {
    childrenIdStr = $("#childrenId").val();

    propertyArray.push({propertyName: $("[name='property[0].propertyName']").val(), label: $("[name='property[0].label']").val()});
    for(var i = 0; i < propertyIdArray.length; i++){
      propertyArray.push({propertyName: $("[name='property["+propertyIdArray[i]+"].propertyName']").val(), label: $("[name='property["+propertyIdArray[i]+"].label']").val()});
    }

    propertyFilterArray.push({
      propertyName: $("[name='propertyFilter[0].propertyName']").val(),
      filterOption: $("[name='propertyFilter[0].filterOption']").val(),
      value: $("[name='propertyFilter[0].value']").val()
    });
    for(var i = 0; i < propertyFilterIdArray.length; i++){
      propertyFilterArray.push({
        propertyName: $("[name='propertyFilter["+propertyFilterIdArray[i]+"].propertyName']").val(),
        filterOption: $("[name='propertyFilter["+propertyFilterIdArray[i]+"].filterOption']").val(),
        value: $("[name='propertyFilter["+propertyFilterIdArray[i]+"].value']").val()});
    }

    colorFilterArray.push({
      color: $("[name='colorFilter[0].color']").val(),
      propertyName: $("[name='colorFilter[0].propertyName']").val(),
      filterOption: $("[name='colorFilter[0].filterOption']").val(),
      value: $("[name='colorFilter[0].value']").val()
    });
    for(var i = 0; i < colorFilterIdArray.length; i++){
      colorFilterArray.push({
        color: $("[name='colorFilter["+colorFilterIdArray[i]+"].color']").val(),
        propertyName: $("[name='colorFilter["+colorFilterIdArray[i]+"].propertyName']").val(),
        filterOption: $("[name='colorFilter["+colorFilterIdArray[i]+"].filterOption']").val(),
        value: $("[name='colorFilter["+colorFilterIdArray[i]+"].value']").val()});
    }

    $("#detailModal").modal("hide");
  }
});