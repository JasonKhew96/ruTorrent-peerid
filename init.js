plugin.config = theWebUI.config;
theWebUI.config = function () {
  if (plugin.canChangeColumns()) {
    var index = 0;
    for (var j = 0; j < this.tables.prs.columns.length; j++) {
      if (this.tables.prs.columns[j].id == "version") {
        index = j + 1;
      }
    }
    this.tables.prs.columns.splice(index, 0, {
      text: "Peer ID",
      width: "80px",
      id: "peer_id",
      type: TYPE_STRING,
    });
  }
  plugin.config.call(this);
};

plugin.getpeersResponse = rTorrentStub.prototype.getpeersResponse;
rTorrentStub.prototype.getpeersResponse = function (values) {
  var peers = plugin.getpeersResponse.call(this, values);
  if (plugin.enabled) {
    for (var j = 0; j < values.length; j++) {
      var data = values[j];
      var match = data[11].match(/^(-[A-Z~][A-Z~][A-Z0-9][A-Z0-9]..-)/i);
      if (match.length <= 0) {
        peers[data[0]].peer_id = "Unknown";
      } else {
        peers[data[0]].peer_id = decodeURIComponent(match[1]);
      }
    }
  }
  return peers;
};

plugin.onRemove = function () {
  theWebUI.getTable("prs").removeColumnById("peer_id");
};
