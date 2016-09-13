(function() {
  console.log('hello from static');
  performance.mark('js_executed');
  performance.measure('time to run js', 'page_boot', 'js_executed');
})();
