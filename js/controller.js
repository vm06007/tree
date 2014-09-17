app.controller("DerevoController", function($scope, $timeout) {
  $scope.json = "";
  $scope.data = {
    children: []
  };
  $scope.toggleMinimized = function(child) {
    return child.minimized = !child.minimized;
  };
  $scope.clearDerevo = function() {
    return $scope.data = {
      children: []
    };
  };
  $scope.loadDerevo = function() {
    var memory;
    memory = void 0;
    memory = window.localStorage.tree;
    return $scope.data = JSON.parse(memory);
  };
  $scope.saveDerevo = function() {
    var supportStorage;
    supportStorage = void 0;
    supportStorage = function() {
      try {
        return "localStorage" in window;
      } catch (e) {
        return false;
      }
    };
    if (!supportStorage()) {
      alert("localStorage is not available");
      return false;
    }
    return window.localStorage.tree = angular.toJson($scope.data);
  };
  $scope.addChild = function(child) {
    return child.children.push({
      title: "",
      children: []
    });
  };
  $scope.rename = function(child, newTitle) {
    var walk;
    walk = void 0;
    walk = function(target) {
      var children, i, s, _results;
      children = void 0;
      i = void 0;
      s = void 0;
      children = target.children;
      i = void 0;
      if (children) {
        i = children.length;
        _results = [];
        while (i--) {
          _results.push(children[i] === child ? (s = newTitle || prompt("Rename Node", children[i].title), children[i].title = s) : walk(children[i]));
        }
        return _results;
      }
    };
    return walk($scope.data);
  };
  $scope.remove = function(child) {
    var walk;
    walk = void 0;
    walk = function(target) {
      var children, i, _results;
      children = void 0;
      i = void 0;
      children = target.children;
      i = void 0;
      if (children) {
        i = children.length;
        _results = [];
        while (i--) {
          if (children[i] === child) {
            return children.splice(i, 1);
          } else {
            walk(children[i]);
          }
        }
        return _results;
      }
    };
    return walk($scope.data);
  };
  return $scope.update = function(event, ui) {
    var child, index, item, parent, root, target, walk;
    child = void 0;
    index = void 0;
    item = void 0;
    parent = void 0;
    root = void 0;
    target = void 0;
    walk = void 0;
    walk = function(target, child) {
      var children, i, _results;
      children = void 0;
      i = void 0;
      children = target.children;
      i = void 0;
      if (children) {
        i = children.length;
        _results = [];
        while (i--) {
          if (children[i] === child) {
            return children.splice(i, 1);
          } else {
            walk(children[i], child);
          }
        }
        return _results;
      }
    };
    root = event.target;
    item = ui.item;
    parent = item.parent();
    target = (parent[0] === root ? $scope.data : parent.scope().child);
    child = item.scope().child;
    index = item.index();
    target.children || (target.children = []);
    walk($scope.data, child);
    return target.children.splice(index, 0, child);
  };
});