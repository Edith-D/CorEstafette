using System;

namespace SignalRCommunicator
{
    public interface IMessage
    {
        public string CorrelationId { get; }
        public string Content { get; }
        public string Sender { get; }
        public DateTime Timestamp { get; }
    }
}
