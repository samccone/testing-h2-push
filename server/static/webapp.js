$(init);

const AppView = Backbone.View.extend({
  el: '#app',
  template: _.template(`
      <h1>Hello sir</h1>
  `),
  render() {
    this.$el.html(this.template());
  },
});

function init() {
  const appView = new AppView();
  appView.render();

  var request = new XMLHttpRequest();
  request.addEventListener('load', () => {
    performance.mark('data_fetched');
    performance.measure('time to run app boot', undefined, 'data_fetched');
  });
  request.open('GET', '/static/webapp.json');
  request.send();
}
