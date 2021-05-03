import { Communicator } from "./communicator";
import { IResponse } from "./IResponse";
import { IMessage } from "./IMessage";

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

document.getElementById("subscribeButton").addEventListener("click", function () {
    let user = (<HTMLInputElement>document.getElementById("userInput")).value;
    let topic = (<HTMLInputElement>document.getElementById("topicInput")).value;
    let result = comm.subscribeAsync(topic, onReceive);
    result.then((res) => {
        //test
        //const messageReceived: IResponse = <IResponse>res;
        //console.log(messageReceived);
        let li = document.createElement("li");
        li.textContent = "subscription success";
        document.getElementById("messagesList").appendChild(li);
    }).catch((err: any) => {
        let li = document.createElement("li");
        li.textContent = "subscription failed";
        document.getElementById("messagesList").appendChild(li);
    });
});

document.getElementById("publishButton").addEventListener("click", function () {
    let user = (<HTMLInputElement>document.getElementById("userInput")).value;
    let topic = (<HTMLInputElement>document.getElementById("topicInput")).value;
    let message = (<HTMLInputElement>document.getElementById("messageInput")).value;
    comm.publish(topic, message);

});

document.getElementById("unsubscribeButton").addEventListener("click", function () {
    let user = (<HTMLInputElement>document.getElementById("userInput")).value;
    let topic = (<HTMLInputElement>document.getElementById("topicInput")).value;
    let result = comm.unsubscribeAsync(topic);

    result.then((res) => {
            //test
            //const messageReceived: IResponse = <IResponse>res;
            //console.log(messageReceived);
            let li = document.createElement("li");
            li.textContent = "unsubscription success";
            document.getElementById("messagesList").appendChild(li);
        }).catch((err: any) => {
            let li = document.createElement("li");
            li.textContent = "unsubscription failed";
            document.getElementById("messagesList").appendChild(li);
        });

});