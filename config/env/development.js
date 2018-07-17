'use strict';
const DS       = "/",
      PORT     = 5071,
      base_url = "http://localhost:"+PORT+DS;

/*develop config--*/
module.exports = {
  API : {
    site  : '/api/'
  },
  base_url: base_url,
  constants : {

  },
  server: {
    PORT: process.env.WEBSITES_PORT || PORT,
    IO  : process.env.IO_PORT || 5070
  }
};