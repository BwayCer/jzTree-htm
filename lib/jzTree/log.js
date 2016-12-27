/**
 * 日誌 log
 *
 * @file
 * @author 張本微
 * @license CC-BY-4.0
 * @see [個人網站]{@link http://bwaycer.github.io}
 */


/*! jzTree/log - Bway.Cer CC-BY-4.0 @license: bwaycer.github.io/license/CC-BY-4.0.html */

define( 'jzTree/log', function () {
    "use strict";

    /**
     * 日誌 控制台紀錄簿
     * @module log
     */

    var _arrayPush = Array.prototype.push;
    var _qSplice = Array.prototype.qSplice;

    function log() {}

    /**
     * 口述。
     * @memberof module:log.
     * @func tell
     * @param {Number} code - 類型代碼 1 表示 jzTree.js
     * @param {*} msg[ ...]
     */
    log.prototype.tell = function( numCode ){
        var arrArgu = [ 'tell' ];
        _arrayPush.apply( arrArgu, arguments );
        this.pushMsg.apply( this, arrArgu );
    };

    /**
     * 提醒。
     * @memberof module:log.
     * @func remind
     * @param {String} msgCode - 訊息代碼
     * @param {?String} addition - 附帶內容
     */
    log.prototype.remind = function( strMsgCode, anyAddition ){
        this.pushMsg( 'remind', strMsgCode, anyAddition );
    };

    /**
     * 不正確執行。
     * @memberof module:log.
     * @func throwErr
     * @see {@link module:log~_transErrArgus}
     */
    log.prototype.err = function( anyChoA, anyChoB, anyChoC ){
        var objErrInfo = _transErrArgus( anyChoA, anyChoB, anyChoC );
        this.pushMsg( 'err', objErrInfo.msgCode, objErrInfo.addition, objErrInfo.errFunc );
    };

    /**
     * 斷言。
     * @memberof module:log.
     * @func assert
     * @param {*} val : !val 此值將用於判斷是否拋出錯誤
     * @see 剩餘參數見 {@link module:log~_transErrArgus}
     * @see 參考 斷言模塊 {@link https://nodejs.org/api/assert.html}
     */
    log.prototype.assert = function( anyVal, anyChoA, anyChoB, anyChoC ){
        if( !anyVal ) this.throwErr( anyChoA, anyChoB, anyChoC );
    };

    /**
     * 錯誤執行。
     * @memberof module:log.
     * @func throwErr
     * @see {@link module:log~_transErrArgus}
     */
    log.prototype.throwErr = function( anyChoA, anyChoB, anyChoC ){
        var objErrInfo = _transErrArgus( anyChoA, anyChoB, anyChoC );
        this.pushMsg( 'throwErr', objErrInfo.msgCode, objErrInfo.addition, objErrInfo.errFunc );
    };

    /**
     * 轉譯錯誤參數： 轉譯錯誤執行的參數資訊。
     *
     * @memberof module:log~
     * @func _transErrArgus
     * @param {(String|Function)} choA
     * 若為 `String` : 訊息代碼。
     * <br>
     * 若為 `Function` : 錯誤類別函式。
     * @param {*} choB
     * 若 `choA === String` 則為 `*` : 附帶內容。
     * <br>
     * 若 `choA === Function` 則為 `String` : 訊息代碼。
     * @param {(undefined|*)} choC
     * 若 `choA === String` 則為 `undefined`。
     * <br>
     * 若 `choA === Function` 則為 `*`： 附帶內容。
     * @return {Object}
     * prop {function} Ans.errFunc： 錯誤類別函式。
     * <br>
     * prop {String} Ans.msgCode： 訊息代碼。
     * <br>
     * prop {any} Ans.addition： 附帶內容。
     */
    function _transErrArgus( anyChoA, anyChoB, anyChoC ){
        var funcError, strMsgCode, anyAddition;
        switch( typeof anyChoA ){
            case 'string':
                funcError = Error;
                strMsgCode = anyChoA;
                anyAddition = anyChoB;
                break;
            case 'function':
                funcError = anyChoA;
                strMsgCode = anyChoB;
                anyAddition = anyChoC;
                break;
            default:
                funcError = TypeError;
                strMsgCode = '_arguTypeErr';
                anyAddition = anyChoA;
        }

        return {
            errFunc: funcError,
            msgCode: strMsgCode,
            addition: anyAddition,
        };
    }

    /**
     * 推送訊息。
     *
     * @memberof module:log.
     * @func pushMsg
     * @param {String} origName - 執行來源 `tell`, `remind`, `err`, `throwErr`
     * @param {(Number|String)} code - 訊息代碼。
     * <br>
     * 若 `origName === 'tell'` 則為 `Number`： 類型代碼；
     * 否則為 `String`： 訊息代碼。
     * @param {*} choB
     * 若 `origName === 'tell'` 則為 `*`： 且之後的參數 msg[ ...] 皆為此類；
     * 否則為 {(undefined|String)}： 附帶內容。
     * @param {?Function} errFunc
     * 若 `origName === 'tell'` 則為 `null`；
     * 若 `origName === 'err', 'throwErr'` 則為 `Function`： 錯誤類別函式。
     */
    log.prototype.pushMsg = function( strOrigName, anyCode, anyChoB, anyErrFunc ){
        var msg, msg_forErrFunc;
        var arrArgs;
        switch( strOrigName ){
            case 'tell':
                switch ( arguments.length ) {
                    case 2: console.log( anyCode ); break;
                    case 3: console.log( anyCode, anyChoB ); break;
                    default:
                        arrArgs = _qSplice.call( arguments, 1 );
                        console.log.apply( console, arrArgs );
                }
                break;
            case 'remind':
                console.log( this.getMsg( anyCode ), anyChoB );
                break;
            case 'err':
                msg = this.getMsg( anyCode );
                msg_forErrFunc = !anyChoB ? msg : ( msg + ' - ' + anyChoB );
                console.error( anyErrFunc( msg_forErrFunc ) );
                break;
            case 'throwErr':
                msg = this.getMsg( anyCode );
                msg_forErrFunc = !anyChoB ? msg : ( msg + ' - ' + anyChoB );
                throw anyErrFunc( msg_forErrFunc );
                break;
        }
    };


    // 訊息表 logMsgTable

    /**
     * 訊息表。
     * <br>
     * 關於訊息表的鍵值對名稱建議以「(來源)_(查找路徑)_(內容資訊)」方式命名，
     * 預設值加以「_」為前綴。
     *
     * @memberof module:log.
     * @var {Object} msgTable
     * @prop {...String} msg
     */
    log.prototype.msgTable = {
        _undefined: 'Unexpected Not Message'
    };

    /**
     * 設定訊息表。
     * @memberof module:log.
     * @func setMsg
     * @param {Object} msgList - 訊息清單。
     * @param {...String} msgList.msg - 訊息內容。
     */
    log.prototype.setMsg = function setMsg( objMsgList ) {
        var msgCode;
        var msgTable = this.msgTable;
        for( msgCode in objMsgList ) msgTable[ msgCode ] = objMsgList[ msgCode ];
    };

    /**
     * 取得訊息表內容。
     *
     * @memberof module:log.
     * @func getMsg
     * @param {String} msgCode - 訊息代碼。
     * @return {String} 其訊息代碼或 `_undefined` 代碼的內容。
     */
    log.prototype.getMsg = function getMsg( strMsgCode ) {
        var msgTable = this.msgTable;
        return msgTable[ strMsgCode ] || msgTable['_undefined'];
    };

    log.prototype.setMsg( {
        _undefined: '意外的空白訊息',
        _arguTypeErr: '參數類型不符',
    } );

    return new log;
} );

