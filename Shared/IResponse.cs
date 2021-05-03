namespace SignalRCommunicator
{
    public interface IResponse : IMessage
    {
        bool Success { get; }
    }
}
