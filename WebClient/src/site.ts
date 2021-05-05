﻿import { Communicator } from "./communicator";
import { IResponse } from "./IResponse";
import { IMessage } from "./IMessage";
import { IRequest } from "./IRequest";

let comm = new Communicator();

//callback for receiving messages
let onReceive = function (message: IMessage) {
    console.log("onReceive called in site.ts");
    console.log(message);
    let msg = message.Content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let encodedMsg = msg + " under topic " + message.Topic;
    let li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
}

//let onRequest = function (request: IRequest) {
//    console.log("Received request from");
//    let encodedMsg = "Received request from" + request.Sender;
//    let li = document.createElement("li");
//    li.textContent = encodedMsg;
//    document.getElementById("messagesList").appendChild(li);
//    //return "Send back response";
//    let respondMessage = "send back resposne";
//    //return something to the callback 
//    comm.respondQueryAsync(request, respondMessage);
//}

/*
let onRequest = function (request: IRequest) : string {
    console.log("Received request from");
    let encodedMsg = "Received request from" + request.Sender;
    let li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
    return "Send back response";
   
    //comm.respondQueryAsync(request, respondMessage);
}

let onResponse = function (response:IResponse) {
    console.log("Received response from");
    let encodedMsg = "Received response from" + response.Sender;
    let li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);


}
*/

document.getElementById("subButton").addEventListener("click", function () {
    let topic = (<HTMLInputElement>document.getElementById("subTopic")).value;
    let result = comm.subscribeAsync(topic, onReceive);
    result.then((res) => {
        //test
        //const messageReceived: IResponse = <IResponse>res;
        //console.log(messageReceived);
        let li = document.createElement("li");
        li.textContent = "subscription success";
        document.getElementById("messagesList").appendChild(li);
    }).catch((err: any) => {
        console.log(err);
        let li = document.createElement("li");
        li.textContent = "subscription failed";
        document.getElementById("messagesList").appendChild(li);
    });
});

document.getElementById("publishButton").addEventListener("click", function () {
    let topic = (<HTMLInputElement>document.getElementById("publishTopic")).value;
    let message = (<HTMLInputElement>document.getElementById("publishMessage")).value;
    comm.publish(topic, message);

});

document.getElementById("unsubButton").addEventListener("click", function () {
    let topic = (<HTMLInputElement>document.getElementById("subTopic")).value;
    let result = comm.unsubscribeAsync(topic);
    result.then((res : any) => {
            //test
            //const messageReceived: IResponse = <IResponse>res;
            //console.log(messageReceived);
            let li = document.createElement("li");
            li.textContent = "unsubscription success";
            document.getElementById("messagesList").appendChild(li);
    }).catch((err: any) => {
            console.log(err);
            let li = document.createElement("li");
            li.textContent = "unsubscription failed";
            document.getElementById("messagesList").appendChild(li);
        });

});

/*
document.getElementById("requestButton").addEventListener("click", function(){
    let user = (<HTMLInputElement>document.getElementById("userInput")).value;
    let topic = (<HTMLInputElement>document.getElementById("topicInput")).value;
    let message = (<HTMLInputElement>document.getElementById("messageInput")).value;
    let additionalData = (<HTMLInputElement>document.getElementById("additionalDataInput")).value;
    let responder = (<HTMLInputElement>document.getElementById("responderInput")).value;

    //comm.addResponder(responder, onRequest);
    //comm.queryAsync(responder, additionalData);

    
   // comm.queryAsync(responder, additionalData, onRequest);


})*/



// Client can stop the connection

document.getElementById("stopConnectionButton").addEventListener("click", function () {
    let result = comm.disconnectAsync();
    result.then((res) => {
        let li = document.createElement("li");
        li.textContent = "disconnected";
        document.getElementById("messagesList").appendChild(li);
    }).catch((err: any) => {
        let li = document.createElement("li");
        li.textContent = "failed to disconnect";
        document.getElementById("messagesList").appendChild(li);
    });
});

