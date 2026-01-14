/* eslint-disable */
import BLOG from '@/blog.config'

let bszCaller, bszTag, scriptTag, ready

const DEFAULT_JSONP_URL =
  'https://busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback'
const BUSUANZI_JS = BLOG?.BUSUANZI_JS || DEFAULT_JSONP_URL
const BUSUANZI_JSONP_URL = BUSUANZI_JS.includes('jsonpCallback')
  ? BUSUANZI_JS
  : DEFAULT_JSONP_URL

let intervalId;
let executeCallbacks;
let onReady;
let isReady = false;
let callbacks = [];

// 修复Node同构代码的问题
if (typeof document !== 'undefined') {
  ready = function (callback) {
    if (isReady || document.readyState === 'interactive' || document.readyState === 'complete') {
      callback.call(document);
    } else {
      callbacks.push(function () {
        return callback.call(this);
      });
    }
    return this;
  };

  executeCallbacks = function () {
    for (let i = 0, len = callbacks.length; i < len; i++) {
      callbacks[i].apply(document);
    }
    callbacks = [];
  };

  onReady = function () {
    if (!isReady) {
      isReady = true;
      executeCallbacks.call(window);
      if (document.removeEventListener) {
        document.removeEventListener('DOMContentLoaded', onReady, false);
      } else if (document.attachEvent) {
        document.detachEvent('onreadystatechange', onReady);
        if (window == window.top) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    }
  };

  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', onReady, false);
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', function () {
      if (/loaded|complete/.test(document.readyState)) {
        onReady();
      }
    });
    if (window == window.top) {
      intervalId = setInterval(function () {
        try {
          if (!isReady) {
            document.documentElement.doScroll('left');
          }
        } catch (e) {
          return;
        }
        onReady();
      }, 5);
    }
  }
}

bszCaller = {
  fetch: function (url, callback) {
    const callbackName = 'BusuanziCallback_' + Math.floor(1099511627776 * Math.random())
    url = url.replace('=BusuanziCallback', '=' + callbackName)
    scriptTag = document.createElement('SCRIPT');
    scriptTag.type = 'text/javascript';
    scriptTag.defer = true;
    scriptTag.src = url;
    scriptTag.referrerPolicy = "no-referrer-when-downgrade";
    document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
    window[callbackName] = this.evalCall(callback)
  },
  loadScript: function (url, onError) {
    const existing = document.querySelector('script[data-busuanzi]')
    if (existing?.parentElement) {
      existing.parentElement.removeChild(existing)
    }
    const script = document.createElement('SCRIPT')
    script.type = 'text/javascript'
    script.defer = true
    script.src = url
    script.setAttribute('data-busuanzi', 'true')
    script.onerror = onError
    document.getElementsByTagName('HEAD')[0].appendChild(script)
  },
  evalCall: function (callback) {
    return function (data) {
      ready(function () {
        try {
          callback(data);
          if (scriptTag && scriptTag.parentElement && scriptTag.parentElement.contains(scriptTag)) {
            scriptTag.parentElement.removeChild(scriptTag);
          }
        } catch (e) {
          // console.log(e);
          // bszTag.hides();
        }
      })
    }
  }
}

const fetch = () => {
  if (bszTag) {
    bszTag.hides();
  }
  if (BUSUANZI_JS.endsWith('.js')) {
    bszCaller.loadScript(BUSUANZI_JS, function () {
      bszCaller.fetch(BUSUANZI_JSONP_URL, function (data) {
        bszTag.texts(data)
        bszTag.shows()
      })
    })
    return
  }
  bszCaller.fetch(BUSUANZI_JSONP_URL, function (data) {
    bszTag.texts(data);
    bszTag.shows();
  })
}

bszTag = {
  bszs: ['site_pv', 'page_pv', 'site_uv'],
  texts: function (data) {
    this.bszs.map(function (key) {
      const elements = document.getElementsByClassName('busuanzi_value_' + key)
      if (elements) {
        for (var element of elements) {
          element.innerHTML = data[key];
        }
      }
    })
  },
  hides: function () {
    this.bszs.map(function (key) {
      const elements = document.getElementsByClassName('busuanzi_container_' + key)
      if (elements) {
        for (var element of elements) {
          element.style.display = 'none';
        }
      }
    })
  },
  shows: function () {
    this.bszs.map(function (key) {
      const elements = document.getElementsByClassName('busuanzi_container_' + key)
      if (elements) {
        for (var element of elements) {
          element.style.display = 'inline';
        }
      }
    })
  }
}

module.exports = {
  fetch
}
