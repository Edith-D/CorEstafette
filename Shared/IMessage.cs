using System;

namespace SignalRCommunicator
{
    public interface IMessage
    {
        string CorrelationId { get; }
        string Topic { get; }
        string Content { get; }
        string Sender { get; }
        DateTime Timestamp { get; }
    }
}
