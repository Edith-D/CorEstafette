using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace SignalRCommunicator
{
    [Serializable]
    public class MessageWithTopic : IMessageWithTopic
    {
        [JsonProperty]
        public string CorrelationId { get; set; }

        [JsonProperty]
        public string Content { get; set; }

        [JsonProperty]
        public string Sender { get; set; }

        [JsonProperty]
        public DateTime Timestamp { get; set; }

        [JsonProperty]
        public string Topic { get; set; }

        public MessageWithTopic()
        {
            CorrelationId = Guid.NewGuid().ToString();
        }

        public MessageWithTopic(
            string topic,
            string content,
            string sender) : this()
        {
            Topic = topic;
            Content = content;
            Sender = sender;
            Timestamp = DateTime.Now;
        }
    }
}
