import { EventEmitter } from 'events';

class Lock {

  _locked: boolean;
  _ee: EventEmitter;

  constructor() {
    this._locked = false;
    this._ee = new EventEmitter();
  }

  acquire() {
    return new Promise((resolve: any) => {
      // If nobody has the lock, take it an resolve immediately
      if (!this._locked) {
        // Safe because JS does not interrupt on synchronous operations.
        this._locked = true;
        return resolve();
      }

      // otherwise, wait until the lock is released
      const tryAcquire = () => {
        if (!this._locked) {
          this._locked = true;
          this._ee.removeListener('release', tryAcquire);
          return resolve();
        }
      };
      this._ee.on('release', tryAcquire);
    });
  }

  release() {
    // Release the lock
    this._locked = false;
    setImmediate(() => this._ee.emit('release'));
  }
}

export { Lock };