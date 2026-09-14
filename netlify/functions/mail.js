exports.handler = async (event) => {
  const address = event.queryStringParameters.address;
  const username = address.split('@')[0];
  
  try {
    const res = await fetch(`https://api.catchmail.io/inboxes/${username}`);
    const data = await res.json();
    
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ messages: data.emails || [] })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
