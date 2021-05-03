using System;
using Newtonsoft.Json;

namespace SignalRCommunicator
{
    [Serializable]
    public class Message : IMessage
    {
        [JsonProperty]
        public string CorrelationId { get; set; }

        [JsonProperty]
        public string Topic { get; set; }

        [JsonProperty]
        public string Content { get; set; }

        [JsonProperty]
        public string Sender { get; set; }

        [JsonProperty]
        public DateTime Timestamp { get; set; }

        public Message ()
        {
            CorrelationId = Guid.NewGuid().ToString();
        }
        public Message( string topic, string content )
        {
            Topic = topic;
            Content = content;
        }
        public Message( 
            string topic,
            string content,
            string sender) : this()
        {
            Topic = topic;
            Content = content;
            Timestamp = DateTime.Now;
            Sender = sender;
        }

    }
}
