Ext.namespace "gxp.plugins"
gxp.plugins.Username = Ext.extend(gxp.plugins.Tool,
  loadFileQueryTimout: 300000

  ptype: "gispro_upload"
  uploadText: "Download"
  addActions: ->
    menu = new Ext.Button 
      menuText: @uploadText
      iconCls: 'downloadIcon'

      menu: new Ext.menu.Menu
        listeners:
          beforeshow: @setMenu
          scope: @

    gxp.plugins.Username.superclass.addActions.apply this, [ menu ]

  menuHandler: (obj)->
    @downloadFormat obj.fileFormat

  setMenu: (menu)->
    featureManager = this.target.tools[this.featureManager]
    menu.removeAll()
    for fileFormat in featureManager.layerRecord.get( 'fileFormats' )
      menu.addItem
        text: fileFormat
        fileFormat: fileFormat
        handler: @menuHandler
        scope: @

  downloadFormat: (format)->
    featureManager = this.target.tools[this.featureManager]
    filters = []
    newOptions = {}
    props = [ "featureNS", "featureType", "geometryName", "multi", "outputFormat", "params", "schema", "srsName", "url", "version" ]
    protocol = featureManager.featureStore.proxy.protocol
    i = 0

    while i < props.length
      newOptions[props[i]] = protocol.options[props[i]]
      i++
    urlArr = @target.layerSources[featureManager.layerRecord.get("source")].restUrl.split("/")
    urlArr = urlArr.splice(0, urlArr.length - 1)
    urlArr.push "TestWfsPost"
    testWfsUrl = @target.downloadFilePageUrl
    getFeatureUrlArr = newOptions.url.split("/")
    getFeatureUrlArr = getFeatureUrlArr.splice(0, getFeatureUrlArr.length - 1)
    getFeatureUrlArr.push "GetFeature"
    getFeatureUrl = getFeatureUrlArr.join("/")
    newOptions.outputFormat = format
    newOptions.params = {}
    data = OpenLayers.Format.XML::write.apply(protocol.format, [ protocol.format.writeNode("wfs:GetFeature", newOptions) ])

    @loadFile testWfsUrl,
      body: data
      url: getFeatureUrl

  loadFile: (url, postData) ->
    id = "queryFormIframe"
    form = @createForm(url, postData, id, document.body)
    iframe = @createIframe(id, document.body)
    removeElements = ->
      document.body.removeChild iframe
      document.body.removeChild form

    setTimeout removeElements, @loadFileQueryTimout
    form.submit()
    form.removeAttribute "id"
    form.removeAttribute "name"
    iframe.removeAttribute "id"
    iframe.removeAttribute "name"

  createIframe: (id, root) ->
    el = document.createElement("iframe")
    el.setAttribute "id", id
    el.setAttribute "name", id
    root.appendChild el if root?
    el

  createForm: (url, postData, target, root) ->
    el = document.createElement("form")
    el.setAttribute "method", "post"
    el.setAttribute "target", target
    el.setAttribute "action", url
    for k of postData
      input = document.createElement("input")
      input.setAttribute "id", k
      input.setAttribute "name", k
      input.setAttribute "type", "hidden"
      input.setAttribute "value", postData[k]
      el.appendChild input
    root.appendChild el  if root
    el
)
Ext.preg gxp.plugins.Username::ptype, gxp.plugins.Username
