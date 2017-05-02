/* utf.js - UTF-8 <=> UTF-16 convertion
 *
 * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */
/* hubin modified, to convert from Utf16String to Uint8Array and convert 
Uint8Array to Utf16String
*/
/*
 * Interfaces:
 * utf8 = utf16to8(utf16);
 * utf16 = utf16to8(utf8);
 */

function utf16to8(str) {
    var out, i, len, c;

    len = str.length;
	out = new Uint8Array(len * 3);
	var utf8len = 0;
    for(i = 0; i < len; i++) {
	c = str.charCodeAt(i);
	if ((c >= 0x0001) && (c <= 0x007F)) {
	    out[utf8len++] = c;
	} else if (c > 0x07FF) {
	    out[utf8len++] = (0xE0 | ((c >> 12) & 0x0F));
	    out[utf8len++] = (0x80 | ((c >>  6) & 0x3F));
	    out[utf8len++] = (0x80 | ((c >>  0) & 0x3F));
	} else {
	    out[utf8len++] = (0xC0 | ((c >>  6) & 0x1F));
	    out[utf8len++] = (0x80 | ((c >>  0) & 0x3F));
	}
    }
    return new Uint8Array(out.buffer, 0, utf8len);
}

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
	c = str[i++];
	switch(c >> 4)
	{ 
	  case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
	    // 0xxxxxxx
	    out += String.fromCharCode(c);
	    break;
	  case 12: case 13:
	    // 110x xxxx   10xx xxxx
	    char2 = str[i++];
	    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
	    break;
	  case 14:
	    // 1110 xxxx  10xx xxxx  10xx xxxx
	    char2 = str[i++];
	    char3 = str[i++];
	    out += String.fromCharCode(((c & 0x0F) << 12) |
					   ((char2 & 0x3F) << 6) |
					   ((char3 & 0x3F) << 0));
	    break;
	}
    }

    return out;
}