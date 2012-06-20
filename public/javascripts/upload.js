
Ext.namespace("gxp.plugins");

gxp.plugins.Username = Ext.extend(gxp.plugins.Tool, {
  loadFileQueryTimout: 300000,
  ptype: "gispro_upload",
  uploadText: "Download",
  addActions: function() {
    var menu;
    menu = new Ext.Button({
      menuText: this.uploadText,
      iconCls: 'downloadIcon',
      menu: new Ext.menu.Menu({
        listeners: {
          beforeshow: this.setMenu,
          scope: this
        }
      })
    });
    return gxp.plugins.Username.superclass.addActions.apply(this, [menu]);
  },
  menuHandler: function(obj) {
    return this.downloadFormat(obj.fileFormat);
  },
  setMenu: function(menu) {
    var featureManager, fileFormat, _i, _len, _ref, _results;
    featureManager = this.target.tools[this.featureManager];
    menu.removeAll();
    _ref = featureManager.layerRecord.get('fileFormats');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      fileFormat = _ref[_i];
      _results.push(menu.addItem({
        text: fileFormat,
        fileFormat: fileFormat,
        handler: this.menuHandler,
        scope: this
      }));
    }
    return _results;
  },
  downloadFormat: function(format) {
    var data, featureManager, filters, getFeatureUrl, getFeatureUrlArr, i, newOptions, props, protocol, testWfsUrl, urlArr;
    featureManager = this.target.tools[this.featureManager];
    filters = [];
    newOptions = {};
    props = ["featureNS", "featureType", "geometryName", "multi", "outputFormat", "params", "schema", "srsName", "url", "version"];
    protocol = featureManager.featureStore.proxy.protocol;
    i = 0;
    while (i < props.length) {
      newOptions[props[i]] = protocol.options[props[i]];
      i++;
    }
    urlArr = this.target.layerSources[featureManager.layerRecord.get("source")].restUrl.split("/");
    urlArr = urlArr.splice(0, urlArr.length - 1);
    urlArr.push("TestWfsPost");
    testWfsUrl = this.target.downloadFilePageUrl;
    getFeatureUrlArr = newOptions.url.split("/");
    getFeatureUrlArr = getFeatureUrlArr.splice(0, getFeatureUrlArr.length - 1);
    getFeatureUrlArr.push("GetFeature");
    getFeatureUrl = getFeatureUrlArr.join("/");
    newOptions.outputFormat = format;
    newOptions.params = {};
    data = OpenLayers.Format.XML.prototype.write.apply(protocol.format, [protocol.format.writeNode("wfs:GetFeature", newOptions)]);
    return this.loadFile(testWfsUrl, {
      body: data,
      url: getFeatureUrl
    });
  },
  loadFile: function(url, postData) {
    var form, id, iframe, removeElements;
    id = "queryFormIframe";
    form = this.createForm(url, postData, id, document.body);
    iframe = this.createIframe(id, document.body);
    removeElements = function() {
      document.body.removeChild(iframe);
      return document.body.removeChild(form);
    };
    setTimeout(removeElements, this.loadFileQueryTimout);
    form.submit();
    form.removeAttribute("id");
    form.removeAttribute("name");
    iframe.removeAttribute("id");
    return iframe.removeAttribute("name");
  },
  createIframe: function(id, root) {
    var el;
    el = document.createElement("iframe");
    el.setAttribute("id", id);
    el.setAttribute("name", id);
    if (root != null) root.appendChild(el);
    return el;
  },
  createForm: function(url, postData, target, root) {
    var el, input, k;
    el = document.createElement("form");
    el.setAttribute("method", "post");
    el.setAttribute("target", target);
    el.setAttribute("action", url);
    for (k in postData) {
      input = document.createElement("input");
      input.setAttribute("id", k);
      input.setAttribute("name", k);
      input.setAttribute("type", "hidden");
      input.setAttribute("value", postData[k]);
      el.appendChild(input);
    }
    if (root) root.appendChild(el);
    return el;
  }
});

Ext.preg(gxp.plugins.Username.prototype.ptype, gxp.plugins.Username);
