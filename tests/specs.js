describe("Derevo", function() {
  it('should have a controller', function() {
    expect(app.controller).toBeDefined();
  });

  it('should have a Derevo controller', function() {
    expect(app._invokeQueue[1][2][0]).toEqual('DerevoController');
  });
});

describe("Controller", function() {

  var obj = {};	
  beforeEach(function() {
    var a = app._invokeQueue[1][2][1];
  	a(obj);
   });

  it('Shoulb be able to SAVE Tree', function() {
    //predefined tree
  	obj.data = { children : [ { title : 'test2', children : [ { title : 'test2', children : [  ] }, { title : 'test 2', children : [  ] } ] } ] };

    //save tree
  	obj.saveDerevo();

    //check localstorage
    expect((window.localStorage.tree) == JSON.stringify(obj.data)).toBe(true);
  });

  it('Shoulb be able to LOAD Tree', function() {
    //predefined tree
    var tree = { children : [ { title : 'test2', children : [ { title : 'test2', children : [  ] }, { title : 'test 2', children : [  ] } ] } ] };
    obj.data = tree;

    //save tree
    obj.saveDerevo();

    //make tree empty
    obj.data = {}

    //load tree from memory 
    obj.loadDerevo();

    //compare with originlly predefined tree
    expect((JSON.stringify(tree)) == JSON.stringify(obj.data)).toBe(true);
  });

  it('Shoulb be able to CLEAR Tree', function() {
    //predefined tree
    var tree = { children : [ { title : 'test2', children : [ { title : 'test2', children : [  ] }, { title : 'test 2', children : [  ] } ] } ] };
    obj.data = tree;

    //clear tree
    obj.clearDerevo();

    //compare with empty tree
    var emptyObj = {"children":[]} 
    expect((JSON.stringify(emptyObj)) == JSON.stringify(obj.data)).toBe(true);
  });

  it('Shoulb be able to ADD Tree Node', function() {
    var tree = { children : [{ title : 'test2', children : []}] };
    obj.data = tree;

    //adding 3 childs
    obj.addChild(obj.data.children[0]);
    obj.addChild(obj.data.children[0]);
    obj.addChild(obj.data.children[0]);

    //check 3 childs
    expect(obj.data.children[0].children.length).toEqual(3);
  });

  it('Shoulb be able to REMOVE Tree Node', function() {
    var tree = { children : [{ title : 'test2', children : []}] };
    obj.data = tree;

    //adding 3 childs
    obj.addChild(obj.data.children[0]);
    obj.addChild(obj.data.children[0]);
    obj.addChild(obj.data.children[0]);

    //removing one child
    obj.remove(obj.data.children[0].children[2]);

    //check 2 childs
    expect(obj.data.children[0].children.length).toEqual(2);
  });

  it('Shoulb be able to REMOVE Particular Tree Node', function() {
    var tree = { children : [{ title : 'test2', children : []}] };
    obj.data = tree;

    //adding 3 childs
    obj.addChild(obj.data.children[0]);
    obj.addChild(obj.data.children[0]);
    obj.addChild(obj.data.children[0]);

    //adding titles to childs

    obj.data.children[0].children[0].title = 'child1'
    obj.data.children[0].children[1].title = 'child2'
    obj.data.children[0].children[2].title = 'child3'

    //removing child2
    obj.remove(obj.data.children[0].children[1]);

    //check 1st and 2nd childs title
    expect(obj.data.children[0].children[0].title).toEqual('child1');
    expect(obj.data.children[0].children[1].title).toEqual('child3');

    //check 3rd child does not exist
    expect(obj.data.children[0].children[2]).toBe(undefined);
  });


  it('Shoulb be able to RENAME Particular Tree Node', function() {
    var tree = { children : [{ title : 'test2', children : []}] };
    obj.data = tree;

    //adding 3 childs
    obj.addChild(obj.data.children[0]);
    obj.addChild(obj.data.children[0]);
    obj.addChild(obj.data.children[0]);

    //adding titles to childs

    obj.data.children[0].children[0].title = 'child1'
    obj.data.children[0].children[1].title = 'child2'
    obj.data.children[0].children[2].title = 'child3'

    obj.rename(obj.data.children[0].children[0], 'childNew1');
    obj.rename(obj.data.children[0].children[1], 'childNew2');
  
    //check 1st and 2nd childs title
    expect(obj.data.children[0].children[0].title).toEqual('childNew1');
    expect(obj.data.children[0].children[1].title).toEqual('childNew2');

    //check 3rd childs title
    expect(obj.data.children[0].children[2].title).toEqual('child3');

  });
});
