const chai = require("chai")
const fs = require("fs")
const expect = chai.expect
const IpfsRemote = require("../").IpfsRemote

let remote = new IpfsRemote({urls:["http://localhost:7545/v1/jsonrpc"]})

describe("test IpfsRemote", function() {
    describe("test get account", function() {
        it("jt_getAccount: test", function() {
            remote.GetAccount(['jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh'], function(data){
                console.log('[success]', JSON.stringify(data))
            }, function(error){
                console.log('[error]', error)
            })
        })
    })
    // describe("test upload file", function() {
    //     it("jt_uploadFile: test", function() {
    //         const filePath = "~/Downloads/x963-7-5-98.pdf"
            
    //         // const fileData = fs.readFileSync(filePath)
    //         const fileReader = fs.createReadStream(filePath)
    //         remote.UploadFile(fileReader, function (list) {
    //             console.log('[success]', list);
    //         }, function (error) {
    //             console.log('[error]', error);
    //         })
    //     })
    // })
    // describe("test download file", function() {
    //     it("jt_downloadFile: test", function() {
    //         const filePath = "~/Downloads/test.pdf"
    //         const fileWriter = fs.createWriteStream(filePath)
    //         remote.DownloadFile("AC0E78F1F918B617F227EB8DC7E9426FEB9BF1A90E8493B02651352ECB194678", fileWriter, function () {
    //             console.log('[success]', filePath);
    //         }, function (error) {
    //             fs.unlinkSync(filePath);
    //             console.log('[error]', error);
    //         })
    //     })
    // })
    // describe("test create data", function() {
    //     it("jt_createData: test", function() {
    //         remote.CreateData([{
    //             from: "jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh",
    //             to:"jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF",
    //             secret:"snoPBjXtMeMyMHUVTgbuqAfg1SUTb",
    //             data:["AC0E78F1F918B617F227EB8DC7E9426FEB9BF1A90E8493B02651352ECB194678"]
    //         }], function(data){
    //             console.log('[success]', JSON.stringify(data))
    //         }, function(error){
    //             console.log('[error]', error)
    //         })
    //     })
    // })
    // describe("test remove data", function() {
    //     it("jt_removeData: test", function() {
    //         remote.RemoveData([{
    //             from: "jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF",
    //             to:"jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh",
    //             secret:"sha4eGoQujTi9SsRSxGN5PamV3YQ4",
    //             data:["AC0E78F1F918B617F227EB8DC7E9426FEB9BF1A90E8493B02651352ECB194678"]
    //         }], function(data){
    //             console.log('[success]', JSON.stringify(data))
    //         }, function(error){
    //             console.log('[error]', error)
    //         })
    //     })
    // })
    // describe("test issue token", function() {
    //     it("jt_issueToken: test", function() {
    //         remote.IssueToken([{
    //             from: "jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh",
    //             to:"jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF",
    //             secret:"snoPBjXtMeMyMHUVTgbuqAfg1SUTb",
    //             token_info: {
    //                 name:"test token",
    //                 symbol:"TEST",
    //                 total_supply:10,
    //                 items:[
    //                     {
    //                         name:"name",
    //                         type:"string",
    //                         desc:"the name of the file"
    //                     },
    //                     {
    //                         name:"file",
    //                         type:"file",
    //                         desc:"the content of the file"
    //                     }
    //                 ]
    //             }
    //         }], function(data){
    //             console.log('[success]', JSON.stringify(data))
    //         }, function(error){
    //             console.log('[error]', error)
    //         })
    //     })
    // })
})
