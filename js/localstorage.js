jQuery(function($){

  var list_vals = loadData();

  // Add an item
  $('form').on('submit', function(e){
    e.preventDefault();
    var val = $('#input').val();
    console.log('Adding', val);

    if($.inArray(val, list_vals) == -1){
      list_vals.push(val);
      updateData(list_vals);
    } else {
      $('.message').html('<p>Value already exists!</p>').slideDown('slow').delay(2000).slideUp('slow', function(){ $('.message').html(''); });
    }
    $('#input').val('').focus();
  });

  // Remove an item
  $('#list').on('click', 'button', function(){
    var val = $(this).attr('data-value');
    var indexId = $.inArray(val, list_vals);

    console.log('Removing:', val);
    list_vals.splice(indexId, 1);
    updateData(list_vals);
  });

  // Clear all items
  $('.clear').on('click', function(){
    localStorage.removeItem("list");
    list_vals = [];
    console.log('Database is now empty.');
    loadData();
  });

});

function buildList(vals){
  var lis = '';
  $.each(vals, function(i, val){
    lis += '<li class="list--item"><button class="item--button" data-value="'+ val +'">Done</button><span class="item--value">' + val + '</span></li>';
  });
  $('#list').html(lis);
}

function loadData(){
  if(window.localStorage !== undefined){
    vals = JSON.parse(localStorage.getItem("list")) || [];
    buildList(vals);
    return vals;
  }
}

function updateData(vals){
  console.log(vals);
  localStorage.setItem("list", JSON.stringify(vals));
  buildList(vals);
}
