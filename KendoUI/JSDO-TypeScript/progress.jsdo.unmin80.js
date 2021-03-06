/*
Progress JSDO Version: 4.2.0

Copyright 2012-2015 Progress Software Corporation and/or its subsidiaries or affiliates.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
(function() {
    if (typeof progress === "undefined") {
        progress = {}
    }
    if (typeof progress.data === "undefined") {
        progress.data = {}
    }
    progress.util = {};
    var STRING_OBJECT_TYPE = "String",
        DATE_OBJECT_TYPE = "Date";
    progress.util.Observable = function() {
        function _filterObservers(observers, fn, scope, operation) {
            return observers.filter(function(el) {
                if (el.fn !== fn || el.scope !== scope ||
                    el.operation !== operation) {
                    return el
                }
            }, this)
        }
        this.validateSubscribe = function(args, evt, listenerData) {
            if (args.length >= 2 && (typeof args[0] === "string") &&
                (typeof args[1] === "string")) {
                listenerData.operation = args[1];
                listenerData.fn = args[2];
                listenerData.scope = args[3]
            } else {
                if (args.length >= 2 && (typeof args[0] ===
                        "string") && (typeof args[1] === "function")) {
                    listenerData.operation = undefined;
                    listenerData.scope = args[2];
                    listenerData.fn = args[1]
                } else {
                    throw new Error()
                }
            }
        };
        this.subscribe = function(evt, operation, fn, scope) {
            var listenerData, observers;
            if (!evt) {
                throw new Error(progress.data._getMsgText(
                    "jsdoMSG037", this.toString(),
                    "subscribe"))
            }
            if (typeof evt !== "string") {
                throw new Error(progress.data._getMsgText(
                    "jsdoMSG033", this.toString(),
                    "subscribe", progress.data._getMsgText(
                        "jsdoMSG039")))
            }
            this._events = this._events || {};
            evt = evt.toLowerCase();
            listenerData = {
                fn: undefined,
                scope: undefined,
                operation: undefined
            };
            try {
                this.validateSubscribe(arguments, evt, listenerData)
            } catch (e) {
                throw new Error(progress.data._getMsgText(
                    "jsdoMSG033", this.toString(),
                    "subscribe", e.message))
            }
            observers = this._events[evt] || [];
            observers = _filterObservers(observers, listenerData.fn,
                listenerData.scope, listenerData.operation);
            observers.push(listenerData);
            this._events[evt] = observers;
            return this
        };
        this.unsubscribe = function(evt, operation, fn, scope) {
            var listenerData, observers;
            if (!evt) {
                throw new Error(progress.data._getMsgText(
                    "jsdoMSG037", this.toString(),
                    "unsubscribe"))
            }
            if (typeof evt !== "string") {
                throw new Error(progress.data._getMsgText(
                    "jsdoMSG033", this.toString(),
                    "unsubscribe", progress.data._getMsgText(
                        "jsdoMSG037")))
            }
            this._events = this._events || {};
            evt = evt.toLowerCase();
            listenerData = {
                fn: undefined,
                scope: undefined,
                operation: undefined
            };
            try {
                this.validateSubscribe(arguments, evt, listenerData)
            } catch (e) {
                throw new Error(progress.data._getMsgText(
                    "jsdoMSG033", this.toString(),
                    "unsubscribe", e.message))
            }
            observers = this._events[evt] || [];
            if (observers.length > 0) {
                this._events[evt] = _filterObservers(observers,
                    listenerData.fn, listenerData.scope,
                    listenerData.operation)
            }
            return this
        };
        this.trigger = function(evt, operation, args) {
            var observers, op;
            if (!evt) {
                throw new Error(progress.data._getMsgText(
                    "jsdoMSG037", this.toString(),
                    "trigger"))
            }
            this._events = this._events || {};
            evt = evt.toLowerCase();
            observers = this._events[evt] || [];
            if (observers.length > 0) {
                args = Array.prototype.slice.call(arguments);
                if ((arguments.length >= 2) && (typeof evt ===
                        "string") && (typeof operation === "string")) {
                    op = operation;
                    args = args.length > 2 ? args.slice(2) : []
                } else {
                    if (arguments.length >= 1 && (typeof evt ===
                            "string")) {
                        op = undefined;
                        args = args.length > 1 ? args.slice(1) : []
                    } else {
                        throw new Error(progress.data._getMsgText(
                            "jsdoMSG033", this.toString(),
                            "trigger"))
                    }
                }
                observers.forEach(function(el) {
                    if (el.operation === op) {
                        el.fn.apply(el.scope, args)
                    }
                })
            }
            return this
        };
        this.unsubscribeAll = function(evt, operation) {
            var observers;
            if (evt) {
                this._events = this._events || {};
                if (typeof evt === "string") {
                    evt = evt.toLowerCase();
                    observers = this._events[evt] || [];
                    observers.forEach(function(el) {
                        if (el.operation) {
                            this.unsubscribe(evt, el.operation,
                                el.fn, el.scope)
                        } else {
                            this.unsubscribe(evt, el.fn, el
                                .scope)
                        }
                    }, this)
                }
            } else {
                this._events = {}
            }
            return this
        }
    };
    progress.data.LocalStorage = function LocalStorage() {
        if (typeof localStorage === "undefined") {
            throw new Error(progress.data._getMsgText("jsdoMSG002",
                this._name))
        }
        this.saveToLocalStorage = function(name, dataObj) {
            localStorage.setItem(name, JSON.stringify(dataObj))
        };
        this.readFromLocalStorage = function(name) {
            var jsonStr = localStorage.getItem(name),
                dataObj = null;
            if (jsonStr !== null) {
                try {
                    dataObj = JSON.parse(jsonStr)
                } catch (e) {
                    dataObj = null
                }
            }
            return dataObj
        };
        this.clearLocalStorage = function(name) {
            localStorage.removeItem(name)
        }
    };
    progress.util._convertToABLWhereString = function(tableRef, filter) {
        var result = [],
            logic = filter.logic || "and",
            idx, length, field, type, format, operator, value, ablType,
            filters = (filter.filters) ? filter.filters : [filter],
            whereOperators = {
                eq: "=",
                neq: "<>",
                gt: ">",
                gte: ">=",
                lt: "<",
                lte: "<=",
                contains: "INDEX",
                doesnotcontain: "INDEX",
                endswith: "R-INDEX",
                startswith: "BEGINS"
            };
        for (idx = 0, length = filters.length; idx < length; idx = idx +
            1) {
            filter = filters[idx];
            field = filter.field;
            value = filter.value;
            if (filter.filters) {
                filter = progress.util._convertToABLWhereString(
                    tableRef, filter)
            } else {
                operator = whereOperators[filter.operator];
                if (operator === undefined) {
                    throw new Error("The operator " + filter.operator +
                        " is not valid.")
                }
                if (operator && value !== undefined) {
                    type = progress.util._getObjectType(value);
                    if (type === STRING_OBJECT_TYPE) {
                        format = "'{1}'"
                    } else {
                        if (type === DATE_OBJECT_TYPE) {
                            ablType = tableRef._getABLType(field);
                            if (ablType === "DATE") {
                                format = "DATE({1:MM, dd, yyyy})"
                            } else {
                                if (ablType === "DATETIME-TZ") {
                                    format =
                                        "DATETIME-TZ({1:MM, dd, yyyy, hh, mm, ss, fff, zzz})"
                                } else {
                                    format =
                                        "DATETIME({1:MM, dd, yyyy, hh, mm, ss, fff})"
                                }
                            }
                        } else {
                            format = "{1}"
                        }
                    }
                    if (operator === "INDEX" || operator === "R-INDEX") {
                        if (type !== STRING_OBJECT_TYPE) {
                            throw new Error(
                                "Error parsing filter object. The operator " +
                                filter.operator +
                                " requires a string value")
                        }
                        if (filter.operator === "doesnotcontain") {
                            format = "{0}({2}, " + format + ") = 0"
                        } else {
                            if (filter.operator === "contains") {
                                format = "{0}({2}, " + format + ") > 0"
                            } else {
                                format = "{2} MATCHES '*{1}'"
                            }
                        }
                    } else {
                        format = "{2} {0} " + format
                    }
                    filter = progress.util._format(format, operator,
                        value, field)
                }
            }
            result.push(filter)
        }
        filter = result.join(" " + logic + " ");
        if (result.length > 1) {
            filter = "(" + filter + ")"
        }
        return filter
    };
    progress.util._convertToSQLQueryString = function(tableRef, filter,
        addSelect) {
        var result = [],
            logic = filter.logic || "and",
            idx, length, field, type, format, operator, value,
            fieldFormat, filters = (filter.filters) ? filter.filters : [
                filter
            ],
            filterStr, usingLike = true,
            whereOperators = {
                eq: "=",
                neq: "!=",
                gt: ">",
                gte: ">=",
                lt: "<",
                lte: "<=",
                contains: "LIKE",
                doesnotcontain: "NOT LIKE",
                endswith: "LIKE",
                startswith: "LIKE"
            };
        if (typeof addSelect === "undefined") {
            addSelect = false
        }
        for (idx = 0, length = filters.length; idx < length; idx = idx +
            1) {
            filter = filters[idx];
            field = filter.field;
            value = filter.value;
            if (filter.filters) {
                filterStr = progress.util._convertToSQLQueryString(
                    tableRef, filter, false)
            } else {
                operator = whereOperators[filter.operator];
                if (operator === undefined) {
                    throw new Error("The operator " + filter.operator +
                        " is not valid.")
                }
                if (operator && value !== undefined) {
                    type = progress.util._getObjectType(value);
                    if (operator === "LIKE" || operator === "NOT LIKE") {
                        if (type !== STRING_OBJECT_TYPE) {
                            throw new Error(
                                "Error parsing filter object. The operator " +
                                filter.operator +
                                " requires a string value")
                        }
                    }
                    if (type === STRING_OBJECT_TYPE) {
                        format = "'{1}'";
                        value = value.replace(/'/g, "''")
                    } else {
                        if (type === DATE_OBJECT_TYPE) {
                            fieldFormat = tableRef._getFormat(field);
                            if (fieldFormat === "date") {
                                format = "'{1:yyyy-MM-dd}'"
                            } else {
                                if (fieldFormat === "date-time") {
                                    format = "{1:#ISO(iso)}"
                                } else {
                                    if (fieldFormat === "time") {
                                        format = "'{1:FFF}'"
                                    }
                                }
                            }
                        } else {
                            format = "{1}"
                        }
                    }
                    if (filter.operator === "startswith") {
                        format = "'{1}%'"
                    } else {
                        if (filter.operator === "endswith") {
                            format = "'%{1}'"
                        } else {
                            if (filter.operator === "contains" ||
                                filter.operator === "doesnotcontain") {
                                format = "'%{1}%'"
                            } else {
                                usingLike = false
                            }
                        }
                    }
                    if (usingLike) {
                        value = value.replace(/%/g, "\\%");
                        value = value.replace(/_/g, "\\_")
                    }
                    format = "{2} {0} " + format;
                    filterStr = progress.util._format(format, operator,
                        value, field)
                }
            }
            result.push(filterStr)
        }
        filterStr = result.join(" " + logic + " ");
        if (result.length > 1) {
            filterStr = "(" + filterStr + ")"
        }
        if (addSelect === true) {
            filterStr = "SELECT * FROM " + tableRef._name + " WHERE " +
                filterStr
        }
        return filterStr
    };
    progress.util._getObjectType = function(value) {
        return Object.prototype.toString.call(value).slice(8, -1)
    };
    progress.util._format = function(fmt) {
        var values = arguments,
            formatRegExp = /\{(\d+)(:[^\}]+)?\}/g;
        return fmt.replace(formatRegExp, function(match, index,
            placeholderFormat) {
            var value = values[parseInt(index, 10) + 1];
            return progress.util._toString(value,
                placeholderFormat ? placeholderFormat.substring(
                    1) : "")
        })
    };
    progress.util._toString = function(value, fmt) {
        var str;
        if (fmt) {
            if (progress.util._getObjectType(value) === "Date") {
                return progress.util._formatDate(value, fmt)
            }
        }
        if (typeof value === "number") {
            str = value.toString()
        } else {
            str = (value !== undefined ? value : "")
        }
        return str
    };
    progress.util._pad = function(number, digits) {
        var zeros = ["", "0", "00", "000", "0000"],
            end;
        number = String(number);
        digits = digits || 2;
        end = digits - number.length;
        if (end) {
            return zeros[digits].substring(0, end) + number
        }
        return number
    };
    progress.util._formatDate = function(date, format) {
        var dateFormatRegExp =
            /dd|MM|yyyy|hh|mm|fff|FFF|ss|zzz|iso|"[^"]*"|'[^']*'/g;
        return format.replace(dateFormatRegExp, function(match) {
            var minutes, result, sign;
            if (match === "dd") {
                result = progress.util._pad(date.getDate())
            } else {
                if (match === "MM") {
                    result = progress.util._pad(date.getMonth() +
                        1)
                } else {
                    if (match === "yyyy") {
                        result = progress.util._pad(date.getFullYear(),
                            4)
                    } else {
                        if (match === "hh") {
                            result = progress.util._pad(date.getHours())
                        } else {
                            if (match === "mm") {
                                result = progress.util._pad(
                                    date.getMinutes())
                            } else {
                                if (match === "ss") {
                                    result = progress.util._pad(
                                        date.getSeconds())
                                } else {
                                    if (match === "fff") {
                                        result = progress.util._pad(
                                            date.getMilliseconds(),
                                            3)
                                    } else {
                                        if (match === "FFF") {
                                            result = String(
                                                date.getTime()
                                            )
                                        } else {
                                            if (match === "zzz") {
                                                minutes = date.getTimezoneOffset();
                                                sign = minutes <
                                                    0;
                                                result = (sign ?
                                                        "+" :
                                                        "-") +
                                                    minutes
                                            } else {
                                                if (match ===
                                                    "iso") {
                                                    result =
                                                        date.toISOString()
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return result !== undefined ? result : match.slice(
                1, match.length - 1)
        })
    };
    progress.util.jsdoSettingsProcessor = function jsdoSettingsProcessor(
        jsdoSettings) {
        if (typeof jsdoSettings === "object") {
            if (jsdoSettings.authenticationModel === undefined ||
                jsdoSettings.authenticationModel === "") {
                jsdoSettings.authenticationModel = "ANONYMOUS"
            }
        }
    }
}());
(function() {
    var PROGRESS_JSDO_PCT_MAX_EMPTY_BLOCKS = 20,
        PROGRESS_JSDO_OP_STRING = ["none", "create", "read", "update",
            "delete", "submit"
        ],
        PROGRESS_JSDO_ROW_STATE_STRING = ["", "created", "", "modified",
            "deleted"
        ];
    if (typeof progress === "undefined") {
        progress = {}
    }
    if (typeof progress.data === "undefined") {
        progress.data = {}
    }
    progress.data._nextid = 0;
    progress.data._uidprefix = "" + (Date.now ? Date.now() : (new Date().getTime()));
    var UID_MAX_VALUE = 999999999999999;
    progress.data._getNextId = function() {
        var uid = ++progress.data._nextid;
        if (uid >= UID_MAX_VALUE) {
            progress.data._nextid = uid = 1;
            progress.data._uidprefix = "" + (Date.now ? Date.now() : (
                new Date().getTime()))
        }
        return progress.data._uidprefix + "-" + uid
    };
    var msg = {};
    msg.msgs = {};
    msg.msgs.jsdoMSG000 = "JSDO, Internal Error: {1}";
    msg.msgs.jsdoMSG001 =
        "JSDO: JSDO has multiple tables. Please use {1} at the table reference level.";
    msg.msgs.jsdoMSG002 = "JSDO: Working record for '{1}' is undefined.";
    msg.msgs.jsdoMSG003 =
        "JSDO: {1} function requires a function as a parameter.";
    msg.msgs.jsdoMSG004 =
        "JSDO: Unable to find resource '{1}' in the catalog.";
    msg.msgs.jsdoMSG005 =
        "JSDO: Data for table '{1}' was not specified in addRecords() call.";
    msg.msgs.jsdoMSG006 =
        "JSDO: Data for JSDO was not specified in addRecords() call.";
    msg.msgs.jsdoMSG007 =
        "JSDO: Test function in {1} must return a boolean.";
    msg.msgs.jsdoMSG008 =
        "JSDO: Invalid keyFields parameter in addRecords() call.";
    msg.msgs.jsdoMSG009 =
        "JSDO: KeyField '{1}' in addRecords() call was not found in the schema.";
    msg.msgs.jsdoMSG010 =
        "JSDO: Field '{1}' in relationship was not found in the schema.";
    msg.msgs.jsdoMSG011 =
        "UIHelper: JSDO has multiple tables. Please use {1} at the table reference level.";
    msg.msgs.jsdoMSG012 = "UIHelper: Invalid {2} parameter in {1} call.";
    msg.msgs.jsdoMSG020 =
        "JSDO: tableName parameter must be a string in addRecords() call.";
    msg.msgs.jsdoMSG021 =
        "JSDO: addMode parameter must be specified in addRecords() call.";
    msg.msgs.jsdoMSG022 =
        "JSDO: Invalid addMode specified in addRecords() call.";
    msg.msgs.jsdoMSG023 =
        "JSDO: Duplicate found in addRecords() call using APPEND mode.";
    msg.msgs.jsdoMSG024 =
        "{1}: Unexpected signature in call to {2} function.";
    msg.msgs.jsdoMSG025 =
        "{1}: Invalid parameters in call to {2} function.";
    msg.msgs.jsdoMSG026 =
        "JSDO: saveChanges requires a CREATE, UPDATE, DELETE or SUBMIT operation to be defined.";
    msg.msgs.jsdoMSG030 = "JSDO: Invalid {1}, expected {2}.";
    msg.msgs.jsdoMSG031 =
        "JSDO: Specified sort field name '{1}' was not found in the schema.";
    msg.msgs.jsdoMSG032 =
        "JSDO: Before-image data already exists for record in addRecords() call.";
    msg.msgs.jsdoMSG033 = "{1}: Invalid signature for {2}. {3}";
    msg.msgs.jsdoMSG034 =
        "JSDO: In '{1}' function, JSON data is missing _id";
    msg.msgs.jsdoMSG035 =
        "JSDO: In '{1}' function, before-image JSON data is missing prods:clientId";
    msg.msgs.jsdoMSG036 = "JSDO: '{1}' can only be called for a dataset";
    msg.msgs.jsdoMSG037 = "{1}: Event name must be provided for {2}.";
    msg.msgs.jsdoMSG038 = "Too few arguments. There must be at least {1}.";
    msg.msgs.jsdoMSG039 = "The name of the event is not a string.";
    msg.msgs.jsdoMSG040 = "The event listener is not a function.";
    msg.msgs.jsdoMSG041 = "The event listener scope is not an object.";
    msg.msgs.jsdoMSG042 = "'{1}' is not a defined event for this object.";
    msg.msgs.jsdoMSG043 =
        "{1}: A session object was requested to check the status of a Mobile Service named '{2}', but it has not loaded the definition of that service.";
    msg.msgs.jsdoMSG044 =
        "JSDO: In '{1}' function, {2} is missing {3} property.";
    msg.msgs.jsdoMSG045 =
        "JSDO: {1} function: {2} is missing {3} property.";
    msg.msgs.jsdoMSG100 =
        "JSDO: Unexpected HTTP response. Too many records.";
    msg.msgs.jsdoMSG101 = "Network error while executing HTTP request.";
    msg.msgs.jsdoMSG110 =
        "Catalog error: idProperty not specified for resource '{1}'. idProperty is required {2}.";
    msg.msgs.jsdoMSG111 =
        "Catalog error: Schema '{1}' was not found in catalog.";
    msg.msgs.jsdoMSG112 =
        "Catalog error: Output parameter '{1}' was not found for operation '{2}'.";
    msg.msgs.jsdoMSG113 =
        "Catalog error: Found xType '{1}' for output parameter '{2}' for operation '{3}' but xType DATASET, TABLE or ARRAY was expected.";
    msg.msgs.jsdoMSG114 =
        "JSDO: idProperty '{1}' is missing from '{2}' record.";
    msg.msgs.jsdoMSG115 = "JSDO: Invalid option specified in {1}() call.";
    msg.msgs.jsdoMSG116 =
        "JSDO: {1} parameter must be a string in {2} call.";
    msg.msgs.jsdoMSG117 =
        "JSDO: Schema from storage area '{1}' does not match JSDO schema";
    msg.msgs.jsdoMSG118 = "JSDO: Plugin '{1}' was not found.";
    msg.msgs.jsdoMSG119 =
        "JSDO: A mappingType is expected when 'capabilities' is set. Please specify a plugin (ex: JFP).";
    msg.msgs.jsdoMSG120 =
        "JSDO: Parameter '{2}' requires capability '{1}' in the catalog.";
    msg.msgs.jsdoMSG121 =
        "{1}: Argument {2} must be of type {3} in {4} call.";
    msg.msgs.jsdoMSG122 =
        "{1}: Incorrect number of arguments in {2} call. There should be {3}.";
    msg.msgs.jsdoMSG123 =
        "{1}: A server response included an invalid '{2}' header.";
    msg.msgs.jsdoMSG124 =
        "JSDO: autoApplyChanges is not supported for saveChanges(true) with a temp-table. Use jsdo.autoApplyChanges = false.";
    msg.msgs.jsdoMSG998 =
        "JSDO: JSON object in addRecords() must be DataSet or Temp-Table data.";
    msg.getMsgText = function(n, args) {
        var text = msg.msgs[n],
            i;
        if (!text) {
            throw new Error(
                "Message text was not found by getMsgText()")
        }
        for (i = 1; i < arguments.length; i += 1) {
            text = text.replace(new RegExp("\\{" + i + "\\}", "g"),
                arguments[i])
        }
        return text
    };
    progress.data._getMsgText = msg.getMsgText;
    progress.data.PluginManager = {};
    progress.data.PluginManager._plugins = {};
    progress.data.PluginManager.addPlugin = function(name, plugin) {
        if (progress.data.PluginManager._plugins[name] === undefined) {
            progress.data.PluginManager._plugins[name] = plugin
        } else {
            throw new Error("A plugin named '" + name +
                "' is already registered.")
        }
    };
    progress.data.PluginManager.getPlugin = function(name) {
        return progress.data.PluginManager._plugins[name]
    };
    progress.data.JSIndexEntry = function JSIndexEntry(index) {
        this.index = index
    };
    progress.data.JSTableRef = function JSTableRef(jsdo, tableName) {
        this._jsdo = jsdo;
        this._name = tableName;
        this._schema = null;
        this._primaryKeys = null;
        this._fields = null;
        this._processed = {};
        this._visited = false;
        this.record = null;
        this._data = [];
        this._index = {};
        this._hasEmptyBlocks = false;
        this._beforeImage = {};
        this._added = [];
        this._changed = {};
        this._deleted = [];
        this._lastErrors = [];
        this._createIndex = function() {
            var i, block, id, idProperty;
            this._index = {};
            this._hasEmptyBlocks = false;
            for (i = 0; i < this._data.length; i += 1) {
                block = this._data[i];
                if (!block) {
                    this._hasEmptyBlocks = true;
                    continue
                }
                id = this._data[i]._id;
                if (!id) {
                    idProperty = this._jsdo._resource.idProperty;
                    if (typeof(idProperty) == "string") {
                        id = this._data[i][idProperty];
                        if (!id) {
                            throw new Error(msg.getMsgText(
                                "jsdoMSG114", idProperty,
                                this._name))
                        }
                        id += ""
                    } else {
                        id = progress.data._getNextId()
                    }
                    this._data[i]._id = id
                }
                this._index[id] = new progress.data.JSIndexEntry(i)
            }
            this._needCompaction = false
        };
        this._compact = function() {
            var newDataArray = [],
                i, block;
            for (i = 0; i < this._data.length; i += 1) {
                block = this._data[i];
                if (block) {
                    newDataArray.push(block)
                }
            }
            this._data = newDataArray;
            this._createIndex()
        };
        this._loadBeforeImageData = function(jsonObject,
            beforeImageJsonIndex, keyFields) {
            var prodsBeforeData = jsonObject[this._jsdo._dataSetName]
                ["prods:before"],
                tmpIndex = {},
                record, record2, recordId, key, tmpKeyIndex, id,
                jsrecord, tmpDataIndex, tmpDeletedIndex, i;
            if (prodsBeforeData && prodsBeforeData[this._name]) {
                if ((Object.keys(this._beforeImage).length !== 0) &&
                    keyFields && (keyFields.length !== 0)) {
                    tmpKeyIndex = {};
                    for (id in this._beforeImage) {
                        jsrecord = this._findById(id, false);
                        if (jsrecord) {
                            key = this._getKey(jsrecord.data,
                                keyFields);
                            tmpKeyIndex[key] = jsrecord.data
                        }
                    }
                }
                for (i = 0; i < prodsBeforeData[this._name].length; i++) {
                    record = prodsBeforeData[this._name][i];
                    tmpIndex[record["prods:id"]] = record;
                    if (record["prods:rowState"] == "deleted") {
                        key = undefined;
                        if (keyFields && (keyFields.length !== 0)) {
                            key = this._getKey(record, keyFields)
                        }
                        if (tmpKeyIndex) {
                            if (tmpKeyIndex[key] !== undefined) {
                                throw new Error(msg.getMsgText(
                                    "jsdoMSG032"))
                            }
                        }
                        if ((tmpDataIndex === undefined) &&
                            keyFields && (keyFields.length !== 0)) {
                            tmpDataIndex = {};
                            tmpDeletedIndex = {};
                            for (var j = 0; j < this._data.length; j++) {
                                record2 = this._data[j];
                                if (!record2) {
                                    continue
                                }
                                var key2 = this._getKey(record2,
                                    keyFields);
                                tmpDataIndex[key2] = record2
                            }
                            for (var j = 0; j < this._deleted.length; j++) {
                                record2 = this._deleted[j].data;
                                if (!record2) {
                                    continue
                                }
                                var key2 = this._getKey(record2,
                                    keyFields);
                                tmpDeletedIndex[key2] = record2
                            }
                        }
                        if (key !== undefined) {
                            record2 = tmpDeletedIndex[key];
                            if (record2 !== undefined) {
                                continue
                            }
                        }
                        if (key !== undefined) {
                            record2 = tmpDataIndex[key];
                            if (record2 !== undefined) {
                                var jsrecord = this._findById(
                                    record2._id, false);
                                if (jsrecord) {
                                    jsrecord._remove(false)
                                }
                                record._id = record2._id
                            }
                        }
                        if (record._id === undefined) {
                            record._id = progress.data._getNextId()
                        }
                        var copy = {};
                        this._jsdo._copyRecord(this._tableRef,
                            record, copy);
                        this._jsdo._deleteProdsProperties(copy);
                        this._beforeImage[record._id] = copy;
                        var jsrecord = new progress.data.JSRecord(
                            this, copy);
                        this._deleted.push(jsrecord)
                    }
                }
            }
            var tableObject = jsonObject[this._jsdo._dataSetName][
                this._name
            ];
            if (tableObject) {
                for (var i = 0; i < jsonObject[this._jsdo._dataSetName]
                    [this._name].length; i++) {
                    record = jsonObject[this._jsdo._dataSetName][
                        this._name
                    ][i];
                    recordId = undefined;
                    if (beforeImageJsonIndex && record["prods:id"]) {
                        recordId = beforeImageJsonIndex[record[
                            "prods:id"]]
                    }
                    switch (record["prods:rowState"]) {
                        case "created":
                            if (recordId === undefined) {
                                recordId = record._id
                            }
                            if (recordId !== undefined) {
                                this._beforeImage[recordId] = null;
                                this._added.push(recordId)
                            }
                            break;
                        case "modified":
                            var beforeRecord = tmpIndex[record[
                                "prods:id"]];
                            if (beforeRecord === undefined) {
                                beforeRecord = {}
                            }
                            if (recordId === undefined) {
                                recordId = record._id
                            }
                            if (recordId !== undefined) {
                                beforeRecord._id = record._id;
                                var copy = {};
                                this._jsdo._copyRecord(this._tableRef,
                                    beforeRecord, copy);
                                this._jsdo._deleteProdsProperties(
                                    copy);
                                this._beforeImage[recordId] = copy;
                                this._changed[recordId] = record;
                                this._beforeImage[beforeRecord._id] =
                                    copy;
                                this._changed[beforeRecord._id] =
                                    record
                            }
                            break;
                        case undefined:
                            break;
                        default:
                            throw new Error(msg.getMsgText(
                                "jsdoMSG030",
                                "rowState value in before-image data",
                                "'created' or 'modified'"))
                    }
                }
            }
            var prodsErrors = jsonObject[this._jsdo._dataSetName][
                "prods:errors"
            ];
            if (prodsErrors) {
                for (var i = 0; i < prodsErrors[this._name].length; i++) {
                    var item = prodsErrors[this._name][i];
                    var recordId = beforeImageJsonIndex[item[
                        "prods:id"]];
                    var jsrecord = this._findById(recordId, false);
                    if (jsrecord) {
                        jsrecord.data._errorString = item[
                            "prods:error"]
                    }
                }
            }
            tmpIndex = null
        };
        this._clearData = function() {
            this._setRecord(null);
            this._data = [];
            this._index = {};
            this._createIndex();
            this._beforeImage = {};
            this._added = [];
            this._changed = {};
            this._deleted = []
        };
        this.hasData = function() {
            var data;
            if (this._jsdo._nestChildren) {
                data = this._getDataWithNestedChildren(this._data)
            } else {
                data = this._getRelatedData()
            }
            if (this._hasEmptyBlocks) {
                for (var i = 0; i < data.length; i++) {
                    var block = data[i];
                    if (!block) {
                        return true
                    }
                }
            }
            return data.length !== 0
        };
        this.getData = function(params) {
            var i, data, numEmptyBlocks, newDataArray, block;
            if (this._needCompaction) {
                this._compact()
            }
            if (params && params.filter) {
                throw new Error(
                    "Not implemented in current version")
            } else {
                if (this._jsdo._nestChildren) {
                    data = this._getDataWithNestedChildren(this._data)
                } else {
                    data = this._getRelatedData()
                }
            }
            if (this._hasEmptyBlocks) {
                numEmptyBlocks = 0;
                newDataArray = [];
                for (i = 0; i < data.length; i += 1) {
                    block = data[i];
                    if (block) {
                        newDataArray.push(block)
                    } else {
                        numEmptyBlocks++
                    }
                }
                if ((numEmptyBlocks * 100 / this._data.length) >=
                    PROGRESS_JSDO_PCT_MAX_EMPTY_BLOCKS) {
                    this._needCompaction = true
                }
                data = newDataArray
            } else {
                if (params && (params.sort || params.top)) {
                    newDataArray = [];
                    for (i = 0; i < data.length; i += 1) {
                        newDataArray.push(data[i])
                    }
                    data = newDataArray
                }
            }
            if (params && (params.sort || params.top)) {
                if (params.sort) {
                    sortFields = [];
                    for (i = 0; i < params.sort.length; i += 1) {
                        field = params.sort[i].field;
                        if (params.sort[i].dir == "desc") {
                            field += ":DESC"
                        }
                        sortFields.push(field)
                    }
                    var sortObject = this._processSortFields(
                        sortFields);
                    if (sortObject.sortFields && sortObject.sortFields
                        .length > 0) {
                        sortObject.tableRef = this;
                        data.sort(this._getCompareFn(sortObject))
                    }
                }
                if (params.top) {
                    if (typeof(params.skip) == "undefined") {
                        params.skip = 0
                    }
                    data = data.splice(params.skip, params.top)
                }
            }
            return data
        };
        this._recToDataObject = function(record, includeChildren) {
            var array = [record];
            var dataObject = array;
            if (typeof(includeChildren) == "undefined") {
                includeChildren = false
            }
            if (this._jsdo._dataSetName) {
                dataObject = {};
                dataObject[this._jsdo._dataSetName] = {};
                dataObject[this._jsdo._dataSetName][this._name] =
                    array;
                if (includeChildren && this._children.length > 0) {
                    var jsrecord = this._findById(record._id, false);
                    if (jsrecord) {
                        for (var i = 0; i < this._children.length; i++) {
                            var tableName = this._children[i];
                            dataObject[this._jsdo._dataSetName][
                                tableName
                            ] = this._jsdo._buffers[tableName]._getRelatedData(
                                jsrecord)
                        }
                    }
                }
            } else {
                if (this._jsdo._dataProperty) {
                    dataObject = {};
                    dataObject[this._jsdo._dataProperty] = array
                }
            }
            return dataObject
        };
        this._recFromDataObject = function(dataObject) {
            var data = {};
            if (dataObject) {
                if (this._jsdo._dataSetName) {
                    if (dataObject[this._jsdo._dataSetName]) {
                        data = dataObject[this._jsdo._dataSetName][
                            this._name
                        ]
                    }
                } else {
                    if (this._jsdo._dataProperty) {
                        if (dataObject[this._jsdo._dataProperty]) {
                            data = dataObject[this._jsdo._dataProperty]
                        }
                    } else {
                        if (dataObject.data) {
                            data = dataObject.data
                        } else {
                            data = dataObject
                        }
                    }
                }
            }
            return data instanceof Array ? data[0] : data
        };
        this.getSchema = function() {
            return this._schema
        };
        this.setSchema = function(schema) {
            this._schema = schema
        };
        this._getABLType = function(fieldName) {
            var i, schema;
            schema = this.getSchema();
            for (i = 0; i < schema.length; i++) {
                if (schema[i].name == fieldName) {
                    return schema[i].ablType
                }
            }
            return undefined
        };
        this._getFormat = function(fieldName) {
            var i, schema;
            schema = this.getSchema();
            for (i = 0; i < schema.length; i++) {
                if (schema[i].name == fieldName) {
                    return schema[i].format
                }
            }
            return undefined
        };
        this.add = function(values) {
            return this._add(values, true, true)
        };
        this.create = this.add;
        this._add = function(values, trackChanges, setWorkingRecord) {
            if (typeof(trackChanges) == "undefined") {
                trackChanges = true
            }
            if (typeof(setWorkingRecord) == "undefined") {
                setWorkingRecord = true
            }
            var record = {};
            var schema = this.getSchema();
            for (var i = 0; i < schema.length; i++) {
                var fieldName = schema[i].name;
                if (schema[i].type == "array") {
                    record[fieldName] = [];
                    if (schema[i].maxItems) {
                        for (var j = 0; j < schema[i].maxItems; j++) {
                            record[fieldName][j] = schema[i][
                                "default"
                            ]
                        }
                    }
                } else {
                    record[fieldName] = this._jsdo._getDefaultValue(
                        schema[i])
                }
            }
            if (this._jsdo.useRelationships && this._relationship &&
                this._parent) {
                if (this._jsdo._buffers[this._parent].record) {
                    for (var j = 0; j < this._relationship.length; j++) {
                        record[this._relationship[j].childFieldName] =
                            this._jsdo._buffers[this._parent].record
                            .data[this._relationship[j].parentFieldName]
                    }
                } else {
                    throw new Error(msg.getMsgText("jsdoMSG002",
                        this._parent))
                }
            }
            for (var v in values) {
                record[v] = values[v]
            }
            var id;
            var idProperty;
            if ((idProperty = this._jsdo._resource.idProperty) !==
                undefined) {
                id = record[idProperty]
            }
            if (!id) {
                id = progress.data._getNextId()
            } else {
                id += ""
            }
            record._id = id;
            if (this.autoSort && this._sortRecords && (this._sortFn !==
                    undefined || this._sortObject.sortFields !==
                    undefined)) {
                if (this._needsAutoSorting) {
                    this._data.push(record);
                    this._sort()
                } else {
                    for (var i = 0; i < this._data.length; i++) {
                        if (this._data[i] === null) {
                            continue
                        }
                        var ret = this._sortFn ? this._sortFn(
                            record, this._data[i]) : this._compareFields(
                            record, this._data[i]);
                        if (ret == -1) {
                            break
                        }
                    }
                    this._data.splice(i, 0, record)
                }
                this._createIndex()
            } else {
                this._data.push(record);
                this._index[record._id] = new progress.data.JSIndexEntry(
                    this._data.length - 1)
            }
            var jsrecord = new progress.data.JSRecord(this, record);
            if (setWorkingRecord) {
                this._setRecord(jsrecord, true)
            }
            if (trackChanges) {
                this._beforeImage[record._id] = null;
                this._added.push(record._id)
            }
            return jsrecord
        };
        this._getRelatedData = function(jsrecord) {
            var data = [];
            if (this._data.length === 0) {
                return data
            }
            if (typeof(jsrecord) == "undefined") {
                if (this._jsdo.useRelationships && this._relationship &&
                    this._parent) {
                    jsrecord = this._jsdo._buffers[this._parent].record;
                    if (!jsrecord) {
                        throw new Error(msg.getMsgText("jsdoMSG002",
                            this._parent))
                    }
                }
            }
            if (jsrecord) {
                for (var i = 0; i < this._data.length; i++) {
                    var block = this._data[i];
                    if (!block) {
                        continue
                    }
                    var match = false;
                    for (var j = 0; j < this._relationship.length; j++) {
                        match = (jsrecord.data[this._relationship[j]
                            .parentFieldName] == this._data[
                            i][this._relationship[j].childFieldName]);
                        if (!match) {
                            break
                        }
                    }
                    if (match) {
                        data.push(this._data[i])
                    }
                }
            } else {
                data = this._data
            }
            return data
        };
        this._getDataWithNestedChildren = function(data) {
            for (var i = 0; i < data.length; i++) {
                var parentRecord = data[i];
                if (this._children && this._children.length > 0) {
                    for (var j = 0; j < this._children.length; j++) {
                        var childBuf = this._jsdo._buffers[this._children[
                            j]];
                        if (childBuf._isNested) {
                            for (var k = 0; k < childBuf._data.length; k++) {
                                var childRecord = childBuf._data[k];
                                if (!childRecord) {
                                    continue
                                }
                                var match = false;
                                for (var m = 0; m < childBuf._relationship
                                    .length; m++) {
                                    match = (parentRecord[childBuf._relationship[
                                            m].parentFieldName] ==
                                        childRecord[childBuf._relationship[
                                            m].childFieldName]);
                                    if (!match) {
                                        break
                                    }
                                }
                                if (match) {
                                    if (!parentRecord[childBuf._name]) {
                                        parentRecord[childBuf._name] = []
                                    }
                                    parentRecord[childBuf._name].push(
                                        childRecord)
                                }
                            }
                            if (childBuf._hasNestedChild()) {
                                childBuf._getDataWithNestedChildren(
                                    parentRecord[childBuf._name]
                                )
                            }
                        }
                    }
                }
            }
            return data
        };
        this._findFirst = function() {
            if (this._jsdo.useRelationships && this._relationship &&
                this._parent) {
                if (this._jsdo._buffers[this._parent].record) {
                    for (var i = 0; i < this._data.length; i++) {
                        var block = this._data[i];
                        if (!block) {
                            continue
                        }
                        var match = false;
                        var parentFieldName, childFieldName;
                        for (var j = 0; j < this._relationship.length; j++) {
                            parentFieldName = this._relationship[j]
                                .parentFieldName;
                            childFieldName = this._relationship[j].childFieldName;
                            match = (this._jsdo._buffers[this._parent]
                                .record.data[parentFieldName] ==
                                this._data[i][childFieldName]);
                            if (!match) {
                                break
                            }
                        }
                        if (match) {
                            return new progress.data.JSRecord(this,
                                this._data[i])
                        }
                    }
                }
            } else {
                for (var i = 0; i < this._data.length; i++) {
                    var block = this._data[i];
                    if (!block) {
                        continue
                    }
                    return new progress.data.JSRecord(this, this._data[
                        i])
                }
            }
            return undefined
        };
        this._setRecord = function(jsrecord, ignoreRelationships) {
            if (jsrecord) {
                this.record = jsrecord
            } else {
                this.record = undefined
            }
            if (this._jsdo.useRelationships) {
                ignoreRelationships = ((typeof(ignoreRelationships) ==
                    "boolean") && ignoreRelationships);
                if (this._children && this._children.length > 0) {
                    for (var i = 0; i < this._children.length; i++) {
                        var childTable = this._jsdo._buffers[this._children[
                            i]];
                        if (!ignoreRelationships && this.record &&
                            childTable._relationship) {
                            childTable._setRecord(childTable._findFirst())
                        } else {
                            childTable._setRecord(undefined,
                                ignoreRelationships)
                        }
                    }
                }
            }
            if (this._jsdo._defaultTableRef) {
                this._jsdo.record = this.record
            }
        };
        this.assign = function(values) {
            if (this.record) {
                return this.record.assign(values)
            } else {
                throw new Error(msg.getMsgText("jsdoMSG002", this._name))
            }
        };
        this.update = this.assign;
        this.remove = function() {
            if (this.record) {
                return this.record._remove(true)
            } else {
                throw new Error(msg.getMsgText("jsdoMSG002", this._name))
            }
        };
        this._remove = function(bTrackChanges) {
            if (this.record) {
                return this.record._remove(bTrackChanges)
            } else {
                throw new Error(msg.getMsgText("jsdoMSG002", this._name))
            }
        };
        this.getId = function() {
            if (this.record) {
                return this.record.data._id
            } else {
                return 0
            }
        };
        this.getErrors = function() {
            return this._lastErrors
        };
        this.getErrorString = function() {
            if (this.record) {
                return this.record.data._errorString
            } else {
                return 0
            }
        };
        this.findById = function(id) {
            return this._findById(id, true)
        };
        this._findById = function(id, setWorkingRecord) {
            if (typeof(setWorkingRecord) == "undefined") {
                setWorkingRecord = true
            }
            if (id && this._index[id]) {
                var record = this._data[this._index[id].index];
                this.record = record ? (new progress.data.JSRecord(
                    this, record)) : null;
                if (setWorkingRecord) {
                    this._setRecord(this.record)
                }
                return this.record
            }
            if (setWorkingRecord) {
                this._setRecord(null)
            }
            return null
        };
        this.find = function(fn) {
            if (typeof(fn) != "function") {
                throw new Error(msg.getMsgText("jsdoMSG003",
                    "find()"))
            }
            var data = this._getRelatedData();
            for (var i = 0; i < data.length; i++) {
                var block = data[i];
                if (!block) {
                    continue
                }
                this._setRecord(new progress.data.JSRecord(this,
                    data[i]));
                var result = fn(this.record);
                if (typeof(result) != "boolean") {
                    throw new Error(msg.getMsgText("jsdoMSG007",
                        "find()"))
                }
                if (result) {
                    return this.record
                }
            }
            this._setRecord(null);
            return null
        };
        this.foreach = function(fn) {
            if (typeof(fn) != "function") {
                throw new Error(msg.getMsgText("jsdoMSG003",
                    "foreach()"))
            }
            var numEmptyBlocks = 0;
            if (this._needCompaction) {
                this._compact()
            }
            var data = this._getRelatedData();
            this._inforeach = true;
            for (var i = 0; i < data.length; i++) {
                var block = data[i];
                if (!block) {
                    numEmptyBlocks++;
                    continue
                }
                this._setRecord(new progress.data.JSRecord(this,
                    data[i]));
                var result = fn(this.record);
                if ((typeof(result) != "undefined") && !result) {
                    break
                }
            }
            this._inforeach = false;
            if ((numEmptyBlocks * 100 / this._data.length) >=
                PROGRESS_JSDO_PCT_MAX_EMPTY_BLOCKS) {
                this._needCompaction = true
            }
        };
        this._equalRecord = function(rec1, rec2, keyFields) {
            var field;
            var match = true;
            for (var i = 0; i < keyFields.length; i++) {
                var fieldName = keyFields[i];
                var value1 = rec1[fieldName];
                var value2 = rec2[fieldName];
                if (!jsdo[tableName].caseSensitive) {
                    field = jsdo[tableName]._fields[fieldName.toLowerCase()];
                    if (field && field.type == "string") {
                        if (value1 !== undefined && value1 !== null) {
                            value1 = value1.toUpperCase()
                        }
                        if (value2 !== undefined && value2 !== null) {
                            value2 = value2.toUpperCase()
                        }
                    }
                }
                match = (value1 == value2);
                if (!match) {
                    return false
                }
            }
            return true
        };
        this._getKey = function(record, keyFields) {
            var keyObject = {};
            for (var i = 0; i < keyFields.length; i++) {
                var fieldName = keyFields[i];
                var value = record[fieldName];
                if (!jsdo[tableName].caseSensitive) {
                    field = jsdo[tableName]._fields[fieldName.toLowerCase()];
                    if (field && field.type == "string") {
                        if (value !== undefined && value !== null) {
                            value = value.toUpperCase()
                        }
                    }
                }
                keyObject[fieldName] = value
            }
            return JSON.stringify(keyObject)
        };
        this._getCompareFn = function(sortObject) {
            if (typeof sortObject == "function") {
                return function(rec1, rec2) {
                    if (rec1 === null) {
                        return 1
                    }
                    if (rec2 === null) {
                        return -1
                    }
                    var jsrec1 = new progress.data.JSRecord(
                        this, rec1);
                    var jsrec2 = new progress.data.JSRecord(
                        this, rec2);
                    return sortObject(jsrec1, jsrec2)
                }
            } else {
                return function(rec1, rec2) {
                    var tableRef = sortObject.tableRef;
                    var sortFields = sortObject.sortFields;
                    if (!(sortFields instanceof Array)) {
                        return 0
                    }
                    var sortAscending = sortObject.sortAscending;
                    if (rec1 === null) {
                        return 1
                    }
                    if (rec2 === null) {
                        return -1
                    }
                    var field;
                    for (var i = 0; i < sortFields.length; i++) {
                        var fieldName = sortFields[i];
                        var value1 = rec1[fieldName];
                        var value2 = rec2[fieldName];
                        if (!tableRef.caseSensitive) {
                            field = tableRef._fields[fieldName.toLowerCase()];
                            if (field && field.type == "string") {
                                if (value1 !== undefined &&
                                    value1 !== null) {
                                    value1 = value1.toUpperCase()
                                }
                                if (value2 !== undefined &&
                                    value2 !== null) {
                                    value2 = value2.toUpperCase()
                                }
                            }
                        }
                        if (value1 > value2 || (value1 ===
                                undefined || value1 === null)) {
                            return sortAscending[i] ? 1 : -1
                        } else {
                            if (value1 < value2 || (value2 ===
                                    undefined && value2 ===
                                    null)) {
                                return sortAscending[i] ? -1 :
                                    1
                            }
                        }
                    }
                    return 0
                }
            }
        };
        this._sortObject = {};
        this._sortObject.tableRef = this;
        this._sortObject.sortFields = undefined;
        this._sortObject.sortAscending = undefined;
        this._compareFields = this._getCompareFn(this._sortObject);
        this._sortRecords = true;
        this._needsAutoSorting = false;
        this._sortFn = undefined;
        if ((typeof Object.defineProperty) == "function") {
            this._autoSort = true;
            Object.defineProperty(this, "autoSort", {
                get: function() {
                    return this._autoSort
                },
                set: function(value) {
                    if (value) {
                        this._autoSort = true;
                        if (this._sortFn || this._sortObject
                            .sortFields) {
                            this._sort();
                            this._createIndex()
                        }
                    } else {
                        this._autoSort = false
                    }
                },
                enumerable: true,
                writeable: true
            });
            this._caseSensitive = false;
            Object.defineProperty(this, "caseSensitive", {
                get: function() {
                    return this._caseSensitive
                },
                set: function(value) {
                    if (value) {
                        this._caseSensitive = true
                    } else {
                        this._caseSensitive = false
                    }
                    if (this.autoSort && (this._sortObject.sortFields &&
                            !this._sortFn)) {
                        this._sort();
                        this._createIndex()
                    }
                },
                enumerable: true,
                writeable: true
            })
        } else {
            this.autoSort = true;
            this.caseSensitive = false
        }
        this._processSortFields = function(sortFields) {
            var sortObject = {};
            if (sortFields instanceof Array) {
                sortObject.sortFields = sortFields;
                sortObject.sortAscending = [];
                sortObject.fields = {};
                for (var i = 0; i < sortObject.sortFields.length; i++) {
                    var idx;
                    var fieldName;
                    var field;
                    if (typeof(sortObject.sortFields[i]) !=
                        "string") {
                        throw new Error(msg.getMsgText("jsdoMSG030",
                            "sort field name",
                            "string element"))
                    }
                    if ((idx = sortObject.sortFields[i].indexOf(":")) !=
                        -1) {
                        fieldName = sortObject.sortFields[i].substring(
                            0, idx);
                        var sortOrder = sortObject.sortFields[i].substring(
                            idx + 1);
                        switch (sortOrder.toUpperCase()) {
                            case "ASCENDING":
                            case "ASC":
                                sortObject.sortAscending[i] = true;
                                break;
                            case "DESCENDING":
                            case "DESC":
                                sortObject.sortAscending[i] = false;
                                break;
                            default:
                                throw new Error(msg.getMsgText(
                                    "jsdoMSG030",
                                    "sort order '" +
                                    sortObject.sortFields[i]
                                    .substring(idx + 1) +
                                    "'",
                                    "ASCENDING or DESCENDING"
                                ))
                        }
                    } else {
                        fieldName = sortObject.sortFields[i];
                        sortObject.sortAscending[i] = true
                    }
                    if (fieldName != "_id" && this._fields) {
                        field = this._fields[fieldName.toLowerCase()];
                        if (field) {
                            if (field.type == "array") {
                                throw new Error(msg.getMsgText(
                                    "jsdoMSG030",
                                    "data type found in sort",
                                    "scalar field"))
                            }
                            fieldName = field.name
                        } else {
                            throw new Error(msg.getMsgText(
                                "jsdoMSG031", fieldName))
                        }
                    }
                    sortObject.sortFields[i] = fieldName;
                    sortObject.fields[fieldName] = fieldName
                }
            } else {
                sortObject.sortFields = undefined;
                sortObject.sortAscending = undefined;
                sortObject.fields = undefined
            }
            return sortObject
        };
        this.setSortFields = function(sortFields) {
            if (sortFields === undefined || sortFields === null) {
                this._sortObject.sortFields = undefined;
                this._sortObject.sortAscending = undefined
            } else {
                if (sortFields instanceof Array) {
                    var sortObject = this._processSortFields(
                        sortFields);
                    this._sortObject.sortFields = sortObject.sortFields;
                    this._sortObject.sortAscending = sortObject.sortAscending;
                    this._sortObject.fields = sortObject.fields;
                    if (this.autoSort) {
                        this._sort();
                        this._createIndex()
                    }
                } else {
                    throw new Error(msg.getMsgText("jsdoMSG024",
                        "JSDO", "setSortFields()"))
                }
            }
        };
        this.setSortFn = function(fn) {
            if (fn && typeof(fn) != "function") {
                throw new Error(msg.getMsgText("jsdoMSG030",
                    "parameter in setSortFn()",
                    "function parameter"))
            }
            this._sortFn = fn ? this._getCompareFn(fn) : undefined;
            if (this.autoSort) {
                this._sort();
                this._createIndex()
            }
        };
        this.sort = function(arg1) {
            if (arg1 === undefined || arg1 === null) {
                throw new Error(msg.getMsgText("jsdoMSG025", "JSDO",
                    "sort()"))
            }
            if (arguments.length !== 1 || (!(arg1 instanceof Array) &&
                    typeof(arg1) != "function")) {
                throw new Error(msg.getMsgText("jsdoMSG024", "JSDO",
                    "sort()"))
            }
            if (arg1 instanceof Array) {
                var sortObject = this._processSortFields(arg1);
                if (sortObject.sortFields && sortObject.sortFields.length >
                    0) {
                    this._sort(sortObject)
                }
            } else {
                this._sort(arg1)
            }
            this._createIndex()
        };
        this._sort = function(arg1) {
            if (arguments.length === 0 && (!this.autoSort || (this._sortFn ===
                    undefined && this._sortObject.sortFields ===
                    undefined))) {
                return
            }
            if (arguments.length === 0) {
                if (this._sortFn) {
                    this._data.sort(this._sortFn)
                } else {
                    this._data.sort(this._compareFields)
                }
                this._needsAutoSorting = false
            } else {
                if (typeof(arg1) == "function") {
                    this._data.sort(this._getCompareFn(arg1))
                } else {
                    arg1.tableRef = this;
                    this._data.sort(this._getCompareFn(arg1))
                }
                if (this.autoSort) {
                    this._needsAutoSorting = true
                }
            }
        };
        this.addRecords = function(jsonObject, addMode, keyFields,
            trackChanges, isInvoke) {
            this._jsdo._addRecords(this._name, jsonObject, addMode,
                keyFields, trackChanges, isInvoke)
        };
        this.acceptChanges = function() {
            var tableRef = this;
            for (var id in tableRef._beforeImage) {
                if (tableRef._beforeImage[id] === null) {
                    var jsrecord = tableRef._findById(id, false);
                    if (jsrecord !== null) {
                        tableRef._jsdo._deleteProdsProperties(
                            jsrecord.data, true)
                    }
                } else {
                    if (this._changed[id] !== undefined) {
                        var jsrecord = this._findById(id, false);
                        if (jsrecord !== null) {
                            tableRef._jsdo._deleteProdsProperties(
                                jsrecord.data, true)
                        }
                    }
                }
            }
            tableRef._processed = {};
            tableRef._added = [];
            tableRef._changed = {};
            tableRef._deleted = [];
            tableRef._beforeImage = {}
        };
        this.rejectChanges = function() {
            for (var id in this._beforeImage) {
                if (this._beforeImage[id] === null) {
                    this._jsdo._undoCreate(this, id)
                } else {
                    if (this._changed[id] !== undefined) {
                        this._jsdo._undoUpdate(this, id, true)
                    } else {
                        this._jsdo._undoDelete(this, id, true)
                    }
                }
            }
            var tableRef = this;
            tableRef._processed = {};
            tableRef._added = [];
            tableRef._changed = {};
            tableRef._deleted = []
        };
        this.hasChanges = function() {
            return (Object.keys(this._beforeImage).length !== 0)
        };
        this.getChanges = function() {
            var result = [];
            for (var id in this._beforeImage) {
                var item = {
                    rowState: "",
                    record: null
                };
                if (this._beforeImage[id] === null) {
                    item.rowState = PROGRESS_JSDO_ROW_STATE_STRING[
                        progress.data.JSDO._OP_CREATE];
                    item.record = this._findById(id, false)
                } else {
                    if (this._changed[id] !== undefined) {
                        item.rowState =
                            PROGRESS_JSDO_ROW_STATE_STRING[progress
                                .data.JSDO._OP_UPDATE];
                        item.record = this._findById(id, false)
                    } else {
                        item.rowState =
                            PROGRESS_JSDO_ROW_STATE_STRING[progress
                                .data.JSDO._OP_DELETE];
                        item.record = new progress.data.JSRecord(
                            this, this._beforeImage[id])
                    }
                }
                result.push(item)
            }
            return result
        };
        this._applyChanges = function() {
            for (var id in this._beforeImage) {
                if (this._beforeImage[id] === null) {
                    var jsrecord = this._findById(id, false);
                    if (jsrecord !== null) {
                        if (jsrecord.data._errorString !==
                            undefined) {
                            this._jsdo._undoCreate(this, id)
                        } else {
                            jsrecord.acceptRowChanges()
                        }
                    } else {
                        var found = false;
                        for (var i = 0; i < this._deleted.length; i++) {
                            found = (this._deleted[i].data._id ==
                                id);
                            if (found) {
                                break
                            }
                        }
                        if (!found) {
                            throw new Error(msg.getMsgText(
                                "jsdoMSG000",
                                "Created record appears to be deleted without a delete operation."
                            ))
                        }
                    }
                } else {
                    if (this._changed[id] !== undefined) {
                        var jsrecord = this._findById(id, false);
                        if (jsrecord !== null) {
                            if (jsrecord.data._errorString !==
                                undefined) {
                                this._jsdo._undoUpdate(this, id)
                            } else {
                                jsrecord.acceptRowChanges()
                            }
                        } else {
                            if (this._beforeImage[id]._errorString !==
                                undefined) {
                                this._jsdo._undoDelete(this, id)
                            } else {
                                var found = false;
                                for (var i = 0; i < this._deleted.length; i++) {
                                    found = (this._deleted[i].data._id ==
                                        id);
                                    if (found) {
                                        break
                                    }
                                }
                                if (!found) {
                                    throw new Error(msg.getMsgText(
                                        "jsdoMSG000",
                                        "Updated record appears to be deleted without a delete operation."
                                    ))
                                }
                            }
                        }
                    } else {
                        if (this._beforeImage[id]._errorString !==
                            undefined) {
                            this._jsdo._undoDelete(this, id)
                        }
                    }
                }
            }
            var tableRef = this;
            tableRef._processed = {};
            tableRef._added = [];
            tableRef._changed = {};
            tableRef._deleted = [];
            tableRef._beforeImage = {}
        };
        this.acceptRowChanges = function() {
            if (this.record) {
                return this.record.acceptRowChanges()
            }
            throw new Error(msg.getMsgText("jsdoMSG002", this._name))
        };
        this.rejectRowChanges = function() {
            if (this.record) {
                return this.record.rejectRowChanges()
            }
            throw new Error(msg.getMsgText("jsdoMSG002", this._name))
        };
        this._hasNestedChild = function() {
            var hasNestedChild = false;
            var childBufObj;
            if (this._children.length > 0) {
                for (var i = 0; i < this._children.length; i++) {
                    childBufObj = this._jsdo._buffers[this._children[
                        i]];
                    if (childBufObj._isNested) {
                        hasNestedChild = true;
                        break
                    }
                }
            }
            return hasNestedChild
        }
    };
    progress.data.JSRecord = function JSRecord(tableRef, record) {
        this._tableRef = tableRef;
        this.data = record;
        this.getId = function() {
            return this.data._id ? this.data._id : null
        };
        this.getErrorString = function() {
            return this.data._errorString
        };
        this._saveBeforeImageUpdate = function() {
            if (this._tableRef._beforeImage[this.data._id] ===
                undefined) {
                var copy = {};
                this._tableRef._jsdo._copyRecord(this._tableRef,
                    this.data, copy);
                this._tableRef._beforeImage[this.data._id] = copy
            }
            if (this._tableRef._changed[this.data._id] ===
                undefined) {
                this._tableRef._changed[this.data._id] = this.data
            }
        };
        this._sortRecord = function(fields) {
            var index = this._tableRef._index[this.data._id].index;
            var record = this._tableRef._data[index];
            if (this._tableRef.autoSort && this._tableRef._sortRecords &&
                (this._tableRef._sortFn !== undefined || this._tableRef
                    ._sortObject.sortFields !== undefined)) {
                if (this._tableRef._sortObject.fields) {
                    if (typeof fields == "string") {
                        if (this._tableRef._sortObject.fields[
                                fields] === undefined) {
                            return
                        }
                    } else {
                        if (fields instanceof Array) {
                            var found = false;
                            for (var i = 0; i < fields.length; i++) {
                                if (this._tableRef._sortObject.fields[
                                        fields[i]] !== undefined) {
                                    found = true;
                                    break
                                }
                            }
                            if (!found) {
                                return
                            }
                        }
                    }
                }
                if (this._tableRef._needsAutoSorting) {
                    this._tableRef._sort();
                    this._tableRef._createIndex()
                } else {
                    for (var i = 0; i < this._tableRef._data.length; i++) {
                        if (this._tableRef._data[i] === null) {
                            continue
                        }
                        if (i == index) {
                            continue
                        }
                        var ret = this._tableRef._sortFn ? this._tableRef
                            ._sortFn(record, this._tableRef._data[i]) :
                            this._tableRef._compareFields(record,
                                this._tableRef._data[i]);
                        if (ret == -1) {
                            break
                        }
                    }
                    if (i > index) {
                        i--
                    }
                    if (i != index) {
                        this._tableRef._data.splice(index, 1);
                        this._tableRef._data.splice(i, 0, record);
                        this._tableRef._createIndex()
                    }
                }
            }
        };
        this.assign = function(record) {
            if (record === undefined) {
                throw new Error(msg.getMsgText("jsdoMSG024", "JSDO",
                    "assign() or update()"))
            }
            this._saveBeforeImageUpdate();
            var fieldName;
            var value;
            var schema = this._tableRef.getSchema();
            if (record) {
                for (var i = 0; i < schema.length; i++) {
                    fieldName = schema[i].name;
                    value = record[fieldName];
                    if (typeof value != "undefined") {
                        if (typeof value == "string" && schema[i].type !=
                            "string") {
                            value = this._tableRef._jsdo._convertType(
                                value, schema[i].type, schema[i]
                                .items ? schema[i].items.type :
                                null)
                        }
                        this.data[fieldName] = value
                    }
                }
                this._sortRecord()
            }
            return true
        };
        this.update = this.assign;
        this.remove = function() {
            return this._remove(true)
        };
        this._remove = function(bTrackChanges) {
            if (typeof(bTrackChanges) == "undefined") {
                bTrackChanges = true
            }
            var index = this._tableRef._index[this.data._id].index;
            var jsrecord = this._tableRef._findById(this.data._id,
                false);
            if (bTrackChanges) {
                var record = this._tableRef._beforeImage[this.data._id];
                if (record === undefined) {
                    this.data._index = index;
                    this._tableRef._beforeImage[this.data._id] =
                        this.data
                } else {
                    if (record) {
                        record._index = index
                    }
                }
                this._tableRef._deleted.push(jsrecord)
            }
            this._tableRef._data[index] = null;
            this._tableRef._hasEmptyBlocks = true;
            delete this._tableRef._index[this.data._id];
            this._tableRef._setRecord(null);
            return true
        };
        this.acceptRowChanges = function() {
            var id = this.data._id;
            if (this._tableRef._beforeImage[id] !== undefined) {
                if (this._tableRef._beforeImage[id] === null) {
                    for (var i = 0; i < this._tableRef._added.length; i++) {
                        if (this._tableRef._added[i] == id) {
                            this._tableRef._added.splice(i, 1);
                            break
                        }
                    }
                    this._tableRef._jsdo._deleteProdsProperties(
                        this.data, true)
                } else {
                    if (this._tableRef._changed[id] !== undefined) {
                        delete this._tableRef._changed[id];
                        this._tableRef._jsdo._deleteProdsProperties(
                            this.data, true)
                    } else {
                        for (var i = 0; i < this._tableRef._deleted
                            .length; i++) {
                            if (this._tableRef._deleted[i].data._id ==
                                id) {
                                this._tableRef._deleted.splice(i, 1);
                                break
                            }
                        }
                    }
                }
                delete tableRef._beforeImage[id]
            }
        };
        this.rejectRowChanges = function() {
            var id = this.data._id;
            if (this._tableRef._beforeImage[id] !== undefined) {
                if (this._tableRef._beforeImage[id] === null) {
                    this._tableRef._jsdo._undoCreate(this._tableRef,
                        id);
                    for (var i = 0; i < this._tableRef._added.length; i++) {
                        if (this._tableRef._added[i] == id) {
                            this._tableRef._added.splice(i, 1);
                            break
                        }
                    }
                } else {
                    if (this._tableRef._changed[id] !== undefined) {
                        this._tableRef._jsdo._undoUpdate(this._tableRef,
                            id, true);
                        delete this._tableRef._changed[id]
                    } else {
                        this._tableRef._jsdo._undoDelete(this._tableRef,
                            id, true);
                        for (var i = 0; i < this._tableRef._deleted
                            .length; i++) {
                            if (this._tableRef._deleted[i].data._id ==
                                id) {
                                this._tableRef._deleted.splice(i, 1);
                                break
                            }
                        }
                    }
                }
                delete tableRef._beforeImage[id]
            }
        }
    };
    progress.data.JSDO = function JSDO(resNameOrParmObj, serviceName) {
        var _super = {};
        if (typeof progress.data.Session == "undefined") {
            throw new Error(
                "ERROR: You must include progress.session.js")
        }
        _super.subscribe = this.subscribe;
        this.subscribe = function(evt) {
            var args = Array.prototype.slice.call(arguments);
            if (typeof evt === "string") {
                switch (evt.toLowerCase()) {
                    case "beforeread":
                        args[0] = "beforefill";
                        break;
                    case "afterread":
                        args[0] = "afterfill";
                        break
                }
            }
            _super.subscribe.apply(this, args)
        };
        this._defineProperty = function(tableName, fieldName) {
            Object.defineProperty(this._buffers[tableName],
                fieldName, {
                    get: function fnGet() {
                        if (this.record) {
                            return this.record.data[
                                fieldName]
                        } else {
                            return null
                        }
                    },
                    set: function(value) {
                        if (this.record) {
                            this.record._saveBeforeImageUpdate();
                            this.record.data[fieldName] =
                                value;
                            this.record._sortRecord(
                                fieldName)
                        }
                    },
                    enumerable: true,
                    writeable: true
                })
        };
        this._buffers = {};
        this._numBuffers = 0;
        this._defaultTableRef = null;
        this._async = true;
        this._dataProperty = null;
        this._dataSetName = null;
        this.operations = [];
        this.useRelationships = true;
        this._session = null;
        this._needCompaction = false;
        this._hasCUDOperations = false;
        this._hasSubmitOperation = false;
        this._useSubmit = false;
        this.autoApplyChanges = true;
        this._lastErrors = [];
        this._localStorage = null;
        var autoFill = false;
        if (!arguments[0]) {
            throw new Error(
                "JSDO: Parameters are required in constructor.")
        }
        if (typeof(arguments[0]) == "string") {
            this.name = arguments[0]
        } else {
            if (typeof(arguments[0]) == "object") {
                var args = arguments[0];
                for (var v in args) {
                    switch (v) {
                        case "autoFill":
                            autoFill = args[v];
                            break;
                        case "events":
                            this._events = {};
                            for (var eventName in args[v]) {
                                this._events[eventName.toLowerCase()] =
                                    args[v][eventName]
                            }
                            break;
                        case "dataProperty":
                            this._dataProperty = args[v];
                            break;
                        default:
                            this[v] = args[v]
                    }
                }
            }
        }
        if ((!this.name)) {
            throw new Error(
                "JSDO: JSDO constructor is missing the value for 'name'"
            )
        }
        if (this._events) {
            if ((typeof this._events) !== "object") {
                throw new Error(
                    "JSDO: JSDO constructor event object is not defined as an object"
                )
            }
            for (var prop in this._events) {
                var evt = this._events[prop];
                if (!(evt instanceof Array)) {
                    throw new Error(
                        "JSDO: JSDO constructor event object for " +
                        prop + " must be an array")
                }
                evt.forEach(function(el) {
                    if ((typeof el) !== "object") {
                        throw new Error(
                            "JSDO: JSDO constuctor event object for " +
                            prop +
                            " is not defined as an object")
                    }
                    if ((typeof el.fn) !== "function") {
                        throw new Error(
                            "JSDO: JSDO event listener for " +
                            prop + " is not a function.")
                    }
                    if (el.scope && (typeof el.scope) !==
                        "object") {
                        throw new Error(
                            "JSDO: JSDO event listener scope for " +
                            prop + " is not an object.")
                    }
                })
            }
        }
        if (this.name) {
            this._resource = progress.data.ServicesManager.getResource(
                this.name);
            if (this._resource) {
                if (!this.url) {
                    this.url = this._resource.url
                }
                if (!this._dataSetName && this._resource._dataSetName) {
                    this._dataSetName = this._resource._dataSetName;
                    if (this._resource.dataProperty) {
                        var buffer = this[this._resource.dataProperty] =
                            new progress.data.JSTableRef(this, this._resource
                                .dataProperty);
                        this._buffers[this._resource.dataProperty] =
                            buffer
                    } else {
                        for (var tableName in this._resource.fields) {
                            var buffer = this[tableName] = new progress
                                .data.JSTableRef(this, tableName);
                            this._buffers[tableName] = buffer
                        }
                    }
                }
                if (!this._dataProperty && this._resource.dataProperty) {
                    this._dataProperty = this._resource.dataProperty
                }
                if (!this._dataSetName) {
                    var tableName = this._dataProperty ? this._dataProperty :
                        "";
                    this._buffers[tableName] = new progress.data.JSTableRef(
                        this, tableName);
                    if (tableName) {
                        this[tableName] = this._buffers[tableName]
                    }
                }
                for (var fnName in this._resource.fn) {
                    this[fnName] = this._resource.fn[fnName]["function"]
                }
                this._hasCUDOperations = this._resource.generic.create !==
                    undefined || this._resource.generic.update !==
                    undefined || this._resource.generic["delete"] !==
                    undefined;
                this._hasSubmitOperation = this._resource.generic.submit !==
                    undefined;
                if (!this._session) {
                    var myservice = progress.data.ServicesManager.getService(
                        this._resource.service.name);
                    this._session = myservice._session;
                    this._session._pushJSDOs(this)
                }
            } else {
                throw new Error(msg.getMsgText("jsdoMSG004", this.name))
            }
        } else {
            this._buffers[""] = new progress.data.JSTableRef(this, "")
        }
        if (!this._session) {
            throw new Error(
                "JSDO: Unable to get user session for resource '" +
                this.name + "'")
        }
        for (var buf in this._buffers) {
            this._buffers[buf]._parent = null;
            this._buffers[buf]._children = [];
            this._buffers[buf]._relationship = null;
            this._buffers[buf]._isNested = false;
            if (!this._defaultTableRef) {
                this._defaultTableRef = this._buffers[buf]
            }
            this._numBuffers++
        }
        if (this._numBuffers != 1) {
            this._defaultTableRef = null
        } else {
            this.record = null
        }
        if ((typeof Object.defineProperty) == "function") {
            this._caseSensitive = false;
            Object.defineProperty(this, "caseSensitive", {
                get: function() {
                    return this._caseSensitive
                },
                set: function(value) {
                    this._caseSensitive = value ? true :
                        false;
                    for (var buf in this._buffers) {
                        this._buffers[buf].caseSensitive =
                            this._caseSensitive
                    }
                },
                enumerable: true,
                writeable: true
            });
            this._autoSort = true;
            Object.defineProperty(this, "autoSort", {
                get: function() {
                    return this._autoSort
                },
                set: function(value) {
                    this._autoSort = value ? true : false;
                    for (var buf in this._buffers) {
                        this._buffers[buf].autoSort = this._autoSort
                    }
                },
                enumerable: true,
                writeable: true
            })
        }
        if (this._resource && this._resource.fields) {
            for (var buf in this._buffers) {
                this._buffers[buf]._schema = this._resource.fields[buf];
                this._buffers[buf]._primaryKeys = this._resource.primaryKeys[
                    buf];
                if (this._buffers[buf]._schema && (typeof Object.defineProperty) ==
                    "function") {
                    for (var i = 0; i < this._buffers[buf]._schema.length; i++) {
                        var fieldName = this._buffers[buf]._schema[i].name;
                        if (typeof(this._buffers[buf][fieldName]) ==
                            "undefined") {
                            this._defineProperty(buf, fieldName)
                        }
                    }
                }
                this._buffers[buf]._fields = {};
                var fields = this._buffers[buf]._schema;
                for (var i = 0; i < fields.length; i++) {
                    this._buffers[buf]._fields[fields[i].name.toLowerCase()] =
                        fields[i]
                }
            }
            if (this._defaultTableRef && !this._defaultTableRef._schema &&
                this._resource.fields[""]) {
                this._defaultTableRef._schema = this._resource.fields[
                    ""]
            }
        } else {
            if (this._defaultTableRef) {
                this._defaultTableRef._schema = []
            }
        }
        if (this._numBuffers > 1) {
            for (var buf in this._buffers) {
                var fields = [];
                var found = false;
                for (var i = 0; i < this._buffers[buf]._schema.length; i++) {
                    var field = this._buffers[buf]._schema[i];
                    if (field.items && field.type == "array" && field.items
                        .$ref) {
                        if (this._buffers[field.name]) {
                            found = true;
                            this._buffers[field.name]._isNested = true
                        }
                    } else {
                        fields.push(field)
                    }
                }
                if (found) {
                    this._buffers[buf]._schema = fields
                }
            }
        }
        if (this._resource && this._resource.relations) {
            for (var i = 0; i < this._resource.relations.length; i++) {
                var relationship = this._resource.relations[i];
                if (relationship.childName && relationship.parentName) {
                    if (relationship.relationFields instanceof Array) {
                        for (var j = 0; j < relationship.relationFields
                            .length; j++) {
                            var fieldName;
                            var field;
                            if (this._buffers[relationship.parentName]._fields) {
                                fieldName = relationship.relationFields[
                                    j].parentFieldName;
                                field = this._buffers[relationship.parentName]
                                    ._fields[fieldName.toLowerCase()];
                                if (field) {
                                    relationship.relationFields[j].parentFieldName =
                                        field.name
                                } else {
                                    throw new Error(msg.getMsgText(
                                        "jsdoMSG010", fieldName
                                    ))
                                }
                            }
                            if (this._buffers[relationship.childName]._fields) {
                                fieldName = relationship.relationFields[
                                    j].childFieldName;
                                field = this._buffers[relationship.childName]
                                    ._fields[fieldName.toLowerCase()];
                                if (field) {
                                    relationship.relationFields[j].childFieldName =
                                        field.name
                                } else {
                                    throw new Error(msg.getMsgText(
                                        "jsdoMSG010", fieldName
                                    ))
                                }
                            }
                        }
                    }
                    this._buffers[relationship.childName]._parent =
                        relationship.parentName;
                    this._buffers[relationship.childName]._relationship =
                        relationship.relationFields;
                    this._buffers[relationship.parentName]._children.push(
                        relationship.childName)
                }
            }
        }
        this._getDefaultValue = function(field) {
            var defaultValue, t, m, d;
            if ((field.type === "string") && field.format && (field
                    .format.indexOf("date") !== -1) && (field[
                    "default"])) {
                switch (field["default"].toUpperCase()) {
                    case "NOW":
                        defaultValue = new Date().toISOString();
                        break;
                    case "TODAY":
                        t = new Date();
                        m = String((t.getMonth() + 1));
                        if (m.length === 1) {
                            m = "0" + m
                        }
                        d = String((t.getDate()));
                        if (d.length === 1) {
                            d = "0" + d
                        }
                        defaultValue = t.getFullYear() + "-" + m +
                            "-" + d;
                        break;
                    default:
                        defaultValue = field["default"]
                }
            } else {
                defaultValue = field["default"]
            }
            return defaultValue
        };
        this.isDataSet = function() {
            return this._dataSetName ? true : false
        };
        this._invokeComplete = function(jsdo, success, request) {
            if (request.async && request.fnName) {
                jsdo.trigger("afterInvoke", request.fnName, jsdo,
                    success, request)
            }
            if (request.deferred) {
                if (success) {
                    request.deferred.resolve(jsdo, success, request)
                } else {
                    request.deferred.reject(jsdo, success, request)
                }
            }
        };
        this._invokeSuccess = function() {};
        this._invokeError = function() {};
        this._httpRequest = function(xhr, method, url, reqBody, request) {
            if (!xhr) {
                xhr = new XMLHttpRequest();
                xhr.onCompleteFn = this._invokeComplete;
                xhr.onSuccessFn = this._invokeSuccess;
                xhr.onErrorFn = this._invokeError;
                xhr.onreadystatechange = this.onReadyStateChangeGeneric;
                if (request.async && request.fnName) {
                    this.trigger("beforeInvoke", request.fnName,
                        this, request)
                }
                if (reqBody) {
                    if (this._resource && this._resource.service) {
                        var useRequest = this._resource.service.useRequest;
                        if (this._resource.service.settings && this
                            ._resource.service.settings.useRequest !==
                            undefined) {
                            useRequest = this._resource.service.settings
                                .useRequest
                        }
                        if (useRequest) {
                            reqBody = {
                                request: reqBody
                            }
                        }
                    }
                }
            }
            xhr.request = request;
            xhr.jsdo = this;
            request.jsdo = this;
            request.xhr = xhr;
            this._session._openRequest(xhr, method, url, request.async);
            var input = null;
            if (reqBody) {
                xhr.setRequestHeader("Content-Type",
                    "application/json; charset=utf-8");
                input = JSON.stringify(reqBody)
            }
            try {
                xhr.send(input)
            } catch (e) {
                request.success = false;
                request.exception = e;
                xhr.jsdo._session._checkServiceResponse(xhr,
                    request.success, request)
            }
            return request
        };
        this._getDataObject = function() {
            var dataObject = {};
            if (this._dataSetName) {
                dataObject[this._dataSetName] = {};
                var oldUseRelationships = this.useRelationships;
                try {
                    this.useRelationships = false;
                    for (var buf in this._buffers) {
                        dataObject[this._dataSetName][buf] = this._buffers[
                            buf].getData()
                    }
                } finally {
                    this.useRelationships = oldUseRelationships
                }
            } else {
                if (this._dataProperty) {
                    dataObject[this._dataProperty] = this.getData()
                } else {
                    return this.getData()
                }
            }
            return dataObject
        };
        this._getDataObjectAsNested = function() {
            var dataObject = {};
            if (this._dataSetName) {
                dataObject[this._dataSetName] = {};
                try {
                    for (var buf in this._buffers) {
                        var bufObj = this._buffers[buf];
                        if (bufObj._isNested) {
                            continue
                        }
                        this._nestChildren = false;
                        if (bufObj._children.length > 0) {
                            for (var i = 0; i < bufObj._children.length; i++) {
                                var childBufObj = this._buffers[
                                    bufObj._children[i]];
                                if (childBufObj._isNested) {
                                    this._nestChildren = true;
                                    break
                                }
                            }
                        }
                        dataObject[this._dataSetName][buf] = this._buffers[
                            buf].getData()
                    }
                } catch (e) {
                    throw new Error(msg.getMsgText("jsdoMSG000", e.message))
                } finally {
                    this._nestChildren = false
                }
            } else {
                if (this._dataProperty) {
                    dataObject[this._dataProperty] = this.getData()
                } else {
                    return this.getData()
                }
            }
            return dataObject
        };
        this._unnestData = function() {
            if (this._dataSetName) {
                var parentRecord;
                var bufObj;
                var childBufObj;
                for (var buf in this._buffers) {
                    bufObj = this._buffers[buf];
                    if (bufObj._hasNestedChild()) {
                        for (var i = 0; i < bufObj._data.length; i++) {
                            parentRecord = bufObj._data[i];
                            for (var j = 0; j < bufObj._children.length; j++) {
                                childBufObj = this._buffers[bufObj._children[
                                    j]];
                                if (parentRecord[childBufObj._name]) {
                                    delete parentRecord[childBufObj
                                        ._name]
                                }
                            }
                        }
                    }
                }
            }
        };
        this._recToDataObject = function(record, includeChildren) {
            if (this._defaultTableRef) {
                return this._defaultTableRef._recToDataObject(
                    record, includeChildren)
            }
            throw new Error(msg.getMsgText("jsdoMSG001",
                "_recToDataObject()"))
        };
        this._recFromDataObject = function(dataObject) {
            if (this._defaultTableRef) {
                return this._defaultTableRef._recFromDataObject(
                    dataObject)
            }
            throw new Error(msg.getMsgText("jsdoMSG001",
                "_recFromDataObject()"))
        };
        this.add = function(obj) {
            if (this._defaultTableRef) {
                return this._defaultTableRef.add(obj)
            }
            throw new Error(msg.getMsgText("jsdoMSG001",
                "add() or create()"))
        };
        this.create = this.add;
        this.hasData = function() {
            for (var buf in this._buffers) {
                if (this._buffers[this._buffers[buf]._name].hasData()) {
                    return true
                }
            }
            return false
        };
        this.getData = function(params) {
            if (this._defaultTableRef) {
                return this._defaultTableRef.getData(params)
            }
            throw new Error(msg.getMsgText("jsdoMSG001",
                "getData()"))
        };
        this.getSchema = function() {
            if (this._defaultTableRef) {
                return this._defaultTableRef.getSchema()
            }
            throw new Error(msg.getMsgText("jsdoMSG001",
                "getSchema()"))
        };
        this.findById = function(id) {
            if (this._defaultTableRef) {
                return this._defaultTableRef.findById(id)
            }
            throw new Error(msg.getMsgText("jsdoMSG001",
                "findById()"))
        };
        this._convertType = function(value, type, itemType) {
            if ((typeof value != "string") || (type === null)) {
                return value
            }
            var result = value;
            try {
                if (type == "array") {
                    var result = [];
                    value = value.slice(1, value.length - 1);
                    var elements = value.split(",");
                    var convertItem = (itemType && (itemType !=
                        "string"));
                    for (var i = 0; i < elements.length; i++) {
                        result[i] = convertItem ? this._convertType(
                                elements[i], itemType, null) :
                            elements[i]
                    }
                } else {
                    if (type == "integer") {
                        result = parseInt(value)
                    } else {
                        if (type == "number") {
                            result = parseFloat(value)
                        } else {
                            result = value
                        }
                    }
                }
            } catch (e) {
                throw new Error(msg.getMsgText("jsdoMSG000",
                    "Error converting string to native type: " +
                    e.message))
            }
            return result
        };
        this.assign = function(values) {
            if (this._defaultTableRef) {
                return this._defaultTableRef.assign(values)
            } else {
                throw new Error(msg.getMsgText("jsdoMSG001",
                    "assign() or update()"))
            }
        };
        this.update = this.assign;
        this.remove = function() {
            if (this._defaultTableRef) {
                return this._defaultTableRef.remove()
            } else {
                throw new Error(msg.getMsgText("jsdoMSG001",
                    "remove()"))
            }
        };
        this.getId = function() {
            if (this._defaultTableRef) {
                return this._defaultTableRef.getId()
            }
            throw new Error(msg.getMsgText("jsdoMSG001", "getId()"))
        };
        this.getErrors = function() {
            if (this._defaultTableRef) {
                return this._defaultTableRef.getErrors()
            }
            throw new Error(msg.getMsgText("jsdoMSG001",
                "getErrors()"))
        };
        this.getErrorString = function() {
            if (this._defaultTableRef) {
                return this._defaultTableRef.getErrorString()
            }
            throw new Error(msg.getMsgText("jsdoMSG001",
                "getErrorString()"))
        };
        this.find = function(fn) {
            if (this._defaultTableRef) {
                return this._defaultTableRef.find(fn)
            }
            throw new Error(msg.getMsgText("jsdoMSG001", "find()"))
        };
        this.foreach = function(fn) {
            if (this._defaultTableRef) {
                return this._defaultTableRef.foreach(fn)
            }
            throw new Error(msg.getMsgText("jsdoMSG001",
                "foreach()"))
        };
        this.setSortFields = function(sortFields) {
            if (this._defaultTableRef) {
                return this._defaultTableRef.setSortFields(
                    sortFields)
            }
            throw new Error(msg.getMsgText("jsdoMSG001",
                "setSortFields()"))
        };
        this.setSortFn = function(fn) {
            if (this._defaultTableRef) {
                return this._defaultTableRef.setSortFn(fn)
            }
            throw new Error(msg.getMsgText("jsdoMSG001",
                "setSortFn()"))
        };
        this.sort = function(arg1) {
            if (this._defaultTableRef) {
                return this._defaultTableRef.sort(arg1)
            }
            throw new Error(msg.getMsgText("jsdoMSG001", "sort()"))
        };
        this._clearErrors = function() {
            this._lastErrors = [];
            for (var buf in this._buffers) {
                this._buffers[buf]._lastErrors = []
            }
        };
        this.fill = function() {
            var objParam, promise, properties, mapping;
            this._clearErrors();
            if (arguments.length !== 0) {
                if (typeof(arguments[0]) == "function") {
                    throw new Error(msg.getMsgText("jsdoMSG024",
                        "JSDO", "fill() or read()"))
                }
                var filter;
                if (arguments[0] === null || arguments[0] ===
                    undefined) {
                    filter = ""
                } else {
                    if (typeof(arguments[0]) == "string") {
                        filter = arguments[0];
                        objParam = {
                            filter: filter
                        }
                    } else {
                        if (typeof(arguments[0]) == "object") {
                            properties = this.getMethodProperties(
                                "read");
                            if (properties && properties.mappingType) {
                                mapping = progress.data.PluginManager
                                    .getPlugin(properties.mappingType);
                                if (!mapping) {
                                    throw new Error(msg.getMsgText(
                                        "jsdoMSG118",
                                        properties.mappingType
                                    ))
                                }
                                if (typeof(mapping.requestMapping) ===
                                    "function") {
                                    objParam = mapping.requestMapping(
                                        this, arguments[0], {
                                            operation: "read"
                                        })
                                } else {
                                    objParam = arguments[0]
                                }
                            } else {
                                if (properties.capabilities) {
                                    throw new Error(msg.getMsgText(
                                        "jsdoMSG119"))
                                }
                                objParam = arguments[0]
                            }
                        } else {
                            throw new Error(msg.getMsgText(
                                "jsdoMSG025", "JSDO",
                                "fill() or read()"))
                        }
                    }
                }
            } else {
                objParam = null
            }
            var xhr = new XMLHttpRequest();
            var request = {
                xhr: xhr,
                jsdo: this,
                objParam: objParam
            };
            xhr.request = request;
            xhr.jsdo = this;
            xhr.onSuccessFn = this._fillSuccess;
            xhr.onErrorFn = this._fillError;
            xhr.onCompleteFn = this._fillComplete;
            xhr.onreadystatechange = this.onReadyStateChangeGeneric;
            this.trigger("beforeFill", this, request);
            if (this._resource) {
                if (typeof(this._resource.generic.read) ==
                    "function") {
                    xhr.objParam = objParam;
                    this._resource.generic.read(xhr, this._async);
                    if (xhr.request.deferred) {
                        promise = xhr.request.deferred.promise()
                    }
                } else {
                    throw new Error(
                        "JSDO: READ operation is not defined.")
                }
            } else {
                this._session._openRequest(xhr, "GET", this.url,
                    this._async);
                try {
                    xhr.send(null)
                } catch (e) {
                    request.exception = e;
                    xhr.jsdo._session._checkServiceResponse(xhr,
                        request.success, request)
                }
            }
            return promise
        };
        this.read = this.fill;
        this._clearData = function() {
            for (var buf in this._buffers) {
                this._buffers[buf]._clearData()
            }
        };
        this._execGenericOperation = function(operation, objParam,
            request, onCompleteFn, onSuccessFn, onErrorFn) {
            var xhr = new XMLHttpRequest();
            request.xhr = xhr;
            request.jsdo = this;
            request.objParam = objParam;
            request.operation = operation;
            xhr.jsdo = this;
            xhr.onCompleteFn = onCompleteFn;
            xhr.onSuccessFn = onSuccessFn;
            xhr.onErrorFn = onErrorFn;
            xhr.onreadystatechange = this.onReadyStateChangeGeneric;
            xhr.request = request;
            var operationStr;
            switch (operation) {
                case progress.data.JSDO._OP_READ:
                case progress.data.JSDO._OP_CREATE:
                case progress.data.JSDO._OP_UPDATE:
                case progress.data.JSDO._OP_DELETE:
                case progress.data.JSDO._OP_SUBMIT:
                    operationStr = PROGRESS_JSDO_OP_STRING[
                        operation];
                    break;
                default:
                    throw new Error("JSDO: Unexpected operation " +
                        operation + " in HTTP request.")
            }
            if (this._resource) {
                if (typeof(this._resource.generic[operationStr]) ==
                    "function") {
                    xhr.objParam = objParam;
                    this._resource.generic[operationStr](xhr, this._async)
                } else {
                    throw new Error("JSDO: " + operationStr.toUpperCase() +
                        " operation is not defined.")
                }
            }
        };
        this._undefWorkingRecord = function() {
            for (var buf in this._buffers) {
                this._buffers[buf]._setRecord(null)
            }
        };
        this.saveChanges = function(useSubmit) {
            var promise;
            if (useSubmit === undefined) {
                useSubmit = false
            } else {
                if (typeof(useSubmit) != "boolean") {
                    throw new Error(msg.getMsgText("jsdoMSG025",
                        "JSDO", "saveChanges()"))
                }
            }
            if (useSubmit && (!this._dataSetName)) {
                if (this.autoApplyChanges) {
                    throw new Error(msg.getMsgText("jsdoMSG124"))
                }
            }
            this._useSubmit = useSubmit;
            if (!this._hasCUDOperations && !this._hasSubmitOperation) {
                throw new Error(msg.getMsgText("jsdoMSG026"))
            }
            this._clearErrors();
            var request = {
                jsdo: this
            };
            this.trigger("beforeSaveChanges", this, request);
            if (useSubmit) {
                promise = this._syncDataSetForSubmit(request)
            } else {
                if (this._dataSetName) {
                    promise = this._syncDataSetForCUD()
                } else {
                    promise = this._syncSingleTable()
                }
            }
            return promise
        };
        this.invoke = function(name, object) {
            var request = this[name](object);
            if (request.deferred) {
                return request.deferred.promise()
            }
            return undefined
        };
        this._syncTableRef = function(operation, tableRef, batch) {
            if (tableRef._visited) {
                return
            }
            tableRef._visited = true;
            if (!batch) {
                batch = {
                    operations: []
                }
            } else {
                if (!batch.operations) {
                    batch.operations = []
                }
            }
            switch (operation) {
                case progress.data.JSDO._OP_CREATE:
                    for (var i = 0; i < tableRef._added.length; i++) {
                        var id = tableRef._added[i];
                        var jsrecord = tableRef._findById(id, false);
                        if (!jsrecord) {
                            continue
                        }
                        if (tableRef._processed[id]) {
                            continue
                        }
                        tableRef._processed[id] = jsrecord.data;
                        var jsonObject;
                        if (this.isDataSet()) {
                            jsonObject = {};
                            if (this._useBeforeImage("create")) {
                                jsonObject[this._dataSetName] = {};
                                var dataSetObject = jsonObject[this
                                    ._dataSetName];
                                dataSetObject["prods:hasChanges"] =
                                    true;
                                dataSetObject[tableRef._name] = [];
                                var rowData = {};
                                rowData["prods:rowState"] =
                                    "created";
                                rowData["prods:clientId"] =
                                    jsrecord.data._id;
                                tableRef._jsdo._copyRecord(tableRef,
                                    jsrecord.data, rowData);
                                delete rowData._id;
                                dataSetObject[tableRef._name].push(
                                    rowData)
                            } else {
                                jsonObject[tableRef._name] = [];
                                jsonObject[tableRef._name].push(
                                    jsrecord.data)
                            }
                        } else {
                            jsonObject = jsrecord.data
                        }
                        var request = {
                            operation: operation,
                            batch: batch,
                            jsrecord: jsrecord,
                            jsdo: this
                        };
                        batch.operations.push(request);
                        jsrecord._tableRef.trigger("beforeCreate",
                            this, jsrecord, request);
                        this.trigger("beforeCreate", this, jsrecord,
                            request);
                        this._execGenericOperation(progress.data.JSDO
                            ._OP_CREATE, jsonObject, request,
                            this._createComplete, this._createSuccess,
                            this._createError)
                    }
                    break;
                case progress.data.JSDO._OP_UPDATE:
                    for (var id in tableRef._changed) {
                        var jsrecord = tableRef._findById(id, false);
                        if (!jsrecord) {
                            continue
                        }
                        if (tableRef._processed[id]) {
                            continue
                        }
                        tableRef._processed[id] = jsrecord.data;
                        var jsonObject = {};
                        var requestData = {};
                        var useBeforeImageFormat = false;
                        if (this.isDataSet()) {
                            if (this._useBeforeImage("update")) {
                                useBeforeImageFormat = true;
                                jsonObject[this._dataSetName] = {};
                                var dataSetObject = jsonObject[this
                                    ._dataSetName];
                                dataSetObject["prods:hasChanges"] =
                                    true;
                                dataSetObject[tableRef._name] = [];
                                var rowData = {};
                                rowData["prods:id"] = jsrecord.data
                                    ._id;
                                rowData["prods:rowState"] =
                                    "modified";
                                rowData["prods:clientId"] =
                                    jsrecord.data._id;
                                tableRef._jsdo._copyRecord(tableRef,
                                    jsrecord.data, rowData);
                                delete rowData._id;
                                dataSetObject[tableRef._name].push(
                                    rowData);
                                dataSetObject["prods:before"] = {};
                                var beforeObject = dataSetObject[
                                    "prods:before"];
                                beforeObject[tableRef._name] = [];
                                var beforeRowData = {};
                                beforeRowData["prods:id"] =
                                    jsrecord.data._id;
                                tableRef._jsdo._copyRecord(tableRef,
                                    tableRef._beforeImage[
                                        jsrecord.data._id],
                                    beforeRowData);
                                delete beforeRowData._id;
                                beforeObject[tableRef._name].push(
                                    beforeRowData)
                            }
                        }
                        if (!useBeforeImageFormat) {
                            if (this._resource.service && this._resource
                                .service.settings && this._resource
                                .service.settings.sendOnlyChanges) {
                                tableRef._jsdo._copyRecord(tableRef,
                                    jsrecord.data, requestData,
                                    tableRef._beforeImage[
                                        jsrecord.data._id]);
                                if (this._resource.idProperty) {
                                    requestData[this._resource.idProperty] =
                                        jsrecord.data[this._resource
                                            .idProperty]
                                } else {
                                    throw new Error(msg.getMsgText(
                                        "jsdoMSG110", this._resource
                                        .name,
                                        " for sendOnlyChanges property"
                                    ))
                                }
                            } else {
                                requestData = jsrecord.data
                            }
                            if (this.isDataSet()) {
                                jsonObject[tableRef._name] = [];
                                jsonObject[tableRef._name].push(
                                    requestData)
                            } else {
                                requestData = jsrecord.data;
                                jsonObject = requestData
                            }
                        }
                        var request = {
                            jsrecord: jsrecord,
                            operation: operation,
                            batch: batch,
                            jsdo: this
                        };
                        batch.operations.push(request);
                        jsrecord._tableRef.trigger("beforeUpdate",
                            this, jsrecord, request);
                        this.trigger("beforeUpdate", this, jsrecord,
                            request);
                        this._execGenericOperation(progress.data.JSDO
                            ._OP_UPDATE, jsonObject, request,
                            this._updateComplete, this._updateSuccess,
                            this._updateError)
                    }
                    break
            }
            for (var i = 0; i < tableRef._children.length; i++) {
                var childTableName = tableRef._children[i];
                this._syncTableRef(operation, this._buffers[
                    childTableName], batch)
            }
            if (operation == progress.data.JSDO._OP_DELETE) {
                for (var i = 0; i < tableRef._deleted.length; i++) {
                    var id = tableRef._deleted[i]._id;
                    var jsrecord = tableRef._deleted[i];
                    if (!jsrecord) {
                        continue
                    }
                    tableRef._processed[id] = jsrecord.data;
                    var jsonObject = {};
                    var requestData = {};
                    var useBeforeImageFormat = false;
                    if (this.isDataSet()) {
                        if (this._useBeforeImage("delete")) {
                            useBeforeImageFormat = true;
                            jsonObject[this._dataSetName] = {};
                            var dataSetObject = jsonObject[this._dataSetName];
                            dataSetObject["prods:hasChanges"] =
                                true;
                            dataSetObject["prods:before"] = {};
                            var beforeObject = dataSetObject[
                                "prods:before"];
                            beforeObject[tableRef._name] = [];
                            var rowData = jsrecord.data;
                            var beforeRowData = {};
                            beforeRowData["prods:rowState"] =
                                "deleted";
                            beforeRowData["prods:clientId"] =
                                jsrecord.data._id;
                            tableRef._jsdo._copyRecord(tableRef,
                                tableRef._beforeImage[rowData._id],
                                beforeRowData);
                            beforeObject[tableRef._name].push(
                                beforeRowData)
                        }
                    }
                    if (!useBeforeImageFormat) {
                        if (this._resource.service && this._resource
                            .service.settings && this._resource.service
                            .settings.sendOnlyChanges) {
                            if (this._resource.idProperty) {
                                requestData[this._resource.idProperty] =
                                    jsrecord.data[this._resource.idProperty]
                            } else {
                                throw new Error(msg.getMsgText(
                                    "jsdoMSG110", this._resource
                                    .name,
                                    " for sendOnlyChanges property"
                                ))
                            }
                        } else {
                            requestData = jsrecord.data
                        }
                        if (this.isDataSet()) {
                            jsonObject[tableRef._name] = [];
                            jsonObject[tableRef._name].push(
                                requestData)
                        } else {
                            requestData = jsrecord.data;
                            jsonObject = requestData
                        }
                    }
                    var request = {
                        batch: batch,
                        jsrecord: jsrecord,
                        operation: operation,
                        jsdo: this
                    };
                    batch.operations.push(request);
                    jsrecord._tableRef.trigger("beforeDelete", this,
                        jsrecord, request);
                    this.trigger("beforeDelete", this, jsrecord,
                        request);
                    this._execGenericOperation(progress.data.JSDO._OP_DELETE,
                        jsonObject, request, this._deleteComplete,
                        this._deleteSuccess, this._deleteError)
                }
            }
        };
        this._useBeforeImage = function(opType) {
            for (var idx = 0; idx < this._resource.operations.length; idx++) {
                if (this._resource.operations[idx].type == opType) {
                    return this._resource.operations[idx].useBeforeImage
                }
            }
            return false
        };
        this._syncDataSetForCUD = function() {
            var batch = {
                    operations: []
                },
                deferred, promise;
            if (typeof($) == "function" && typeof($.Deferred) ==
                "function") {
                deferred = $.Deferred();
                promise = deferred.promise();
                batch.deferred = deferred
            }
            for (var buf in this._buffers) {
                this._buffers[buf]._visited = false
            }
            for (var buf in this._buffers) {
                var tableRef = this._buffers[buf];
                this._syncTableRef(progress.data.JSDO._OP_DELETE,
                    tableRef, batch)
            }
            for (var buf in this._buffers) {
                this._buffers[buf]._visited = false
            }
            for (var buf in this._buffers) {
                var tableRef = this._buffers[buf];
                this._syncTableRef(progress.data.JSDO._OP_CREATE,
                    tableRef, batch)
            }
            for (var buf in this._buffers) {
                this._buffers[buf]._visited = false
            }
            for (var buf in this._buffers) {
                var tableRef = this._buffers[buf];
                this._syncTableRef(progress.data.JSDO._OP_UPDATE,
                    tableRef, batch)
            }
            if (this.autoApplyChanges) {
                for (var buf in this._buffers) {
                    var tableRef = this._buffers[buf];
                    tableRef._processed = {};
                    tableRef._added = [];
                    tableRef._changed = {};
                    tableRef._deleted = []
                }
            }
            if (!this._async) {
                if (this._isBatchComplete(batch)) {
                    var success = this._isBatchSuccess(batch);
                    var request = {
                        batch: batch,
                        success: success
                    };
                    this._undefWorkingRecord();
                    this._fireAfterSaveChanges(success, request)
                }
            }
            return promise
        };
        this._syncSingleTable = function() {
            var deferred, promise;
            if (!this._defaultTableRef) {
                return
            }
            var tableRef = this._defaultTableRef;
            var batch = {
                operations: []
            };
            if (typeof($) == "function" && typeof($.Deferred) ==
                "function") {
                deferred = $.Deferred();
                promise = deferred.promise();
                batch.deferred = deferred
            }
            var fireAfterSaveChanges = false;
            var addedRecords = {};
            for (var i = 0; i < tableRef._added.length; i++) {
                var id = tableRef._added[i];
                addedRecords[id] = id
            }
            for (var i = 0; i < tableRef._deleted.length; i++) {
                var jsrecord = tableRef._deleted[i];
                if (!jsrecord) {
                    continue
                }
                var id = jsrecord.data._id;
                if (addedRecords[id]) {
                    var request = {
                        success: true,
                        xhr: undefined,
                        operation: progress.data.JSDO._OP_DELETE,
                        batch: batch,
                        jsrecord: jsrecord,
                        jsdo: this
                    };
                    batch.operations.push(request);
                    tableRef._processed[id] = jsrecord.data;
                    var jsdo = request.jsdo;
                    try {
                        request.jsrecord._tableRef.trigger(
                            "afterDelete", jsdo, request.jsrecord,
                            request.success, request);
                        jsdo.trigger("afterDelete", jsdo, request.jsrecord,
                            request.success, request)
                    } finally {
                        request.complete = true
                    }
                    fireAfterSaveChanges = true
                }
            }
            addedRecords = null;
            for (var i = 0; i < tableRef._deleted.length; i++) {
                var jsrecord = tableRef._deleted[i];
                if (!jsrecord) {
                    continue
                }
                var id = jsrecord.data._id;
                if (tableRef._processed[id]) {
                    continue
                }
                tableRef._processed[id] = jsrecord.data;
                fireAfterSaveChanges = false;
                var xhr = new XMLHttpRequest();
                xhr.jsdo = this;
                var request = {
                    xhr: xhr,
                    operation: progress.data.JSDO._OP_DELETE,
                    batch: batch,
                    jsrecord: jsrecord,
                    jsdo: this
                };
                batch.operations.push(request);
                xhr.onCompleteFn = this._deleteComplete;
                xhr.onSuccessFn = this._deleteSuccess;
                xhr.onErrorFn = this._deleteError;
                xhr.onreadystatechange = this.onReadyStateChangeGeneric;
                xhr.request = request;
                jsrecord._tableRef.trigger("beforeDelete", this,
                    jsrecord, request);
                this.trigger("beforeDelete", this, jsrecord,
                    request);
                var requestData = {};
                if (this._resource.service && this._resource.service
                    .settings && this._resource.service.settings.sendOnlyChanges
                ) {
                    if (this._resource.idProperty) {
                        requestData[this._resource.idProperty] =
                            jsrecord.data[this._resource.idProperty]
                    } else {
                        throw new Error(msg.getMsgText("jsdoMSG110",
                            this._resource.name,
                            " for sendOnlyChanges property"
                        ))
                    }
                } else {
                    requestData = jsrecord.data
                }
                if (this._resource) {
                    if (typeof(this._resource.generic["delete"]) ==
                        "function") {
                        xhr.objParam = requestData;
                        this._resource.generic["delete"](xhr, this._async)
                    } else {
                        throw new Error(
                            "JSDO: DELETE operation is not defined."
                        )
                    }
                } else {
                    this._session._openRequest(xhr, "DELETE", this.url +
                        "/" + id, true);
                    try {
                        xhr.send(null)
                    } catch (e) {
                        request.success = false;
                        request.exception = e;
                        xhr.jsdo._session._checkServiceResponse(xhr,
                            request.success, request)
                    }
                }
            }
            for (var i = 0; i < tableRef._added.length; i++) {
                var id = tableRef._added[i];
                var jsrecord = tableRef._findById(id, false);
                if (!jsrecord) {
                    continue
                }
                if (tableRef._processed[id]) {
                    continue
                }
                tableRef._processed[id] = jsrecord.data;
                fireAfterSaveChanges = false;
                var xhr = new XMLHttpRequest();
                xhr.jsdo = this;
                var request = {
                    xhr: xhr,
                    jsrecord: jsrecord,
                    batch: batch,
                    operation: progress.data.JSDO._OP_CREATE,
                    jsdo: this
                };
                batch.operations.push(request);
                xhr.onCompleteFn = this._createComplete;
                xhr.onSuccessFn = this._createSuccess;
                xhr.onErrorFn = this._createError;
                xhr.onreadystatechange = this.onReadyStateChangeGeneric;
                xhr.request = request;
                jsrecord._tableRef.trigger("beforeCreate", this,
                    jsrecord, request);
                this.trigger("beforeCreate", this, jsrecord,
                    request);
                if (this._resource) {
                    if (typeof(this._resource.generic.create) ==
                        "function") {
                        var copy = {};
                        if (this._resource.idProperty !== undefined &&
                            jsrecord.data._id !== undefined) {
                            this._copyRecord(jsrecord._tableRef,
                                jsrecord.data, copy);
                            delete copy._id;
                            xhr.objParam = copy
                        } else {
                            xhr.objParam = jsrecord.data
                        }
                        this._resource.generic.create(xhr, this._async)
                    } else {
                        throw new Error(
                            "JSDO: CREATE operation is not defined."
                        )
                    }
                } else {
                    this._session._openRequest(xhr, "POST", this.url,
                        true);
                    xhr.setRequestHeader("Content-Type",
                        "application/json; charset=utf-8");
                    var input = JSON.stringify(jsrecord.data);
                    try {
                        xhr.send(input)
                    } catch (e) {
                        request.success = false;
                        request.exception = e;
                        xhr.jsdo._session._checkServiceResponse(xhr,
                            request.success, request)
                    }
                }
            }
            for (var id in tableRef._changed) {
                var jsrecord = tableRef._findById(id, false);
                if (!jsrecord) {
                    continue
                }
                if (tableRef._processed[id]) {
                    continue
                }
                tableRef._processed[id] = jsrecord.data;
                fireAfterSaveChanges = false;
                var xhr = new XMLHttpRequest();
                var request = {
                    xhr: xhr,
                    jsrecord: jsrecord,
                    operation: progress.data.JSDO._OP_UPDATE,
                    batch: batch,
                    jsdo: this
                };
                xhr.request = request;
                xhr.jsdo = this;
                batch.operations.push(request);
                xhr.onCompleteFn = this._updateComplete;
                xhr.onSuccessFn = this._updateSuccess;
                xhr.onErrorFn = this._updateError;
                xhr.onreadystatechange = this.onReadyStateChangeGeneric;
                jsrecord._tableRef.trigger("beforeUpdate", this,
                    jsrecord, request);
                this.trigger("beforeUpdate", this, jsrecord,
                    request);
                var requestData = {};
                if (this._resource.service && this._resource.service
                    .settings && this._resource.service.settings.sendOnlyChanges
                ) {
                    tableRef._jsdo._copyRecord(tableRef, jsrecord.data,
                        requestData, tableRef._beforeImage[
                            jsrecord.data._id]);
                    if (this._resource.idProperty) {
                        requestData[this._resource.idProperty] =
                            jsrecord.data[this._resource.idProperty]
                    } else {
                        throw new Error(msg.getMsgText("jsdoMSG110",
                            this._resource.name,
                            " for sendOnlyChanges property"
                        ))
                    }
                } else {
                    requestData = jsrecord.data
                }
                if (this._resource) {
                    if (typeof(this._resource.generic.update) ==
                        "function") {
                        xhr.objParam = requestData;
                        this._resource.generic.update(xhr, this._async)
                    } else {
                        throw new Error(
                            "JSDO: UPDATE operation is not defined."
                        )
                    }
                } else {
                    this._session._openRequest(xhr, "PUT", this.url +
                        "/" + id, this._async);
                    xhr.setRequestHeader("Content-Type",
                        "application/json; charset=utf-8");
                    var input = JSON.stringify(jsrecord.data);
                    try {
                        xhr.send(input)
                    } catch (e) {
                        request.success = false;
                        request.exception = e;
                        xhr.jsdo._session._checkServiceResponse(xhr,
                            request.success, request)
                    }
                }
            }
            if (this.autoApplyChanges) {
                tableRef._beforeImage = {};
                tableRef._added = [];
                tableRef._changed = {};
                tableRef._deleted = [];
                tableRef._processed = {}
            }
            if (!this._async) {
                fireAfterSaveChanges = true
            }
            if (fireAfterSaveChanges) {
                var jsdo = this;
                var request = {
                    batch: batch,
                    success: true
                };
                jsdo._undefWorkingRecord();
                jsdo._fireAfterSaveChanges(request.success, request)
            }
            return promise
        };
        this._syncDataSetForSubmit = function(request) {
            var deferred, promise, jsonObject, completeFn = this._saveChangesComplete,
                successFn = this._saveChangesSuccess,
                errorFn = this._saveChangesError;
            if (typeof($) == "function" && typeof($.Deferred) ==
                "function") {
                deferred = $.Deferred();
                promise = deferred.promise();
                request.deferred = deferred
            }
            request.jsrecords = [];
            if (this._dataSetName) {
                jsonObject = this._createChangeSet(this._dataSetName,
                    false, request)
            } else {
                jsonObject = this._createTTChangeSet(this._defaultTableRef,
                    request);
                successFn = this._saveChangesSuccessTT
            }
            this._execGenericOperation(progress.data.JSDO._OP_SUBMIT,
                jsonObject, request, completeFn, successFn,
                errorFn);
            return promise
        };
        this._createChangeSet = function(dataSetName, alwaysCreateTable,
            request) {
            var changeSetJsonObject = {};
            changeSetJsonObject[dataSetName] = {};
            var dataSetJsonObject = changeSetJsonObject[dataSetName];
            var hasChanges = dataSetJsonObject["prods:hasChanges"] =
                this._hasChanges();
            if (hasChanges) {
                if ((alwaysCreateTable === true)) {
                    for (var buf in this._buffers) {
                        dataSetJsonObject[this._buffers[buf]._name] = []
                    }
                }
                for (var buf in this._buffers) {
                    var tableRef = this._buffers[buf];
                    this._addDeletesToChangeSet(tableRef,
                        dataSetJsonObject, request)
                }
                for (var buf in this._buffers) {
                    var tableRef = this._buffers[buf];
                    this._addCreatesToChangeSet(tableRef,
                        dataSetJsonObject, request)
                }
                for (var buf in this._buffers) {
                    var tableRef = this._buffers[buf];
                    this._addChangesToChangeSet(tableRef,
                        dataSetJsonObject, request)
                }
                for (var buf in this._buffers) {
                    this._buffers[buf]._processed = {}
                }
            }
            var keys = Object.keys(changeSetJsonObject[dataSetName]);
            if (keys.length == 1 && keys[0] == "prods:hasChanges") {
                for (var buf in this._buffers) {
                    dataSetJsonObject[this._buffers[buf]._name] = []
                }
                dataSetJsonObject["prods:hasChanges"] = false
            }
            return changeSetJsonObject
        };
        this._createTTChangeSet = function(tableRef, request) {
            var changeSetJsonObject = {},
                hasChanges, tempTableJsonObject, i, id, jsrecord;
            changeSetJsonObject[tableRef._name] = [];
            tempTableJsonObject = changeSetJsonObject[tableRef._name];
            hasChanges = this._hasChanges();
            if (hasChanges) {
                for (i = 0; i < tableRef._added.length; i++) {
                    id = tableRef._added[i];
                    jsrecord = tableRef._findById(id, false);
                    if (jsrecord) {
                        if (!tableRef._processed[jsrecord.data._id]) {
                            this._addRowToTTChangeSet(tableRef,
                                jsrecord, tempTableJsonObject,
                                request, "beforeCreate")
                        }
                    }
                }
                for (id in tableRef._changed) {
                    if (tableRef._changed.hasOwnProperty(id)) {
                        jsrecord = tableRef._findById(id, false);
                        if (jsrecord) {
                            if (!tableRef._processed[jsrecord.data._id]) {
                                this._addRowToTTChangeSet(tableRef,
                                    jsrecord,
                                    tempTableJsonObject,
                                    request, "beforeUpdate")
                            }
                        }
                    }
                }
                tableRef._processed = {}
            }
            return changeSetJsonObject
        };
        this._addRowToTTChangeSet = function(tableRef, jsrecord,
            tempTableJsonObject, request, event) {
            var rowData = {};
            tableRef._processed[jsrecord.data._id] = jsrecord.data;
            if (typeof(request) != "undefined") {
                request.jsrecords.push(jsrecord);
                jsrecord._tableRef.trigger(event, this, jsrecord,
                    request);
                this.trigger(event, this, jsrecord, request)
            }
            tableRef._jsdo._copyRecord(tableRef, jsrecord.data,
                rowData);
            delete rowData._id;
            tempTableJsonObject.push(rowData)
        };
        this._createDataAndChangeSet = function(dataSetName) {
            var jsonObject = {};
            jsonObject[dataSetName] = {};
            var dataSetJsonObject = jsonObject[dataSetName];
            for (var buf in this._buffers) {
                dataSetJsonObject[this._buffers[buf]._name] = []
            }
            if (this._hasChanges()) {
                dataSetJsonObject["prods:hasChanges"] = true
            }
            for (var buf in this._buffers) {
                var tableRef = this._buffers[buf];
                this._addRecordsToObject(tableRef,
                    dataSetJsonObject)
            }
            for (var buf in this._buffers) {
                var tableRef = this._buffers[buf];
                this._addDeletesToChangeSet(tableRef,
                    dataSetJsonObject)
            }
            for (var buf in this._buffers) {
                this._buffers[buf]._processed = {}
            }
            return jsonObject
        };
        this._addRecordsToObject = function(tableRef, dataSetJsonObject) {
            if (tableRef._data.length > 0 && !dataSetJsonObject[
                    tableRef._name]) {
                dataSetJsonObject[tableRef._name] = []
            }
            for (var i = 0; i < tableRef._data.length; i++) {
                var record = tableRef._data[i];
                if (!record) {
                    continue
                }
                if (this._doesRecordHaveCreateBIData(tableRef,
                        record._id) === true) {
                    var jsrecord = tableRef._findById(record._id,
                        false);
                    if (!jsrecord) {
                        continue
                    }
                    if (tableRef._processed[jsrecord.data._id]) {
                        continue
                    }
                    this._addCreatedRowToChangeSet(tableRef,
                        jsrecord, dataSetJsonObject)
                }
                if (this._doesRecordHaveUpdateBIData(tableRef,
                        record._id) === true) {
                    var jsrecord = tableRef._findById(record._id,
                        false);
                    if (!jsrecord) {
                        continue
                    }
                    if (tableRef._processed[jsrecord.data._id]) {
                        continue
                    }
                    this._addChangedRowToChangeSet(tableRef,
                        jsrecord, dataSetJsonObject)
                } else {
                    if (tableRef._processed[record._id]) {
                        continue
                    }
                    tableRef._processed[record._id] = record;
                    var rowData = {};
                    tableRef._jsdo._copyRecord(tableRef, record,
                        rowData);
                    delete rowData._id;
                    dataSetJsonObject[tableRef._name].push(rowData)
                }
            }
        };
        this._doesRecordHaveCreateBIData = function(tableRef, id) {
            for (var i = 0; i < tableRef._added.length; i++) {
                if (tableRef._added[i] === id) {
                    return true
                }
            }
            return false
        };
        this._doesRecordHaveUpdateBIData = function(tableRef, id) {
            for (var changedId in tableRef._changed) {
                if (changedId === id) {
                    return true
                }
            }
            return false
        };
        this._hasChanges = function() {
            var hasChanges = false;
            for (var buf in this._buffers) {
                var tableRef = this._buffers[buf];
                var hasUpdates = false;
                for (var id in tableRef._changed) {
                    hasUpdates = true;
                    break
                }
                if (tableRef._deleted.length > 0 || tableRef._added
                    .length > 0 || hasUpdates) {
                    hasChanges = true;
                    break
                }
            }
            return hasChanges
        };
        this._addDeletesToChangeSet = function(tableRef,
            dataSetJsonObject, request) {
            for (var i = 0; i < tableRef._deleted.length; i++) {
                var jsrecord = tableRef._deleted[i];
                if (!jsrecord) {
                    continue
                }
                if (jsrecord.data && jsrecord.data._id !==
                    undefined && tableRef._beforeImage[jsrecord.data
                        ._id] === null) {
                    continue
                }
                this._addDeletedRowToChangeSet(tableRef, jsrecord,
                    dataSetJsonObject, request)
            }
        };
        this._addDeletedRowToChangeSet = function(tableRef, jsrecord,
            dataSetJsonObject, request) {
            tableRef._processed[jsrecord.data._id] = jsrecord.data;
            jsrecord.data["prods:rowState"] = "deleted";
            if (typeof(request) != "undefined") {
                request.jsrecords.push(jsrecord);
                jsrecord._tableRef.trigger("beforeDelete", this,
                    jsrecord, request);
                this.trigger("beforeDelete", this, jsrecord,
                    request)
            }
            var beforeRowData = {};
            beforeRowData["prods:clientId"] = jsrecord.data._id;
            beforeRowData["prods:rowState"] = "deleted";
            var beforeTableJsonObject = this._getTableInBeforeJsonObject(
                dataSetJsonObject, tableRef._name);
            tableRef._jsdo._copyRecord(tableRef, tableRef._beforeImage[
                jsrecord.data._id], beforeRowData);
            delete beforeRowData._id;
            beforeTableJsonObject.push(beforeRowData)
        };
        this._addCreatesToChangeSet = function(tableRef,
            dataSetJsonObject, request) {
            for (var i = 0; i < tableRef._added.length; i++) {
                var id = tableRef._added[i];
                var jsrecord = tableRef._findById(id, false);
                if (!jsrecord) {
                    continue
                }
                if (tableRef._processed[jsrecord.data._id]) {
                    continue
                }
                this._addCreatedRowToChangeSet(tableRef, jsrecord,
                    dataSetJsonObject, request)
            }
        };
        this._addCreatedRowToChangeSet = function(tableRef, jsrecord,
            dataSetJsonObject, request) {
            tableRef._processed[jsrecord.data._id] = jsrecord.data;
            if (!dataSetJsonObject[tableRef._name]) {
                dataSetJsonObject[tableRef._name] = []
            }
            jsrecord.data["prods:rowState"] = "created";
            if (typeof(request) != "undefined") {
                request.jsrecords.push(jsrecord);
                jsrecord._tableRef.trigger("beforeCreate", this,
                    jsrecord, request);
                this.trigger("beforeCreate", this, jsrecord,
                    request)
            }
            var rowData = {};
            rowData["prods:clientId"] = jsrecord.data._id;
            rowData["prods:rowState"] = "created";
            tableRef._jsdo._copyRecord(tableRef, jsrecord.data,
                rowData);
            delete rowData._id;
            dataSetJsonObject[tableRef._name].push(rowData)
        };
        this._addChangesToChangeSet = function(tableRef,
            dataSetJsonObject, request) {
            for (var id in tableRef._changed) {
                var jsrecord = tableRef._findById(id, false);
                if (!jsrecord) {
                    continue
                }
                if (tableRef._processed[jsrecord.data._id]) {
                    continue
                }
                this._addChangedRowToChangeSet(tableRef, jsrecord,
                    dataSetJsonObject, request)
            }
        };
        this._addChangedRowToChangeSet = function(tableRef, jsrecord,
            dataSetJsonObject, request) {
            tableRef._processed[jsrecord.data._id] = jsrecord.data;
            if (!dataSetJsonObject[tableRef._name]) {
                dataSetJsonObject[tableRef._name] = []
            }
            jsrecord.data["prods:rowState"] = "modified";
            if (typeof(request) != "undefined") {
                request.jsrecords.push(jsrecord);
                jsrecord._tableRef.trigger("beforeUpdate", this,
                    jsrecord, request);
                this.trigger("beforeUpdate", this, jsrecord,
                    request)
            }
            var rowData = {};
            rowData["prods:id"] = jsrecord.data._id;
            rowData["prods:clientId"] = jsrecord.data._id;
            rowData["prods:rowState"] = "modified";
            tableRef._jsdo._copyRecord(tableRef, jsrecord.data,
                rowData);
            delete rowData._id;
            dataSetJsonObject[tableRef._name].push(rowData);
            var beforeTableJsonObject = this._getTableInBeforeJsonObject(
                dataSetJsonObject, tableRef._name);
            var beforeRowData = {};
            beforeRowData["prods:id"] = jsrecord.data._id;
            tableRef._jsdo._copyRecord(tableRef, tableRef._beforeImage[
                jsrecord.data._id], beforeRowData);
            beforeTableJsonObject.push(beforeRowData)
        };
        this._getTableInBeforeJsonObject = function(dataSetJsonObject,
            tableName) {
            if (!dataSetJsonObject["prods:before"]) {
                dataSetJsonObject["prods:before"] = {}
            }
            var beforeObject = dataSetJsonObject["prods:before"];
            if (!beforeObject[tableName]) {
                beforeObject[tableName] = []
            }
            return beforeObject[tableName]
        };
        this.addRecords = function(jsonObject, addMode, keyFields,
            trackChanges, isInvoke) {
            if (this.isDataSet()) {
                if (jsonObject instanceof Array) {
                    if (!this._defaultTableRef) {
                        throw new Error(msg.getMsgText("jsdoMSG998"))
                    }
                } else {
                    if (jsonObject === undefined || jsonObject ===
                        null) {
                        jsonObject = {}
                    }
                    if (jsonObject[this._dataSetName]) {
                        jsonObject = jsonObject[this._dataSetName]
                    }
                }
                if (addMode != progress.data.JSDO.MODE_EMPTY) {
                    if (Object.keys(jsonObject).length === 0) {
                        throw new Error(msg.getMsgText("jsdoMSG006"))
                    }
                }
                var oldUseRelationships = this.useRelationships;
                this.useRelationships = false;
                try {
                    for (var buf in this._buffers) {
                        if (jsonObject[this._buffers[buf]._name]) {
                            this._addRecords(this._buffers[buf]._name,
                                jsonObject, addMode, keyFields,
                                trackChanges, isInvoke)
                        } else {
                            if (addMode == progress.data.JSDO.MODE_EMPTY) {
                                this._buffers[this._buffers[buf]._name]
                                    ._clearData()
                            }
                        }
                    }
                } finally {
                    this.useRelationships = oldUseRelationships
                }
            } else {
                if (this._defaultTableRef) {
                    this._addRecords(this._defaultTableRef._name,
                        jsonObject, addMode, keyFields,
                        trackChanges, isInvoke)
                }
            }
        };
        this._copyRecord = function(tableRef, source, target,
            onlyChangesRecord) {
            for (var field in source) {
                if (onlyChangesRecord !== undefined) {
                    if (source[field] == onlyChangesRecord[field]) {
                        continue
                    }
                }
                if (source[field] === undefined || source[field] ===
                    null) {
                    target[field] = source[field]
                } else {
                    if (source[field] instanceof Date) {
                        target[field] = source[field]
                    } else {
                        if (typeof source[field] === "object") {
                            var newObject = source[field] instanceof Array ? [] : {};
                            this._copyRecord(tableRef, source[field],
                                newObject);
                            target[field] = newObject
                        } else {
                            target[field] = source[field]
                        }
                    }
                }
            }
        };
        this._deleteProdsProperties = function(record, clearErrorString,
            deleteRowState) {
            if (typeof(clearErrorString) == "undefined") {
                clearErrorString = false
            }
            if (typeof(deleteRowState) == "undefined") {
                deleteRowState = true
            }
            if (record) {
                delete record["prods:id"];
                delete record["prods:hasErrors"];
                delete record["prods:clientId"];
                if (deleteRowState) {
                    delete record["prods:rowState"]
                }
                if (clearErrorString) {
                    delete record._errorString
                }
            }
        };
        this._addRecords = function(tableName, jsonObject, addMode,
            keyFields, trackChanges, isInvoke) {
            var beforeImageJsonObject = null;
            var beforeImageJsonIndex = null;
            if (jsonObject && (this._dataSetName !== undefined)) {
                if (jsonObject[this._dataSetName] && jsonObject[
                        this._dataSetName]["prods:hasChanges"]) {
                    beforeImageJsonObject = jsonObject;
                    beforeImageJsonIndex = {}
                } else {
                    if (jsonObject["prods:hasChanges"]) {
                        beforeImageJsonObject = {};
                        beforeImageJsonObject[this._dataSetName] =
                            jsonObject;
                        beforeImageJsonIndex = {}
                    }
                }
            }
            if (typeof(tableName) != "string") {
                throw new Error(msg.getMsgText("jsdoMSG020"))
            }
            if (!addMode) {
                throw new Error(msg.getMsgText("jsdoMSG021"))
            }
            switch (addMode) {
                case progress.data.JSDO.MODE_APPEND:
                case progress.data.JSDO.MODE_EMPTY:
                case progress.data.JSDO.MODE_MERGE:
                case progress.data.JSDO.MODE_REPLACE:
                    break;
                default:
                    throw new Error(msg.getMsgText("jsdoMSG022"))
            }
            if (!keyFields) {
                keyFields = []
            } else {
                if (!(keyFields instanceof Array) && (typeof(
                        keyFields) == "object")) {
                    if (keyFields[tableName]) {
                        keyFields = keyFields[tableName]
                    } else {
                        keyFields = []
                    }
                }
            }
            if (!(keyFields instanceof Array)) {
                throw new Error(msg.getMsgText("jsdoMSG008"))
            }
            if (this._buffers[tableName]._fields) {
                for (var i = 0; i < keyFields.length; i++) {
                    var field = this._buffers[tableName]._fields[
                        keyFields[i].toLowerCase()];
                    if (field === undefined) {
                        throw new Error(msg.getMsgText("jsdoMSG009",
                            keyFields[i]))
                    } else {
                        keyFields[i] = field.name
                    }
                }
            }
            trackChanges = trackChanges ? true : false;
            if (tableName) {
                if (!(jsonObject instanceof Array)) {
                    var data = null;
                    if (jsonObject === undefined || jsonObject ===
                        null) {
                        jsonObject = {}
                    }
                    if (this.isDataSet()) {
                        if (jsonObject[this._dataSetName]) {
                            data = jsonObject[this._dataSetName][
                                tableName
                            ]
                        } else {
                            if (jsonObject[tableName]) {
                                data = jsonObject[tableName]
                            }
                        }
                    } else {
                        if (this._dataProperty) {
                            data = jsonObject[this._dataProperty]
                        } else {
                            if (jsonObject.data) {
                                data = jsonObject.data
                            }
                        }
                    }
                    if (data instanceof Array) {
                        saveJsonObject = jsonObject;
                        jsonObject = data
                    } else {
                        if ((addMode == progress.data.JSDO.MODE_EMPTY) &&
                            (typeof(jsonObject) == "object") && (
                                Object.keys(jsonObject).length ===
                                0)) {
                            jsonObject = []
                        } else {
                            if ((addMode == progress.data.JSDO.MODE_REPLACE) &&
                                (typeof(jsonObject) == "object") &&
                                (beforeImageJsonObject)) {
                                jsonObject = []
                            }
                        }
                    }
                }
                if (!(jsonObject instanceof Array)) {
                    throw new Error(msg.getMsgText("jsdoMSG005",
                        tableName))
                }
                var dataHasBeenProcessed = false;
                try {
                    this._buffers[tableName]._sortRecords = false;
                    if (keyFields.length === 0 || addMode ==
                        progress.data.JSDO.MODE_EMPTY) {
                        if (addMode == progress.data.JSDO.MODE_EMPTY) {
                            this._buffers[tableName]._clearData()
                        }
                        for (var i = 0; i < jsonObject.length; i++) {
                            var jsrecord = this._buffers[tableName]
                                ._add(jsonObject[i], trackChanges,
                                    false);
                            jsonObject[i]._id = jsrecord.data._id;
                            if (beforeImageJsonIndex && jsonObject[
                                    i]["prods:id"]) {
                                beforeImageJsonIndex[jsonObject[i][
                                    "prods:id"
                                ]] = jsrecord.data._id
                            }
                            if (beforeImageJsonObject) {
                                this._deleteProdsProperties(
                                    jsrecord.data)
                            }
                        }
                    } else {
                        var tmpIndex;
                        if (this._buffers[tableName]._data.length *
                            jsonObject.length >= 10) {
                            tmpIndex = {};
                            for (var i = 0; i < this._buffers[
                                    tableName]._data.length; i++) {
                                var record = this._buffers[
                                    tableName]._data[i];
                                if (!record) {
                                    continue
                                }
                                var key = this._buffers[tableName]._getKey(
                                    record, keyFields);
                                tmpIndex[key] = record
                            }
                        } else {
                            tmpIndex = null
                        }
                        var checkBeforeImage = (Object.keys(this._buffers[
                                tableName]._beforeImage).length !==
                            0);
                        for (var i = 0; i < jsonObject.length; i++) {
                            var match = false;
                            var record = null;
                            if (tmpIndex) {
                                var key = this._buffers[tableName]._getKey(
                                    jsonObject[i], keyFields);
                                record = tmpIndex[key];
                                match = (record !== undefined)
                            } else {
                                for (var j = 0; j < this._buffers[
                                        tableName]._data.length; j++) {
                                    record = this._buffers[
                                        tableName]._data[j];
                                    if (!record) {
                                        continue
                                    }
                                    match = (this._buffers[
                                        tableName]._equalRecord(
                                        jsonObject[i],
                                        record, keyFields));
                                    if (match) {
                                        break
                                    }
                                }
                            }
                            if (match) {
                                if (isInvoke && (this._resource.idProperty !==
                                        undefined) && (jsonObject[i]
                                        ._id === undefined)) {
                                    jsonObject[i]._id = record._id
                                }
                                var beforeRecord = this._buffers[
                                    tableName]._beforeImage[
                                    record._id];
                                if (checkBeforeImage && (jsonObject[
                                            i]["prods:id"] !==
                                        undefined) && (typeof beforeRecord !==
                                        "undefined")) {
                                    var isAfterSame = this._sameData(
                                        jsonObject[i], record);
                                    var isBeforeSame = true;
                                    if (beforeRecord) {
                                        var beforeObject = this._getBeforeRecordFromObject(
                                            jsonObject[i],
                                            beforeImageJsonObject,
                                            tableName);
                                        if (beforeObject) {
                                            isBeforeSame = this._sameData(
                                                beforeObject,
                                                beforeRecord)
                                        }
                                    }
                                    if (!isAfterSame || !
                                        isBeforeSame) {
                                        throw new Error(msg.getMsgText(
                                            "jsdoMSG032"))
                                    }
                                }
                                switch (addMode) {
                                    case progress.data.JSDO.MODE_APPEND:
                                        throw new Error(msg.getMsgText(
                                            "jsdoMSG023"));
                                    case progress.data.JSDO.MODE_MERGE:
                                        if (beforeImageJsonIndex &&
                                            jsonObject[i][
                                                "prods:id"
                                            ]) {
                                            beforeImageJsonIndex[
                                                jsonObject[i][
                                                    "prods:id"
                                                ]] = record._id
                                        }
                                        break;
                                    case progress.data.JSDO.MODE_REPLACE:
                                        if (beforeImageJsonIndex &&
                                            jsonObject[i][
                                                "prods:id"
                                            ]) {
                                            beforeImageJsonIndex[
                                                jsonObject[i][
                                                    "prods:id"
                                                ]] = record._id
                                        }
                                        if (jsonObject[i]._id ===
                                            undefined) {
                                            jsonObject[i]._id =
                                                record._id
                                        }
                                        this._copyRecord(this._buffers[
                                                tableName],
                                            jsonObject[i],
                                            record);
                                        this._deleteProdsProperties(
                                            record);
                                        break;
                                    default:
                                        break
                                }
                            } else {
                                var jsrecord = this._buffers[
                                    tableName]._add(jsonObject[
                                    i], trackChanges, false);
                                jsonObject[i]._id = jsrecord.data._id;
                                if (beforeImageJsonIndex &&
                                    jsonObject[i]["prods:id"]) {
                                    beforeImageJsonIndex[jsonObject[
                                            i]["prods:id"]] =
                                        jsrecord.data._id
                                }
                                if (beforeImageJsonObject) {
                                    this._deleteProdsProperties(
                                        jsrecord.data)
                                }
                                if (tmpIndex) {
                                    var key = this._buffers[
                                        tableName]._getKey(
                                        jsrecord.data,
                                        keyFields);
                                    tmpIndex[key] = jsrecord.data
                                }
                            }
                        }
                        tmpIndex = null
                    }
                    dataHasBeenProcessed = true
                } finally {
                    this._buffers[tableName]._sortRecords = true;
                    this._buffers[tableName]._sort();
                    this._buffers[tableName]._createIndex();
                    if (dataHasBeenProcessed &&
                        beforeImageJsonObject) {
                        this._buffers[tableName]._loadBeforeImageData(
                            beforeImageJsonObject,
                            beforeImageJsonIndex, keyFields)
                    }
                }
            }
        };
        this._getBeforeRecordFromObject = function(afterRecord,
            jsonObject, tablename) {
            var beforeData = jsonObject[this._dataSetName][
                "prods:before"
            ];
            var id = afterRecord["prods:id"];
            var beforeRecord;
            if (!beforeData) {
                return beforeRecord
            }
            for (var i = 0; i < beforeData[tablename].length; i++) {
                var record = beforeData[tablename][i];
                if (record["prods:id"] && id == record["prods:id"]) {
                    beforeRecord = record;
                    break
                }
            }
            return beforeRecord
        };
        this._sameData = function(record1, record2) {
            var value1, value2;
            for (var fieldName in record1) {
                if (fieldName.substring(0, 5) != "prods" &&
                    fieldName != "_id") {
                    value1 = record1[fieldName];
                    value2 = record2[fieldName];
                    if (value1 > value2 || value1 === null) {
                        return false
                    } else {
                        if (value1 < value2 || value2 === null) {
                            return false
                        }
                    }
                }
            }
            return true
        };
        this._mergeRead = function(jsonObject, xhr) {
            if (this.isDataSet()) {
                if (this._dataProperty) {
                    var datasetBuffer = this._buffers[this._dataProperty];
                    datasetBuffer._data = jsonObject[this._dataSetName]
                        [this._dataProperty];
                    if (datasetBuffer.autoSort) {
                        datasetBuffer._sort()
                    }
                    datasetBuffer._createIndex()
                } else {
                    for (var buf in this._buffers) {
                        var data;
                        if (jsonObject[this._dataSetName]) {
                            data = jsonObject[this._dataSetName][
                                buf
                            ]
                        } else {
                            data = null
                        }
                        data = data ? data : [];
                        this._buffers[buf]._data = data;
                        if (this._buffers[buf].autoSort) {
                            this._buffers[buf]._sort()
                        }
                        this._buffers[buf]._createIndex();
                        if (jsonObject[this._dataSetName] &&
                            jsonObject[this._dataSetName][
                                "prods:hasChanges"
                            ]) {
                            this._buffers[buf]._loadBeforeImageData(
                                jsonObject)
                        }
                    }
                    if (this._numBuffers > 1) {
                        for (var buf in this._buffers) {
                            if (this._buffers[buf]._isNested &&
                                this._buffers[buf]._parent && this._buffers[
                                    this._buffers[buf]._parent]) {
                                var srcData = this._buffers[this._buffers[
                                    buf]._parent]._data;
                                var data = [];
                                for (var i = 0; i < srcData.length; i++) {
                                    if (srcData[i][buf] !==
                                        undefined) {
                                        for (var j = 0; j < srcData[
                                                i][buf].length; j++) {
                                            data.push(srcData[i][
                                                buf
                                            ][j])
                                        }
                                        delete srcData[i][buf]
                                    }
                                }
                                this._buffers[buf]._data = data;
                                if (this._buffers[buf].autoSort) {
                                    this._buffers[buf]._sort()
                                }
                                this._buffers[buf]._createIndex()
                            }
                        }
                    }
                }
            } else {
                if (jsonObject instanceof Array) {
                    this._defaultTableRef._data = jsonObject
                } else {
                    if (this._dataProperty) {
                        this._defaultTableRef._data = jsonObject[
                            this._dataProperty]
                    } else {
                        if (jsonObject.data) {
                            this._defaultTableRef._data =
                                jsonObject.data
                        } else {
                            this._defaultTableRef._data = [];
                            this._defaultTableRef._data[0] =
                                jsonObject
                        }
                    }
                }
            }
            for (var buf in this._buffers) {
                if (this._buffers[buf].autoSort) {
                    this._buffers[buf]._sort()
                }
                this._buffers[buf]._createIndex()
            }
        };
        this._mergeUpdateRecord = function(tableRef, recordId, record) {
            var index = tableRef._index[recordId].index;
            record._id = recordId;
            tableRef._data[index] = record;
            if (tableRef._jsdo._resource.idProperty !== undefined) {
                var id = tableRef._data[index][tableRef._jsdo._resource
                    .idProperty
                ];
                if (id !== undefined) {
                    delete tableRef._index[recordId];
                    id += "";
                    tableRef._index[id] = new progress.data.JSIndexEntry(
                        index);
                    record._id = id
                }
            }
            return record
        };
        this._setErrorString = function(tableRef, recordId, errorString,
            setInBeforeTable) {
            if (setInBeforeTable) {
                tableRef._beforeImage[recordId]._errorString =
                    errorString
            } else {
                var index = tableRef._index[recordId].index;
                tableRef._data[index]._errorString = errorString
            }
        };
        this._arrayFromDataObject = function(dataObject, tableRef) {
            var data;
            if (dataObject === undefined) {
                return undefined
            }
            if (this._dataSetName) {
                if (dataObject[this._dataSetName]) {
                    data = dataObject[this._dataSetName][tableRef._name]
                }
            } else {
                if (dataObject instanceof Array) {
                    data = dataObject
                } else {
                    if (this._dataProperty) {
                        data = dataObject[this._dataProperty]
                    } else {
                        if (dataObject.data) {
                            data = dataObject.data
                        }
                    }
                }
            }
            return data
        };
        this._mergeUpdateForCUD = function(jsonObject, xhr) {
            var hasError = false,
                errorString;
            if (this._dataSetName) {
                var dataSetJsonObject = jsonObject[this._dataSetName];
                var beforeJsonObject = dataSetJsonObject[
                    "prods:before"];
                var tableRef = xhr.request.jsrecord._tableRef;
                var tableJsonObject = this._arrayFromDataObject(
                    jsonObject, tableRef);
                if (tableJsonObject instanceof Array) {
                    if (tableJsonObject.length > 1) {
                        xhr.request.success = false;
                        throw new Error(msg.getMsgText("jsdoMSG100"))
                    }
                    for (var i = 0; i < tableJsonObject.length; i++) {
                        var recordId = xhr.request.jsrecord.getId();
                        if (!recordId) {
                            throw new Error(msg.getMsgText(
                                "jsdoMSG034",
                                "_mergeUpdateForCUD()"))
                        }
                        errorString = undefined;
                        if (tableJsonObject[i]["prods:hasErrors"]) {
                            var prods_id = tableJsonObject[i][
                                "prods:id"
                            ];
                            errorString = this._getErrorStringFromJsonObject(
                                dataSetJsonObject, tableRef,
                                prods_id);
                            hasError = true
                        }
                        var record = this._mergeUpdateRecord(
                            tableRef, recordId, tableJsonObject[
                                i]);
                        if (errorString) {
                            this._setErrorString(tableRef, recordId,
                                errorString, false)
                        }
                        xhr.request.jsrecord = new progress.data.JSRecord(
                            tableRef, record)
                    }
                }
            } else {
                var tableRef = this._defaultTableRef;
                var data = this._arrayFromDataObject(jsonObject);
                if (data instanceof Array) {
                    if (data.length > 1) {
                        xhr.request.success = false;
                        throw new Error(msg.getMsgText("jsdoMSG100"))
                    }
                    for (var i = 0; i < data.length; i++) {
                        var recordId = xhr.request.jsrecord.getId();
                        if (!recordId) {
                            throw new Error(msg.getMsgText(
                                "jsdoMSG034",
                                "_mergeUpdateForCUD()"))
                        }
                        var record = this._mergeUpdateRecord(
                            tableRef, recordId, data[i]);
                        xhr.request.jsrecord = new progress.data.JSRecord(
                            tableRef, record)
                    }
                }
            }
            return hasError
        };
        this._checkForDeleteError = function(dataSetJsonObject, xhr) {
            var hasError = false;
            var tableRef = xhr.request.jsrecord._tableRef;
            beforeJsonObject = dataSetJsonObject["prods:before"];
            if (beforeJsonObject) {
                var beforeTableJsonObject = beforeJsonObject[
                    tableRef._name];
                if (beforeTableJsonObject.length > 1) {
                    xhr.request.success = false;
                    throw new Error(msg.getMsgText("jsdoMSG100"))
                }
                var recordId = beforeTableJsonObject[0][
                    "prods:clientId"
                ];
                if (!recordId) {
                    throw new Error(msg.getMsgText("jsdoMSG035",
                        "_checkForDeleteError()"))
                }
                if (beforeTableJsonObject[0]["prods:hasErrors"]) {
                    var prods_id = beforeTableJsonObject[0][
                        "prods:id"
                    ];
                    var errorString = this._getErrorStringFromJsonObject(
                        dataSetJsonObject, tableRef, prods_id);
                    this._setErrorString(tableRef, recordId,
                        errorString, true);
                    hasError = true
                }
            }
            return hasError
        };
        this._mergeUpdateForSubmit = function(jsonObject, xhr) {
            var errorString;
            if (!this._dataSetName) {
                throw new Error(msg.getMsgText("jsdoMSG036",
                    "_mergeUpdateForSubmit()"))
            }
            var dataSetJsonObject = jsonObject[this._dataSetName];
            if (dataSetJsonObject[this._dataSetName]) {
                dataSetJsonObject = dataSetJsonObject[this._dataSetName]
            }
            var beforeJsonObject = dataSetJsonObject["prods:before"];
            for (var buf in this._buffers) {
                var tableRef = this._buffers[buf];
                var tableJsonObject = dataSetJsonObject[tableRef._name];
                if (tableJsonObject instanceof Array) {
                    for (var i = 0; i < tableJsonObject.length; i++) {
                        var recordId = tableJsonObject[i][
                            "prods:clientId"
                        ];
                        if (!recordId) {
                            throw new Error(msg.getMsgText(
                                "jsdoMSG035",
                                "_mergeUpdateForSubmit()"))
                        }
                        errorString = undefined;
                        if (tableJsonObject[i]["prods:hasErrors"]) {
                            var prods_id = tableJsonObject[i][
                                "prods:id"
                            ];
                            errorString = this._getErrorStringFromJsonObject(
                                dataSetJsonObject, tableRef,
                                prods_id)
                        }
                        var record = this._mergeUpdateRecord(
                            tableRef, recordId, tableJsonObject[
                                i]);
                        if (errorString) {
                            this._setErrorString(tableRef, recordId,
                                errorString, false)
                        }
                        var jsrecords = xhr.request.jsrecords;
                        for (var idx = 0; idx < jsrecords.length; idx++) {
                            if (jsrecords[idx].data._id == recordId) {
                                jsrecords[idx].data = record;
                                break
                            }
                        }
                    }
                }
            }
            if (beforeJsonObject) {
                for (var buf in this._buffers) {
                    var tableRef = this._buffers[buf];
                    var beforeTableJsonObject = beforeJsonObject[
                        tableRef._name];
                    if (beforeTableJsonObject instanceof Array) {
                        for (var i = 0; i < beforeTableJsonObject.length; i++) {
                            if (beforeTableJsonObject[i][
                                    "prods:rowState"
                                ] == "deleted") {
                                var recordId =
                                    beforeTableJsonObject[i][
                                        "prods:clientId"
                                    ];
                                if (!recordId) {
                                    throw new Error(msg.getMsgText(
                                        "jsdoMSG035",
                                        "_mergeUpdateForSubmit()"
                                    ))
                                }
                                if (beforeTableJsonObject[i][
                                        "prods:hasErrors"
                                    ]) {
                                    var prods_id =
                                        beforeTableJsonObject[i][
                                            "prods:id"
                                        ];
                                    var errorString = this._getErrorStringFromJsonObject(
                                        dataSetJsonObject,
                                        tableRef, prods_id);
                                    this._setErrorString(tableRef,
                                        recordId, errorString,
                                        true)
                                }
                            }
                        }
                    }
                }
            }
        };
        this._fireCUDTriggersForSubmit = function(request) {
            for (var idx = 0; idx < request.jsrecords.length; idx++) {
                this._deleteProdsProperties(request.jsrecords[idx].data,
                    false, false)
            }
            for (var idx = 0; idx < request.jsrecords.length; idx++) {
                var jsrecord = request.jsrecords[idx];
                switch (jsrecord.data["prods:rowState"]) {
                    case "created":
                        jsrecord._tableRef.trigger("afterCreate",
                            this, jsrecord, request.success,
                            request);
                        this.trigger("afterCreate", this, jsrecord,
                            request.success, request);
                        break;
                    case "modified":
                        jsrecord._tableRef.trigger("afterUpdate",
                            this, jsrecord, request.success,
                            request);
                        this.trigger("afterUpdate", this, jsrecord,
                            request.success, request);
                        break;
                    case "deleted":
                        jsrecord._tableRef.trigger("afterDelete",
                            this, jsrecord, request.success,
                            request);
                        this.trigger("afterDelete", this, jsrecord,
                            request.success, request);
                        break
                }
            }
        };
        this._getErrorStringFromJsonObject = function(dataSetJsonObject,
            tableRef, prods_id) {
            var tableJsonObject;
            var errorsJsonObject = dataSetJsonObject["prods:errors"];
            if (errorsJsonObject) {
                tableJsonObject = errorsJsonObject[tableRef._name]
            }
            if (tableJsonObject instanceof Array) {
                for (var i = 0; i < tableJsonObject.length; i++) {
                    var id = tableJsonObject[i]["prods:id"];
                    if (id === prods_id) {
                        var errorString = tableJsonObject[i][
                            "prods:error"
                        ];
                        return errorString === null ?
                            "Server returned unspecified error. Please check log files." :
                            errorString
                    }
                }
            }
            return undefined
        };
        this._fillSuccess = function(jsdo, success, request) {
            var xhr = request.xhr;
            jsdo._clearData();
            jsdo._mergeRead(request.response, xhr);
            for (var buf in jsdo._buffers) {
                if (!jsdo._buffers[buf]._parent || !jsdo.useRelationships) {
                    jsdo._buffers[buf]._setRecord(jsdo._buffers[buf]
                        ._findFirst())
                }
            }
        };
        this._fillComplete = function(jsdo, success, request) {
            jsdo.trigger("afterFill", jsdo, request.success,
                request);
            if (request.deferred) {
                if (success) {
                    request.deferred.resolve(jsdo, success, request)
                } else {
                    request.deferred.reject(jsdo, success, request)
                }
            }
        };
        this._fillError = function(jsdo, success, request) {
            jsdo._clearData()
        };
        this._undoCreate = function(tableRef, id) {
            var entry = tableRef._index[id];
            if (entry !== undefined) {
                var index = entry.index;
                tableRef._data[index] = null
            }
            tableRef._hasEmptyBlocks = true;
            delete tableRef._index[id];
            delete tableRef._beforeImage[id]
        };
        this._undoUpdate = function(tableRef, id, deleteProdsProps) {
            if (typeof(deleteProdsProps) == "undefined") {
                deleteProdsProps = false
            }
            var record = tableRef._beforeImage[id];
            if (record) {
                var index = tableRef._index[id].index;
                tableRef._jsdo._copyRecord(tableRef, record,
                    tableRef._data[index]);
                if (deleteProdsProps) {
                    tableRef._jsdo._deleteProdsProperties(tableRef._data[
                        index], true)
                }
            }
            delete tableRef._beforeImage[id]
        };
        this._undoDelete = function(tableRef, id, deleteProdsProps) {
            if (typeof(deleteProdsProps) == "undefined") {
                deleteProdsProps = false
            }
            var record = tableRef._beforeImage[id];
            if (record) {
                var index = record._index;
                delete record._index;
                if (deleteProdsProps) {
                    tableRef._jsdo._deleteProdsProperties(record,
                        true)
                }
                if ((index !== undefined) && (tableRef._data[index] ===
                        null)) {
                    tableRef._data[index] = record
                } else {
                    tableRef._data.push(record);
                    index = tableRef._data.length - 1
                }
                tableRef._index[id] = new progress.data.JSIndexEntry(
                    index)
            }
            delete tableRef._beforeImage[id]
        };
        this._deleteComplete = function(jsdo, success, request) {
            var xhr = request.xhr;
            var jsrecord = request.jsrecord;
            try {
                jsdo._deleteProdsProperties(jsrecord.data, false);
                jsrecord._tableRef.trigger("afterDelete", jsdo,
                    jsrecord, request.success, request);
                jsdo.trigger("afterDelete", jsdo, jsrecord, request
                    .success, request)
            } finally {
                request.complete = true;
                jsdo._checkSaveComplete(xhr)
            }
        };
        this._deleteSuccess = function(jsdo, success, request) {
            var xhr = request.xhr;
            var jsonObject = request.response;
            var beforeJsonObject = null;
            var dataSetJsonObject = null;
            var data;
            var hasError = false;
            if (jsdo._useBeforeImage("delete")) {
                dataSetJsonObject = jsonObject[jsdo._dataSetName];
                beforeJsonObject = dataSetJsonObject["prods:before"];
                if (beforeJsonObject) {
                    data = beforeJsonObject[request.jsrecord._tableRef
                        ._name]
                }
            } else {
                data = jsdo._arrayFromDataObject(jsonObject,
                    request.jsrecord._tableRef)
            }
            if (data instanceof Array) {
                if (data.length > 1) {
                    request.success = false;
                    throw new Error(msg.getMsgText("jsdoMSG100"))
                }
            }
            if (beforeJsonObject) {
                hasError = jsdo._checkForDeleteError(
                    dataSetJsonObject, xhr)
            }
            if (hasError) {
                request.success = false
            }
            if (jsdo.autoApplyChanges) {
                if (!hasError) {
                    delete request.jsrecord._tableRef._beforeImage[
                        request.jsrecord.data._id]
                } else {
                    jsdo._deleteError(jsdo, success, request)
                }
            }
        };
        this._deleteError = function(jsdo, success, request) {
            if (jsdo.autoApplyChanges) {
                jsdo._undoDelete(request.jsrecord._tableRef,
                    request.jsrecord.data._id)
            }
        };
        this._createComplete = function(jsdo, success, request) {
            var xhr = request.xhr;
            var jsrecord = request.jsrecord;
            try {
                jsdo._deleteProdsProperties(jsrecord.data, false);
                jsrecord._tableRef.trigger("afterCreate", jsdo,
                    jsrecord, request.success, request);
                jsdo.trigger("afterCreate", jsdo, jsrecord, request
                    .success, request)
            } finally {
                request.complete = true;
                jsdo._checkSaveComplete(xhr)
            }
        };
        this._createSuccess = function(jsdo, success, request) {
            var xhr = request.xhr;
            var record = request.response;
            var hasError = jsdo._mergeUpdateForCUD(record, xhr);
            if (hasError) {
                request.success = false
            }
            if (jsdo.autoApplyChanges) {
                if (!hasError) {
                    delete request.jsrecord._tableRef._beforeImage[
                        request.jsrecord.data._id]
                } else {
                    jsdo._createError(jsdo, success, request)
                }
            }
        };
        this._createError = function(jsdo, success, request) {
            if (jsdo.autoApplyChanges) {
                jsdo._undoCreate(request.jsrecord._tableRef,
                    request.jsrecord.data._id)
            }
        };
        this._updateComplete = function(jsdo, success, request) {
            var xhr = request.xhr;
            var jsrecord = request.jsrecord;
            try {
                jsdo._deleteProdsProperties(jsrecord.data, false);
                jsrecord._tableRef.trigger("afterUpdate", jsdo,
                    jsrecord, request.success, request);
                jsdo.trigger("afterUpdate", jsdo, jsrecord, request
                    .success, request)
            } finally {
                request.complete = true;
                jsdo._checkSaveComplete(xhr)
            }
        };
        this._updateSuccess = function(jsdo, success, request) {
            var xhr = request.xhr;
            var hasError = jsdo._mergeUpdateForCUD(request.response,
                xhr);
            if (hasError) {
                request.success = false
            }
            if (jsdo.autoApplyChanges) {
                if (!hasError) {
                    request.success = true;
                    delete request.jsrecord._tableRef._beforeImage[
                        request.jsrecord.data._id]
                } else {
                    jsdo._updateError(jsdo, success, request)
                }
            }
        };
        this._updateError = function(jsdo, success, request) {
            var makeSuccessFalse = true;
            if (jsdo.autoApplyChanges) {
                request.success = false;
                jsdo._undoUpdate(request.jsrecord._tableRef,
                    request.jsrecord.data._id)
            }
        };
        this._saveChangesSuccess = function(jsdo, success, request) {
            var records = request.response;
            jsdo._mergeUpdateForSubmit(records, request.xhr);
            jsdo._clearErrors();
            var changes = jsdo.getChanges();
            jsdo._updateLastErrors(jsdo, null, changes);
            if (jsdo.autoApplyChanges) {
                jsdo._applyChanges()
            }
        };
        this._saveChangesError = function(jsdo, success, request) {
            if (jsdo.autoApplyChanges) {
                jsdo.rejectChanges()
            }
        };
        this._saveChangesSuccessTT = function(jsdo, success, request) {
            var changes;
            jsdo._clearErrors();
            changes = jsdo.getChanges();
            jsdo._updateLastErrors(jsdo, null, changes)
        };
        this._saveChangesComplete = function(jsdo, success, request) {
            if ((request.xhr.status >= 200 && request.xhr.status <
                    300) && jsdo._lastErrors.length > 0) {
                request.success = false
            }
            if (jsdo._useSubmit === true) {
                jsdo._fireCUDTriggersForSubmit(request)
            }
            jsdo._undefWorkingRecord();
            jsdo._fireAfterSaveChanges(request.success, request)
        };
        this._fireAfterSaveChanges = function(success, request) {
            this.trigger("afterSaveChanges", this, success, request);
            if (request.jsrecords) {
                if (request.deferred) {
                    if (success) {
                        request.deferred.resolve(this, success,
                            request)
                    } else {
                        request.deferred.reject(this, success,
                            request)
                    }
                }
            } else {
                if (request.batch && request.batch.deferred) {
                    if (success) {
                        request.batch.deferred.resolve(this,
                            success, request)
                    } else {
                        request.batch.deferred.reject(this, success,
                            request)
                    }
                }
            }
            var clearErrorString = this.autoApplyChanges;
            if (request.jsrecords) {
                for (var idx = 0; idx < request.jsrecords.length; idx++) {
                    var jsrecord = request.jsrecords[idx];
                    if (clearErrorString) {
                        delete jsrecord.data._errorString
                    }
                    delete jsrecord.data["prods:rowState"]
                }
            } else {
                if (request.batch && request.batch.operations) {
                    for (var idx = 0; idx < request.batch.operations
                        .length; idx++) {
                        var jsrecord = request.batch.operations[idx]
                            .jsrecord;
                        if (clearErrorString) {
                            delete jsrecord.data._errorString
                        }
                    }
                }
            }
        };
        this._updateLastErrors = function(jsdo, batch, changes) {
            if (batch) {
                if (batch.operations === undefined) {
                    return
                }
                for (var i = 0; i < batch.operations.length; i++) {
                    var request = batch.operations[i];
                    if (!request.success && request.xhr && request.xhr
                        .status == 500) {
                        var errors = "";
                        try {
                            var responseObject = JSON.parse(request
                                .xhr.responseText);
                            if (responseObject._errors instanceof Array) {
                                for (var j = 0; j < responseObject._errors
                                    .length; j++) {
                                    errors += responseObject._errors[
                                        j]._errorMsg + "\n"
                                }
                            }
                            if (responseObject._retVal) {
                                errors += responseObject._retVal
                            }
                        } catch (e) {}
                        if (request.exception) {
                            if (errors.length === 0) {
                                errors = request.exception
                            } else {
                                errors += "\n" + request.exception
                            }
                        }
                        jsdo._lastErrors.push({
                            errorString: errors
                        })
                    }
                }
            } else {
                if (changes instanceof Array) {
                    for (var i = 0; i < changes.length; i++) {
                        if (changes[i].record && changes[i].record.data
                            ._errorString !== undefined) {
                            jsdo._lastErrors.push({
                                errorString: changes[i].record
                                    .data._errorString
                            });
                            jsdo._buffers[changes[i].record._tableRef
                                ._name]._lastErrors.push({
                                id: changes[i].record.data._id,
                                error: changes[i].record.data
                                    ._errorString
                            })
                        }
                    }
                }
            }
        };
        this._checkSaveComplete = function(xhr) {
            if (xhr.request) {
                var jsdo = xhr.request.jsdo;
                var batch = xhr.request.batch;
                if (jsdo && batch && jsdo._async) {
                    if (jsdo._isBatchComplete(batch)) {
                        var success = jsdo._isBatchSuccess(batch);
                        var request = {
                            batch: batch,
                            success: success
                        };
                        jsdo._undefWorkingRecord();
                        jsdo._lastErrors = [];
                        if (!success && batch.operations) {
                            jsdo._updateLastErrors(jsdo, batch,
                                null)
                        }
                        jsdo._fireAfterSaveChanges(success, request)
                    }
                }
            }
        };
        this._isBatchSuccess = function(batch) {
            if (batch.operations) {
                for (var i = 0; i < batch.operations.length; i++) {
                    if (!batch.operations[i].success) {
                        return false
                    }
                }
            }
            return true
        };
        this._isBatchComplete = function(batch) {
            if (batch.operations) {
                for (var i = 0; i < batch.operations.length; i++) {
                    var request = batch.operations[i];
                    if (!request.complete) {
                        return false
                    }
                }
            }
            return true
        };
        this._mergeInvoke = function(jsonObject, xhr) {
            var operation;
            if (xhr.request.fnName !== undefined && xhr.jsdo._resource
                .fn[xhr.request.fnName] !== undefined) {
                operation = xhr.jsdo._resource.fn[xhr.request.fnName]
                    .operation
            } else {
                operation = null
            }
            if (operation === undefined) {
                operation = null;
                for (var i = 0; i < xhr.jsdo._resource.operations.length; i++) {
                    if (xhr.jsdo._resource.operations[i].name ==
                        xhr.request.fnName) {
                        operation = xhr.jsdo._resource.operations[i];
                        break
                    }
                }
                xhr.jsdo._resource.fn[xhr.request.fnName].operation =
                    operation
            }
            if (operation !== null && operation.mergeMode) {
                try {
                    var mergeMode = progress.data.JSDO["MODE_" +
                        operation.mergeMode.toUpperCase()];
                    if (mergeMode === null) {
                        throw new Error(msg.getMsgText("jsdoMSG030",
                            "mergeMode property",
                            "EMPTY, APPEND, MERGE or REPLACE"
                        ))
                    }
                    if (xhr.jsdo._resource.idProperty === undefined) {
                        throw new Error(msg.getMsgText("jsdoMSG110",
                            this._resource.name,
                            " by mergeMode property in invoke operation"
                        ))
                    }
                    var dataParameterName;
                    if (xhr.jsdo.isDataSet()) {
                        dataParameterName = xhr.jsdo._resource._dataSetName
                    } else {
                        if (xhr.jsdo._resource.dataProperty !==
                            undefined) {
                            dataParameterName = xhr.jsdo._resource.dataProperty
                        } else {
                            if (xhr.jsdo._resource._tempTableName !==
                                undefined) {
                                dataParameterName = xhr.jsdo._resource
                                    ._tempTableName
                            } else {
                                throw new Error(msg.getMsgText(
                                    "jsdoMSG111", ""))
                            }
                        }
                    }
                    var found = false;
                    for (var i = 0; i < operation.params.length; i++) {
                        if (operation.params[i].name ==
                            dataParameterName) {
                            if (operation.params[i].type.indexOf(
                                    "RESPONSE_BODY") != -1) {
                                if ((operation.params[i].xType !==
                                        undefined) && (operation.params[
                                        i].xType != "DATASET") && (
                                        operation.params[i].xType !=
                                        "TABLE") && (operation.params[
                                        i].xType != "ARRAY")) {
                                    throw new Error(msg.getMsgText(
                                        "jsdoMSG113",
                                        operation.params[i]
                                        .xType,
                                        dataParameterName,
                                        xhr.request.fnName))
                                }
                                found = true;
                                break
                            }
                        }
                    }
                    if (!found) {
                        throw new Error(msg.getMsgText("jsdoMSG112",
                            dataParameterName, xhr.request.fnName
                        ))
                    }
                    xhr.jsdo.addRecords(xhr.request.response[
                        dataParameterName], mergeMode, [xhr
                        .jsdo._resource.idProperty
                    ], false, true)
                } catch (e) {
                    xhr.request.success = false;
                    xhr.request.exception = e
                }
            }
        };
        this.onReadyStateChangeGeneric = function() {
            var xhr = this;
            if (xhr.readyState == 4) {
                var request = xhr.request;
                try {
                    request.response = JSON.parse(xhr.responseText);
                    if (request.response && request.response.response) {
                        request.response = request.response.response
                    }
                } catch (e) {
                    request.response = undefined
                }
                try {
                    if ((xhr.status >= 200 && xhr.status < 300) ||
                        (xhr.status === 0 && xhr.responseText !==
                            "")) {
                        request.success = true;
                        xhr.jsdo._session._saveClientContextId(xhr);
                        if ((typeof xhr.onSuccessFn) == "function") {
                            var operation;
                            if (xhr.request.fnName !== undefined &&
                                xhr.jsdo._resource.fn[xhr.request.fnName] !==
                                undefined) {
                                operation = xhr.jsdo._resource.fn[
                                    xhr.request.fnName].operation
                            } else {
                                operation = null
                            }
                            if ((operation === undefined) || (
                                    operation !== null && operation
                                    .mergeMode)) {
                                xhr.jsdo._mergeInvoke(request.response,
                                    xhr)
                            }
                            if (request.success) {
                                xhr.onSuccessFn(xhr.jsdo, request.success,
                                    request)
                            } else {
                                if ((typeof xhr.onErrorFn) ==
                                    "function") {
                                    xhr.onErrorFn(xhr.jsdo, request
                                        .success, request)
                                }
                            }
                        }
                    } else {
                        request.success = false;
                        if (xhr.status === 0) {
                            request.exception = new Error(msg.getMsgText(
                                "jsdoMSG101"))
                        }
                        if ((typeof xhr.onErrorFn) == "function") {
                            xhr.onErrorFn(xhr.jsdo, request.success,
                                request)
                        }
                    }
                } catch (e) {
                    request.exception = e;
                    if ((typeof xhr.onErrorFn) == "function") {
                        xhr.onErrorFn(xhr.jsdo, request.success,
                            request)
                    }
                }
                xhr.jsdo._session._checkServiceResponse(xhr,
                    request.success, request);
                if ((typeof xhr.onCompleteFn) == "function") {
                    xhr.onCompleteFn(xhr.jsdo, request.success,
                        request)
                }
            }
        };
        this.acceptChanges = function() {
            for (var buf in this._buffers) {
                this._buffers[this._buffers[buf]._name].acceptChanges()
            }
        };
        this.rejectChanges = function() {
            for (var buf in this._buffers) {
                this._buffers[this._buffers[buf]._name].rejectChanges()
            }
        };
        this.getChanges = function() {
            var result = [];
            for (var buf in this._buffers) {
                var changes = this._buffers[this._buffers[buf]._name]
                    .getChanges();
                result = result.concat(changes)
            }
            return result
        };
        this.hasChanges = function() {
            for (var buf in this._buffers) {
                if (this._buffers[this._buffers[buf]._name].hasChanges()) {
                    return true
                }
            }
            return false
        };
        this._applyChanges = function() {
            for (var buf in this._buffers) {
                this._buffers[this._buffers[buf]._name]._applyChanges()
            }
        };
        this.acceptRowChanges = function() {
            if (this._defaultTableRef) {
                return this._defaultTableRef.acceptRowChanges()
            }
            throw new Error(msg.getMsgText("jsdoMSG001",
                "acceptRowChanges()"))
        };
        this.rejectRowChanges = function() {
            if (this._defaultTableRef) {
                return this._defaultTableRef.rejectRowChanges()
            }
            throw new Error(msg.getMsgText("jsdoMSG001",
                "rejectRowChanges()"))
        };
        this.saveLocal = function saveLocal(arg1, arg2) {
            var name;
            var dataMode;
            if (arguments.length > 2) {
                throw new Error(msg.getMsgText("jsdoMSG024", "JSDO",
                    arguments.callee.name + "()"))
            }
            if (typeof(arg1) == "string" || arg1 === null || arg1 ===
                undefined) {
                name = arg1;
                dataMode = arg2
            } else {
                name = null;
                dataMode = arg1
            }
            if (name === undefined || name === null || name === "") {
                name = "jsdo_" + this._resource.service.name + "_" +
                    this._resource.name
            }
            if (typeof(dataMode) == "undefined") {
                dataMode = progress.data.JSDO.ALL_DATA
            } else {
                switch (dataMode) {
                    case progress.data.JSDO.ALL_DATA:
                    case progress.data.JSDO.CHANGES_ONLY:
                        break;
                    default:
                        throw new Error(msg.getMsgText("jsdoMSG115",
                            arguments.callee.name))
                }
            }
            if (this._localStorage === null) {
                this._localStorage = new progress.data.LocalStorage()
            }
            var dataObj = this._prepareDataObjectForLocalStorage(
                dataMode);
            this._localStorage.saveToLocalStorage(name, dataObj)
        };
        this.readLocal = function readLocal(name) {
            if (arguments.length > 1) {
                throw new Error(msg.getMsgText("jsdoMSG024", "JSDO",
                    arguments.callee.name + "()"))
            }
            if (name === undefined || name === null || name === "") {
                name = "jsdo_" + this._resource.service.name + "_" +
                    this._resource.name
            } else {
                if (typeof(name) != "string") {
                    throw new Error(msg.getMsgText("jsdoMSG116",
                        "name", arguments.callee.name +
                        "()"))
                }
            }
            if (this._localStorage === null) {
                this._localStorage = new progress.data.LocalStorage()
            }
            var object = this._localStorage.readFromLocalStorage(
                name);
            if (object) {
                if (this._hasMatchingSchema(object) === false) {
                    throw new Error(msg.getMsgText("jsdoMSG117",
                        name))
                }
                this._restoreFromLocalStorage(object, progress.data
                    .JSDO.MODE_EMPTY)
            }
            return object !== null
        };
        this.addLocalRecords = function addLocalRecords(arg1, arg2,
            arg3) {
            var name;
            var addMode;
            var keyFields;
            if (arguments.length < 1) {
                throw new Error(msg.getMsgText("jsdoMSG024", "JSDO",
                    arguments.callee.name + "()"))
            }
            if (typeof(arg1) == "string") {
                name = arg1;
                addMode = arg2;
                keyFields = arg3
            } else {
                name = "jsdo_" + this._resource.service.name + "_" +
                    this._resource.name;
                addMode = arg1;
                keyFields = arg2
            }
            if (typeof(name) == "undefined" || name === null ||
                name === "") {
                name = "jsdo_" + this._resource.service.name + "_" +
                    this._resource.name
            } else {
                if (typeof(name) != "string") {
                    throw new Error(msg.getMsgText("jsdoMSG116",
                        "name", arguments.callee.name +
                        "()"))
                }
            }
            if (addMode != progress.data.JSDO.MODE_REPLACE) {
                throw new Error(msg.getMsgText("jsdoMSG115",
                    arguments.callee.name))
            }
            if (this._localStorage === null) {
                this._localStorage = new progress.data.LocalStorage()
            }
            var object = this._localStorage.readFromLocalStorage(
                name);
            if (object) {
                if (this._hasMatchingSchema(object) === false) {
                    throw new Error(msg.getMsgText("jsdoMSG117",
                        name))
                }
                try {
                    this._restoreFromLocalStorage(object, addMode,
                        keyFields)
                } catch (e) {
                    var text = e.message;
                    throw new Error(text.replace(new RegExp(
                            "addRecords", "g"),
                        "addLocalRecords"))
                }
            }
            return object !== null
        };
        this._containsPrimaryKeys = function _containsPrimaryKeys() {
            for (var buf in this._buffers) {
                if (this._buffers[buf]._primaryKeys === null) {
                    return false
                }
            }
            return true
        };
        this._hasMatchingSchema = function _hasMatchingSchema(
            storageObject) {
            var isValid = true;
            if (storageObject === null || (Object.keys(
                    storageObject).length === 0)) {
                return true
            }
            if (this._dataSetName) {
                if (storageObject[this._dataSetName]) {
                    for (var buf in this._buffers) {
                        if (storageObject[this._dataSetName][buf] ===
                            undefined) {
                            isValid = false;
                            break
                        }
                    }
                } else {
                    isValid = false
                }
            } else {
                if (this._dataProperty) {
                    storageObject = storageObject._localStorage;
                    if (storageObject === undefined ||
                        storageObject[this._dataProperty] ===
                        undefined) {
                        isValid = false
                    }
                } else {
                    storageObject = storageObject._localStorage;
                    if (storageObject === undefined ||
                        storageObject[this._defaultTableRef._name] ===
                        undefined) {
                        isValid = false
                    }
                }
            }
            return isValid
        };
        this.deleteLocal = function deleteLocal(name) {
            if (arguments.length > 1) {
                throw new Error(msg.getMsgText("jsdoMSG024", "JSDO",
                    arguments.callee.name + "()"))
            }
            if (name === undefined || name === null || name === "") {
                name = "jsdo_" + this._resource.service.name + "_" +
                    this._resource.name
            } else {
                if (typeof(name) != "string") {
                    throw new Error(msg.getMsgText("jsdoMSG116",
                        "name", arguments.callee.name +
                        "()"))
                }
            }
            if (this._localStorage === null) {
                this._localStorage = new progress.data.LocalStorage()
            }
            this._localStorage.clearLocalStorage(name)
        };
        this._prepareDataObjectForLocalStorage = function(option) {
            var storageObject = {};
            if (this._dataSetName) {
                switch (option) {
                    case progress.data.JSDO.ALL_DATA:
                        storageObject = this._createDataAndChangeSet(
                            this._dataSetName);
                        break;
                    case progress.data.JSDO.CHANGES_ONLY:
                        storageObject = this._createChangeSet(this._dataSetName,
                            true);
                        break
                }
            } else {
                if (this._dataProperty) {
                    switch (option) {
                        case progress.data.JSDO.ALL_DATA:
                            storageObject = this._createDataAndChangeSet(
                                "_localStorage");
                            break;
                        case progress.data.JSDO.CHANGES_ONLY:
                            storageObject = this._createChangeSet(
                                "_localStorage", true);
                            break
                    }
                } else {
                    switch (option) {
                        case progress.data.JSDO.ALL_DATA:
                            storageObject = this._createDataAndChangeSet(
                                "_localStorage");
                            break;
                        case progress.data.JSDO.CHANGES_ONLY:
                            storageObject = this._createChangeSet(
                                "_localStorage", true);
                            break
                    }
                }
            }
            return storageObject
        };
        this._restoreFromLocalStorage = function(storageObject, addMode,
            keyFields) {
            if (storageObject && (Object.keys(storageObject).length >
                    0)) {
                if (this._dataSetName) {
                    for (var buf in this._buffers) {
                        this._restoreDataForTable(this._buffers[buf],
                            storageObject, addMode, keyFields)
                    }
                } else {
                    this._restoreDataForTable(this._defaultTableRef,
                        storageObject, addMode, keyFields)
                }
            } else {
                if (addMode === progress.data.JSDO.MODE_EMPTY) {
                    this._clearData()
                }
            }
        };
        this._restoreDataForTable = function(tableRef, jsonObject,
            addMode, keyFields) {
            keyFields = keyFields !== undefined ? keyFields :
                tableRef._primaryKeys;
            if (keyFields === undefined && this._resource.idProperty) {
                keyFields = [];
                keyFields[0] = this._resource.idProperty
            }
            if (this._dataSetName) {
                var oldUseRelationships = this.useRelationships;
                this.useRelationships = false;
                try {
                    tableRef.addRecords(jsonObject, addMode,
                        keyFields)
                } finally {
                    this.useRelationships = oldUseRelationships
                }
            } else {
                this._dataSetName = "_localStorage";
                tableRef.addRecords(jsonObject, addMode, keyFields);
                this._dataSetName = null
            }
        };
        this.getMethodProperties = function(operation, name) {
            var idx;
            if (this._resource._operations) {
                if (this._resource._operations[operation]) {
                    return this._resource._operations[operation]
                }
            } else {
                this._resource._operations = {}
            }
            for (var idx = 0; idx < this._resource.operations.length; idx++) {
                if (this._resource.operations[idx].type ==
                    operation) {
                    return (this._resource._operations[operation] =
                        this._resource.operations[idx])
                }
            }
        };
        if (autoFill) {
            this.fill()
        }
    };
    if ((typeof Object.defineProperty) == "function") {
        Object.defineProperty(progress.data.JSDO, "MODE_APPEND", {
            value: 1,
            enumerable: true
        });
        Object.defineProperty(progress.data.JSDO, "MODE_EMPTY", {
            value: 2,
            enumerable: true
        });
        Object.defineProperty(progress.data.JSDO, "MODE_MERGE", {
            value: 3,
            enumerable: true
        });
        Object.defineProperty(progress.data.JSDO, "MODE_REPLACE", {
            value: 4,
            enumerable: true
        })
    } else {
        progress.data.JSDO.MODE_APPEND = 1;
        progress.data.JSDO.MODE_EMPTY = 2;
        progress.data.JSDO.MODE_MERGE = 3;
        progress.data.JSDO.MODE_REPLACE = 4
    }
    progress.data.JSDO._OP_CREATE = 1;
    progress.data.JSDO._OP_READ = 2;
    progress.data.JSDO._OP_UPDATE = 3;
    progress.data.JSDO._OP_DELETE = 4;
    progress.data.JSDO._OP_SUBMIT = 5;
    progress.data.JSDO.ALL_DATA = 1;
    progress.data.JSDO.CHANGES_ONLY = 2;
    progress.data.JSDO.prototype = new progress.util.Observable();
    progress.data.JSDO.prototype.constructor = progress.data.JSDO;
    progress.data.JSDO.prototype.toString = function(radix) {
        return "JSDO"
    };
    progress.data.JSTableRef.prototype = new progress.util.Observable();
    progress.data.JSTableRef.prototype.constructor = progress.data.JSTableRef;
    progress.data.JSTableRef.prototype.toString = function(radix) {
        return "JSTableRef"
    };
    progress.data.PluginManager.addPlugin("JFP", {
        requestMapping: function(jsdo, params, info) {
            var sortFields, field, ablFilter, sqlQuery,
                methodProperties, capabilities, index,
                capabilitiesObject, reqCapabilities = {
                    filter: {
                        options: ["ablFilter", "sqlQuery"],
                        mapping: undefined
                    },
                    top: {
                        options: ["top"],
                        mapping: undefined
                    },
                    skip: {
                        options: ["skip"],
                        mapping: undefined
                    },
                    id: {
                        options: ["id"],
                        mapping: undefined
                    },
                    sort: {
                        options: ["orderBy"],
                        mapping: undefined
                    }
                },
                doConversion = true,
                param;
            if (info.operation === "read") {
                capabilitiesObject = {};
                methodProperties = jsdo.getMethodProperties(
                    info.operation);
                capabilities = methodProperties.capabilities;
                if (capabilities) {
                    capabilities = capabilities.replace(/\s/g,
                        "").split(",");
                    for (index = 0; index < capabilities.length; index +=
                        1) {
                        capabilitiesObject[capabilities[index]] =
                            true
                    }
                }
                for (param in params) {
                    if (param && (params[param] !== undefined) &&
                        reqCapabilities[param]) {
                        for (index = 0; index < reqCapabilities[
                                param].options.length; index +=
                            1) {
                            option = reqCapabilities[param].options[
                                index];
                            if (capabilitiesObject[option]) {
                                reqCapabilities[param].mapping =
                                    option;
                                break
                            }
                        }
                        if (!reqCapabilities[param].mapping) {
                            throw new Error(msg.getMsgText(
                                "jsdoMSG120",
                                reqCapabilities[param].options
                                .join("' or '"), param))
                        }
                    }
                }
                if (params.sort) {
                    sortFields = "";
                    for (index = 0; index < params.sort.length; index +=
                        1) {
                        field = params.sort[index].field;
                        if (params.sort[index].dir == "desc") {
                            field += " DESC"
                        }
                        sortFields += field;
                        if (index < params.sort.length - 1) {
                            sortFields += ","
                        }
                    }
                }
                if (params.filter) {
                    if (typeof params.filter === "string") {
                        doConversion = false
                    }
                    if (jsdo._defaultTableRef && params.tableRef ===
                        undefined) {
                        params.tableRef = jsdo._defaultTableRef
                            ._name
                    }
                    if (doConversion && (params.tableRef ===
                            undefined)) {
                        throw new Error(msg.getMsgText(
                            "jsdoMSG045",
                            "fill() or read()",
                            "params", "tableRef"))
                    }
                    if (reqCapabilities.filter.mapping ===
                        "ablFilter") {
                        if (doConversion) {
                            ablFilter = progress.util._convertToABLWhereString(
                                jsdo._buffers[params.tableRef],
                                params.filter)
                        } else {
                            ablFilter = params.filter
                        }
                    } else {
                        if (reqCapabilities.filter.mapping ===
                            "sqlQuery") {
                            if (doConversion) {
                                sqlQuery = progress.util._convertToSQLQueryString(
                                    jsdo._buffers[params.tableRef],
                                    params.filter, true)
                            } else {
                                sqlQuery = params.filter
                            }
                        }
                    }
                }
                filter = JSON.stringify({
                    ablFilter: ablFilter,
                    sqlQuery: sqlQuery,
                    orderBy: sortFields,
                    skip: params.skip,
                    top: params.top
                });
                params = {
                    filter: filter
                }
            }
            return params
        }
    });
    if (typeof progress.ui == "undefined") {
        progress.ui = {}
    }
    progress.ui.UITableRef = function UITableRef(tableRef) {
        this._tableRef = tableRef;
        this._listview = null;
        this._detailPage = null;
        this._listviewContent = undefined;
        this.addItem = function(format) {
            var detailForm;
            if (!this._tableRef.record) {
                throw new Error(msg.getMsgText("jsdoMSG002", this._name))
            }
            if (!this._listview) {
                return
            }
            format = format ? format : this._listview.format;
            detailForm = (this._detailPage && this._detailPage.name) ?
                this._detailPage.name : "";
            if (this._listviewContent === undefined) {
                this.clearItems()
            }
            var text = this._listview.itemTemplate ? this._listview
                .itemTemplate : progress.ui.UIHelper._itemTemplate;
            text = text.replace(new RegExp("{__format__}", "g"),
                format);
            text = text.replace(new RegExp("{__id__}", "g"), this._tableRef
                .record.data._id);
            text = text.replace(new RegExp("{__page__}", "g"),
                detailForm);
            for (var field in this._tableRef.record.data) {
                var value = this._tableRef.record.data[field];
                text = text.replace(new RegExp("{" + field + "}",
                    "g"), (value !== undefined && value !==
                    null) ? value : "")
            }
            this._listviewContent += text
        };
        this.clearItems = function() {
            if (this._listview) {
                this._listviewContent = "";
                var listviewElement = document.getElementById(this._listview
                    .name);
                if (listviewElement) {
                    listviewElement.innerHTML = ""
                }
            }
        };
        this._getFormFieldValue = function(fieldName, detailPageName) {
            var value = null;
            if (detailPageName === undefined) {
                if (this._detailPage && this._detailPage.name) {
                    detailPageName = this._detailPage.name
                }
            }
            if (typeof($) == "function" && detailPageName) {
                field = $("#" + detailPageName + " #" + fieldName);
                if (!field || field.length === 0) {
                    field = $("#" + detailPageName + ' [dsid="' +
                        fieldName + '"]')
                }
                if (field && field.length == 1) {
                    value = field.val()
                }
            } else {
                field = document.getElementById(fieldName);
                if (field) {
                    value = field.value
                }
            }
            return value
        };
        this._setFormField = function(fieldName, value, detailPageName) {
            var field = null;
            if (detailPageName === undefined) {
                if (this._detailPage && this._detailPage.name) {
                    detailPageName = this._detailPage.name
                }
            }
            if (typeof($) == "function" && detailPageName) {
                field = $("#" + detailPageName + " #" + fieldName);
                if (!field || field.length === 0) {
                    field = $("#" + detailPageName + ' [dsid="' +
                        fieldName + '"]')
                }
                if (field && field.length == 1) {
                    field.val(value)
                }
            } else {
                field = document.getElementById(fieldName);
                if (field) {
                    field.value = value
                }
            }
        };
        this.assign = function(detailPageName) {
            if (!this._tableRef.record) {
                throw new Error(msg.getMsgText("jsdoMSG002", this._tableRef
                    ._name))
            }
            if ((arguments.length !== 0) && (typeof detailPageName !=
                    "string")) {
                throw new Error(msg.getMsgText("jsdoMSG024",
                    "UIHelper", "assign()"))
            }
            this._tableRef.record.assign(null);
            var fieldName;
            var schema = this._tableRef.getSchema();
            for (var i = 0; i < schema.length; i++) {
                fieldName = schema[i].name;
                if (fieldName == "_id") {
                    continue
                }
                var value = this._getFormFieldValue(fieldName,
                    detailPageName);
                if (typeof value != "undefined") {
                    if (typeof value == "string" && schema[i].type !=
                        "string") {
                        value = this._tableRef._jsdo._convertType(
                            value, schema[i].type, schema[i].items ?
                            schema[i].items.type : null)
                    }
                    this._tableRef.record.data[fieldName] = value
                }
            }
            this._tableRef.record._sortRecord();
            return true
        };
        this.display = function(pageName) {
            if (!this._tableRef.record) {
                throw new Error(msg.getMsgText("jsdoMSG002", this._tableRef
                    ._name))
            }
            var schema = this._tableRef.getSchema();
            for (var i = 0; i < schema.length; i++) {
                this._setFormField(schema[i].name, this._tableRef.record
                    .data[schema[i].name], pageName)
            }
            this._setFormField("_id", this._tableRef.record.data._id,
                pageName)
        };
        this.showListView = function() {
            if (!this._listview) {
                return
            }
            var uiTableRef = this;
            var listviewElement;
            if (typeof($) == "function") {
                listviewElement = $("#" + this._listview.name);
                if (listviewElement && listviewElement.length == 1) {
                    listviewElement.html(this._listviewContent ?
                        this._listviewContent : "");
                    try {
                        if (listviewElement.attr("data-filter") ===
                            "true" && typeof listviewElement.filterable ===
                            "function") {
                            listviewElement.filterable("refresh")
                        } else {
                            listviewElement.listview("refresh")
                        }
                    } catch (e) {}
                }
                if (this._listview.autoLink) {
                    $("#" + this._listview.name + " li").each(
                        function() {
                            $(this).bind("click", function() {
                                var jsrecord =
                                    uiTableRef.getListViewRecord(
                                        this);
                                uiTableRef.display();
                                if (typeof(uiTableRef._listview
                                        .onSelect) ==
                                    "function") {
                                    uiTableRef._listview
                                        .onSelect(event,
                                            this,
                                            jsrecord)
                                }
                            })
                        })
                }
            } else {
                listviewElement = document.getElementById(this._listview
                    .name);
                if (listviewElement) {
                    listviewElement.innerHTML = this._listviewContent
                }
                if (this._listview.autoLink) {
                    var element = document.getElementById(this._listview
                        .name);
                    if (element && element.childElementCount > 0) {
                        for (var i = 0; i < element.children.length; i++) {
                            element.children[i].onclick = function() {
                                var jsrecord = uihelper.getListViewRecord(
                                    this);
                                uihelper.display();
                                if (typeof(uiTableRef._listview
                                        .onSelect) ==
                                    "function") {
                                    uiTableRef._listview.onSelect(
                                        event, this,
                                        jsrecord)
                                }
                            }
                        }
                    }
                }
            }
            this._listviewContent = undefined
        };
        this.getFormFields = function(fields) {
            if (!this._tableRef._schema) {
                return ""
            }
            if (!(fields instanceof Array)) {
                fields = null
            } else {
                var tmpFields = {};
                for (var i = 0; i < fields.length; i++) {
                    tmpFields[fields[i]] = fields[i]
                }
                fields = tmpFields
            }
            var htmltext;
            if (!fields || fields._id) {
                htmltext =
                    '<input type="hidden" id="_id" name="_id" value="" />'
            } else {
                htmltext = ""
            }
            htmltext += '<fieldset data-role="controlgroup">';
            for (var i = 0; i < this._tableRef._schema.length; i++) {
                var fieldName = this._tableRef._schema[i].name;
                if (fieldName == "_id") {
                    continue
                }
                if (fieldName.length > 0 && fieldName.charAt(0) ==
                    "_") {
                    continue
                }
                if (fields && fields[fieldName] === undefined) {
                    continue
                }
                var fieldLabel = this._tableRef._schema[i].title ?
                    this._tableRef._schema[i].title : this._tableRef
                    ._schema[i].name;
                var text = (this._detailPage && this._detailPage.fieldTemplate) ?
                    this._detailPage.fieldTemplate : progress.ui.UIHelper
                    ._fieldTemplate;
                text = text.replace(new RegExp("{__label__}", "g"),
                    fieldLabel);
                text = text.replace(new RegExp("{__name__}", "g"),
                    this._tableRef._schema[i].name);
                htmltext += text
            }
            htmltext += "</fieldset>";
            fields = null;
            return htmltext
        };
        this.getListViewRecord = function(htmlIElement) {
            var id = htmlIElement.getAttribute("data-id");
            return this._tableRef.findById(id)
        };
        this.getFormRecord = function(detailPageName) {
            var id = this._getFormFieldValue("_id", detailPageName);
            return this._tableRef.findById(id)
        };
        this._getIdOfElement = function(name) {
            if (typeof($) == "function") {
                var element = $("#" + name);
                if (!element || element.length === 0) {
                    element = $('[dsid="' + name + '"]');
                    if (element && element.length == 1) {
                        var id = element.attr("id");
                        if (id) {
                            return id
                        }
                    }
                }
            }
            return name
        };
        this.setDetailPage = function setDetailPage(obj) {
            if (!obj || (typeof(obj) != "object")) {
                throw new Error(msg.getMsgText("jsdoMSG012",
                    arguments.callee.name, "object"))
            }
            if (!obj.name || (typeof(obj.name) != "string")) {
                throw new Error(msg.getMsgText("jsdoMSG012",
                    arguments.callee.name, "name"))
            }
            this._detailPage = obj;
            this._detailPage.name = this._getIdOfElement(this._detailPage
                .name)
        };
        this.setListView = function setListView(obj) {
            if (!obj || (typeof(obj) != "object")) {
                throw new Error(msg.getMsgText("jsdoMSG012",
                    arguments.callee.name, "object"))
            }
            if (!obj.name || (typeof(obj.name) != "string")) {
                throw new Error(msg.getMsgText("jsdoMSG012",
                    arguments.callee.name, "name"))
            }
            if (obj.format && (typeof(obj.name) != "string")) {
                throw new Error(msg.getMsgText("jsdoMSG012",
                    arguments.callee.name, "format"))
            }
            this._listview = obj;
            this._listview.name = this._getIdOfElement(this._listview
                .name);
            if (!this._listview.format) {
                if (typeof($) == "function") {
                    for (var i = 0; i < this._tableRef._schema.length; i++) {
                        var fieldName = this._tableRef._schema[i].name;
                        field = $("#" + this._listview.name +
                            ' [dsid="' + fieldName + '"]');
                        if (field && field.length == 1) {
                            field.html("{" + fieldName + "}")
                        }
                    }
                }
                var text = document.getElementById(this._listview.name)
                    .innerHTML;
                var pos = text.indexOf("<li ");
                if (pos != -1) {
                    text = text.substring(0, pos) +
                        '<li data-id="{__id__}"' + text.substring(
                            pos + 3)
                }
                this._listview.itemTemplate = text
            }
        }
    };
    progress.ui.UIHelper = function UIHelper() {
        if (typeof(arguments[0]) == "object") {
            var args = arguments[0];
            for (var v in args) {
                if (v == "jsdo") {
                    this._jsdo = args[v]
                } else {
                    this[v] = args[v]
                }
            }
        }
        this._defaultUITableRef = null;
        this._uiTableRef = {};
        var cnt = 0;
        for (var buf in this._jsdo._buffers) {
            this[buf] = this._uiTableRef[buf] = new progress.ui.UITableRef(
                this._jsdo._buffers[buf]);
            if (!this._defaultUITableRef) {
                this._defaultUITableRef = this._uiTableRef[buf]
            }
            cnt++
        }
        if (cnt != 1) {
            this._defaultUITableRef = null
        }
        this.addItem = function(format) {
            if (this._defaultUITableRef) {
                this._defaultUITableRef.addItem(format)
            } else {
                throw new Error(msg.getMsgText("jsdoMSG011",
                    "addItem()"))
            }
        };
        this.clearItems = function() {
            if (this._defaultUITableRef) {
                this._defaultUITableRef.clearItems()
            } else {
                throw new Error(msg.getMsgText("jsdoMSG011",
                    "clearItems()"))
            }
        };
        this.assign = function(detailPageName) {
            if (arguments.length !== 0) {
                throw new Error(msg.getMsgText("jsdoMSG024",
                    "UIHelper", "assign()"))
            }
            if (this._defaultUITableRef) {
                return this._defaultUITableRef.assign(
                    detailPageName)
            } else {
                throw new Error(msg.getMsgText("jsdoMSG011",
                    "assign()"))
            }
        };
        this.display = function(detailPageName) {
            if (this._defaultUITableRef) {
                this._defaultUITableRef.display(detailPageName)
            } else {
                throw new Error(msg.getMsgText("jsdoMSG011",
                    "display()"))
            }
        };
        this.showListView = function() {
            if (this._defaultUITableRef) {
                this._defaultUITableRef.showListView()
            } else {
                throw new Error(msg.getMsgText("jsdoMSG011",
                    "showListView()"))
            }
        };
        this.getFormFields = function(fields) {
            if (this._defaultUITableRef) {
                return this._defaultUITableRef.getFormFields(fields)
            } else {
                throw new Error(msg.getMsgText("jsdoMSG011",
                    "getFormFields()"))
            }
        };
        this.getListViewRecord = function(htmlIElement) {
            if (this._defaultUITableRef) {
                return this._defaultUITableRef.getListViewRecord(
                    htmlIElement)
            } else {
                throw new Error(msg.getMsgText("jsdoMSG011",
                    "getListViewRecord()"))
            }
        };
        this.getFormRecord = function(detailPageName) {
            if (this._defaultUITableRef) {
                return this._defaultUITableRef.getFormRecord(
                    detailPageName)
            } else {
                throw new Error(msg.getMsgText("jsdoMSG011",
                    "getFormRecord()"))
            }
        };
        this.setDetailPage = function(obj) {
            if (this._defaultUITableRef) {
                return this._defaultUITableRef.setDetailPage(obj)
            }
            throw new Error(msg.getMsgText("jsdoMSG011",
                "setDetailPage()"))
        };
        this.setListView = function(obj) {
            if (this._defaultUITableRef) {
                return this._defaultUITableRef.setListView(obj)
            }
            throw new Error(msg.getMsgText("jsdoMSG011",
                "setListView()"))
        }
    };
    progress.ui.UIHelper._defaultItemTemplate =
        '<li data-theme="c" data-id="{__id__}"><a href="#{__page__}" class="ui-link" data-transition="slide">{__format__}</a></li>';
    progress.ui.UIHelper._defaultFieldTemplate =
        '<div data-role="fieldcontain"><label for="{__name__}">{__label__}</label><input id="{__name__}" name="{__name__}" placeholder="" value="" type="text" /></div>';
    progress.ui.UIHelper._itemTemplate = progress.ui.UIHelper._defaultItemTemplate;
    progress.ui.UIHelper._fieldTemplate = progress.ui.UIHelper._defaultFieldTemplate;
    progress.ui.UIHelper.setItemTemplate = function(template) {
        progress.ui.UIHelper._itemTemplate = template ? template :
            progress.ui.UIHelper._defaultItemTemplate
    };
    progress.ui.UIHelper.setFieldTemplate = function(template) {
        progress.ui.UIHelper._fieldTemplate = template ? template :
            progress.ui.UIHelper._defaultFieldTemplate
    }
})();
(function() {
    if (typeof progress === "undefined") {
        progress = {}
    }
    if (typeof progress.data === "undefined") {
        progress.data = {}
    }
    progress.data.ServicesManager = {};
    progress.data.ServicesManager._services = [];
    progress.data.ServicesManager._resources = [];
    progress.data.ServicesManager._data = [];
    progress.data.ServicesManager._sessions = [];
    progress.data.ServicesManager.addResource = function(id, resource) {
        if (progress.data.ServicesManager._resources[id] === undefined) {
            progress.data.ServicesManager._resources[id] = resource
        } else {
            throw new Error("A resource named '" + id +
                "' was already loaded.")
        }
    };
    progress.data.ServicesManager.getResource = function(id) {
        return progress.data.ServicesManager._resources[id]
    };
    progress.data.ServicesManager.addService = function(id, service) {
        if (progress.data.ServicesManager._services[id] === undefined) {
            progress.data.ServicesManager._services[id] = service
        } else {
            throw new Error("A service named '" + id +
                "' was already loaded.")
        }
    };
    progress.data.ServicesManager.getService = function(id) {
        return progress.data.ServicesManager._services[id]
    };
    progress.data.ServicesManager.addSession = function(catalogURI, session) {
        if (progress.data.ServicesManager._sessions[catalogURI] ===
            undefined) {
            progress.data.ServicesManager._sessions[catalogURI] =
                session
        } else {
            throw new Error("Cannot load catalog '" + catalogURI +
                "' multiple times.")
        }
    };
    progress.data.ServicesManager.getSession = function(catalogURI) {
        try {
            return progress.data.ServicesManager._sessions[catalogURI]
        } catch (e) {
            return null
        }
    };

    function extractParamsFromURL(url) {
        var urlParams = [];
        if (typeof(url) == "string") {
            var paramName = null;
            for (var i = 0; i < url.length; i++) {
                if (url.charAt(i) == "{") {
                    paramName = ""
                } else {
                    if (url.charAt(i) == "}") {
                        if (paramName) {
                            urlParams.push(paramName)
                        }
                        paramName = null
                    } else {
                        if (paramName !== null) {
                            paramName += url.charAt(i)
                        }
                    }
                }
            }
        }
        return urlParams
    }
    progress.data.ServicesManager.addCatalog = function(services, session) {
        if (!services) {
            throw new Error(
                "Cannot find 'services' property in catalog file.")
        }
        if (services instanceof Array) {
            for (var j = 0; j < services.length; j++) {
                if (progress.data.ServicesManager.getService(services[j]
                        .name) !== undefined) {
                    throw new Error("A service named '" + services[j].name +
                        "' was already loaded.")
                }
                var resources = services[j].resources;
                if (resources instanceof Array) {
                    for (var i = 0; i < resources.length; i++) {
                        if (progress.data.ServicesManager.getResource(
                                resources[i].name) !== undefined) {
                            throw new Error("A resource named '" +
                                resources[i].name +
                                "' was already loaded.")
                        }
                    }
                } else {
                    throw new Error(
                        "Missing 'resources' array in catalog.")
                }
            }
            for (var j = 0; j < services.length; j++) {
                services[j]._session = session;
                this.addService(services[j].name, services[j]);
                var resources = services[j].resources;
                var baseAddress = services[j].address;
                if (resources instanceof Array) {
                    for (var i = 0; i < resources.length; i++) {
                        var resource = resources[i];
                        resource.fn = {};
                        resource.service = services[j];
                        resources[i].url = baseAddress + resources[i].path;
                        progress.data.ServicesManager.addResource(
                            resources[i].name, resources[i]);
                        resource.fields = null;
                        resource.primaryKeys = null;
                        if (resource.schema) {
                            resource.fields = {};
                            resource.primaryKeys = {};
                            resource._dataSetName = undefined;
                            resource._tempTableName = undefined;
                            var properties = null;
                            try {
                                if (typeof resource.schema.properties !=
                                    "undefined") {
                                    var keys = Object.keys(resource.schema
                                        .properties);
                                    properties = resource.schema.properties;
                                    if (keys.length == 1) {
                                        if (typeof resource.schema.properties[
                                                keys[0]].properties !=
                                            "undefined") {
                                            resource._dataSetName =
                                                keys[0]
                                        } else {
                                            if (typeof resource.schema.properties[
                                                    keys[0]].items !=
                                                "undefined") {
                                                resource.dataProperty =
                                                    keys[0];
                                                properties = resource.schema
                                                    .properties[keys[0]]
                                                    .items.properties;
                                                resource._tempTableName =
                                                    resource.dataProperty;
                                                resource.primaryKeys[
                                                        resource._tempTableName
                                                    ] = resource.schema
                                                    .properties[keys[0]]
                                                    .primaryKey
                                            }
                                        }
                                    }
                                } else {
                                    var keys = Object.keys(resource.schema);
                                    if (keys.length == 1) {
                                        resource.dataProperty = keys[0];
                                        if (typeof resource.schema[keys[
                                                0]].items !=
                                            "undefined") {
                                            properties = resource.schema[
                                                keys[0]].items.properties;
                                            resource._tempTableName =
                                                resource.dataProperty;
                                            resource.primaryKeys[
                                                resource._tempTableName
                                            ] = resource.schema[
                                                keys[0]].primaryKey
                                        } else {
                                            if (typeof resource.schema[
                                                    keys[0]].properties !=
                                                "undefined") {
                                                resource._dataSetName =
                                                    keys[0];
                                                resource.dataProperty =
                                                    null;
                                                properties = resource.schema
                                            }
                                        }
                                    }
                                }
                            } catch (e) {
                                throw new Error(
                                    "Error parsing catalog file.")
                            }
                            if (properties) {
                                if (resource._dataSetName) {
                                    properties = properties[resource._dataSetName]
                                        .properties;
                                    for (var tableName in properties) {
                                        resource.fields[tableName] = [];
                                        resource.primaryKeys[tableName] =
                                            properties[tableName].primaryKey;
                                        var tableProperties;
                                        if (properties[tableName].items &&
                                            properties[tableName].items
                                            .properties) {
                                            tableProperties =
                                                properties[tableName].items
                                                .properties
                                        } else {
                                            tableProperties =
                                                properties[tableName].properties
                                        }
                                        for (var field in
                                                tableProperties) {
                                            tableProperties[field].name =
                                                field;
                                            if (field != "_id") {
                                                resource.fields[
                                                    tableName].push(
                                                    tableProperties[
                                                        field])
                                            }
                                        }
                                    }
                                } else {
                                    var tableName = resource.dataProperty ?
                                        resource.dataProperty : "";
                                    resource.fields[tableName] = [];
                                    for (var field in properties) {
                                        properties[field].name = field;
                                        if (field != "_id") {
                                            resource.fields[tableName].push(
                                                properties[field])
                                        }
                                    }
                                }
                            } else {
                                throw new Error(
                                    "Error parsing catalog file.")
                            }
                        } else {
                            resource.fields = null
                        }
                        if ((resource.relations instanceof Array) &&
                            resource.relations[0] && resource.relations[
                                0].RelationName) {
                            throw new Error(
                                "Relationship properties in catalog must begin with lowercase."
                            )
                        }
                        resource.generic = {};
                        if (resource.operations) {
                            for (var idx = 0; idx < resource.operations
                                .length; idx++) {
                                if (resource.operations[idx].path) {
                                    resource.operations[idx].url =
                                        resource.url + resource.operations[
                                            idx].path
                                } else {
                                    resource.operations[idx].url =
                                        resource.url
                                }
                                if (!resource.operations[idx].params) {
                                    resource.operations[idx].params = []
                                }
                                if (!resource.operations[idx].type) {
                                    resource.operations[idx].type =
                                        "INVOKE"
                                }
                                var opname = resource.operations[idx].type
                                    .toLowerCase();
                                if (!resource.operations[idx].verb) {
                                    switch (opname) {
                                        case "create":
                                            resource.operations[idx].verb =
                                                "POST";
                                            break;
                                        case "read":
                                            resource.operations[idx].verb =
                                                "GET";
                                            break;
                                        case "update":
                                        case "invoke":
                                        case "submit":
                                            resource.operations[idx].verb =
                                                "PUT";
                                            break;
                                        case "delete":
                                            resource.operations[idx].verb =
                                                "DELETE";
                                            break;
                                        default:
                                            break
                                    }
                                }
                                var func = function fn(object, async) {
                                    var deferred;
                                    if (typeof fn.fnName ==
                                        "undefined") {
                                        fn.fnName = arguments[0];
                                        fn.definition = arguments[1];
                                        return
                                    }
                                    var reqBody = null;
                                    var url = fn.definition.url;
                                    var jsdo = this;
                                    var xhr = null;
                                    var request = {};
                                    if (object) {
                                        if (typeof(object) !=
                                            "object") {
                                            throw new Error(
                                                "Catalog error: Function '" +
                                                fn.fnName +
                                                "' requires an object as a parameter."
                                            )
                                        }
                                        var objParam;
                                        if (object instanceof XMLHttpRequest) {
                                            jsdo = object.jsdo;
                                            xhr = object;
                                            objParam = xhr.objParam;
                                            request = xhr.request
                                        } else {
                                            objParam = object
                                        }
                                        if (typeof async ==
                                            "undefined") {
                                            async = this._async
                                        } else {
                                            async = Boolean(async)
                                        }
                                        request.objParam = objParam;
                                        var isInvoke = (fn.definition
                                            .type.toUpperCase() ==
                                            "INVOKE");
                                        for (var i = 0; i < fn.definition
                                            .params.length; i++) {
                                            var name = fn.definition
                                                .params[i].name;
                                            switch (fn.definition.params[
                                                i].type) {
                                                case "PATH":
                                                case "QUERY":
                                                case "MATRIX":
                                                    var value =
                                                        null;
                                                    if (objParam) {
                                                        value =
                                                            objParam[
                                                                name
                                                            ]
                                                    }
                                                    if (!value) {
                                                        value = ""
                                                    }
                                                    if (url.indexOf( "{" + name + "}") ==  -1) {
                                                        throw new Error
                                                            (
                                                                "Catalog error: Reference to " +
                                                                fn.definition.params[i].type +
                                                                " parameter '" +
                                                                name +
                                                                "' is missing in path."
                                                            )
                                                    }
                                                    url = url.replace(
                                                        new RegExp( "{" + name + "}", "g"),
                                                        encodeURIComponent(value));
                                                    break;
                                                case "REQUEST_BODY":
                                                case "REQUEST_BODY,RESPONSE_BODY":
                                                case "RESPONSE_BODY,REQUEST_BODY":
                                                    if (xhr && ! reqBody) {
                                                        reqBody = objParam
                                                    } else {
                                                        var reqParam = objParam[name];
                                                        if (isInvoke && (fn.definition
                                                                .params[i].xType && (
                                                                    "DATASET,TABLE".indexOf(
                                                                        fn.definition.params[i].xType) != -1
                                                                )
                                                            )
                                                        ) {
                                                            var unwrapped = (
                                                                        jsdo._resource.service.settings &&
                                                                        jsdo._resource.service.settings.unwrapped
                                                            );
                                                            if ( unwrapped ) {
                                                                if ( ( typeof ( reqParam ) == "object" ) &&
                                                                    ( 
                                                                        Object.keys(reqParam).length == 1
                                                                    ) && (
                                                                        typeof ( reqParam[name] ) == "object"
                                                                    )
                                                                ) { 
                                                                    reqParam = reqParam[name]
                                                                }
                                                            } else {
                                                                if ( 
                                                                    ( typeof ( reqParam ) == "object" ) &&
                                                                    ( typeof ( reqParam[name] ) == "undefined" )
                                                                ) {
                                                                    reqParam = {};
                                                                    reqParam [name] = objParam[name]
                                                                }
                                                            }
                                                        }
                                                        if (!reqBody) {
                                                            reqBody = {}
                                                        }
                                                        reqBody[name] = reqParam
                                                    }
                                                    break;
                                                case "RESPONSE_BODY":
                                                    break;
                                                default:
                                                    throw new Error(
                                                            "Catalog error: Unexpected parameter type '" +
                                                            fn.definition.params[i].type + "'.")
                                            }
                                        }
                                        if (url.indexOf("{") != -1) {
                                            var paramsFromURL =
                                                extractParamsFromURL(url);
                                            for (var i = 0; i < paramsFromURL.length; i++) {
                                                var name = paramsFromURL[i];
                                                var value = null;
                                                if (objParam) { value = objParam[name] }
                                                if (!value) { value = "" }
                                                if (typeof(value) === "object") {
                                                    value = JSON.stringify(value)
                                                }
                                                url = url.replace( 
                                                    new RegExp( "{" + name + "}","g"),
                                                    encodeURIComponent(value)
                                                )
                                            }
                                        }
                                    }
                                    request.fnName = fn.fnName;
                                    request.async = async;
                                    if (request.deferred ===
                                            undefined && 
                                            typeof($) == "function" && 
                                            typeof($.Deferred) == "function"
                                        ) {
                                                deferred = $.Deferred();
                                                request.deferred = deferred
                                    }
                                    var data = jsdo._httpRequest( 
                                        xhr, fn.definition.verb, url, reqBody, request, async);
                                    return data
                                };
                                switch (resource.operations[idx].verb.toLowerCase()) {
                                    case "get":
                                    case "post":
                                    case "put":
                                    case "delete":
                                        break;
                                    default:
                                        throw new Error(
                                            "Catalog error: Unexpected HTTP verb '" +
                                            resource.operations[idx]
                                            .verb +
                                            "' found while parsing the catalog."
                                        )
                                }
                                switch (opname) {
                                    case "invoke":
                                        break;
                                    case "create":
                                    case "read":
                                    case "update":
                                    case "delete":
                                    case "submit":
                                        if (typeof(resource.generic[opname]) == "function") {
                                            throw new Error(
                                                "Catalog error: Multiple '" +
                                                resource.operations[idx].type +
                                                "' operations specified in the catalog for resource '" +
                                                resource.name + "'.")
                                        } else { resource.generic[opname] = func }
                                        break;
                                    default:
                                        throw new Error(
                                            "Catalog error: Unexpected operation '" +
                                            resource.operations[idx].type +
                                            "' found while parsing the catalog."
                                        )
                                }
                                var name = resource.operations[idx].name;
                                if (opname == "invoke") {
                                    resource.fn[name] = {};
                                    resource.fn[name]["function"] = func
                                } else {
                                    name = "_" + opname
                                }
                                func(name, resource.operations[idx])
                            }
                        }
                    }
                }
            }
        } else {
            throw new Error("Missing 'services' array in catalog.")
        }
    };
    progress.data.ServicesManager.printDebugInfo = function(resourceName) {
        if (resourceName) {
            var resource = progress.data.ServicesManager.getResource(
                resourceName);
            if (resource) {
                var cSchema = "Schema:\n";
                var cOperations = "Operations: " + resource.operations.length +
                    "\n";
                for (var field in resource.schema.properties) {
                    cSchema += "\nName: " + field + "\n"
                }
                for (var i = 0; i < resource.operations.length; i++) {
                    cOperations += "\n" + i + "\nName: " + resource.operations[i].name 
                        + "\nURL: " + resource.operations[i].url 
                        + "\ntype: " + resource.operations[i].type +
                        "\nverb: " + resource.operations[i].verb +
                        "\nparams: " + resource.operations[i].params.length + "\n"
                }
                console.log(
                    "** DEBUG INFO **\nResource name: %s\nURL:%s\n%s\n%s\n\n",
                    resource.name, resource.url, cSchema,
                    cOperations)
            } else {
                console.log("Resource not found")
            }
        }
    };
    progress.data.MobileServiceObject = function MobileServiceObject(args) {
        var _name = args.name;
        Object.defineProperty(this, "name", {
            get: function() {
                return _name
            },
            enumerable: true
        });
        var _uri = args.uri;
        Object.defineProperty(this, "uri", {
            get: function() {
                return _uri
            },
            enumerable: true
        })
    };
    progress.data.ContextProperties = function() {
        var contextObject = {},
            contextString;
        Object.defineProperty(this, "contextHeader", {
            get: function() {
                var header;
                if (contextString === null) {
                    header = JSON.stringify(contextObject);
                    if (header === "{}") {
                        contextString = undefined
                    } else {
                        contextString = header
                    }
                }
                return contextString
            },
            enumerable: true
        });
        this.setContextProperty = function(propertyName, propertyValue) {
            if (arguments.length < 2) {
                throw new Error(progress.data._getMsgText(
                    "jsdoMSG122", "Session",
                    "setContextProperty", 2))
            }
            if (arguments.length !== 2) {
                throw new Error(progress.data._getMsgText(
                    "jsdoMSG122", "Session",
                    "setContextProperty", 2))
            }
            if (typeof propertyName !== "string") {
                throw new Error(progress.data._getMsgText(
                    "jsdoMSG121", "Session", 1, "string",
                    "setContextProperty"))
            }
            if (propertyValue === undefined) {
                delete contextObject[propertyName]
            } else {
                contextObject[propertyName] = propertyValue
            }
            contextString = null
        };
        this.setContext = function(context) {
            var prop;
            if (arguments.length < 1) {
                throw new Error(progress.data._getMsgText(
                    "jsdoMSG122", "Session", "setContext",
                    1))
            }
            if (arguments.length > 1) {
                throw new Error(progress.data._getMsgText(
                    "jsdoMSG122", "Session", "setContext",
                    1))
            }
            if (typeof context == "object") {
                contextObject = {};
                for (prop in context) {
                    if (context.hasOwnProperty(prop)) {
                        if (typeof context[prop] !== "function") {
                            contextObject[prop] = context[prop]
                        }
                    }
                }
            } else {
                if ((context === undefined) || (context === null)) {
                    contextObject = {}
                } else {
                    throw new Error(progress.data._getMsgText(
                        "jsdoMSG121", "Session", 1,
                        "Object", "setContextProperty"))
                }
            }
            contextString = null
        };
        this.getContext = function() {
            if (arguments.length > 0) {
                throw new Error(progress.data._getMsgText(
                    "jsdoMSG122", "Session", "getContext",
                    0))
            }
            return contextObject
        };
        this.getContextProperty = function(propertyName) {
            if (arguments.length < 1) {
                throw new Error(progress.data._getMsgText(
                    "jsdoMSG122", "Session",
                    "getContextProperty", 1))
            }
            if (arguments.length > 1) {
                throw new Error(progress.data._getMsgText(
                    "jsdoMSG122", "Session",
                    "getContextProperty", 1))
            }
            return contextObject[propertyName]
        }
    };
    progress.data.Session = function Session() {
        var defPropSupported = false;
        if ((typeof Object.defineProperty) == "function") {
            defPropSupported = true
        }
        var myself = this,
            isUserAgentiOS = false,
            isFirefox = false,
            defaultiOSBasicAuthTimeout = 4000,
            deviceIsOnline = true,
            restApplicationIsOnline = false,
            oepingAvailable = false,
            defaultPartialPingURI = "/rest/_oeping",
            partialPingURI = defaultPartialPingURI;
        if (typeof navigator !== "undefined") {
            if (typeof navigator.userAgent !== "undefined") {
                isUserAgentiOS = navigator.userAgent.match(
                    /(iPad)|(iPhone)|(iPod)/i);
                isFirefox = navigator.userAgent.toLowerCase().indexOf(
                    "firefox") > -1
            }
        }
        this._onlineHandler = function() {
            deviceIsOnline = true;
            myself.trigger("online", myself, null)
        };
        this._offlineHandler = function() {
            deviceIsOnline = false;
            myself.trigger("offline", myself, progress.data.Session
                .DEVICE_OFFLINE, null)
        };
        if ((typeof window != "undefined") && (window.addEventListener)) {
            window.addEventListener("online", this._onlineHandler,
                false);
            window.addEventListener("offline", this._offlineHandler,
                false)
        }
        var _catalogURIs = [];
        var _services = [];
        var _jsdos = [];
        this.onOpenRequest = null;
        var _password = null;
        if (defPropSupported) {
            var _userName = null;
            Object.defineProperty(this, "userName", {
                get: function() {
                    return _userName
                },
                enumerable: true
            });
            var _loginTarget = "/static/home.html";
            Object.defineProperty(this, "loginTarget", {
                get: function() {
                    return _loginTarget
                },
                enumerable: true
            });
            var _serviceURI = null;
            Object.defineProperty(this, "serviceURI", {
                get: function() {
                    return _serviceURI
                },
                enumerable: true
            });
            Object.defineProperty(this, "catalogURIs", {
                get: function() {
                    return _catalogURIs
                },
                enumerable: true
            });
            Object.defineProperty(this, "services", {
                get: function() {
                    return _services
                },
                enumerable: true
            });
            var _loginResult = null;
            Object.defineProperty(this, "loginResult", {
                get: function() {
                    return _loginResult
                },
                enumerable: true
            });
            var _loginHttpStatus = null;
            Object.defineProperty(this, "loginHttpStatus", {
                get: function() {
                    return _loginHttpStatus
                },
                enumerable: true
            });
            var _clientContextId = null;
            Object.defineProperty(this, "clientContextId", {
                get: function() {
                    return _clientContextId
                },
                enumerable: true
            });
            var _authenticationModel = progress.data.Session.AUTH_TYPE_ANON;
            Object.defineProperty(this, "authenticationModel", {
                get: function() {
                    return _authenticationModel
                },
                set: function(newval) {
                    if (newval) {
                        newval = newval.toLowerCase()
                    }
                    switch (newval) {
                        case progress.data.Session.AUTH_TYPE_FORM:
                        case progress.data.Session.AUTH_TYPE_BASIC:
                        case progress.data.Session.AUTH_TYPE_ANON:
                        case null:
                            _authenticationModel = newval;
                            break;
                        default:
                            throw new Error(
                                "Error setting Session.authenticationModel. '" +
                                newval +
                                "' is an invalid value."
                            )
                    }
                },
                enumerable: true
            });
            var _lastSessionXHR = null;
            Object.defineProperty(this, "lastSessionXHR", {
                get: function() {
                    return _lastSessionXHR
                },
                enumerable: true
            });
            Object.defineProperty(this, "connected", {
                get: function() {
                    return (this.loginResult === progress.data
                            .Session.LOGIN_SUCCESS) &&
                        restApplicationIsOnline &&
                        deviceIsOnline
                },
                enumerable: true
            });
            Object.defineProperty(this, "JSDOs", {
                get: function() {
                    return _jsdos
                },
                enumerable: true
            });
            var _pingInterval = 0;
            var _timeoutID = null;
            Object.defineProperty(this, "pingInterval", {
                get: function() {
                    return _pingInterval
                },
                set: function(newval) {
                    if (newval >= 0) {
                        _pingInterval = newval;
                        if (newval > 0) {
                            _timeoutID = setTimeout(this._autoping,
                                newval)
                        } else {
                            if (newval === 0) {
                                clearTimeout(_timeoutID);
                                _pingInterval = 0
                            } else {
                                throw new Error(
                                    "Error setting Session.pingInterval. '" +
                                    newval +
                                    "' is an invalid value."
                                )
                            }
                        }
                    }
                },
                enumerable: true
            });
            var _contextProperties = new progress.data.ContextProperties();
            Object.defineProperty(this, "_contextProperties", {
                get: function() {
                    return _contextProperties
                },
                enumerable: false
            })
        } else {
            this.userName = null;
            this.loginTarget = "/static/home.html";
            this.serviceURI = null;
            this.catalogURIs = [];
            this.services = [];
            this.loginResult = null;
            this.loginHttpStatus = null;
            this.clientContextId = null;
            this.authenticationModel = progress.data.Session.AUTH_TYPE_ANON;
            this.lastSessionXHR = null
        }

        function setUserName(newname, sessionObject) {
            if (defPropSupported) {
                _userName = newname
            } else {
                sessionObject.userName = newname
            }
        }

        function setLoginTarget(target, sessionObject) {
            if (defPropSupported) {
                _loginTarget = target
            } else {
                sessionObject.loginTarget = target
            }
        }

        function setServiceURI(url, sessionObject) {
            if (defPropSupported) {
                _serviceURI = url
            } else {
                sessionObject.serviceURI = url
            }
        }

        function pushCatalogURIs(url, sessionObject) {
            if (defPropSupported) {
                _catalogURIs.push(url)
            } else {
                sessionObject.catalogURIs.push(url)
            }
        }

        function pushService(serviceObject, sessionObject) {
            if (defPropSupported) {
                _services.push(serviceObject)
            } else {
                sessionObject.services.push(serviceObject)
            }
        }

        function findService(serviceName) {
            for (var prop in _services) {
                var srv = _services[prop];
                if (srv.name === serviceName) {
                    return srv
                }
            }
            return null
        }

        function setLoginResult(result, sessionObject) {
            if (defPropSupported) {
                _loginResult = result
            } else {
                sessionObject.loginResult = result
            }
        }

        function setLoginHttpStatus(status, sessionObject) {
            if (defPropSupported) {
                _loginHttpStatus = status
            } else {
                sessionObject.loginHttpStatus = status
            }
        }

        function setClientContextIDfromXHR(xhr, sessionObject) {
            if (xhr) {
                setClientContextID(getResponseHeaderNoError(xhr,
                    "X-CLIENT-CONTEXT-ID"), sessionObject)
            }
        }

        function setClientContextID(ccid, sessionObject) {
            if (defPropSupported) {
                _clientContextId = ccid
            } else {
                sessionObject.clientContextId = ccid
            }
        }

        function setLastSessionXHR(xhr, sessionObject) {
            if (defPropSupported) {
                _lastSessionXHR = xhr
            } else {
                sessionObject.lastSessionXHR = xhr
            }
        }

        function getResponseHeaderNoError(xhr, headerName) {
            var allHeaders = xhr._pdsResponseHeaders,
                regExp;
            if (allHeaders === undefined) {
                allHeaders = xhr.getAllResponseHeaders();
                if (allHeaders) {
                    xhr._pdsResponseHeaders = allHeaders
                } else {
                    xhr._pdsResponseHeaders = null
                }
            }
            if (allHeaders) {
                regExp = new RegExp("^" + headerName + ":", "m");
                if (allHeaders.match(regExp)) {
                    return xhr.getResponseHeader(headerName)
                }
            }
            return null
        }
        this._pushJSDOs = function(jsdo) {
            _jsdos.push(jsdo)
        };
        this._openRequest = function(xhr, verb, url, async) {
            if (this.loginResult !== progress.data.Session.LOGIN_SUCCESS &&
                this.authenticationModel) {
                throw new Error(
                    "Attempted to make server request when there is no active session."
                )
            }
            var urlPlusCCID = this._prependAppURL(url);
            urlPlusCCID = this._addCCIDtoURL(urlPlusCCID);
            if (progress.data.Session._useTimeStamp) {
                urlPlusCCID = this._addTimeStampToURL(urlPlusCCID)
            }
            this._setXHRCredentials(xhr, verb, urlPlusCCID, this.userName,
                _password, async);
            if (this.authenticationModel === progress.data.Session.AUTH_TYPE_FORM) {
                _addWithCredentialsAndAccept(xhr,
                    "application/json")
            }
            if (this.clientContextId && (this.clientContextId !==
                    "0")) {
                xhr.setRequestHeader("X-CLIENT-CONTEXT-ID", this.clientContextId)
            }
            setRequestHeaderFromContextProps(this, xhr);
            if (typeof this.onOpenRequest === "function") {
                var params = {
                    xhr: xhr,
                    verb: verb,
                    uri: urlPlusCCID,
                    async: async,
                    formPreTest: false,
                    session: this
                };
                this.onOpenRequest(params)
            }
        };
        this.pingTestCallback = function(cbArgs) {
            if (cbArgs.pingResult) {
                oepingAvailable = true
            } else {
                oepingAvailable = false
            }
        };
        this._onReadyStateChangeGeneric = function() {
            var xhr = this;
            var result;
            var errorObject;
            clearTimeout(xhr._requestTimeout);
            if (xhr.readyState == 4) {
                result = null;
                errorObject = null;
                if ((typeof xhr.onResponseFn) == "function") {
                    try {
                        result = xhr.onResponseFn(xhr)
                    } catch (e) {
                        errorObject = e
                    }
                }
                if ((typeof xhr.onResponseProcessedFn) ==
                    "function") {
                    if (!result) {
                        result = progress.data.Session.GENERAL_FAILURE
                    }
                    xhr.onResponseProcessedFn(xhr.pdsession, result,
                        errorObject, xhr)
                }
            }
        };
        var pwSave = null;
        var unameSave = null;
        this.login = function(serviceURI, loginUserName, loginPassword,
            loginTarget) {
            var uname, pw, isAsync = false,
                args = [],
                deferred, jsdosession, iOSBasicAuthTimeout,
                uriForRequest;
            pwSave = null;
            unameSave = null;
            if (this.loginResult === progress.data.Session.LOGIN_SUCCESS) {
                throw new Error(
                    "Attempted to call login() on a Session object that is already logged in."
                )
            }
            if (!defPropSupported) {
                this.authenticationModel = this.authenticationModel
                    .toLowerCase()
            }
            if (arguments.length > 0) {
                if (arguments[0] && typeof(arguments[0]) ===
                    "object") {
                    if (arguments[0].serviceURI) {
                        args[0] = arguments[0].serviceURI;
                        args[1] = arguments[0].userName;
                        args[2] = arguments[0].password;
                        args[3] = arguments[0].loginTarget;
                        args[4] = arguments[0].async;
                        deferred = arguments[0].deferred;
                        jsdosession = arguments[0].jsdosession;
                        iOSBasicAuthTimeout = arguments[0].iOSBasicAuthTimeout;
                        if (typeof iOSBasicAuthTimeout ===
                            "undefined") {
                            iOSBasicAuthTimeout =
                                defaultiOSBasicAuthTimeout
                        } else {
                            if (iOSBasicAuthTimeout && (typeof iOSBasicAuthTimeout !=
                                    "number")) {
                                throw new Error(progress.data._getMsgText(
                                    "jsdoMSG033", "Session",
                                    "login",
                                    "The iOSBasicAuthTimeout argument was invalid."
                                ))
                            }
                        }
                    }
                } else {
                    args = arguments
                }
            }
            if (args.length > 0) {
                if (args[0]) {
                    var restURLtemp = args[0];
                    if (restURLtemp[restURLtemp.length - 1] === "/") {
                        restURLtemp = restURLtemp.substring(0,
                            restURLtemp.length - 1)
                    }
                    setServiceURI(restURLtemp, this)
                } else {
                    setLoginResult(progress.data.Session.LOGIN_GENERAL_FAILURE,
                        this);
                    throw new Error(
                        "Session.login() is missing the serviceURI argument."
                    )
                }
                if (args[1]) {
                    uname = args[1]
                }
                if (args[2]) {
                    pw = args[2]
                }
                if (args[3]) {
                    setLoginTarget(args[3], this)
                }
                if (args[4]) {
                    if (typeof(args[4]) === "boolean") {
                        isAsync = args[4]
                    } else {
                        throw new Error(
                            "Session.login() was passed an async setting that is not a boolean."
                        )
                    }
                }
            } else {
                setLoginResult(progress.data.Session.LOGIN_GENERAL_FAILURE,
                    this);
                throw new Error(
                    "Session.login() is missing the serviceURI argument."
                )
            }
            unameSave = uname;
            pwSave = pw;
            if (this.authenticationModel === progress.data.Session.AUTH_TYPE_ANON ||
                this.authenticationModel === progress.data.Session.AUTH_TYPE_FORM
            ) {
                uname = null;
                pw = null
            }
            var xhr = new XMLHttpRequest();
            xhr.pdsession = this;
            try {
                uriForRequest = this.serviceURI + this.loginTarget;
                if (progress.data.Session._useTimeStamp) {
                    uriForRequest = this._addTimeStampToURL(
                        uriForRequest)
                }
                this._setXHRCredentials(xhr, "GET", uriForRequest,
                    uname, pw, isAsync);
                xhr.setRequestHeader("Cache-Control", "no-cache");
                xhr.setRequestHeader("Pragma", "no-cache");
                setRequestHeaderFromContextProps(this, xhr);
                if (this.authenticationModel === progress.data.Session
                    .AUTH_TYPE_FORM) {
                    _addWithCredentialsAndAccept(xhr,
                        "application/json,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                    )
                }
                xhr._isAsync = isAsync;
                if (isAsync) {
                    xhr.onreadystatechange = this._onReadyStateChangeGeneric;
                    if (this.authenticationModel === progress.data.Session
                        .AUTH_TYPE_FORM) {
                        xhr.onResponseFn = this._afterFormPretestLogin
                    } else {
                        xhr.onResponseFn = this._processLoginResult;
                        xhr.onResponseProcessedFn = this._loginComplete
                    }
                    if (this.authenticationModel === progress.data.Session
                        .AUTH_TYPE_BASIC && isUserAgentiOS &&
                        iOSBasicAuthTimeout > 0) {
                        xhr._requestTimeout = setTimeout(function() {
                            clearTimeout(xhr._requestTimeout);
                            xhr.abort()
                        }, iOSBasicAuthTimeout)
                    }
                    xhr._jsdosession = jsdosession;
                    xhr._deferred = deferred
                }
                if (typeof this.onOpenRequest === "function") {
                    var isFormPreTest = false;
                    if (this.authenticationModel === progress.data.Session
                        .AUTH_TYPE_FORM) {
                        isFormPreTest = true
                    }
                    setLastSessionXHR(xhr, this);
                    var params = {
                        xhr: xhr,
                        verb: "GET",
                        uri: this.serviceURI + this.loginTarget,
                        async: false,
                        formPreTest: isFormPreTest,
                        session: this
                    };
                    this.onOpenRequest(params);
                    xhr = params.xhr
                }
                setLastSessionXHR(xhr, this);
                xhr.send(null)
            } catch (e) {
                clearTimeout(xhr._requestTimeout);
                setLoginHttpStatus(xhr.status, this);
                setLoginResult(progress.data.Session.LOGIN_GENERAL_FAILURE,
                    this);
                unameSave = null;
                pwSave = null;
                throw e
            }
            if (isAsync) {
                return progress.data.Session.ASYNC_PENDING
            } else {
                setLoginHttpStatus(xhr.status, this);
                if (this.authenticationModel === progress.data.Session
                    .AUTH_TYPE_FORM) {
                    return (this._afterFormPretestLogin(xhr))
                } else {
                    return (this._processLoginResult(xhr))
                }
            }
        };
        this._afterFormPretestLogin = function(xhr) {
            var pdsession = xhr.pdsession;
            setLoginHttpStatus(xhr.status, xhr.pdsession);
            var formLoginParams = {
                xhr: xhr,
                pw: pwSave,
                uname: unameSave,
                theSession: pdsession
            };
            try {
                return doFormLogin(formLoginParams)
            } catch (e) {
                pwSave = null;
                unameSave = null;
                throw e
            }
        };

        function doFormLogin(args) {
            var xhr = args.xhr;
            var theSession = args.theSession;
            var oldXHR;
            var contentType = null;
            var needAuth = false;
            var params = {
                session: theSession,
                xhr: xhr,
                statusFromjson: null
            };
            contentType = xhr.getResponseHeader("Content-Type");
            if (contentType && contentType.indexOf(
                    "application/json") >= 0) {
                handleJSONLoginResponse(params);
                if (!params.statusFromjson || (params.statusFromjson >=
                        400 && params.statusFromjson < 500)) {
                    needAuth = true
                } else {
                    setLoginHttpStatus(params.statusFromjson,
                        theSession)
                }
            } else {
                if (theSession.loginHttpStatus == 200) {
                    if (_gotLoginForm(xhr)) {
                        needAuth = true
                    }
                }
            }
            if (needAuth) {
                oldXHR = xhr;
                xhr = new XMLHttpRequest();
                args.xhr = xhr;
                params.xhr = xhr;
                xhr.pdsession = oldXHR.pdsession;
                xhr._isAsync = oldXHR._isAsync;
                xhr._deferred = oldXHR._deferred;
                xhr._jsdosession = oldXHR._jsdosession;
                xhr.open("POST", theSession.serviceURI +
                    "/static/auth/j_spring_security_check", xhr
                    ._isAsync);
                xhr.setRequestHeader("Content-Type",
                    "application/x-www-form-urlencoded");
                xhr.setRequestHeader("Cache-Control", "max-age=0");
                setRequestHeaderFromContextProps(theSession, xhr);
                _addWithCredentialsAndAccept(xhr,
                    "application/json");
                try {
                    if (typeof theSession.onOpenRequest ===
                        "function") {
                        var cbparams = {
                            xhr: xhr,
                            verb: "POST",
                            uri: theSession.serviceURI +
                                "/static/auth/j_spring_security_check",
                            async: xhr._isAsync,
                            formPreTest: false,
                            session: theSession
                        };
                        theSession.onOpenRequest(cbparams);
                        xhr = cbparams.xhr
                    }
                    if (xhr._isAsync) {
                        xhr.onreadystatechange = theSession._onReadyStateChangeGeneric;
                        xhr.onResponseFn = theSession._afterFormLogin;
                        xhr.onResponseProcessedFn = theSession._loginComplete
                    }
                    xhr.send("j_username=" + args.uname +
                        "&j_password=" + args.pw +
                        "&submit=Submit")
                } catch (e) {
                    setLoginResult(progress.data.Session.LOGIN_GENERAL_FAILURE,
                        theSession);
                    setLoginHttpStatus(xhr.status, theSession);
                    unameSave = null;
                    pwSave = null;
                    throw e
                }
            }
            if (xhr._isAsync && !needAuth) {
                xhr.onResponseProcessedFn = theSession._loginComplete;
                return theSession._afterFormLogin(xhr)
            }
            if (!xhr._isAsync) {
                return theSession._afterFormLogin(xhr)
            }
        }
        this._afterFormLogin = function(xhr) {
            var theSession = xhr.pdsession;
            var params = {
                session: theSession,
                xhr: xhr,
                statusFromjson: null
            };
            var contentType = xhr.getResponseHeader("Content-Type");
            if (contentType && contentType.indexOf(
                    "application/json") >= 0) {
                handleJSONLoginResponse(params);
                if (!params.statusFromjson) {
                    throw new Error(
                        "Internal OpenEdge Mobile client error handling login response. HTTP status: " +
                        xhr.status + ".")
                } else {
                    setLoginHttpStatus(params.statusFromjson,
                        theSession)
                }
            } else {
                if (xhr.status === 200) {
                    if (_gotLoginFailure(xhr) || _gotLoginForm(xhr)) {
                        setLoginHttpStatus(401, theSession)
                    } else {
                        setLoginHttpStatus(xhr.status, theSession)
                    }
                }
            }
            return theSession._processLoginResult(xhr)
        };
        this._processLoginResult = function(xhr) {
            var pdsession = xhr.pdsession;
            setLoginHttpStatus(xhr.status, xhr.pdsession);
            if (pdsession.loginHttpStatus === 200) {
                setLoginResult(progress.data.Session.LOGIN_SUCCESS,
                    pdsession);
                restApplicationIsOnline = true;
                setUserName(unameSave, pdsession);
                _password = pwSave;
                pdsession._saveClientContextId(xhr);
                var pingTestArgs = {
                    pingURI: null,
                    async: true,
                    onCompleteFn: null,
                    fireEventIfOfflineChange: true,
                    onReadyStateFn: pdsession._pingtestOnReadyStateChange
                };
                pingTestArgs.pingURI = pdsession._makePingURI();
                pdsession._sendPing(pingTestArgs)
            } else {
                if (pdsession.loginHttpStatus == 401) {
                    setLoginResult(progress.data.Session.LOGIN_AUTHENTICATION_FAILURE,
                        pdsession)
                } else {
                    setLoginResult(progress.data.Session.LOGIN_GENERAL_FAILURE,
                        pdsession)
                }
            }
            setLastSessionXHR(xhr, pdsession);
            updateContextPropsFromResponse(pdsession, xhr);
            unameSave = null;
            pwSave = null;
            return pdsession.loginResult
        };
        this._loginComplete = function(pdsession, result, errObj, xhr) {
            pdsession.trigger("afterLogin", pdsession, result,
                errObj, xhr)
        };
        this.logout = function() {
            var isAsync = false,
                errorObject = null,
                xhr, deferred, jsdosession;
            if (this.loginResult !== progress.data.Session.LOGIN_SUCCESS &&
                this.authenticationModel) {
                throw new Error(
                    "Attempted to call logout when there is no active session."
                )
            }
            if (arguments.length > 0) {
                if (typeof(arguments[0]) === "object") {
                    isAsync = arguments[0].async;
                    if (isAsync && (typeof isAsync != "boolean")) {
                        throw new Error(progress.data._getMsgText(
                            "jsdoMSG033", "Session",
                            "logout",
                            "The async argument was invalid."
                        ))
                    }
                    deferred = arguments[0].deferred;
                    jsdosession = arguments[0].jsdosession
                }
            }
            xhr = new XMLHttpRequest();
            xhr.pdsession = this;
            try {
                xhr._jsdosession = jsdosession;
                xhr._deferred = deferred;
                if (this.authenticationModel === progress.data.Session
                    .AUTH_TYPE_FORM || this.authenticationModel ===
                    progress.data.Session.AUTH_TYPE_BASIC) {
                    if (isAsync) {
                        xhr.onreadystatechange = this._onReadyStateChangeGeneric;
                        xhr.onResponseFn = this._processLogoutResult;
                        xhr.onResponseProcessedFn = this._logoutComplete
                    }
                    xhr.open("GET", this.serviceURI +
                        "/static/auth/j_spring_security_logout",
                        isAsync);
                    try {
                        xhr.withCredentials = true
                    } catch (e) {}
                    xhr.setRequestHeader("Accept",
                        "application/json");
                    setRequestHeaderFromContextProps(this, xhr);
                    if (typeof this.onOpenRequest === "function") {
                        setLastSessionXHR(xhr, this);
                        var params = {
                            xhr: xhr,
                            verb: "GET",
                            uri: this.serviceURI +
                                "/static/auth/j_spring_security_logout",
                            async: false,
                            formPreTest: false,
                            session: this
                        };
                        this.onOpenRequest(params);
                        xhr = params.xhr
                    }
                    setLastSessionXHR(xhr, this);
                    xhr.send()
                } else {
                    xhr._anonymousLogoutOK = true
                }
            } catch (e) {
                this._reinitializeAfterLogout(this, false);
                throw e
            }
            if (!isAsync) {
                try {
                    this._processLogoutResult(xhr)
                } catch (e) {
                    throw e
                }
            }
            if (isAsync && this.authenticationModel === progress.data
                .Session.AUTH_TYPE_ANON) {
                try {
                    this._processLogoutResult(xhr)
                } catch (e) {
                    errorObject = e
                }
                this._logoutComplete(this, null, errorObject, xhr)
            }
        };
        this._logoutComplete = function(pdsession, result, errorObject,
            xhr) {
            pdsession.trigger("afterLogout", pdsession, errorObject,
                xhr)
        };
        this._processLogoutResult = function(xhr) {
            var logoutSucceeded;
            var pdsession = xhr.pdsession;
            var basicStatusOK = false;
            if (xhr._anonymousLogoutOK) {
                logoutSucceeded = true
            } else {
                if (xhr.status !== 200) {
                    if (pdsession.authenticationModel === progress.data
                        .Session.AUTH_TYPE_BASIC) {
                        if (xhr.status === 404) {
                            logoutSucceeded = true
                        } else {
                            logoutSucceeded = false;
                            throw new Error(
                                "Error logging out, HTTP status = " +
                                xhr.status)
                        }
                    } else {
                        logoutSucceeded = false;
                        throw new Error(
                            "Error logging out, HTTP status = " +
                            xhr.status)
                    }
                } else {
                    logoutSucceeded = true
                }
            }
            updateContextPropsFromResponse(pdsession, xhr);
            pdsession._reinitializeAfterLogout(pdsession,
                logoutSucceeded)
        };
        this._reinitializeAfterLogout = function(pdsession, success) {
            setLoginResult(null, pdsession);
            setLoginHttpStatus(null, pdsession);
            setClientContextID(null, pdsession);
            setUserName(null, pdsession);
            _password = null;
            if (success) {
                restApplicationIsOnline = false;
                oepingAvailable = false;
                partialPingURI = defaultPartialPingURI;
                setLastSessionXHR(null, pdsession)
            }
        };
        this.addCatalog = function() {
            var catalogURI, catalogUserName, catalogPassword,
                isAsync = false,
                xhr, deferred, jsdosession, iOSBasicAuthTimeout,
                catalogIndex;
            if (arguments.length > 0) {
                if (typeof(arguments[0]) === "object") {
                    if (!arguments[0].offlineAddCatalog) {
                        if (this.loginResult !== progress.data.Session
                            .LOGIN_SUCCESS && this.authenticationModel
                        ) {
                            throw new Error(
                                "Attempted to call addCatalog when there is no active session."
                            )
                        }
                    }
                    catalogURI = arguments[0].catalogURI;
                    if (!catalogURI || (typeof catalogURI !=
                            "string")) {
                        throw new Error(progress.data._getMsgText(
                            "jsdoMSG033", "Session",
                            "addCatalog",
                            "The catalogURI argument was missing or invalid."
                        ))
                    }
                    catalogUserName = arguments[0].userName;
                    if (catalogUserName && (typeof catalogUserName !=
                            "string")) {
                        throw new Error(progress.data._getMsgText(
                            "jsdoMSG033", "Session",
                            "addCatalog",
                            "The catalogUserName argument was invalid."
                        ))
                    }
                    catalogPassword = arguments[0].password;
                    if (catalogPassword && (typeof catalogPassword !=
                            "string")) {
                        throw new Error(progress.data._getMsgText(
                            "jsdoMSG033", "Session",
                            "addCatalog",
                            "The catalogPassword argument was invalid."
                        ))
                    }
                    isAsync = arguments[0].async;
                    if (isAsync && (typeof isAsync != "boolean")) {
                        throw new Error(progress.data._getMsgText(
                            "jsdoMSG033", "Session",
                            "addCatalog",
                            "The async argument was invalid."
                        ))
                    }
                    iOSBasicAuthTimeout = arguments[0].iOSBasicAuthTimeout;
                    if (typeof iOSBasicAuthTimeout == "undefined") {
                        iOSBasicAuthTimeout =
                            defaultiOSBasicAuthTimeout
                    } else {
                        if (iOSBasicAuthTimeout && (typeof iOSBasicAuthTimeout !=
                                "number")) {
                            throw new Error(progress.data._getMsgText(
                                "jsdoMSG033", "Session",
                                "addCatalog",
                                "The iOSBasicAuthTimeout argument was invalid."
                            ))
                        }
                    }
                    deferred = arguments[0].deferred;
                    jsdosession = arguments[0].jsdosession;
                    catalogIndex = arguments[0].catalogIndex
                } else {
                    catalogURI = arguments[0];
                    if (typeof catalogURI != "string") {
                        throw new Error(
                            "First argument to Session.addCatalog must be the URL of the catalog."
                        )
                    }
                    catalogUserName = arguments[1];
                    if (catalogUserName && (typeof catalogUserName !=
                            "string")) {
                        throw new Error(
                            "Second argument to Session.addCatalog must be a user name string."
                        )
                    }
                    catalogPassword = arguments[2];
                    if (catalogPassword && (typeof catalogPassword !=
                            "string")) {
                        throw new Error(
                            "Third argument to Session.addCatalog must be a password string."
                        )
                    }
                }
            } else {
                throw new Error(
                    "Session.addCatalog is missing its first argument, the URL of the catalog."
                )
            }
            if (!catalogUserName) {
                catalogUserName = this.userName
            }
            if (!catalogPassword) {
                catalogPassword = _password
            }
            xhr = new XMLHttpRequest();
            xhr.pdsession = this;
            xhr._catalogURI = catalogURI;
            if (progress.data.ServicesManager.getSession(catalogURI) !==
                undefined) {
                if (isAsync) {
                    xhr._jsdosession = jsdosession;
                    xhr._deferred = deferred;
                    xhr._catalogIndex = catalogIndex;
                    setTimeout(this._addCatalogComplete, 10, this,
                        progress.data.Session.CATALOG_ALREADY_LOADED,
                        null, xhr);
                    return progress.data.Session.ASYNC_PENDING
                }
                return progress.data.Session.CATALOG_ALREADY_LOADED
            }
            this._setXHRCredentials(xhr, "GET", catalogURI,
                catalogUserName, catalogPassword, isAsync);
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.setRequestHeader("Pragma", "no-cache");
            setRequestHeaderFromContextProps(this, xhr);
            if (this.authenticationModel === progress.data.Session.AUTH_TYPE_FORM) {
                _addWithCredentialsAndAccept(xhr,
                    "application/json")
            }
            if (isAsync) {
                xhr.onreadystatechange = this._onReadyStateChangeGeneric;
                xhr.onResponseFn = this._processAddCatalogResult;
                xhr.onResponseProcessedFn = this._addCatalogComplete;
                if (this.authenticationModel === progress.data.Session
                    .AUTH_TYPE_BASIC && isUserAgentiOS &&
                    iOSBasicAuthTimeout) {
                    xhr._requestTimeout = setTimeout(function() {
                        clearTimeout(xhr._requestTimeout);
                        xhr.abort()
                    }, iOSBasicAuthTimeout)
                }
                xhr._jsdosession = jsdosession;
                xhr._deferred = deferred;
                xhr._catalogIndex = catalogIndex
            }
            try {
                if (typeof this.onOpenRequest === "function") {
                    setLastSessionXHR(xhr, this);
                    var params = {
                        xhr: xhr,
                        verb: "GET",
                        uri: catalogURI,
                        async: false,
                        formPreTest: false,
                        session: this
                    };
                    this.onOpenRequest(params);
                    xhr = params.xhr
                }
                setLastSessionXHR(xhr, this);
                xhr.send(null)
            } catch (e) {
                throw new Error("Error retrieving catalog '" +
                    catalogURI + "'.\n" + e.message)
            }
            if (isAsync) {
                return progress.data.Session.ASYNC_PENDING
            } else {
                return this._processAddCatalogResult(xhr)
            }
        };
        this._processAddCatalogResult = function(xhr) {
            var _catalogHttpStatus = xhr.status;
            var theSession = xhr.pdsession;
            var servicedata;
            var catalogURI = xhr._catalogURI,
                serviceURL;
            setLastSessionXHR(xhr, theSession);
            updateContextPropsFromResponse(theSession, xhr);
            if ((_catalogHttpStatus == 200) || (_catalogHttpStatus ===
                    0) && xhr.responseText) {
                servicedata = theSession._parseCatalog(xhr);
                try {
                    progress.data.ServicesManager.addCatalog(
                        servicedata, theSession)
                } catch (e) {
                    if (progress.data.ServicesManager.getSession(
                            catalogURI) !== undefined) {
                        return progress.data.Session.CATALOG_ALREADY_LOADED
                    }
                    throw new Error("Error processing catalog '" +
                        catalogURI + "'. \n" + e.message)
                }
                for (var i = 0; i < servicedata.length; i++) {
                    serviceURL = theSession._prependAppURL(
                        servicedata[i].address);
                    pushService(new progress.data.MobileServiceObject({
                        name: servicedata[i].name,
                        uri: serviceURL
                    }), theSession);
                    if (servicedata[i].settings && servicedata[i].settings
                        .useXClientProps && !theSession.xClientProps
                    ) {
                        console.warn(
                            "Catalog warning: Service settings property 'useXClientProps' is true but 'xClientProps' property has not been set."
                        )
                    }
                }
                pushCatalogURIs(catalogURI, theSession);
                progress.data.ServicesManager.addSession(catalogURI,
                    theSession)
            } else {
                if (_catalogHttpStatus == 401) {
                    return progress.data.Session.AUTHENTICATION_FAILURE
                } else {
                    throw new Error("Error retrieving catalog '" +
                        catalogURI + "'. Http status: " +
                        _catalogHttpStatus + ".")
                }
            }
            return progress.data.Session.SUCCESS
        };
        this._addCatalogComplete = function(pdsession, result, errObj,
            xhr) {
            pdsession.trigger("afterAddCatalog", pdsession, result,
                errObj, xhr)
        };
        this.ping = function(args) {
            var pingResult = false;
            var pingArgs = {
                pingURI: null,
                async: true,
                onCompleteFn: null,
                fireEventIfOfflineChange: true,
                onReadyStateFn: this._onReadyStateChangePing,
                offlineReason: null
            };
            if (args) {
                if (args.async !== undefined) {
                    pingArgs.async = args.async
                }
                if (args.doNotFireEvent !== undefined) {
                    pingArgs.fireEventIfOfflineChange = !args.doNotFireEvent
                }
                if (args.onCompleteFn && (typeof args.onCompleteFn) ==
                    "function") {
                    pingArgs.onCompleteFn = args.onCompleteFn
                }
                pingArgs.deferred = args.deferred;
                pingArgs.jsdosession = args.jsdosession
            }
            pingArgs.pingURI = myself._makePingURI();
            myself._sendPing(pingArgs);
            if (!pingArgs.async) {
                if (pingArgs.xhr) {
                    pingResult = myself._processPingResult(pingArgs);
                    if (args.offlineReason !== undefined) {
                        args.offlineReason = pingArgs.offlineReason
                    }
                } else {
                    pingResult = false
                }
            }
            return pingResult
        };
        this._isOnlineStateChange = function(isOnline) {
            var stateChanged = false;
            if (isOnline && !(this.connected)) {
                stateChanged = true
            } else {
                if (!isOnline && (this.connected)) {
                    stateChanged = true
                }
            }
            return stateChanged
        };
        this._checkServiceResponse = function(xhr, success, request) {
            var offlineReason = null,
                wasOnline = this.connected;
            updateContextPropsFromResponse(this, xhr);
            if (!this._events) {
                return
            }
            var offlineObservers = this._events.offline || [];
            var onlineObservers = this._events.online || [];
            if ((offlineObservers.length === 0) && (onlineObservers
                    .length === 0)) {
                return
            }
            if (success) {
                restApplicationIsOnline = true;
                deviceIsOnline = true
            } else {
                if (deviceIsOnline) {
                    var localPingArgs = {
                        doNotFireEvent: true,
                        offlineReason: null,
                        async: false
                    };
                    if (!(myself.ping(localPingArgs))) {
                        offlineReason = localPingArgs.offlineReason;
                        restApplicationIsOnline = false
                    } else {
                        restApplicationIsOnline = true
                    }
                }
            }
            if (wasOnline && !this.connected) {
                this.trigger("offline", this, offlineReason,
                    request)
            } else {
                if (!wasOnline && this.connected) {
                    this.trigger("online", this, request)
                }
            }
        };
        this._processPingResult = function(args) {
            var xhr = args.xhr;
            var pingResponseJSON;
            var appServerStatus = null;
            var wasOnline = this.connected;
            if (xhr.status >= 200 && xhr.status < 300) {
                updateContextPropsFromResponse(this, xhr);
                if (oepingAvailable) {
                    try {
                        pingResponseJSON = JSON.parse(xhr.responseText);
                        appServerStatus = pingResponseJSON.AppServerStatus
                    } catch (e) {
                        console.error(
                            "Unable to parse ping response.")
                    }
                }
                restApplicationIsOnline = true
            } else {
                if (deviceIsOnline) {
                    if (xhr.status === 0) {
                        args.offlineReason = progress.data.Session.SERVER_OFFLINE;
                        restApplicationIsOnline = false
                    } else {
                        if ((xhr.status === 404) || (xhr.status ===
                                410)) {
                            args.offlineReason = progress.data.Session
                                .WEB_APPLICATION_OFFLINE;
                            restApplicationIsOnline = false
                        } else {
                            restApplicationIsOnline = true
                        }
                    }
                } else {
                    args.offlineReason = progress.data.Session.DEVICE_OFFLINE
                }
            }
            if (appServerStatus) {
                if (appServerStatus.PingStatus === "false") {
                    args.offlineReason = progress.data.Session.APPSERVER_OFFLINE;
                    restApplicationIsOnline = false
                } else {
                    restApplicationIsOnline = true
                }
            }
            if ((typeof xhr.onCompleteFn) == "function") {
                xhr.onCompleteFn({
                    pingResult: this.connected,
                    xhr: xhr,
                    offlineReason: args.offlineReason
                })
            }
            if (args.fireEventIfOfflineChange) {
                if (wasOnline && !this.connected) {
                    myself.trigger("offline", myself, args.offlineReason,
                        null)
                } else {
                    if (!wasOnline && this.connected) {
                        myself.trigger("online", myself, null)
                    }
                }
            }
            return this.connected
        };
        this._onReadyStateChangePing = function() {
            var xhr = this;
            var args;
            if (xhr.readyState == 4) {
                args = {
                    xhr: xhr,
                    fireEventIfOfflineChange: true,
                    offlineReason: null
                };
                myself._processPingResult(args);
                if (_pingInterval > 0) {
                    _timeoutID = setTimeout(myself._autoping,
                        _pingInterval)
                }
            }
        };
        this._pingtestOnReadyStateChange = function() {
            var xhr = this;
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    oepingAvailable = true
                } else {
                    oepingAvailable = false;
                    partialPingURI = myself.loginTarget;
                    console.warn(
                        "Default ping target not available, will use loginTarget instead."
                    )
                }
            }
        };
        this._sendPing = function(args) {
            var xhr = new XMLHttpRequest();
            try {
                this._setXHRCredentials(xhr, "GET", args.pingURI,
                    this.userName, _password, args.async);
                if (args.async) {
                    xhr.onreadystatechange = args.onReadyStateFn;
                    xhr.onCompleteFn = args.onCompleteFn;
                    xhr._jsdosession = args.jsdosession;
                    xhr._deferred = args.deferred
                }
                xhr.setRequestHeader("Cache-Control", "no-cache");
                xhr.setRequestHeader("Pragma", "no-cache");
                setRequestHeaderFromContextProps(this, xhr);
                if (this.authenticationModel === progress.data.Session
                    .AUTH_TYPE_FORM) {
                    _addWithCredentialsAndAccept(xhr,
                        "application/json,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                    )
                }
                xhr.send(null)
            } catch (e) {
                args.error = e
            }
            args.xhr = xhr
        };
        this._makePingURI = function() {
            var pingURI = this.serviceURI + partialPingURI;
            if (progress.data.Session._useTimeStamp) {
                pingURI = this._addTimeStampToURL(pingURI)
            }
            return pingURI
        };
        this._autoping = function() {
            myself.ping({
                async: true
            })
        };
        this._setXHRCredentials = function(xhr, verb, uri, userName,
            password, async) {
            if (userName && this.authenticationModel === progress.data
                .Session.AUTH_TYPE_BASIC) {
                if (isFirefox) {
                    xhr.open(verb, uri, async)
                } else {
                    xhr.open(verb, uri, async, userName, password)
                }
                var auth = _make_basic_auth(userName, password);
                xhr.setRequestHeader("Authorization", auth)
            } else {
                xhr.open(verb, uri, async)
            }
        };
        this._addCCIDtoURL = function(url) {
            if (this.clientContextId && (this.clientContextId !==
                    "0")) {
                if (url.substring(0, this.serviceURI.length) ==
                    this.serviceURI) {
                    var jsessionidStr = "JSESSIONID=" + this.clientContextId +
                        ";";
                    var index = url.indexOf("?");
                    if (index == -1) {
                        url += "?" + jsessionidStr
                    } else {
                        url = url.substring(0, index + 1) +
                            jsessionidStr + url.substring(index + 1)
                    }
                }
            }
            return url
        };
        var SEQ_MAX_VALUE = 999999999999999;
        var _tsseq = SEQ_MAX_VALUE;
        var _tsprefix1 = 0;
        var _tsprefix2 = 0;
        this._getNextTimeStamp = function() {
            var seq = ++_tsseq;
            if (seq >= SEQ_MAX_VALUE) {
                _tsseq = seq = 1;
                var t = Math.floor((Date.now ? Date.now() : (new Date()
                    .getTime())) / 10000);
                if (_tsprefix1 == t) {
                    _tsprefix2++;
                    if (_tsprefix2 >= SEQ_MAX_VALUE) {
                        _tsprefix2 = 1
                    }
                } else {
                    _tsprefix1 = t;
                    Math.random();
                    _tsprefix2 = Math.round(Math.random() *
                        10000000000)
                }
            }
            return _tsprefix1 + "-" + _tsprefix2 + "-" + seq
        };
        this._addTimeStampToURL = function(url) {
            var timeStamp = "_ts=" + this._getNextTimeStamp();
            url += ((url.indexOf("?") == -1) ? "?" : "&") +
                timeStamp;
            return url
        };
        this._saveClientContextId = function(xhr) {
            setClientContextIDfromXHR(xhr, this)
        };
        this._parseCatalog = function(xhr) {
            var jsonObject;
            var catalogdata;
            try {
                jsonObject = JSON.parse(xhr.responseText);
                catalogdata = jsonObject.services
            } catch (e) {
                console.error(
                    "Unable to parse response. Make sure catalog has correct format."
                );
                catalogdata = null
            }
            return catalogdata
        };
        this._prependAppURL = function(oldURL) {
            if (!oldURL) {
                return this.serviceURI
            }
            var newURL = oldURL;
            var pat = /^https?:\/\//i;
            if (!pat.test(newURL)) {
                if (newURL.indexOf("/") !== 0) {
                    newURL = "/" + newURL
                }
                newURL = this.serviceURI + newURL
            }
            return newURL
        };

        function _addWithCredentialsAndAccept(xhr, acceptString) {
            try {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Accept", acceptString)
            } catch (e) {}
        }

        function _make_basic_auth(user, pw) {
            var tok = user + ":" + pw;
            var hash = btoa(tok);
            return "Basic " + hash
        }
        var loginFormIDString = "j_spring_security_check";

        function _gotLoginForm(xhr) {
            return _findStringInResponseHTML(xhr, loginFormIDString)
        }
        var loginFailureIdentificationString = "login failed";

        function _gotLoginFailure(xhr) {
            return _findStringInResponseHTML(xhr,
                loginFailureIdentificationString)
        }

        function _findStringInResponseHTML(xhr, searchString) {
            if (!xhr.responseText) {
                return false
            }
            var contentType = xhr.getResponseHeader("Content-Type");
            if ((contentType.indexOf("text/html") >= 0) && (xhr.responseText
                    .indexOf(searchString) >= 0)) {
                return true
            }
            return false
        }

        function handleJSONLoginResponse(params) {
            var jsonObject;
            params.statusFromjson = null;
            try {
                jsonObject = JSON.parse(params.xhr.responseText);
                if (jsonObject.status_code !== undefined &&
                    jsonObject.status_txt !== undefined) {
                    params.statusFromjson = jsonObject.status_code
                }
            } catch (e) {
                setLoginResult(progress.data.Session.LOGIN_GENERAL_FAILURE,
                    params.session);
                setLoginHttpStatus(xhr.status, params.session);
                throw new Error(
                    "Unable to parse login response from server."
                )
            }
        }

        function setRequestHeaderFromContextProps(session, xhr) {
            if (session.xClientProps) {
                xhr.setRequestHeader("X-CLIENT-PROPS", session.xClientProps)
            } else {
                if (session._contextProperties.contextHeader !==
                    undefined) {
                    xhr.setRequestHeader("X-CLIENT-PROPS", session._contextProperties
                        .contextHeader)
                }
            }
        }

        function updateContextPropsFromResponse(session, xhr) {
            var contextString, context;
            if (xhr) {
                contextString = getResponseHeaderNoError(xhr,
                    "X-CLIENT-PROPS");
                if (contextString) {
                    try {
                        context = JSON.parse(contextString)
                    } catch (e) {}
                    if (typeof context === "object") {
                        session._contextProperties.setContext(
                            context)
                    } else {
                        throw new Error(progress.data._getMsgText(
                            "jsdoMSG123", "Session",
                            "X-CLIENT-PROPS"))
                    }
                } else {
                    if (contextString === "") {
                        session._contextProperties.setContext({})
                    }
                }
            }
        }
    };
    progress.data.Session._useTimeStamp = true;
    if ((typeof Object.defineProperty) == "function") {
        Object.defineProperty(progress.data.Session, "LOGIN_SUCCESS", {
            value: 1,
            enumerable: true
        });
        Object.defineProperty(progress.data.Session,
            "LOGIN_AUTHENTICATION_FAILURE", {
                value: 2,
                enumerable: true
            });
        Object.defineProperty(progress.data.Session,
            "LOGIN_GENERAL_FAILURE", {
                value: 3,
                enumerable: true
            });
        Object.defineProperty(progress.data.Session,
            "CATALOG_ALREADY_LOADED", {
                value: 4,
                enumerable: true
            });
        Object.defineProperty(progress.data.Session, "ASYNC_PENDING", {
            value: 5,
            enumerable: true
        });
        Object.defineProperty(progress.data.Session, "SUCCESS", {
            value: 1,
            enumerable: true
        });
        Object.defineProperty(progress.data.Session,
            "AUTHENTICATION_FAILURE", {
                value: 2,
                enumerable: true
            });
        Object.defineProperty(progress.data.Session, "GENERAL_FAILURE", {
            value: 3,
            enumerable: true
        });
        Object.defineProperty(progress.data.Session, "AUTH_TYPE_ANON", {
            value: "anonymous",
            enumerable: true
        });
        Object.defineProperty(progress.data.Session, "AUTH_TYPE_BASIC", {
            value: "basic",
            enumerable: true
        });
        Object.defineProperty(progress.data.Session, "AUTH_TYPE_FORM", {
            value: "form",
            enumerable: true
        });
        Object.defineProperty(progress.data.Session, "DEVICE_OFFLINE", {
            value: "Device is offline",
            enumerable: true
        });
        Object.defineProperty(progress.data.Session, "SERVER_OFFLINE", {
            value: "Cannot contact server",
            enumerable: true
        });
        Object.defineProperty(progress.data.Session,
            "WEB_APPLICATION_OFFLINE", {
                value: "Mobile Web Application is not available",
                enumerable: true
            });
        Object.defineProperty(progress.data.Session, "SERVICE_OFFLINE", {
            value: "REST web Service is not available",
            enumerable: true
        });
        Object.defineProperty(progress.data.Session, "APPSERVER_OFFLINE", {
            value: "AppServer is not available",
            enumerable: true
        })
    } else {
        progress.data.Session.LOGIN_SUCCESS = 1;
        progress.data.Session.LOGIN_AUTHENTICATION_FAILURE = 2;
        progress.data.Session.LOGIN_GENERAL_FAILURE = 3;
        progress.data.Session.CATALOG_ALREADY_LOADED = 4;
        progress.data.Session.SUCCESS = 1;
        progress.data.Session.AUTHENTICATION_FAILURE = 2;
        progress.data.Session.GENERAL_FAILURE = 3;
        progress.data.Session.AUTH_TYPE_ANON = "anonymous";
        progress.data.Session.AUTH_TYPE_BASIC = "basic";
        progress.data.Session.AUTH_TYPE_FORM = "form"
    }
    progress.data.Session.prototype = new progress.util.Observable();
    progress.data.Session.prototype.constructor = progress.data.Session;

    function validateSessionSubscribe(args, evt, listenerData) {
        listenerData.operation = undefined;
        var found = false;
        for (var i = 0; i < this._eventNames.length; i++) {
            if (evt === this._eventNames[i].toLowerCase()) {
                found = true;
                break
            }
        }
        if (!found) {
            throw new Error(progress.data._getMsgText("jsdoMSG042", evt))
        }
        if (args.length < 2) {
            throw new Error(progress.data._getMsgText("jsdoMSG038", 2))
        }
        if (typeof args[0] !== "string") {
            throw new Error(progress.data._getMsgText("jsdoMSG039"))
        }
        if (typeof args[1] !== "function") {
            throw new Error(progress.data._getMsgText("jsdoMSG040"))
        } else {
            listenerData.fn = args[1]
        }
        if (args.length > 2) {
            if (typeof args[2] !== "object") {
                throw new Error(progress.data._getMsgText("jsdoMSG041",
                    evt))
            } else {
                listenerData.scope = args[2]
            }
        }
    }
    progress.data.Session.prototype._eventNames = ["offline", "online",
        "afterLogin", "afterAddCatalog", "afterLogout"
    ];
    progress.data.Session.prototype.validateSubscribe =
        validateSessionSubscribe;
    progress.data.Session.prototype.toString = function(radix) {
        return "progress.data.Session"
    };
    progress.data.JSDOSession = function JSDOSession(options) {
        var _pdsession, _serviceURI, _myself = this;
        Object.defineProperty(this, "authenticationModel", {
            get: function() {
                return _pdsession ? _pdsession.authenticationModel :
                    undefined
            },
            enumerable: true
        });
        Object.defineProperty(this, "catalogURIs", {
            get: function() {
                return _pdsession ? _pdsession.catalogURIs :
                    undefined
            },
            enumerable: true
        });
        Object.defineProperty(this, "clientContextId", {
            get: function() {
                return _pdsession ? _pdsession.clientContextId :
                    undefined
            },
            enumerable: true
        });
        Object.defineProperty(this, "connected", {
            get: function() {
                return _pdsession ? _pdsession.connected :
                    undefined
            },
            enumerable: true
        });
        Object.defineProperty(this, "JSDOs", {
            get: function() {
                return _pdsession ? _pdsession.JSDOs :
                    undefined
            },
            enumerable: true
        });
        Object.defineProperty(this, "loginResult", {
            get: function() {
                return _pdsession ? _pdsession.loginResult :
                    undefined
            },
            enumerable: true
        });
        Object.defineProperty(this, "loginHttpStatus", {
            get: function() {
                return _pdsession ? _pdsession.loginHttpStatus :
                    undefined
            },
            enumerable: true
        });
        Object.defineProperty(this, "onOpenRequest", {
            get: function() {
                return _pdsession ? _pdsession.onOpenRequest :
                    undefined
            },
            set: function(newval) {
                if (_pdsession) {
                    _pdsession.onOpenRequest = newval
                }
            },
            enumerable: true
        });
        Object.defineProperty(this, "pingInterval", {
            get: function() {
                return _pdsession ? _pdsession.pingInterval :
                    undefined
            },
            set: function(newval) {
                if (_pdsession) {
                    _pdsession.pingInterval = newval
                }
            },
            enumerable: true
        });
        Object.defineProperty(this, "services", {
            get: function() {
                return _pdsession ? _pdsession.services :
                    undefined
            },
            enumerable: true
        });
        Object.defineProperty(this, "serviceURI", {
            get: function() {
                if (_pdsession && _pdsession.serviceURI) {
                    return _pdsession.serviceURI
                } else {
                    return _serviceURI
                }
            },
            enumerable: true
        });
        Object.defineProperty(this, "userName", {
            get: function() {
                return _pdsession ? _pdsession.userName :
                    undefined
            },
            enumerable: true
        });

        function onAfterLogin(pdsession, result, errorObject, xhr) {
            if (xhr && xhr._deferred) {
                if (result === progress.data.Session.SUCCESS) {
                    xhr._deferred.resolve(xhr._jsdosession, result, {
                        errorObject: errorObject,
                        xhr: xhr
                    })
                } else {
                    xhr._deferred.reject(xhr._jsdosession, result, {
                        errorObject: errorObject,
                        xhr: xhr
                    })
                }
            }
        }

        function onAfterAddCatalog(pdsession, result, errorObject, xhr) {
            var deferred;
            if (xhr && xhr._deferred) {
                deferred = xhr._deferred;
                if (result !== progress.data.Session.SUCCESS &&
                    result !== progress.data.Session.CATALOG_ALREADY_LOADED
                ) {
                    result = result || progress.data.Session.GENERAL_FAILURE;
                    deferred._overallCatalogResult = progress.data.Session
                        .GENERAL_FAILURE
                }
                deferred._results[xhr._catalogIndex] = {
                    catalogURI: xhr._catalogURI,
                    result: result,
                    errorObject: errorObject,
                    xhr: xhr
                };
                deferred._numCatalogsProcessed += 1;
                if (deferred._numCatalogsProcessed === deferred._numCatalogs) {
                    deferred._processedPromise = true;
                    if (!deferred._overallCatalogResult) {
                        xhr._deferred.resolve(xhr._jsdosession,
                            progress.data.Session.SUCCESS, xhr._deferred
                            ._results)
                    } else {
                        xhr._deferred.reject(xhr._jsdosession,
                            progress.data.Session.GENERAL_FAILURE,
                            xhr._deferred._results)
                    }
                }
            }
        }

        function onAfterLogout(pdsession, errorObject, xhr) {
            if (xhr && xhr._deferred) {
                if (!errorObject && !pdsession.loginResult) {
                    xhr._deferred.resolve(xhr._jsdosession,
                        progress.data.Session.SUCCESS, {
                            errorObject: errorObject,
                            xhr: xhr
                        })
                } else {
                    xhr._deferred.reject(xhr._jsdosession, progress
                        .data.Session.SUCCESS, {
                            errorObject: errorObject,
                            xhr: xhr
                        })
                }
            }
        }

        function onPingComplete(args) {
            var xhr;
            if (args.xhr && args.xhr._deferred) {
                xhr = args.xhr;
                if (args.pingResult) {
                    xhr._deferred.resolve(xhr._jsdosession, args.pingResult, {
                        offlineReason: args.offlineReason,
                        xhr: xhr
                    })
                } else {
                    xhr._deferred.reject(xhr._jsdosession, args.pingResult, {
                        offlineReason: args.offlineReason,
                        xhr: xhr
                    })
                }
            }
        }
        this.login = function(username, password, options) {
            var deferred = $.Deferred(),
                loginResult, errorObject, iOSBasicAuthTimeout;
            if (typeof(options) === "object") {
                iOSBasicAuthTimeout = options.iOSBasicAuthTimeout
            }
            try {
                _pdsession.subscribe("afterLogin", onAfterLogin,
                    this);
                loginResult = _pdsession.login({
                    serviceURI: this.serviceURI,
                    userName: username,
                    password: password,
                    async: true,
                    deferred: deferred,
                    jsdosession: this,
                    iOSBasicAuthTimeout: iOSBasicAuthTimeout
                });
                if (loginResult !== progress.data.Session.ASYNC_PENDING) {
                    errorObject = new Error(
                        "JSDOSession: Unable to send login request."
                    )
                }
            } catch (e) {
                errorObject = new Error(
                    "JSDOSession: Unable to send login request. " +
                    e.message)
            }
            if (errorObject) {
                throw errorObject
            } else {
                return deferred.promise()
            }
        };
        this.addCatalog = function(catalogURI, username, password,
            options) {
            var deferred = $.Deferred(),
                catalogURIs, numCatalogs, catalogIndex, addResult,
                errorObject, iOSBasicAuthTimeout;
            if (typeof catalogURI == "string") {
                catalogURIs = [catalogURI]
            } else {
                if (catalogURI instanceof Array) {
                    catalogURIs = catalogURI
                } else {
                    throw new Error(progress.data._getMsgText(
                        "jsdoMSG033", "JSDOSession",
                        "addCatalog",
                        "The catalogURI parameter must be a string or an array of strings."
                    ))
                }
            }
            if (typeof(options) === "object") {
                iOSBasicAuthTimeout = options.iOSBasicAuthTimeout
            }
            _pdsession.subscribe("afterAddCatalog",
                onAfterAddCatalog, this);
            numCatalogs = catalogURIs.length;
            deferred._numCatalogs = numCatalogs;
            deferred._numCatalogsProcessed = 0;
            deferred._results = [];
            deferred._results.length = numCatalogs;
            for (catalogIndex = 0; catalogIndex < numCatalogs; catalogIndex +=
                1) {
                errorObject = undefined;
                addResult = undefined;
                try {
                    addResult = _pdsession.addCatalog({
                        catalogURI: catalogURIs[
                            catalogIndex],
                        async: true,
                        userName: username,
                        password: password,
                        deferred: deferred,
                        jsdosession: this,
                        catalogIndex: catalogIndex,
                        iOSBasicAuthTimeout: iOSBasicAuthTimeout,
                        offlineAddCatalog: true
                    })
                } catch (e) {
                    errorObject = new Error(
                        "JSDOSession: Unable to send addCatalog request. " +
                        e.message)
                }
                if (addResult !== progress.data.Session.ASYNC_PENDING) {
                    deferred._overallCatalogResult = progress.data.Session
                        .GENERAL_FAILURE;
                    if (errorObject) {
                        addResult = progress.data.Session.GENERAL_FAILURE
                    }
                    deferred._results[catalogIndex] = {
                        catalogURI: catalogURIs[catalogIndex],
                        result: addResult,
                        errorObject: errorObject,
                        xhr: undefined
                    };
                    deferred._numCatalogsProcessed += 1
                }
            }
            if ((deferred._numCatalogsProcessed === numCatalogs) &&
                !deferred._processedPromise) {
                if (deferred._overallCatalogResult === progress.data
                    .Session.GENERAL_FAILURE) {
                    deferred.reject(this, progress.data.Session.GENERAL_FAILURE,
                        deferred._results)
                } else {
                    deferred.resolve(this, progress.data.Session.SUCCESS,
                        deferred._results)
                }
            }
            return deferred.promise()
        };
        this.logout = function() {
            var deferred = $.Deferred();
            try {
                _pdsession.subscribe("afterLogout", onAfterLogout,
                    this);
                _pdsession.logout({
                    async: true,
                    deferred: deferred,
                    jsdosession: this
                })
            } catch (e) {
                throw new Error(
                    "JSDOSession: Unable to send logout request. " +
                    e.message)
            }
            return deferred.promise()
        };
        this.ping = function() {
            var deferred = $.Deferred();
            try {
                _pdsession.ping({
                    async: true,
                    deferred: deferred,
                    jsdosession: this,
                    onCompleteFn: onPingComplete
                })
            } catch (e) {
                throw new Error(
                    "JSDOSession: Unable to send ping request. " +
                    e.message)
            }
            return deferred.promise()
        };
        this.setContext = function(context) {
            _pdsession._contextProperties.setContext(context)
        };
        this.setContextProperty = function(propertyName, propertyValue) {
            _pdsession._contextProperties.setContextProperty(
                propertyName, propertyValue)
        };
        this.getContext = function() {
            return _pdsession._contextProperties.getContext()
        };
        this.getContextProperty = function(propertyName) {
            return _pdsession._contextProperties.getContextProperty(
                propertyName)
        };
        this._onlineHandler = function(session, request) {
            _myself.trigger("online", _myself, request)
        };
        this._offlineHandler = function(session, offlineReason, request) {
            _myself.trigger("offline", _myself, offlineReason,
                request)
        };
        if ((arguments.length > 0) && (typeof(arguments[0]) ===
                "object")) {
            if (options.serviceURI && (typeof(options.serviceURI) ===
                    "string")) {
                _serviceURI = options.serviceURI
            } else {
                throw new Error(progress.data._getMsgText("jsdoMSG033",
                    "JSDOSession", "the constructor",
                    "The options parameter must include a 'serviceURI' property that is a string."
                ))
            }
            if (options.authenticationModel) {
                if (typeof(options.authenticationModel) !== "string") {
                    throw new Error(progress.data._getMsgText(
                        "jsdoMSG033", "JSDOSession",
                        "the constructor",
                        "The authenticationModel property of the options parameter must be a string."
                    ))
                }
            }
        } else {
            throw new Error(progress.data._getMsgText("jsdoMSG033",
                "JSDOSession", "the constructor",
                "The options argument was missing or invalid."))
        }
        _pdsession = new progress.data.Session();
        try {
            if (options.authenticationModel) {
                _pdsession.authenticationModel = options.authenticationModel
            }
            if (options.context) {
                this.setContext(options.context)
            }
            _pdsession.subscribe("online", this._onlineHandler, this);
            _pdsession.subscribe("offline", this._offlineHandler, this)
        } catch (err) {
            _pdsession = undefined;
            throw err
        }
    };
    progress.data.JSDOSession.prototype = new progress.util.Observable();
    progress.data.JSDOSession.prototype.constructor = progress.data.JSDOSession;

    function validateJSDOSessionSubscribe(args, evt, listenerData) {
        listenerData.operation = undefined;
        var found = false;
        for (var i = 0; i < this._eventNames.length; i++) {
            if (evt === this._eventNames[i].toLowerCase()) {
                found = true;
                break
            }
        }
        if (!found) {
            throw new Error(progress.data._getMsgText("jsdoMSG042", evt))
        }
        if (args.length < 2) {
            throw new Error(progress.data._getMsgText("jsdoMSG038", 2))
        }
        if (typeof args[0] !== "string") {
            throw new Error(progress.data._getMsgText("jsdoMSG039"))
        }
        if (typeof args[1] !== "function") {
            throw new Error(progress.data._getMsgText("jsdoMSG040"))
        } else {
            listenerData.fn = args[1]
        }
        if (args.length > 2) {
            if (typeof args[2] !== "object") {
                throw new Error(progress.data._getMsgText("jsdoMSG041",
                    evt))
            } else {
                listenerData.scope = args[2]
            }
        }
    }
    progress.data.JSDOSession.prototype._eventNames = ["offline", "online"];
    progress.data.JSDOSession.prototype.validateSubscribe =
        validateJSDOSessionSubscribe;
    progress.data.JSDOSession.prototype.toString = function(radix) {
        return "progress.data.JSDOSession"
    }
})();
if (typeof exports !== "undefined") {
    exports.progress = progress
};