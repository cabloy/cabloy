export default function(Vue) {

  const proxyOffset = 6;
  const proxySizeMin = 16;
  const proxySizeMax = 32;

  let _inited = false;
  let _stylesheet = null;
  const _windowSize = {};

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
  let _dragContainerSize = {};
  let _touchStart = {};
  let _delayTimeout = 0;

  function _getDragContainerSize($el, context) {
    if (!context.onDragContainerSize) return _windowSize;
    const res = context.onDragContainerSize({ $el, context });
    if (res === undefined) return _windowSize;
    if (res) return res;
    return null;
  }

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
    const $el = $$(e.target).closest('.eb-dragdrop-handler');
    if ($el.length === 0) return;
    // context
    const context = $el[0].__eb_dragContext;
    if (!context) return;
    // delay
    _delayTimeout = window.setTimeout(() => {
      if (!_delayTimeout) return;
      _delayTimeout = 0;
      // get drag element
      if (context.resizable !== true) {
        _dragElement = _getDragElement($el, context);
        if (!_dragElement) return; // break
        // size
        _dragElementSize = {
          width: _dragElement.width(),
          height: _dragElement.height(),
        };
      } else {
        // get container size
        _dragContainerSize = _getDragContainerSize($el, context);
        if (!_dragContainerSize) return; // break
      }
      // touch
      _touchStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
      _touchStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
      // proxy
      if (context.resizable !== true && context.proxy !== false) {
        if (!_proxyElement) {
          _proxyElement = $$('<div class="eb-dragdrop-proxy"></div>');
          $$('body').append(_proxyElement);
        }
        const _size = _dragElementSize.width <= _dragElementSize.height ? { min: _dragElementSize.width, max: _dragElementSize.height } : { min: _dragElementSize.height, max: _dragElementSize.width };
        const _proxySize = {
          min: proxySizeMin,
          max: Math.min(parseInt(_size.max * proxySizeMin / _size.min), proxySizeMax),
        };
        // proxy size
        _proxyElement.css({
          left: `${_touchStart.x + proxyOffset}px`,
          top: `${_touchStart.y + proxyOffset}px`,
          width: `${_dragElementSize.width <= _dragElementSize.height ? _proxySize.min : _proxySize.max}px`,
          height: `${_dragElementSize.width <= _dragElementSize.height ? _proxySize.max : _proxySize.min}px`,
        });
        _proxyElement.show();
      }
      // cursor
      const cursor = context.resizable === true ? (context.resizeDirection === 'row' ? 'row-resize' : 'col-resize') : 'move';
      const style = `html, html a.link {cursor: ${cursor} !important;}`;
      _stylesheet.innerHTML = style;
      // start
      context.onDragStart && context.onDragStart({ $el, context, dragElement: _dragElement });
      if (context.resizable !== true) _dragElement.addClass('eb-dragdrop-drag');
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

  function _checkMoveElement($el) {
    if ($el.length === 0) return null;
    if ($el.is(_dragHandler)) return null; // not self
    // context
    const context = $el[0].__eb_dragContext;
    if (!context) return null;
    if (context.scene !== _dragContext.scene) return null; // not same scene

    // check if can drop
    return _getDropElement($el, context, _dragElement, _dragContext);
  }

  function _handeTouchMove(e) {
    const $$ = Vue.prototype.$$;
    // el
    const $el = $$(e.target).closest('.eb-dragdrop-handler');
    // drop element
    const dropElementNew = _checkMoveElement($el);
    const dropContextNew = dropElementNew ? $el[0].__eb_dragContext : null;
    const dropHandlerNew = dropElementNew ? $el : null;

    const _dropElementEl = _dropElement ? _dropElement[0] : null;
    const dropElementNewEl = dropElementNew ? dropElementNew[0] : null;
    if (_dropElementEl !== dropElementNewEl) {
      // leave
      if (_dropElement) {
        _dropContext.onDropLeave && _dropContext.onDropLeave({ $el: _dropHandler, context: _dropContext, dropElement: _dropElement });
        _dropElement.removeClass('eb-dragdrop-drop');
      }
      // enter
      if (dropElementNew) {
        dropContextNew.onDropEnter && dropContextNew.onDropEnter({ $el: dropHandlerNew, context: dropContextNew, dropElement: dropElementNew });
        dropElementNew.addClass('eb-dragdrop-drop');
      }
      // switch
      _dropElement = dropElementNew;
      _dropContext = dropContextNew;
      _dropHandler = dropHandlerNew;
    }

    _isMoved = true;
    e.preventDefault();

    // proxy position
    if (_dragContext.proxy !== false) {
      const pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
      const pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
      _proxyElement.css({
        left: `${pageX + proxyOffset}px`,
        top: `${pageY + proxyOffset}px`,
      });
    }

  }

  function _handeTouchResize(e) {
    if (!_dragContext.onDragMove) return;
    _isMoved = true;

    const bRow = _dragContext.resizeDirection === 'row';

    const touchCurrentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
    const touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

    const abs = {
      x: !bRow ? touchCurrentX - _touchStart.x : undefined,
      y: bRow ? touchCurrentY - _touchStart.y : undefined,
    };

    const percent = {
      x: !bRow ? abs.x / _dragContainerSize.width : undefined,
      y: bRow ? abs.y / _dragContainerSize.height : undefined,
    };

    const diff = { abs, percent };

    if (!bRow && abs.x === 0) return;
    if (bRow && abs.y === 0) return;

    // if (!bRow && Math.abs(abs.y) > Math.abs(abs.x)) return;
    // if (bRow && Math.abs(abs.x) > Math.abs(abs.y)) return;

    const res = _dragContext.onDragMove({ $el: _dragHandler, context: _dragContext, diff });
    if (res !== true) return;

    // reset
    _touchStart = { x: touchCurrentX, y: touchCurrentY };
    e.preventDefault();

  }

  function handeTouchMove(e) {
    if (!_isDragging) return;
    if (_dragContext.resizable !== true) {
      _handeTouchMove(e);
    } else {
      _handeTouchResize(e);
    }
  }

  function _clearDragdrop() {
    if (_isDragging) {
      // proxy
      if (_proxyElement) {
        _proxyElement.hide();
      }
      // cursor
      _stylesheet.innerHTML = '';
      // dropElement
      if (_dropElement) {
        _dropContext.onDropLeave && _dropContext.onDropLeave({ $el: _dropHandler, context: _dropContext, dropElement: _dropElement });
        _dropElement.removeClass('eb-dragdrop-drop');
      }
      // dragElement
      if (_dragElement) {
        _dragContext.onDragEnd && _dragContext.onDragEnd({ $el: _dragHandler, context: _dragContext, dragElement: _dragElement });
        _dragElement.removeClass('eb-dragdrop-drag');
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

    if (_dragContext && _dragContext.resizable === true) {
      _clearDragdrop();
      return;
    }

    if (!_isDragging || !_isMoved) {
      _clearDragdrop();
      return;
    }

    // drop done
    if (_dropElement) {
      _dragContext.onDragDone && _dragContext.onDragDone({
        $el: _dragHandler, context: _dragContext, dragElement: _dragElement,
        dropElement: _dropElement, dropContext: _dropContext,
      });
    }

    // clear
    _clearDragdrop();
  }

  function initialize() {
    if (_inited) return;
    _inited = true;
    // style
    _stylesheet = document.createElement('style');
    document.head.appendChild(_stylesheet);
    // width/height
    _windowSize.width = document.documentElement.clientWidth;
    _windowSize.height = document.documentElement.clientHeight;
    // events
    const app = Vue.prototype.$f7;
    app.on('touchstart:passive', handeTouchStart);
    app.on('touchmove:active', handeTouchMove);
    app.on('touchend:passive', handeTouchEnd);
  }

  function bind(el, context) {
    initialize();
    Vue.prototype.$$(el).addClass('eb-dragdrop-handler');
    el.__eb_dragContext = context;
  }

  function unbind(el) {
    Vue.prototype.$$(el).removeClass('eb-dragdrop-handler');
    el.__eb_dragContext = null;
  }

  return {
    bind,
    unbind,
  };

}

