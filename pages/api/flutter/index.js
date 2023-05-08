export default async function handler(req, res) {
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": process.env.MONGODB_DATA_API_KEY,
    },
  };
  const fetchBody = {
    dataSource: process.env.MONGODB_DATA_SOURCE,
    database: 'social_butterfly',
    collection: 'flutters',
  };
  const baseUrl = 'https://us-east-2.aws.data.mongodb-api.com/app/data-pmwca/endpoint/data/v1/action';
  try {
    switch (req.method) {
      case "GET":
        console.log("---***exec Get***---");
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
        console.log("---***exec Post***---");
        const flutter = req.body;
        const insertOneData = await fetch(`${baseUrl}/insertOne`,{
          ...fetchOptions,
          body:JSON.stringify({
            ...fetchBody,
            document:flutter,
          }),
        });
        const readDataInsertJson = await insertOneData.json();
        res.status(200).json(readDataInsertJson);
        break;
      case "PUT":
        console.log("---***exec Put***---");
        const updateOneData = await fetch(`${baseUrl}/updateOne`,{
          ...fetchOptions,
          body:JSON.stringify({
            ...fetchBody,
            filter: { _id: { $oid: req.body._id } },
            update:{
              $set:{
                body: req.body.body,
              },
            },
          }),
        });
        const updateDataInsertJson = await updateOneData.json();
        res.status(200).json(updateDataInsertJson);
        break;
      case "DELETE":
        console.log("---***exec Delete***---");
        const deleteOneData = await fetch(`${baseUrl}/deleteOne`,{
          ...fetchOptions,
          body:JSON.stringify({
            ...fetchBody,
            filter: { _id: { $oid: req.body._id } },
          }),
        });
        const deleteDataJson = await deleteOneData.json();
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
}
