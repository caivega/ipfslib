import axios from "axios"
import FormData from "form-data"
import http = require("http")

import { IpfsOptions, IResponse, IDataOptions, IIssueTokenOptions, ICreateTokenOptions, IRemoveTokenOptions, ITransferTokenOptions, IpfsResponse, NetworkInfo } from "./types";
const Transaction = require("swtc-transaction").Transaction

import { string2Hex } from "./data"

import { Factory as SerializerFactory } from "swtc-serializer"
import { Factory as WalletFactory } from "swtc-wallet"
const Wallet = WalletFactory("jingtum")
const jser = SerializerFactory(Wallet)

class IpfsRemote {
    _options:IpfsOptions;
    _current:0;

    constructor(options: IpfsOptions) {
        this._options = options
        this._current = 0
    }

    submitResponse(response:IResponse, callback, errorCallback){
        console.log('[response]', JSON.stringify(response.data))
        if(response != null){
            const data = response.data
            if(data != null){
                const result = data.result
                const status = data.status
                if(status == "error"){
                    if(result == null){
                        errorCallback("error")
                        return
                    }
                    const message = data.message
                    if(message != null){
                        errorCallback(message)
                        return
                    }

                    errorCallback(result)
                    return
                }
                
                callback(result)
                return
            }
        }
        errorCallback(response.data)
    }

    submitRPC(method, options, callback, errorCallback) {
        const that = this
        const params = this.submitParams(options)
        console.log('[send]', method, JSON.stringify(params))
        const l = this._options.urls.length
        const url = this._options.urls[this._current%l]
        return axios.post(url, {
            method:method,
            params:params
        })
        .then(function(response:IResponse){
            that.submitResponse(response, callback, errorCallback)
        })
        .catch(errorCallback)
    }

    public submitParams(options:IDataOptions[]) {
        let params = JSON.parse(JSON.stringify(options)) as IDataOptions[];
        for(let i = 0; i < params.length; i ++){
            let item = params[i] as IDataOptions
            if(item && item.secret){
                item.secret = ""
            }
        }
        return params
    }

    public submitAccounts(options:IDataOptions[]) {
        let m:{[key:string]: any} = {}
        let accounts:Array<any> = []
        for(let i = 0; i < options.length; i ++){
            let account = options[i].from
            if(m[account] == null){
                accounts.push(account)
                m[account] = {}
            }
        }
        return accounts
    }

    public GetAccount(params, callback, errorCallback) {
        this.submitRPC('jt_getAccount', params, callback, errorCallback)
    }

    public GetAccountPromise(account) {
        let that = this
        return new Promise((resolve, reject) => {
            that.GetAccount([account], resolve, reject)
        })
    }

    public async _setSequence(options: IDataOptions[], gasEnabled) {
        let l = options.length
        const infos = new Array(l)
        for(let i = 0; i < l; i ++){
            let option = options[i]
            infos[i] = await this.GetAccountPromise(option.from)
        }
        let m:{[key:string]:number} = {}
        for(let i = 0; i < infos.length; i ++){
            let info = infos[i]

            let accountInfo = info.account_data
            m[accountInfo.Account] = accountInfo.Sequence
        }
        for(let i = 0; i < options.length; i ++){
            let option = options[i]
            let sequence = m[option.from]
            if(!(option && option.sequence)){
                option.sequence = sequence
                if(gasEnabled){
                    m[option.from] = sequence + 2
                }else{
                    m[option.from] = sequence + 1
                }
            }
        }
    }

    public async _signIpfsTransaction(options:IDataOptions[], gasEnabled, data:IpfsResponse){
        let blobs = new Array()
        for(let i = 0; i < options.length; i ++){
            let option = options[i]
            let item = data.list[i]

            let network:NetworkInfo = {
                version: 0,
                network: data.network,
                data_hash: item.data_hash
            }

            if(gasEnabled){
                let gasOption = JSON.parse(JSON.stringify(option)) as IDataOptions;
                gasOption.memos = [item.data_hash]
                let gasReturned = await this._signTransactionWithHash(gasOption)
                let gasBlob = gasReturned.blob as string
                blobs.push(gasBlob)

                network.gas_hash = gasReturned.hash as string
                option.sequence = option.sequence + 1
            }

            option.invoice = item.invoice

            let hexString = string2Hex('ipfs\u0000\u0002' + JSON.stringify(network))
            option.memos = [hexString]
            let blob = await this._signTransaction(option)
            blobs.push(blob)
        }

        return blobs
    }

    public async _signTransactionWithHash(option: IDataOptions) {
        let tx = Transaction.buildPaymentTx({
            account: option.from,
            to: option.to,
            amount: {
                value: 10,
                currency: "SWT",
                issuer:""
            }
            }, {_token:""});
        tx.setSecret(option.secret)
        tx.setInvoice(option.invoice)
        tx.setSequence(option.sequence)
        tx.setFee("10")

        for(let i = 0; i < option.memos.length; i ++){
            tx.addMemo(option.memos[i], 'hex')
        }

        const prefix = 0x54584E00
        const hash = jser.from_json(tx.tx_json).hash(prefix)
        
        let txBlob = await tx.signPromise(option.secret)
        console.log('sign', txBlob)

        return {hash:hash, blob:txBlob}
    }

