using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SignalRCommunicator
{
    public interface IRequest : IMessage
    {
        string Responder { get; }
    }
}
