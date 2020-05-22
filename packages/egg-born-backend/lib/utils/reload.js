const cluster = require('cluster');

module.exports = function() {
  this.log('[master] reload workers...');
  for (const id in cluster.workers) {
    const worker = cluster.workers[id];
    worker.isDevReload = true;
  }
  reload(this, this.options.workers);
};

/**
 * Copyright(c) node-modules and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

// Windows not support SIGQUIT https://nodejs.org/api/process.html#process_signal_events
const KILL_SIGNAL = 'SIGTERM';
let reloading = false;
let reloadPedding = false;
function reload(master, count) {
  if (reloading) {
    reloadPedding = true;
    return;
  }
  if (!count) {
    count = require('os').cpus().length;
  }
  reloading = true;
  // find out all alive workers
  const aliveWorkers = [];
  let worker;
  for (const id in cluster.workers) {
    worker = cluster.workers[id];
    if (worker.state === 'disconnected') {
      continue;
    }
    aliveWorkers.push(worker);
  }

  // clear worker
  const _clearWorkers = new Set();
  for (let i = 0; i < aliveWorkers.length; i++) {
    const worker = aliveWorkers[i];
    worker.send({ action: 'eb_clear', data: { id: worker.id } });
    _clearWorkers.add(worker.id);
  }

  // promise
  const promise = new Promise(resolve => {
    let _timeout = null;
    let _resolved = false;
    function _done() {
      if (_resolved) return;
      _resolved = true;
      master.off('eb_clear_done', _callback);
      if (_timeout) {
        clearTimeout(_timeout);
        _timeout = null;
      }
      resolve(true);
    }
    function _callback(data) {
      _clearWorkers.delete(data.id);
      if (_clearWorkers.size === 0) {
        _done();
      }
    }
    master.on('eb_clear_done', _callback);
    _timeout = setTimeout(() => {
      _done();
    }, 5000);
  });
  promise.then(() => {
    reloadNext(master, count, aliveWorkers);
  });

}

function reloadNext(master, count, aliveWorkers) {
  let firstWorker;
  let newWorker;

  function reset() {
    // don't leak
    newWorker.removeListener('listening', reset);
    newWorker.removeListener('error', reset);

    if (firstWorker) {
      // console.log('firstWorker %s %s', firstWorker.id, firstWorker.state);
      firstWorker.kill(KILL_SIGNAL);
      setTimeout(function() {
        firstWorker.process.kill(KILL_SIGNAL);
      }, 100);
    }
    reloading = false;
    if (reloadPedding) {
      // has reload jobs, reload again
      reloadPedding = false;
      reload(master, count);
    }
  }

  firstWorker = aliveWorkers[0];
  newWorker = cluster.fork();
  newWorker.on('listening', reset).on('exit', reset);

  // kill other workers
  for (let i = 1; i < aliveWorkers.length; i++) {
    const worker = aliveWorkers[i];
    // console.log('worker %s %s', worker.id, worker.state);
    worker.kill(KILL_SIGNAL);
  }

  // keep workers number as before
  const left = count - 1;
  for (let j = 0; j < left; j++) {
    cluster.fork();
  }
}

