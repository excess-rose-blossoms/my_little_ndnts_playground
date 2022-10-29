const { WsTransport } = "@ndn/ws_transport";
const { Endpoint } = "@ndn/endpoint";
const { Interest } = "@ndn/packet";

async function main() {
  const uplink = await WsTransport.createFace({}, "ws://localhost:9696");

    // Construct an Endpoint on the default Forwarder instance.
  const endpoint = new Endpoint();

  console.log("here!");

  // We can now send Interests and retrieve Data.
  let seq = Math.trunc(Math.random() * 1e8);
  for (let i = 0; i < 3; ++i) {
    try {
      const interest = new Interest(`/ndn/edu/ucla/python-repo/decentar/test/client/mytestfile`);
      console.log(`<I ${interest.name}`);
      const data = await endpoint.consume(interest);
      console.log(`>D ${data.name}`);
    } catch (err) {
      console.warn(err);
    }
  }
  uplink.close();
  // // Enable the form after connection was successful.
  // document.querySelector("#app_button").disabled = false;
  // document.querySelector("#app_form").addEventListener("submit", ping);
}

window.addEventListener("load", main);