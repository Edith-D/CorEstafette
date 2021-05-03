import * as signalR from "@microsoft/signalr";
import { Guid } from "guid-typescript";
import { Message } from "./message";
import { IMessage } from "./IMessage";
import { ICommunicator } from "./ICommunicator";
import { Response } from "./Response";
import { IResponse } from "./IResponse";


export class Communicator implements ICommunicator {

    //singlr connection cannot be started in a constructor; use a wrapper to setup connection
    private connectionWrapper = new class {

        connection: any;

        establishConnection(url: string) {
            this.connection = new signalR.HubConnectionBuilder().withUrl(url).build();
            this.connection.start();
        }

        //register the handler to the hub method
        registerCallback(hubMethod: string, handler: Function) {
            this.connection.on(hubMethod, handler);
        }

        //deregister all callbacks from the hub method
        deregisterAllCallbacks(hubMethod: string) {
            this.connection.off(hubMethod);
        }

    }

    private callbacksByTopics: Map<string, (message: IMessage)=> any>;

    constructor() {
        this.connectionWrapper.establishConnection("https://localhost:5001/signalRhub");
        this.callbacksByTopics = new Map();


        this.connectionWrapper.registerCallback("onPublish", (messageReceived: IMessage) => {
            console.log("inside receiveHandler");//test
            //console.log(this.callbacksByTopics);//test
            //console.log(objectReceived.Topic);
            ////const messageReceived: IMessage = <IMessage>objectReceived;
            //let messageReceived = new Message(objectReceived.CorrelationId, objectReceived.Content, objectReceived.Sender, objectReceived.Topic, objectReceived.TimeStamp);
            console.log(messageReceived);

            let topicCallback = this.callbacksByTopics.get(messageReceived.Topic);
            //console.log(topicCallback);
            topicCallback(messageReceived);//invoke callback

            //TODO: does callback have more parameters?
        });
    }

    //publish message under certain topic
    publish(topic: string, message: string) {
        console.log("Client called publish method");//test
        let correlationID = Guid.create().toString();
        let messageToSend = new Message(correlationID, message, "user1", topic);
        console.log(messageToSend)
        this.connectionWrapper.connection.invoke("PublishAsync", messageToSend);
    }


    async subscribeAsync(topic: string, topicCallback: (message: IMessage) => any): Promise<IResponse>{
        console.log("Client called subscribe method");//test

        if (this.callbacksByTopics.has(topic)) {//cannot subscribe twice

            let duplicateSubResponse = new Response("", "", "user1", topic, false);
            return new Promise<IResponse>((resolve, reject) => {
                reject(duplicateSubResponse);
            });

        } else {

            let correlationID = Guid.create().toString();
            let messageToSend = new Message(correlationID, "", "user1", topic);
            console.log(messageToSend);
            let serviceTask = this.connectionWrapper.connection.invoke("SubscribeTopicAsync", messageToSend);
            //set timeout
            let timeoutResponse = new Response(correlationID, "", "user1", topic, false);
            let timeoutTask = new Promise((resolve, reject) => setTimeout(() => reject(timeoutResponse), 2000)); //timeout after two seconds
            //wait for one of the tasks to settle
            let taskResult = await Promise.race([serviceTask, timeoutTask]);
            if (taskResult.Success === true) {
                //add callback function to the dictionary
                console.log("sub success");//test
                this.callbacksByTopics.set(topic, topicCallback);
                console.log(this.callbacksByTopics);//test
            }
            //test
            console.log("print the promise and response:");
            console.log(serviceTask);
            console.log(timeoutTask);
            console.log(taskResult);

            return taskResult;
        }

    }

    async unsubscribeAsync(topic: string): Promise<IResponse>{
        console.log("Client called unsubscribe method");

        if (!this.callbacksByTopics.has(topic)) {

            let duplicateUnsubResponse = new Response("", "you need to subscribe before unsubscribing", "user1", topic, false);
            return new Promise<IResponse>((resolve, reject) => {
                reject(duplicateUnsubResponse);
            });

        } else {
            let correlationID = Guid.create().toString();
            let messageToSend = new Message(correlationID, "", "user1", topic);
            let serviceTask = this.connectionWrapper.connection.invoke("UnsubscribeTopicAsync", messageToSend);
            //set timeout
            let timeoutResponse = new Response(correlationID, "", "user1", topic, false);
            let timeoutTask = new Promise((resolve, reject) => setTimeout(() => reject(timeoutResponse), 2000)); //timeout after two seconds
            //wait for one of the tasks to settle
            let taskResult = await Promise.race([serviceTask, timeoutTask]);
            
            if (taskResult.Success===true) {
                console.log("unsub success");//test
                //remove from dictionary
                this.callbacksByTopics.delete(topic);
                console.log(this.callbacksByTopics);//test
            }

            //test
            console.log(serviceTask);
            console.log(timeoutTask);
            console.log(taskResult);

            return taskResult;
        }
    }
}