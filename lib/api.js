/**
 * The MIT License
 *
 * Copyright (c) 2016 Vicente Giner Tendero
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

var express = require('express');

var API = module.exports = function API(gaia, opts) {
	this.mcp = gaia.mcp;

	this.createServer();
	this.configureServerMiddleware();
	this.loadRoutes();
	this.configureErrorHandling();
};

API.prototype.createServer = function() {
	this.express = express();
	this.server = http.createServer(this.express);
};

API.prototype.configureServerMiddleware = function() {

	this.express.use(bodyParser.json());
	this.express.use(bodyParser.urlencoded({ extended: false }));

	this.express.use(function(req, res, next) {
		req.mcp = this.mcp;
		return next();
	};
};

API.prototype.loadRoutes = function() {
  	this.express.use("/api", require("./routes"));
};

API.prototype.configureErrorHandling = function() {
	if (this.express.get('env') === 'development') {
		this.express.use(function(err, req, res, next) {
			res.status(err.status || 500)
			.json({
				message: err.message,
				error: err
			});
			next();
		});
	} else {
	  	this.express.use(function(err, req, res, next) {
		    res.status(500).json({ error: err.message });
		    next();
	  	});
	}
};

API.prototype.start = function() {
	this.server.listen(this.port);
};