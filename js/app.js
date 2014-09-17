var app;
app = angular.module("app", []);
app.directive("yaDerevo", function() {
  return {
    priority: 1000,
    transclude: "element",
    compile: function(tElement, tAttrs, transclude) {
      var branchExpr, childExpr, childrenExpr, link, repeatExpr, rootExpr;
      repeatExpr = void 0;
      childExpr = void 0;
      rootExpr = void 0;
      childrenExpr = void 0;
      repeatExpr = tAttrs.yaDerevo.match(/^(.*) in ((?:.*\.)?(.*)) at (.*)$/);
      childExpr = repeatExpr[1];
      rootExpr = repeatExpr[2];
      childrenExpr = repeatExpr[3];
      branchExpr = repeatExpr[4];
      return link = function(scope, element, attrs) {
        var cache, lookup, rootElement;
        lookup = function(child) {
          var i;
          i = cache.length;
          if ((function() {
            var _results;
            _results = [];
            while (i--) {
              _results.push(cache[i].scope[childExpr] === child);
            }
            return _results;
          })()) {
            return cache.splice(i, 1)[0];
          }
        };
        rootElement = element[0].parentNode;
        cache = [];
        scope.$watch(rootExpr, (function(root) {
          var cached, currentCache, i, walk;
          currentCache = [];
          (walk = function(children, parentNode, parentScope, depth) {
            var cached, child, childScope, cursor, grandchildren, i, last, n;
            i = 0;
            n = children.length;
            last = n - 1;
            cursor = void 0;
            child = void 0;
            cached = void 0;
            childScope = void 0;
            grandchildren = void 0;
            while (i < n) {
              cursor = parentNode.childNodes[i];
              child = children[i];
              cached = lookup(child);
              if (cached && cached.parentScope !== parentScope) {
                cache.push(cached);
                cached = null;
              }
              if (!cached) {
                transclude(parentScope.$new(), function(clone, childScope) {
                  childScope[childExpr] = child;
                  cached = {
                    scope: childScope,
                    parentScope: parentScope,
                    element: clone[0],
                    branch: clone.find(branchExpr)[0]
                  };
                  parentNode.insertBefore(cached.element, cursor);
                });
              } else {
                if (cached.element !== cursor) {
                  parentNode.insertBefore(cached.element, cursor);
                }
              }
              childScope = cached.scope;
              childScope.$depth = depth;
              childScope.$index = i;
              childScope.$first = i === 0;
              childScope.$last = i === last;
              childScope.$middle = !(childScope.$first || childScope.$last);
              currentCache.push(cached);
              grandchildren = child[childrenExpr];
              if (grandchildren && grandchildren.length) {
                walk(grandchildren, cached.branch, childScope, depth + 1);
              }
              ++i;
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
        }), true);
      };
    }
  };
});