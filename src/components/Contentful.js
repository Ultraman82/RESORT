import { createClient } from "contentful";

export default createClient({
  space: process.env.SPACE,
  accessToken: process.env.ACCESS_TOKEN
});

//accessToken: "CFPAT-AStZ47OEWAtr3lu_Uk48QAZSGBgJ8qTGmxQAnd6ECCo"
