var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as signalR from "@microsoft/signalr";
import { Guid } from "guid-typescript";
import { Message } from "./message";
import { Response } from "./Response";
var Communicator = /** @class */ (function () {
    function Communicator() {
        var _this = this;
        //singlr connection cannot be started in a constructor; use a wrapper to setup connection
        this.connectionWrapper = new /** @class */ (function () {
            function class_1() {
            }
            class_1.prototype.establishConnection = function (url) {
                this.connection = new signalR.HubConnectionBuilder().withUrl(url).build();
                this.connection.start();
            };
            //register the handler to the hub method
            class_1.prototype.registerCallback = function (hubMethod, handler) {
                this.connection.on(hubMethod, handler);
            };
            //deregister all callbacks from the hub method
            class_1.prototype.deregisterAllCallbacks = function (hubMethod) {
                this.connection.off(hubMethod);
            };
            return class_1;
        }());
        this.connectionWrapper.establishConnection("https://localhost:5001/signalRhub");
        this.callbacksByTopics = new Map();
        this.connectionWrapper.registerCallback("onPublish", function (messageReceived) {
            console.log("inside receiveHandler"); //test
            //console.log(this.callbacksByTopics);//test
            //console.log(objectReceived.Topic);
            ////const messageReceived: IMessage = <IMessage>objectReceived;
            //let messageReceived = new Message(objectReceived.CorrelationId, objectReceived.Content, objectReceived.Sender, objectReceived.Topic, objectReceived.TimeStamp);
            console.log(messageReceived);
            var topicCallback = _this.callbacksByTopics.get(messageReceived.Topic);
            //console.log(topicCallback);
            topicCallback(messageReceived); //invoke callback
            //TODO: does callback have more parameters?
        });
    }
    //publish message under certain topic
    Communicator.prototype.publish = function (topic, message) {
        console.log("Client called publish method"); //test
        var correlationID = Guid.create().toString();
        var messageToSend = new Message(correlationID, message, "user1", topic);
        console.log(messageToSend);
        this.connectionWrapper.connection.invoke("PublishAsync", messageToSend);
    };
    Communicator.prototype.subscribeAsync = function (topic, topicCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var duplicateSubResponse_1, correlationID, messageToSend, serviceTask, timeoutResponse_1, timeoutTask, taskResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Client called subscribe method"); //test
                        if (!this.callbacksByTopics.has(topic)) return [3 /*break*/, 1];
                        duplicateSubResponse_1 = new Response("", "", "user1", topic, false);
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                reject(duplicateSubResponse_1);
                            })];
                    case 1:
                        correlationID = Guid.create().toString();
                        messageToSend = new Message(correlationID, "", "user1", topic);
                        console.log(messageToSend);
                        serviceTask = this.connectionWrapper.connection.invoke("SubscribeTopicAsync", messageToSend);
                        timeoutResponse_1 = new Response(correlationID, "", "user1", topic, false);
                        timeoutTask = new Promise(function (resolve, reject) { return setTimeout(function () { return reject(timeoutResponse_1); }, 2000); });
                        return [4 /*yield*/, Promise.race([serviceTask, timeoutTask])];
                    case 2:
                        taskResult = _a.sent();
                        if (taskResult.Success === true) {
                            //add callback function to the dictionary
                            console.log("sub success"); //test
                            this.callbacksByTopics.set(topic, topicCallback);
                            console.log(this.callbacksByTopics); //test
                        }
                        //test
                        console.log("print the promise and response:");
                        console.log(serviceTask);
                        console.log(timeoutTask);
                        console.log(taskResult);
                        return [2 /*return*/, taskResult];
                }
            });
        });
    };
    Communicator.prototype.unsubscribeAsync = function (topic) {
        return __awaiter(this, void 0, void 0, function () {
            var duplicateUnsubResponse_1, correlationID, messageToSend, serviceTask, timeoutResponse_2, timeoutTask, taskResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Client called unsubscribe method");
                        if (!!this.callbacksByTopics.has(topic)) return [3 /*break*/, 1];
                        duplicateUnsubResponse_1 = new Response("", "you need to subscribe before unsubscribing", "user1", topic, false);
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                reject(duplicateUnsubResponse_1);
                            })];
                    case 1:
                        correlationID = Guid.create().toString();
                        messageToSend = new Message(correlationID, "", "user1", topic);
                        serviceTask = this.connectionWrapper.connection.invoke("UnsubscribeTopicAsync", messageToSend);
                        timeoutResponse_2 = new Response(correlationID, "", "user1", topic, false);
                        timeoutTask = new Promise(function (resolve, reject) { return setTimeout(function () { return reject(timeoutResponse_2); }, 2000); });
                        return [4 /*yield*/, Promise.race([serviceTask, timeoutTask])];
                    case 2:
                        taskResult = _a.sent();
                        if (taskResult.Success === true) {
                            console.log("unsub success"); //test
                            //remove from dictionary
                            this.callbacksByTopics.delete(topic);
                            console.log(this.callbacksByTopics); //test
                        }
                        //test
                        console.log(serviceTask);
                        console.log(timeoutTask);
                        console.log(taskResult);
                        return [2 /*return*/, taskResult];
                }
            });
        });
    };
    return Communicator;
}());
export { Communicator };
//# sourceMappingURL=communicator.js.map