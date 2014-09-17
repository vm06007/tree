var app = angular.module('app', []);

app.directive('yaDerevo', function () {

  return {
    restrict: 'A',
    transclude: 'element',
    priority: 1000,
    terminal: true,
    compile: function (tElement, tAttrs, transclude) {

      var repeatExpr, childExpr, rootExpr, childrenExpr;

      repeatExpr = tAttrs.yaDerevo.match(/^(.*) in ((?:.*\.)?(.*)) at (.*)$/);
      childExpr = repeatExpr[1];
      rootExpr = repeatExpr[2];
      childrenExpr = repeatExpr[3];
      branchExpr = repeatExpr[4];

      return function link (scope, element, attrs) {

        var rootElement = element[0].parentNode,
            cache = [];

        function lookup (child) {
          var i = cache.length;
          while (i--) {
            if (cache[i].scope[childExpr] === child) {
              return cache.splice(i, 1)[0];
            }
          }
        }

        scope.$watch(rootExpr, function (root) {

          var currentCache = [];

          (function walk (children, parentNode, parentScope, depth) {

            var i = 0,
                n = children.length,
                last = n - 1,
                cursor,
                child,
                cached,
                childScope,
                grandchildren;

            for (; i < n; ++i) {

              cursor = parentNode.childNodes[i];
              child = children[i];
              cached = lookup(child);
            
              if (cached && cached.parentScope !== parentScope) {
                cache.push(cached);
                cached = null;
              }
              
              if (!cached) {
                transclude(parentScope.$new(), function (clone, childScope) {

                  childScope[childExpr] = child;
                  
                  cached = {
                    scope: childScope,
                    parentScope: parentScope,
                    element: clone[0],
                    branch: clone.find(branchExpr)[0]
                  };

                  parentNode.insertBefore(cached.element, cursor);

                });
              } else if (cached.element !== cursor) {
                parentNode.insertBefore(cached.element, cursor);
              }

              childScope = cached.scope;
              childScope.$depth = depth;
              
              childScope.$index = i;
              childScope.$first = (i === 0);
              childScope.$last = (i === last);
              childScope.$middle = !(childScope.$first || childScope.$last);

              currentCache.push(cached);

              grandchildren = child[childrenExpr];
              if (grandchildren && grandchildren.length) {
                walk(grandchildren, cached.branch, childScope, depth + 1);
              }
            }
          })(root, rootElement, scope, 0);

          i = cache.length;

          while (i--) {
            cached = cache[i];
            if (cached.scope) {
              cached.scope.$destroy();
            }
            if (cached.element) {
              cached.element.parentNode.removeChild(cached.element);
            } 
          }

          cache = currentCache;
        }, true);
      };
    }
  };
});