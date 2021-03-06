// Generated by IcedCoffeeScript 1.8.0-d
(function() {
  var JSONStreamTransport, Path, apitree, flattenHash, printApis, runConsoleServer, runServer, setupRpcEnvironment,
    __hasProp = {}.hasOwnProperty;

  apitree = require('apitree');

  Path = require('path');

  JSONStreamTransport = require('../rpc/transports/jsonstream');

  exports.usage = ["JSON RPC mode for the GUI.", '  server', ["Run in RPC mode, speaking JSON on stdin and stdout."], '  console', ["Run in debugging-friendly RPC REPL mode, speaking JSON on stdin and stdout via readline."], '  print-apis', ["Print the list of available RPC APIs.", "This command is invoked by 'rake routing' to build the client-side proxy code."]];

  flattenHash = function(object, sep, prefix, result) {
    var key, newKey, value;
    if (sep == null) {
      sep = '.';
    }
    if (prefix == null) {
      prefix = '';
    }
    if (result == null) {
      result = {};
    }
    for (key in object) {
      if (!__hasProp.call(object, key)) continue;
      value = object[key];
      newKey = prefix ? "" + prefix + sep + key : key;
      if ((typeof value === 'object') && value.constructor === Object) {
        flattenHash(value, sep, newKey, result);
      } else {
        result[newKey] = value;
      }
    }
    return result;
  };

  setupRpcEnvironment = function(options, context) {
    context.setupRpc(new JSONStreamTransport(process.stdin, process.stdout));
    context.rpc.on('end', function() {
      return process.exit(0);
    });
    return global.LR = require('../../config/env').createEnvironment(options, context);
  };

  runServer = function(options, context) {
    return process.title = "LiveReloadHelper";
  };

  runConsoleServer = function(options, context) {
    return LR.app.api.init.call(context, {
      resourcesDir: context.paths.bundledPlugins,
      appDataDir: context.paths.bundledPlugins,
      logDir: process.env['TMPDIR'] || process.env['TEMP']
    }, function(err) {
      if (err) {
        throw err;
      }
    });
  };

  printApis = function(options, context) {
    var k, tree, _i, _len, _ref, _results;
    tree = apitree.createApiTree(context.paths.rpc, {
      loadItem: function(path) {
        return require(path).api || {};
      }
    });
    tree = flattenHash(tree);
    _ref = Object.keys(tree);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      _results.push(process.stdout.write("" + k + "\n"));
    }
    return _results;
  };

  exports.run = function(options, context) {
    switch (options.subcommand) {
      case 'print-apis':
        return printApis(options, context);
      case 'server':
        setupRpcEnvironment(options, context);
        return runServer(options, context);
      case 'console':
        setupRpcEnvironment(options, context);
        return runConsoleServer(options, context);
    }
  };

}).call(this);
