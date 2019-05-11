module.exports = {
  meta: {
    name: 'audio',
    title: 'Audio',
    validator: 'blockAudio',
  },
  data: {
    default: {
      audio: {
        name: '',
        url: '',
        artist: '',
        cover: '',
      },
      autoplay: false,
      loop: true,
    },
    async output({ ctx, block, data }) {
      data.loop = data.loop ? 'all' : 'none';
      return data;
    },
  },
  render({ md, options, block, token, index, content }) {
    // element
    const id = `aplayer-${(new Date()).getTime()}${index}`;
    // opening tag
    return `<div class="block-audio"><div id="${id}">
                <script type="text/javascript">
                function __aplayerLoadScript(src, callback) {
                  if (!(typeof callback === 'function')) {
                      callback = function() {};
                  }
                  var check = document.querySelectorAll("script[src='" + src + "']");
                  if (check.length > 0) {
                      check[0].addEventListener('load', function() {
                          callback();
                      });
                      callback();
                      return;
                  }
                  var script = document.createElement('script');
                  var head = document.getElementsByTagName('head')[0];
                  script.type = 'text/javascript';
                  script.charset = 'UTF-8';
                  script.src = src;
                  if (script.addEventListener) {
                      script.addEventListener('load', function() {
                          callback();
                      }, false);
                  } else if (script.attachEvent) {
                      script.attachEvent('onreadystatechange', function() {
                          var target = window.event.srcElement;
                          if (target.readyState === 'loaded') {
                              callback();
                          }
                      });
                  }
                  head.appendChild(script);
                }
                function __aplayerLoadLink(src, callback) {
                  if (!(typeof callback === 'function')) {
                      callback = function() {};
                  }
                  var check = document.querySelectorAll("link[href='" + src + "']");
                  if (check.length > 0) {
                      callback();
                      return;
                  }
                  var link = document.createElement('link');
                  var head = document.getElementsByTagName('head')[0];
                  link.rel = 'stylesheet';
                  link.href = src;
                  if (link.addEventListener) {
                      link.addEventListener('load', function () {
                          callback();
                      }, false);
                  } else if (link.attachEvent) {
                      link.attachEvent('onreadystatechange', function () {
                          var target = window.event.srcElement;
                          if (target.readyState === 'loaded') {
                              callback();
                          }
                      });
                  }
                  head.appendChild(link);
                }
                function __aplayerLoadResource(callback){
                  if(window.APlayer) return callback();
                  __aplayerLoadLink('https://cdnjs.cloudflare.com/ajax/libs/aplayer/1.10.1/APlayer.min.css',function(){
                    __aplayerLoadScript('https://cdnjs.cloudflare.com/ajax/libs/aplayer/1.10.1/APlayer.min.js', function() {
                      return callback();
                    })
                  })
                }
                function __aplayerLoad(id,options){
                  // options
                  if(!options.audio) return;
                  // container
                  options.container = document.getElementById(id);
                  // audio
                  if(options.audio.concat){
                    for(var i=0;i<options.audio.length;i++){
                      if(!options.audio[i].cover) options.audio[i].cover='https://cdn.cabloy.com/audio/cover.jpg';
                    }
                  }else{
                    if(!options.audio.cover) options.audio.cover='https://cdn.cabloy.com/audio/cover.jpg';
                  }
                  // queue
                  if(!window.__aplayerLoadQueue){
                    window.__aplayerLoadQueue=[options];
                    __aplayerLoadResource(function(){
                      for(var i=0;i<window.__aplayerLoadQueue.length;i++){
                        new window.APlayer(window.__aplayerLoadQueue[i]);
                      }
                      window.__aplayerLoadQueue=null;
                    });
                  }else{
                    window.__aplayerLoadQueue.push(options);
                  }
                }
                __aplayerLoad('${id}',${JSON.stringify(content)});
                </script>
        </div></div>
        `;
  },
};
