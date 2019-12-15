
//serviceWorker registration
let swReg;

//Push Server URl
const serverURL = 'http://localhost:3333';


//Update UI for Subscribe status
const setSubscribedStatus = (state) =>{
  if(state){
    document.getElementById('subscribe').className = 'hidden';
    document.getElementById('unsubscribe').className = '';
  } else{
    document.getElementById('subscribe').className = '';
    document.getElementById('unsubscribe').className = 'hidden';
  }
}


//Register serviceWorker
navigator.serviceWorker.register('sw.js').then(registration => {

  //Reference registration globally
  swReg = registration;

  //Check if a subscription exists and if so, update the UI
  swReg.pushManager.getSubscription().then(setSubscribedStatus)

  //Log errors
}).catch(console.error);


//fetch('http://localhost:3333/subscribe',{method:'POST'}).then(res => res.text()).then(console.log);


//Get Public Key from server
const getApplicationServerKey = () => {

  //Fetch from server
  return fetch(`${serverURL}/key`)

  //parse response body as arrayBuffer
  .then( res => res.arrayBuffer())

  //Return arrayBuffer as new Uint8Array
  .then(key => new Uint8Array(key))
}


//Unsubscribe from push service
const unsubscribe = () => {

  //Unsubscribe & Update UI
  swReg.pushManager.getSubscription().then(subscription => {
    subscription.unsubscribe().then( () => {
      setSubscribedStatus(false)
    })
  })
}


// Subscribe for Push Notifications
const subscribe = () => {
  //console.log('Subscribing');



  //Check registration is available
  if( !swReg) return console.error('Service Worker Registration is not found');

  //Get ApplicationServerKey from push server
  getApplicationServerKey().then(applicationServerKey => {
    swReg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey})
    .then(res => res.toJSON())
    .then(subscription => {

      // console.log(subscription);
      //Pass subscription to server
      fetch(`${serverURL}/subscribe`, {method:'POST', body:JSON.stringify(subscription)})
      .then(setSubscribedStatus)
      .catch(unsubscribe)

      //catch subscription error
    }).catch(console.error)
  })

}
