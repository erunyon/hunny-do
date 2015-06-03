window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

var db;
var request = window.indexedDB.open("Hunny-Do", 1);

// Set up the DB
request.onupgradeneeded = function(e) {
  console.log("Running onupgradeneeded");
  var db = e.target.result;

  if(!db.objectStoreNames.contains("list")) {
    db.createObjectStore("list", { autoIncrement: true });
  }
}

request.onsuccess = function(e) {
  console.log("DB Open Success!");
  db = e.target.result;
  loadData();
}

request.onerror = function(e) {
  console.log("Error", e);
}

// Load the records
function loadData(){
  var items = [];

  db.transaction(["list"], "readonly").objectStore("list").openCursor().onsuccess = function(e) {
    var cursor = e.target.result;

    if(cursor) {
      items.push({"key": cursor.key, "val": cursor.value});
      cursor.continue();
    }
    buildList(items);
  };
}

// Populate the list
function buildList(items){
  var lis = "";
  $.each(items, function(i, item){
    lis += '<li class="list--item"><button class="item--button" data-value="'+ item.key +'">Done</button><span class="item--value">' + item.val + '</span></li>';
  });
  $("#list").html(lis);
}

// Add a record
$("form").on("submit", function(e){
  e.preventDefault();

  console.log("Adding item");

  var val = $("#input").val(),
      transaction = db.transaction(["list"], "readwrite"),
      objectStore = transaction.objectStore("list"),
      request = objectStore.add(val)
  ;

  request.onerror = function(e) {
      console.log("Error", e.target.error.name);
  }

  request.onsuccess = function(e) {
      console.log("Success adding item:", val);
      loadData();
  }

  $("#input").val("").focus();

});

// Delete a record
$("#list").on("click", "button", function(){
  var id = parseInt($(this).attr("data-value"), 10),
      transaction = db.transaction(["list"], "readwrite"),
      objectStore = transaction.objectStore("list"),
      request = objectStore.delete(id)
  ;

  request.onsuccess = function(e){
    console.log("Record Deleted!", id);
    loadData();
  };

  request.onerror = function(e){
    console.log("Error occured while deleting", e.srcElement.error.message);
  };

});

// Delete all records
$(".clear").on("click", function(){
  // indexedDB.deleteDatabase('Hunny-Do');
  var transaction = db.transaction(["list"], "readwrite"),
      objectStore = transaction.objectStore("list")
  ;
  objectStore.clear();
  loadData();
});

// Update a record
// Not currently used, but can be run from the console
function update(id, val){
  var transaction = db.transaction(["list"],"readwrite"),
      objectStore = transaction.objectStore("list"),
      request = objectStore.get(id)
  ;

  request.onsuccess = function(event){
    var requestUpdate = objectStore.put(val, id);
    requestUpdate.onerror = function(event) {
      console.log('error',event);
    };
    requestUpdate.onsuccess = function(event) {
      console.log('success');
      loadData();
    };
  };

  request.onerror = function(e) {
      console.log("Error", e.target.error.name);
  };
}