    public async _signTransaction(option: IDataOptions) {
        let tx = Transaction.buildPaymentTx({
            account: option.from,
            to: option.to,
            amount: {
                value: 10,
                currency: "SWT",
                issuer:""
            }
          }, {_token:""});
          tx.setSecret(option.secret)
          tx.setInvoice(option.invoice)
          tx.setSequence(option.sequence)
          tx.setFee("10")

          if(option.data && option.data.length > 0){
            for(let i = 0; i < option.data.length; i ++){
                tx.addMemo(option.data[i], 'hex')
            }
          }

          for(let i = 0; i < option.memos.length; i ++){
            tx.addMemo(option.memos[i], 'hex')
          }

          let txBlob = await tx.signPromise(option.secret)
          console.log('sign', txBlob)

          return txBlob
    }

    public SignTransaction(options: IDataOptions[]) {
        let l = options.length
        let blobs = new Array(l)
        for(let i = 0; i < l; i ++){
            blobs[i] = this._signTransaction(options[i])
        }
        return blobs
    }

    public SendRawTransaction(blobs, callback, errorCallback) {
        this.submitRPC("jt_sendRawTransaction", blobs, callback, errorCallback)
    }

    public submitTokenRPC(method, options: IDataOptions[], callback, errorCallback) {
        let that = this
        that.submitRPC(method, options, async function(data:IpfsResponse){
            let gasEnabled = (data && data.gas_account)
            await that._setSequence(options, gasEnabled)

            let blobs = await that._signIpfsTransaction(options, gasEnabled, data)
            that.SendRawTransaction(blobs, callback, errorCallback)
        }, errorCallback)
    }

    public CreateData(options: IDataOptions[], callback, errorCallback) {
        this.submitTokenRPC("jti_createData", options, callback, errorCallback)
    }

    public RemoveData(options: IDataOptions[], callback, errorCallback) {
        this.submitTokenRPC("jti_removeData", options, callback, errorCallback)
    }

    public IssueToken(options: IIssueTokenOptions[], callback, errorCallback) {
        for(let i = 0; i < options.length; i ++){
            let option = options[i]
            if(option && option.token_info && option.token_info.total_supply == "unlimited"){
                option.token_info.total_supply = -1
            }
        }
        this.submitTokenRPC("jti_issueToken", options, callback, errorCallback)
    }

    public CreateToken(options: ICreateTokenOptions[], callback, errorCallback) {
        this.submitTokenRPC("jti_createToken", options, callback, errorCallback)
    }

    public RemoveToken(options: IRemoveTokenOptions[], callback, errorCallback) {
        this.submitTokenRPC("jti_removeToken", options, callback, errorCallback)
    }

    public TransferToken(options: ITransferTokenOptions[], callback, errorCallback) {
        this.submitTokenRPC("jti_transferToken", options, callback, errorCallback)
    }

    public OwnerOf(params, callback, errorCallback) {
        this.submitRPC("jt_ownerOf", params, callback, errorCallback)
    }

    public TokensOf(params, callback, errorCallback) {
        this.submitRPC("jt_tokensOf", params, callback, errorCallback)
    }

    public GetTokenByHash(params, callback, errorCallback) {
        this.submitRPC("jt_getTokenByHash", params, callback, errorCallback)
    }

    public GetTokenByIndex(params, callback, errorCallback) {
        this.submitRPC("jt_getTokenByIndex", params, callback, errorCallback)
    }

    public GetTokenCount(params, callback, errorCallback) {
        this.submitRPC("jt_getTokenCount", params, callback, errorCallback)
    }

    public GetTokenInfoByHash(params, callback, errorCallback) {
        this.submitRPC("jt_getTokenInfoByHash", params, callback, errorCallback)
    }

    public UploadData(params, callback, errorCallback) {
        const that = this
        const l = this._options.urls.length
        const url = this._options.urls[this._current%l]
        axios.post(url + "/jt_uploadData", params)
        .then(function(response:IResponse){
            that.submitResponse(response, callback, errorCallback)
        })
        .catch(errorCallback);
    }

    public DownloadData(params, callback, errorCallback) {
        const that = this
        const l = this._options.urls.length
        const url = this._options.urls[this._current%l]
        axios.post(url + "/jt_downloadData", params)
        .then(function(response:IResponse){
            that.submitResponse(response, callback, errorCallback)
        })
        .catch(errorCallback);
    }

    public UploadFile(fileReader, callback, errorCallback) {
        const that = this
        const l = this._options.urls.length
        const url = this._options.urls[this._current%l]
        const form = new FormData()
        form.append("file", fileReader)
        axios.post(url + "/jt_uploadFile", form, {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
        }).then(function(response:IResponse){
            that.submitResponse(response, callback, errorCallback)
        })
        .catch(errorCallback);
    }

    public DownloadFile(hash, fileWriter, callback, errorCallback) {
        const that = this
        const l = this._options.urls.length
        const url = this._options.urls[this._current%l]
        http.get(
            url + "/jt_downloadFile?params=" + JSON.stringify([hash]),
            function(response){
                let fileHeader = response.headers['content-disposition']
                let ok = false
                if(fileHeader){
                    let splitHeader = fileHeader.split('filename=')
                    if(splitHeader && splitHeader.length > 0){
                        let fileName = splitHeader[1];
                        if(fileName == hash){
                            ok = true

                            response.pipe(fileWriter);
                            fileWriter.on('error', function(err) {
                                errorCallback(err)
                            });
                            fileWriter.on('finish', function() {
                                fileWriter.close(callback);
                            })
                        }
                    }
                }

                if(!ok){
                    var jsonString = ""
                    response.on('error', function(err) {
                        errorCallback(err)
                    });
                    response.on("data",function(data){
                        jsonString+=data
                    })
                    response.on("end",function(){
                        that.submitResponse({data:JSON.parse(jsonString)}, callback, errorCallback)
                    })
                }
            }
        )
        .on('error', errorCallback)
    }
}

export { IpfsRemote }