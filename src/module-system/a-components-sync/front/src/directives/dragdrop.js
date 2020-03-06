export default function(Vue) {

  let _inited = false;

  let _isDragging = false;
  let _isMoved = false;
  let _dragHandler = null;
  let _dragElement = null;
  let _dragContext = null;
  let _dropHandler = null;
  let _dropElement = null;
  let _dropContext = null;
  let _proxyElement = null;
  let _dragElementSize = {};
  const _touchStart = {};
  let _delayTimeout = 0;

  function _getDragElement($el, context) {
    if (!context.onDragElement) return $el;
    const res = context.onDragElement({ $el, context });
    if (res === undefined) return $el;
    if (res) return res;
    return null;
  }

  function _getDropElement($el, context, dragElement, dragConext) {
    if (!context.onDropElement) return $el;
    const res = context.onDropElement({ $el, context, dragElement, dragConext });
    if (res === undefined) return $el;
    if (res) return res;
    return null;
  }

  function handeTouchStart(e) {
    const $$ = Vue.prototype.$$;
    // el
    const $el = $$(e.target).closest('.eb-dragdrop');
    if ($el.length === 0) return;
    // context
    const context = $el[0].__eb_dragContext;
    if (!context) return;
    // delay
    _delayTimeout = window.setTimeout(() => {
      if (!_delayTimeout) return;
      _delayTimeout = 0;
      // get drag element
      _dragElement = _getDragElement($el, context);
      if (!_dragElement) return; // break
      // size
      _dragElementSize = {
        width: _dragElement.width(),
        height: _dragElement.height(),
      };
      // touch
      _touchStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
      _touchStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
      // proxy
      if (!_proxyElement) {
        _proxyElement = $$('<div class="eb-dragdrop-proxy"></div>');
        $$('body').append(_proxyElement);
      }
      // proxy size
      _proxyElement.css({
        left: `${_touchStart.x - _dragElementSize.width / 2}px`,
        top: `${_touchStart.y - _dragElementSize.height / 2}px`,
        width: `${_dragElementSize.width}px`,
        height: `${_dragElementSize.height}px`,
      });
      _proxyElement.show();
      // ready
      _isMoved = false;
      _isDragging = true;
      _dragHandler = $el;
      _dragContext = context;
      _dropHandler = null;
      _dropElement = null;
      _dropContext = null;
    }, 200);
  }

  function handeTouchMove(e) {
    if (!_isDragging) return;
    const $$ = Vue.prototype.$$;
    // el
    const $el = $$(e.target).closest('.eb-dragdrop');
    if ($el.length === 0) return;
    if ($el.is(_dragHandler)) return; // not self
    // context
    const context = $el[0].__eb_dragContext;
    if (!context) return;
    if (context.scene !== _dragContext.scene) return; // not same scene

    // check if can drop
    const dropElementNew = _getDropElement($el, context, _dragElement, _dragContext);
    if (!dropElementNew) return;
    if (_dropElement !== dropElementNew) {
      // leave
      if (_dropElement) {
        _dropContext.onDropLeave && _dropContext.onDropLeave({ $el: _dropHandler, context: _dropContext, dropElement: _dropElement });
      }
      // enter
      context.onDropEnter && context.onDropEnter({ $el, context, dropElement: dropElementNew });
      // switch
      _dropElement = dropElementNew;
      _dropContext = context;
      _dropHandler = $el;
    }

    _isMoved = true;
    e.preventDefault();

    // proxy position
    const pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
    const pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
    _proxyElement.css({
      left: `${pageX - _dragElementSize.width / 2}px`,
      top: `${pageY - _dragElementSize.height / 2}px`,
    });

  }

  function _clearDragdrop() {
    if (_isDragging) {
      // proxy
      if (_proxyElement) {
        _proxyElement.hide();
      }
      // dropElement
      if (_dropElement) {
        _dropContext.onDropLeave && _dropContext.onDropLeave({ $el: _dropHandler, context: _dropContext, dropElement: _dropElement });
      }
    }
    _isMoved = false;
    _isDragging = false;
    _dragHandler = null;
    _dragElement = null;
    _dragContext = null;
    _dropHandler = null;
    _dropElement = null;
    _dropContext = null;
  }

  function handeTouchEnd(e) {
    // clear delay
    if (_delayTimeout) {
      window.clearTimeout(_delayTimeout);
      _delayTimeout = 0;
    }

    if (!_isDragging || !_isMoved) {
      _clearDragdrop();
      return;
    }

    // drop done
    if (_dropElement) {
      _dragContext.onDropDone && _dragContext.onDropDone({
        $el: _dragHandler, context: _dragContext,
        dropElement: _dropElement, dropContext: _dropContext,
      });
    }

    // clear
    _clearDragdrop();
  }

  return {
    bind(el, binding) {
      const app = Vue.prototype.$f7;
      // init
      if (!_inited) {
        _inited = true;
        app.on('touchstart:passive', handeTouchStart);
        app.on('touchmove:active', handeTouchMove);
        app.on('touchend:passive', handeTouchEnd);
      }
      // className
      const $el = Vue.prototype.$$(el);
      $el.addClass('eb-dragdrop');
      // context
      el.__eb_dragContext = binding.value;
      if (!el.__eb_dragContext) {
        console.warn('should specify the value of eb-dragdrop: ', el);
      }
    },
    unbind(el) {
      const $el = Vue.prototype.$$(el);
      $el.removeClass('eb-dragdrop');
      el.__eb_dragContext = null;
    },
  };

}

