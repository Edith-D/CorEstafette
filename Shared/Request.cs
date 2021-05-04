using System;

using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace SignalRCommunicator
{
    class Request : IRequest
    {
        public string Responder { get; set; }

        public string CorrelationId { get; set; }

        public string Content { get; set; }

        public string Sender { get; set; }

        public DateTime Timestamp { get; set; }

        public Request( )
        {
            CorrelationId = Guid.NewGuid().ToString();
        }

        public Request( Message message, string responder )
            : this(responder, message.CorrelationId, message.Content, message.Sender, message.Timestamp)
        {

        }

        public Request(
            string responder, 
            string correlationId,
            string content,
            string sender,
            DateTime timestamp ) : this()
        {
            Responder = responder;
            CorrelationId = correlationId;
            Content = content;
            Sender = sender;
            Timestamp = timestamp;
        }
    }
}
