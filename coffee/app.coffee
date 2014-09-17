app = angular.module("app", [])
app.directive "yaDerevo", ->
  priority: 1000
  transclude: "element"
  compile: (tElement, tAttrs, transclude) ->
    repeatExpr = undefined
    childExpr = undefined
    rootExpr = undefined
    childrenExpr = undefined
    repeatExpr = tAttrs.yaDerevo.match(/^(.*) in ((?:.*\.)?(.*)) at (.*)$/)
    childExpr = repeatExpr[1]
    rootExpr = repeatExpr[2]
    childrenExpr = repeatExpr[3]
    branchExpr = repeatExpr[4]
    
    link = (scope, element, attrs) ->
      lookup = (child) ->
        i = cache.length
        return cache.splice(i, 1)[0]  if cache[i].scope[childExpr] is child  while i--
        return
      rootElement = element[0].parentNode
      cache = []
      scope.$watch rootExpr, ((root) ->
        currentCache = []
        (walk = (children, parentNode, parentScope, depth) ->
          i = 0
          n = children.length
          last = n - 1
          cursor = undefined
          child = undefined
          cached = undefined
          childScope = undefined
          grandchildren = undefined
          while i < n
            cursor = parentNode.childNodes[i]
            child = children[i]
            cached = lookup(child)
            if cached and cached.parentScope isnt parentScope
              cache.push cached
              cached = null
            unless cached
              transclude parentScope.$new(), (clone, childScope) ->
                childScope[childExpr] = child
                cached =
                  scope: childScope
                  parentScope: parentScope
                  element: clone[0]
                  branch: clone.find(branchExpr)[0]

                parentNode.insertBefore cached.element, cursor
                return

            else parentNode.insertBefore cached.element, cursor  if cached.element isnt cursor
            childScope = cached.scope
            childScope.$depth = depth
            childScope.$index = i
            childScope.$first = (i is 0)
            childScope.$last = (i is last)
            childScope.$middle = not (childScope.$first or childScope.$last)
            currentCache.push cached
            grandchildren = child[childrenExpr]
            walk grandchildren, cached.branch, childScope, depth + 1  if grandchildren and grandchildren.length
            ++i
          return
        ) root, rootElement, scope, 0
        i = cache.length
        while i--
          cached = cache[i]
          cached.scope.$destroy()  if cached.scope
          cached.element.parentNode.removeChild cached.element  if cached.element
        cache = currentCache
        return
      ), true
      return
