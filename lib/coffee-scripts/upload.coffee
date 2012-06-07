Ext.namespace "gxp.plugins"
gxp.plugins.Username = Ext.extend(gxp.plugins.Tool,
  ptype: "gispro_upload"
  uploadText: "Upload"
  addActions: ->
    button = new Ext.Button text: @uploadText, menuText: @uploadText, iconCls: 'uploadIcon'
    gxp.plugins.Username.superclass.addActions.apply this, [ button ]
)
Ext.preg gxp.plugins.Username::ptype, gxp.plugins.Username
