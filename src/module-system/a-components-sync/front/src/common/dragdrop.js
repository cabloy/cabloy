export default function(Vue) {

  const tooltipResizeOffset = 16;
  const tooltipOffset = 6;

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
  let _tooltipElement = null;
  let _tooltipDrag = '';
  let _tooltipText = '';
  let _dragContainer = {};
  let _touchStart = {};
  let _delayTimeout = 0;

  function _getDragContainer($el, context) {
    if (!context.onDragContainer) return { size: _windowSize, tooltip: undefined };
    const res = context.onDragContainer({ $el, context });
    if (res === undefined) return { size: _windowSize, tooltip: undefined };
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

  function _getDropElement($el, context, dragElement, dragContext) {
    if (!context.onDropElement) return { dropElement: $el, tooltip: undefined };
    const res = context.onDropElement({ $el, context, dragElement, dragContext });
    if (res === undefined) return { dropElement: $el, tooltip: undefined };
    if (res) return res;
    return null;
  }

  function handeTouchStart(e) {
    const $$ = Vue.prototype.$$;
    // el
    const $el = $$(e.target).closest('*[data-dragdrop-handler]');
    if ($el.length === 0) return;
    // context
    const context = $el[0].__eb_dragContext;
    if (!context) return;
    // delay
    _delayTimeout = window.setTimeout(() => {
      if (!_delayTimeout) return;
      _delayTimeout = 0;

      const isResizable = context.resizable === true;
      const isRow = context.resizeDirection === 'row';

      // touch
      _touchStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
      _touchStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;

      // get drag element
      if (!isResizable) {
        _dragElement = $el[0].__eb_dragElement;
        if (!_dragElement) return; // break
      }
      // get container size
      _dragContainer = _getDragContainer($el, context);
      if (!_dragContainer) return; // break

      // tooltip
      _adjustTooltip(true, context, _touchStart.x, _touchStart.y, _dragContainer.tooltip);

      // cursor
      const cursor = isResizable ? (isRow ? 'row-resize' : 'col-resize') : 'move';
      const style = `html, html a.link {cursor: ${cursor} !important;}`;
      _stylesheet.innerHTML = style;

      // start
      context.onDragStart && context.onDragStart({ $el, context, dragElement: _dragElement });
      if (!isResizable) _dragElement.attr('data-dragdrop-drag', context.scene);

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
    const handlerClassName = `*[data-dragdrop-handler="${_dragContext.scene}"]`;
    const elementClassName = `*[data-dragdrop-element="${_dragContext.scene}"]`;
    let $el = $$(e.target).closest(handlerClassName);
    if ($el.length === 0) {
      const $dragdropElement = $$(e.target).closest(elementClassName);
      if ($dragdropElement.length !== 0) {
        $el = $dragdropElement.find(handlerClassName);
      }
    }

    // drop element
    const res = _checkMoveElement($el);

    // tooltip
    const touchCurrentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
    const touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
    _adjustTooltip(false, _dragContext, touchCurrentX, touchCurrentY, res ? res.tooltip : undefined);

    // switch
    const dropElementNew = res ? res.dropElement : null;
    const dropContextNew = dropElementNew ? $el[0].__eb_dragContext : null;
    const dropHandlerNew = dropElementNew ? $el : null;

    const _dropElementEl = _dropElement ? _dropElement[0] : null;
    const dropElementNewEl = dropElementNew ? dropElementNew[0] : null;
    if (_dropElementEl !== dropElementNewEl) {
      // leave
      if (_dropElement) {
        _dropContext.onDropLeave && _dropContext.onDropLeave({ $el: _dropHandler, context: _dropContext, dropElement: _dropElement });
        _dropElement.removeAttr('data-dragdrop-drop');
      }
      // enter
      if (dropElementNew) {
        dropContextNew.onDropEnter && dropContextNew.onDropEnter({ $el: dropHandlerNew, context: dropContextNew, dropElement: dropElementNew });
        dropElementNew.attr('data-dragdrop-drop', dropContextNew.scene);
      }
      // switch
      _dropElement = dropElementNew;
      _dropContext = dropContextNew;
      _dropHandler = dropHandlerNew;
    }

    _isMoved = true;
    e.preventDefault();

  }

  function _handeTouchResize(e) {
    if (!_dragContext.onDragMove) return;
    _isMoved = true;

    const isRow = _dragContext.resizeDirection === 'row';

    const touchCurrentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
    const touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

    const abs = {
      x: !isRow ? touchCurrentX - _touchStart.x : undefined,
      y: isRow ? touchCurrentY - _touchStart.y : undefined,
    };

    const percent = {
      x: !isRow ? abs.x / _dragContainer.size.width : undefined,
      y: isRow ? abs.y / _dragContainer.size.height : undefined,
    };

    const diff = { abs, percent };

    if (!isRow && abs.x === 0) return;
    if (isRow && abs.y === 0) return;

    // if (!isRow && Math.abs(abs.y) > Math.abs(abs.x)) return;
    // if (isRow && Math.abs(abs.x) > Math.abs(abs.y)) return;

    const res = _dragContext.onDragMove({ $el: _dragHandler, context: _dragContext, diff });

    // tooltip
    _adjustTooltip(false, _dragContext, touchCurrentX, touchCurrentY, res ? res.tooltip : undefined);

    if (!res || res.eaten !== true) {
      return; // continue
    }

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

  function _adjustTooltip(bStart, context, x, y, tooltipText) {
    const $$ = Vue.prototype.$$;
    const isResizable = context.resizable === true;
    const isRow = context.resizeDirection === 'row';

    // default enabled
    if (context.tooltip === false) return;

    // element
    if (bStart) {
      if (!_tooltipElement) {
        _tooltipElement = $$('<div class="eb-dragdrop-tooltip"></div>');
        $$('body').append(_tooltipElement);
      }
      _tooltipElement.show();
    }
    // text
    if (bStart) {
      _tooltipElement.text(tooltipText);
      _tooltipDrag = tooltipText;
      _tooltipText = tooltipText;
    } else {
      let tooltipTextNew;
      if (!isResizable) {
        tooltipTextNew = tooltipText ? `${_tooltipDrag} -> ${tooltipText || ''}` : _tooltipDrag;
      } else {
        tooltipTextNew = tooltipText || _tooltipText;
      }
      if (tooltipTextNew !== _tooltipText) {
        _tooltipElement.text(tooltipTextNew);
        _tooltipText = tooltipTextNew;
      }
    }
    const _tooltipSize = {
      width: _tooltipElement.width(),
      height: _tooltipElement.height(),
    };
    // position
    if (!isResizable) {
      _tooltipElement.css({
        left: `${x + tooltipOffset}px`,
        top: `${y + tooltipOffset}px`,
      });
    } else {
      _tooltipElement.css({
        left: `${isRow ? x + tooltipResizeOffset : x - _tooltipSize.width / 2}px`,
        top: `${isRow ? y - _tooltipSize.height / 2 : y + tooltipResizeOffset}px`,
      });
    }
  }

  function _clearDragdrop() {
    if (_isDragging) {
      // tooltip
      if (_tooltipElement) {
        _tooltipElement.hide();
        _tooltipElement.text('');
      }
      // cursor
      _stylesheet.innerHTML = '';
      // dropElement
      if (_dropElement) {
        _dropContext.onDropLeave && _dropContext.onDropLeave({ $el: _dropHandler, context: _dropContext, dropElement: _dropElement });
        _dropElement.removeAttr('data-dragdrop-drop');
      }
      // dragElement
      if (_dragElement) {
        _dragContext.onDragEnd && _dragContext.onDragEnd({ $el: _dragHandler, context: _dragContext, dragElement: _dragElement });
        _dragElement.removeAttr('data-dragdrop-drag');
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
    _dragContainer = {};
    _touchStart = {};
    _tooltipDrag = '';
    _tooltipText = '';
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
    // unbind
    unbind(el);
    // handler
    const $el = Vue.prototype.$$(el);
    $el.attr('data-dragdrop-handler', context.scene);
    // element
    if (!context.resizable) {
      const $dragElement = _getDragElement($el, context);
      if ($dragElement) {
        $dragElement.attr('data-dragdrop-element', context.scene);
      }
      el.__eb_dragElement = $dragElement;
    }
    // context
    el.__eb_dragContext = context;
  }

  function unbind(el) {
    // handler
    const $el = Vue.prototype.$$(el);
    $el.removeAttr('data-dragdrop-handler');
    // element
    const $dragElement = el.__eb_dragElement;
    if ($dragElement) {
      $dragElement.removeAttr('data-dragdrop-element');
      el.__eb_dragElement = null;
    }
    // context
    el.__eb_dragContext = null;
  }

  return {
    bind,
    unbind,
  };

}

