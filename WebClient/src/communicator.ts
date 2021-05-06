﻿import * as signalR from "@microsoft/signalr";
import { Guid } from "guid-typescript";
import { Message } from "./message";
import { IMessage } from "./IMessage";
import { ICommunicator } from "./ICommunicator";
import { Response } from "./Response";
import { IResponse } from "./IResponse";
import { IRequest } from "./IRequest";
import { Request } from "./Request";



export class Communicator implements ICommunicator {

  
    private connection: any;
    private callbacksByTopics: Map<string, (message: IMessage) => any>;
    private userId: string;
    private callbacksByResponder: Map<string, (request: IRequest) => any>;

    //construct and return a timeout promise which will reject after 2 seconds
    private timeoutAsync(ms: number = 2000, correlationId : string = "", content : string = "timeout", sender : string = "", topic : string = "") : Promise<IResponse> {
        let timeoutResponse = new Response(correlationId, content, sender, topic, false);
        return new Promise((resolve, reject) => setTimeout(() => {
            reject(timeoutResponse)
        }, ms));
    }

    //register the handler to the hub method
    private registerCallback(hubMethod: string, handler: Function) {
        this.connection.on(hubMethod, handler);
    }

    //initialize the connection and start it; throw an exception if connection fails
    private establishConnection(url: string, connectionHandler: (response: IResponse)=> any) {

        this.connection = new signalR.HubConnectionBuilder().withUrl(url).build();

        this.connection.start().then(

            (resolve: any) => {
                let registerTask = this.connection.invoke("ConnectAsync", this.userId);
                let timeoutTask = this.timeoutAsync();
                return Promise.race([registerTask, timeoutTask]);
            },
            (reject: any): void => {
                throw new Response("", "connection rejected", "", "", false);

        }).then(

            (resolve: IResponse): void => {
                console.log(resolve);
                if (resolve.Success === true) {
                    connectionHandler(resolve);
                    console.log("successfully registered");//TODO: notify user?
                } else {//duplicate user name, need to stop connection and throw
                    this.connection.stop();
                    throw resolve;
                }
            },
            (reject: any): void => {//reject could be either response or string
                throw new Response("", "failed to register the connection", "", "", false);
        });
    }

    constructor(user: string, connectCallback: (response: IResponse)=> any) {
        this.establishConnection("https://localhost:5001/signalRhub", connectCallback);

        this.callbacksByTopics = new Map();
        this.callbacksByResponder = new Map();

        //generate unique user id
        //this.userId = "User" + Math.floor(Math.random() * (100 - 1 + 1)) + 1;

        this.userId = user;
        console.log(this.userId);

        //invoke the proper callback when the hub sends topic-based message to the client
        this.registerCallback("onPublish", (messageReceived: IMessage) => {
            let topicCallback = this.callbacksByTopics.get(messageReceived.Topic);
            topicCallback(messageReceived);//invoke callback
        });
        
        this.registerCallback("OnQuery", (requestReceived: IRequest) => {
            console.log(requestReceived);
            console.log(this.callbacksByResponder);

            let respondCallback = this.callbacksByResponder.get(requestReceived.Destination);
            //let respondCallback = this.callbacksByResponder.get("user");
            let result = respondCallback(requestReceived);
            console.log(result);

         
            let responseToSend = new Response(requestReceived.CorrelationId, result, requestReceived.Sender, "", true);
            console.log(responseToSend);
            this.connection.invoke("RespondQueryAsync", responseToSend);
        })
    }


    publish(topic: string, message: string) {
        console.log("Client called publish method");//test
        let correlationID = Guid.create().toString();
        let messageToSend = new Message(correlationID, message, this.userId, topic);
        console.log(messageToSend)
        this.connection.invoke("PublishAsync", messageToSend);
    }


    async subscribeAsync(topic: string, topicCallback: (message: IMessage) => any): Promise<IResponse>{
        console.log("Client called subscribe method");//test

        if (this.callbacksByTopics.has(topic)) {//cannot subscribe twice
            let duplicateSubResponse = new Response("", "cannot subscribe to the same topic twice", this.userId, topic, false);
            return new Promise<IResponse>((resolve, reject) => {
                reject(duplicateSubResponse);
            });

        } else {

            let correlationID = Guid.create().toString();
            let messageToSend = new Message(correlationID, "", this.userId, topic);

            let serviceTask = this.connection.invoke("SubscribeTopicAsync", messageToSend);
            let timeoutTask = this.timeoutAsync();

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

            let duplicateUnsubResponse = new Response("", "you need to subscribe before unsubscribing", this.userId, topic, false);
            return new Promise<IResponse>((resolve, reject) => {
                reject(duplicateUnsubResponse);
            });

        } else {
            let correlationID = Guid.create().toString();

            let messageToSend = new Message(correlationID, "", this.userId, topic);
            let serviceTask = this.connection.invoke("UnsubscribeTopicAsync", messageToSend);

            //set timeout
            let timeoutTask = this.timeoutAsync();
            //wait for one of the tasks to settle
            let taskResult = await Promise.race([serviceTask, timeoutTask]);
            
            if (taskResult.Success===true) {
                console.log("unsub success");//test
                //remove from dictionary
                this.callbacksByTopics.delete(topic);
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
  
    
   async queryAsync(responder: string, additionalData: string) : Promise<IResponse> {
 
       //this.callbacksByResponder.set(responder, respondCallback);
       // console.log("callbacksByResponder");
       // console.log(this.callbacksByResponder);
    
        let correlationID = Guid.create().toString();
        let requestToSend = new Request(correlationID, additionalData, this.userId, null, responder);
        console.log(requestToSend);
        //let serviceTask = this.connection.invoke("QueryAsync", requestToSend).catch(err => console.log(err));
        let serviceTask = this.connection.invoke("QueryAsync", requestToSend);
       let timeoutTask = this.timeoutAsync();

        let taskResult = await Promise.race([serviceTask, timeoutTask]);
        console.log(taskResult);
        return taskResult;
    }


     //bool AddResponse(string responder, Func<IRequest, object> callback);
    addResponder(responder : string, respondCallback: (request: IRequest) => string) {
        if (!this.callbacksByResponder.has(responder)) {
            this.callbacksByResponder.set(responder, respondCallback);
            console.log(this.callbacksByResponder);
        }
    }

    async disconnectAsync(): Promise<IResponse> {
        let serviceTask = this.connection.stop();
        let timeoutTask = this.timeoutAsync();
        let taskResult = await Promise.race([serviceTask, timeoutTask]);
        return taskResult;
    }

}