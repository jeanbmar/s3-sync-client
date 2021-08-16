const EventEmitter = require('events');
const { AbortController } = require('@aws-sdk/abort-controller');
const { DEFAULT_MAX_CONCURRENT_TRANSFERS } = require('../constants');

class TransferManager {
    constructor(options = {}) {
        const {
            client,
            commandInput,
            maxConcurrentTransfers = DEFAULT_MAX_CONCURRENT_TRANSFERS,
            monitor = new EventEmitter(),
            objects,
        } = options;
        this.client = client;
        this.commandInput = commandInput;
        this.maxConcurrentTransfers = maxConcurrentTransfers;
        this.objects = objects;
        this.abortController = new AbortController();
        this.monitor = monitor;
        this.monitor.on('abort', this.abort.bind(this));
    }

    abort() {
        this.abortController.abort();
    }
}

module.exports = TransferManager;
