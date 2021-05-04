using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Input;
using Prism.Commands;
using System.Threading.Tasks;
using SignalRCommunicator;
using Newtonsoft.Json;

namespace WPFClient
{
    [Serializable]
    public class CustomObject
    {
        [JsonProperty]
        public int X { get; set; }

        [JsonProperty]
        public int Y { get; set; }

        [JsonProperty]
        public string Value { get; set; }
    }
    class ClientModelView : INotifyPropertyChanged
    {
        private ICommunicator communicator = new Communicator();
        
        public ClientModelView() 
        {
            PublishMessage = new DelegateCommand( async () =>
            {
                await communicator.PublishAsync(Topic, Content);
            });

            SubscribeCommand = new DelegateCommand(async () =>
            {
                var response = await communicator.SubscribeAsync(SubscribeTopic, OnSubscribeAsync);
               
                if ( response == null )
                {
                    Messages = "Subscription failed." + Environment.NewLine + Messages;
                    OnPropertyChanged(nameof(Messages));
                    return;
                }
                Messages = response.Content + Environment.NewLine + Messages;
                OnPropertyChanged(nameof(Messages));

            });

            UnsubscribeCommand = new DelegateCommand(async () =>
            {
                var response = await communicator.UnsubscribeAsync(UnsubscribeTopic);
                if( response == null )
                {
                    Messages = "Unsubscription failed." + Environment.NewLine + Messages;
                    OnPropertyChanged(nameof(Messages));
                    return;
                }
                Messages = response.Content + Environment.NewLine + Messages;
                OnPropertyChanged(nameof(Messages));
            });

        }

        public event PropertyChangedEventHandler PropertyChanged;
        public string Topic { get; set; }
        public string Content { get; set; }
        public ICommand PublishMessage { get; set; }
        public ICommand SubscribeCommand { get; set; }
        public ICommand UnsubscribeCommand { get; set; }
        public string SubscribeTopic { get; set; }
        public string UnsubscribeTopic { get; set; }
        public string LogMessages { get; set; }
        public string Messages { get; set; }

        public Task OnSubscribeAsync(string response)
        {
            Messages = response + Environment.NewLine + Messages;
            OnPropertyChanged(nameof(Messages));

            return Task.CompletedTask;
        }
        protected void OnPropertyChanged([CallerMemberName] string name = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }

    }
}
