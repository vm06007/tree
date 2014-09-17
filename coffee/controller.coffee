app.controller "DerevoController", ($scope, $timeout) ->
  $scope.json = ""
  $scope.data = children: []
  $scope.toggleMinimized = (child) ->
    child.minimized = not child.minimized

  $scope.clearDerevo = ->
    $scope.data = children: []

  $scope.loadDerevo = ->
    memory = undefined
    memory = window.localStorage.tree
    $scope.data = JSON.parse(memory)

  $scope.saveDerevo = ->
    supportStorage = undefined
    supportStorage = ->
      try
        return "localStorage" of window
      catch e
        return false

    unless supportStorage()
      alert "localStorage is not available"
      return false
    window.localStorage.tree = angular.toJson($scope.data)

  $scope.addChild = (child) ->
    child.children.push
      title: ""
      children: []


  $scope.rename = (child, newTitle) ->
    walk = undefined
    walk = (target) ->
      children = undefined
      i = undefined
      s = undefined
      children = target.children
      i = undefined
      if children
        i = children.length
        while i--
          if children[i] is child
            s = newTitle or prompt("Rename Node", children[i].title)
            children[i].title = s
          else
            walk children[i]

    walk $scope.data

  $scope.remove = (child) ->
    walk = undefined
    walk = (target) ->
      children = undefined
      i = undefined
      children = target.children
      i = undefined
      if children
        i = children.length
        while i--
          if children[i] is child
            return children.splice(i, 1)
          else
            walk children[i]

    walk $scope.data

  $scope.update = (event, ui) ->
    child = undefined
    index = undefined
    item = undefined
    parent = undefined
    root = undefined
    target = undefined
    walk = undefined
    walk = (target, child) ->
      children = undefined
      i = undefined
      children = target.children
      i = undefined
      if children
        i = children.length
        while i--
          if children[i] is child
            return children.splice(i, 1)
          else
            walk children[i], child

    root = event.target
    item = ui.item
    parent = item.parent()
    target = ((if parent[0] is root then $scope.data else parent.scope().child))
    child = item.scope().child
    index = item.index()
    target.children or (target.children = [])
    walk $scope.data, child
    target.children.splice index, 0, child
