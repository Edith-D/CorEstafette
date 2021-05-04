using System;
using Newtonsoft.Json;

namespace SignalRCommunicator
{
    [Serializable]
    public class Response : IResponse
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
        public bool Success { get; set; }

        public Response()
        {
            CorrelationId = Guid.NewGuid().ToString();
        }
        public Response( 
            bool success,
            string correlationId,
            string content,
            string sender,
            DateTime timestamp
            ) :this()
        {
            CorrelationId = correlationId;
            Content = content;
            Sender = sender;
            Timestamp = timestamp;
            Success = success;
        }

        public Response(bool success)
        {
            Success = success;
        }
        public Response(string content, bool success)
            : this( success)
        {
            Content = content;
        }

        public Response(string sender, string content, bool success)
            : this(content, success)
        {
            Sender = sender;
        }

        public Response(Message message, bool success)
            : this(success, message.CorrelationId, message.Content, message.Sender, message.Timestamp)
        {

        }

    }
}
