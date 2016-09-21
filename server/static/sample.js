(function() {
  console.log('hello from static');
  performance.mark('js_executed');
  performance.measure('time to run js', undefined, 'js_executed');
})();
