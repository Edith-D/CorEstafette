﻿using System;
using Newtonsoft.Json;

namespace SignalRCommunicator
{
    [Serializable]
    public class Message : IMessage
    {
        [JsonProperty]
        public string CorrelationId { get; set; }

        [JsonProperty]
        public string Content { get; set; }

        [JsonProperty]
        public string Sender { get; set; }

        [JsonProperty]
        public DateTime Timestamp { get; set; }

        public Message()
        {
            CorrelationId = Guid.NewGuid().ToString();
        }
        
        public Message( 
            string content,
            string sender) : this()
        {
            Content = content;
            Timestamp = DateTime.Now;
            Sender = sender;
        }

    }
}
