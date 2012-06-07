
Ext.namespace("gxp.plugins");

gxp.plugins.Username = Ext.extend(gxp.plugins.Tool, {
  ptype: "gispro_josso_username",
  userText: "User",
  addActions: function() {
    OpenLayers.Request.GET({
      url: this.target.jossoInfoUrl,
      callback: function(request) {
        var match;
        if (request.status === 200) {
          match = request.responseText.match(/<li><h4>Username:<\/h4>(.+)<\/li>/);
          if (match != null) {
            this.target.josso_username = match[1];
            return this.target.fireEvent('usernamechanged', this.target.josso_username);
          }
        }
      },
      scope: this,
      proxy: this.target.proxy
    });
    this.label = new Ext.form.Label({
      text: this.textFormat(this.target.josso_username),
      style: {
        marginLeft: '10px',
        marginRight: '10px',
        fontWeight: 'bold'
      }
    });
    this.target.on('usernamechanged', function(username) {
      return this.label.setText(this.textFormat(username));
    }, this);
    return gxp.plugins.Username.superclass.addActions.apply(this, [this.label]);
  },
  textFormat: function(t) {
    return "" + this.userText + ": " + t;
  }
});

Ext.preg(gxp.plugins.Username.prototype.ptype, gxp.plugins.Username);
