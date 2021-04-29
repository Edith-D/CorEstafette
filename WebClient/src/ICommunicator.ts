﻿import { IResponse } from "./IResponse";

export interface ICommunicator {
    //publish message under certain topic
    publish: (topic: string, message: string) => void;
    //subscribe to a topic, store the callback function for that topic, and return a promise of IResponse
    subscribeAsync: (topic: string, topicCallback: (topic: string, message: string) => any) => Promise<IResponse>;//TODO: change to IResponse later
    //unsubscribe from a topic, remove the cached callback, and return a promise of IResponse
    unsubscribeAsync: (topic: string) => Promise<IResponse>;//TODO: change to IResponse later
}