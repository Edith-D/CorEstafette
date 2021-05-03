using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WPFClient
{
    public enum MessageType
    {
        Publish,
        PublishResponse,
        Connect,
        ConnectResponse,
        Subscribe,
        SubscribeResponse,
        Unsubscribe,
        UnsubscribeResponse,
        Log,
        Error,
        Request,
        Response
    }
}
