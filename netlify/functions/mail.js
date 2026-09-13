exports.handler = async (event) => {
  const address = event.queryStringParameters.address;
  if(!address) {
    return { 
      statusCode: 400, 
      headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
      body: JSON.stringify({error: "No address provided"}) 
    };
  }

  try {
    // 1. Get list of messages
    const mailboxRes = await fetch(`https://api.catchmail.io/api/v1/mailbox?address=${address}`);
    const mailboxData = await mailboxRes.json();
    const messages = mailboxData.messages || [];

    // 2. Get full content for each message
    const fullMessages = [];
    for(let m of messages){
      const msgRes = await fetch(`https://api.catchmail.io/api/v1/message/${m.id}?mailbox=${address}`);
      const msgData = await msgRes.json();
      fullMessages.push({
        id: m.id,
        from: msgData.from,
        subject: msgData.subject,
        date: msgData.date,
        body: msgData.body.text || msgData.body.html || "No content"
      });
    }

    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
      body: JSON.stringify({messages: fullMessages})
    };

  } catch(e){
    return { 
      statusCode: 500,
      headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
      body: JSON.stringify({error: e.message}) 
    };
  }
};
