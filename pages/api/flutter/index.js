import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function handler(req, res) {
  const { accessToken } = await getAccessToken(req, res);
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      jwtTokenString: accessToken,
    },
  };
  const fetchBody = {
    dataSource: "Cluster0",
    database: "social_butterfly",
    collection: "flutters",
  };
  const baseUrl = 'https://us-east-2.aws.data.mongodb-api.com/app/data-pmwca/endpoint/data/v1/action';

  try {
    switch (req.method) {
      case "GET":
        console.log("****---Get---***");
        const readData = await fetch(`${baseUrl}/find`, {
          ...fetchOptions,
          body: JSON.stringify({
            ...fetchBody,
            sort: { postedAt: -1 },
          }),
        });
        const readDataJson = await readData.json();
        res.status(200).json(readDataJson.documents);
        break;
      case "POST":
        console.log("****---Post---***");
        const flutter = req.body;
        const insertData = await fetch(`${baseUrl}/insertOne`, {
          ...fetchOptions,
          body: JSON.stringify({
            ...fetchBody,
            document: flutter,
          }),
        });
        const insertDataJson = await insertData.json();
        console.log(insertDataJson);
        res.status(200).json(insertDataJson);
        break;
      case "PUT":
        console.log("****---PUT---***");
        const updateData = await fetch(`${baseUrl}/updateOne`, {
          ...fetchOptions,
          body: JSON.stringify({
            ...fetchBody,
            filter: { _id: { $oid: req.body._id } },
            update: {
              $set: {
                body: req.body.body,
              },
            },
          }),
        });
        const updateDataJson = await updateData.json();
        console.log(updateDataJson);
        res.status(200).json(updateDataJson);
        break;
      case "DELETE":
        console.log("****---DELETE---***");
        const deleteData = await fetch(`${baseUrl}/deleteOne`, {
          ...fetchOptions,
          body: JSON.stringify({
            ...fetchBody,
            filter: { _id: { $oid: req.body._id } },
          }),
        });
        const deleteDataJson = await deleteData.json();
        console.log(deleteDataJson);
        res.status(200).json(deleteDataJson);
        break;
      default:
        res.status(405).end();
        break;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});
