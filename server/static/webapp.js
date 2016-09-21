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

  fetch('/static/webapp.json').then(r => r.json()).then(v => {
    performance.mark('data_fetched');
    performance.measure('time to run app boot', undefined, 'data_fetched');
  });
}
