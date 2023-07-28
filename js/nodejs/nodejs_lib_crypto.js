/////////////////////////////////////////////////////////////////////////////
/// of course you need to import the library
const crypto = require("crypto");

/////////////////////////////////////////////////////////////////////////////
/// digest can decide return a hex string, or a buffer.
crypto.createHash("md5").update("blahblah").digest("hex");
//> '42d388f8b1db997faaf7dab487f11290'

crypto.createHash("md5").update("blahblah").digest();
//> <Buffer 42 d3 88 f8 b1 db 99 7f aa f7 da b4 87 f1 12 90>


crypto.createHash("md4").update("blahblah").digest("hex");
//> '9eeabb89921283da6cfe48f66c4adb89'

crypto.createHash("sha1").update("blahblah").digest("hex");
//> 'd3395867d05cc4c27f013d6e6f48d644e96d8241'
