
Ext.namespace("gxp.plugins");

gxp.plugins.Username = Ext.extend(gxp.plugins.Tool, {
  ptype: "gispro_upload",
  uploadText: "Upload",
  addActions: function() {
    var button;
    button = new Ext.Button({
      text: this.uploadText,
      menuText: this.uploadText,
      iconCls: 'uploadIcon'
    });
    return gxp.plugins.Username.superclass.addActions.apply(this, [button]);
  }
});

Ext.preg(gxp.plugins.Username.prototype.ptype, gxp.plugins.Username);
