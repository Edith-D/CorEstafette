import { Communicator } from "./communicator";
var comm = new Communicator();
//callback for receiving messages
var onReceive = function (message) {
    console.log("onReceive called in site.ts");
    console.log(message);
    var msg = message.Content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = msg + " under topic " + message.Topic;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
};
document.getElementById("subscribeButton").addEventListener("click", function () {
    var user = document.getElementById("userInput").value;
    var topic = document.getElementById("topicInput").value;
    var result = comm.subscribeAsync(topic, onReceive);
    result.then(function (res) {
        //test
        //const messageReceived: IResponse = <IResponse>res;
        //console.log(messageReceived);
        var li = document.createElement("li");
        li.textContent = "subscription success";
        document.getElementById("messagesList").appendChild(li);
    }).catch(function (err) {
        var li = document.createElement("li");
        li.textContent = "subscription failed";
        document.getElementById("messagesList").appendChild(li);
    });
});
document.getElementById("publishButton").addEventListener("click", function () {
    var user = document.getElementById("userInput").value;
    var topic = document.getElementById("topicInput").value;
    var message = document.getElementById("messageInput").value;
    comm.publish(topic, message);
});
document.getElementById("unsubscribeButton").addEventListener("click", function () {
    var user = document.getElementById("userInput").value;
    var topic = document.getElementById("topicInput").value;
    var result = comm.unsubscribeAsync(topic);
    result.then(function (res) {
        //test
        //const messageReceived: IResponse = <IResponse>res;
        //console.log(messageReceived);
        var li = document.createElement("li");
        li.textContent = "unsubscription success";
        document.getElementById("messagesList").appendChild(li);
    }).catch(function (err) {
        var li = document.createElement("li");
        li.textContent = "unsubscription failed";
        document.getElementById("messagesList").appendChild(li);
    });
});
//# sourceMappingURL=site.js.map